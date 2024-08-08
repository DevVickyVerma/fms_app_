import React, { useEffect, useState } from "react";

import { Col, Row, Card, Form, FormGroup, Breadcrumb } from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, handleError } from "../../../Utils/ToastUtils";

const AddSite = (props) => {
  const { isLoading, postData } = props;

  const navigate = useNavigate();

  const [AddSiteData, setAddSiteData] = useState([]);

  const [Listcompany, setCompanylist] = useState([]);

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
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, []);

  const fetchCompanyList = async (id) => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.get(`/companies?client_id=${id}`);
      setCompanylist(response.data.data);
      if (response.data.length > 0) {
        // setCompanylist(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
    }
  };

  const handleSubmit1 = async (values, setSubmitting) => {
    try {
      const formData = new FormData();
      formData.append("business_type_id", values.bussiness_Type);
      formData.append("data_import_type_id", values.Select_machine_type);
      formData.append("site_code", values.site_code);
      formData.append("site_name", values.site_name);
      formData.append("site_display_name", values.display_name);
      formData.append("site_address", values.site_Address);
      formData.append("start_date", values.DRS_Start_Date);
      formData.append("department_sage_code", values.Saga_department_name);
      formData.append("bp_credit_card_site_no", values.Bp_nctt_site_no);
      formData.append("bank_ref", values.bank_ref);
      formData.append("supplier_id", values.supplier);
      formData.append("site_report_status", values.Report_generation_Status);
      formData.append("site_report_date_type", values.Report_date_type);
      formData.append(
        "consider_keyfules_cards",
        values.consider_keyfules_cards
      );
      formData.append("sage_department_id", values.Saga_department_code);
      formData.append("drs_upload_status", values.Drs_upload_status);
      formData.append("site_status", values.Site_Status);
      formData.append("security_amount", values.security_amount);
      formData.append("bunker_upload_status", values.Bunkered_sale_status);
      formData.append(
        "fuel_commission_calc_status",
        values.Fuel_commission_type
      );
      formData.append("paperwork_status", values.Paper_work_status);
      formData.append("company_id", values.company_id);
      formData.append("client_id", values.client_id);
      formData.append("lottery_commission", 0);
      formData.append("paypoint_commission", values.paypoint_commission);
      formData.append(
        "instant_lottery_commission",
        values.instant_lottery_commission
      );
      formData.append("shop_commission", 0);
      formData.append("paidout", values.paidout);
      formData.append("apply_sc", values.apply_sc);
      formData.append("loomis_status", values.loomis_status);
      formData.append("cashback_status", values.cashback_status);
      formData.append("auto_dayend", values.auto_dayend);
      formData.append("ignore_tolerance", values.ignore_tolerance);
      formData.append("d_deduction", values.d_deduction);
      formData.append("display_all_sales", values.display_all_sales);
      formData.append("is_reconciled", values.is_reconciled);
      formData.append("fuel_discount", values.fuel_discount);
      formData.append("vat_summary", values.vat_summary);
      formData.append("include_bunkered_sales", values.include_bunkered_sales);
      formData.append("show_admin_sale", values.show_admin_sale);
      formData.append("send_auto_report", values.send_auto_report);
      formData.append("consider_fuel_sales", values.consider_fuel_sales);
      formData.append("shop_sale_file_upload", values.shop_sale_file_upload);
      formData.append("update_tlm_price", values.update_tlm_price);
      formData.append("change_back_date_price", values.change_back_date_price);
      formData.append("cashback_enable", values.cashback_enable);
      formData.append("e_code", values.e_code);

      const postDataUrl = "/site/add";

      const navigatePath = "/sites";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
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
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Site</h1>

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
                  Add Site
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Site</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    site_code: "",
                    site_name: "",
                    site_Address: "",
                    Site_Status: "",

                    bussiness_Type: "",
                    Select_machine_type: "",
                    supplier: "",
                    DRS_Start_Date: "",
                    display_name: "",
                    Saga_department_code: "",

                    // supplier: "",
                    Saga_department_name: "",
                    Bp_nctt_site_no: "",
                    bank_ref: "",
                    Report_generation_Status: "",
                    Report_date_type: "",
                    consider_keyfules_cards: "",
                    Fuel_commission_type: "",
                    Paper_work_status: "",
                    Bunkered_sale_status: "",
                    Drs_upload_status: "",
                    client_id: "",
                    company_id: "",
                    lottery_commission: "",
                    instant_lottery_commission: "",
                    e_code: "",
                    paypoint_commission: "",
                    cashback_enable: 0,
                    shop_commission: 0,
                    paidout: 0,
                    apply_sc: 0,
                    is_reconciled: 0,
                    auto_dayend: 0,
                    ignore_tolerance: 0,
                    d_deduction: 1,
                    display_all_sales: 1,
                    security_amount: "",
                    loomis_status: 0,
                    cashback_status: 0,
                    fuel_discount: 0,
                    vat_summary: 0,
                    include_bunkered_sales: 0,
                    show_admin_sale: 0,
                    send_auto_report: 0,
                    consider_fuel_sales: 1,
                    shop_sale_file_upload: 1,
                    update_tlm_price: 0,
                    change_back_date_price: 0,
                  }}
                  validationSchema={Yup.object({
                    site_code: Yup.string()

                      .required("Site Code is required"),
                    site_name: Yup.string()
                      .max(150, "Must be 20 characters or less")
                      .required("Site Name is required"),
                    site_Address: Yup.string().required(
                      "Site Address is required"
                    ),
                    Site_Status: Yup.string().required(
                      "Site Status is required"
                    ),
                    display_name: Yup.string().required(
                      "Display Name is required"
                    ),

                    bussiness_Type: Yup.string().required(
                      "Business Type is required"
                    ),
                    consider_keyfules_cards: Yup.string().required(
                      "Consider Keyfules Cards is required"
                    ),
                    supplier: Yup.string().required("Supplier is required"),
                    DRS_Start_Date: Yup.string().required(
                      "DRS Start Date is required"
                    ),
                    Select_machine_type: Yup.string().required(
                      " Data Import Types is required"
                    ),

                    Saga_department_code: Yup.string().required(
                      "Sage Department Code  is required"
                    ),

                    Saga_department_name: Yup.string().required(
                      "Saga Department Name is required"
                    ),
                    Drs_upload_status: Yup.string().required(
                      "Drs Upload Status is required"
                    ),

                    Bp_nctt_site_no: Yup.string().required(
                      "Bp Nctt Site No is required"
                    ),
                    bank_ref: Yup.number()
                      .required("Bank Reference Number is required")
                      .min(1, "Number should be greater than zero"),
                    security_amount: Yup.string().required(
                      "Security Amount is required"
                    ),
                    loomis_status: Yup.string().required(
                      "Loomis Status is required"
                    ),
                    cashback_status: Yup.string().required(
                      "Cashback Status is required"
                    ),
                    apply_sc: Yup.string().required(
                      "Apply Shop Commission is required"
                    ),
                    is_reconciled: Yup.string().required(
                      "  Reconciled Data  is required"
                    ),
                    d_deduction: Yup.string().required(
                      "  Deduct Deduction  is required"
                    ),
                    display_all_sales: Yup.string().required(
                      "  Display All Sales is required"
                    ),
                    cashback_enable: Yup.string().required(
                      "  Cashback Enable is required"
                    ),
                    update_tlm_price: Yup.string().required(
                      "Update TLM Price is required"
                    ),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSubmit1(values, setSubmitting);
                  }}
                >
                  {({
                    handleSubmit,
                    isSubmitting,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="client_id"
                                className=" form-label mt-4"
                              >
                                Select Client
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
                                  if (selectedType.length > 0 && selectedType) {
                                    fetchCompanyList(selectedType);
                                    setFieldValue("client_id", selectedType);
                                  }
                                }}
                              >
                                <option value=""> Select Client</option>
                                {AddSiteData.clients &&
                                  AddSiteData.clients.length > 0 ? (
                                  AddSiteData.clients.map((item) => (
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

                          <Col lg={4} md={6}>
                            <div className="form-group">
                              <label
                                htmlFor="company_id"
                                className="form-label mt-4"
                              >
                                Select Company
                              </label>
                              <select
                                className={`input101 ${errors.company_id && touched.company_id
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="company_id"
                                name="company_id"
                                onChange={(e) => {
                                  const selectedType = e.target.value;
                                  if (selectedType.length > 0 && selectedType) {
                                    setFieldValue("company_id", selectedType);
                                  }
                                }}
                              >
                                <option value=""> Select Company</option>
                                {Listcompany.companies &&
                                  Listcompany.companies.length > 0 ? (
                                  Listcompany.companies.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.company_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No clients</option>
                                )}
                              </select>
                              {errors.company_id && touched.company_id && (
                                <div className="invalid-feedback">
                                  {errors.company_id}
                                </div>
                              )}
                            </div>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="supplier"
                                className=" form-label mt-4"
                              >
                                Supplier<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.supplier && touched.supplier
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="supplier"
                                name="supplier"
                              >
                                <option value="">Select a Supplier</option>
                                {AddSiteData.suppliers &&
                                  AddSiteData.suppliers.length > 0 ? (
                                  AddSiteData.suppliers.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.supplier_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>
                                    No Supplier available
                                  </option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="supplier"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className="form-label mt-4"
                                htmlFor="site_code"
                              >
                                Site Code<span className="text-danger">*</span>
                              </label>

                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.site_code && touched.site_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="site_code"
                                name="site_code"
                                placeholder="Site Code"
                              />
                              <ErrorMessage
                                name="site_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="site_name"
                              >
                                Site Name<span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.site_name && touched.site_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="site_name"
                                name="site_name"
                                placeholder="Site Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="site_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className="form-label mt-4"
                                htmlFor="e_code"
                              >
                                Site Id
                              </label>

                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.e_code && touched.e_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="e_code"
                                name="e_code"
                                placeholder="Site Id"
                              />
                              <ErrorMessage
                                name="e_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="display_name "
                                className=" form-label mt-4"
                              >
                                Display Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.display_name && touched.display_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="display_name"
                                name="display_name"
                                placeholder="Display Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="display_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor=" Site_Status"
                                className=" form-label mt-4"
                              >
                                Site Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Site_Status && touched.Site_Status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Site_Status"
                                name="Site_Status"
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
                                  <option disabled>
                                    No Site Status available
                                  </option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Site_Status"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="bussiness_Type"
                                className=" form-label mt-4"
                              >
                                Business Type
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.bussiness_Type &&
                                  touched.bussiness_Type
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="bussiness_Type"
                                name="bussiness_Type"
                                onChange={(e) => {
                                  const selectedType = e.target.value;

                                  setFieldValue("bussiness_Type", selectedType);
                                }}
                              >
                                <option value="">Select a Business Type</option>
                                {AddSiteData.busines_types &&
                                  AddSiteData.busines_types.length > 0 ? (
                                  AddSiteData.busines_types.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>
                                    No BusinessType available
                                  </option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="bussiness_Type"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Saga_department_code"
                                className="form-label mt-4"
                              >
                                Sage Department Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number" // Change the "as" attribute to "type" and set it to "number"
                                className={`input101 ${errors.Saga_department_code &&
                                  touched.Saga_department_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Saga_department_code"
                                name="Saga_department_code"
                                placeholder="Sage Department Code"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Saga_department_code"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Saga_department_name"
                                className=" form-label mt-4"
                              >
                                Sage Department Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.Saga_department_name &&
                                  touched.Saga_department_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Saga_department_name"
                                name="Saga_department_name"
                                placeholder="Sage Department Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Saga_department_name"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Bp_nctt_site_no"
                                className=" form-label mt-4"
                              >
                                BP NCTT Site No{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.Bp_nctt_site_no &&
                                  touched.Bp_nctt_site_no
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Bp_nctt_site_no"
                                name="Bp_nctt_site_no"
                                placeholder="BP NCTT Site No"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Bp_nctt_site_no"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="bank_ref"
                                className=" form-label mt-4"
                              >
                                Bank Reference Number{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.bank_ref && touched.bank_ref
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="bank_ref"
                                name="bank_ref"
                                placeholder="Bank Reference Number"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="bank_ref"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="DRS_Start_Date"
                                className="form-label mt-4"
                              >
                                DRS Start Date
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="date"
                                min={"2023-01-01"}
                                max={getCurrentDate()}
                                onClick={hadndleShowDate}
                                className={`input101  ${errors.DRS_Start_Date &&
                                  touched.DRS_Start_Date
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="DRS_Start_Date"
                                name="DRS_Start_Date"
                                placeholderText="DRS Start Date"
                                onChange={(event) => {
                                  const date = event.target.value;
                                  setFieldValue("DRS_Start_Date", date);
                                }}
                              />

                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="DRS_Start_Date"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Report_generation_Status"
                                className=" form-label mt-4"
                              >
                                Report Generation Status{" "}
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Report_generation_Status &&
                                  touched.Report_generation_Status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Report_generation_Status"
                                name="Report_generation_Status"
                              >
                                <option value="">
                                  Select a Report Generation Status
                                </option>
                                <option value="1">Active</option>
                                <option value="0">InActive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Report_generation_Status"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Report_date_type"
                                className=" form-label mt-4"
                              >
                                Report Date Type{" "}
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Report_date_type &&
                                  touched.Report_date_type
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Report_date_type"
                                name="Report_date_type"
                              >
                                <option value="">
                                  Select a Report Date Type
                                </option>

                                <option value="1">Start Date</option>
                                <option value="2">End Date</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Report_date_type"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="consider_keyfules_cards"
                                className=" form-label mt-4"
                              >
                                Consider Keyfules Cards{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.consider_keyfules_cards &&
                                  touched.consider_keyfules_cards
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="consider_keyfules_cards"
                                name="consider_keyfules_cards"
                              >
                                <option value="">
                                  Consider Keyfules Cards
                                </option>

                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="consider_keyfules_cards"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Fuel_commission_type"
                                className=" form-label mt-4"
                              >
                                Fuel Commission Type{" "}
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Fuel_commission_type &&
                                  touched.Fuel_commission_type
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Fuel_commission_type"
                                name="Fuel_commission_type"
                              >
                                <option value="">
                                  Select a Fuel Commission Type
                                </option>

                                <option value="1">Active</option>
                                <option value="0">InActive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Fuel_commission_type"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Paper_work_status"
                                className=" form-label mt-4"
                              >
                                Paper Work Status{" "}
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Paper_work_status &&
                                  touched.Paper_work_status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Paper_work_status"
                                name="Paper_work_status"
                              >
                                <option value="">
                                  Select a Paper Work Status
                                </option>

                                <option value="1">Active</option>
                                <option value="0">InActive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Paper_work_status"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Bunkered_sale_status"
                                className=" form-label mt-4"
                              >
                                Bunkered Sale Status{" "}
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Bunkered_sale_status &&
                                  touched.Bunkered_sale_status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Bunkered_sale_status"
                                name="Bunkered_sale_status"
                              >
                                <option value="1">Active</option>
                                <option value="0">InActive</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Bunkered_sale_status"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Drs_upload_status"
                                className=" form-label mt-4"
                              >
                                DRS Upload Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Drs_upload_status &&
                                  touched.Drs_upload_status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Drs_upload_status"
                                name="Drs_upload_status"
                              >
                                <option value="">
                                  Select a DRS Upload Status
                                </option>
                                <option value="1">Automatic</option>
                                <option value="2">Manual</option>
                              </Field>

                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Drs_upload_status"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className="form-label mt-4"
                                htmlFor="site_Address"
                              >
                                Site Address
                                <span className="text-danger">*</span>
                              </label>

                              <Field
                                as="textarea"
                                type="textarea"
                                className={`input101 ${errors.site_Address && touched.site_Address
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="site_Address"
                                name="site_Address"
                                placeholder="Site Address"
                              />
                              <ErrorMessage
                                name="site_Address"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Select_machine_type"
                                className=" form-label mt-4"
                              >
                                Select Data Import Types
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.Select_machine_type &&
                                  touched.Select_machine_type
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="Select_machine_type"
                                name="Select_machine_type"
                              >
                                <option value="">
                                  {" "}
                                  Select Data Import Types
                                </option>
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
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="Select_machine_type"
                              />
                            </FormGroup>
                          </Col>

                          {/* ignore tolerance end */}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="security_amount"
                                className=" form-label mt-4"
                              >
                                Security Amount
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.security_amount &&
                                  touched.security_amount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="security_amount"
                                name="security_amount"
                                placeholder="Security Amount "
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="security_amount"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="shop_commission"
                                className=" form-label mt-4"
                              >
                                Shop Commission
                              </label>
                              <Field
                                type="Number"
                                autoComplete="off"
                                className={`input101 ${errors.shop_commission &&
                                  touched.shop_commission
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="shop_commission"
                                name="shop_commission"
                                placeholder="Shop Commission"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="shop_commission"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="lottery_commission"
                                className=" form-label mt-4"
                              >
                                Lottery Commission
                              </label>
                              <Field
                                type="Number"
                                autoComplete="off"
                                className={`input101 ${errors.lottery_commission &&
                                  touched.lottery_commission
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="lottery_commission"
                                name="lottery_commission"
                                placeholder="Lottery Commission"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="lottery_commission"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="instant_lottery_commission"
                                className=" form-label mt-4"
                              >
                                Instant Lottery Commission
                              </label>
                              <Field
                                type="Number"
                                autoComplete="off"
                                className={`input101 ${errors.instant_lottery_commission &&
                                  touched.instant_lottery_commission
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="instant_lottery_commission"
                                name="instant_lottery_commission"
                                placeholder="Instant Lottery Commission"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="instant_lottery_commission"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="paypoint_commission"
                                className=" form-label mt-4"
                              >
                                Paypoint Commission
                              </label>
                              <Field
                                type="Number"
                                autoComplete="off"
                                className={`input101 ${errors.paypoint_commission &&
                                  touched.paypoint_commission
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="paypoint_commission"
                                name="paypoint_commission"
                                placeholder="Paypoint Commission"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="paypoint_commission"
                              />
                            </FormGroup>
                          </Col>
                          {/* auto dayend end */}

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="apply_sc"
                                className=" form-label mt-4"
                              >
                                Apply Shop Commission
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.apply_sc && touched.apply_sc
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="apply_sc"
                                name="apply_sc"
                              >
                                <option value="">Apply Shop Commission</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="apply_sc"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="is_reconciled"
                                className=" form-label mt-4"
                              >
                                Reconciled Data Only
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.is_reconciled && touched.is_reconciled
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="is_reconciled"
                                name="is_reconciled"
                              >
                                <option value="">
                                  {" "}
                                  Select Reconciled Data Only
                                </option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="is_reconciled"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="paidout"
                                className=" form-label mt-4"
                              >
                                Paidout
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.paidout && touched.paidout
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="paidout"
                                name="paidout"
                              >
                                <option value="">Select a paidout</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="paidout"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="loomis_status"
                                className=" form-label mt-4"
                              >
                                Loomis Status
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.loomis_status && touched.loomis_status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="loomis_status"
                                name="loomis_status"
                              >
                                <option value="">Select a Loomis Status</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="loomis_statuss"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="cashback_status"
                                className=" form-label mt-4"
                              >
                                Cashback Status
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.cashback_status &&
                                  touched.cashback_status
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="cashback_status"
                                name="cashback_status"
                              >
                                <option value="">
                                  Select a Cashback Status
                                </option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="cashback_status"
                              />
                            </FormGroup>
                          </Col>
                          {/* Auto dayend Option Start */}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor=" auto_dayend"
                                className=" form-label mt-4"
                              >
                                DRS Auto Dayend
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.auto_dayend && touched.auto_dayend
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="auto_dayend"
                                name="auto_dayend"
                              >
                                <option value="">Select a Dayend</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="auto_dayend"
                              />
                            </FormGroup>
                          </Col>
                          {/* ignore tolerance */}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor=" ignore_tolerance"
                                className=" form-label mt-4"
                              >
                                Ignore Tolerance
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.ignore_tolerance &&
                                  touched.ignore_tolerance
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="ignore_tolerance"
                                name="ignore_tolerance"
                              >
                                <option value="">Select a Tolerance</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="ignore_tolerance"
                              />
                            </FormGroup>
                          </Col>
                          {/* Deduct Deduction */}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor=" d_deduction"
                                className=" form-label mt-4"
                              >
                                Deduct Deduction
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.d_deduction && touched.d_deduction
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="d_deduction"
                                name="d_deduction"
                              >
                                <option value="">
                                  Select a Deduct Deduction
                                </option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="d_deduction"
                              />
                            </FormGroup>
                          </Col>
                          {/* Display All Sales
                           */}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor=" display_all_sales"
                                className=" form-label mt-4"
                              >
                                Display All Sales
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.display_all_sales &&
                                  touched.display_all_sales
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="display_all_sales"
                                name="display_all_sales"
                              >
                                <option value="">
                                  Select a Display All Sales
                                </option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="display_all_sales"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="fuel_discount"
                                className=" form-label mt-4"
                              >
                                Fuel Discount
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.fuel_discount && touched.fuel_discount
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="fuel_discount"
                                name="fuel_discount"
                              >
                                <option value="">Select Fuel Discount</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="fuel_discount "
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="vat_summary"
                                className=" form-label mt-4"
                              >
                                Vat Summary
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.vat_summary && touched.vat_summary
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="vat_summary"
                                name="vat_summary"
                              >
                                <option value="">Select Vat Summary</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="vat_summary"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="include_bunkered_sales"
                                className=" form-label mt-4"
                              >
                                Include Bunkered Sales
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.include_bunkered_sales &&
                                  touched.include_bunkered_sales
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="include_bunkered_sales"
                                name="include_bunkered_sales"
                              >
                                <option value="">
                                  Select Include Bunkered Sales
                                </option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="include_bunkered_sales"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="show_admin_sale"
                                className=" form-label mt-4"
                              >
                                Show Owner Shop Sales(in CLDO)
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.show_admin_sale &&
                                  touched.show_admin_sale
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="show_admin_sale"
                                name="show_admin_sale"
                              >
                                <option value="">
                                  Select Show Owner Shop Sales(in CLDO)
                                </option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="show_admin_sale"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="send_auto_report"
                                className=" form-label mt-4"
                              >
                                Send Auto Report
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.send_auto_report &&
                                  touched.send_auto_report
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="send_auto_report"
                                name="send_auto_report"
                              >
                                <option value="">
                                  Select Send Auto Report
                                </option>
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="send_auto_report"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="send_auto_report"
                                className=" form-label mt-4"
                              >
                                Cashback Enable{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.cashback_enable &&
                                  touched.cashback_enable
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="cashback_enable"
                                name="cashback_enable"
                              >
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="cashback_enable"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="consider_fuel_sales "
                                className=" form-label mt-4"
                              >
                                Consider Fuel Sales{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.consider_fuel_sales &&
                                  touched.consider_fuel_sales
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="consider_fuel_sales "
                                name="consider_fuel_sales "
                              >
                                {" "}
                                <option value="1">Sales Summary</option>
                                <option value="0">
                                  Grades Dispensed Summary
                                </option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="consider_fuel_sales "
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="shop_sale_file_upload "
                                className=" form-label mt-4"
                              >
                                Shop Sale File Upload{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.shop_sale_file_upload &&
                                  touched.shop_sale_file_upload
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="shop_sale_file_upload "
                                name="shop_sale_file_upload "
                              >
                                {" "}
                                <option value="0">No</option>
                                <option value="1">Yes</option>

                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="shop_sale_file_upload"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="update_tlm_price"
                                className=" form-label mt-4"
                              >
                                Update TLM Price{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.update_tlm_price &&
                                  touched.update_tlm_price
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="update_tlm_price"
                                name="update_tlm_price"
                              >
                                {" "}
                                <option value="0">No</option>
                                <option value="1">Yes</option>

                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="update_tlm_price"
                              />
                            </FormGroup>
                          </Col>

                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="change_back_date_price"
                                className=" form-label mt-4"
                              >
                                Update Previous Date Price{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.change_back_date_price &&
                                  touched.change_back_date_price
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="change_back_date_price"
                                name="change_back_date_price"
                              >
                                {" "}
                                <option value="0">No</option>
                                <option value="1">Yes</option>

                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="change_back_date_price"
                              />
                            </FormGroup>
                          </Col>

                        </Row>
                      </Card.Body>

                      <Card.Footer className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/sites/`}
                        >
                          Cancel
                        </Link>

                        <button
                          type="submit"
                          className="btn btn-primary me-2 "
                        // disabled={Object.keys(errors).length > 0}
                        >
                          Save
                        </button>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default withApi(AddSite);
