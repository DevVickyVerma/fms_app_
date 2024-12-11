import PropTypes from "prop-types";
import CeoDashboardCharts from "../CeoDashboardCharts";
import {
  Baroptions,
  cardConfigs,
  DashboardData,
  intialfilterData,
  MopData,
  PerformanceData,
  ReportList,
  salesGraphData,
  Shrinkage,
  StockData,
  StockDetail,
} from "../../../Utils/commonFunctions/CommonData";
import CEODashCommonCard from "../CEODashCommonCard";
import { Card, Col, Row } from "react-bootstrap";
import CeoDashSitetable from "../CeoDashSitetable";
import ReportTable from "../ReportTable";
import { Doughnut } from "react-chartjs-2";
import CeoDashboardBarChart from "../CeoDashboardBarChart";
import DashboardMultiLineChart from "../DashboardMultiLineChart";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LoaderImg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper"; useEffect
import axios from "axios";
import CeoDashboardStatsBox from "../DashboardStatsBox/CeoDashboardStatsBox";

const CeoMopModal = (props) => {

  const { title, getData, visible, onClose, values, isLoading, filterData } = props; // Ensure `values` is passed correctly
  const [filters, setFilters] = useState(intialfilterData);


  const [apiData, setApiData] = useState(); // to store API response data
  const [loading, setLoading] = useState(false);
  console.log(isLoading, "isLoading");

  const fetchData = async () => {


    setLoading(true); // Start loading indicator

    try {
      let response;
      // Dynamically build query parameters
      const queryParams = new URLSearchParams();
      if (filterData?.client_id) queryParams.append("client_id", filterData.client_id);
      if (filterData?.company_id) queryParams.append("company_id", filterData.company_id);
      if (filterData?.site_id) queryParams.append("site_id", filterData.site_id);
      const queryString = queryParams.toString(); // Construct the query string

      // Check the title and fetch data accordingly
      switch (title) {
        case "MOP Breakdown":
          response = await getData(`ceo-dashboard/mop-stats?${queryString}`);
          break;
        case "Comparison":
          response = await getData(`ceo-dashboard/sales-stats?${queryString}`);
          break;
        // Add other cases for additional titles
        case "Performance":
          response = await getData(`ceo-dashboard/site-performance?${queryString}`);
          break;
        case "Reports":
          response = await getData(`client/reportlist?client_id=${filterData?.client_id}`);
          break;
        case "Daily Wise Sales":
          response = await getData(`dashboard/stats?${queryString}`);
          break;
        case "Stock":
          response = await getData(`client/stock?${queryString}`);
          break;
        case "Shrinkage":
          response = await getData(`client/shrinkage?${queryString}`);
          break;
        case "Stock Details":
          response = await getData(`client/stock-details?${queryString}`);
          break;
        // Add more titles as needed
        default:
          console.log("Title not recognized");
      }

      // Check if response exists and process it
      if (response) {
        console.log(response, "response");
        setApiData(response.data); // Assuming response has a 'data' field
      }
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };


  useEffect(() => {
    fetchData(); // Trigger the fetchData function on component mount or title change
  }, [title]); // Dependencies: title and filterData



  const CeohandleNavigateClick = () => {
    console.log("CeohandleNavigateClick");
  };

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
  const handleMonthChange = (selectedId) => {
    const selectedItem = filters.reportmonths.find(
      (item) => item.display == selectedId
    );
    formik.setFieldValue("selectedMonth", selectedId);
    formik.setFieldValue("selectedMonthDetails", selectedItem);
  };
  const [pdfisLoading, setpdfisLoading] = useState(false);
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
        const commonParams = `/download-report/${report?.report_code
          }?${clientIDCondition}company_id=${filters.company_id
          }&site_id[]=${encodeURIComponent(formik.values?.selectedSite)}&month=${formik?.values?.selectedMonthDetails?.value
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
            `Errorsss ${response.status}: ${errorData?.message || "Something went wrong!"
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

  return (
    <>
      {isLoading || pdfisLoading ? <LoaderImg /> : ""}

      <div
        className={`common-sidebar    ${visible ? "visible slide-in-right " : "slide-out-right"
          }`}
        style={{
          width:
            title == "MOP Breakdown"
              ? "50%"
              : title == "Reports"
                ? "40"
                : title == "Comparison"
                  ? "70%"
                  : "70%",
        }}
      >


        <div className="card">
          <div className="card-header text-center SidebarSearchheader">
            <h3 className="SidebarSearch-title m-0">{title}</h3>
            <button className="close-button" onClick={onClose}>
              {/* <FontAwesomeIcon icon={faTimes} /> */}
              <i className="ph ph-x-circle c-fs-25"></i>
            </button>
          </div>
          <div className="card-body scrollview" style={{ background: "#f2f3f9" }}>
            {title == "MOP Breakdown" && (
              <>
                <Row>
                  <CeoDashboardStatsBox
                    dashboardData={apiData?.data}
                    Mopstatsloading={loading}

                  />
                </Row>
              </>
            )}
            {title == "Comparison" && (
              <>
                <CeoDashboardCharts
                  Salesstatsloading={false}
                  BarGraphSalesStats={salesGraphData}
                  Baroptions={Baroptions}
                />
              </>
            )}
            {title == "Performance" && (
              <>
                <CeoDashSitetable
                  data={PerformanceData?.top}
                  tootiptitle={"Profit"}
                  title={"Sites "}
                />
              </>
            )}
            {title == "Reports" && (
              <>
                <Col sm={12} md={12} key={Math.random()}>
                  <Card className="">
                    <Card.Header className="p-4 w-100  ">
                      <div className="w-100">
                        <div className="spacebetweenend">
                          <div>
                            <h4 className="card-title">Reports </h4>

                            {userPermissions?.includes("report-type-list") ? (
                              <span className="text-muted hyper-link">
                                <Link to="/reports">View All</Link>
                              </span>
                            ) : (
                              ""
                            )}
                          </div>

                          {apiData?.data?.months ? (
                            <Col lg={6} className="textend p-0">
                              <select
                                id="selectedMonth"
                                name="selectedMonth"
                                value={formik.values.selectedMonth}
                                onChange={(e) =>
                                  handleMonthChange(e.target.value)
                                }
                                className="selectedMonth"
                              >
                                <option value="">--Select a Month--</option>
                                {apiData?.data?.months?.map((item) => (
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
                        <div className="spacebetweenend"></div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div>
                        <ReportTable
                          reports={apiData?.data?.reports}
                          pdfisLoading={pdfisLoading}
                          handleDownload={handleDownload}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}
            {title == "Daily Wise Sales" && (
              <>
                <Col sm={12} md={12} key={Math.random()}>
                  <Card className="">
                    <Card.Header className="p-4 w-100  ">
                      <div className="w-100">
                        <div className="spacebetweenend">
                          <h4 className="card-title">Daily Wise Sales </h4>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div>
                        <DashboardMultiLineChart
                          LinechartValues={
                            apiData?.data?.d_line_graph?.series || []
                          }
                          LinechartOption={
                            apiData?.data?.d_line_graph?.option?.labels || []
                          }
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}
            {(title === "Stock" ||
              title === "Shrinkage" ||
              title === "Stock Details") && (
                <>
                  <Row className=" d-flex align-items-stretch">
                    <Col sm={12} md={6} xl={6} key={Math.random()} className="mb-6">
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
                              data={StockData?.stock_graph_data}
                              options={StockData?.stock_graph_options}
                              height="100px"
                            />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={12} md={6} xl={6} key={Math.random()} className="mb-6">
                      <CeoDashboardBarChart
                        data={Shrinkage?.shrinkage_graph_data}
                        options={Shrinkage?.shrinkage_graph_options}
                        title="Shrinkage"
                        width="300px"
                        height="200px"
                      />
                    </Col>
                    <Col sm={12} md={12} xl={12} key={Math.random()} className="">
                      <Card className="h-100">
                        <Card.Header className="p-4 w-100 flexspacebetween">
                          <h4 className="card-title">
                            {" "}
                            <div className="lableWithsmall">Stock Details</div>
                          </h4>
                          <span style={{ color: "#4663ac", cursor: "pointer" }}>
                            View Details
                          </span>
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
                                </tr>
                              </thead>
                              <tbody>
                                {StockDetail?.map((stock) => (
                                  <tr key={stock?.id}>
                                    <td style={{ padding: "8px" }}>
                                      {stock?.name}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {stock?.gross_sales}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {stock?.nett_sales}
                                    </td>
                                    <td style={{ padding: "8px" }}>
                                      {stock?.profit}
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
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
};


export default withApi(CeoMopModal);

