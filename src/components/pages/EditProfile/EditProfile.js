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
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";

export default function EditProfile() {
  const [userDetails, setUserDetails] = useState("");
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Current Password is required"),
    password: Yup.string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters long"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initialValues = {
    old_password: "",
    password: "",
    password_confirmation: "",
  };

  const notify = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const Errornotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
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

  const handlesubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("old_password", values.old_password);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/update/password`,
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
        setLoading(false);
      } else {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;
        console.log(errorMessage);
        Errornotify(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSubmit1 = async (values, setSubmitting) => {
    console.log(values, "values");
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
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
      setLoading(false);
    } else {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(" ")
        : data.message;
      console.log(errorMessage);
      setLoading(false);
      Errornotify(errorMessage);
    }
    setLoading(false);
  };
  // const data = useSelector((state) => state.userData.data);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Profile</h1>
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
                  Edit Profile
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
                        <Card.Title as="h3">Edit Password</Card.Title>
                        {/* <p>cat fact: {data.fact}</p>
                    <p>cat fact: {data.length}</p> */}
                      </Card.Header>
                      <Card.Body>
                        <FormGroup>
                          <Form.Label className="form-label">
                            Current Password
                          </Form.Label>
                          <Field
                            type="password"
                            className={` input101 ${
                              errors.old_password && touched.old_password
                                ? "is-invalid"
                                : ""
                            }`}
                            name="old_password"
                            placeholder=" Current Password"
                          />
                          <ErrorMessage
                            name="old_password"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Form.Label className="form-label">
                            New Password
                          </Form.Label>
                          <Field
                            type="password"
                            className={`input101  ${
                              errors.password && touched.password
                                ? "is-invalid"
                                : ""
                            }`}
                            name="password"
                            placeholder=" New Password"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Form.Label className="form-label">
                            Confirm Password
                          </Form.Label>
                          <Field
                            type="password"
                            className={`input101 ${
                              errors.password_confirmation &&
                              touched.password_confirmation
                                ? "is-invalid"
                                : ""
                            }`}
                            name="password_confirmation"
                            placeholder="Confirm Password"
                          />
                          <ErrorMessage
                            name="password_confirmation"
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
                  <Card.Title as="h3">Edit Profile</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    first_name: localStorage.getItem("First_name") || "",
                    last_name: localStorage.getItem("Last_name") || "",
                    phone_number: localStorage.getItem("Phone_Number") || "",
                  }}
                  validationSchema={Yup.object({
                    first_name: Yup.string()
                     
                      .required("First name is required"),

                    last_name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .required("Last name is required"),
                    phone_number: Yup.string()
                      .matches(
                        /^\d{10}$/,
                        "Phone number must be exactly 10 digits"
                      )
                      .required("Phone number is required"),
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
                              <label
                                className=" form-label mt-4"
                                htmlFor="first_name"
                              >
                                First Name
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                // className="form-control"
                                className={`input101 ${
                                  errors.first_name && touched.first_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="first_name"
                                name="first_name"
                                placeholder="First Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="first_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="last_name"
                              >
                                Last Name
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${
                                  errors.last_name && touched.last_name
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="last_name"
                                name="last_name"
                                placeholder="Last Name"
                              />
                              <ErrorMessage
                                name="last_name"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={6} md={12}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="phone_number"
                              >
                                Phone Number
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${
                                  errors.phone_number && touched.phone_number
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="phone_number"
                                name="phone_number"
                                placeholder="Phone Number"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="phone_number"
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
      </>
    </>
  );
}
