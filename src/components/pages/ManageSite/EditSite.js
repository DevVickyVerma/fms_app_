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
  const [EditSiteData, setEditSiteData] = useState("");

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      console.error(error.message, "error");
      const errorMessage = error.response ? error.response.data.message[0] : error.message;
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
    const GetSiteDetails = async () => {
      const Edit_Site_id = localStorage.getItem("Edit_Site");
      try {
        const response = await axiosInstance.get(
          "/site/detail/?id=" + Edit_Site_id
        );

        if (response) {
          setEditSiteData(response.data.data);
          formik.setValues(response.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };

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
      GetSiteDetails();
    } catch (error) {
      handleError(error);
    }

    console.clear();
  }, []);

  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    console.log(formData,"formData")

    // Iterate over formik.values and convert null to empty strings
    for (const [key, value] of Object.entries(formik.values)) {
      const convertedValue = value === null ? "" : value;
      formData.append(key, convertedValue);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/site/update`,
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
        navigate("/sites");
      } else {
        Errornotify(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      site_code: "",
      site_name: "",
      site_address: "",
      site_status: "",
      business_sub_type: "",
      business_type: "",
      data_import_type_id: "",
      supplier_id: "",
      start_date: "",
      site_display_name: "",
      sage_department_id: "",
      department_sage_code: "",
      bp_credit_card_site_no: "",
      site_report_status: "",
      site_report_date_type: "",
      drs_upload_status: "",

      fuel_commission_calc_status: "",
      bunker_upload_status: "",
      paperwork_status: "",
    },
    validationSchema: Yup.object({
      site_code: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Site Code is required"),
      site_name: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("Site Name is required"),
      site_address: Yup.string().required("Site Address is required"),
      site_status: Yup.string().required("Site Status is required"),
      business_sub_type: Yup.string().required("Business Sub Type is required"),
      business_type: Yup.string().required("Business Type is required"),
      supplier_id: Yup.string().required("Supplier ID is required"),
      start_date: Yup.string().required("DRS Start Date is required"),
      data_import_type_id: Yup.string().required(
        "Data Import Types is required"
      ),
      sage_department_id: Yup.string().required(
        "Sage Department ID is required"
      ),
      department_sage_code: Yup.string().required(
        "Department Sage Code is required"
      ),
      // bunker_upload_status: Yup.string().required(
      //   "Bunker Upload Status is required"
      // ),
      bp_credit_card_site_no: Yup.string().required(
        "Bunker Upload Status is required"
      ),
      // drs_upload_status: Yup.string().required("Drs Upload Status is required"),
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
          <h1 className="page-title">Edit Site</h1>

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
              Manage Sites
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Site
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Edit Site</Card.Title>
            </Card.Header>

            <div class="card-body">
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="site_code">
                        Site Code<span className="text-danger">*</span>
                      </label>
                      <input
                        id="site_code"
                        name="site_code"
                        type="text"
                        className={`input101 ${
                          formik.errors.site_code && formik.touched.site_code
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Site Code"
                        onChange={formik.handleChange}
                        value={formik.values.site_code || ""}
                      />
                      {formik.errors.site_code && formik.touched.site_code && (
                        <div className="invalid-feedback">
                          {formik.errors.site_code}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="site_name">
                        Site Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input101 ${
                          formik.errors.site_name && formik.touched.site_name
                            ? "is-invalid"
                            : ""
                        }`}
                        id="site_name"
                        name="site_name"
                        placeholder="Site Name"
                        onChange={formik.handleChange}
                        value={formik.values.site_name || ""}
                      />
                      {formik.errors.site_name && formik.touched.site_name && (
                        <div className="invalid-feedback">
                          {formik.errors.site_name}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <label
                      htmlFor="site_display_name"
                      className="form-label mt-4"
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      className={`input101 ${
                        formik.errors.site_display_name &&
                        formik.touched.site_display_name
                          ? "is-invalid"
                          : ""
                      }`}
                      id="site_display_name"
                      name="site_display_name"
                      placeholder="Display Name"
                      onChange={formik.handleChange}
                      value={formik.values.site_display_name || ""}
                    />
                    {formik.errors.site_display_name &&
                      formik.touched.site_display_name && (
                        <div className="invalid-feedback">
                          {formik.errors.site_display_name}
                        </div>
                      )}
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="supplier_id" className="form-label mt-4">
                        supplier_id<span className="text-danger">*</span>
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
                        <option value="">Select a supplier_id</option>
                        {AddSiteData.suppliers &&
                        AddSiteData.suppliers.length > 0 ? (
                          AddSiteData.suppliers.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.supplier_name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No supplier_id available</option>
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
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="site_status" className="form-label mt-4">
                        Site Status<span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.site_status &&
                          formik.touched.site_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="site_status"
                        name="site_status"
                        onChange={formik.handleChange}
                        value={formik.values.site_status}
                      >
                        <option value="">Select a Site Status</option>
                        {AddSiteData.site_status &&
                        AddSiteData.site_status.length > 0 ? (
                          AddSiteData.site_status.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Site Status available</option>
                        )}
                      </select>
                      {formik.errors.site_status &&
                        formik.touched.site_status && (
                          <div className="invalid-feedback">
                            {formik.errors.site_status}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="business_type"
                        className="form-label mt-4"
                      >
                        Bussiness Type<span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.business_type &&
                          formik.touched.business_type
                            ? "is-invalid"
                            : ""
                        }`}
                        id="business_type"
                        name="business_type"
                        onChange={handleBusinessTypeChange}
                        value={formik.values.business_type || ""}
                      >
                        <option value="">Select a Bussiness Type</option>
                        {AddSiteData.busines_types &&
                        AddSiteData.busines_types.length > 0 ? (
                          AddSiteData.busines_types.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No BussinessType available</option>
                        )}
                      </select>
                      {formik.errors.business_type &&
                        formik.touched.business_type && (
                          <div className="invalid-feedback">
                            {formik.errors.business_type}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="business_sub_type"
                        className="form-label mt-4"
                      >
                        Bussiness Sub-Type<span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.business_sub_type &&
                          formik.touched.business_sub_type
                            ? "is-invalid"
                            : ""
                        }`}
                        id="business_sub_type"
                        name="business_sub_type"
                        onChange={formik.handleChange}
                        value={formik.values.business_sub_type_id || ""}
                      >
                        <option value="">Select a Bussiness Sub-Type</option>
                        {subTypes && subTypes.length > 0 ? (
                          subTypes.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>
                            No Bussiness Sub-Type available
                          </option>
                        )}
                      </select>
                      {formik.errors.business_sub_type &&
                        formik.touched.business_sub_type && (
                          <div className="invalid-feedback">
                            {formik.errors.business_sub_type}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="sage_department_id"
                        className="form-label mt-4"
                      >
                        Saga Department ID
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.sage_department_id &&
                          formik.touched.sage_department_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="sage_department_id"
                        name="sage_department_id"
                        onChange={formik.handleChange}
                        value={formik.values.sage_department_id}
                      >
                        <option value="">Select a Saga Department ID</option>
                        {AddSiteData.department_codes &&
                        AddSiteData.department_codes.length > 0 ? (
                          AddSiteData.department_codes.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.value}
                            </option>
                          ))
                        ) : (
                          <option disabled>
                            No Saga Department ID available
                          </option>
                        )}
                      </select>
                      {formik.errors.sage_department_id &&
                        formik.touched.sage_department_id && (
                          <div className="invalid-feedback">
                            {formik.errors.sage_department_id}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="department_sage_code"
                        className="form-label mt-4"
                      >
                        Saga Department code
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input101 ${
                          formik.errors.department_sage_code &&
                          formik.touched.department_sage_code
                            ? "is-invalid"
                            : ""
                        }`}
                        id="department_sage_code"
                        name="department_sage_code"
                        placeholder="department_sage_code"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.department_sage_code || ""}
                      />
                      {formik.errors.department_sage_code &&
                        formik.touched.department_sage_code && (
                          <div className="invalid-feedback">
                            {formik.errors.department_sage_code}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="bp_credit_card_site_no"
                        className="form-label mt-4"
                      >
                        BP NCTT Site No
                      </label>
                      <input
                        type="text"
                        className={`input101 ${
                          formik.errors.bp_credit_card_site_no &&
                          formik.touched.bp_credit_card_site_no
                            ? "is-invalid"
                            : ""
                        }`}
                        id="bp_credit_card_site_no"
                        name="bp_credit_card_site_no"
                        placeholder="BP NCTT Site No"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.bp_credit_card_site_no || ""}
                      />
                      {formik.errors.bp_credit_card_site_no &&
                        formik.touched.bp_credit_card_site_no && (
                          <div className="invalid-feedback">
                            {formik.errors.bp_credit_card_site_no}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="start_date" className="form-label mt-4">
                        DRS Start Date<span className="text-danger">*</span>
                      </label>
                      <DatePicker
                        className={`input101 ${
                          formik.errors.start_date && formik.touched.start_date
                            ? "is-invalid"
                            : ""
                        }`}
                        id="start_date"
                        name="start_date"
                        placeholder="start_date"
                        onChange={(date) => {
                          formik.setFieldValue("start_date", date);
                          formik.handleChange({
                            target: { name: "start_date", value: date },
                          });
                        }}
                        onBlur={formik.handleBlur}
                        selected={formik.values.start_date}
                        open={isDatePickerOpen} // Control whether the date picker is open or closed
                        onClick={() => setIsDatePickerOpen(true)} // Open the date picker when the input is clicked
                      />
                      {formik.errors.start_date &&
                        formik.touched.start_date && (
                          <div className="invalid-feedback">
                            {formik.errors.start_date}
                          </div>
                        )}
                    </div>
                  </Col>

                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="site_report_status"
                        className="form-label mt-4"
                      >
                        Report Generation Status
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.site_report_status &&
                          formik.touched.site_report_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="site_report_status"
                        name="site_report_status"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.site_report_status}
                      >
                        <option value="">
                          Select a Report Generation Status
                        </option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      {formik.errors.site_report_status &&
                        formik.touched.site_report_status && (
                          <div className="invalid-feedback">
                            {formik.errors.site_report_status}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="site_report_date_type"
                        className="form-label mt-4"
                      >
                        Report Date Type
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.site_report_date_type &&
                          formik.touched.site_report_date_type
                            ? "is-invalid"
                            : ""
                        }`}
                        id="site_report_date_type"
                        name="site_report_date_type"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.site_report_date_type}
                      >
                        <option value="">Select a Report Date Type</option>
                        <option value="1">Start Date</option>
                        <option value="2">End Date</option>
                      </select>
                      {formik.errors.site_report_date_type &&
                        formik.touched.site_report_date_type && (
                          <div className="invalid-feedback">
                            {formik.errors.site_report_date_type}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="fuel_commission_calc_status"
                        className="form-label mt-4"
                      >
                        Fuel Commission Type
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.fuel_commission_calc_status &&
                          formik.touched.fuel_commission_calc_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="fuel_commission_calc_status"
                        name="fuel_commission_calc_status"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fuel_commission_calc_status}
                      >
                        <option value="">Select a Fuel Commission Type</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      {formik.errors.fuel_commission_calc_status &&
                        formik.touched.fuel_commission_calc_status && (
                          <div className="invalid-feedback">
                            {formik.errors.fuel_commission_calc_status}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="paperwork_status"
                        className="form-label mt-4"
                      >
                        Paper Work Status
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.paperwork_status &&
                          formik.touched.paperwork_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="paperwork_status"
                        name="paperwork_status"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.paperwork_status}
                      >
                        <option value="">Select a Paper Work Status</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      {formik.errors.paperwork_status &&
                        formik.touched.paperwork_status && (
                          <div className="invalid-feedback">
                            {formik.errors.paperwork_status}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="bunker_upload_status"
                        className="form-label mt-4"
                      >
                        Bunkered Sale Status
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.bunker_upload_status &&
                          formik.touched.bunker_upload_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="bunker_upload_status"
                        name="bunker_upload_status"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.bunker_upload_status}
                      >
                        <option value="">Select a Bunkered Sale Status</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                      {formik.errors.bunker_upload_status &&
                        formik.touched.bunker_upload_status && (
                          <div className="invalid-feedback">
                            {formik.errors.bunker_upload_status}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="drs_upload_status"
                        className="form-label mt-4"
                      >
                        DRS Upload Status
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.drs_upload_status &&
                          formik.touched.drs_upload_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="drs_upload_status"
                        name="drs_upload_status"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.drs_upload_status}
                      >
                        <option value="">Select a DRS Upload Status</option>
                        <option value="1">Automatic</option>
                        <option value="2">Manual</option>
                      </select>
                      {formik.errors.drs_upload_status &&
                        formik.touched.drs_upload_status && (
                          <div className="invalid-feedback">
                            {formik.errors.drs_upload_status}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="site_address" className="form-label mt-4">
                        Site Address<span className="text-danger">*</span>
                      </label>
                      <textarea
                        className={`input101 ${
                          formik.errors.site_address &&
                          formik.touched.site_address
                            ? "is-invalid"
                            : ""
                        }`}
                        id="site_address"
                        name="site_address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.site_address || ""}
                        placeholder="Site Address"
                      />
                      {formik.errors.site_address &&
                        formik.touched.site_address && (
                          <div className="invalid-feedback">
                            {formik.errors.site_address}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label
                        htmlFor="data_import_type_id"
                        className="form-label mt-4"
                      >
                        Select Data Import Types
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.data_import_type_id &&
                          formik.touched.data_import_type_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="data_import_type_id"
                        name="data_import_type_id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.data_import_type_id}
                      >
                        <option value=""> Select Data Import Types</option>
                        {AddSiteData.data_import_types &&
                        AddSiteData.data_import_types.length > 0 ? (
                          AddSiteData.data_import_types.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.import_type_name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Machine Type</option>
                        )}
                      </select>
                      {formik.errors.data_import_type_id &&
                        formik.touched.data_import_type_id && (
                          <div className="invalid-feedback">
                            {formik.errors.data_import_type_id}
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
  );
}
