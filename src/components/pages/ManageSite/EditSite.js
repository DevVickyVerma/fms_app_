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

export default function AddSite() {
  const navigate = useNavigate();
  const [dropdownItems, setDropdownItems] = useState([]);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState("");

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);

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
          console.log(response.data.data);
          setEditSiteData(response.data.data);
          formik.setValues(response.data.data);
          formik.setFieldValue("site_code", response.data.data.site_code);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
          Errornotify("Invalid access token");
          localStorage.clear();
        } else if (
          error.response &&
          error.response.data.status_code === "403"
        ) {
          navigate("/errorpage403");
        } else {
          console.error(error);
        }
      }
    };
    const GetSiteData = async () => {
      try {
        const response = await axiosInstance.get("site/common-data-list");

        if (response.data) {
          setAddSiteData(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
          Errornotify("Invalid access token");
          localStorage.clear();
        } else if (
          error.response &&
          error.response.data.status_code === "403"
        ) {
          navigate("/errorpage403");
        } else {
          console.error(error);
        }
      }
    };

    try {
      GetSiteData();

      GetSiteDetails();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        Errornotify("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else {
        console.error(error);
      }
    }
    // console.clear()
  }, []);

  // const handleSubmit1 = async (values, setSubmitting) => {
  //   const token = localStorage.getItem("token");

  //   const formData = new FormData();
  //   formData.append("bussiness_Type", values.bussiness_Type);
  //   formData.append("business_sub_type_id", values.bussiness_Sub_Type);
  //   formData.append("data_import_type_id", values.Select_machine_type);
  //   formData.append("site_code", values.site_code);
  //   formData.append("site_name", values.site_name);
  //   formData.append("site_display_name", values.display_name);
  //   formData.append("site_address", values.site_Address);
  //   formData.append("start_date", values.DRS_Start_Date);
  //   formData.append("department_sage_code", values.Saga_department_name);

  //   formData.append("drs_upload_status", values.Drs_upload_status);
  //   formData.append("site_status", values.Site_Status);

  //   // try {
  //   //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/site/add`, {
  //   //     method: "POST",
  //   //     headers: {
  //   //       Authorization: `Bearer ${token}`,
  //   //     },
  //   //     body: formData,
  //   //   });

  //   //   const data = await response.json();

  //   //   if (response.ok) {
  //   //     notify(data.message);
  //   //     navigate("/sites");
  //   //     setSubmitting(false);
  //   //   } else {
  //   //     Errornotify(data.message);
  //   //   }
  //   // }catch (error) {
  //   //   if (error.response && error.response.status === 401) {
  //   //     navigate("/login");
  //   //     Errornotify("Invalid access token");
  //   //     localStorage.clear();
  //   //   } else if (error.response && error.response.data.status_code === "403") {
  //   //     Errornotify("/errorpage403");
  //   //   } else {
  //   //     const errorMessage = error.response && error.response.data ? error.response.data.message : "An error occurred";
  //   //     console.error(errorMessage,"errorMessage");
  //   //     Errornotify(errorMessage);
  //   //   }
  //   // }

  //   console.log(values, "formData");
  // };
  const handleSubmit = (values) => {
    console.log(values);
  };

  const validationSchema = Yup.object().shape({
    site_code: Yup.string().required("Site Code is required"),
    site_name: Yup.string().required("Site Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      site_code: "",
      site_name: "",
      site_Address: "",
      Site_Status: "",
      bussiness_Sub_Type: "",
      bussiness_Type: "",
      Select_machine_type: "",
      DRS_Start_Date: "",
      display_name: "",
    },
    validationSchema: validationSchema, // add the validationSchema here
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name
  const inputClass = `form-control ${isInvalid}`;

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
            {/* <Formik
              initialValues={{
                site_code: "",
                site_name: EditSiteData.site_name,
                site_Address: "",
                Site_Status: "",
                bussiness_Sub_Type: "",
                bussiness_Type: "",
                Select_machine_type: "",
                DRS_Start_Date: "",
                display_name: "",
              }}
              validationSchema={Yup.object({
                site_code: Yup.string()
                  .max(20, "Must be 20 characters or less")
                  .required("Site Code is required"),
                site_name: Yup.string()
                  .max(20, "Must be 20 characters or less")
                  .required("Site Name is required"),
                site_Address: Yup.string().required("Site Address is required"),
                Site_Status: Yup.string().required("Site Status is required"),

                bussiness_Sub_Type: Yup.string().required(
                  "Bussiness Sub Type is required"
                ),
                bussiness_Type: Yup.string().required(
                  "Bussiness Type is required"
                ),

                DRS_Start_Date: Yup.string().required(
                  "DRS Start Date is required"
                ),
                Select_machine_type: Yup.string().required(
                  " Data Import Types is required"
                ),
                // display_name: Yup.string().required("Display name is required"),
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
              }) => ( */}
            {/* <Form onSubmit={formik.handleSubmit}>
              <Card.Body>
                <Row>
                  <Col lg={4} md={6}>
                    <FormGroup>
                      <label className="form-label mt-4" htmlFor="site_code">
                        Site Code<span className="text-danger">*</span>
                      </label>

                      <Field
                        type="text"
                        className={`input101 ${
                          formik.errors.site_code && formik.touched.site_code
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
                      <label className=" form-label mt-4" htmlFor="site_name">
                        Site Name<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`input101 ${
                          formik.errors.site_name && formik.touched.site_name
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
                          formik.errors.display_name &&
                          formik.touched.display_name
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
                        Site Status<span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`input101 ${
                          formik.errors.Site_Status &&
                          formik.touched.Site_Status
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
                          <option disabled>No Site Status available</option>
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
                        Bussiness Type<span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`input101 ${
                          formik.errors.bussiness_Type &&
                          formik.touched.bussiness_Type
                            ? "is-invalid"
                            : ""
                        }`}
                        id="bussiness_Type"
                        name="bussiness_Type"
                        onChange={(e) => {
                          const selectedType = e.target.value;

                          // setFieldValue("bussiness_Type", selectedType);
                          setSelectedBusinessType(selectedType);
                          const selectedTypeData =
                            AddSiteData.busines_types.find(
                              (type) => type.name === selectedType
                            );
                          setSubTypes(selectedTypeData.sub_types);
                        }}
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
                          formik.errors.bussiness_Sub_Type &&
                          formik.touched.bussiness_Sub_Type
                            ? "is-invalid"
                            : ""
                        }`}
                        id="bussiness_Sub_Type"
                        name="bussiness_Sub_Type"
                      >
                        <option value="">Select a Bussiness Sub-Type</option>
                        {subTypes && subTypes.length > 0 ? (
                          subTypes.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No bussiness_Sub_Type</option>
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
                        htmlFor="DRS_Start_Date"
                        className=" form-label mt-4"
                      >
                        DRS Start Date<span className="text-danger">*</span>
                      </label>
                      <Field
                        type="date"
                        className={`input101 ${
                          formik.errors.DRS_Start_Date &&
                          formik.touched.DRS_Start_Date
                            ? "is-invalid"
                            : ""
                        }`}
                        id="DRS_Start_Date"
                        name="DRS_Start_Date"
                        placeholder="DRS_Start_Date"
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
                      <label className="form-label mt-4" htmlFor="site_Address">
                        Site Address<span className="text-danger">*</span>
                      </label>

                      <Field
                        as="textarea"
                        type="textarea"
                        className={`input101 ${
                          formik.errors.site_Address &&
                          formik.touched.site_Address
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
                          formik.errors.Select_machine_type &&
                          formik.touched.Select_machine_type
                            ? "is-invalid"
                            : ""
                        }`}
                        id="Select_machine_type"
                        name="Select_machine_type"
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
                      </Field>
                      <ErrorMessage
                        component="div"
                        className="invalid-feedback"
                        name="Select_machine_type"
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
            </Form> */}


          

           
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
                      value={formik.values.site_code}
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
                    <label className=" form-label mt-4" htmlFor="site_name">
                      Site Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="site_name"
                      name="site_name"
                      placeholder="Site Name"
                      onChange={formik.handleChange}
                      value={formik.values.site_name}
                    />
                    {formik.errors.site_name && formik.touched.site_name && (
                      <div className="invalid-feedback">
                        {formik.errors.site_name}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
            
          </Card>
        </Col>
      </Row>
    </div>
  );
}
