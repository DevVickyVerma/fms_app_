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
                        className="error"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Form.Label className="form-label">
                        New Password
                      </Form.Label>
                      <Field
                        type="password"
                        className={`input101 ${
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
                        className="error"
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
                        className="error"
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
            <Card.Body>
              <Row>
                <Col lg={6} md={12}>
                  <FormGroup>
                    <label htmlFor="exampleInputname">First Name</label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputname"
                      placeholder="First Name"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6} md={12}>
                  <FormGroup>
                    <label htmlFor="exampleInputname1">Last Name</label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputname1"
                      placeholder="Enter Last Name"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={12}>
                  <FormGroup>
                    <label htmlFor="exampleInputEmail1">Phone Number</label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputname"
                      placeholder="Phone Number"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6} md={12}>
                  <label htmlFor="exampleInputEmail1">Role</label>
                  <select
                    class="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>Your Role</option>
                    <option value="1">Admin</option>
                    <option value="2">Admin</option>
                    <option value="3">Admin</option>
                  </select>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <button type="submit" className="btn btn-primary me-2">
                Update
              </button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
