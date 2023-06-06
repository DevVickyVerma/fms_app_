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
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const AddCharges = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const navigate = useNavigate();
 

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("charge_name", values.charge_name);
      formData.append("charge_code", values.charge_code);
      formData.append("charge_status", values.charge_status);

      const postDataUrl = "charge/add";

      const navigatePath = "/ManageCharges";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };


  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  useEffect(() => {
    const isAddPermissionAvailable = permissionsArray?.includes("charges-create");
  
    if (permissionsArray.length > 0) {
      if (isAddPermissionAvailable) {
        console.log(isAddPermissionAvailable, "AddPermissionAvailable");
        // Perform action when permission is available
        // Your code here
      } else {
        // console.log(isAddPermissionAvailable, "NoAddPermissionAvailable");
        // Perform action when permission is not available
        // Your code here
        navigate("/errorpage403");
      }
    }
  }, [permissionsArray]);



  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title">Add Charges</h1>

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
                    Manage Charges
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>

            <Row>
              <Col lg={12} xl={12} md={12} sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title as="h3">Add Charges</Card.Title>
                  </Card.Header>
                  <Formik
                    initialValues={{
                      charge_name: "",
                      charge_code: "",
                      charge_status: "",
                    }}
                    validationSchema={Yup.object({
                      charge_name: Yup.string()
                        .max(15, "Must be 15 characters or less")
                        .required(" Charge Name is required"),

                      charge_code: Yup.string()
                        .required("Charge Code is required")
                        .matches(/^[a-zA-Z0-9_\- ]+$/, {
                          message:
                            "charge_code must not contain special characters",
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

                      charge_status: Yup.string().required(
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
                                <label htmlFor="charge_name">Charge Name</label>
                                <Field
                                  type="text"
                                  // className="form-control"
                                  className={`input101 ${
                                    errors.charge_name && touched.charge_name
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="charge_name"
                                  name="charge_name"
                                  placeholder="Charge Name"
                                />
                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="charge_name"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg={6} md={12}>
                              <FormGroup>
                                <label htmlFor="charge_code">Charge Code</label>
                                <Field
                                  type="text"
                                  className={`input101 ${
                                    errors.charge_code && touched.charge_code
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="charge_code"
                                  name="charge_code"
                                  placeholder="Charge Code"
                                />
                                <ErrorMessage
                                  name="charge_code"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={6} md={12}>
                              <FormGroup>
                                <label htmlFor="charge_status">
                                  Charge Status
                                </label>
                                <Field
                                  as="select"
                                  className={`input101 ${
                                    errors.charge_status &&
                                    touched.charge_status
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="charge_status"
                                  name="charge_status"
                                >
                                  <option value="">Select Charge Status</option>
                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="charge_status"
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
export default withApi(AddCharges);
