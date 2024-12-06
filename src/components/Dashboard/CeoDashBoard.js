import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import ChartCard from "./ChartCard";
import { handleFilterData } from "../../Utils/commonFunctions/commonFunction";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import CeoDashboardStatsBox from "./DashboardStatsBox/CeoDashboardStatsBox";
import {
  Baroptions,
  SiteDetails,
  Tankcolors,
} from "../../Utils/commonFunctions/CommonData";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import { Doughnut } from "react-chartjs-2";
import UpercardsCeoDashboardStatsBox from "./DashboardStatsBox/UpercardsCeoDashboardStatsBox";
import CeoDashboardFilterModal from "../pages/Filtermodal/CeoDashboardFilterModal";
import { useFormik } from "formik";
import SmallLoader from "../../Utils/SmallLoader";
import CeoDashboardCharts from "./CeoDashboardCharts";
import { Link, useNavigate } from "react-router-dom";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import PriceLogTable from "./PriceLogTable";
import ReportTable from "./ReportTable";
import useErrorHandler from "../CommonComponent/useErrorHandler";
import LoaderImg from "../../Utils/Loader";
import * as Yup from "yup";
import CeoDashTankAnalysis from "./CeoDashTankAnalysis";
import Swal from "sweetalert2";
import StockDetailFilterModal from "../pages/Filtermodal/StockDetailFilterModal";
import { Bounce, toast } from "react-toastify";
import CEODashboardCompetitor from "./CEODashboardCompetitor";
import CEODashboardCompetitorChart from "./CEODashboardCompetitorChart";
import CeoDashSitetable from "./CeoDashSitetable";

const CeoDashBoard = (props) => {
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

  const [MopstatsData, setMopstatsData] = useState();
  const [BarGraphSalesStats, setBarGraphSalesStats] = useState();
  const [BarGraphStockStats, setBarGraphStockStats] = useState();
  const [Shrinkagestats, setShrinkagestats] = useState();
  const [Itemstockstats, setItemstockstats] = useState();
  const [PriceLogs, setPriceLogs] = useState();
  const [getSiteStats, setGetSiteStats] = useState(null);

  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);

  const { handleError } = useErrorHandler();
  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

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
      if (values) {
        const response = await getData(
          `client/reportlist?client_id=${values?.client_id}`
        );
        values.reports = response?.data?.data?.reports || [];
        values.reportmonths = response?.data?.data?.months || [];
      }

      // Ensure 'start_date' is set
      if (!values?.start_date) {
        const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        values.start_date = currentDate;
      }

      // Store the updated values in localStorage
      localStorage.setItem(storedKeyName, JSON.stringify(values));

      // Fetch dashboard stats if the user has the required permission
      if (permissionsArray?.includes("dashboard-view")) {
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
      {
        name: "mop",
        url: "ceo-dashboard/mop-stats",
        setData: setMopstatsData,
        setLoading: setMopstatsloading,
      },
      {
        name: "sales",
        url: "ceo-dashboard/sales-stats",
        setData: setBarGraphSalesStats,
        setLoading: setSalesstatsloading,
      },
      {
        name: "stock",
        url: "ceo-dashboard/stock-stats",
        setData: setBarGraphStockStats,
        setLoading: setStockstatsloading,
      },
      {
        name: "shrinkage",
        url: "ceo-dashboard/shrinkage-stats",
        setData: setShrinkagestats,
        setLoading: setShrinkagestatsloading,
      },
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
      const response = await getData(`dashboard/get-site-stats?${queryString}`);
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
    formik.resetForm();
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
  const [pdfisLoading, setpdfisLoading] = useState(false);
  const handleMonthChange = (selectedId) => {
    const selectedItem = filters.reportmonths.find(
      (item) => item.display == selectedId
    );
    formik.setFieldValue("selectedMonth", selectedId);
    formik.setFieldValue("selectedMonthDetails", selectedItem);
  };

  useEffect(() => {
    if (formik?.values?.selectedSite) {
      FetchPriceLogs();
      FetchStockDetails();
      if (userPermissions?.includes("dashboard-site-stats")) {
        FetchTankDetails();
      }
      GetCompititor(filters);
    }
  }, [formik?.values?.selectedSite]);

  const ErrorToast = (message) => {
    toast.error(message, {
      autoClose: 2000,
      hideProgressBar: false,
      transition: Bounce,
      theme: "colored",
    });
  };
  const handleDownload = async (report) => {
    if (!formik?.values?.selectedMonthDetails?.value) {
      ErrorToast("Please select Month For Reports");
    } else {
      setpdfisLoading(true);
      try {
        const formData = new FormData();

        formData.append("report", report);

        // Add client_id based on superiorRole
        const superiorRole = localStorage.getItem("superiorRole");
        if (superiorRole !== "Client") {
          formData.append("client_id", filters.client_id);
        } else {
          formData.append("client_id", filters.client_id);
        }

        // Add other necessary form values
        formData.append("company_id", filters.company_id);

        // Prepare client ID condition for the query params
        let clientIDCondition =
          superiorRole !== "Client"
            ? `client_id=${filters.client_id}&`
            : `client_id=${filters.client_id}&`;

        // Construct commonParams basedd on toggleValue
        const commonParams = `/download-report/${
          report?.report_code
        }?${clientIDCondition}company_id=${
          filters.company_id
        }&site_id[]=${encodeURIComponent(formik.values?.selectedSite)}&month=${
          formik?.values?.selectedMonthDetails?.value
        }`;

        // API URL for the fetch request
        const apiUrl = `${process.env.REACT_APP_BASE_URL + commonParams}`;

        // Fetch the data
        const token = localStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the response is OK
        if (!response.ok) {
          //
          // Await the response body parsing first to get the actual JSON data
          const errorData = await response.json();
          ErrorToast(errorData?.message);
          throw new Error(
            `Errorsss ${response.status}: ${
              errorData?.message || "Something went wrong!"
            }`
          );
        }

        // Handle the file download
        const blob = await response.blob();
        const contentType = response.headers.get("Content-Type");
        let fileExtension = "xlsx"; // Default to xlsx

        if (contentType) {
          if (contentType.includes("application/pdf")) {
            fileExtension = "pdf";
          } else if (
            contentType.includes(
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
          ) {
            fileExtension = "xlsx";
          } else if (contentType.includes("text/csv")) {
            fileExtension = "csv";
          }
        }

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a link element and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${report?.report_name}.${fileExtension}`
        );
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Error downloading the file:", error);
      } finally {
        setpdfisLoading(false);
      }
    }
  };

  const StockDetailvalidation = () =>
    Yup.object({
      client_id: Yup.string().required("Client is required"),
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site is required"),
    });
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
      GetCompititor(filters);
    }
  }, [filters]);

  const GetCompititor = async (filters) => {
    console.log(filters, "filtersfiltersfiltersfiltersfilters");
    let { client_id, start_date, site_id } = filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
    }
    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("site_id", site_id);
        if (start_date) queryParams.append("drs_date", start_date);

        const queryString = queryParams.toString();
        const response = await getData(
          `site/competitor-price/stats?${queryString}`
        );
        if (response && response.data && response.data.data) {
          setGetCompetitorsPrice(response?.data?.data);
        }
      } catch (error) {}
    }
  };

  console.log(filters, "filerer");

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
            <div className="text-end ">
              <button
                className=" mb-2 btn btn-primary"
                onClick={handleShowLive}
              >
                Live Margin
              </button>
            </div>

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

        {isLoading ? (
          <SmallLoader title="Stats Cards" />
        ) : (
          <UpercardsCeoDashboardStatsBox
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

        {isLoading ? (
          <SmallLoader title="Total Day Wise Sales" />
        ) : (
          <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
            <ChartCard
              title="Total Day Wise Sales"
              chartType="full"
              chartData={dashboardData?.d_line_graph}
              CeoDashBoard={true}
              noChartMessage=""
            >
              <DashboardMultiLineChart
                LinechartValues={dashboardData?.d_line_graph?.series || []}
                LinechartOption={
                  dashboardData?.d_line_graph?.option?.labels || []
                }
              />
            </ChartCard>
          </Row>
        )}

        <Card className="h-100">
          <Card.Header className="p-4">
            <h4 className="card-title"> MOP BreakDown </h4>
          </Card.Header>
        </Card>

        <CeoDashboardStatsBox
          dashboardData={MopstatsData}
          Mopstatsloading={Mopstatsloading}
          callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
        />

        <CeoDashboardCharts
          Salesstatsloading={Salesstatsloading}
          BarGraphSalesStats={BarGraphSalesStats}
          Baroptions={Baroptions}
        />

        <Row>
          <Col lg={6} md={6}>
            <CeoDashSitetable
              data={SiteDetails}
              title={" Top Performar Sites"}
            />
          </Col>
          <Col lg={6} md={6}>
            <CeoDashSitetable data={SiteDetails} title={"Top Losse Sites"} />
          </Col>
        </Row>

        <Card className="h-100 mt-4">
          <Card.Header className="flexspacebetween">
            <h4 className="card-title"> Selling Price Logs/Reports </h4>
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
        </Card>

        <Row
          style={{
            marginBottom: "10px",
            marginTop: "20px",
          }}
        >
          <Col lg={7} md={7} className="">
            <Card className="">
              <Card.Header className="  ">
                <div className=" d-flex w-100 justify-content-between align-items-center  card-title w-100 ">
                  <h4 className="card-title">
                    {" "}
                    {getCompetitorsPrice
                      ? getCompetitorsPrice?.siteName
                      : ""}{" "}
                    Competitors Chart
                    {/* ({showDate}) */}
                  </h4>
                </div>
              </Card.Header>
              <Card.Body className="px-0">
                <CEODashboardCompetitorChart />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5} md={5} className="">
            <Card className="">
              <Card.Header>
                <div className=" d-flex w-100 justify-content-between align-items-center  card-title w-100 ">
                  <h4 className="card-title">
                    {" "}
                    {getCompetitorsPrice
                      ? getCompetitorsPrice?.siteName
                      : ""}{" "}
                    Competitors Stats
                    {/* ({showDate}) */}
                  </h4>
                </div>
              </Card.Header>
              <Card.Body className="overflow-auto ceo-compi-body">
                <CEODashboardCompetitor
                  getCompetitorsPrice={getCompetitorsPrice}
                  // Mopstatsloading={Mopstatsloading}
                  // callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {userPermissions?.includes("dashboard-site-stats") ? (
          <>
            {getSiteStatsloading ? (
              <SmallLoader title="Tank Analysis" />
            ) : getSiteStats?.dates?.length > 0 ? (
              <Row className="my-4 l-sign">
                <Col lg={12} md={12}>
                  <Card>
                    <Card.Header className="card-header">
                      <div className="Tank-Details d-flex">
                        <h4 className="card-title">
                          Tank Analysis (
                          {formik.values?.selectedSiteDetails?.site_name})
                        </h4>
                        <div className="Tank-Details-icon">
                          <OverlayTrigger
                            placement="right"
                            className="Tank-Detailss"
                            overlay={
                              <Tooltip style={{ width: "200px" }}>
                                <div>
                                  {Tankcolors?.map((color, index) => (
                                    <div
                                      key={index}
                                      className=" d-flex align-items-center py-1 px-3 text-white"
                                    >
                                      <div
                                        style={{
                                          width: "20px", // Set the width for the color circle
                                          height: "20px",
                                          borderRadius: "50%",
                                          backgroundColor: color?.color,
                                        }}
                                      ></div>
                                      <span className=" text-white ms-2">
                                        {color?.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </Tooltip>
                            }
                          >
                            <img
                              alt=""
                              src={require("../../assets/images/dashboard/dashboardTankImage.png")}
                            />
                          </OverlayTrigger>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className="card-body p-0 m-0">
                      <div id="chart">
                        <CeoDashTankAnalysis
                          getSiteStats={getSiteStats}
                          setGetSiteStats={setGetSiteStats}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : (
              <NoDataComponent title="Tank Analysis" />
            )}
          </>
        ) : (
          ""
        )}

        <Row className="d-flex align-items-stretch mt-5 ">
          <Col sm={12} md={8} key={Math.random()}>
            <Card className="h-100">
              <Card.Header className="p-4">
                <div className="spacebetween" style={{ width: "100%" }}>
                  <h4 className="card-title">
                    {" "}
                    Selling Price Logs (
                    {formik.values?.selectedSiteDetails?.site_name})
                    {/* <br></br><span className="smalltitle">{(formik?.values?.selectedMonthDetails?.display)}</span> */}
                  </h4>
                  {userPermissions?.includes("fuel-price-logs") ? (
                    <span>
                      <Link to="/fuel-selling-price-logs/">View All</Link>
                    </span>
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
          <Col sm={12} md={4} key={Math.random()}>
            <Card className="h-100">
              <Card.Header className="p-4 w-100  ">
                <div className="w-100">
                  <div className="spacebetweenend">
                    <h4 className="card-title">
                      Reports({formik.values?.selectedSiteDetails?.site_name})
                    </h4>
                    {userPermissions?.includes("report-type-list") ? (
                      <span className="textend">
                        <Link to="/reports">View All</Link>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="spacebetweenend">
                    <span className="smalltitle">
                      {formik?.values?.selectedMonthDetails?.display}
                    </span>

                    {filters?.reportmonths ? (
                      <Col lg={6} className="textend p-0">
                        <select
                          id="selectedMonth"
                          name="selectedMonth"
                          value={formik.values.selectedMonth}
                          onChange={(e) => handleMonthChange(e.target.value)}
                          className="selectedMonth"
                        >
                          <option value="">--Select a Month--</option>
                          {filters?.reportmonths?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.display}
                            </option>
                          ))}
                        </select>
                      </Col>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </Card.Header>
              <Card.Body
                style={{
                  maxHeight: "250px",
                  overflowX: "auto",
                  overflowY: "auto",
                }}
              >
                <div>
                  {PriceLogsloading ? (
                    <SmallLoader />
                  ) : (
                    <>
                      {" "}
                      {filters?.reports?.length > 0 ? (
                        <ReportTable
                          reports={filters?.reports}
                          pdfisLoading={pdfisLoading}
                          handleDownload={handleDownload}
                        />
                      ) : (
                        <img
                          src={require("../../assets/images/commonimages/no_data.png")}
                          alt="MyChartImage"
                          className=" all-center-flex  smallNoDataimg "
                        />
                      )}
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5 d-flex align-items-stretch">
          <Col sm={12} md={4} xl={4} key={Math.random()} className="">
            {Stockstatsloading ? (
              <SmallLoader title="Stocks" />
            ) : BarGraphStockStats?.stock_graph_data ? (
              <Card className="h-100">
                <Card.Header className="p-4">
                  <h4 className="card-title">Stocks</h4>
                </Card.Header>
                <Card.Body
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "300px", height: "300px" }}>
                    <Doughnut
                      data={BarGraphStockStats?.stock_graph_data}
                      options={BarGraphStockStats?.stock_graph_options}
                      height="100px"
                    />
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <NoDataComponent title="Stocks" />
            )}
          </Col>
          <Col sm={12} md={4} xl={4} key={Math.random()} className="">
            {Shrinkagestatsloading ? (
              <SmallLoader title="Shrinkage" />
            ) : Shrinkagestats?.shrinkage_graph_data ? (
              <CeoDashboardBarChart
                data={Shrinkagestats?.shrinkage_graph_data}
                options={Shrinkagestats?.shrinkage_graph_options}
                title="Shrinkage"
                width="300px"
                height="200px"
              />
            ) : (
              <NoDataComponent title="Shrinkage" />
            )}
          </Col>

          <Col sm={12} md={4} xl={4} key={Math.random()} className="">
            {Itemstockstatsloading ? (
              <SmallLoader title="Stock Details" />
            ) : Itemstockstats?.length > 0 ? (
              <Card className="h-100">
                <Card.Header className="p-4 w-100 flexspacebetween">
                  <h4 className="card-title">
                    {" "}
                    <div className="lableWithsmall">
                      Stock Details (
                      {formik.values?.selectedSiteDetails?.site_name})
                    </div>
                  </h4>
                  {userPermissions?.includes("report-type-list") ? (
                    <span
                      style={{ color: "#4663ac", cursor: "pointer" }}
                      onClick={StockDeatils}
                    >
                      View Details
                    </span>
                  ) : (
                    ""
                  )}
                </Card.Header>
                <Card.Body style={{ maxHeight: "350px" }}>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#fff",
                          zIndex: 1,
                        }}
                      >
                        <tr>
                          <th style={{ textAlign: "left", padding: "8px" }}>
                            Name
                          </th>
                          <th style={{ textAlign: "left", padding: "8px" }}>
                            Gross Sales
                          </th>
                          <th style={{ textAlign: "left", padding: "8px" }}>
                            Nett Sales
                          </th>
                          <th style={{ textAlign: "left", padding: "8px" }}>
                            Profit
                          </th>
                          {/* <th style={{ textAlign: "left", padding: "8px", }}>Total Transactions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {Itemstockstats?.map((stock) => (
                          <tr key={stock?.id}>
                            <td style={{ padding: "8px" }}>{stock?.name}</td>
                            <td style={{ padding: "8px" }}>
                              {stock?.gross_sales}
                            </td>
                            <td style={{ padding: "8px" }}>
                              {stock?.nett_sales}
                            </td>
                            <td style={{ padding: "8px" }}>{stock?.profit}</td>
                            {/* <td style={{ padding: "8px", }}>{stock?.total_transactions}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <div className="h-100">
                <NoDataComponent title="Stock Details" />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(CeoDashBoard);
