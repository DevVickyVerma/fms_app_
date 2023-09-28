import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";

const AddCompetitor = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [CompetitorData, setCompetitorData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [SupplierData, setSupplierData] = useState({});

  const navigate = useNavigate();

  const Errornotify = (message) => toast.error(message);

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
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
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setCompetitorData(response.data);
        // if (
        //     response?.data &&
        //     localStorage.getItem("superiorRole") === "Client"
        // ) {
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
          // }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    fetchCommonListData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.competitor_name);
      // formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("address", values.competitor_Address);
      formData.append("supplier_id", values.supplier_id);

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
                            className={`input101 ${
                              formik.errors.client_id &&
                              formik.touched.client_id
                                ? "is-invalid"
                                : ""
                            }`}
                            id="client_id"
                            name="client_id"
                            onChange={(e) => {
                              const selectedType = e.target.value;

                              formik.setFieldValue("client_id", selectedType);
                              setSelectedClientId(selectedType);

                              // Reset the selected company and site
                              setSelectedCompanyList([]);

                              const selectedClient = CompetitorData.data.find(
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
                            {CompetitorData.data &&
                            CompetitorData.data.length > 0 ? (
                              CompetitorData.data.map((item) => (
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

                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label htmlFor="company_id" className="form-label mt-4">
                          Company
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${
                            formik.errors.company_id &&
                            formik.touched.company_id
                              ? "is-invalid"
                              : ""
                          }`}
                          id="company_id"
                          name="company_id"
                          onChange={(e) => {
                            const selectedCompany = e.target.value;

                            formik.setFieldValue("company_id", selectedCompany);
                            setSelectedCompanyId(selectedCompany);
                            setSelectedSiteList([]);
                            const selectedCompanyData =
                              selectedCompanyList.find(
                                (company) => company.id === selectedCompany
                              );

                            if (selectedCompanyData) {
                              setSelectedSiteList(selectedCompanyData.sites);
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
                          className={`input101 ${
                            formik.errors.site_id && formik.touched.site_id
                              ? "is-invalid"
                              : ""
                          }`}
                          id="site_id"
                          name="site_id"
                          onChange={(e) => {
                            const selectedsite_id = e.target.value;

                            formik.setFieldValue("site_id", selectedsite_id);
                            setSelectedSiteId(selectedsite_id);
                            const selectedSiteData = selectedSiteList.find(
                              (site) => site.id === selectedsite_id
                            );
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
                          className={`input101 ${
                            formik.errors.competitor_name &&
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
                          className={`input101 ${
                            formik.errors.competitor_Address &&
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
                    {/* <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label htmlFor="status" className="form-label mt-4">
                                                    Status<span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.status && formik.touched.status
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="status"
                                                    name="status"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.status}
                                                >
                                                    <option value="">Please Select Status</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                                {formik.errors.status && formik.touched.status && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.status}
                                                    </div>
                                                )}
                                            </div>
                                        </Col> */}
                    <Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="supplier_id"
                          className="form-label mt-4"
                        >
                          Supplier<span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${
                            formik.errors.supplier_id &&
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
