import React, { useEffect, useState } from "react";

import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  FormControl,
  ListGroup,
  Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const AddSiteNozzle = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedFuelList, setSelectedFuelList] = useState([]);
  const [selectedPumpList, setSelectedPumpList] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);

  const navigate = useNavigate();

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("company_id", values.company_id);
      formData.append("site_pump_id", values.site_pump_id);
      formData.append("fuel_id", values.fuel_id);
      formData.append("client_id", values.client_id);

      const postDataUrl = "/site-nozzle/add";

      const navigatePath = "/managesitenozzle";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  useEffect(() => {
    if (isPermissionsSet) {
      const isAddPermissionAvailable =
        permissionsArray?.includes("charges-create");

      if (permissionsArray?.length > 0) {
        if (isAddPermissionAvailable) {
          console.log(isAddPermissionAvailable, "AddPermissionAvailable");
          // Perform action when permission is available
          // Your code here
        } else {
          // Perform action when permission is not available
          // Your code here
          navigate("/errorpage403");
        }
      } else {
        navigate("/errorpage403");
      }
    }
  }, [isPermissionsSet, permissionsArray]);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData(response.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFuelChange = async (id) => {
    try {
      const response = await axiosInstance.get(`/site/fuel/list?site_id=${id}`);
      console.log(response);
      if (response.data) {
        setSelectedFuelList(response.data);
      }
    } catch (error) {
      // handleError(error);
    }
  };

  const handlePumpChange = async (id) => {
    try {
      const response = await axiosInstance.get(`/site-pump/list?site_id=${id}`);
      console.log(response);
      if (response.data) {
        setSelectedFuelList(response.data);
      }
    } catch (error) {
      // handleError(error);
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site Nozzle</h1>

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
                  Manage Site Nozzle
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site Nozzle</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    name: "",
                    code: "",
                    status: "1",
                    client_id: "",
                    site_id: "",
                    fuel_id: "",
                    company_id: "",
                    site_pump_id: "",
                  }}
                  validationSchema={Yup.object({
                    client_id: Yup.string().required("Client is required"),
                    company_id: Yup.string().required("Company is required"),
                    site_id: Yup.string().required("Site is required"),
                    fuel_id: Yup.string().required("Fuel Name is required"),
                    site_pump_id: Yup.string().required(
                      "Pump Name is required"
                    ),

                    name: Yup.string()
                      .max(15, "Must be 15 characters or less")
                      .required(" Site Nozzle Name is required"),

                    code: Yup.string()
                      .required("Site Nozzle Code is required")
                      .matches(/^[a-zA-Z0-9_\- ]+$/, {
                        message: "code must not contain special characters",
                        excludeEmptyString: true,
                      })
                      .matches(
                        /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                        {
                          message:
                            "Site Nozzle Code must not have consecutive spaces",
                          excludeEmptyString: true,
                        }
                      ),

                    status: Yup.string().required(
                      "Site Nozzle Status is required"
                    ),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          <Col lg={6} md={12}>
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
                                    console.log(
                                      selectedClient,
                                      "selectedClient"
                                    );
                                    console.log(
                                      selectedClient.companies,
                                      "selectedClient"
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
                          <Col lg={6} md={12}>
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
                        </Row>

                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                htmlFor="site_id"
                                className="form-label mt-4"
                              >
                                Site
                                <span className="text-danger">*</span>
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
                                onChange={(event) => {
                                  const site = event.target.value;

                                  console.log(site);
                                  console.log(
                                    selectedFuelList,
                                    "selectedFuelList"
                                  );

                                  handleFuelChange(site);
                                  // handlePumpChange(pump);
                                  setFieldValue("site_id", site);
                                  // setFieldValue("site_pump_id", pump);
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

                          {/* Status */}
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                htmlFor="fuel_id"
                                className="form-label mt-4"
                              >
                                Fuel Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.fuel_id && touched.fuel_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="fuel_id"
                                name="fuel_id"
                              >
                                <option value="">Select Fuel Name</option>

                                {selectedFuelList ? (
                                  selectedFuelList?.data?.fuels.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.fuel_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Client</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="fuel_id"
                              />
                            </FormGroup>
                          </Col> 
                         
                        </Row>
                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="name"
                              >
                                Site Nozzle Name
                                <span className="text-danger">*</span>
                              </label>

                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${
                                  errors.name && touched.name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="name"
                                name="name"
                                placeholder="Site Nozzle Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="name"
                              />
                            </FormGroup>
                          </Col>
                            {/* Fuel Name */}
                            <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="status"
                              >
                                Site Nozzle Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.status && touched.status
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="status"
                                name="status"
                              >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="status"
                              />
                            </FormGroup>
                          </Col>
                           
                        </Row>
                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                htmlFor="site_pump_id"
                                className="form-label mt-4"
                              >
                                Pump Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.site_pump_id && touched.site_pump_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="site_pump_id"
                                name="site_pump_id"
                              >
                                <option value="">Select Pump Name</option>

                                {selectedFuelList ? (
                                  selectedFuelList?.data?.pumps.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.pump_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Client</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="site_pump_id"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="code"
                              >
                                Site Nozzle Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${
                                  errors.code && touched.code
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="code"
                                name="code"
                                placeholder="Site Nozzle Code"
                              />
                              <ErrorMessage
                                name="code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to="/managesitenozzle"
                        >
                          Cancel
                        </Link>
                        <button className="btn btn-primary me-2" type="submit">
                          Add
                        </button>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddSiteNozzle);
