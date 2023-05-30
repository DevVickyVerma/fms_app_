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

export default function AddClient() {
    const [dropdownValue, setDropdownValue] = useState([]);
  const navigate = useNavigate();

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else if (error.response && error.response.data.message) {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
  
      if (errorMessage) {
        Errornotify(errorMessage);
      } else {
        throw new Error("An error occurred.");
      }
    } else {
      throw new Error("An error occurred.");
    }
  }
  
  

  const handleSubmit1 = async (values, setSubmitting) => {
    try {
      const token = localStorage.getItem("token");
  
      const formData = new FormData();
      formData.append("business_sub_name", values.business_name);
      formData.append("slug", values.slug);
      formData.append("status", values.status);
      formData.append("business_type_id", values.business_type_id);
  
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/business/add-sub-type`,
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
        if (data && data.message && Array.isArray(data.message)) {
          data.message.forEach((errorMsg) => {
            Errornotify(errorMsg);
          });
        } else {
          throw new Error("An error occurred.");
        }
      }
    } catch (error) {
      handleError(error);
      console.log(error, "hamdlerrro9r");
    }
  };
  
  
  useEffect(() => {
    fetchBusinessList();
    console.clear();
  }, []);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchBusinessList = async () => {
    try {
      const response = await axiosInstance.get("/business/types");

      if (response.data.data.length > 0) {
         console.log(response.data);

        setDropdownValue(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        Errornotify("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Sub-Business</h1>

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
              Manage Sub-Business
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Add Sub-Business</Card.Title>
            </Card.Header>
            <Formik
              initialValues={{
                business_name: "",
                slug: "",

                status: "",
                business_type_id:"",
              }}
              validationSchema={Yup.object({
                business_name: Yup.string()
                  .max(15, "Must be 15 characters or less")
                  .required(" Bussiness Name is required"),
                  business_type_id:Yup.string().required("status is required"),

                slug: Yup.string()
                  .max(20, "Must be 20 characters or less")
                  .required("Slug is required"),

                status: Yup.string().required("status is required"),
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
                          <label htmlFor="business_name">Bussiness Name</label>
                          <Field
                            type="text"
                            // className="form-control"
                            className={`input101 ${
                              errors.business_name && touched.business_name
                                ? "is-invalid"
                                : ""
                            }`}
                            id="business_name"
                            name="business_name"
                            placeholder="Bussiness Name"
                          />
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="business_name"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label htmlFor="slug">Slug</label>
                          <Field
                            type="text"
                            className={`input101 ${
                              errors.slug && touched.slug ? "is-invalid" : ""
                            }`}
                            id="slug"
                            name="slug"
                            placeholder="Slug"
                          />
                          <ErrorMessage
                            name="slug"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label htmlFor="status">status</label>
                          <Field
                            as="select"
                            className={`input101 ${
                              errors.status && touched.status
                                ? "is-invalid"
                                : ""
                            }`}
                            id="status"
                            name="status"
                          >
                            <option value="">Select a Status</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </Field>
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="status"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            htmlFor="business_type_id"
                            className=" form-label mt-4"
                          >
                            Business Type <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            className={`input101 ${
                              errors.business_type_id && touched.business_type_id
                                ? "is-invalid"
                                : ""
                            }`}
                            id="business_type_id"
                            name="business_type_id"
                          >
                            <option value=""> Select  Business Type</option>
                            {dropdownValue.data &&
                            dropdownValue.data.length > 0 ? (
                              dropdownValue.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.business_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No  Business Type</option>
                            )}
                          </Field>
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="business_type_id"
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
                      Add
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
