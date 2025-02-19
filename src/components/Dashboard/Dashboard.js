import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import withApi from "../../Utils/ApiHelper";
import Loaderimg from "../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import StackedLineBarChart from "./StackedLineBarChart";
import DashboardOverallStatsPieChart from "./DashboardOverallStatsPieChart";
import { Row } from "react-bootstrap";
import DashboardStatsBox from "./DashboardStatsBox/DashboardStatsBox";
import NewDashboardFilterModal from "../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from "yup";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import ChartCard from "./ChartCard";
import { handleFilterData } from "../../Utils/commonFunctions/commonFunction";
import { fetchData } from "../../Redux/dataSlice";
import { useMyContext } from "../../Utils/MyContext";
import CardSwiper from "../../Utils/MobileCommonComponents/CardSwiper";
import { IonButton, IonIcon } from "@ionic/react";
import { funnelOutline, refresh } from "ionicons/icons";

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
  const dispatch = useDispatch();
  const { deviceType, deviceInfo, isMobile } = useMyContext();
  useEffect(() => {
    dispatch(fetchData());
  }, []);

  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
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
  }, [ReduxFullData, permissionsArray]);

  const handleApplyFilters = (values) => {
    if (!values?.start_date) {
      // If start_date does not exist, set it to the current date
      const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      values.start_date = currentDate;
      // Update the stored data with the new start_date
      localStorage.setItem(storedKeyName, JSON.stringify(values));
    }

    // only one permission check for first screen dashboard-view
    if (permissionsArray?.includes("dashboard-view")) {
      FetchFilterData(values);
    }
  };

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
      company_name,
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
        // handleError(error);
      }
    }
  };

  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setFilters(null);
    setDashboardData(null);
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
  }, [permissionsArray?.includes("dashboard-view")]);

  const handleShowLive = () => {
    setShowLiveData((prevState) => !prevState); // Toggle the state
    // setLiveMarginModal((prevState) => !prevState);
  };

  const handlelivemaringclosemodal = () => {
    setShowLiveData(false); // Toggle the state
  };
  const DashboardcardsData = (dashboardData) => [
    {
      id: 1,
      title: "Gross Volume",
      value: dashboardData?.gross_volume?.gross_volume || "0.0",
      subValue: dashboardData?.gross_volume?.bunkered_volume || "0.0",
      subTitle: "Bunkered Volume",
      percentage: dashboardData?.gross_volume?.percentage || "0%",
      status: dashboardData?.gross_volume?.status || "down",
      icon: "ℓ",
    },
    {
      id: 2,
      title: "Fuel Sales (Ex. Vat)",
      value: dashboardData?.fuel_sales?.gross_value || "0.0",
      subValue: dashboardData?.fuel_sales?.bunkered_value || "0.0",
      subTitle: "Bunkered Sales",
      percentage: dashboardData?.fuel_sales?.percentage || "0%",
      status: dashboardData?.fuel_sales?.status || "down",
      icon: "£",
    },
    {
      id: 3,
      title: "Gross Profit",
      value: dashboardData?.gross_profit?.gross_profit || "0.0",
      subValue: "",
      subTitle: "",
      percentage: dashboardData?.gross_profit?.percentage || "0%",
      status: dashboardData?.gross_profit?.status || "down",
      icon: "£",
    },
    {
      id: 4,
      title: "Gross Margin",
      value: `${dashboardData?.gross_margin?.gross_margin || "0"} ppl`,
      subValue: "",
      subTitle: "",
      percentage: dashboardData?.gross_margin?.percentage || "0%",
      status: dashboardData?.gross_margin?.status || "down",
    },
    {
      id: 5,
      title: "Shop Sales (Ex. Vat)",
      value: dashboardData?.shop_sales?.shop_sales || "0%",
      subValue: dashboardData?.shop_sales?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: dashboardData?.shop_sales?.percentage || "0%",
      status: dashboardData?.shop_sales?.status || "down",
      icon: "£",
    },
    {
      id: 6,
      title: "Shop Fee",
      value: dashboardData?.shop_fees?.shop_fee || "0%",
      subValue: dashboardData?.shop_fees?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: dashboardData?.shop_fees?.percentage || "0%",
      status: dashboardData?.shop_fees?.status || "down",
      icon: "£",
    },
    {
      id: 7,
      title: "Shop Profit",
      value: dashboardData?.shop_profit?.shop_profit || "0%",
      subValue: dashboardData?.shop_profit?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: dashboardData?.shop_profit?.percentage || "0%",
      status: dashboardData?.shop_profit?.status || "down",
      icon: "£",
    },
  ];

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

      {!ReduxFullData?.role == "Client" && !ReduxFullData?.sms_balance < 3 ? (
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

      {/* Showing error message for gross margin */}
      {dashboardData?.gross_margin?.is_ppl == 1 && (
        <>
          <div className="balance-alert head-alert-show">
            <div>{dashboardData?.gross_margin?.ppl_msg}</div>
          </div>
        </>
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
        {isMobile && (
          <>
            {/* Filter Button */}
            <div className="spaceBetween">
              <IonButton
                onClick={handleToggleSidebar1}
                type="danger"
                size="small"
                className="mob-custom-primary-btn"
                style={{ marginRight: "8px" }}
              >
                <IonIcon icon={funnelOutline} />
              </IonButton>
              {(filters?.client_id ||
                filters?.company_id ||
                filters?.site_id ||
                filters?.start_date) &&
                isMobile && (
                  <IonButton
                    className="mob-custom-danger-btn"
                    size="small"
                    onClick={handleResetFilters}
                  >
                    <IonIcon icon={refresh} />
                  </IonButton>
                )}
            </div>
          </>
        )}
      </div>

      {!ReduxFullData?.role == "Client" && !ReduxFullData?.sms_balance < 3 ? (
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
      {/* <IonButton color="danger" size="small" expand="full" onClick={handleShowLive}>
        Click Me
      </IonButton>
      <IonButton
        style={{ backgroundColor: "red", color: "white" }}
        size="small"
        expand="full"
        onClick={handleShowLive}
      >
        Click Me
      </IonButton> */}
      {/* 
      {isMobile ? (
        <div>
          <h1>Device Information</h1>
          <ul>
            <li>
              <strong>Model:</strong> {deviceInfo?.model}
            </li>
            <li>
              <strong>Platform:</strong> {deviceInfo?.platform}
            </li>
            <li>
              <strong>Operating System:</strong> {deviceInfo?.operatingSystem}
            </li>
            <li>
              <strong>OS Version:</strong> {deviceInfo?.osVersion}
            </li>
            <li>
              <strong>Manufacturer:</strong> {deviceInfo?.manufacturer}
            </li>
            <li>
              <strong>Is Virtual:</strong>{" "}
              {deviceInfo?.isVirtual ? "Yes" : "No"}
            </li>
          </ul>
        </div>
      ) : (
        <p>{deviceInfo?.operatingSystem}</p>
      )} */}

      <div className="mb-2 ">
        {filters?.client_id && filters.company_id && (
          <>
            {isMobile ? (
              <IonButton
                className="mob-custom-danger-btn"
                size="small"
                expand="full"
                onClick={handleShowLive}
              >
                <p className="m-0">
                  <img
                    src={require("../../assets/images/commonimages/LiveIMg.gif")}
                    alt="Live Img"
                    className="Liveimage"
                  />{" "}
                  Margins
                </p>
              </IonButton>
            ) : (
              <div className="text-end ">
                <button
                  className=" mb-2 btn btn-primary"
                  onClick={handleShowLive}
                >
                  Live Margin
                </button>
              </div>
            )}

            {ShowLiveData && (
              <DashboardStatCard
                isLoading={isLoading}
                getData={getData}
                parentFilters={filters}
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

        {isMobile ? (
          <CardSwiper
            dashboardData={dashboardData}
            navigattionPath="/dashboard-details"
            callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
            cardsData={DashboardcardsData(dashboardData)} // ✅ Call the function
          />
        ) : (
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
        )}

        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <ChartCard
            title="Total Sales"
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
            title="Overall Sales"
            chartType="stats"
            chartData={dashboardData?.pi_graph}
            noChartImage="../../assets/images/no-chart-img.png"
            noChartMessage="Please Apply Filter To Visualize Chart....."
          >
            <DashboardOverallStatsPieChart data={dashboardData?.pi_graph} />
          </ChartCard>
        </Row>
        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <ChartCard
            title="Total Day Wise Sales"
            chartType="full"
            chartData={dashboardData?.d_line_graph}
            noChartImage="../../assets/images/no-chart-img.png"
            noChartMessage="No data available"
          >
            <DashboardMultiLineChart
              LinechartValues={dashboardData?.d_line_graph?.series || []}
              LinechartOption={
                dashboardData?.d_line_graph?.option?.labels || []
              }
            />
          </ChartCard>
        </Row>

        {/* {dashboardData ? <CeoDashBoard dashboardData={dashboardData} /> : ""} */}
      </div>
    </>
  );
};

export default withApi(Dashboard);
