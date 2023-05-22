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
import { Link, useNavigate } from "react-router-dom";
const initialValues = {
  host: "",
  username: "",
  password: "",
  port: "",
  from_email: "",
  from_name: "",
};

const validationSchema = Yup.object().shape({
  host: Yup.string().required("Smtp Url is required"),
  password: Yup.string()
    .required(" Password is required")
    .min(4, "Password must be at least 4 characters long"),
  username: Yup.string().required("User Name is required"),
  port: Yup.string().required(" Port  is required"),
  from_email: Yup.string().required("From Email is required").email("Invalid email format"),
  from_name: Yup.string().required(" From name  is required"),
});

export default function Settings() {
  const [userDetails, setUserDetails] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/smtp/detail");
      const { data } = response;
      if (data) {
        formik.setValues(response.data.data);
        // setUserDetails(response.data.data);
        // console.log(values)
        // console.log(response.data.data)
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
  };

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      // Iterate over values and convert null to empty strings
      for (const [key, value] of Object.entries(values)) {
        const convertedValue = value === null ? "" : value;
        formData.append(key, convertedValue);
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/smtp/update`,
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
          navigate("/dashboard");
        } else {
          Errornotify(data.message);
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
          Errornotify("/errorpage403");
        } else {
          const errorMessage =
            error.response && error.response.data
              ? error.response.data.message
              : "An error occurred";
          console.error(errorMessage, "errorMessage");
          Errornotify(errorMessage);
        }
      }
    },
  });

  const {
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    handleChange,
    handleBlur,
    values,
  } = formik;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
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
              Settings
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={6} md={12} sm={12}>
          <form onSubmit={handleSubmit}>
            <Card className="profile-edit">
              <Card.Header>
                <Card.Title as="h3">Smtp Settings</Card.Title>
              </Card.Header>
              <div className="card-body">
              <Row>
              <Col lg={6} xl={6} md={6} sm={6}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor="host">
                    SMTP Url<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input101 ${
                      formik.errors.host && formik.touched.host
                        ? "is-invalid"
                        : ""
                    }`}
                    id="host"
                    name="host"
                    placeholder="SMTP url"
                    onChange={formik.handleChange}
                    value={formik.values.host || ""}
                  />
                  {formik.errors.host && formik.touched.host && (
                    <div className="invalid-feedback">{formik.errors.host}</div>
                  )}
                </div>
                </Col>
                <Col lg={6} xl={6} md={6} sm={6}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor="username">
                    User Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input101 ${
                      formik.errors.username && formik.touched.username
                        ? "is-invalid"
                        : ""
                    }`}
                    id="username"
                    name="username"
                    placeholder="User Name"
                    onChange={formik.handleChange}
                    value={formik.values.username || ""}
                  />
                  {formik.errors.username && formik.touched.username && (
                    <div className="invalid-feedback">
                      {formik.errors.username}
                    </div>
                  )}
                </div>
                </Col>
                <Col lg={6} md={12}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor="password">
                    Password<span className="text-danger">*</span>
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
                    placeholder="Password"
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
                <Col lg={6} md={12}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor="port">
                    Port<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input101 ${
                      formik.errors.port && formik.touched.port
                        ? "is-invalid"
                        : ""
                    }`}
                    id="port"
                    name="port"
                    placeholder="Port"
                    onChange={formik.handleChange}
                    value={formik.values.port || ""}
                  />
                  {formik.errors.port && formik.touched.port && (
                    <div className="invalid-feedback">{formik.errors.port}</div>
                  )}
                </div>
                </Col>
                <Col lg={6} md={12}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor="from_email">
                    From Email<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input101 ${
                      formik.errors.from_email && formik.touched.from_email
                        ? "is-invalid"
                        : ""
                    }`}
                    id="from_email"
                    name="from_email"
                    placeholder="From Email"
                    onChange={formik.handleChange}
                    value={formik.values.from_email || ""}
                  />
                  {formik.errors.from_email && formik.touched.from_email && (
                    <div className="invalid-feedback">
                      {formik.errors.from_email}
                    </div>
                  )}
                </div>
                </Col>
                <Col lg={6} md={12}>
                <div className="form-group">
                  <label className="form-label mt-4" htmlFor="from_name">
                    From Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`input101 ${
                      formik.errors.from_name && formik.touched.from_name
                        ? "is-invalid"
                        : ""
                    }`}
                    id="from_name"
                    name="from_name"
                    placeholder="From Name"
                    onChange={formik.handleChange}
                    value={formik.values.from_name || ""}
                  />
                  {formik.errors.from_name && formik.touched.from_name && (
                    <div className="invalid-feedback">
                      {formik.errors.from_name}
                    </div>
                  )}
                </div>
                </Col>
               
                <div className="text-end">
                  <button
                    className="btn btn-primary me-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update
                  </button>
                </div>
               
                </Row>
              </div>
            </Card>
          </form>
        </Col>
        <Col lg={12} xl={6} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Other Settings</Card.Title>
            </Card.Header>
            <Formik
              initialValues={{
                date_format: "",
                pagination: "",
              }}
              validationSchema={Yup.object({
                date_format: Yup.string()
                  .max(15, "Must be 15 characters or less")
                  .required("Date Format is required"),

                pagination: Yup.string()
                  .max(20, "Must be 20 characters or less")
                  .required("Pagination is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, setSubmitting);
              }}
            >
              {({ handleSubmit, isSubmitting, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                  <Card.Body>
                    <Row>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <Form.Label className="form-label">
                            Date Format
                          </Form.Label>

                          <Field
                            type="text"
                            // className="form-control"
                            className={`input101 ${
                              errors.date_format && touched.date_format
                                ? "is-invalid"
                                : ""
                            }`}
                            id="date_format"
                            name="date_format"
                            placeholder="Date Format"
                          />
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="date_format"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <Form.Label className="form-label">
                            Pagination/Per Page
                          </Form.Label>
                          <Field
                            type="text"
                            className={`input101 ${
                              errors.pagination && touched.pagination
                                ? "is-invalid"
                                : ""
                            }`}
                            id="pagination"
                            name="pagination"
                            placeholder="Pagination"
                          />
                          <ErrorMessage
                            name="pagination"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="text-end">
                    <button
                      className="btn btn-primary me-2"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Update
                    </button>
                  </Card.Footer>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
