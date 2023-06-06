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

import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const AddShops = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("shop_name", values.shop_name);
      formData.append("code", values.code);
      formData.append("status", values.status);

      const postDataUrl = "shop/add";
      const navigatePath = "/ManageShops";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title">Add Shops</h1>

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
                    Manage Shops
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>

            <Row>
              <Col lg={12} xl={12} md={12} sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title as="h3">Add Shops</Card.Title>
                  </Card.Header>
                  <Formik
                    initialValues={{
                      shop_name: "",
                      code: "",
                      status: "",
                    }}
                    validationSchema={Yup.object({
                      shop_name: Yup.string()
                        .max(15, "Must be 15 characters or less")
                        .required(" Shop Name is required"),

                      code: Yup.string()
                        .required("Shop Code is required")
                        .matches(/^[a-zA-Z0-9_\- ]+$/, {
                          message: "code must not contain special characters",
                          excludeEmptyString: true,
                        })
                        .matches(
                          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                          {
                            message:
                              "Charge Code must not have consecutive spaces",
                            excludeEmptyString: true,
                          }
                        ),

                      status: Yup.string().required(
                        "Charge Status is required"
                      ),
                    })}
                    onSubmit={(values) => {
                      handleSubmit1(values);
                    }}
                  >
                    {({ handleSubmit, errors, touched }) => (
                      <Form onSubmit={handleSubmit}>
                        <Card.Body>
                          <Row>
                            <Col lg={6} md={12}>
                              <FormGroup>
                                <label htmlFor="shop_name">Shop Name</label>
                                <Field
                                  type="text"
                                  // className="form-control"
                                  className={`input101 ${
                                    errors.shop_name && touched.shop_name
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="shop_name"
                                  name="shop_name"
                                  placeholder="Shop Name"
                                />
                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="shop_name"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg={6} md={12}>
                              <FormGroup>
                                <label htmlFor="code">Shop Code</label>
                                <Field
                                  type="text"
                                  className={`input101 ${
                                    errors.code && touched.code
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="code"
                                  name="code"
                                  placeholder="Shop Code"
                                />
                                <ErrorMessage
                                  name="code"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={6} md={12}>
                              <FormGroup>
                                <label htmlFor="status">Shop Status</label>
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
                                  {/* <option value="">Select Shop Status</option> */}
                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="status"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer className="text-end">
                          <Link
                            type="submit"
                            className="btn btn-danger me-2 "
                            to={`/AddCharges/`}
                          >
                            Cancel
                          </Link>
                          <button
                            className="btn btn-primary me-2"
                            type="submit"
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
        </>
      )}
    </>
  );
};
export default withApi(AddShops);
