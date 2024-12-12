import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import { handleFilterData } from "../../Utils/commonFunctions/commonFunction";
import { Card, Col, Row } from "react-bootstrap";
import { DashboardData } from "../../Utils/commonFunctions/CommonData";
import UpercardsCeoDashboardStatsBox from "./DashboardStatsBox/UpercardsCeoDashboardStatsBox";
import CeoDashboardFilterModal from "../pages/Filtermodal/CeoDashboardFilterModal";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import useErrorHandler from "../CommonComponent/useErrorHandler";
import LoaderImg from "../../Utils/Loader";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import CeoDashBoardBottomPage from "./CeoDashBoardBottomPage";
import SmallLoader from "../../Utils/SmallLoader";
import PriceLogTable from "./PriceLogTable";
import LoadingAnimationCard from "../../Utils/LoadingAnimationCard";

const CeoDashBoardTest = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const [stockDetailModal, setstockDetailModal] = useState(false);

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
  const [Mopstatsloading, setMopstatsloading] = useState(false);
  const [Salesstatsloading, setSalesstatsloading] = useState(false);
  const [Stockstatsloading, setStockstatsloading] = useState(false);
  const [Shrinkagestatsloading, setShrinkagestatsloading] = useState(false);
  const [Itemstockstatsloading, setItemstockstatsloading] = useState(false);
  const [PriceLogsloading, setPriceLogssloading] = useState(false);
  const [getSiteStatsloading, setGetSiteStatsloading] = useState(false);
  const [performanceLoading, siteperformanceLoading] = useState(false);
  const [selectedFuelIndex, setSelectedFuelIndex] = useState(0);
  const [MopstatsData, setMopstatsData] = useState();
  const [BarGraphSalesStats, setBarGraphSalesStats] = useState();
  const [BarGraphStockStats, setBarGraphStockStats] = useState();
  const [Shrinkagestats, setShrinkagestats] = useState();
  const [siteperformance, setsiteperformance] = useState();
  const [Itemstockstats, setItemstockstats] = useState();
  const [PriceLogs, setPriceLogs] = useState();
  const [applyNavigate, setApplyNavigate] = useState(false);
  const [getSiteStats, setGetSiteStats] = useState(null);
  const [toggleValue, setToggleValue] = useState(false);
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState();

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
      console.log(values);
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
      // site_id: applyFilterOvells
      //   ? Yup.string().required("Site is required") // Required if `applyFilterOvell` is false
      //   : Yup.string(), // Optional if `applyFilterOvell` is true
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
      // if (values) {
      //   const response = await getData(
      //     `client/reportlist?client_id=${values?.client_id}`
      //   );
      //   values.reports = response?.data?.data?.reports || [];
      //   values.reportmonths = response?.data?.data?.months || [];
      // }

      // Ensure 'start_date' is set
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
        url: "dashboard/stats",
        setData: setDashboardData,
        callback: (response, updatedFilters) => {
          setFilters(updatedFilters);
          setCenterFilterModalOpen(false);
        },
      },
      // {
      //   name: "mop",
      //   url: "ceo-dashboard/mop-stats",
      //   setData: setMopstatsData,
      //   setLoading: setMopstatsloading,
      // },
      // {
      //   name: "sales",
      //   url: "ceo-dashboard/sales-stats",
      //   setData: setBarGraphSalesStats,
      //   setLoading: setSalesstatsloading,
      // },
      // {
      //   name: "stock",
      //   url: "ceo-dashboard/stock-stats",
      //   setData: setBarGraphStockStats,
      //   setLoading: setStockstatsloading,
      // },
      // {
      //   name: "shrinkage",
      //   url: "ceo-dashboard/shrinkage-stats",
      //   setData: setShrinkagestats,
      //   setLoading: setShrinkagestatsloading,
      // },
      // {
      //   name: "siteperformance",
      //   url: "ceo-dashboard/site-performance",
      //   setData: setsiteperformance,
      //   setLoading: siteperformanceLoading,
      // },
      // {
      //   name: "itemstock",
      //   url: "ceo-dashboard/department-item-stocks",
      //   setData: setItemstockstats,
      //   setLoading: setItemstockstatsloading,
      // },
      // {
      //   name: "tankanalysis",
      //   url: "dashboard/get-site-stats",
      //   setData: setGetSiteStats,
      //   setLoading: setGetSiteStatsloading,
      // }
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

  const FetchPriceLogs = async () => {
    try {
      setPriceLogssloading(true);
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
  // {
  //   name: "itemstock",
  //   url: "ceo-dashboard/department-item-stocks",
  //   setData: setItemstockstats,
  //   setLoading: setItemstockstatsloading,
  // },
  const FetchStockDetails = async () => {
    try {
      setItemstockstatsloading(true);
      const queryParams = new URLSearchParams();
      if (formik?.values?.client_id)
        queryParams.append("client_id", formik?.values?.client_id);
      if (formik?.values?.company_id)
        queryParams.append("company_id", formik?.values?.company_id);
      if (formik?.values?.selectedSite)
        queryParams.append("site_id", formik?.values?.selectedSite);
      const queryString = queryParams.toString();
      const response = await getData(
        `ceo-dashboard/department-item-stocks?${queryString}`
      );
      if (response && response.data && response.data.data) {
        setItemstockstats(response?.data?.data);
      }
    } catch (error) {
      // handleError(error);
    } finally {
      setItemstockstatsloading(false);
    }
  };
  const FetchTankDetails = async () => {
    try {
      setGetSiteStatsloading(true);
      const queryParams = new URLSearchParams();
      if (formik?.values?.selectedSite)
        queryParams.append("site_id", formik?.values?.selectedSite);

      const queryString = queryParams.toString();
      const response = await getData(
        `ceo-dashboard/get-site-stats?${queryString}`
      );
      if (response && response.data && response.data.data) {
        setGetSiteStats(response?.data?.data);
      }
    } catch (error) {
      // handleError(error);
    } finally {
      setGetSiteStatsloading(false);
    }
  };

  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setGetSiteStats(null);
    setFilters(null);
    setDashboardData(null);
    setItemstockstats(null);
    setMopstatsData(null);
    setBarGraphSalesStats(null);
    setBarGraphStockStats(null);
    setShrinkagestats(null);
    setPriceLogs(null);
    setApplyNavigate(false);
    formik.resetForm();
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
  }, [permissionsArray?.includes("ceodashboard-view")]);

  const handleShowLive = () => {
    setShowLiveData((prevState) => !prevState); // Toggle the state
    // setLiveMarginModal((prevState) => !prevState);
  };

  const handlelivemaringclosemodal = () => {
    setShowLiveData(false); // Toggle the state
  };
  const [pdfisLoading, setpdfisLoading] = useState(false);
  const handleMonthChange = (selectedId) => {
    const selectedItem = filters.reportmonths.find(
      (item) => item.display == selectedId
    );
    formik.setFieldValue("selectedMonth", selectedId);
    formik.setFieldValue("selectedMonthDetails", selectedItem);
  };

  useEffect(() => {
    if (formik?.values?.selectedSite && priceLogsPermission) {
      FetchPriceLogs();
    }
  }, [formik?.values?.selectedSite, priceLogsPermission]);

  const ErrorToast = (message) => {
    toast.error(message, {
      autoClose: 2000,
      hideProgressBar: false,
      transition: Bounce,
      theme: "colored",
    });
  };

  const StockDeatils = () => {
    navigate(`/dashboard-details/${formik?.values?.selectedSite}`, {
      state: { isCeoDashboard: true }, // Pass the key-value pair in the state
    });
    // setstockDetailModal(true)
  };

  const navigate = useNavigate();
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleConfirmedAction(selectedId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        await handleCancelledAction(selectedId);
      }
    });
  };

  useEffect(() => {
    if (filters?.client_id && filters?.start_date && filters?.site_id) {
      // GetCompetitor(filters);
    }

    console.log(filters, "filtersfilters");
  }, [filters]);

  const GetCompetitor = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("site_id", formik?.values?.selectedSite);
      // if (start_date) queryParams.append("drs_date", start_date);

      const queryString = queryParams.toString();
      const response = await getData(
        `ceo-dashboard/competitor-stats?${queryString}`
      );
      if (response && response.data && response.data.data) {
        setGetCompetitorsPrice(response?.data?.data);
      }
    } catch (error) {}
  };

  const handleChange = (event) => {
    setSelectedFuelIndex(event.target.value); // Update the selected index
  };
  const handleToggleChange = (checked) => {
    setToggleValue(checked);
  };

  const openCenterFilterModal = () => {
    setCenterFilterModalOpen(true);
  };

  console.log(filters, "filters");

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

      <div className="mb-2 ">
        {filters?.client_id && filters.company_id && (
          <>
            {/* <div className="text-end ">
              <button
                className=" mb-2 btn btn-primary"
                onClick={handleShowLive}
              >
                Live Margin
              </button>
            </div> */}

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

        {isLoading ? (
          <>
            <Row>
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
              <LoadingAnimationCard />
            </Row>
          </>
        ) : (
          <UpercardsCeoDashboardStatsBox
            GrossVolume={dashboardData?.gross_volume || 0}
            shopmargin={dashboardData?.shop_profit || 0}
            GrossProfitValue={dashboardData?.gross_profit || 0}
            GrossMarginValue={dashboardData?.gross_margin || 0}
            FuelValue={dashboardData?.fuel_sales || 0}
            shopsale={dashboardData?.shop_sales || 0}
            shop_fees={dashboardData?.shop_fees || 0}
            dashboardData={dashboardData}
            callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
          />
        )}
      </div>

      <div>
        <Row>
          <Col lg={12}>
            <CeoDashBoardBottomPage
              filters={filters}
              getData={getData}
              applyNavigate={applyNavigate}
            />
          </Col>
        </Row>
      </div>

      <Row Row className="my-2">
        {priceLogsPermission && (
          <>
            <Col
              sm={12}
              md={priceLogAndGraphPermission ? 8 : 12}
              key={Math.random()}
            >
              <Card className="h-100">
                <Card.Header className="p-4">
                  <div className="spacebetween" style={{ width: "100%" }}>
                    <h4 className="card-title">
                      {" "}
                      Fuel Price Logs{" "}
                      {formik.values?.selectedSiteDetails?.site_name &&
                        ` (${formik.values.selectedSiteDetails.site_name})`}
                      <br></br>
                      {userPermissions?.includes("fuel-price-logs") ? (
                        <span style={{ color: "blue" }}>
                          <Link to="/fuel-selling-price-logs/">View All</Link>
                        </span>
                      ) : (
                        ""
                      )}
                    </h4>
                  </div>
                  <div className="flexspacebetween">
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
                <Card.Body
                  style={{
                    maxHeight: "250px",
                    overflowX: "auto",
                    overflowY: "auto",
                  }}
                >
                  {PriceLogsloading ? (
                    <SmallLoader />
                  ) : PriceLogs?.priceLogs?.length > 0 ? (
                    <PriceLogTable priceLogs={PriceLogs?.priceLogs} />
                  ) : (
                    <img
                      src={require("../../assets/images/commonimages/no_data.png")}
                      alt="No data available"
                      className="all-center-flex smallNoDataimg"
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
        {priceGraphPermission && (
          <>
            <Col sm={12} md={priceLogAndGraphPermission ? 4 : 12}>
              <Card
                className="h-100"
                style={{ transition: "opacity 0.3s ease" }}
              >
                <Card.Header className="p-4">
                  <div className="spacebetween" style={{ width: "100%" }}>
                    <h4 className="card-title">Price Graph</h4>
                    <span>View All</span>
                  </div>
                </Card.Header>
                <Card.Body>
                  <img
                    src={require("../../assets/images/commonimages/dotGraph.png")}
                    alt="dotGraph"
                    className="dotGraph"
                  />
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
