import { useFormik } from "formik";
import React from "react";
import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";




export default function AddSite(props) {
  const { isLoading, getData, postData } = props;
  const [AddSiteData, setAddSiteData] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    FetchRoleList();
    console.clear();
  }, [id]);

  const FetchRoleList = async () => {
    try {
      const response = await getData(`/site/common-data-list?id=${id}`);

      if (response) {
        formik.setValues(response.data.data);

        GetSiteData();
        setAddSiteData(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetSiteData = async () => {
    try {
      const response = await getData(`/site/detail?id=${id}`);

      if (response) {
        formik.setValues(response?.data?.data);
        // setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (event) => {
    const formData = new FormData();

    // Iterate over formik.values and convert null to empty strings
    for (const [key, value] of Object.entries(formik.values)) {
      const convertedValue = value === null ? "" : value;
      formData.append(key, convertedValue);
    }

    try {
      const formData = new FormData();

      // Iterate over formik.values and convert null to empty strings
      for (const [key, value] of Object.entries(formik.values)) {
        const convertedValue = value === null ? "" : value;
        formData.append(key, convertedValue);
      }

      const postDataUrl = "/site/update";
      const navigatePath = `/sites`;
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      site_code: "",
      site_name: "",
      site_address: "",
      site_status: "",

      business_type: "",
      data_import_type_id: "",
      supplier_id: "",
      start_date: "",
      site_display_name: "",
      sage_department_id: "",
      bank_ref: "",
      department_sage_code: "",
      bp_credit_card_site_no: "",
      site_report_status: "",
      site_report_date_type: "",
      drs_upload_status: "",

      fuel_commission_calc_status: "",
      bunker_upload_status: "",
      paperwork_status: "",
      lottery_commission: "",
      instant_lottery_commission: "",
      paypoint_commission: "",
      shop_commission: "",
      paidout: "",
      apply_sc: "",
      loomis_status: "",
      cashback_status: "",
      auto_dayend: "",
      ignore_tolerance: "",
      d_deduction: "",
      security_amount: "",
      is_reconciled: "",
      consider_keyfules_cards: "",
      fuel_discount: "",
      vat_summary: "",
      include_bunkered_sales: "",
      show_admin_sale: "",
      send_auto_report: "",
      consider_fuel_sales: "",
      shop_sale_file_upload: "",
      update_tlm_price: 0,
      change_back_date_price: 0,
      cashback_enable: "",
      e_code: "",
    },
    validationSchema: Yup.object({
      site_code: Yup.string()

        .required("Site Code is required"),
      site_name: Yup.string()
        .max(150, "Must be 30 characters or less")
        .required("Site Name is required"),
      site_address: Yup.string().required("Site Address is required"),
      send_auto_report: Yup.string().required("Send Auto  Report is required"),
      consider_fuel_sales: Yup.string().required(
        "Consider Fuel Sales  is required"
      ),
      shop_sale_file_upload: Yup.string().required(
        "Shop Sale File Upload is required"
      ),
      update_tlm_price: Yup.string().required(
        "Update TLM Price is required"
      ),
      site_status: Yup.string().required("Site Status is required"),
      business_type: Yup.string().required("Business Type is required"),
      supplier_id: Yup.string().required("Supplier ID is required"),
      start_date: Yup.string().required("DRS Start Date is required"),
      cashback_enable: Yup.string().required("Cashback Enable is required"),
      data_import_type_id: Yup.string().required(
        "Data Import Types is required"
      ),
      sage_department_id: Yup.string().required(
        "Sage Department ID is required"
      ),
      bank_ref: Yup.string()
        .required("Bank Reference Number is required"),
      department_sage_code: Yup.string().required(
        "Department Sage Code is required"
      ),
      consider_keyfules_cards: Yup.string().required(
        "Consider Keyfules Cards is required"
      ),
      bp_credit_card_site_no: Yup.string().required(
        "Bunker Upload Status is required"
      ),
      security_amount: Yup.string().required("Security Amount is required"),
      d_deduction: Yup.string().required("Deduct Deduction is required"),
      cashback_status: Yup.string().required("Cashback Status  is required"),
      loomis_status: Yup.string().required(" Loomis Status  is required"),
      apply_sc: Yup.string().required("Apply Shop Commission  is required"),
      is_reconciled: Yup.string().required("Reconciled Data   is required"),
    }),
    onSubmit: handleSubmit,
  });

  const handleBusinessTypeChange = (e) => {
    const selectedType = e.target.value;

    formik.setFieldValue("business_type", selectedType);

  };

  // Helper function to format the date as "YYYY-MM-DD"
  // Helper function to format the date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
    return `${year}-${month}-${day}`;
  };
  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">
                Edit Site ({formik?.values?.site_display_name})
              </h1>

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

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="site_code"
                          >
                            Site Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="site_code"
                            name="site_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.site_code &&
                              formik.touched.site_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Site Code"
                            onChange={formik.handleChange}
                            value={formik.values.site_code || ""}
                            readOnly
                          />
                          {formik.errors.site_code &&
                            formik.touched.site_code && (
                              <div className="invalid-feedback">
                                {formik.errors.site_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="site_name"
                          >
                            Site Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.site_name &&
                              formik.touched.site_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="site_name"
                            name="site_name"
                            placeholder="Site Name"
                            onChange={formik.handleChange}
                            value={formik.values.site_name || ""}
                          />
                          {formik.errors.site_name &&
                            formik.touched.site_name && (
                              <div className="invalid-feedback">
                                {formik.errors.site_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="e_code"
                          >
                            Site Id
                          </label>
                          <input
                            id="e_code"
                            name="e_code"
                            type="text"
                            autoComplete="off"
                            className={`input101  ${formik.errors.e_code &&
                              formik.touched.e_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Site Id"
                            onChange={formik.handleChange}
                            value={formik.values.e_code || ""}

                          />
                          {formik.errors.e_code &&
                            formik.touched.e_code && (
                              <div className="invalid-feedback">
                                {formik.errors.e_code}
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
                          autoComplete="off"
                          className={`input101 ${formik.errors.site_display_name &&
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
                          <label
                            htmlFor="supplier_id"
                            className="form-label mt-4"
                          >
                            Supplier Id<span className="text-danger">*</span>
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
                            <option value="">Select a Supplier Id</option>
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
                          <label
                            htmlFor="site_status"
                            className="form-label mt-4"
                          >
                            Site Status<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.site_status &&
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
                            className={`input101 ${formik.errors.business_type &&
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
                              <option disabled>
                                No Bussiness Type available
                              </option>
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
                            htmlFor="sage_department_id"
                            className="form-label mt-4"
                          >
                            Sage Department Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number" // Change the <select> element to <input> and set the "type" attribute to "number"
                            className={`input101 ${formik.errors.sage_department_id &&
                              formik.touched.sage_department_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="sage_department_id"
                            name="sage_department_id"
                            onChange={formik.handleChange}
                            placeholder=" Sage Department Code"
                            value={formik.values.sage_department_id}
                          />
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
                          <label htmlFor="bank_ref" className="form-label mt-4">
                            Bank Reference
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text" // Change the <select> element to <input> and set the "type" attribute to "number"
                            className={`input101 ${formik.errors.bank_ref && formik.touched.bank_ref
                              ? "is-invalid"
                              : ""
                              }`}
                            id="bank_ref"
                            name="bank_ref"
                            onChange={formik.handleChange}
                            placeholder=" Bank Reference "
                            value={formik.values.bank_ref}
                          />
                          {formik.errors.bank_ref &&
                            formik.touched.bank_ref && (
                              <div className="invalid-feedback">
                                {formik.errors.bank_ref}
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
                            Sage Department Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.department_sage_code &&
                              formik.touched.department_sage_code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="department_sage_code"
                            name="department_sage_code"
                            placeholder="Sage Department code"
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
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.bp_credit_card_site_no &&
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
                          <label
                            htmlFor="start_date"
                            className="form-label mt-4"
                          >
                            DRS Start Date<span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            min={"2023-01-01"}
                            max={getCurrentDate()}
                            onClick={hadndleShowDate}
                            className={`input101 ${formik.errors.start_date &&
                              formik.touched.start_date
                              ? "is-invalid"
                              : ""
                              }`}
                            id="start_date"
                            name="start_date"
                            placeholder="DRS Start Date"
                            value={
                              formik.values.start_date
                                ? formatDate(formik.values.start_date)
                                : ""
                            }
                            onChange={(event) => {
                              const date = event.target.value;
                              formik.setFieldValue("start_date", date);
                            }}
                            onBlur={formik.handleBlur}
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
                            className={`input101 ${formik.errors.site_report_status &&
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
                            <option value="1">Active</option>
                            <option value="0">InActive</option>
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
                            className={`input101 ${formik.errors.site_report_date_type &&
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
                            className={`input101 ${formik.errors.fuel_commission_calc_status &&
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
                            <option value="">
                              Select a Fuel Commission Type
                            </option>
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
                            className={`input101 ${formik.errors.paperwork_status &&
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
                            className={`input101 ${formik.errors.bunker_upload_status &&
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
                            <option value="">
                              Select a Bunkered Sale Status
                            </option>
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
                            className={`input101 ${formik.errors.drs_upload_status &&
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
                          <label
                            htmlFor="site_address"
                            className="form-label mt-4"
                          >
                            Site Address<span className="text-danger">*</span>
                          </label>
                          <textarea
                            className={`input101 ${formik.errors.site_address &&
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
                            className={`input101 ${formik.errors.data_import_type_id &&
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

                      {/* ignore_tolerance end */}
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="security_amount "
                            className="form-label mt-4"
                          >
                            Security Amount
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.security_amount &&
                              formik.touched.security_amount
                              ? "is-invalid"
                              : ""
                              }`}
                            id="security_amount"
                            name="security_amount"
                            placeholder="Security Amount"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.security_amount}
                          />
                          {formik.errors.security_amount &&
                            formik.touched.security_amount && (
                              <div className="invalid-feedback">
                                {formik.errors.security_amount}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="shop_commission"
                            className="form-label mt-4"
                          >
                            Shop Commission
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.shop_commission &&
                              formik.touched.shop_commission
                              ? "is-invalid"
                              : ""
                              }`}
                            id="shop_commission"
                            name="shop_commission"
                            placeholder="  Lottery Commission"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.shop_commission}
                          />
                          {formik.errors.shop_commission &&
                            formik.touched.shop_commission && (
                              <div className="invalid-feedback">
                                {formik.errors.shop_commission}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="lottery_commission"
                            className="form-label mt-4"
                          >
                            Lottery Commission
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.lottery_commission &&
                              formik.touched.lottery_commission
                              ? "is-invalid"
                              : ""
                              }`}
                            id="lottery_commission"
                            name="lottery_commission"
                            placeholder="  Lottery Commission"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lottery_commission}
                          />
                          {formik.errors.lottery_commission &&
                            formik.touched.lottery_commission && (
                              <div className="invalid-feedback">
                                {formik.errors.lottery_commission}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="instant_lottery_commission"
                            className="form-label mt-4"
                          >
                            Instant Lottery Commission
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.instant_lottery_commission &&
                              formik.touched.instant_lottery_commission
                              ? "is-invalid"
                              : ""
                              }`}
                            id="instant_lottery_commission"
                            name="instant_lottery_commission"
                            placeholder="Instant Lottery Commission"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.instant_lottery_commission}
                          />
                          {formik.errors.instant_lottery_commission &&
                            formik.touched.instant_lottery_commission && (
                              <div className="invalid-feedback">
                                {formik.errors.instant_lottery_commission}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="paypoint_commission"
                            className="form-label mt-4"
                          >
                            Paypoint Commission
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.paypoint_commission &&
                              formik.touched.paypoint_commission
                              ? "is-invalid"
                              : ""
                              }`}
                            id="paypoint_commission"
                            name="paypoint_commission"
                            placeholder="Paypoint Commission"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.paypoint_commission}
                          />
                          {formik.errors.paypoint_commission &&
                            formik.touched.paypoint_commission && (
                              <div className="invalid-feedback">
                                {formik.errors.paypoint_commission}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="apply_sc" className="form-label mt-4">
                            Apply Shop Commission
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.apply_sc && formik.touched.apply_sc
                              ? "is-invalid"
                              : ""
                              }`}
                            id="apply_sc"
                            name="apply_sc"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.apply_sc}
                          >
                            <option value="">Apply Shop Commission</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.apply_sc &&
                            formik.touched.apply_sc && (
                              <div className="invalid-feedback">
                                {formik.errors.apply_sc}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="consider_keyfules_cards"
                            className="form-label mt-4"
                          >
                            Consider Keyfules Cards
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.consider_keyfules_cards &&
                              formik.touched.consider_keyfules_cards
                              ? "is-invalid"
                              : ""
                              }`}
                            id="consider_keyfules_cards"
                            name="consider_keyfules_cards"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.consider_keyfules_cards}
                          >
                            <option value=""> Consider Keyfules Cards</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.consider_keyfules_cards &&
                            formik.touched.consider_keyfules_cards && (
                              <div className="invalid-feedback">
                                {formik.errors.consider_keyfules_cards}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="is_reconciled"
                            className="form-label mt-4"
                          >
                            Reconciled Data Only
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.is_reconciled &&
                              formik.touched.is_reconciled
                              ? "is-invalid"
                              : ""
                              }`}
                            id="is_reconciled"
                            name="is_reconciled"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.is_reconciled}
                          >
                            <option value="">
                              {" "}
                              Select Reconciled Data Only
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.is_reconciled &&
                            formik.touched.is_reconciled && (
                              <div className="invalid-feedback">
                                {formik.errors.is_reconciled}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="paidout" className="form-label mt-4">
                            Paidout
                          </label>
                          <select
                            className={`input101 ${formik.errors.paidout && formik.touched.paidout
                              ? "is-invalid"
                              : ""
                              }`}
                            id="paidout"
                            name="paidout"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.paidout}
                          >
                            <option value="">Select a Paidout</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.paidout && formik.touched.paidout && (
                            <div className="invalid-feedback">
                              {formik.errors.paidout}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="loomis_status"
                            className="form-label mt-4"
                          >
                            Loomis Status
                          </label>
                          <select
                            className={`input101 ${formik.errors.loomis_status &&
                              formik.touched.loomis_status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="loomis_status"
                            name="loomis_status"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.loomis_status}
                          >
                            <option value="">Select a loomis_status</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.loomis_status &&
                            formik.touched.loomis_status && (
                              <div className="invalid-feedback">
                                {formik.errors.loomis_status}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="cashback_status"
                            className="form-label mt-4"
                          >
                            Cashback Status
                          </label>
                          <select
                            className={`input101 ${formik.errors.cashback_status &&
                              formik.touched.cashback_status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="cashback_status"
                            name="cashback_status"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.cashback_status}
                          >
                            <option value="">Select a cashback_status</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.cashback_status &&
                            formik.touched.cashback_status && (
                              <div className="invalid-feedback">
                                {formik.errors.cashback_status}
                              </div>
                            )}
                        </div>
                      </Col>

                      {/* auto Dayend Start */}
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="auto_dayend"
                            className="form-label mt-4"
                          >
                            DRS Auto Dayend
                          </label>
                          <select
                            className={`input101 ${formik.errors.auto_dayend &&
                              formik.touched.auto_dayend
                              ? "is-invalid"
                              : ""
                              }`}
                            id="auto_dayend"
                            name="auto_dayend"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.auto_dayend}
                          >
                            <option value="">Select a Auto Dayend</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.auto_dayend &&
                            formik.touched.auto_dayend && (
                              <div className="invalid-feedback">
                                {formik.errors.auto_dayend}
                              </div>
                            )}
                        </div>
                      </Col>
                      {/* ignore_tolerance start */}
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="ignore_tolerance"
                            className="form-label mt-4"
                          >
                            Ignore Tolerance
                          </label>
                          <select
                            className={`input101 ${formik.errors.ignore_tolerance &&
                              formik.touched.ignore_tolerance
                              ? "is-invalid"
                              : ""
                              }`}
                            id="ignore_tolerance"
                            name="ignore_tolerance"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.ignore_tolerance}
                          >
                            <option value="">Select a Ignore Tolerance</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.ignore_tolerance &&
                            formik.touched.ignore_tolerance && (
                              <div className="invalid-feedback">
                                {formik.errors.ignore_tolerance}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="d_deduction"
                            className="form-label mt-4"
                          >
                            Deduct Deduction
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.d_deduction &&
                              formik.touched.d_deduction
                              ? "is-invalid"
                              : ""
                              }`}
                            id="d_deduction"
                            name="d_deduction"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.d_deduction}
                          >
                            <option value="">Select a Deduct Deduction</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.d_deduction &&
                            formik.touched.d_deduction && (
                              <div className="invalid-feedback">
                                {formik.errors.d_deduction}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="display_all_sales"
                            className="form-label mt-4"
                          >
                            Display All Sales
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.display_all_sales &&
                              formik.touched.display_all_sales
                              ? "is-invalid"
                              : ""
                              }`}
                            id="display_all_sales"
                            name="display_all_sales"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.display_all_sales}
                          >
                            <option value="">Select a Display All Sales</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.display_all_sales &&
                            formik.touched.display_all_sales && (
                              <div className="invalid-feedback">
                                {formik.errors.display_all_sales}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="fuel_discount"
                            className="form-label mt-4"
                          >
                            Fuel Discount
                          </label>
                          <select
                            className={`input101 ${formik.errors.fuel_discount &&
                              formik.touched.fuel_discount
                              ? "is-invalid"
                              : ""
                              }`}
                            id="fuel_discount"
                            name="fuel_discount"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.fuel_discount}
                          >
                            <option value="">Select a Fuel Discount</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.fuel_discount &&
                            formik.touched.fuel_discount && (
                              <div className="invalid-feedback">
                                {formik.errors.fuel_discount}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="include_bunkered_sales"
                            className="form-label mt-4"
                          >
                            Include Bunkered Sales
                          </label>
                          <select
                            className={`input101 ${formik.errors.include_bunkered_sales &&
                              formik.touched.include_bunkered_sales
                              ? "is-invalid"
                              : ""
                              }`}
                            id="include_bunkered_sales"
                            name="include_bunkered_sales"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.include_bunkered_sales}
                          >
                            <option value="">
                              Select a Include Bunkered Sales
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.include_bunkered_sales &&
                            formik.touched.include_bunkered_sales && (
                              <div className="invalid-feedback">
                                {formik.errors.include_bunkered_sales}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="vat_summary"
                            className="form-label mt-4"
                          >
                            Vat Summary
                          </label>
                          <select
                            className={`input101 ${formik.errors.vat_summary &&
                              formik.touched.vat_summary
                              ? "is-invalid"
                              : ""
                              }`}
                            id="vat_summary"
                            name="vat_summary"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.vat_summary}
                          >
                            <option value="">Select a Vat Summary</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.vat_summary &&
                            formik.touched.vat_summary && (
                              <div className="invalid-feedback">
                                {formik.errors.vat_summary}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="show_admin_sale"
                            className="form-label mt-4"
                          >
                            Show Owner Shop Sales(in CLDO)
                          </label>
                          <select
                            className={`input101 ${formik.errors.show_admin_sale &&
                              formik.touched.show_admin_sale
                              ? "is-invalid"
                              : ""
                              }`}
                            id="show_admin_sale"
                            name="show_admin_sale"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.show_admin_sale}
                          >
                            <option value="">
                              Select Show Owner Shop Sales(in CLDO)
                            </option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                          {formik.errors.show_admin_sale &&
                            formik.touched.show_admin_sale && (
                              <div className="invalid-feedback">
                                {formik.errors.show_admin_sale}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="send_auto_report"
                            className="form-label mt-4"
                          >
                            Send Auto Report
                          </label>
                          <select
                            className={`input101 ${formik.errors.send_auto_report &&
                              formik.touched.send_auto_report
                              ? "is-invalid"
                              : ""
                              }`}
                            id="send_auto_report"
                            name="send_auto_report"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.send_auto_report}
                          >
                            <option value="">Select Send Auto Report</option>
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                          {formik.errors.send_auto_report &&
                            formik.touched.send_auto_report && (
                              <div className="invalid-feedback">
                                {formik.errors.send_auto_report}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="cashback_enable"
                            className="form-label mt-4"
                          >
                            Send Cashback Enable{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.cashback_enable &&
                              formik.touched.cashback_enable
                              ? "is-invalid"
                              : ""
                              }`}
                            id="cashback_enable"
                            name="cashback_enable"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.cashback_enable}
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                          {formik.errors.cashback_enable &&
                            formik.touched.cashback_enable && (
                              <div className="invalid-feedback">
                                {formik.errors.cashback_enable}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="consider_fuel_sales"
                            className="form-label mt-4"
                          >
                            Consider Fuel Sales{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.consider_fuel_sales &&
                              formik.touched.consider_fuel_sales
                              ? "is-invalid"
                              : ""
                              }`}
                            id="consider_fuel_sales"
                            name="consider_fuel_sales"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.consider_fuel_sales}
                          >
                            <option value="1">Sales Summary</option>
                            <option value="0">Grades Dispensed Summary</option>
                          </select>
                          {formik.errors.consider_fuel_sales &&
                            formik.touched.consider_fuel_sales && (
                              <div className="invalid-feedback">
                                {formik.errors.consider_fuel_sales}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="shop_sale_file_upload"
                            className="form-label mt-4"
                          >
                            Shop Sale File Upload{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.shop_sale_file_upload &&
                              formik.touched.shop_sale_file_upload
                              ? "is-invalid"
                              : ""
                              }`}
                            id="shop_sale_file_upload"
                            name="shop_sale_file_upload"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.shop_sale_file_upload}
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                          {formik.errors.shop_sale_file_upload &&
                            formik.touched.shop_sale_file_upload && (
                              <div className="invalid-feedback">
                                {formik.errors.shop_sale_file_upload}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="update_tlm_price"
                            className="form-label mt-4"
                          >
                            Update TLM Price{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.update_tlm_price &&
                              formik.touched.update_tlm_price
                              ? "is-invalid"
                              : ""
                              }`}
                            id="update_tlm_price"
                            name="update_tlm_price"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.update_tlm_price}
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                          {formik.errors.update_tlm_price &&
                            formik.touched.update_tlm_price && (
                              <div className="invalid-feedback">
                                {formik.errors.update_tlm_price}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="change_back_date_price"
                            className="form-label mt-4"
                          >
                            Update Previous Date Price{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.change_back_date_price &&
                              formik.touched.change_back_date_price
                              ? "is-invalid"
                              : ""
                              }`}
                            id="change_back_date_price"
                            name="change_back_date_price"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.change_back_date_price}
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                          {formik.errors.change_back_date_price &&
                            formik.touched.change_back_date_price && (
                              <div className="invalid-feedback">
                                {formik.errors.change_back_date_price}
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
    </>
  );
}
