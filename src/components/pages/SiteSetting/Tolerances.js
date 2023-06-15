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
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const SiteSettings = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const [Listcompany, setCompanylist] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState("");
  const [companyId, setCompanyId] = useState();

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [ToleranceData, setToleranceData] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
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
        const response = await axiosInstance.get("site/common-data-list");

        if (response.data) {
          setAddSiteData(response.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };
    try {
      GetSiteData();

      handleFetchData();
    } catch (error) {
      handleError(error);
    }

    console.clear();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      if (selectedSiteId) {
        try {
          const response = await getData(`/tolerance/?site_id=${formik.values.site_id}&client_id=${formik.values.client_id}&company_id=${formik.values.company_id}`);
          const { data } = response;
          if (data) {
            console.log(data);
            formik.setValues(data.data);
            // Process the API response and update your state or perform other actions
          }
        } catch (error) {
          console.error("API error:", error);
          // Handle error if the API call fails
        }
      }
    };
  
    if (selectedSiteId !== undefined) {
      fetchData();
    }
  }, [selectedSiteId]);
  




  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setToleranceData(response.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
  
    formData.append("max_dip_gain_loss_variance", values.max_dip_gain_loss_variance);
    formData.append("max_banking_variance", values.max_banking_variance);
    formData.append("max_fuel_inv_sale_variance", values.max_fuel_inv_sale_variance);
    formData.append("max_bunkering_variance", values.max_bunkering_variance);
    formData.append("low_tank_limit", values.low_tank_limit);
    formData.append("vat_rate", values.vat_rate);
    formData.append("client_id", selectedClientId);
    formData.append("company_id", selectedCompanyId);
    formData.append("site_id", selectedSiteId);
    formData.append("average_ppl", values.average_ppl);
    formData.append("max_dip_gain_loss_variance_lt","0");
   
  

 
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/tolerance/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        notify(data.message);
        // navigate("/sites");
      } else {
        Errornotify(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      max_dip_gain_loss_variance: "",
      max_banking_variance: "",
      max_fuel_inv_sale_variance: "",
      max_bunkering_variance: "",
      low_tank_limit: "",
      vat_rate: "",
      client_id: "",
      company_id: "",
      site_id: "",
      average_ppl: "",
    
    },
    validationSchema: Yup.object({
      max_dip_gain_loss_variance: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Max Dips Gians/Loss Variance is required"),
      max_banking_variance: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required(" Max Banking Variance is required"),
      max_bunkering_variance: Yup.string().required(
        "Bunkring Tolerance is required"
      ),
      low_tank_limit: Yup.string().required("Low Tank Limit is required"),
      vat_rate: Yup.string().required("Vat Rate is required"),
      // client_id: Yup.string().required("Client  is required"),
      // company_id: Yup.string().required("Company  is required"),
      // site_id: Yup.string().required("Site  is required"),

      max_fuel_inv_sale_variance: Yup.string().required("Max Fuel is required"),
      average_ppl: Yup.string().required("Use Avg Ppl is required"),
    }),
    onSubmit: handleSubmit,
  });


  return (
      <>
      {isLoading ? <Loaderimg /> : null}
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tolerances</h1>

          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item  breadcrumds"
              aria-current="page"
              linkAs={Link}
              linkProps={{ to: "/sites" }}
            >
              Tolerances
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Tolerances</Card.Title>
            </Card.Header>

            <div class="card-body">
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="client_id" className="form-label mt-4">
                        Client
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.client_id && formik.touched.client_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="client_id"
                        name="client_id"
                        onChange={(e) => {
                          const selectedType = e.target.value;
                          console.log(selectedType,"selectedClientId")
                          formik.setFieldValue("client_id", selectedType);
                          setSelectedClientId(selectedType);

                          // Reset the selected company and site
                          setSelectedCompanyList([]);
                        

                          const selectedClient = ToleranceData.data.find(
                            (client) => client.id === selectedType
                          );

                          if (selectedClient) {
                            setSelectedCompanyList(selectedClient.companies);
                            console.log(selectedClient, "selectedClient");
                            console.log(
                              selectedClient.companies,
                              "selectedClient"
                            );
                          }
                        }}
                      >
                        <option value="">Select a Client</option>
                        {ToleranceData.data && ToleranceData.data.length > 0 ? (
                          ToleranceData.data.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.client_name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Client</option>
                        )}
                      </select>
                      {/* Replace this line with a self-closing tag */}
                      {formik.errors.client_id && formik.touched.client_id && (
                        <div className="invalid-feedback">
                          {formik.errors.client_id}
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="company_id" className="form-label mt-4">
                        Company
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.company_id && formik.touched.company_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="company_id"
                        name="company_id"
                        onChange={(e) => {
                          const selectedCompany = e.target.value;
                          console.log(selectedCompany,"selectedCompany")
                          formik.setFieldValue("company_id", selectedCompany);
                          setSelectedCompanyId(selectedCompany);
                          setSelectedSiteList([]);
                          const selectedCompanyData = selectedCompanyList.find(
                            (company) => company.id === selectedCompany
                          );
                          if (selectedCompanyData) {
                            setSelectedSiteList(selectedCompanyData.sites);
                            console.log(selectedCompanyData, "company_id");
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
                        Site
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
                          const selectedSite = e.target.value;
                          console.log(selectedSite,"selectedSite")
                          formik.setFieldValue("site_id", selectedSite);
                          setSelectedSiteId(selectedSite);
                      
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
                        htmlFor="max_banking_variance"
                      >
                        Max Banking Variance
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        className={`input101 ${
                          formik.errors.max_banking_variance &&
                          formik.touched.max_banking_variance
                            ? "is-invalid"
                            : ""
                        }`}
                        id="max_banking_variance"
                        name="max_banking_variance"
                        placeholder=" Max Banking Variance"
                        onChange={formik.handleChange}
                        value={formik.values.max_banking_variance}
                      />
                      {formik.errors.max_banking_variance &&
                        formik.touched.max_banking_variance && (
                          <div className="invalid-feedback">
                            {formik.errors.max_banking_variance}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="max_dip_gain_loss_variance">
                        Max Dips Gians/Loss Variance
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        id="max_dip_gain_loss_variance"
                        name="max_dip_gain_loss_variance"
                        type="text"
                        autoComplete="off"
                        className={`input101 ${
                          formik.errors.max_dip_gain_loss_variance && formik.touched.max_dip_gain_loss_variance
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder=" Max Dips Gians/Loss Variance"
                        onChange={formik.handleChange}
                        value={formik.values.max_dip_gain_loss_variance}
                      />
                      {formik.errors.max_dip_gain_loss_variance && formik.touched.max_dip_gain_loss_variance && (
                        <div className="invalid-feedback">
                          {formik.errors.max_dip_gain_loss_variance}
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col lg={4} md={6}>
                    <label htmlFor="max_fuel_inv_sale_variance" className="form-label mt-4">
                      Max Fuel Inventory/Sales Variance
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      className={`input101 ${
                        formik.errors.max_fuel_inv_sale_variance && formik.touched.max_fuel_inv_sale_variance
                          ? "is-invalid"
                          : ""
                      }`}
                      id="max_fuel_inv_sale_variance"
                      name="max_fuel_inv_sale_variance"
                      placeholder="  Max Fuel Inventory/Sales Variance"
                      onChange={formik.handleChange}
                      value={formik.values.max_fuel_inv_sale_variance}
                    />
                    {formik.errors.max_fuel_inv_sale_variance && formik.touched.max_fuel_inv_sale_variance && (
                      <div className="invalid-feedback">
                        {formik.errors.max_fuel_inv_sale_variance}
                      </div>
                    )}
                  </Col>

                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="low_tank_limit"
                        className="form-label mt-4"
                      >
                        Low Tank Limit
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        className={`input101 ${
                          formik.errors.low_tank_limit &&
                          formik.touched.low_tank_limit
                            ? "is-invalid"
                            : ""
                        }`}
                        id="low_tank_limit"
                        name="low_tank_limit"
                        placeholder="Saga Department code"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.low_tank_limit}
                      />
                      {formik.errors.low_tank_limit &&
                        formik.touched.low_tank_limit && (
                          <div className="invalid-feedback">
                            {formik.errors.low_tank_limit}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="max_bunkering_variance"
                        className="form-label mt-4"
                      >
                        Bunkering Tolerance
                        <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex">
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${
                            formik.errors.max_bunkering_variance &&
                            formik.touched.max_bunkering_variance
                              ? "is-invalid"
                              : ""
                          }`}
                          id="max_bunkering_variance"
                          name="max_bunkering_variance"
                          placeholder="Bunkering Tolerance"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.max_bunkering_variance}
                        />
                        <h2 className="ms-2">P</h2>
                      </div>

                      {formik.errors.max_bunkering_variance &&
                        formik.touched.max_bunkering_variance && (
                          <div className="invalid-feedback">
                            {formik.errors.max_bunkering_variance}
                          </div>
                        )}
                    </div>
                  </Col>

                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="vat_rate" className="form-label mt-4">
                        Vat Rate<span className="text-danger">*</span>
                      </label>
                      <textarea
                        className={`input101 ${
                          formik.errors.vat_rate && formik.touched.vat_rate
                            ? "is-invalid"
                            : ""
                        }`}
                        id="vat_rate"
                        name="vat_rate"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.vat_rate}
                        placeholder="Vat Rate"
                      />
                      {formik.errors.vat_rate && formik.touched.vat_rate && (
                        <div className="invalid-feedback">
                          {formik.errors.vat_rate}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="average_ppl" className="form-label mt-4">
                        Use Average PPL
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.average_ppl &&
                          formik.touched.average_ppl
                            ? "is-invalid"
                            : ""
                        }`}
                        id="average_ppl"
                        name="average_ppl"
                        onChange={formik.handleChange}
                        value={formik.values.average_ppl}
                      >
                        <option value="">Select a Use Average Ppl</option>
                        <option value="1">True</option>
                        <option value="2">False</option>
                        <option value="3">None</option>
                      </select>
                      {formik.errors.average_ppl &&
                        formik.touched.average_ppl && (
                          <div className="invalid-feedback">
                            {formik.errors.average_ppl}
                          </div>
                        )}
                    </div>
                  </Col>
                </Row>
                <div className="text-end">
                  <Link
                    type="sussbmit"
                    className="btn btn-danger me-2 "
                    to={`/sites/`}
                  >
                    Cancel
                  </Link>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};
export default withApi(SiteSettings);
