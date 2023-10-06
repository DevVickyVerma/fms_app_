import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaderimg from "../../Utils/Loader";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
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
  Modal, // Import Modal from react-bootstrap
} from "react-bootstrap";
import { Slide, toast } from "react-toastify";
import { logDOM } from "@testing-library/react";

const WorkflowExceptionFilter = (props) => {
  const {
    title,
    sidebarContent,
    visible,
    onClose,
    onformSubmit,
    searchListstatus,
  } = props;

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [open, setOpen] = useState(false);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [AddSiteData, setAddSiteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const notify = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const Errornotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  function handleError(error) {
    if (error.response && error.response.deduction_status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (
      error.response &&
      error.response.data.deduction_status_code === "403"
    ) {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }
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
            setSelectedSiteList([]);
            // setShowButton(false);

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
      handleError(error);
      console.error("API error:", error);
      setIsLoading(false); // Set isLoading to false if there is an error
    }
  };
  useEffect(() => {
    handleFetchData();
  }, [title]);
  const handleCloseModal = () => {
    onClose(); // Call the onClose function passed as a prop
  };
  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };
  return (
    <>
      {/* Wrap your modal content with Modal component */}
      <Modal show={visible} onHide={onClose} centered>
        <Modal.Header
          style={{
            color: "#fff",
            background: "#6259ca",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Modal.Title>{title}</Modal.Title>
          </div>
          <div>
            <span
              className="modal-icon"
              onClick={handleCloseModal}
              style={{ cursor: "pointer" }}
            >
              <AiOutlineClose />
            </span>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={{
              client_id: "",
              client_name: "",
              company_id: "",
              site_id: "",
              start_date: "",
            }}
            // validationSchema={Yup.object({
            //   company_id: Yup.string().required("Company is required"),
            //   site_id: Yup.string().required("Site is required"),
            // })}
            onSubmit={(values) => {
              console.log(values);
              onformSubmit(values);
            }}
          >
            {({ handleSubmit, errors, touched, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <Card.Body>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={6} md={6}>
                        <FormGroup>
                          <label
                            htmlFor="client_id"
                            className=" form-label mt-4"
                          >
                            Client
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
                              setFieldValue("client_id", selectedType);
                              setSelectedClientId(selectedType);

                              // Reset the selected company and site
                              setSelectedCompanyList([]);
                              setFieldValue("company_id", "");
                              setFieldValue("site_id", "");

                              const selectedClient = AddSiteData.data.find(
                                (client) => client.id === selectedType
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
                            <option value="">Select a Client</option>
                            {AddSiteData.data && AddSiteData.data.length > 0 ? (
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
                    <Col lg={6} md={6}>
                      <FormGroup>
                        <label htmlFor="company_id" className="form-label mt-4">
                          Company
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
                            setSelectedSiteList([]);
                            const selectedCompanyData =
                              selectedCompanyList.find(
                                (company) => company.id === selectedCompany
                              );
                            if (selectedCompanyData) {
                              setSelectedSiteList(selectedCompanyData.sites);
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
                    <Col lg={6} md={6}>
                      <FormGroup>
                        <label htmlFor="site_id" className="form-label mt-4">
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
                            setFieldValue("site_id", selectedSite);

                            const selectedSiteData = selectedSiteList.find(
                              (site) => site.id === selectedSite
                            );
                            if (selectedSiteData) {
                              setFieldValue(
                                "site_name",
                                selectedSiteData.site_name
                              ); // Set site_name using setFieldValue
                            }
                          }}
                        >
                          <option value="">Select a Site</option>
                          {selectedSiteList.length > 0 ? (
                            selectedSiteList.map((site) => (
                              <option key={site.id} value={site.id}>
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
                    <Col lg={6} md={6}>
                      <FormGroup>
                        <label htmlFor="start_date" className="form-label mt-4">
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
                          onChange={(e) => {
                            const selectedstart_date = e.target.value;

                            setFieldValue("start_date", selectedstart_date);
                          }}
                          id="start_date"
                          name="start_date"
                          onClick={handleShowDate}
                        ></Field>
                        <ErrorMessage
                          component="div"
                          className="invalid-feedback"
                          name="start_date"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-end">
                  <button className="btn btn-primary me-2" type="submit">
                    Submit
                  </button>
                </Card.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

WorkflowExceptionFilter.propTypes = {
  title: PropTypes.string.isRequired,
  // sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchListstatus: PropTypes.bool.isRequired,
};

export default WorkflowExceptionFilter;
