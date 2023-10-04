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

const AddSitePump = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [AddSiteData, setAddSiteData] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const navigate = useNavigate();

  const handleSubmit1 = async (values) => {
    try {
      const tank = {
        site_id: values.site_id,
        client_id: values.client_id,
        company_id: values.company_id,
      };

      localStorage.setItem("SitePump", JSON.stringify(tank));
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);

      const postDataUrl = "/site-pump/add";

      const navigatePath = "/managesitepump";
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

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

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

  useEffect(() => {
    handleFetchData();
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    console.clear();
  }, []);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site Pump</h1>

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
                  Manage Site Pump
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site Pump</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    name: "",
                    code: "",
                    status: "1",
                    client_id: "",
                    site_id: "",
                    company_id: "",
                  }}
                  validationSchema={Yup.object({
                    company_id: Yup.string().required("Company is required"),
                    site_id: Yup.string().required("Site is required"),
                    name: Yup.string().required(" Site Pump Name is required"),

                    code: Yup.string()
                      .required("Site Pump Code is required")
                      .matches(/^[a-zA-Z0-9_\- ]+$/, {
                        message: "code must not contain special characters",
                        excludeEmptyString: true,
                      })
                      .matches(
                        /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                        {
                          message:
                            "Site Pump Code must not have consecutive spaces",
                          excludeEmptyString: true,
                        }
                      ),

                    status: Yup.string().required(
                      "Site Pump Status is required"
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
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
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
                                    setSelectedSiteList([]);
                                    setFieldValue("company_id", "");
                                    setFieldValue("site_id", "");

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
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="name"
                              >
                                Site Pump Name
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
                                placeholder="Site Pump Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="name"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row></Row>
                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="code"
                              >
                                Site Pump Code
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
                                placeholder="Site Pump Code"
                              />
                              <ErrorMessage
                                name="code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="status"
                              >
                                Site Pump Status
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
                      </Card.Body>
                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to="/managesitepump"
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
export default withApi(AddSitePump);
