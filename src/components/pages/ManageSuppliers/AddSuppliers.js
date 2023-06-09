import React, { useEffect, useState } from "react";

import { Col, Row, Card, Form, FormGroup, Breadcrumb } from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const AddSuppliers = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("supplier_code", values.supplier_code);
      formData.append("supplier_name", values.supplier_name);
      formData.append("status",values.supplier_status);

      const postDataUrl = "/supplier/add";

      const navigatePath = "/ManageSuppliers";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  useEffect(() => {
    if (isPermissionsSet) {
      const isAddPermissionAvailable =
        permissionsArray?.includes("supplier-create");

      if (permissionsArray?.length > 0) {
        if (isAddPermissionAvailable) {
          console.log(isAddPermissionAvailable, "AddPermissionAvailable");
          // Perform action when permission is available
          // Your code here
        } else {
          // Perform action when permission is not available
          // Your code here
          navigate("/errorpage403");
        }
      } else {
        navigate("/errorpage403");
      }
    }
  }, [isPermissionsSet, permissionsArray]);

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title">Add Suppliers</h1>

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
                    Manage Suppliers
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>

            <Row>
              <Col lg={12} xl={12} md={12} sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title as="h3">Add Suppliers</Card.Title>
                  </Card.Header>
                  <Formik
                    initialValues={{
                      supplier_name: "",
                      supplier_code: "",
                      supplier_status: "1",
                    }}
                    validationSchema={Yup.object({
                      supplier_name: Yup.string()
                        .max(15, "Must be 15 characters or less")
                        .required(" Supplier Name is required"),

                      supplier_code: Yup.string()
                        .required("Supplier Code is required")
                        .matches(/^[a-zA-Z0-9_\- ]+$/, {
                          message:
                            "Supplier Code must not contain special characters",
                          excludeEmptyString: true,
                        })
                        .matches(
                          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                          {
                            message:
                              "Supplier Code must not have consecutive spaces",
                            excludeEmptyString: true,
                          }
                        ),

                      supplier_status: Yup.string().required(
                        "Supplier Status is required"
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
                                <label htmlFor="supplier name">
                                  Supplier Name
                                </label>
                                <Field
                                  type="text"
                                  // className="form-control"
                                  className={`input101 ${
                                    errors.supplier_name &&
                                    touched.supplier_name
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="supplier_name"
                                  name="supplier_name"
                                  placeholder="Supplier Name"
                                />
                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="supplier_name"
                                />
                              </FormGroup>
                            </Col>
                            <Col lg={6} md={12}>
                              <FormGroup>
                                <label htmlFor="supplier_code">
                                  Supplier Code
                                </label>
                                <Field
                                  type="text"
                                  className={`input101 ${
                                    errors.supplier_code &&
                                    touched.supplier_code
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="supplier_code"
                                  name="supplier_code"
                                  placeholder="Supplier Code"
                                />
                                <ErrorMessage
                                  name="supplier_code"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={6} md={12}>
                              <FormGroup>
                                <label htmlFor="supplier_status">
                                  Supplier Status
                                </label>
                                <Field
                                  as="select"
                                  className={`input101 ${
                                    errors.supplier_status &&
                                    touched.supplier_status
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="supplier_status"
                                  name="supplier_status"
                                >
                                  <option value="1">Active</option>
                                  <option value="0">Inactive</option>
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="supplier_status"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Card.Body>
                        <Card.Footer className="text-end">
                          <Link
                            type="submit"
                            className="btn btn-danger me-2 "
                            to={`/managesuppliers/`}
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
export default withApi(AddSuppliers);
