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

export default function AddClient() {
  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post("/role-list");
        setDropdownItems(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);



  

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);

 

  const handleSubmit1 = async (values, setSubmitting) => {
 

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
   
      setSubmitting(false);
    } else {
    
      Errornotify(data.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Business</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Pages
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Add Business
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
       
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Add Business</Card.Title>
            </Card.Header>
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                phone_number: "",
                role: "",
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
                role: Yup.string().required("Role is required"),
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
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label htmlFor="role">Role</label>
                          <Field
                            as="select"
                            className={`input101 ${
                              errors.role && touched.role ? "is-invalid" : ""
                            }`}
                            id="role"
                            name="role"
                          >
                            <option value="">Select a Role</option>
                            {dropdownItems && dropdownItems.length > 0 ? (
                              dropdownItems.map((item) => (
                                <option key={item.id} value={item.name}>
                                  {item.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No roles available</option>
                            )}
                          </Field>
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="role"
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
