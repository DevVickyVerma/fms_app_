
import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import Loaderimg from "../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import DashboardMultiLineChart from "./DashboardMultiLineChart";
import * as Yup from "yup";
import DashboardStatCard from "./DashboardStatCard";
import FiltersComponent from "./DashboardHeader";
import ChartCard from "./ChartCard";
import { handleFilterData } from "../../Utils/commonFunctions/commonFunction";
import { Card, Col, Row } from "react-bootstrap";
import CeoDashboardStatsBox from "./DashboardStatsBox/CeoDashboardStatsBox";
import {
  Bardata,
  Baroptions,
  Doughnutdata,
  Doughnutoptions,
  priceLogData,
  StackedBarChartdata,
  StackedBarChartoptions,
  stockAgingDetails,
} from "../../Utils/commonFunctions/CommonData";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import { Doughnut } from "react-chartjs-2";
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import UpercardsCeoDashboardStatsBox from "./DashboardStatsBox/UpercardsCeoDashboardStatsBox";
import CeoDashboardFilterModal from "../pages/Filtermodal/CeoDashboardFilterModal";
import FormikSelect from "../Formik/FormikSelect";


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

  // const currentDate = new Date();
  // const currentYear = currentDate.getFullYear();
  // const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based, so add 1

  // // Format current month to match the 'values' format (yyyyMM)
  // const currentMonthFormatted = `${currentYear}${currentMonth.toString().padStart(2, '0')}`;

  // // Find the current month object from the filters
  // var currentMonthObject = filters.reportmonths.find(item => item.values === currentMonthFormatted);

  // console.log(currentMonthObject, "currentMonthObject");
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
    }
  });

  const FetchFilterData = async (filters) => {
    console.log(filters, "FetchFilterData");

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




  const dropdown = { color: 'primary' };

  const [pdfisLoading, setpdfisLoading] = useState(false);
  console.log(filters, "filters?.reports");
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedMonthDetails, setSelectedMonthDetails] = useState();

  const handleDownload = async (report) => {
    console.log(report, "report");
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
      const commonParams = `/download-report/${report?.report_code}?${clientIDCondition}company_id=${filters.company_id}&site_id[]=${encodeURIComponent(filters.site_id)}&month=${selectedMonthDetails?.value}`;

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


  console.log(filters.reportmonths, "filters.reportmonths");
  const handleMonthChange = (selectedId) => {
    console.log(selectedId, "selectedId");
    setSelectedMonth(selectedId);
    const selectedItem = filters.reportmonths.find((item) => item.display == (selectedId));
    setSelectedMonthDetails(selectedItem);
    console.log("Selected Item:", selectedItem);
  };

  return (
    <>
      {isLoading || pdfisLoading ? <Loaderimg /> : null}

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

        {/* <Row style={{ marginBottom: '10px', marginTop: '20px' }}>
          <ChartCard
            title="Total Stats"
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
        </Row> */}
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
        <CeoDashboardStatsBox
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




        <Row>
          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            <CeoDashboardBarChart data={Bardata} options={Baroptions} title={"Current Month vs Previous Month"} />
          </Col>
          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            <CeoDashboardBarChart data={Bardata} options={Baroptions} title={"Actual Sales vs Budgeted Sales"} />
          </Col>
          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            <CeoDashboardBarChart data={Bardata} options={Baroptions} title={"Same Month Sales vs Previous Year’s Month Sales"} />
          </Col>
        </Row>



        <Row className="d-flex align-items-stretch mt-5 ">
          <Col sm={12} md={8} key={Math.random()}>
            <Card className="h-100">
              <Card.Header className="p-4">
                <div className="spacebetween" style={{ width: "100%" }}>
                  <h4 className="card-title"> Selling Price Logs (Site 1) </h4>
                  {/* <a
    onClick={toggleDropdown}
    style={{ alignItems: "end", textDecoration: "underline", cursor: "pointer" }}
  >
    ....
  </a> */}

                  <Dropdown as={ButtonGroup} key={Math.random()}>

                    <Dropdown.Toggle split variant={dropdown.color} />

                    <Dropdown.Menu className="super-colors">

                      <Dropdown.Item className="p-2" eventKey="1">Site 1</Dropdown.Item>
                      <hr className="p-0 m-0"></hr>
                      <Dropdown.Item className="p-2" eventKey="2">Site 2</Dropdown.Item>

                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <div>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Selling</th>
                        <th>Old Price</th>
                        <th>New Price</th>
                        <th>Updated By</th>
                        <th>Update Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceLogData?.map((log) => (
                        <tr key={log.id}>
                          <td>{log.id}</td>
                          <td>{log.productName}</td>
                          <td>£{log.oldPrice.toFixed(2)}</td>
                          <td>£{log.newPrice.toFixed(2)}</td>
                          <td>{log.updatedBy}</td>
                          <td>{log.updateDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </Card.Body>
            </Card>



          </Col>
          <Col sm={12} md={4} key={Math.random()}>
            <Card className="h-100">
              <Card.Header className="p-4 w-100 flexspacebetween">
                <h4 className="card-title"> Reports</h4>
                <div >

                  <Col lg={6} style={{ marginRight: "0px" }}>
                    <select
                      id="selectedMonth"
                      value={selectedMonth}
                      onChange={(e) => handleMonthChange(e.target.value)}
                      className="form-group"
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
              </Card.Header>
              <Card.Body className="pt-0">
                <div >

                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>

                        <th>Report Name</th>

                        <th>Actions</th>
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
                  </table>
                </div>

              </Card.Body>
            </Card>
          </Col>

        </Row>
        <Row className="mt-5 d-flex align-items-stretch" >
          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            <Card className="h-100">
              <Card.Header className="p-4">
                <h4 className="card-title"> Stocks </h4>
              </Card.Header>
              <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                <div style={{ width: "300px", height: "300px" }}>
                  <Doughnut data={Doughnutdata} options={Doughnutoptions} height="100px" />
                </div>

              </Card.Body>
            </Card>

          </Col>
          <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
            <CeoDashboardBarChart data={StackedBarChartdata} options={StackedBarChartoptions} title={"Shrinkage"} width={"300px"} height={"200px"} />
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
