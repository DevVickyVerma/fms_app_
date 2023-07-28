import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";

import {
  Breadcrumb,
  Card,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  ToggleButton,
  Tooltip,
} from "react-bootstrap";
import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
} from "@material-ui/core";

import withApi from "../../../Utils/ApiHelper";

import { useSelector } from "react-redux";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { Slide, toast } from "react-toastify";
import Switch from "react-switch";

const ManageReports = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const [dropdownValue, setDropdownValue] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [ReportList, setReportList] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [ShowButton, setShowButton] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [ReportDownloadUrl, setReportDownloadUrl] = useState();
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );

  const [selectedItems, setSelectedItems] = useState([]);
  const [toggleValue, setToggleValue] = useState(false); // State for the toggle
  const handleToggleChange = (checked) => {
    setToggleValue(checked);
    console.log(checked);
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored",
    });
  };

  useEffect(() => {
    console.log(localStorage.getItem("superiorId"));
    setclientIDLocalStorage(localStorage.getItem("superiorId"));

    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData(response?.data);
        if (
          response?.data &&
          localStorage.getItem("superiorRole") === "Client"
        ) {
          const clientId = localStorage.getItem("superiorId");
          if (clientId) {
            FetchReportList(clientId);

            setSelectedClientId(clientId);

            setSelectedCompanyList([]);

            // setShowButton(false);
            console.log(clientId, "clientId");
            console.log(AddSiteData, "AddSiteData");

            if (response?.data) {
              const selectedClient = response?.data?.data?.find(
                (client) => client.id === clientId
              );
              if (selectedClient) {
                setSelectedCompanyList(selectedClient?.companies);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const FetchReportList = async (id) => {
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

  const handleSubmit1 = async (formValues) => {
    try {
      const formData = new FormData();

      formData.append("report", formValues.report);
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", formValues.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }

      formData.append("company_id", formValues.company_id);
      // console.log( formValues.sites," formValues.sites")
      // formValues.sites.forEach((site, index) => {
      //   formData.append(`site_id[${index}]`, site.id);
      // });
      formData.append("start_date", formValues.start_date);
      formData.append("end_date", formValues.end_date);

      let clientIDCondition = "";
      if (localStorage.getItem("superiorRole") !== "Client") {
        clientIDCondition = `client_id=${formValues.client_id}&`;
      } else {
        clientIDCondition = `client_id=${clientIDLocalStorage}&`;
      }

      const siteIds = formValues.sites.map((site) => site.id);
      const siteIdParams = siteIds.map((id) => `site_id[]=${id}`).join("&");
      console.log(siteIds, "siteIds");




      const commonParams = toggleValue
      ?`${clientIDCondition}company_id=${formValues.company_id}&${siteIdParams}&from_date=${formValues.start_date}&to_date=${formValues.end_date}`
      :`${clientIDCondition}company_id=${formValues.company_id}&${siteIdParams}&month=${formValues.reportmonth}`
    


      // const commonParams = `client_id=${clientIDLocalStorage}&company_id=${formValues.company_id}&site_id[]=${formValues.site_id}&from_date=${formValues.start_date}&to_date=${formValues.end_date}`;

      let postDataUrl;

      if (formValues.report === "DSMR") {
        postDataUrl = `/report/dsmr?${commonParams}`;
      } else if (formValues.report === "DSRR") {
        postDataUrl = `/report/cldo?${commonParams}`;
      } else if (formValues.report === "MSR") {
        postDataUrl = `/report/msr?${commonParams}`;
      } else if (formValues.report === "escrr") {
        postDataUrl = `/report/escrr?${commonParams}`;
      } else if (formValues.report === "CMSR") {
        postDataUrl = `/report/cmsr?${commonParams}`;
      } else if (formValues.report === "DFDR") {
        postDataUrl = `/report/dfdr?${commonParams}`;
      } else {
        postDataUrl = "shop/add-default";
      }

      if (postDataUrl === "shop/add-default") {
        ErrorToast("For this site, the report is not available.");
      } else {
        try {
          const response = await getData(postDataUrl);
          console.log(response.status, "response"); // Console log the response

          if (response.status === 200) {
            setShowButton(true);
            console.log(response, "response"); // Console log the response
            setReportDownloadUrl(postDataUrl);
          }

          if (apidata && apidata.api_response === "success") {
            setReportDownloadUrl(postDataUrl);
            setShowButton(true);
          }
        } catch (error) {
          console.error("Error occurred while fetching data:", error);
        }
      }
    } catch (error) {
      console.log(error);
      // Set the submission state to false if an error occurs
    }
  };

  function handleReportClick(item) {
    console.log(item, "item");
  }

  useEffect(() => {
    const fetchData = async () => {
      await handleFetchData(); // Wait for handleFetchData to complete
    };

    fetchData();
  }, []);
  // Empty dependency array to run the effect only once

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Report</h1>
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
                Report
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Report</h3>
              </Card.Header>
              <Card.Body>
                <Formik
                  initialValues={{
                    report: "1",
                    client_id: "",
                    company_id: "",
                    sites: [],
                    start_date: "",
                    end_date: "",
                    reportmonth: "",
                  }}
                  validationSchema={Yup.object().shape({
                    report: Yup.string().required("Report is required"),
                    company_id: Yup.string().required("Company is required"),

                    // start_date: Yup.date().required("Start Date is required"),
                    // end_date: Yup.date().required("End Date is required"),
                    // reportmonth: Yup.date().required("reportmonth is required"),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
                            <Col lg={4} md={6}>
                              <FormGroup>
                                <label
                                  htmlFor="client_id"
                                  className=" form-label mt-4"
                                >
                                  Client
                                  <span className="text-danger">*</span>
                                </label>
                                <Field
                                  as="select"
                                  className={`input101 ${
                                    errors.client_id && touched.client_id
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="client_id"
                                  name="client_id"
                                  onChange={(e) => {
                                    const selectedType = e.target.value;
                                    FetchReportList(selectedType);
                                    setFieldValue("client_id", selectedType);
                                    setSelectedClientId(selectedType);

                                    // Reset the selected company and site
                                    setSelectedCompanyList([]);
                                    setFieldValue("company_id", "");
                                    setFieldValue("site_id", "");
                                    setShowButton(false);

                                    const selectedClient =
                                      AddSiteData.data.find(
                                        (client) => client.id === selectedType
                                      );

                                    if (selectedClient) {
                                      setSelectedCompanyList(
                                        selectedClient.companies
                                      );
                                    }
                                  }}
                                >
                                  <option value="">Select a Client</option>
                                  {AddSiteData.data &&
                                  AddSiteData.data.length > 0 ? (
                                    AddSiteData.data.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.client_name}
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>No Client</option>
                                  )}
                                </Field>

                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="client_id"
                                />
                              </FormGroup>
                            </Col>
                          )}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="company_id"
                                className="form-label mt-4"
                              >
                                Company
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.company_id && touched.company_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="company_id"
                                name="company_id"
                                onChange={(e) => {
                                  const selectedCompany = e.target.value;
                                  setFieldValue("company_id", selectedCompany);
                                  setShowButton(false);
                                  setSelectedItems([]);
                                  setSelectedSiteList([]);
                                  const selectedCompanyData =
                                    selectedCompanyList.find(
                                      (company) =>
                                        company.id === selectedCompany
                                    );
                                  if (selectedCompanyData) {
                                    setSelectedSiteList(
                                      selectedCompanyData.sites
                                    );
                                    console.log(
                                      selectedCompanyData,
                                      "company_id"
                                    );
                                    console.log(
                                      selectedCompanyData.sites,
                                      "company_id"
                                    );
                                  }
                                }}
                              >
                                <option value="">Select a Company</option>
                                {selectedCompanyList.length > 0 ? (
                                  selectedCompanyList.map((company) => (
                                    <option key={company.id} value={company.id}>
                                      {company.company_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Company</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_id"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormControl className="width">
                              <InputLabel>Select Sites</InputLabel>
                              <Select
                                multiple
                                value={selectedItems}
                                onChange={(event) => {
                                  setSelectedItems(event.target.value);
                                  console.log(event.target.value);

                                  const selectedSiteNames = event.target.value;
                                  const filteredSites = selectedSiteList.filter(
                                    (item) =>
                                      selectedSiteNames.includes(item.site_name)
                                  );
                                  console.log(filteredSites, "filteredSites");
                                  setFieldValue("sites", filteredSites);
                                  setShowButton(false);
                                }}
                                renderValue={(selected) => selected.join(", ")}
                              >
                                <MenuItem disabled value="">
                                  <em>Select items</em>
                                </MenuItem>
                                {selectedSiteList.map((item) => (
                                  <MenuItem
                                    key={item.site_name}
                                    value={item.site_name}
                                  >
                                    <Checkbox
                                      checked={selectedItems.includes(
                                        item.site_name
                                      )}
                                    />
                                    <ListItemText primary={item.site_name} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {touched.sites && errors.sites && (
                              <div className="error">{errors.sites}</div>
                            )}
                          </Col>
                          {toggleValue ? (
                            <>
                              <Col lg={4} md={6}>
                                <FormGroup>
                                  <label
                                    htmlFor="start_date"
                                    className="form-label mt-4"
                                  >
                                    Start Date
                                  </label>
                                  <Field
                                    type="date"
                                    min={"2023-01-01"}
                                    className={`input101 ${
                                      errors.start_date && touched.start_date
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="start_date"
                                    name="start_date"
                                    onChange={(e) => {
                                      const selectedstart_date = e.target.value;

                                      setFieldValue(
                                        "start_date",
                                        selectedstart_date
                                      );
                                      setShowButton(false);
                                    }}
                                  ></Field>
                                  <ErrorMessage
                                    component="div"
                                    className="invalid-feedback"
                                    name="start_date"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg={4} md={6}>
                                <FormGroup>
                                  <label
                                    htmlFor="end_date"
                                    className="form-label mt-4"
                                  >
                                    End Date
                                  </label>
                                  <Field
                                    type="date"
                                    min={"2023-01-01"}
                                    className={`input101 ${
                                      errors.end_date && touched.end_date
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="end_date"
                                    name="end_date"
                                    onChange={(e) => {
                                      const selectedend_date_date =
                                        e.target.value;

                                      setFieldValue(
                                        "end_date",
                                        selectedend_date_date
                                      );
                                      setShowButton(false);
                                    }}
                                  ></Field>
                                  <ErrorMessage
                                    component="div"
                                    className="invalid-feedback"
                                    name="end_date"
                                  />
                                </FormGroup>
                              </Col>
                            </>
                          ) : (
                            ""
                          )}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="report"
                              >
                                Report
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.report && touched.report
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="report"
                                name="report"
                                onChange={(e) => {
                                  const selectedreport = e.target.value;

                                  setFieldValue("report", selectedreport);
                                  setShowButton(false);
                                }}
                              >
                                <option value="">Select a Report</option>
                                {ReportList.data &&
                                ReportList?.data?.reports.length > 0 ? (
                                  ReportList?.data?.reports.map((item) => (
                                    <option
                                      key={item.id}
                                      value={item.report_code}
                                      onClick={() => handleReportClick(item)} // Modified line
                                    >
                                      {item.report_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Report</option>
                                )}
                              </Field>

                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="report"
                              />
                            </FormGroup>
                          </Col>
                          {!toggleValue ? (
                            <Col lg={4} md={6}>
                              <FormGroup>
                                <label
                                  className=" form-label mt-4"
                                  htmlFor="reportmonth"
                                >
                                  Months
                                </label>
                                <Field
                                  as="select"
                                  className={`input101 ${
                                    errors.reportmonth && touched.reportmonth
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="reportmonth"
                                  name="reportmonth"
                                  onChange={(e) => {
                                    const selectedmonth = e.target.value;

                                    setFieldValue("reportmonth", selectedmonth);
                                    setShowButton(false);
                                  }}
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
                                    <option disabled>No reportmonth</option>
                                  )}
                                </Field>

                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="reportmonth"
                                />
                              </FormGroup>
                            </Col>
                          ) : (
                            ""
                          )}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label className="form-label mt-4">
                                Get Reports By Date{" "}
                              </label>
                              <Switch
                                id="customToggle"
                                checked={toggleValue}
                                onChange={handleToggleChange}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end ">
                        {ShowButton ? (
                          <button
                            onClick={() => {
                              window.open(
                                process.env.REACT_APP_BASE_URL +
                                  ReportDownloadUrl,
                                "_blank",
                                "noopener noreferrer"
                              );

                              console.log(
                                ReportDownloadUrl,
                                "ReportDownloadUrl"
                              );
                            }}
                            className="btn btn-danger me-2"
                            type="button"
                          >
                            Download Report
                          </button>
                        ) : (
                          ""
                        )}

                        <button type="submit" className="btn btn-primary">
                          Generate Report
                        </button>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageReports);
