import React, { useEffect } from "react";
import * as formelement from "../../../data/Form/formelement/formelement";
import * as editprofile from "../../../data/Pages/editprofile/editprofile";
import { Link } from "react-router-dom";
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

export default function EditProfile() {
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

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);

  const handlesubmit = async (values) => {
    const token = localStorage.getItem("token");

    console.log(values, "Object");

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/update/password`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();

    if (response.ok) {
      notify(data.message);
      console.log(data, "data");
    } else {
      console.log(data, "data");
      Errornotify(data.message);
    }
  };

  const handleSubmit1 = (values, setSubmitting) => {
    console.log(values, "values");

    setSubmitting(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Profile</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Pages
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
              console.log(values, "values");
              setSubmitting(false);
              handlesubmit(values);
            }}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Card className="profile-edit">
                  <Card.Header>
                    <Card.Title as="h3">Edit Password</Card.Title>
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
                firstName: "",
                lastName: "",
                phoneNumber: "",
                role: "",
              }}
              validationSchema={Yup.object({
                firstName: Yup.string()
                  .max(15, "Must be 15 characters or less")
                  .required("First name is required"),

                lastName: Yup.string()
                  .max(20, "Must be 20 characters or less")
                  .required("Last name is required"),
                phoneNumber: Yup.string()
                  .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
                  .required("Phone number is required"),
                role: Yup.string().required("Required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                console.log(values, "values");
                handleSubmit1(values, setSubmitting);
              }}
            >
              {({ handleSubmit, isSubmitting, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                  <Card.Body>
                    <Row>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label htmlFor="firstName">First Name</label>
                          <Field
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            placeholder="First Name"
                          />
                          <ErrorMessage name="firstName" />
                        </FormGroup>
                      </Col>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label htmlFor="lastName">Last Name</label>
                          <Field
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            placeholder="Last Name"
                          />
                          <ErrorMessage name="lastName" />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label htmlFor="phoneNumber">Phone Number</label>
                          <Field
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Phone Number"
                          />
                          <ErrorMessage name="phoneNumber" />
                        </FormGroup>
                      </Col>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label htmlFor="role">Role</label>
                          <Field
                            as="select"
                            className="form-select"
                            id="role"
                            name="role"
                          >
                            <option value="">Select a Role</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                          </Field>
                          <ErrorMessage name="role" />
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
