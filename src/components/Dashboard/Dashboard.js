import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import withApi from "../../Utils/ApiHelper";
import Loaderimg from "../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import { useMyContext } from "../../Utils/MyContext";
import StackedLineBarChart from "./StackedLineBarChart";
import DashboardOverallStatsPieChart from "./DashboardOverallStatsPieChart";
import { Row } from "react-bootstrap";
import { handleError, SuccessAlert } from "../../Utils/ToastUtils";
import DashboardStatsBox from "./DashboardStatsBox/DashboardStatsBox";
import { initialState, reducer } from "../../Utils/CustomReducer";
import NewDashboardFilterModal from "../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from "yup";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import ChartCard from "./ChartCard";




const Dashboard = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [ClientID, setClientID] = useState();
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);
  const [dashboardData, setDashboardData] = useState();
  const [filters, setFilters] = useState({
    client_id: "",
    company_id: "",
    site_id: "",
  });
  const { pie_chart_values } = reducerState;
  const {
    searchdata,
    shouldNavigateToDetailsPage,
    setShouldNavigateToDetailsPage,
  } = useMyContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedInFlag = localStorage.getItem("justLoggedIn");
  const tokenUpdated = localStorage.getItem("tokenupdate") === "true";
  const Client_login = localStorage.getItem("Client_login") === "true";
  const dispatch = useDispatch();
  const [permissionsArray, setPermissionsArray] = useState([]);
  const UserPermissions = useSelector((state) => state?.data?.data);
  const ReduxPermissions = useSelector((state) => state?.data?.data);
  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);
  const [ShowLiveData, setShowLiveData] = useState(false);
  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );



  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
  });
  useEffect(() => {
    setClientID(localStorage.getItem("superiorId"));
    if (tokenUpdated) {
      window.location.reload();
      localStorage.setItem("tokenupdate", "false"); // Update the value to string "false"
      // Handle token update logic without page reload
    }
    if (loggedInFlag) {
      setJustLoggedIn(true);
      localStorage.removeItem("justLoggedIn"); // clear the flag
    }

    if (justLoggedIn) {
      SuccessAlert("Login Successfully");
      setJustLoggedIn(false);
    }
  }, [ClientID, dispatch, justLoggedIn, token]);

  useEffect(() => {
    if (Client_login) {
      if (tokenUpdated) {
        window.location.reload();
        localStorage.setItem("Client_login", "false"); // Update the value to string "false"
        // Handle token update logic without page reload
      }
    }
    //  console.clear();
  }, [Client_login]);

  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };


  useEffect(() => {
    localStorage.setItem(
      "Dashboardsitestats",
      permissionsArray?.includes("dashboard-site-stats")
    );
    if (UserPermissions?.company_id) {
      localStorage.setItem("PresetCompanyID", UserPermissions?.company_id);
      localStorage.setItem("PresetCompanyName", UserPermissions?.company_name);
    } else {
      localStorage.removeItem("PresetCompanyID");
    }
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
    navigate(UserPermissions?.route);
    //  console.clear();
  }, [UserPermissions, permissionsArray]);




  const handleApplyFilters = (values) => {

    if (!values?.start_date) {
      // If start_date does not exist, set it to the current date
      const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      values.start_date = currentDate;

      // Update the stored data with the new start_date
      localStorage.setItem(storedKeyName, JSON.stringify(values));
    }

    FetchFilterData(values);
  };

  const FetchFilterData = async (filters) => {
    let { client_id, company_id, site_id, client_name, company_name } = filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = ReduxPermissions?.superiorId;
      client_name = ReduxPermissions?.full_name;
    }

    if (ReduxPermissions?.company_id) {
      company_id = ReduxPermissions?.company_id;
      company_name = ReduxPermissions?.company_name;
    }

    const updatedFilters = {
      ...filters,
      client_id,
      client_name,
      company_id,
      company_name
    };


    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append("client_id", client_id);
        if (company_id) queryParams.append("company_id", company_id);
        if (site_id) queryParams.append("site_id", site_id);

        const queryString = queryParams.toString();
        const response = await getData(`dashboard/stats?${queryString}`);
        if (response && response.data && response.data.data) {
          setDashboardData(response?.data?.data);

          setFilters(updatedFilters);
          setCenterFilterModalOpen(false);
          setShouldNavigateToDetailsPage(true);
          const { data } = response;

          if (data) {
            reducerDispatch({
              type: "UPDATE_DATA",
              payload: {
                d_line_chart_values: data?.data?.d_line_graph?.series,
                d_line_chart_option: data?.data?.d_line_graph?.option?.labels,
                stacked_line_bar_data: data?.data?.line_graph?.datasets,
                stacked_line_bar_label: data?.data?.line_graph?.labels,
                pie_chart_values: data?.data?.pi_graph,
                gross_margin_value: data?.data?.gross_margin,
                gross_volume: data?.data?.gross_volume,
                gross_profit_value: data?.data?.gross_profit,
                fuel_value: data?.data?.fuel_sales,
                shop_sale: data?.data?.shop_sales,
                shop_fees: data?.data?.shop_fees,
                shop_margin: data?.data?.shop_profit,
                dashboard_dates: data?.data?.dateString,
              },
            });
          }
        }
        // setData(response.data);
      } catch (error) {
        handleError(error);
      } finally {
      }
    }
  };

  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setFilters(null);
    setDashboardData(null);
    reducerDispatch({
      type: "RESET_STATE",
    });
  };


  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        parsedData.start_date = currentDate;

        // Update the stored data with the new start_date
        localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        handleApplyFilters(parsedData)
      } else {
        handleApplyFilters(parsedData)
      }

      // Call the API with the updated or original data
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
          start_date: new Date().toISOString().split('T')[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName, dispatch]); // Add any other dependencies needed here


  const handleShowLive = () => {
    setShowLiveData((prevState) => !prevState); // Toggle the state
  };



  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      {centerFilterModalOpen && (
        <div className="">
          <NewDashboardFilterModal
            isOpen={centerFilterModalOpen}
            onClose={() => setCenterFilterModalOpen(false)}
            getData={getData}
            isLoading={isLoading}
            isStatic={true}
            onApplyFilters={handleApplyFilters}
            validationSchema={validationSchemaForCustomInput}
            storedKeyName={storedKeyName}
            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
            showStationValidation={false}
            showMonthInput={false}
            showDateInput={false}
          />
        </div>
      )}

      {!UserPermissions?.role == "Client" &&
        !UserPermissions?.sms_balance < 3 ? (
        <div
          className="balance-alert"
          style={{
            textAlign: "left",
            margin: " 10px 0",
            fontSize: "16px",
            color: "white",
            background: "#b52d2d",
            padding: "8px",
            borderRadius: "7px",
          }}
        >
          <div>
            Your SMS balance seems low, please buy more SMS to send
            notifications
          </div>
          <div className="balance-badge">
            <span>Sms Balance : </span>
            <span style={{ marginLeft: "6px" }}>
              {" "}
              {UserPermissions?.sms_balance}{" "}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
        {!ShowLiveData && (
          <div className="">
            <h2 className="page-title dashboard-page-title">
              Dashboard (
              {dashboardData?.dateString
                ? dashboardData?.dateString
                : UserPermissions?.dates}
              )
            </h2>
          </div>
        )}
        <div></div>


        <FiltersComponent
          filters={filters}
          handleToggleSidebar1={handleToggleSidebar1}
          handleResetFilters={handleResetFilters}
        />
      </div>

      {!UserPermissions?.role == "Client" &&
        !UserPermissions?.sms_balance < 3 ? (
        <div
          className="balance-alert"
          style={{
            textAlign: "left",
            margin: " 10px 0",
            fontSize: "16px",
            color: "white",
            background: "#b52d2d",
            padding: "8px",
            borderRadius: "7px",
          }}
        >
          <div>
            Your SMS balance seems low, please buy more SMS to send
            notifications
          </div>
          <div className="balance-badge">
            <span>Sms Balance : </span>
            <span style={{ marginLeft: "6px" }}>
              {" "}
              {UserPermissions?.sms_balance}{" "}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="mb-2 ">
        <div className="text-end " >
          <button className=" mb-2 btn btn-primary" onClick={handleShowLive}>
            Live Margin
            {/* {ShowLiveData ? " Live Data" : " Live Data"} */}
          </button>
        </div>

        {ShowLiveData && (
          <DashboardStatCard
            isLoading={isLoading}
            getData={getData}
            filters={filters}
            title="Total Sales"
            value="2323"
            percentageChange="3%"
            iconClass="icon icon-rocket text-white mb-5"
            iconBgColor="bg-danger-gradient"
            trendColor="text-primary"
          />
        )}
        {ShowLiveData && (
          <h2 className=" d-flex justify-content-start mb-4  page-title dashboard-page-title">
            Dashboard (
            {dashboardData?.dateString
              ? dashboardData?.dateString
              : UserPermissions?.dates}
            )
          </h2>
        )}
        <DashboardStatsBox
          GrossVolume={dashboardData?.gross_volume}
          shopmargin={dashboardData?.shop_profit}
          GrossProfitValue={dashboardData?.gross_profit}
          GrossMarginValue={dashboardData?.gross_margin}
          FuelValue={dashboardData?.fuel_sales}
          shopsale={dashboardData?.shop_sales}
          shop_fees={dashboardData?.shop_fees}
          searchdata={searchdata}
          shouldNavigateToDetailsPage={shouldNavigateToDetailsPage}
          setShouldNavigateToDetailsPage={setShouldNavigateToDetailsPage}
          dashboardData={dashboardData}
        />
        <Row style={{ marginBottom: '10px', marginTop: '20px' }}>
          <ChartCard
            title="Total Transactions"
            chartType="default"
            chartData={dashboardData?.line_graph}
            noChartImage="../../assets/images/no-chart-img.png"
            noChartMessage="Please Apply Filter To Visualize Chart....."
          >
            <StackedLineBarChart
              stackedLineBarData={dashboardData?.line_graph?.datasets || []}
              stackedLineBarLabels={dashboardData?.line_graph?.labels || []}
            />
          </ChartCard>

          <ChartCard
            title="Overall Stats"
            chartType="stats"
            chartData={dashboardData?.pi_graph}
            noChartImage="../../assets/images/no-chart-img.png"
            noChartMessage="Please Apply Filter To Visualize Chart....."
          >
            <DashboardOverallStatsPieChart data={dashboardData?.pi_graph} />
          </ChartCard>
        </Row>
        <Row style={{ marginBottom: '10px', marginTop: '20px' }}>
          <ChartCard
            title="Total Transactions"
            chartType="full"
            chartData={dashboardData?.d_line_graph}
            noChartImage="../../assets/images/no-chart-img.png"
            noChartMessage="No data available"
          >
            <DashboardMultiLineChart
              LinechartValues={dashboardData?.d_line_graph?.series || []}
              LinechartOption={dashboardData?.d_line_graph?.option?.labels || []}
            />
          </ChartCard>
        </Row>

      </div>
    </>
  );
};

export default withApi(Dashboard);
