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

export default function Settings() {
  const [userDetails, setUserDetails] = useState("");
  const navigate = useNavigate();
  //   useEffect(() => {
  //     fetchData();
  //   }, []);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.post("/detail");
      const { data } = response;
      if (data) {
        // const firstName = data.data.first_name ?? "";
        // const lastName = data.data.pagination ?? "";
        // const phoneNumber = data.data.phone_number ?? "";
        // const full_name = data.data.full_name ?? "";
        // localStorage.setItem("First_name", firstName);
        // localStorage.setItem("full_name", full_name);
        // localStorage.setItem("pagination", lastName);
        // localStorage.setItem("Phone_Number", phoneNumber);

        setUserDetails(data.data.first_name);
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
  };

  const validationSchema = Yup.object().shape({
    smtp_url: Yup.string().required("Smtp Url is required"),
    password: Yup.string()
      .required(" Password is required")
      .min(8, "Password must be at least 8 characters long"),
    user_name: Yup.string().required("User Name is required"),
    port: Yup.string().required(" Port  is required"),
  });

  const initialValues = {
    smtp_url: "",
    password: "",
    user_name: "",
    port: "",
  };

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);

  //   const handlesubmit = async (values) => {
  //     const token = localStorage.getItem("token");

  //     const formData = new FormData();
  //     formData.append("smtp_url", values.smtp_url);
  //     formData.append("password", values.password);
  //     formData.append("user_name", values.user_name);
  //     formData.append("port", values.port);

  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASE_URL}/update/password`,
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
  //     } else {
  //       Errornotify(data.message);
  //     }
  //   };

  const handlesubmit = (values) => {
    console.log(values, "smtpvalues");
  };

  const handleSubmit1 = async (values, setSubmitting) => {
    console.log(values, "values");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("pagination", values.pagination);
    formData.append("role", values.role);
    formData.append("phone_number", values.phone_number);

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/update-profile`,
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
      setSubmitting(false);
    } else {
      Errornotify(data.message);
    }
  };

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
        <Col lg={12} xl={4} md={12} sm={12}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              handlesubmit(values);
            }}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Card className="profile-edit">
                  <Card.Header>
                    <Card.Title as="h3">Smtp Settings</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <FormGroup>
                      <Form.Label className="form-label">Smtp Url</Form.Label>
                      <Field
                        type="text"
                        className={` input101 ${
                          errors.smtp_url && touched.smtp_url
                            ? "is-invalid"
                            : ""
                        }`}
                        name="smtp_url"
                        placeholder=" Smtp Url"
                      />
                      <ErrorMessage
                        name="smtp_url"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Form.Label className="form-label">User Name</Form.Label>
                      <Field
                        type="text"
                        className={`input101 ${
                          errors.user_name && touched.user_name
                            ? "is-invalid"
                            : ""
                        }`}
                        name="user_name"
                        placeholder="User Name"
                      />
                      <ErrorMessage
                        name="user_name"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Form.Label className="form-label">Password</Form.Label>
                      <Field
                        type="password"
                        className={`input101  ${
                          errors.password && touched.password
                            ? "is-invalid"
                            : ""
                        }`}
                        name="password"
                        placeholder="Password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Form.Label className="form-label">Port</Form.Label>
                      <Field
                        type="text"
                        className={`input101 ${
                          errors.port && touched.port ? "is-invalid" : ""
                        }`}
                        name="port"
                        placeholder="Port"
                      />
                      <ErrorMessage
                        name="port"
                        component="div"
                        className="invalid-feedback"
                      />
                    </FormGroup>
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
                </Card>
              </Form>
            )}
          </Formik>
        </Col>
        <Col lg={12} xl={8} md={12} sm={12}>
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
                handleSubmit1(values, setSubmitting);
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
