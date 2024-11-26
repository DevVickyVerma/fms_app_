
import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import { useDispatch, useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import * as Yup from "yup";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import ChartCard from "./ChartCard";
import { handleFilterData } from "../../Utils/commonFunctions/commonFunction";
import { Card, Col, Row } from "react-bootstrap";
import CeoDashboardStatsBox from "./DashboardStatsBox/CeoDashboardStatsBox";
import { Baroptions, stockAgingDetails } from "../../Utils/commonFunctions/CommonData";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import { Doughnut } from "react-chartjs-2";
import UpercardsCeoDashboardStatsBox from "./DashboardStatsBox/UpercardsCeoDashboardStatsBox";
import CeoDashboardFilterModal from "../pages/Filtermodal/CeoDashboardFilterModal";
import { useFormik } from "formik";
import SmallLoader from "../../Utils/SmallLoader";
import CeoDashboardCharts from "./CeoDashboardCharts";
import { Link } from "react-router-dom";


const CeoDashBoard = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
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
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchData())
  // }, [])

  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    // report_month: Yup.string().required("Report Month is required"),
  });


  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };




  useEffect(() => {

    localStorage.setItem("Dashboardsitestats", permissionsArray?.includes("dashboard-site-stats"));
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

    // only one permission check for first screen dashboard-view
    if (permissionsArray?.includes("dashboard-view")) {
      FetchFilterData(values);
      FetchMopCardStats(values);
      FetchSalesStats(values);
      FetchStockstats(values);
      FetchShrinkagestats(values);

    }
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
        // handleError(error);
      }
    }
  };
  const [Mopstatsloading, setMopstatsloading] = useState(false);
  const [Salesstatsloading, setSalesstatsloading] = useState(false);
  const [Stockstatsloading, setStockstatsloading] = useState(false);
  const [Shrinkagestatsloading, setShrinkagestatsloading] = useState(false);
  const [PriceLogsloading, setPriceLogssloading] = useState(false);
  const [MopstatsData, setMopstatsData] = useState();
  const [BarGraphSalesStats, setBarGraphSalesStats] = useState();
  const [BarGraphStockStats, setBarGraphStockStats] = useState();
  const [Shrinkagestats, setShrinkagestats] = useState();
  const [PriceLogs, setPriceLogs] = useState();
  const FetchMopCardStats = async (filters) => {

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
        setMopstatsloading(true);
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append("client_id", client_id);
        if (company_id) queryParams.append("company_id", company_id);
        if (site_id) queryParams.append("site_id", site_id);

        const queryString = queryParams.toString();
        const response = await getData(`ceo-dashboard/mop-stats?${queryString}`);
        if (response && response.data && response.data.data) {
          setMopstatsData(response?.data?.data)
        }
        localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
      } catch (error) {
        // handleError(error);
      } finally {
        setMopstatsloading(false);
      }
    }
  };
  const FetchSalesStats = async (filters) => {

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
        setSalesstatsloading(true);
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append("client_id", client_id);
        if (company_id) queryParams.append("company_id", company_id);
        if (site_id) queryParams.append("site_id", site_id);

        const queryString = queryParams.toString();
        const response = await getData(`ceo-dashboard/sales-stats?${queryString}`);
        if (response && response.data && response.data.data) {
          setBarGraphSalesStats(response?.data?.data)
        }
        localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
      } catch (error) {
        // handleError(error);
      } finally {
        setSalesstatsloading(false);
      }
    }
  };
  const FetchStockstats = async (filters) => {

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
        setStockstatsloading(true);
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append("client_id", client_id);
        if (company_id) queryParams.append("company_id", company_id);
        if (site_id) queryParams.append("site_id", site_id);

        const queryString = queryParams.toString();
        const response = await getData(`ceo-dashboard/stock-stats?${queryString}`);
        if (response && response.data && response.data.data) {
          setBarGraphStockStats(response?.data?.data)
        }
        localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
      } catch (error) {
        // handleError(error);
      } finally {
        setStockstatsloading(false);
      }
    }
  };
  const FetchShrinkagestats = async (filters) => {

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
        setShrinkagestatsloading(true);
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append("client_id", client_id);
        if (company_id) queryParams.append("company_id", company_id);
        if (site_id) queryParams.append("site_id", site_id);

        const queryString = queryParams.toString();
        const response = await getData(`ceo-dashboard/shrinkage-stats?${queryString}`);
        if (response && response.data && response.data.data) {
          setShrinkagestats(response?.data?.data)
        }
        localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
      } catch (error) {
        // handleError(error);
      } finally {
        setShrinkagestatsloading(false);
      }
    }
  };
  const FetchPriceLogs = async (filters) => {



    try {
      setPriceLogssloading(true);
      const queryParams = new URLSearchParams();
      // if (client_id) queryParams.append("client_id", client_id);
      // if (company_id) queryParams.append("company_id", company_id);
      if (formik?.values?.selectedSite) queryParams.append("site_id", formik?.values?.selectedSite);
      if (formik?.values?.selectedMonth) queryParams.append("drs_date", `01-${formik?.values?.selectedMonthDetails?.value}`);

      const queryString = queryParams.toString();
      const response = await getData(`ceo-dashboard/selling-price?${queryString}`);
      if (response && response.data && response.data.data) {
        setPriceLogs(response?.data?.data)
      }
    } catch (error) {
      // handleError(error);
    } finally {
      setPriceLogssloading(false);
    }

  };


  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setFilters(null);
    setDashboardData(null);
  };

  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
  }, [permissionsArray?.includes("dashboard-view")]);

  const handleShowLive = () => {
    setShowLiveData((prevState) => !prevState); // Toggle the state
    // setLiveMarginModal((prevState) => !prevState);
  };


  const handlelivemaringclosemodal = () => {
    setShowLiveData(false); // Toggle the state
  };
  const [pdfisLoading, setpdfisLoading] = useState(false);

  const firstSiteObject = () => {
    if (filters && filters.site_id === "" && filters.site_name === "" && filters.company_id) {
      return filters.sites.length > 0 ? filters.sites[0] : null;
    }
    return null;
  };

  const result = firstSiteObject();



  const handleMonthChange = (selectedId) => {
    const selectedItem = filters.reportmonths.find((item) => item.display == (selectedId));
    formik.setFieldValue("selectedMonth", selectedId,)
    formik.setFieldValue("selectedMonthDetails", selectedItem,)
  };
  const handleSiteChange = (selectedId) => {
    const selectedItem = filters?.sites.find((item) => item.id == (selectedId));
    formik.setFieldValue("selectedSite", selectedId,)
    formik.setFieldValue("selectedSiteDetails", selectedItem,)

  };

  const formik = useFormik({
    initialValues: {
      selectedSite: '',
      selectedSiteDetails: '',
      selectedMonth: '',
      selectedMonthDetails: '',
    },
    onSubmit: (values) => {
      // Handle the form submission or changes
      console.log(values);
    },
  });
  useEffect(() => {
    if (formik?.values?.selectedSite) {
      FetchPriceLogs();
    }
    // Set default month value if not set
    if (!formik?.values?.selectedMonth && !formik?.values?.selectedMonthDetails && filters?.reportmonths) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentMonthFormatted = `${currentYear}${currentMonth.toString().padStart(2, '0')}`;
      const currentMonthObject = filters?.reportmonths.find(item => item.values === currentMonthFormatted);


      formik.setFieldValue("selectedMonth", currentMonthObject.display);
      formik.setFieldValue("selectedMonthDetails", currentMonthObject);
      console.log(currentMonthObject, "currentMonthObjectformik");

    }
    if (!formik?.values?.selectedSite && !formik?.values?.selectedSiteDetails && filters?.company_id && !filters?.site_id) {
      console.log(result, "result");
      if (result && formik.values.selectedSite !== result.id) {
        formik.setFieldValue("selectedSite", result?.id);
        formik.setFieldValue("selectedSiteDetails", result);
      }
    } else if (filters?.company_id && filters?.site_id && !formik.values?.selectedSite) {
      const selectedItem = filters?.sites.find((item) => item.id == (filters?.site_id));
      formik.setFieldValue("selectedSite", filters?.site_id);
      formik.setFieldValue("selectedSiteDetails", selectedItem);
    }
  }, [filters, formik?.values?.selectedMonth, formik?.values?.selectedSite]);


  const handleDownload = async (report) => {
    setpdfisLoading(true)
    try {
      const formData = new FormData();

      formData.append("report", report);

      // Add client_id based on superiorRole
      const superiorRole = localStorage.getItem("superiorRole");
      if (superiorRole !== "Client") {
        formData.append("client_id", filters.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }

      // Add other necessary form values
      formData.append("company_id", filters.company_id);


      // Prepare client ID condition for the query params
      let clientIDCondition = superiorRole !== "Client"
        ? `client_id=${filters.client_id}&`
        : `client_id=${clientIDLocalStorage}&`;



      // Construct commonParams based on toggleValue
      const commonParams = `/download-report/${report?.report_code}?${clientIDCondition}company_id=${filters.company_id}&site_id[]=${encodeURIComponent(filters.site_id)}&month=${formik?.values?.selectedMonthDetails?.value}`;

      // API URL for the fetch request
      const apiUrl = `${process.env.REACT_APP_BASE_URL + commonParams}`;

      // Fetch the data
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json(); // Extract error message from response
        handleError(errorData)
        ErrorAlert(errorData?.message)
        throw new Error(`Errorsss ${response.status}: ${errorData?.message || 'Something went wrong!'}`);

      }

      // Handle the file download
      const blob = await response.blob();
      const contentType = response.headers.get('Content-Type');
      let fileExtension = 'xlsx'; // Default to xlsx

      if (contentType) {
        if (contentType.includes('application/pdf')) {
          fileExtension = 'pdf';
        } else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          fileExtension = 'xlsx';
        } else if (contentType.includes('text/csv')) {
          fileExtension = 'csv';
        } else {
          console.warn('Unsupported file type:', contentType);
        }
      }

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report?.report_name}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error('Error downloading the file:', error);
    } finally {
      setpdfisLoading(false)
    }
  };

  console.log(PriceLogs, "PriceLogs");



  console.log(PriceLogs?.priceLogs, "columnIndex");
  return (
    <>
      {isLoading || pdfisLoading ? <SmallLoader /> : null}

      {centerFilterModalOpen && (
        <div className="">
          <CeoDashboardFilterModal
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

      {/* Showing error message for gross margin */}
      {dashboardData?.gross_margin?.is_ppl == 1 && (<>
        <div className="balance-alert head-alert-show">
          <div>
            {dashboardData?.gross_margin?.ppl_msg}
          </div>
        </div>
      </>)}


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


        {filters?.client_id && filters.company_id && (<>
          <div className="text-end " >
            <button className=" mb-2 btn btn-primary" onClick={handleShowLive}>
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


        <Row style={{ marginBottom: '10px', marginTop: '20px' }}>
          <ChartCard
            title="Total Day Wise Sales"
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


        <Card className="h-100">


          <Card.Header className="p-4">
            <h4 className="card-title"> MOP BreakDown </h4>
          </Card.Header>
        </Card>

        {
          Mopstatsloading ? <SmallLoader title="Cards" /> : <CeoDashboardStatsBox
            dashboardData={MopstatsData}
            callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
          />
        }



        <CeoDashboardCharts
          Salesstatsloading={Salesstatsloading} // Simulate loading
          BarGraphSalesStats={BarGraphSalesStats} // Data for the charts
          Baroptions={Baroptions} // Pass the Baroptions directly
        />





        <Card className="h-100 mt-4">


          <Card.Header className="p-4 flexspacebetween">
            <h4 className="card-title"> Selling Price Logs/Reports   </h4>
            <div className="flexspacebetween">
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
              <div>
                <Col lg={6} style={{ marginRight: "0px" }}>
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
              </div>
            </div>
          </Card.Header>

        </Card>

        <Row className="d-flex align-items-stretch mt-5 ">
          <Col sm={12} md={8} key={Math.random()}>
            <Card className="h-100" >
              <Card.Header className="p-4">
                <div className="spacebetween" style={{ width: "100%" }}>
                  <h4 className="card-title"> Selling Price Logs ({formik.values?.selectedSiteDetails?.site_name})<span className="smalltitle">{(formik?.values?.selectedMonthDetails?.display)}</span>
                  </h4>


                  <span><Link to="/fuel-price-logs/">
                    View All
                  </Link></span>


                </div>
              </Card.Header>
              <Card.Body style={{ maxHeight: "250px", overflowX: "auto", overflowY: "auto" ,margin:"auto" }}>
                {PriceLogsloading ? <SmallLoader /> : <> {PriceLogs?.priceLogs?.length > 0 ? (
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Site</th>
                        <th>Selling</th>
                        <th>Checked</th>
                        <th>Old Price</th>
                        <th>New Price</th>
                        <th>Updated By</th>
                        <th>Update Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PriceLogs?.priceLogs?.map((log) => (
                        <tr key={log.id}>
                          <td>{log.site}</td>
                          <td>{log.name}</td>
                          <td>{log.is_checked}</td>
                          <td>£{log.prev_price.toFixed(3)}</td>
                          <td>£{log.price.toFixed(3)}</td>
                          <td>{log.user}</td>
                          <td>{new Date(log.created).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <img
                    src={require("../../assets/images/commonimages/no_data.png")}
                    alt="MyChartImage"
                   className=" all-center-flex  smallNoDataimg "
                  />
                )}</>}





              </Card.Body>
            </Card>



          </Col>
          <Col sm={12} md={4} key={Math.random()}>
            <Card className="h-100" >
              <Card.Header className="p-4 w-100 flexspacebetween">
                <h4 className="card-title"> <div className="lableWithsmall">
                  Reports <span className="smalltitle">{(formik?.values?.selectedMonthDetails?.display)}</span>
                </div></h4>
                <span><Link to="/reports">
                  View All
                </Link></span>

              </Card.Header>
              <Card.Body style={{ maxHeight: "250px", overflowX: "auto", overflowY: "auto" }}>
                <div >
                  {isLoading ? <SmallLoader /> : <table style={{ width: "100%" }}>
                    <thead>
                      <tr>

                        <th>Reports</th>

                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filters?.reports?.map((report) => (
                        <tr key={report.id} style={{ marginBottom: '10px' }}>

                          <td>{report.report_name}</td>

                          <td>
                            <button
                              onClick={() => handleDownload(report)}>
                              <i className="fa fa-download" style={{ fontSize: "18px", color: "#4663ac" }}></i>

                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>}

                </div>

              </Card.Body>
            </Card>
          </Col>

        </Row>
        <Row className="mt-5 d-flex align-items-stretch" >
          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            {
              // Conditionally render the chart or a loader based on availability of data
              Stockstatsloading || !BarGraphStockStats ?
                <SmallLoader title="Stocks" /> :
                <Card className="h-100">
                  <Card.Header className="p-4">
                    <h4 className="card-title"> Stocks </h4>
                  </Card.Header>
                  <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <div style={{ width: "300px", height: "300px" }}>

                      <Doughnut
                        data={BarGraphStockStats?.stock_graph_data}
                        options={BarGraphStockStats?.stock_graph_options}
                        height="100px"
                      />

                    </div>
                  </Card.Body>
                </Card>}
          </Col>
          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            {Shrinkagestatsloading || !Shrinkagestats || !Shrinkagestats.shrinkage_graph_data || !Shrinkagestats.shrinkage_graph_options ?
              <SmallLoader title="Shrinkage" /> :
              <CeoDashboardBarChart
                data={Shrinkagestats.shrinkage_graph_data}
                options={Shrinkagestats.shrinkage_graph_options}
                title={"Shrinkage"}
                width={"300px"}
                height={"200px"}
              />
            }
          </Col>



          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            <Card className="h-100">
              <Card.Header className="p-4">
                <h4 className="card-title"> Stock Details </h4>
              </Card.Header>
              <Card.Body >
                <div style={{ width: "400px", height: "200px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Aging</th>

                      </tr>
                    </thead>
                    <tbody>
                      {stockAgingDetails.map((stock) => (
                        <tr key={stock.id}>
                          <td>{stock.id}</td>
                          <td>{stock.itemName}</td>
                          <td>{stock.quantity}</td>
                          <td>{stock.stockAge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </Card.Body>
            </Card>

          </Col>

        </Row>






      </div>
    </>
  );
};

export default withApi(CeoDashBoard);
