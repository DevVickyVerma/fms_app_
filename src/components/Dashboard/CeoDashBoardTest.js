import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import {
  handleFilterData,
  PriceLogsFilterValue,
} from "../../Utils/commonFunctions/commonFunction";
import { Card, Col, Row } from "react-bootstrap";
import UpercardsCeoDashboardStatsBox from "./DashboardStatsBox/UpercardsCeoDashboardStatsBox";
import CeoDashboardFilterModal from "../pages/Filtermodal/CeoDashboardFilterModal";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import useErrorHandler from "../CommonComponent/useErrorHandler";
import LoaderImg from "../../Utils/Loader";
import * as Yup from "yup";
import Swal from "sweetalert2";
import CeoDashBoardBottomPage from "./CeoDashBoardBottomPage";
import SmallLoader from "../../Utils/SmallLoader";
import PriceLogTable from "./PriceLogTable";
import LoadingAnimationCard from "../../Utils/LoadingAnimationCard";
import LinesDotGraphchart from "./LinesDotGraphchart";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import PracticeJavaScript from "./PracticeJavaScript";
import { useMyContext } from "../../Utils/MyContext";
import { IonButton, IonIcon } from "@ionic/react";
import { funnelOutline, refresh } from "ionicons/icons";
import CardSwiper from "../../Utils/MobileCommonComponents/CardSwiper";

const CeoDashBoardTest = (props) => {
  const navigate = useNavigate();
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);

  const { deviceType, deviceInfo, isMobile } = useMyContext();
  const [statsLoading, setStatsLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState();
  const [filters, setFilters] = useState({
    client_id: "",
    company_id: "",
    site_id: "",
  });
  const [permissionsArray, setPermissionsArray] = useState([]);
  const ReduxFullData = useSelector((state) => state?.data?.data);
  let storedKeyName = "localFilterModalData";
  const [ShowLiveData, setShowLiveData] = useState(false);
  const [PriceLogsloading, setPriceLogssloading] = useState(false);
  const [PriceGraphloading, setPriceGraphloading] = useState(false);
  const [PriceLogs, setPriceLogs] = useState();
  const [PriceGraphData, setPriceGraphData] = useState();
  const [applyNavigate, setApplyNavigate] = useState(false);
  const [PriceLogsvalue, setPriceLogsvalue] = useState(
    PriceLogsFilterValue[0]?.value
  ); // state for selected site

  const handlePriceLogsChange = (value) => {
    setPriceLogsvalue(value);
  };

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const priceLogsPermission = userPermissions?.includes(
    "ceodashboard-price-logs"
  );
  const priceGraphPermission = userPermissions?.includes(
    "ceodashboard-price-graph"
  );

  const priceLogAndGraphPermission =
    priceLogsPermission && priceGraphPermission;
  const { handleError } = useErrorHandler();

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      selectedSite: "",
      selectedSiteDetails: "",
      selectedMonth: "",
      selectedMonthDetails: "",
    },
    onSubmit: (values) => {
      // console.log(values);
    },
  });

  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };

  useEffect(() => {
    localStorage.setItem(
      "Dashboardsitestats",
      permissionsArray?.includes("ceodashboard-site-stats")
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
    // navigate(ReduxFullData?.route);
    // ;
  }, [ReduxFullData, permissionsArray]);

  var [isClientRole] = useState(
    localStorage.getItem("superiorRole") == "Client"
  );

  const getCeoDashBoardFilterValidation = () =>
    Yup.object({
      client_id: Yup.string().required("Client is required"),
      company_id: Yup.string().required("Company is required"),
    });

  const handleApplyFilters = async (values) => {
    formik.setFieldValue("client_id", values.client_id);
    formik.setFieldValue("company_id", values.company_id);
    try {
      // Check if 'Sites' is missing and user has client role
      if (!values?.sites && isClientRole) {
        const response = await getData(
          `common/site-list?company_id=${values?.company_id}`
        );
        values.sites = response?.data?.data || [];
      }
      if (!values?.start_date) {
        const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        values.start_date = currentDate;
      }

      // Store the updated values in localStorage
      localStorage.setItem(storedKeyName, JSON.stringify(values));

      // Fetch dashboard stats if the user has the required permission
      if (permissionsArray?.includes("ceodashboard-view")) {
        // console.log(storedKeyName, "storedKeyName");
        FetchDashboardStats(values);
      }
    } catch (error) {
      handleError(error); // Handle errors from API or other logic
    }
  };

  const FetchDashboardStats = async (filters) => {
    const endpoints = [
      {
        name: "dashboard",
        url: "ceo-dashboard/stats",
        setData: setDashboardData,
        setLoading: setStatsLoading,
        callback: (response, updatedFilters) => {
          setFilters(updatedFilters);
          setCenterFilterModalOpen(false);
        },
      },
    ];

    // Split the endpoints into two halves
    const firstHalf = endpoints.slice(0, Math.ceil(endpoints.length / 3));
    const secondHalf = endpoints.slice(Math.ceil(endpoints.length / 3));

    const fetchEndpointData = ({ url, setData, setLoading, callback }) => {
      return fetchData(filters, url, setData, setLoading, callback);
    };

    try {
      // Execute all requests for the first half concurrently
      await Promise.all(firstHalf.map(fetchEndpointData));

      // Once the first half is completed, execute all requests for the second half
      await Promise.all(secondHalf.map(fetchEndpointData));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const updateFilters = (filters) => {
    let { client_id, company_id, site_id, client_name, company_name, sites } =
      filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = ReduxFullData?.superiorId;
      client_name = ReduxFullData?.full_name;
    }

    if (ReduxFullData?.company_id && !company_id) {
      company_id = ReduxFullData?.company_id;
      company_name = ReduxFullData?.company_name;
    }

    return { ...filters, client_id, client_name, company_id, company_name };
  };

  const fetchData = async (
    filters,
    endpoint,
    setData,
    setLoading,
    callback
  ) => {
    const updatedFilters = updateFilters(filters);
    const { client_id, company_id, site_id } = updatedFilters;

    if (
      !formik?.values?.selectedMonth &&
      !formik?.values?.selectedMonthDetails &&
      updatedFilters?.reportmonths
    ) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentMonthFormatted = `${currentYear}${currentMonth
        .toString()
        .padStart(2, "0")}`;
      const currentMonthObject = updatedFilters?.reportmonths.find(
        (item) => item.values === currentMonthFormatted
      );
      if (currentMonthObject) {
        formik.setFieldValue("selectedMonth", currentMonthObject.display);
        formik.setFieldValue("selectedMonthDetails", currentMonthObject);
      }
    }

    if (
      updatedFilters?.company_id &&
      updatedFilters?.sites &&
      !updatedFilters?.site_id
    ) {
      const firstSiteDetails = updatedFilters?.sites?.[0];
      if (firstSiteDetails) {
        formik.setFieldValue("selectedSite", firstSiteDetails?.id);
        formik.setFieldValue("selectedSiteDetails", firstSiteDetails);
      }
    } else if (updatedFilters?.sites && updatedFilters?.site_id) {
      const selectedItem = filters?.sites.find(
        (item) => item.id == updatedFilters?.site_id
      );
      formik.setFieldValue("selectedSite", updatedFilters?.site_id);
      formik.setFieldValue("selectedSiteDetails", selectedItem);
    }
    if (client_id) {
      try {
        if (setLoading) setLoading(true);
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append("client_id", client_id);
        if (company_id) queryParams.append("company_id", company_id);
        if (site_id) queryParams.append("site_id", site_id);

        if (client_id && company_id) {
          setApplyNavigate(true);
        } else {
          setApplyNavigate(false);
        }
        const queryString = queryParams.toString();
        const response = await getData(`${endpoint}?${queryString}`);
        setFilters(updatedFilters);
        setCenterFilterModalOpen(false);
        if (response && response.data && response.data.data) {
          setData(response.data.data);
          if (callback) callback(response, updatedFilters);
          localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
        }
      } catch (error) {
        // handleError(error);
      } finally {
        if (setLoading) setLoading(false);
      }
    }
  };

  const FetchPriceLogs = async (PriceLogsvalue) => {
    try {
      setPriceLogssloading(true);
      const queryParams = new URLSearchParams();
      if (filters?.site_id) queryParams.append("site_id", filters?.site_id);
      const currentDate = new Date();
      const day = "01";
      const formattedDate = `${String(day)}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${currentDate.getFullYear()}`;
      queryParams.append("client_id", filters?.client_id);
      queryParams.append("company_id", filters?.company_id);

      queryParams.append("drs_date", formattedDate);
      queryParams.append("f_type", PriceLogsvalue);

      const queryString = queryParams.toString();
      const response = await getData(
        `ceo-dashboard/selling-price?${queryString}`
      );
      if (response && response.data && response.data.data) {
        setPriceLogs(response?.data?.data);
      }
    } catch (error) {
      // handleError(error);
    } finally {
      setPriceLogssloading(false);
    }
  };
  const FetchPriceGraph = async () => {
    try {
      setPriceGraphloading(true);
      const queryParams = new URLSearchParams();
      if (formik?.values?.selectedSite)
        queryParams.append("site_id", formik?.values?.selectedSite);
      const currentDate = new Date();
      const day = "01";
      const formattedDate = `${String(day)}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${currentDate.getFullYear()}`;

      queryParams.append("drs_date", formattedDate);

      const queryString = queryParams.toString();
      const response = await getData(
        `ceo-dashboard/price-graph-stats?${queryString}`
      );
      if (response && response.data && response.data.data) {
        setPriceGraphData(response?.data?.data);
      }
    } catch (error) {
      // handleError(error);
    } finally {
      setPriceGraphloading(false);
    }
  };
  const FetchSiteGraph = async () => {
    try {
      setPriceGraphloading(true);
      const queryParams = new URLSearchParams();

      queryParams.append("client_id", formik.values?.client_id);
      queryParams.append("company_id", formik.values?.company_id);

      const queryString = queryParams.toString();
      const response = await getData(`titan-dashboard-graph?${queryString}`);
      if (response && response.data && response.data.data) {
      }
    } catch (error) {
      // handleError(error);
    } finally {
      setPriceGraphloading(false);
    }
  };

  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);

    setFilters(null);
    setDashboardData(null);
    setPriceLogs(null);
    setApplyNavigate(false);
    formik.resetForm();
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
  }, [permissionsArray?.includes("ceodashboard-view")]);

  const handlelivemaringclosemodal = () => {
    setShowLiveData(false); // Toggle the state
  };
  const [pdfisLoading, setpdfisLoading] = useState(false);

  useEffect(() => {
    if (formik?.values?.selectedSite && priceLogsPermission) {
      FetchPriceGraph();
    }
  }, [formik?.values?.selectedSite, priceLogsPermission]);

  useEffect(() => {
    if (priceLogsPermission && filters?.client_id && filters?.company_id) {
      FetchPriceLogs(PriceLogsvalue);
    }
  }, [priceLogsPermission, filters, PriceLogsvalue]);

  const handleSiteChange = async (selectedId) => {
    const handleConfirmedAction = async (selectedId) => {
      try {
        const selectedItem = await filters?.sites.find(
          (item) => item.id === selectedId
        );
        filters.site_id = selectedId;
        filters.site_name = selectedItem?.site_name;

        handleApplyFilters(filters);
      } catch (error) {
        console.error("Error in handleConfirmedAction:", error);
      }
    };

    const handleCancelledAction = async (selectedId) => {
      try {
        const selectedItem = await filters?.sites.find(
          (item) => item.id === selectedId
        );

        await formik.setFieldValue("selectedSite", selectedId);
        await formik.setFieldValue("selectedSiteDetails", selectedItem);
      } catch (error) {
        console.error("Error in handleCancelledAction:", error);
      }
    };

    Swal.fire({
      title: "",
      text: "Apply this change on   whole dashboard or  below statistics only?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Apply to All",
      cancelButtonText: "Apply to This Only",
      showDenyButton: true, // Enable the third button
      denyButtonText: "Cancel", // Label for the third button
      customClass: {
        actions: "swal2-actions-custom", // Add a custom class to the action buttons
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleConfirmedAction(selectedId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        await handleCancelledAction(selectedId);
      } else if (result.isDenied) {
        // Logic for the deny button (third button)
        Swal.close();
      }
    });
  };
  const openCenterFilterModal = () => {
    if (!filters?.company_id) {
      setCenterFilterModalOpen(true);
    }
  };

  const handleNavigateViewAllClick = (item) => {
    // handling state manage here
    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
      let updatedStoredData = JSON.parse(storedData);

      updatedStoredData.site_id = formik?.values?.selectedSiteDetails?.id; // Update the site_id here
      updatedStoredData.site_name =
        formik?.values?.selectedSiteDetails?.site_name; // Update the site_id here

      localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));

      navigate(`/pricegraph-view/`);
    }
  };
  const DashboardcardsData = (dashboardData) => [
    {
      id: 1,
      title: "Gross Volume",
      value: dashboardData?.gross_volume?.gross_volume || "0.0",
      subValue: dashboardData?.gross_volume?.bunkered_volume || "0.0",
      subTitle: "Bunkered Volume",
      percentage: `${dashboardData?.gross_volume?.percentage || "0%"} `,
      status: dashboardData?.gross_volume?.status || "down",
      icon: "ℓ",
    },
    {
      id: 2,
      title: "Fuel Sales (Ex. Vat)",
      value: dashboardData?.fuel_sales?.gross_value || "0.0",
      subValue: dashboardData?.fuel_sales?.bunkered_value || "0.0",
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.fuel_sales?.percentage || "0%"} `,
      status: dashboardData?.fuel_sales?.status || "down",
      icon: "£",
    },
    {
      id: 3,
      title: "Gross Margin (Fuel)",
      value: dashboardData?.gross_margin?.gross_margin || "0.0",
      subValue: dashboardData?.gross_profit?.gross_profit || "0.0",
      subTitle: "Gross Profit",
      percentage: `${dashboardData?.gross_profit?.percentage || "0%"} `,
      status: dashboardData?.gross_margin?.status || "down",
      icon: "£",
      subicon: "ppl",
    },
    {
      id: 4,
      title: "Gross (Bunkered)",
      value: `${dashboardData?.gross_margin_bunkered?.gross_margin_bunkered || "0"} ppl`,
      subValue: "",
      subTitle: "",
      percentage: `${dashboardData?.gross_margin_bunkered?.percentage || "0%"} `,
      status: dashboardData?.gross_margin_bunkered?.status || "down",
      icon: "£",
    },
    {
      id: 5,
      title: "Shop Sales (Ex. Vat)",
      value: dashboardData?.shop_sales?.shop_sales || "0%",
      subValue: dashboardData?.shop_sales?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.shop_sales?.percentage || "0%"} `,
      status: dashboardData?.shop_sales?.status || "down",
      icon: "£",
    },
    {
      id: 6,
      title: "Shop Profit",
      value: dashboardData?.shop_profit?.shop_profit || "0%",
      subValue: dashboardData?.shop_profit?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.shop_profit?.percentage || "0%"} `,
      status: dashboardData?.shop_profit?.status || "down",
      icon: "£",
    },
    {
      id: 7,
      title: "Shop  Margin",
      value: dashboardData?.valet_sales?.valet_sales || "0%",
      subValue: dashboardData?.valet_sales?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.valet_sales?.percentage || "0%"} `,
      status: dashboardData?.valet_sales?.status || "down",
      icon: "%",
    },
  ];
  return (
    <>
      {pdfisLoading ? <LoaderImg /> : ""}

      {centerFilterModalOpen && (
        <div className="">
          <CeoDashboardFilterModal
            isOpen={centerFilterModalOpen}
            onClose={() => setCenterFilterModalOpen(false)}
            getData={getData}
            isLoading={isLoading}
            isStatic={true}
            onApplyFilters={handleApplyFilters}
            validationSchema={getCeoDashBoardFilterValidation}
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
              CEO Dashboard (
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
            <div
              className={`d-flex justify-content-end ${
                (filters?.client_id ||
                  filters?.company_id ||
                  filters?.site_id ||
                  filters?.start_date) &&
                isMobile &&
                "w-100"
              } `}
            >
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

      <div className="mb-2 " onClick={() => openCenterFilterModal()}>
        {filters?.client_id && filters.company_id && (
          <>
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
            CEO Dashboard (
            {dashboardData?.dateString
              ? dashboardData?.dateString
              : ReduxFullData?.dates}
            )
          </h2>
        )}

        {isMobile ? (
          <CardSwiper
            dashboardData={dashboardData}
            callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
            navigattionPath="/ceodashboard-details"
            cardsData={DashboardcardsData(dashboardData)} // ✅ Call the function
          />
        ) : (
          !isMobile && // Ensures this section renders only when isMobile is false
          (statsLoading ? (
            <Row>
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
            </Row>
          ) : (
            <UpercardsCeoDashboardStatsBox
              gross_volume={dashboardData?.gross_volume || 0}
              shopmargin={dashboardData?.shop_profit || 0}
              valet_sales={dashboardData?.valet_sales || 0}
              gross_profit={dashboardData?.gross_profit || 0}
              gross_margin={dashboardData?.gross_margin || 0}
              fuel_sales={dashboardData?.fuel_sales || 0}
              fuel_commission={dashboardData?.fuel_commission || 0}
              gross_margin_bunkered={dashboardData?.gross_margin_bunkered || 0}
              shop_sales={dashboardData?.shop_sales || 0}
              shop_fees={dashboardData?.shop_fees || 0}
              shop_profit={dashboardData?.shop_profit || 0}
              dashboardData={dashboardData}
              callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
            />
          ))
        )}
      </div>

      <div onClick={() => openCenterFilterModal()}>
        <Row>
          <Col lg={12}>
            <CeoDashBoardBottomPage
              filters={filters}
              getData={getData}
              dashboardData={dashboardData}
              applyNavigate={applyNavigate}
            />
          </Col>
        </Row>
      </div>

      <Row className="my-2">
        {priceLogsPermission && (
          <>
            <Col
              sm={12}
              md={priceLogAndGraphPermission ? 6 : 12}
              key={Math.random()}
              className="mb-4 mb-sm-0"
            >
              <Card className="h-100">
                <Card.Header className="p-4 d-flex  flex-wrap flex-sm-nowrap justify-content-between">
                  <div className="spacebetween w-100">
                    <h4 className="card-title">
                      {" "}
                      Fuel Price Exceptional Alerts (
                      {PriceLogsFilterValue?.find(
                        (item) => item.value === PriceLogsvalue
                      )?.label || "Value not found"}
                      )
                      <br />
                      {userPermissions?.includes("fuel-price-logs") ? (
                        <span style={{ color: "var(--primary-bg-color)" }}>
                          <Link to="/fuel-price-exceptional-logs/">
                            View All
                          </Link>
                        </span>
                      ) : (
                        ""
                      )}
                    </h4>
                  </div>
                  <div className="flexspacebetween mt-2 mt-sm-0">
                    {filters?.sites ? (
                      <div>
                        <select
                          id="PriceLogsvalue"
                          name="PriceLogsvalue"
                          value={PriceLogsvalue}
                          onChange={(e) =>
                            handlePriceLogsChange(e.target.value)
                          }
                          className="selectedMonth"
                        >
                          {PriceLogsFilterValue?.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Card.Header>
                <Card.Body>
                  {PriceLogsloading ? (
                    <SmallLoader />
                  ) : PriceLogs?.priceLogs?.length > 0 ? (
                    <div
                      style={{
                        maxHeight: "250px",
                        overflowX: "auto",
                        overflowY: "auto",
                      }}
                    >
                      <PriceLogTable
                        PriceLogsvalue={PriceLogsvalue}
                        PriceLogs={PriceLogs}
                      />
                    </div>
                  ) : (
                    <img
                      src={require("../../assets/images/commonimages/no_data.png")}
                      alt="No data available"
                      className="all-center-flex smallNoDataimg h-100"
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {priceGraphPermission && (
          <>
            <Col className="" sm={12} md={priceLogAndGraphPermission ? 6 : 12}>
              <Card
                className="h-100"
                style={{ transition: "opacity 0.3s ease" }}
              >
                <Card.Header className="p-4 d-flex  flex-wrap flex-sm-nowrap">
                  <div className="spacebetween" style={{ width: "100%" }}>
                    <h4 className="card-title">
                      {" "}
                      Price Graph{" "}
                      {formik.values?.selectedSiteDetails?.site_name &&
                        ` (${formik.values.selectedSiteDetails.site_name})`}
                      <br></br>
                      {userPermissions?.includes("ceodashboard-price-graph") ? (
                        <span
                          style={{ color: "var(--primary-bg-color)" }}
                          className="pointer"
                        >
                          <div onClick={() => handleNavigateViewAllClick()}>
                            View All
                          </div>
                        </span>
                      ) : (
                        ""
                      )}
                    </h4>
                  </div>
                  <div className="flexspacebetween mt-2 mt-sm-0">
                    {filters?.sites ? (
                      <div>
                        <select
                          id="selectedSite"
                          name="selectedSite"
                          value={formik.values.selectedSite}
                          onChange={(e) => handleSiteChange(e.target.value)}
                          className="selectedMonth"
                        >
                          <option value="">--Select a Site--</option>
                          {filters?.sites?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.site_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Card.Header>

                <Card.Body>
                  {PriceGraphloading ? (
                    <SmallLoader />
                  ) : PriceGraphData?.labels &&
                    PriceGraphData?.fuel_type?.length > 0 ? (
                    <LinesDotGraphchart
                      stockGraphData={PriceGraphData}
                      showExWatValue={true}
                    />
                  ) : (
                    <NoDataComponent showCard={false} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default withApi(CeoDashBoardTest);
