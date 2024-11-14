import { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import { MultiSelect } from "react-multi-select-component";
import { Breadcrumb, Button, Card, Col, FormGroup, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import Switch from "react-switch";
import ShareReports from "./ShareReports";
import { useSelector } from "react-redux";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import FormikSelect from "../../Formik/FormikSelect";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const ManageReports = (props) => {
  const { isLoading, getData, } = props;
  const { handleError } = useErrorHandler();
  const [ReportList, setReportList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(localStorage.getItem("superiorId"));
  const [toggleValue, setToggleValue] = useState(false); // State for the toggle
  const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);
  const isSendReportPermissionAvailable = UserPermissions?.includes("send-report");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [pdfisLoading, setpdfisLoading] = useState(false);
  const handleCloseSidebar = () => {
    setSidebarVisible(true);
  };

  const handleToggleSidebar = async () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleToggleChange = (checked) => {
    setToggleValue(checked);

  };
  const ErrorToast = (message) => {
    toast.error(message, {
      // position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored",
    });
  };

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
  }, []);

  const FetchReportList = async (id) => {
    setReportList([])
    try {
      const response = await getData(`client/reportlist?client_id=${id}`);

      const { data } = response;
      if (data) {
        setReportList(response?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const DownloadReport = async (formValues) => {
    setpdfisLoading(true)
    try {
      const formData = new FormData();

      formData.append("report", formValues.report);

      // Add client_id based on superiorRole
      const superiorRole = localStorage.getItem("superiorRole");
      if (superiorRole !== "Client") {
        formData.append("client_id", formValues.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }

      // Add other necessary form values
      formData.append("company_id", formValues.company_id);
      formData.append("start_date", formValues.start_date);
      formData.append("end_date", formValues.end_date);

      // Prepare client ID condition for the query params
      let clientIDCondition = superiorRole !== "Client"
        ? `client_id=${formValues.client_id}&`
        : `client_id=${clientIDLocalStorage}&`;

      // Check for selected sites
      if (!formik?.values?.selectedSites || (Array.isArray(formik?.values?.selectedSites) && formik?.values?.selectedSites?.length === 0)) {
        ErrorToast("Please select at least one site");
        return;
      }

      // Prepare site IDs and query parameters
      const selectedSiteIds = formik?.values?.selectedSites?.map((site) => site.value);
      const selectedSiteIdParams = selectedSiteIds
        .map((id) => `site_id[]=${id}`)
        .join("&");

      // Construct commonParams based on toggleValue
      const commonParams = toggleValue
        ? `/download-report/${formValues.report}?${clientIDCondition}company_id=${formValues.company_id}&${selectedSiteIdParams}&from_date=${formValues.start_date}&to_date=${formValues.end_date}`
        : `/download-report/${formValues.report}?${clientIDCondition}company_id=${formValues.company_id}&${selectedSiteIdParams}&month=${formValues.reportmonth}`;

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
      link.setAttribute('download', `${formValues.reportName}.${fileExtension}`);
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


  function handleReportClick(item) {
    console.log(item, "handleReportClick");
  }

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
    return `${year}-${month}-${day}`;
  };
  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };

  const handleShowDate1 = () => {
    const inputDateElement = document.querySelector("#end_date");
    inputDateElement.showPicker();
  };
  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");

  const formik = useFormik({
    initialValues: {
      report: "",
      reportName: "",
      client_id: "",
      company_id: "",
      sites: [],
      start_date: "",
      end_date: "",
      reportmonth: "",
      selectedSites: [],
    },
    validationSchema: Yup.object({
      report: Yup.string().required("Report is required"),
      company_id: Yup.string().required("Company is required"),
      selectedSites: Yup.array()
        .min(1, 'At least one Site is required')
        .required('Companies are required'),
      client_id: isNotClient
        ? Yup.string().required("Client is required")
        : Yup.mixed().notRequired(), // Conditional validation based on toggleValue
      reportmonth: !toggleValue
        ? Yup.string().required('Report month is required')
        : Yup.mixed().notRequired(),  // If toggleValue is false, require reportmonth

      start_date: toggleValue
        ? Yup.string().required('Start date is required')
        : Yup.mixed().notRequired(),  // If toggleValue is true, require start_date

      end_date: toggleValue
        ? Yup.string().required('End date is required')
        : Yup.mixed().notRequired(),  // If toggleValue is true, require end_date
    }),

    onSubmit: (values) => {
      localStorage.setItem(storedKeyName, JSON.stringify(values));
      DownloadReport(values);
    },
  });

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;

      if (response?.data?.data) {
        formik.setFieldValue('clients', response?.data?.data);
      }
      if (data) {
        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          FetchReportList(clientId);

          if (response?.data) {
            const selectedClient = response?.data?.data?.find(
              (client) => client.id === clientId
            );
            if (selectedClient) {
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {

          formik.setFieldValue('companies', response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetSiteList = async (values) => {
    try {
      if (values) {
        const response = await getData(`common/site-list?company_id=${values}`);

        if (response) {

          setSiteList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  let storedKeyName = "localFilterModalData";

  useEffect(() => {
    const storedDataString = localStorage.getItem(storedKeyName);

    if (storedDataString) {
      const parsedData = JSON.parse(storedDataString);
      formik.setValues(parsedData);

      if (!parsedData?.report) {
        formik?.setFieldValue("report", "")
      }
      if (!parsedData?.selectedSites) {
        formik?.setFieldValue("selectedSites", [])
      }

      if (parsedData?.client_id) {
        GetCompanyList(parsedData?.client_id);
        FetchReportList(parsedData?.client_id);
      }

      if (parsedData?.company_id) {
        GetSiteList(parsedData?.company_id);
      }
    }

    if (!storedDataString && localStorage.getItem("superiorRole") === "Client") {
      const clientId = localStorage.getItem("superiorId");
      if (clientId) {
        handleClientChange({ target: { value: clientId } });
      }
    }
    if (!storedDataString && localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    }
  }, []);



  const handleClientChange = (e) => {
    const clientId = e.target.value;
    formik.setFieldValue('client_id', clientId);

    if (clientId) {
      GetCompanyList(clientId);
      FetchReportList(clientId);
      const selectedClient = formik.values.clients.find(client => client?.id === clientId);
      formik.setFieldValue('client_name', selectedClient?.client_name || "");
      formik.setFieldValue('companies', selectedClient?.companies || []);
      formik.setFieldValue('sites', []);
      formik.setFieldValue('selectedSites', []);

      formik.setFieldValue('company_id', "");
      formik.setFieldValue('site_id', "");
      formik.setFieldValue('reportName', "");
      formik.setFieldValue('report', "");
    } else {
      formik.setFieldValue('client_name', "");
      formik.setFieldValue('companies', []);
      formik.setFieldValue('sites', []);
      formik.setFieldValue('selectedSites', []);

      formik.setFieldValue('company_id', "");
      formik.setFieldValue('site_id', "");
      formik.setFieldValue('reportName', "");
      formik.setFieldValue('report', "");
      setReportList([])
    }
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    formik.setFieldValue('company_id', companyId);

    if (companyId) {
      GetSiteList(companyId);
      formik.setFieldValue('site_id', "");
      formik.setFieldValue('selectedSites', []);

      const selectedCompany = formik.values.companies.find(company => company?.id === companyId);
      formik.setFieldValue('company_name', selectedCompany?.company_name || "");
    } else {
      formik.setFieldValue('company_name', "");
      formik.setFieldValue('sites', []);
      formik.setFieldValue('selectedSites', []);

      formik.setFieldValue('site_id', "");
      formik.setFieldValue('site_name', "");
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    formik.setFieldValue('selectedSites', selectedOptions);
  };

  return <>
    {isLoading || pdfisLoading ? <Loaderimg /> : null}
    <>


      <Suspense fallback={<img src={Loaderimg} alt="Loading" />}>
        <ShareReports
          title={"Share Reports"}
          visible={sidebarVisible}
          onClose={handleCloseSidebar}
        />
      </Suspense>


      <div className="page-header d-flex flex-wrap">
        <div className="mb-2 mb-sm-0">
          <h1 className="page-title">Manage Reports</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Manage Reports
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>


      </div>



      <Row>
        <Col md={12} xl={12}>
          <Card>
            <Card.Header className=" w-100 d-flex justify-content-between">
              <h3 className="card-title">Manage Reports</h3>

              <div className="">
                <div className="input-group">
                  {isSendReportPermissionAvailable ? (
                    <Button
                      type="button"
                      className="btn btn-primary "
                      style={{ borderRadius: "4px" }}
                      onClick={
                        isSendReportPermissionAvailable ? () => handleToggleSidebar() : null
                      }
                    >  Share Report
                      <i className="ph ph-share ms-1" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <form onSubmit={formik.handleSubmit}>
                <Row>

                  {localStorage.getItem('superiorRole') !== 'Client' && (
                    <Col lg={4} md={6} className=" mt-4">
                      <FormikSelect
                        formik={formik}
                        name="client_id"
                        label="Client"
                        options={formik?.values?.clients?.map((item) => ({ id: item?.id, name: item?.full_name }))}
                        className="form-input "
                        onChange={handleClientChange}
                      />
                    </Col>
                  )}


                  <Col lg={4} md={6} className=" mt-4">
                    <FormikSelect
                      formik={formik}
                      name="company_id"
                      label="Company"
                      options={formik?.values?.companies?.map((item) => ({ id: item?.id, name: item?.company_name }))}
                      className="form-input"
                      onChange={handleCompanyChange}
                    />
                  </Col>


                  <Col lg={4} md={6}>
                    <FormGroup>
                      <label className="form-label mt-4">
                        Select Sites
                        <span className="text-danger">*</span>
                      </label>
                      <MultiSelect
                        value={formik?.values?.selectedSites || []}
                        onChange={handleMultiSelectChange}
                        labelledBy="Select Sites"
                        disableSearch="true"
                        options={SiteList?.map((item) => ({
                          value: item?.id,
                          label: item?.site_name,
                        })) || []}
                        showCheckbox="false"
                      />
                      {formik.touched.selectedSites && typeof formik.errors.selectedSites === 'string' && (
                        <div className='text-danger mt-1'>{formik.errors.selectedSites}</div>
                      )}
                    </FormGroup>
                  </Col>

                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className=" form-label mt-4" htmlFor="report">
                        Report
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        as="select"
                        className={`input101 ${formik.errors.report && formik.touched.report
                          ? "is-invalid"
                          : ""
                          }`}
                        id="report"
                        name="report"
                        value={formik?.values?.report}
                        onChange={(e) => {
                          const selectedReportCode = e.target.value;

                          // Find the selected report name based on the selected report code
                          const selectedReport = ReportList.data?.reports?.find(
                            (item) => item.report_code === selectedReportCode
                          );


                          let selectedReportName = selectedReport?.report_name || "";
                          selectedReportName = selectedReportName.replace(/\s/g, "");

                          // Store both report_code and report_name in Formik state
                          formik.setFieldValue("report", selectedReportCode);
                          formik.setFieldValue("reportName", selectedReportName); // Assuming 'reportName' is part of formik initialValues
                        }}
                      >
                        <option value="">Select a Report</option>
                        {ReportList.data &&
                          ReportList?.data?.reports.length > 0 ? (
                          ReportList?.data?.reports.map((item) => (
                            <option
                              key={item.id}
                              value={item.report_code}
                              onClick={() => handleReportClick(item)}
                            >
                              {item.report_name}
                            </option>
                          ))
                        ) : (
                          <option disabled={true}>No Report</option>
                        )}
                      </select>

                      {formik.errors.report && formik.touched.report && (
                        <div className="text-danger mt-1">
                          {formik.errors.report}
                        </div>
                      )}
                    </div>
                  </Col>
                  {toggleValue ? (
                    <>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="start_date"
                            className="form-label mt-4"
                          >
                            Start Date
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            min={"2023-01-01"}
                            max={getCurrentDate()}
                            onClick={handleShowDate}
                            className={`input101 ${formik.errors.start_date &&
                              formik.touched.start_date
                              ? "is-invalid"
                              : ""
                              }`}
                            id="start_date"
                            name="start_date"
                            onChange={(e) => {
                              const selectedstart_date = e.target.value;

                              formik.setFieldValue(
                                "start_date",
                                selectedstart_date
                              );

                            }}
                            value={formik.values.start_date}
                          />
                          {formik.errors.start_date &&
                            formik.touched.start_date && (
                              <div className="text-danger mt-1">
                                {formik.errors.start_date}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="end_date"
                            className="form-label mt-4"
                          >
                            End Date
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            min={"2023-01-01"}
                            max={getCurrentDate()}
                            onClick={handleShowDate1}
                            className={`input101 ${formik.errors.end_date &&
                              formik.touched.end_date
                              ? "is-invalid"
                              : ""
                              }`}
                            id="end_date"
                            name="end_date"
                            onChange={(e) => {
                              const selectedend_date_date = e.target.value;

                              formik.setFieldValue(
                                "end_date",
                                selectedend_date_date
                              );

                            }}
                            value={formik.values.end_date}
                          />
                          {formik.errors.end_date &&
                            formik.touched.end_date && (
                              <div className="text-danger mt-1">
                                {formik.errors.end_date}
                              </div>
                            )}
                        </div>
                      </Col>
                    </>
                  ) : (
                    ""
                  )}

                  {!toggleValue ? (
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          className=" form-label mt-4"
                          htmlFor="reportmonth"
                        >
                          Months
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${formik.errors.reportmonth &&
                            formik.touched.reportmonth
                            ? "is-invalid"
                            : ""
                            }`}
                          id="reportmonth"
                          name="reportmonth"
                          onChange={(e) => {
                            const selectedmonth = e.target.value;
                            formik.setFieldValue("reportmonth", selectedmonth);
                          }}
                          value={formik.values.reportmonth}
                        >
                          <option value="">Select a Month</option>
                          {ReportList.data &&
                            ReportList?.data?.months.length > 0 ? (
                            ReportList?.data?.months.map((item) => (
                              <option
                                key={item.value}
                                value={item.value}
                                onClick={() => handleReportClick(item)} // Modified line
                              >
                                {item.display}
                              </option>
                            ))
                          ) : (
                            <option disabled={true}>No reportmonth</option>
                          )}
                        </select>

                        {formik.errors.reportmonth &&
                          formik.touched.reportmonth && (
                            <div className="text-danger mt-1">
                              {formik.errors.reportmonth}
                            </div>
                          )}
                      </div>
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
                <Row>
                  <Col lg={12} md={12}>
                    <div className="form-group">
                      <label className="form-label mt-4">
                        Get Reports By Date{" "}
                      </label>
                      <Switch
                        id="customToggle"
                        checked={toggleValue}
                        onChange={handleToggleChange}
                      />
                    </div>
                  </Col>
                </Row>
                <Card.Footer className="text-end ">
                  <button type="submit" className="btn btn-primary mx-2">
                    Generate Report
                  </button>
                </Card.Footer>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  </>;
};
export default withApi(ManageReports);
