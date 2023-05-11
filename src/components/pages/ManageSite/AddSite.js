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


export default function AddSite() {

  const navigate = useNavigate();


  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);

 
  const handleSubmit1 = (values, setSubmitting) => {
    console.log(values, "handle");
    // setSubmitting(false);
  };

 
  



  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Site</h1>
         
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" linkAs={Link} linkProps={{ to: '/dashboard' }}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item  breadcrumds"
              aria-current="page"
              linkAs={Link} linkProps={{ to: '/sites' }}
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
                first_name: "",
                last_name: "",
                phone_number: "",
                
              }}
              validationSchema={Yup.object({
                first_name: Yup.string()
                  .max(15, "Must be 15 characters or less")
                  .required("First name is required"),

                last_name: Yup.string()
                  .max(20, "Must be 20 characters or less")
                  .required("Last name is required"),
                phone_number: Yup.string()
                  .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
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
                          <label htmlFor="first_name">First Name</label>
                          <Field
                            type="text"
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
                          <label htmlFor="last_name">Last Name</label>
                          <Field
                            type="text"
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
                          <label htmlFor="phone_number">Phone Number</label>
                          <Field
                            type="text"
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
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/roles/`}
                    >
                      Cancel
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary me-2 "
                      disabled={Object.keys(errors).length > 0}
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
    </div>
  );
}
