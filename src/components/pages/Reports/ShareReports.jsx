import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import FormikSelect from "../../Formik/FormikSelect";
import withApi from "../../../Utils/ApiHelper";
import { useMyContext } from "../../../Utils/MyContext";
import LoaderImg from "../../../Utils/Loader";
import { MultiSelect } from "react-multi-select-component";
import * as Yup from "yup";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const ShareReports = (props) => {
  const { title, visible, onClose, getData, isLoading, postData, apidata } =
    props;
  const { handleError } = useErrorHandler();
  const { contextClients, setcontextClients } = useMyContext();
  useEffect(() => {
    if (contextClients?.length == 0) {
      fetchClientList();
    } else if (contextClients?.length > 0 || contextClients !== null) {
      formik.setFieldValue("clients", contextClients);
    }
  }, [contextClients]);

  const fetchClientList = async () => {
    try {
      const response = await getData("/common/client-list");

      if (response?.data?.data) {
        formik.setFieldValue("clients", response?.data?.data);
        setcontextClients(response?.data?.data || []);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchCompanyList = async (clientId) => {
    try {
      const response = await getData(
        `common/company-list?client_id=${clientId}`
      );
      formik.setFieldValue("companies", response?.data?.data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchSiteList = async (companyId) => {
    try {
      const response = await getData(
        `common/site-list?company_id=${companyId}`
      );
      formik.setFieldValue("sites", response?.data?.data);
    } catch (error) {
      handleError(error);
    }
  };
  const fetchReportList = async (siteId) => {
    try {
      const response = await getData(`common/site-reports/${siteId}`);
      formik.setFieldValue("allReports", response?.data?.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    formik.setFieldValue("client_id", clientId);

    if (clientId) {
      fetchCompanyList(clientId);
      const selectedClient = formik.values.clients.find(
        (client) => client?.id === clientId
      );
      formik.setFieldValue("client_name", selectedClient?.client_name || "");
      formik.setFieldValue("companies", selectedClient?.companies || []);
      formik.setFieldValue("sites", []);
      formik.setFieldValue("allReports", []);
      formik.setFieldValue("service", []);
      formik.setFieldValue("company_id", "");
      formik.setFieldValue("site_id", "");
    } else {
      formik.setFieldValue("client_name", "");
      formik.setFieldValue("companies", []);
      formik.setFieldValue("sites", []);
      formik.setFieldValue("allReports", []);
      formik.setFieldValue("service", []);
      formik.setFieldValue("company_id", "");
      formik.setFieldValue("site_id", "");
    }
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    formik.setFieldValue("company_id", companyId);

    if (companyId) {
      fetchSiteList(companyId);
      formik.setFieldValue("site_id", "");
      const selectedCompany = formik.values.companies.find(
        (company) => company?.id === companyId
      );
      formik.setFieldValue("company_name", selectedCompany?.company_name || "");
      formik.setFieldValue("allReports", []);
      formik.setFieldValue("service", []);
    } else {
      formik.setFieldValue("company_name", "");
      formik.setFieldValue("sites", []);
      formik.setFieldValue("allReports", []);
      formik.setFieldValue("service", []);
      formik.setFieldValue("site_id", "");
      formik.setFieldValue("site_name", "");
    }
  };

  const handleSiteChange = (e) => {
    const selectedSiteId = e.target.value;
    if (selectedSiteId) {
      fetchReportList(selectedSiteId);
      formik.setFieldValue("site_id", selectedSiteId);
    }
    const selectedSiteData = formik?.values?.sites?.find(
      (site) => site.id === selectedSiteId
    );
    formik.setFieldValue("site_name", selectedSiteData?.site_name || "");
    formik.setFieldValue("allReports", []);
    formik.setFieldValue("service", []);
  };

  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const validationSchema = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
    service: Yup.array()
      .min(1, "At least one Report is required")
      .required("Reports are required"),
  });

  const formik = useFormik({
    initialValues: {
      client_id: "",
      client_name: "",
      company_id: "",
      company_name: "",
      site_id: "",
      site_name: "",
      range_start_date: null, // Renamed start date field
      range_end_date: null, // Renamed end date field
      clients: [],
      companies: [],
      sites: [],
      service: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // onApplyFilters(values);
      handleSubmit(values);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("site_id", values?.site_id);

      values?.service?.forEach((report, index) => {
        formData.append(`report_id[${index}]`, report?.value);
      });

      const postDataUrl = "/send-report";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

      if (apidata.api_response === "success") {
        onClose();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleMultiSelectServiceChange = (selectedOptions) => {
    formik.setFieldValue("service", selectedOptions);
  };

  return (
    <>
      {isLoading ? <LoaderImg /> : null}
      <div className={`common-sidebar ${visible ? "visible" : ""}`}>
        <div className="h-100">
          <div className="card-header text-center SidebarSearchheader">
            <h3 className="SidebarSearch-title m-0">{title}</h3>
            <button className="modal-ph-x" onClick={onClose}>
              {/* <FontAwesomeIcon icon={faTimes} /> */}
              <i className="ph ph-x"></i>
            </button>
          </div>

          <Card className=" h-100">
            <div>
              <form onSubmit={formik.handleSubmit}>
                <Card.Body>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={6}>
                        <FormikSelect
                          formik={formik}
                          name="client_id"
                          label="Client"
                          options={formik?.values?.clients?.map((item) => ({
                            id: item?.id,
                            name: item?.full_name,
                          }))}
                          className="form-input"
                          onChange={handleClientChange}
                        />
                      </Col>
                    )}

                    <Col lg={6}>
                      <FormikSelect
                        formik={formik}
                        name="company_id"
                        label="Company"
                        options={formik?.values?.companies?.map((item) => ({
                          id: item?.id,
                          name: item?.company_name,
                        }))}
                        className="form-input"
                        onChange={handleCompanyChange}
                      />
                    </Col>

                    <Col lg={6}>
                      <FormikSelect
                        formik={formik}
                        name="site_id"
                        label="Site"
                        options={formik?.values?.sites?.map((item) => ({
                          id: item?.id,
                          name: item?.site_name,
                        }))}
                        className="form-input"
                        isRequired={true}
                        onChange={handleSiteChange}
                      />
                    </Col>

                    <div className=" col-lg-6">
                      <div className="form-group">
                        <label className="mb-2   ">
                          Select Reports
                          <span className="text-danger">*</span>
                        </label>
                        <div>
                          <MultiSelect
                            value={formik?.values?.service}
                            onChange={handleMultiSelectServiceChange}
                            labelledBy="Select Reports"
                            options={
                              formik?.values?.allReports?.map((item) => ({
                                value: item?.id,
                                label: item?.name,
                                emails: item?.emails,
                              })) || []
                            }
                            className="matrix-multi"
                            // showCheckbox="false"
                          />
                        </div>
                        {formik.touched.service &&
                          typeof formik.errors.service === "string" && (
                            <div className="text-danger">
                              {formik.errors.service}
                            </div>
                          )}
                      </div>
                    </div>
                  </Row>

                  {formik?.values?.service?.length > 0 && (
                    <>
                      <Row>
                        <>
                          <Card.Header>
                            <h3 className="card-title">Emails</h3>
                          </Card.Header>

                          <Card.Body className="share-report-body">
                            {formik?.values?.service?.map((report) => (
                              <div
                                key={report?.value}
                                style={{ marginBottom: "20px" }}
                              >
                                <h4 className="bold">{report?.label}</h4>
                                <ul>
                                  {report?.emails?.map((email, index) => (
                                    <Badge className="me-2 p-2" key={index}>
                                      <i className="ph ph-envelope-simple"></i>{" "}
                                      {email}
                                    </Badge>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </Card.Body>
                        </>
                      </Row>
                    </>
                  )}
                </Card.Body>
                <Card.Footer>
                  <div className="text-end">
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </div>
                </Card.Footer>
              </form>
            </div>
          </Card>

          {/* <div className=" scrollview"></div> */}
        </div>
      </div>
    </>
  );
};

ShareReports.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withApi(ShareReports);
