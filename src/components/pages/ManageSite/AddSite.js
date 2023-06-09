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
import DatePicker, { Calendar } from "react-multi-date-picker";
import { useFormikContext } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import { useSelector } from "react-redux";

export default function AddSite() {
  // const { setFieldValue } = useFormikContext();

  const navigate = useNavigate();
  const [dropdownItems, setDropdownItems] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [Calendervalue, SetCalenderonChange] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const notify = (message) => toast.success(message);
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
    // console.clear()
  }, []);

  const handleSubmit1 = async (values, setSubmitting) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("bussiness_Type", values.bussiness_Type);
    formData.append("business_sub_type_id", values.bussiness_Sub_Type);
    formData.append("data_import_type_id", values.Select_machine_type);
    formData.append("site_code", values.site_code);
    formData.append("site_name", values.site_name);
    formData.append("site_display_name", values.display_name);
    formData.append("site_address", values.site_Address);
    formData.append("start_date", values.DRS_Start_Date);
    formData.append("department_sage_code", values.Saga_department_name);
    formData.append("bp_credit_card_site_no", values.Bp_nctt_site_no);
    formData.append("supplier_id", values.supplier);
    formData.append("site_report_status", values.Report_generation_Status);
    formData.append("site_report_date_type", values.Report_date_type);
    formData.append("sage_department_id", values.Saga_department_code);
    formData.append("drs_upload_status", values.Drs_upload_status);
    formData.append("site_status", values.Site_Status);
    formData.append("bunker_upload_status", values.Bunkered_sale_status);
    formData.append("fuel_commission_calc_status", values.Fuel_commission_type);
    formData.append("paperwork_status", values.Paper_work_status);
    formData.append("company_id", values.company_id);
    formData.append("client_id", values.client_id);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/site/add`,
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
        setSubmitting(false);
      } else {
        Errornotify(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };
  const Loaderimg = () => {
    return (
      <div id="global-loader">
        <loderdata.Loadersbigsizes1 />
      </div>
    );
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
        permissionsArray?.includes("site-create");

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

  return (
    <>
      {isLoading ? (
        Loaderimg()
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
                    bussiness_Sub_Type: "",
                    bussiness_Type: "",
                    Select_machine_type: "",
                    supplier: "",
                    DRS_Start_Date: "",
                    display_name: "",
                    Saga_department_code: "",

                    // supplier: "",
                    Saga_department_name: "",
                    Bp_nctt_site_no: "",

                    Report_generation_Status: "",
                    Report_date_type: "",
                    Fuel_commission_type: "",
                    Paper_work_status: "",
                    Bunkered_sale_status: "",
                    Drs_upload_status: "",
                    client_id:"",
                    company_id:"",
                  }}
                  validationSchema={Yup.object({
                    site_code: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .required("Site Code is required"),
                    site_name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .required("Site Name is required"),
                    site_Address: Yup.string().required(
                      "Site Address is required"
                    ),
                    Site_Status: Yup.string().required(
                      "Site Status is required"
                    ),

                    bussiness_Sub_Type: Yup.string().required(
                      "Bussiness Sub Type is required"
                    ),
                    bussiness_Type: Yup.string().required(
                      "Bussiness Type is required"
                    ),
                    supplier: Yup.string().required("Supplier is required"),
                    DRS_Start_Date: Yup.string().required(
                      "DRS Start Date is required"
                    ),
                    Select_machine_type: Yup.string().required(
                      " Data Import Types is required"
                    ),
                    // display_name: Yup.string().required("Display name is required"),
                    Saga_department_code: Yup.string().required(
                      "Saga Department Code  is required"
                    ),

                    Saga_department_name: Yup.string().required(
                      "Saga Department Name is required"
                    ),
                    Drs_upload_status: Yup.string().required(
                      "Drs Upload Status is required"
                    ),
                    client_id: Yup.string().required(
                      "Client is required"
                    ),
                    Company_id: Yup.string().required(
                      "Company is required"
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
                                className="form-label mt-4"
                                htmlFor="site_code"
                              >
                                Site Code<span className="text-danger">*</span>
                              </label>

                              <Field
                                type="text"
                                className={`input101 ${
                                  errors.site_code && touched.site_code
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
                                className={`input101 ${
                                  errors.site_name && touched.site_name
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
                                htmlFor="display_name "
                                className=" form-label mt-4"
                              >
                                Display Name
                              </label>
                              <Field
                                type="text"
                                className={`input101 ${
                                  errors.display_name && touched.display_name
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
                                htmlFor="supplier"
                                className=" form-label mt-4"
                              >
                                Supplier<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.supplier && touched.supplier
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
                                htmlFor=" Site_Status"
                                className=" form-label mt-4"
                              >
                                Site Status
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.Site_Status && touched.Site_Status
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
                                Bussiness Type
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.bussiness_Type &&
                                  touched.bussiness_Type
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="bussiness_Type"
                                name="bussiness_Type"
                                onChange={(e) => {
                                  const selectedType = e.target.value;

                                  setFieldValue("bussiness_Type", selectedType);
                                  setSelectedBusinessType(selectedType);
                                  const selectedTypeData =
                                    AddSiteData.busines_types.find(
                                      (type) => type.name === selectedType
                                    );
                                  setSubTypes(selectedTypeData.sub_types);
                                }}
                              >
                                <option value="">
                                  Select a Bussiness Type
                                </option>
                                {AddSiteData.busines_types &&
                                AddSiteData.busines_types.length > 0 ? (
                                  AddSiteData.busines_types.map((item) => (
                                    <option key={item.id} value={item.name}>
                                      {item.name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>
                                    No BussinessType available
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
                                htmlFor="bussiness_Sub_Type"
                                className=" form-label mt-4"
                              >
                                Bussiness Sub-Type
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.bussiness_Sub_Type &&
                                  touched.bussiness_Sub_Type
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="bussiness_Sub_Type"
                                name="bussiness_Sub_Type"
                              >
                                <option value="">
                                  Select a Bussiness Sub-Type
                                </option>
                                {subTypes && subTypes.length > 0 ? (
                                  subTypes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>
                                    No bussiness_Sub_Type
                                  </option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="bussiness_Sub_Type"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="Saga_department_code"
                                className=" form-label mt-4"
                              >
                                Saga Department Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.Saga_department_code &&
                                  touched.Saga_department_code
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="Saga_department_code"
                                name="Saga_department_code"
                              >
                                <option value="">
                                  Select a Saga Department Code
                                </option>
                                {AddSiteData.department_codes &&
                                AddSiteData.department_codes.length > 0 ? (
                                  AddSiteData.department_codes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.value}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>
                                    No Saga Department Code
                                  </option>
                                )}
                              </Field>
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
                                Saga Department Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                className={`input101 ${
                                  errors.Saga_department_name &&
                                  touched.Saga_department_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="Saga_department_name"
                                name="Saga_department_name"
                                placeholder="Saga Department Name"
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
                                BP NCTT Site No
                              </label>
                              <Field
                                type="text"
                                className={`input101 ${
                                  errors.Bp_nctt_site_no &&
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
                                htmlFor="DRS_Start_Date"
                                className="form-label mt-4"
                              >
                                DRS Start Date
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="date"
                                className={`input101  ${
                                  errors.DRS_Start_Date &&
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
                                className={`input101 ${
                                  errors.Report_generation_Status &&
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
                                className={`input101 ${
                                  errors.Report_date_type &&
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
                                htmlFor="Fuel_commission_type"
                                className=" form-label mt-4"
                              >
                                Fuel Commission Type{" "}
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.Fuel_commission_type &&
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
                                className={`input101 ${
                                  errors.Paper_work_status &&
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
                                className={`input101 ${
                                  errors.Bunkered_sale_status &&
                                  touched.Bunkered_sale_status
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="Bunkered_sale_status"
                                name="Bunkered_sale_status"
                              >
                                <option value="">
                                  Select a Bunkered Sale Status
                                </option>
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
                                className={`input101 ${
                                  errors.Drs_upload_status &&
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
                                className={`input101 ${
                                  errors.site_Address && touched.site_Address
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
                                className={`input101 ${
                                  errors.Select_machine_type &&
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
                                className={`input101 ${
                                  errors.client_id &&
                                  touched.client_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="client_id"
                                name="client_id"
                              >
                                <option value="">
                                  {" "}
                                  Select Client
                                </option>
                                {/* {AddSiteData.data_import_types &&
                                AddSiteData.data_import_types.length > 0 ? (
                                  AddSiteData.data_import_types.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.import_type_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Client</option>
                                )} */}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="client_id"
                              />
                            </FormGroup>
                          </Col>
                             <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="company_id"
                                className=" form-label mt-4"
                              >
                                Select Company
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.company_id &&
                                  touched.company_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="company_id"
                                name="company_id"
                              >
                                <option value="">
                                  {" "}
                                  Select Company
                                </option>
                                {/* {AddSiteData.data_import_types &&
                                AddSiteData.data_import_types.length > 0 ? (
                                  AddSiteData.data_import_types.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.import_type_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Client</option>
                                )} */}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_id"
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
}
