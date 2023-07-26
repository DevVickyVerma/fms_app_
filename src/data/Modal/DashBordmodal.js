import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaderimg from "../../Utils/Loader";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

const DashBordModal = (props) => {
  const {
    title,
    sidebarContent,
    visible,
    onClose,
    onSubmit,
    searchListstatus,
  } = props;

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [AddSiteData, setAddSiteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchData = async () => {
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.get("/client/commonlist");

      setIsLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        setAddSiteData(response.data);

        if (
          response?.data &&
          localStorage.getItem("superiorRole") === "Client"
        ) {
          const clientId = localStorage.getItem("superiorId");
          if (clientId) {
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

      setIsLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };
  const handlesubmitvalues = (values) => {
    onClose();

    // Invoke the onSubmit callback with the form values
    onSubmit(values);
  };

  useEffect(() => {
    handleFetchData();
  }, [title]);

  const resetForm = () => {
    onClose();
  };
  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div className={`common-sidebar ${visible ? "visible" : ""}`}>
            <div className="card">
              <div className="card-header text-center SidebarSearchheader">
                <h3 className="SidebarSearch-title m-0">{title}</h3>
                <button className="close-button" onClick={onClose}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              </div>

           
                <Card>
                  <Card.Body>
                    <Row>
                      <Col md={12} xl={12}>
                        <Formik
                          initialValues={{
                            client_id: "",
                            client_name: "",
                            company_id: "",
                            site_id: "",
                            fromdate: "",
                            TOdate: "",
                          }}
                          validationSchema={Yup.object({
                            company_id: Yup.string().required(
                              "Company is required"
                            ),
                          })}
                          onSubmit={(values) => {
                            handlesubmitvalues(values);
                          }}
                        >
                          {({
                            handleSubmit,
                            errors,
                            touched,
                            setFieldValue,
                          }) => (
                            <Form onSubmit={handleSubmit}>
                              <Card.Body>
                                <Row>
                                  {localStorage.getItem("superiorRole") !==
                                    "Client" && (
                                    <Col lg={3} md={6}>
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
                                            errors.client_id &&
                                            touched.client_id
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          id="client_id"
                                          name="client_id"
                                          onChange={(e) => {
                                            const selectedType = e.target.value;
                                            setFieldValue(
                                              "client_id",
                                              selectedType
                                            );
                                            setSelectedClientId(selectedType);

                                            // Reset the selected company and site
                                            setSelectedCompanyList([]);
                                            setFieldValue("company_id", "");
                                            setFieldValue("site_id", "");

                                            const selectedClient =
                                              AddSiteData.data.find(
                                                (client) =>
                                                  client.id === selectedType
                                              );

                                            if (selectedClient) {
                                              setSelectedCompanyList(
                                                selectedClient.companies
                                              );
                                              setFieldValue(
                                                "client_name",
                                                selectedClient.client_name
                                              );
                                              console.log(
                                                selectedClient.client_name,
                                                " selectedClient.client_name"
                                              );
                                            }
                                          }}
                                        >
                                          <option value="">
                                            Select a Client
                                          </option>
                                          {AddSiteData.data &&
                                          AddSiteData.data.length > 0 ? (
                                            AddSiteData.data.map((item) => (
                                              <option
                                                key={item.id}
                                                value={item.id}
                                              >
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
                                  <Col lg={3} md={6}>
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
                                          errors.company_id &&
                                          touched.company_id
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        id="company_id"
                                        name="company_id"
                                        onChange={(e) => {
                                          const selectedCompany =
                                            e.target.value;
                                          setFieldValue(
                                            "company_id",
                                            selectedCompany
                                          );
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
                                            setFieldValue(
                                              "company_name",
                                              selectedCompanyData.company_name
                                            );
                                            console.log(
                                              selectedCompanyData.company_name,
                                              "company_id"
                                            );
                                            console.log(
                                              selectedCompanyData.sites,
                                              "company_id"
                                            );
                                          }
                                        }}
                                      >
                                        <option value="">
                                          Select a Company
                                        </option>
                                        {selectedCompanyList.length > 0 ? (
                                          selectedCompanyList.map((company) => (
                                            <option
                                              key={company.id}
                                              value={company.id}
                                            >
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
                                    <FormGroup>
                                      <label
                                        htmlFor="site_id"
                                        className="form-label mt-4"
                                      >
                                        Site
                                      </label>
                                      <Field
                                        as="select"
                                        className={`input101 ${
                                          errors.site_id && touched.site_id
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        id="site_id"
                                        name="site_id"
                                        onChange={(e) => {
                                          const selectedSite = e.target.value;
                                          setFieldValue(
                                            "site_id",
                                            selectedSite
                                          );

                                          const selectedSiteData =
                                            selectedSiteList.find(
                                              (site) => site.id === selectedSite
                                            );
                                          if (selectedSiteData) {
                                            setFieldValue(
                                              "site_name",
                                              selectedSiteData.site_name
                                            ); // Set site_name using setFieldValue
                                            console.log(
                                              selectedSiteData.site_name,
                                              "site_name"
                                            );
                                          }
                                        }}
                                      >
                                        <option value="">Select a Site</option>
                                        {selectedSiteList.length > 0 ? (
                                          selectedSiteList.map((site) => (
                                            <option
                                              key={site.id}
                                              value={site.id}
                                            >
                                              {site.site_name}
                                            </option>
                                          ))
                                        ) : (
                                          <option disabled>No Site</option>
                                        )}
                                      </Field>
                                      <ErrorMessage
                                        component="div"
                                        className="invalid-feedback"
                                        name="site_id"
                                      />
                                    </FormGroup>
                                  </Col>
                                  {/* <Col lg={3} md={6}>
                                    <FormGroup>
                                      <label
                                        htmlFor="fromdate"
                                        className="form-label mt-4"
                                      >
                                        From
                                      </label>
                                      <Field
                                        type="date"
                                        className={`input101 ${
                                          errors.fromdate && touched.fromdate
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        id="fromdate"
                                        name="fromdate"
                                      ></Field>
                                      <ErrorMessage
                                        component="div"
                                        className="invalid-feedback"
                                        name="fromdate"
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col lg={3} md={6}>
                                    <FormGroup>
                                      <label
                                        htmlFor="TOdate"
                                        className="form-label mt-4"
                                      >
                                        To
                                      </label>
                                      <Field
                                        type="date"
                                        className={`input101 ${
                                          errors.TOdate && touched.TOdate
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                        id="TOdate"
                                        name="TOdate"
                                      ></Field>
                                      <ErrorMessage
                                        component="div"
                                        className="invalid-feedback"
                                        name="TOdate"
                                      />
                                    </FormGroup>
                                  </Col> */}
                                </Row>
                              </Card.Body>
                              <Card.Footer className="text-end">
                                <Link
                                  type="submit"
                                  className="btn btn-danger me-2 "
                                  onClick={resetForm}
                                >
                                  Reset
                                </Link>
                                <button
                                  className="btn btn-primary me-2"
                                  type="submit"
                                >
                                  Submit
                                </button>
                              </Card.Footer>
                            </Form>
                          )}
                        </Formik>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
             
      
          </div>
        </>
      )}
    </>
  );
};

DashBordModal.propTypes = {
  title: PropTypes.string.isRequired,
  // sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,

  onSubmit: PropTypes.func.isRequired,
  searchListstatus: PropTypes.bool.isRequired,
};

export default DashBordModal;
