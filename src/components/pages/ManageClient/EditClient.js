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

export default function AddSite() {
  const navigate = useNavigate();

  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState();

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);
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

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const Company_Client_id = localStorage.getItem("Company_Client_id");
  //   const Company_id = localStorage.getItem("Company_id");

  //   const formData = new FormData();

  //   formData.append("client_id", Company_Client_id);
  //   formData.append("company_id", Company_id);

  //   const axiosInstance = axios.create({
  //     baseURL: process.env.REACT_APP_BASE_URL,
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.post("/company/detail", formData);
  //       if (response) {
  //         console.log(response.data.data);
  //         setEditSiteData(response.data.data);
  //         formik.setValues(response.data.data);
  //       }
  //     } catch (error) {
  //       handleError(error);
  //     }
  //   };

  //   try {
  //     fetchData();
  //   } catch (error) {
  //     handleError(error);
  //   }
  //   // console.clear()
  // }, []);
  useEffect(() => {
    fetchClientList();
    console.clear();
  }, []);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchClientList = async () => {
   const id = localStorage.getItem("Client_id");
    try {
      const response = await axiosInstance.GET("/client-detail?id=" + id);

      if (response.data.data.clients.length > 0) {
        // setData(response.data.data.sites);

        setDropdownValue(response.data.data);
      }
    } catch (error) {
      handleError(error)
    }
  };

  // const handleSubmit = async (event) => {
  //   const token = localStorage.getItem("token");
  //   const Company_id = localStorage.getItem("Company_id");
  //   const formData = new FormData();
  //   console.log(formData, "formData");

  //   // Iterate over formik.values and convert null to empty strings
  //   for (const [key, value] of Object.entries(formik.values)) {
  //     const convertedValue = value === null ? "" : value;
  //     formData.append(key, convertedValue);
  //   }
  //   formData.append("company_id", Company_id);

  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASE_URL}/company/update`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     const data = await response.json();

  //     if (response.ok) {
  //       notify(data.message);
  //       navigate("/managecompany");
  //     } else {
  //       Errornotify(data.message);
  //     }
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };


  const handleSubmit =(values)=>{
    console.log(values,"values");
  }
  const formik = useFormik({
    initialValues: {
      client_code: "",
      first_name: "",

      financial_end_month: "",

      // financial_start_month: "",

      financial_start_month: "",

      client_id: "",
      last_name: "",
      email: "",
      password: "",

      status: "",

      lommis_status: "",
    },
    validationSchema: Yup.object({
      client_code: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Client Code is required"),
      last_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Last Name is required"),
      first_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("First Name is required"),

      financial_end_month: Yup.string().required(
        "Financial End Month is required"
      ),
      // client_id: Yup.string().required("Client is required"),

      financial_start_month: Yup.string().required(
        "Financial Start Month is required"
      ),
      email: Yup.string()
        .required(" Email is required")
        .email("Invalid email format"),

      password: Yup.string().required("Password is required"),
      lommis_status: Yup.string().required("Lommis Status is required"),
      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name
  const inputClass = `form-control ${isInvalid}`;
  const handleBusinessTypeChange = (e) => {
    const selectedType = e.target.value;

    formik.setFieldValue("business_type", selectedType);
    setSelectedBusinessType(selectedType);
    const selectedTypeData = AddSiteData.busines_types.find(
      (type) => type.name === selectedType
    );
    setSubTypes(selectedTypeData.sub_types);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Client</h1>

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
              linkProps={{ to: "/managecompany" }}
            >
              Manage Client
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Client
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Edit Client</Card.Title>
            </Card.Header>

            <div class="card-body">
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="client_code">
                        Client Code<span className="text-danger">*</span>
                      </label>
                      <input
                        id="client_code"
                        name="client_code"
                        type="text"
                        className={`input101 ${
                          formik.errors.client_code &&
                          formik.touched.client_code
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Company Code"
                        onChange={formik.handleChange}
                        value={formik.values.client_code || ""}
                      />
                      {formik.errors.client_code &&
                        formik.touched.client_code && (
                          <div className="invalid-feedback">
                            {formik.errors.client_code}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="first_name">
                        First Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input101 ${
                          formik.errors.first_name && formik.touched.first_name
                            ? "is-invalid"
                            : ""
                        }`}
                        id="first_name"
                        name="first_name"
                        placeholder="Company Name"
                        onChange={formik.handleChange}
                        value={formik.values.first_name || ""}
                      />
                      {formik.errors.first_name &&
                        formik.touched.first_name && (
                          <div className="invalid-feedback">
                            {formik.errors.first_name}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <label htmlFor="last_name" className="form-label mt-4">
                      Last Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input101 ${
                        formik.errors.last_name && formik.touched.last_name
                          ? "is-invalid"
                          : ""
                      }`}
                      id="last_name"
                      name="last_name"
                      placeholder=" Company Details"
                      onChange={formik.handleChange}
                      value={formik.values.last_name || ""}
                    />
                    {formik.errors.last_name && formik.touched.last_name && (
                      <div className="invalid-feedback">
                        {formik.errors.last_name}
                      </div>
                    )}
                  </Col>
                
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="email">
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input101 ${
                          formik.errors.email && formik.touched.email
                            ? "is-invalid"
                            : ""
                        }`}
                        id="email"
                        name="email"
                        placeholder="Company Name"
                        onChange={formik.handleChange}
                        value={formik.values.email || ""}
                      />
                      {formik.errors.email && formik.touched.email && (
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="password">
                        password<span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`input101 ${
                          formik.errors.password && formik.touched.password
                            ? "is-invalid"
                            : ""
                        }`}
                        id="password"
                        name="password"
                        placeholder="Company Name"
                        onChange={formik.handleChange}
                        value={formik.values.password || ""}
                      />
                      {formik.errors.password && formik.touched.password && (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>
                  </Col>
                 
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="status" className="form-label mt-4">
                       Status<span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.status && formik.touched.status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="status"
                        name="status"
                        onChange={formik.handleChange}
                        value={formik.values.status}
                      >
                        <option value="">Select a status</option>
                        <option value="1">1</option>
                        <option value="0">0</option>
                      </select>
                      {formik.errors.status && formik.touched.status && (
                        <div className="invalid-feedback">
                          {formik.errors.status}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="financial_start_month"
                        className="form-label mt-4"
                      >
                        Financial Start Month
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.financial_start_month &&
                          formik.touched.financial_start_month
                            ? "is-invalid"
                            : ""
                        }`}
                        id="financial_start_month"
                        name="financial_start_month"
                        onChange={formik.handleChange}
                        value={formik.values.financial_start_month}
                      >
                        <option value="">Select a Financial Start Month</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      {formik.errors.financial_start_month &&
                        formik.touched.financial_start_month && (
                          <div className="invalid-feedback">
                            {formik.errors.financial_start_month}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="financial_end_month"
                        className="form-label mt-4"
                      >
                        Financial End Month
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.financial_end_month &&
                          formik.touched.financial_end_month
                            ? "is-invalid"
                            : ""
                        }`}
                        id="financial_end_month"
                        name="financial_end_month"
                        onChange={formik.handleChange}
                        value={formik.values.financial_end_month}
                      >
                        <option value="">Select a Financial End Month</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      {formik.errors.financial_end_month &&
                        formik.touched.financial_end_month && (
                          <div className="invalid-feedback">
                            {formik.errors.financial_end_month}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="lommis_status"
                        className="form-label mt-4"
                      >
                        Lommis Status<span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.lommis_status &&
                          formik.touched.lommis_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="lommis_status"
                        name="lommis_status"
                        onChange={formik.handleChange}
                        value={formik.values.lommis_status}
                      >
                        <option value="">Select a Lommis Status</option>

                        <option value="1">1</option>
                        <option value="0">0</option>
                      </select>
                      {formik.errors.lommis_status &&
                        formik.touched.lommis_status && (
                          <div className="invalid-feedback">
                            {formik.errors.lommis_status}
                          </div>
                        )}
                    </div>
                  </Col>
                </Row>
         
                <div className="text-end">
                  <Link
                    type="sussbmit"
                    className="btn btn-danger me-2 "
                    to={`/managecompany/`}
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
  );
}
