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

import { Formik, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const AddSitePump = (props) => {
  const { id } = useParams();
  const { apidata, isLoading, error, getData, postData } = props;
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedFuelList, setSelectedFuelList] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);

  const handleSubmit1 = async (values) => {
    try {
      const tank = {
        site_id: values.site_id,
        client_id: values.client_id,
        company_id: values.company_id,
      };

      localStorage.setItem("SiteTAnk", JSON.stringify(tank));
      const formData = new FormData();
      formData.append("sales_volume", values.sales_volume);
      formData.append("pence_per_liter", values.pence_per_liter);

      formData.append("site_id", values.site_id);
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", values.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }
      formData.append("company_id", values.company_id);

      const postDataUrl = "/site-ppl/add";

      const navigatePath = "/assignppl";
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

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const formik = useFormik({
    initialValues: {
      sales_volume: "",
      pence_per_liter: "",
      status: "1",
      site_id: "",
      fuel_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site is required"),
      sales_volume: Yup.string().required(
        "  Sales Volume is required"
      ),
      pence_per_liter: Yup.string().required(
        " Pence Per Liter is required"
      ),
    }),

    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setClientList(response.data);

        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          setSelectedClientId(clientId);
          setSelectedCompanyList([]);

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
          console.log(response, "company");
          setCompanyList(response?.data?.data);
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
          console.log(response, "company");
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

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);

  console.log(formik.values, "formikvalue");

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site PPL Rate</h1>

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
                  Manage Site PPL Rate
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site PPL Rate</Card.Title>
                </Card.Header>
                {/* <Formik
                  initialValues={{
                    sales_volume: "",
                    pence_per_liter: "",
                    status: "1",
                    site_id: "",
                    fuel_id: "",
                  }}
                  validationSchema={Yup.object({
                    company_id: Yup.string().required("Company is required"),
                    site_id: Yup.string().required("Site is required"),

                    sales_volume: Yup.string().required(
                      "  Sales Volume is required"
                    ),

                    pence_per_liter: Yup.string().required(
                      " Pence Per Liter is required"
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
                                    className={`input101 ${errors.client_id && touched.client_id
                                      ? "is-invalid"
                                      : ""
                                      }`}
                                    id="client_id"
                                    name="client_id"
                                    onChange={(e) => {
                                      const selectedType = e.target.value;

                                      setFieldValue("client_id", selectedType);
                                      setSelectedClientId(selectedType);
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
                                className={`input101 ${errors.company_id && touched.company_id
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
                          <Col lg={4} md={6}>
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
                                className={`input101 ${errors.site_id && touched.site_id
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="site_id"
                                name="site_id"
                                onChange={(event) => {
                                  const site = event.target.value;

                                  setFieldValue("site_id", site);
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
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="pence_per_liter"
                              >
                                Pence Per Liter
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.pence_per_liter &&
                                  touched.pence_per_liter
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="pence_per_liter"
                                name="pence_per_liter"
                                placeholder="Pence Per Liter"
                              />
                              <ErrorMessage
                                name="pence_per_liter"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="sales_volume"
                              >
                                Sales Volume
                                <span className="text-danger">*</span>
                              </label>

                              <Field
                                type="number"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${errors.sales_volume && touched.sales_volume
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="sales_volume"
                                name="sales_volume"
                                placeholder=" Sales Volume"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="sales_volume"
                              />
                            </FormGroup>
                          </Col>

                        </Row>

                      </Card.Body>
                      <Card.Footer className="text-end">
                        <button className="btn btn-primary me-2" type="submit">
                          Add
                        </button>
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to="/assignppl"
                        >
                          Cancel
                        </Link>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik> */}

                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Row>

                      {localStorage.getItem("superiorRole") !== "Client" && (
                        <Col lg={4} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="client_id"
                              className="form-label mt-4"
                            >
                              Client
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${formik.errors.client_id &&
                                formik.touched.client_id
                                ? "is-invalid"
                                : ""
                                }`}
                              id="client_id"
                              name="client_id"
                              value={formik.values.client_id}
                              onChange={(e) => {
                                const selectedType = e.target.value;
                                console.log(selectedType, "selectedType");

                                if (selectedType) {
                                  GetCompanyList(selectedType);
                                  formik.setFieldValue("client_id", selectedType);
                                  setSelectedClientId(selectedType);
                                  setSiteList([]);
                                  formik.setFieldValue("company_id", "");
                                  formik.setFieldValue("site_id", "");
                                } else {
                                  console.log(
                                    selectedType,
                                    "selectedType no values"
                                  );
                                  formik.setFieldValue("client_id", "");
                                  formik.setFieldValue("company_id", "");
                                  formik.setFieldValue("site_id", "");

                                  setSiteList([]);
                                  setCompanyList([]);
                                }
                              }}
                            >
                              <option value="">Select a Client</option>
                              {ClientList.data && ClientList.data.length > 0 ? (
                                ClientList.data.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.client_name}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No Client</option>
                              )}
                            </select>

                            {formik.errors.client_id &&
                              formik.touched.client_id && (
                                <div className="invalid-feedback">
                                  {formik.errors.client_id}
                                </div>
                              )}
                          </div>
                        </Col>
                      )}

                      <Col Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="company_id" className="form-label mt-4">
                            Company
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.company_id &&
                              formik.touched.company_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="company_id"
                            name="company_id"
                            value={formik.values.company_id}
                            onChange={(e) => {
                              const selectcompany = e.target.value;
                              if (selectcompany) {
                                GetSiteList(selectcompany);
                                setSelectedCompanyId(selectcompany);
                                formik.setFieldValue("site_id", "");
                                formik.setFieldValue("company_id", selectcompany);
                              } else {
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");

                                setSiteList([]);
                              }
                            }}
                          >
                            <option value="">Select a Company</option>
                            {selectedClientId && CompanyList.length > 0 ? (
                              <>
                                setSelectedCompanyId([])
                                {CompanyList.map((company) => (
                                  <option key={company.id} value={company.id}>
                                    {company.company_name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <option disabled>No Company</option>
                            )}
                          </select>
                          {formik.errors.company_id &&
                            formik.touched.company_id && (
                              <div className="invalid-feedback">
                                {formik.errors.company_id}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="site_id" className="form-label mt-4">
                            Site Name
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.site_id && formik.touched.site_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="site_id"
                            name="site_id"
                            value={formik.values.site_id}
                            onChange={(e) => {
                              const selectedsite_id = e.target.value;

                              formik.setFieldValue("site_id", selectedsite_id);
                              setSelectedSiteId(selectedsite_id);
                            }}
                          >
                            <option value="">Select a Site</option>
                            {CompanyList && SiteList.length > 0 ? (
                              SiteList.map((site) => (
                                <option key={site.id} value={site.id}>
                                  {site.site_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Site</option>
                            )}
                          </select>
                          {formik.errors.site_id && formik.touched.site_id && (
                            <div className="invalid-feedback">
                              {formik.errors.site_id}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="pence_per_liter"
                          >
                            Pence Per Liter
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.pence_per_liter &&
                              formik.touched.pence_per_liter
                              ? "is-invalid"
                              : ""
                              }`}
                            id="pence_per_liter"
                            name="pence_per_liter"
                            placeholder="Pence Per Liter"
                            onChange={formik.handleChange}
                            value={formik.values.pence_per_liter}
                          />
                          {formik.errors.pence_per_liter && formik.touched.pence_per_liter && (
                            <div className="invalid-feedback">
                              {formik.errors.pence_per_liter}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="sales_volume"
                          >
                            Sales Volume
                            <span className="text-danger">*</span>
                          </label>

                          <input
                            type="number"
                            autoComplete="off"
                            // className="form-control"
                            className={`input101 ${formik.errors.sales_volume && formik.touched.sales_volume
                              ? "is-invalid"
                              : ""
                              }`}
                            id="sales_volume"
                            name="sales_volume"
                            placeholder=" Sales Volume"
                            onChange={formik.handleChange}
                            value={formik.values.sales_volume}
                          />
                          {formik.errors.sales_volume && formik.touched.sales_volume && (
                            <div className="invalid-feedback">
                              {formik.errors.sales_volume}
                            </div>
                          )}
                        </div>
                      </Col>

                    </Row>
                    <Card.Footer className="text-end">
                      <button className="btn btn-primary me-2" type="submit">
                        Add
                      </button>
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to="/assignppl"
                      >
                        Cancel
                      </Link>
                    </Card.Footer>
                  </form>
                </Card.Body>

              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddSitePump);
