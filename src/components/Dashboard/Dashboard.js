
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import withApi from "../../Utils/ApiHelper";
import Loaderimg from "../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import StackedLineBarChart from "./StackedLineBarChart";
import DashboardOverallStatsPieChart from "./DashboardOverallStatsPieChart";
import { Row } from "react-bootstrap";
import { handleError } from "../../Utils/ToastUtils";
import DashboardStatsBox from "./DashboardStatsBox/DashboardStatsBox";
import NewDashboardFilterModal from "../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from "yup";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import ChartCard from "./ChartCard";
import { handleFilterData } from "../../Utils/commonFunctions/commonFunction";
import { fetchData } from "../../Redux/dataSlice";

const Dashboard = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState();
  const [filters, setFilters] = useState({
    client_id: "",
    company_id: "",
    site_id: "",
  });
  const navigate = useNavigate();
  const [permissionsArray, setPermissionsArray] = useState([]);
  const ReduxFullData = useSelector((state) => state?.data?.data);
  let storedKeyName = "localFilterModalData";
  const [ShowLiveData, setShowLiveData] = useState(false);
  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchData())
  }, [])

  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
  });


  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };


  useEffect(() => {
    localStorage.setItem(
      "Dashboardsitestats",
      permissionsArray?.includes("dashboard-site-stats")
    );
    if (ReduxFullData?.company_id) {
      localStorage.setItem("PresetCompanyID", ReduxFullData?.company_id);
      localStorage.setItem("PresetCompanyName", ReduxFullData?.company_name);
    } else {
      localStorage.removeItem("PresetCompanyID");
    }
    if (ReduxFullData) {
      setPermissionsArray(ReduxFullData?.permissions);
    }
    navigate(ReduxFullData?.route);
    console.clear();
  }, [ReduxFullData, permissionsArray]);




  const handleApplyFilters = ((values) => {
    if (!values?.start_date) {
      // If start_date does not exist, set it to the current date
      const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      values.start_date = currentDate;
      // Update the stored data with the new start_date
      localStorage.setItem(storedKeyName, JSON.stringify(values));
    }
    FetchFilterData(values);
  });

  const FetchFilterData = async (filters) => {
    let { client_id, company_id, site_id, client_name, company_name } = filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = ReduxFullData?.superiorId;
      client_name = ReduxFullData?.full_name;
    }

    if (ReduxFullData?.company_id && !company_id) {
      company_id = ReduxFullData?.company_id;
      company_name = ReduxFullData?.company_name;
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
        }
        localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setFilters(null);
    setDashboardData(null);
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
  }, []);

  const handleShowLive = () => {
    setShowLiveData((prevState) => !prevState); // Toggle the state
    // setLiveMarginModal((prevState) => !prevState);
  };


  const handlelivemaringclosemodal = () => {
    setShowLiveData(false); // Toggle the state
    handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
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

      {!ReduxFullData?.role == "Client" &&
        !ReduxFullData?.sms_balance < 3 ? (
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
              {ReduxFullData?.sms_balance}{" "}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
        {!ShowLiveData && (
          <div className="">
            <h2 className="page-title dashboard-page-title mb-2 mb-sm-0">
              Dashboard (
              {dashboardData?.dateString
                ? dashboardData?.dateString
                : ReduxFullData?.dates}
              )
            </h2>
          </div>
        )}
        <div></div>


        <FiltersComponent
          filters={filters}
          handleToggleSidebar1={handleToggleSidebar1}
          handleResetFilters={handleResetFilters}
          showResetBtn={true}
        />
      </div>

      {!ReduxFullData?.role == "Client" &&
        !ReduxFullData?.sms_balance < 3 ? (
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
              {ReduxFullData?.sms_balance}{" "}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}



      <div className="mb-2 ">


        {filters?.site_id && filters?.client_id && filters.company_id && (<>
          <div className="text-end " >
            <button className=" mb-2 btn btn-primary" onClick={handleShowLive}>
              {/* <img
                src={require("../../assets/images/commonimages/red-dot.gif")}
                alt="Live Img"
                className="Liveimage"
              />{" "}{" "} */}
              Live Margin
            </button>
          </div>


          {ShowLiveData && (
            <DashboardStatCard
              isLoading={isLoading}
              getData={getData}
              filters={filters}
              setFilters={setFilters}
              isOpen={ShowLiveData}
              // onClose={() => setShowLiveData(false)}
              onClose={() => handlelivemaringclosemodal()}
              title="Total Sales"
              value="2323"
              percentageChange="3%"
              iconClass="icon icon-rocket text-white mb-5"
              iconBgColor="bg-danger-gradient"
              trendColor="text-primary"
            />
          )}
        </>
        )}


        {ShowLiveData && (
          <h2 className=" d-flex justify-content-start mb-4  page-title dashboard-page-title">
            Dashboard (
            {dashboardData?.dateString
              ? dashboardData?.dateString
              : ReduxFullData?.dates}
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
          dashboardData={dashboardData}
          callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
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
