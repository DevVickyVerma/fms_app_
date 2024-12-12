import CeoDashboardCharts from "../CeoDashboardCharts";
import {
  Baroptions,
  salesGraphData,
  Shrinkage,
  StockData,
  StockDetail,
} from "../../../Utils/commonFunctions/CommonData";
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
import withApi from "../../../Utils/ApiHelper";
useEffect;
import CeoDashboardStatsBox from "../DashboardStatsBox/CeoDashboardStatsBox";
import { Bounce, toast } from "react-toastify";
import {
  Comparisongraphfilter,
  request,
} from "../../../Utils/commonFunctions/commonFunction";
import MultiDateRangePicker from "../../../Utils/MultiDateRangePicker";

const CeoDetailModal = (props) => {
  const { title, getData, visible, onClose, values, isLoading, filterData } =
    props; // Ensure `values` is passed correctly

  const [apiData, setApiData] = useState(); // to store API response data
  const [loading, setLoading] = useState(false);

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  useEffect(() => {
    if (visible && filterData?.sites) {
      if (filterData?.site_id) {
        formik.setFieldValue("selectedSite", filterData?.site_id);
        formik.setFieldValue("site_name", filterData?.site_name);
      } else {
        formik.setFieldValue("selectedSite", filterData?.sites?.[0]?.id);
        formik.setFieldValue("site_name", filterData?.sites?.[0]?.site_name);
      }
    }
  }, [visible]);

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      comparison_value: "0",
      selectedSite: "",
      site_name: "",
      selectedSiteDetails: "",
      selectedMonth: "",
      selectedMonthDetails: "",
      startDate: null,
      endDate: null,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const handleMonthChange = (selectedId) => {
    const selectedItem = apiData?.data?.months?.find(
      (item) => item.display == selectedId
    );
    formik.setFieldValue("selectedMonth", selectedId);
    formik.setFieldValue("selectedMonthDetails", selectedItem);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      // When dates are selected
      formik.setFieldValue("startDate", dates[0] ?? null);
      formik.setFieldValue("endDate", dates[1] ?? null);
    } else {
      // When the date picker is cleared
      formik.setFieldValue("startDate", null);
      formik.setFieldValue("endDate", null);
    }
  };

  console.log(filterData, "filterData");

  const [pdfisLoading, setpdfisLoading] = useState(false);
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
          formData.append("client_id", filterData.client_id);
        } else {
          formData.append("client_id", filterData.client_id);
        }

        // Add other necessary form values
        formData.append("company_id", filterData.company_id);

        // Prepare client ID condition for the query params
        let clientIDCondition =
          superiorRole !== "Client"
            ? `client_id=${filterData.client_id}&`
            : `client_id=${filterData.client_id}&`;

        // Construct commonParams basedd on toggleValue
        const commonParams = `/download-report/${
          report?.report_code
        }?${clientIDCondition}company_id=${
          filterData.company_id
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
  const handleSiteChange = async (selectedId) => {
    try {
      const selectedItem = await filterData?.sites.find(
        (item) => item.id === selectedId
      );

      await formik.setFieldValue("selectedSite", selectedId);
      await formik.setFieldValue("selectedSiteDetails", selectedItem);
    } catch (error) {
      console.error("Error in handleCancelledAction:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Trigger the fetchData function on component mount or title change
  }, [title]); // Dependencies: title and selectedSite

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading indicator

      // Dynamically build query parameters
      const queryParams = new URLSearchParams();
      if (filterData?.client_id)
        queryParams.append("client_id", filterData.client_id);
      if (filterData?.company_id)
        queryParams.append("company_id", filterData.company_id);
      if (filterData?.site_id)
        queryParams.append("site_id", filterData.site_id);
      const queryString = queryParams.toString(); // Construct the query string

      let response;
      // Dynamically handle API calls based on the title
      switch (title) {
        case "MOP Breakdown":
          response = await getData(`ceo-dashboard/mop-stats?${queryString}`);
          break;
        case "Comparison":
          response = await getData(`ceo-dashboard/sales-stats?${queryString}`);
          break;
        case "Performance":
          response = await getData(
            `ceo-dashboard/site-performance?${queryString}`
          );
          break;
        case "Reports":
          response = await getData(
            `client/reportlist?client_id=${filterData?.client_id}`
          );
          break;
        case "Live Margin":
          response = await getData(`dashboard/get-live-margin?${queryString}`);
          break;
        case "Daily Wise Sales":
          response = await getData(`dashboard/stats?${queryString}`);
          break;
        case "Stock":
          response = await getData(`ceo-dashboard/stock-stats?${queryString}`);
          break;
        case "Shrinkage":
          response = await getData(
            `ceo-dashboard/shrinkage-stats?${queryString}`
          );
          break;
        case "Stock Details":
          response = await getData(
            `ceo-dashboard/department-item-stocks?${queryString}`
          );
          break;
        default:
          console.log("Title not recognized");
      }

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
  const [selectedOption, setSelectedOption] = useState("");
  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(e.target.value); // You can replace this with any logic for each option
  };

  return (
    <>
      {isLoading || pdfisLoading ? <LoaderImg /> : ""}

      <div
        className={`common-sidebar    ${
          visible ? "visible slide-in-right " : "slide-out-right"
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
            <h3 className="SidebarSearch-title m-0">
              {title !== "Live Margin" ? (
                title
              ) : (
                <>
                  <img
                    src={require("../../../assets/images/commonimages/LiveIMg.gif")}
                    alt="Live Img"
                    className="Liveimage"
                  />{" "}
                  Margins{" "}
                  <span> Last Updated On {apiData?.data?.last_updated}</span>
                </>
              )}
            </h3>

            <button className="close-button" onClick={onClose}>
              {/* <FontAwesomeIcon icon={faTimes} /> */}
              <i className="ph ph-x-circle c-fs-25"></i>
            </button>
          </div>
          <div
            className="card-body scrollview"
            style={{ background: "#f2f3f9" }}
          >
            {title == "MOP Breakdown" && (
              <>
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      {filterData?.sites ? (
                        <Col lg={6} className="">
                          <label className=" form-label" htmlFor="Site">
                            Site
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            id="selectedSite"
                            name="selectedSite"
                            value={formik.values.selectedSite}
                            onChange={(e) => handleSiteChange(e.target.value)}
                            class="input101 "
                          >
                            <option value="">--Select a Site--</option>
                            {filterData?.sites?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.site_name}
                              </option>
                            ))}
                          </select>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>
                  </Card.Body>
                </Card>

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
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      {filterData?.sites ? (
                        <Col lg={4} className="">
                          <label className=" form-label" htmlFor="Site">
                            Site
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            id="selectedSite"
                            name="selectedSite"
                            value={formik.values.selectedSite}
                            onChange={(e) => handleSiteChange(e.target.value)}
                            class="input101 "
                          >
                            <option value="">--Select a Site--</option>
                            {filterData?.sites?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.site_name}
                              </option>
                            ))}
                          </select>
                        </Col>
                      ) : (
                        ""
                      )}
                      {filterData?.sites ? (
                        <Col lg={4} className="">
                          <label className=" form-label" htmlFor="Site">
                            Filter
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            id="comparison_value"
                            name="comparison_value"
                            value={formik?.values?.comparison_value}
                            onChange={formik.handleChange}
                            // onChange={handleDropdownChange}
                            // className="selectedMonth"
                            class="input101 "
                          >
                            {Comparisongraphfilter?.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </Col>
                      ) : (
                        ""
                      )}
                      {filterData?.sites &&
                      formik?.values?.comparison_value === "5" ? (
                        <Col lg={4} className="">
                          <label className=" form-label" htmlFor="Site">
                            Select Custom Date Range
                            <span className="text-danger">*</span>
                          </label>
                          <MultiDateRangePicker
                            startDate={formik.values.startDate}
                            endDate={formik.values.endDate}
                            onChange={handleDateChange}
                          />
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>
                  </Card.Body>
                </Card>
                <CeoDashboardCharts
                  selectedOption={selectedOption}
                  Salesstatsloading={false}
                  BarGraphSalesStats={salesGraphData}
                  Baroptions={Baroptions}
                  formik={formik}
                />
              </>
            )}
            {title == "Live Margin" && (
              <>
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      {filterData?.sites ? (
                        <Col lg={4} className="">
                          <label className=" form-label" htmlFor="Site">
                            Site
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            id="selectedSite"
                            name="selectedSite"
                            value={formik.values.selectedSite}
                            style={{ width: "100%" }}
                            onChange={(e) => handleSiteChange(e.target.value)}
                            // className="selectedMonth"
                            class="input101 "
                          >
                            <option value="">--Select a Site--</option>
                            {filterData?.sites?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.site_name}
                              </option>
                            ))}
                          </select>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>
                  </Card.Body>
                </Card>
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card dash-plates-1 img-card box-${request[0].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  <span className="l-sign">ℓ</span>{" "}
                                  {apiData?.data?.gross_volume}
                                </h2>
                                <p className="text-white mb-0">Gross Volume</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-drop text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-2 img-card box-${request[1].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  {" "}
                                  £ {apiData?.data?.fuel_sales}
                                </h2>
                                <p className="text-white mb-0">Fuel Sales</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-shopping-bag text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-3 img-card box-${request[2].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  £ {apiData?.data?.gross_profit}
                                </h2>
                                <p className="text-white mb-0">Gross Profit</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-currency-gbp text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-1 img-card box-${request[3].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  {" "}
                                  {apiData?.data?.gross_margin} ppl
                                </h2>
                                <p className="text-white mb-0">Gross Margin</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-lightning text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-2 img-card box-${request[4].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  £ {apiData?.data?.shop_sales}
                                </h2>
                                <p className="text-white mb-0">Shop Sales</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-shopping-bag text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col sm={12} md={6} lg={6} xl={4}>
                        <Card
                          className={`card  dash-plates-3 img-card box-${request[5].color}-shadow`}
                        >
                          <Card.Body>
                            <div className="d-flex">
                              <div className="text-white">
                                <h2 className="mb-0 number-font">
                                  £ {apiData?.data?.shop_profit}
                                </h2>
                                <p className="text-white mb-0">Shop Profit</p>
                              </div>
                              <div className="ms-auto">
                                <i className="ph ph-currency-gbp text-white fs-30"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}
            {title == "Performance" && (
              <>
                <CeoDashSitetable
                  data={apiData?.data}
                  tootiptitle={"Profit"}
                  title={"Sites "}
                />
              </>
            )}
            {title == "Reports" && (
              <>
                <Col sm={12} md={12} key={Math.random()}>
                  <Card className="">
                    <Card.Body className="">
                      <div className="w-100">
                        <div className="spacebetweenend">
                          {filterData?.sites ? (
                            <Col lg={6} className="textend flexcolumn">
                              <label className=" form-label" htmlFor="report">
                                Site
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="selectedSite"
                                name="selectedSite"
                                value={formik.values.selectedSite}
                                style={{ width: "100%" }}
                                onChange={(e) =>
                                  handleSiteChange(e.target.value)
                                }
                                className="selectedMonth"
                              >
                                <option value="">--Select a Site--</option>
                                {filterData?.sites?.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.site_name}
                                  </option>
                                ))}
                              </select>
                            </Col>
                          ) : (
                            ""
                          )}
                          {apiData?.data?.months ? (
                            <Col lg={6} className="textend flexcolumn">
                              <label className=" form-label" htmlFor="report">
                                Month
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                id="selectedMonth"
                                name="selectedMonth"
                                style={{ width: "100%" }}
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
                    </Card.Body>
                  </Card>
                  <Card className="">
                    <Card.Header className="p-4 w-100  ">
                      <div className="spacebetweenend">
                        <h4 className="card-title">
                          Reports{" "}
                          {formik.values?.selectedSiteDetails?.site_name &&
                            ` (${formik.values.selectedSiteDetails.site_name})`}
                        </h4>
                        {userPermissions?.includes("report-type-list") ? (
                          <span className="textend">
                            <Link to="/reports">View All</Link>
                          </span>
                        ) : (
                          ""
                        )}
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
                <Card className="">
                  <Card.Body className="">
                    <Row>
                      {filterData?.sites ? (
                        <Col lg={6} className="">
                          <label className=" form-label" htmlFor="Site">
                            Site
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            id="selectedSite"
                            name="selectedSite"
                            value={formik.values.selectedSite}
                            onChange={(e) => handleSiteChange(e.target.value)}
                            class="input101 "
                          >
                            <option value="">--Select a Site--</option>
                            {filterData?.sites?.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.site_name}
                              </option>
                            ))}
                          </select>
                        </Col>
                      ) : (
                        ""
                      )}
                    </Row>
                  </Card.Body>
                </Card>

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
              </>
            )}
            {(title === "Stock" ||
              title === "Shrinkage" ||
              title === "Stock Details") && (
              <>
                <Row className=" d-flex align-items-stretch">
                  <Col
                    sm={12}
                    md={6}
                    xl={6}
                    key={Math.random()}
                    className="mb-6"
                  >
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
                  <Col
                    sm={12}
                    md={6}
                    xl={6}
                    key={Math.random()}
                    className="mb-6"
                  >
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
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
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
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
                                  Name
                                </th>
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
                                  Gross Sales
                                </th>
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
                                  Nett Sales
                                </th>
                                <th
                                  style={{ textAlign: "left", padding: "8px" }}
                                >
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

export default withApi(CeoDetailModal);
