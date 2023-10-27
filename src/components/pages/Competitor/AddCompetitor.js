import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert } from "../../../Utils/ToastUtils";

const AddCompetitor = (props) => {
  const { isLoading, getData, postData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [SupplierData, setSupplierData] = useState({});
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const navigate = useNavigate();


  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const GetSiteData = async () => {
      try {
        const response = await axiosInstance.get("suppliers");

        if (response.data) {
          setSupplierData(response.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    // console.clear()
    console.clear();
  }, []);

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",

      competitor_name: "",
      supplier_id: "",
      status: "",
      competitor_Address: "",
      cat_no: "",
      postcode: "",
      dist_miles: "",
      main_code: "",
    },
    validationSchema: Yup.object({
      // client_id: Yup.string().required("Client is required"),
      company_id: Yup.string().required("Company is required"),
      site_id: Yup.string().required("Site  is required"),
      competitor_name: Yup.string().required("Competitor name is required"),
      supplier_id: Yup.string().required("Supplier is required"),
      competitor_Address: Yup.string().required(
        "Competitor address is required"
      ),
      // status: Yup.string().required("Status is required"),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
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

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.competitor_name);
      // formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("address", values.competitor_Address);
      formData.append("supplier_id", values.supplier_id);
      formData.append("postcode", values.postcode);
      formData.append("main_code", values.main_code);
      formData.append("dist_miles", values.dist_miles);
      formData.append("cat_no", values.cat_no);

      const postDataUrl = "/site/competitor/add";
      const navigatePath = "/competitor";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };



  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Add Competitor</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/competitor" }}
              >
                Competitor
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Add Competitor
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* here I will start Body of competitor */}
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Add Competitor</Card.Title>
              </Card.Header>
              {/* here my body will start */}
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
                              formik.setFieldValue("company_id", selectcompany);
                              formik.setFieldValue("site_id", "");
                              setSelectedCompanyId(selectcompany);
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
                          className="form-label mt-4"
                          htmlFor="competitor_name"
                        >
                          Competitor Name<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${formik.errors.competitor_name &&
                            formik.touched.competitor_name
                            ? "is-invalid"
                            : ""
                            }`}
                          id="competitor_name"
                          name="competitor_name"
                          placeholder="Competitor Name "
                          onChange={formik.handleChange}
                          value={formik.values.competitor_name}
                        />
                        {formik.errors.competitor_name &&
                          formik.touched.competitor_name && (
                            <div className="invalid-feedback">
                              {formik.errors.competitor_name}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="competitor_Address"
                          className="form-label mt-4"
                        >
                          Competitor Address
                          <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`input101 ${formik.errors.competitor_Address &&
                            formik.touched.competitor_Address
                            ? "is-invalid"
                            : ""
                            }`}
                          id="competitor_Address"
                          name="competitor_Address"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.competitor_Address || ""}
                          placeholder="Competitor Address"
                        />
                        {formik.errors.competitor_Address &&
                          formik.touched.competitor_Address && (
                            <div className="invalid-feedback">
                              {formik.errors.competitor_Address}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="postcode">
                          Post Code
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${formik.errors.postcode && formik.touched.postcode
                            ? "is-invalid"
                            : ""
                            }`}
                          id="postcode"
                          name="postcode"
                          placeholder="Post Code"
                          onChange={formik.handleChange}
                          value={formik.values.postcode}
                        />
                        {formik.errors.postcode && formik.touched.postcode && (
                          <div className="invalid-feedback">
                            {formik.errors.postcode}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="cat_no">
                          Category No
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.cat_no && formik.touched.cat_no
                            ? "is-invalid"
                            : ""
                            }`}
                          id="cat_no"
                          name="cat_no"
                          placeholder="Category No"
                          onChange={formik.handleChange}
                          value={formik.values.cat_no}
                        />
                        {formik.errors.cat_no && formik.touched.cat_no && (
                          <div className="invalid-feedback">
                            {formik.errors.cat_no}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="dist_miles">
                          Dist Miles
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.dist_miles &&
                            formik.touched.dist_miles
                            ? "is-invalid"
                            : ""
                            }`}
                          id="dist_miles"
                          name="dist_miles"
                          placeholder="Dist Miles"
                          onChange={formik.handleChange}
                          value={formik.values.dist_miles}
                        />
                        {formik.errors.dist_miles &&
                          formik.touched.dist_miles && (
                            <div className="invalid-feedback">
                              {formik.errors.dist_miles}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="dist_miles">
                          Main Code
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${formik.errors.main_code && formik.touched.main_code
                            ? "is-invalid"
                            : ""
                            }`}
                          id="main_code"
                          name="main_code"
                          placeholder="Main Code"
                          onChange={formik.handleChange}
                          value={formik.values.main_code}
                        />
                        {formik.errors.main_code &&
                          formik.touched.main_code && (
                            <div className="invalid-feedback">
                              {formik.errors.main_code}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="supplier_id"
                          className="form-label mt-4"
                        >
                          Supplier<span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.supplier_id &&
                            formik.touched.supplier_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="supplier_id"
                          name="supplier_id"
                          onChange={formik.handleChange}
                          value={formik.values.supplier_id}
                        >
                          <option value="">Select a Supplier </option>
                          {SupplierData && SupplierData.length > 0 ? (
                            SupplierData.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.supplier_name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No Supplier available</option>
                          )}
                        </select>
                        {formik.errors.supplier_id &&
                          formik.touched.supplier_id && (
                            <div className="invalid-feedback">
                              {formik.errors.supplier_id}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/competitor/`}
                    >
                      Cancel
                    </Link>

                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(AddCompetitor);
