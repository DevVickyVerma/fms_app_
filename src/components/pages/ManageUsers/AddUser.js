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
import DatePicker, { Calendar } from "react-multi-date-picker";
import { useFormikContext } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";

const AddUsers = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  // const { setFieldValue } = useFormikContext();

  const navigate = useNavigate();

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [selectedItems, setSelectedItems] = useState(["1"]);

  const handleCheckboxChange = (checkboxId) => {
    if (selectedItems.includes(checkboxId)) {
      setSelectedItems(selectedItems.filter((item) => item !== checkboxId));
    } else {
      setSelectedItems([...selectedItems, checkboxId]);
    }
    console.log(selectedItems, selectedItems);
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

  const handleSubmit1 = async (values, setSubmitting) => {
    try {
      setSubmitting(true); // Set the submission state to true before making the API call

      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("role_id", values.role);
      formData.append("send_mail", isChecked);

      const postDataUrl = "/user/add";
      const navigatePath = "/users";

      await postData(postDataUrl, formData, navigatePath);

      setSubmitting(false); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error);
      setSubmitting(false); // Set the submission state to false if an error occurs
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange1 = (event) => {
    setIsChecked(event.target.checked);
  };


  const [permissionsArray, setPermissionsArray] = useState([]);
  const [roleitems, setRoleItems] = useState("");
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
        permissionsArray?.includes("user-create");

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
    FetchRoleList();
  }, [isPermissionsSet, permissionsArray]);

  const FetchRoleList = async () => {
    try {
      const response = await getData("/roles");

      if (response && response.data && response.data.data) {
        setRoleItems(response?.data?.data);
      
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  return (
    <>
      {isLoading ? (
       <Loaderimg />
      ) :null }
        <>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add User</h1>

              <Breadcrumb className="breadcrumb">
                <Breadcrumb.Item
                  className="breadcrumb-item"
                  linkAs={Link}
                  linkProps={{ to: "/dashboard" }}
                >
                  Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item  breadcrumds"
                  aria-current="page"
                  linkAs={Link}
                  linkProps={{ to: "/users" }}
                >
                  Manage User
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Add User
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add User</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    first_name: "",
                    role: "",

                    last_name: "",

                    email: "",
                    password: "",

                    send_mail: "1",
                  }}
                  validationSchema={Yup.object({
                    first_name: Yup.string()
                      .max(20, "Must be 20 characters or less")
                      .required("First Name is required"),

                    role: Yup.string().required("Role is required"),
                    last_name: Yup.string().required("Last Name is required"),

                    email: Yup.string()
                      .required(" Email is required")
                      .email("Invalid email format"),

                    password: Yup.string().required("Password is required"),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSubmit1(values, setSubmitting);
                  }}
                >
                  {({
                    handleSubmit,
                    isSubmitting,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                         
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="first_name"
                              >
                                First Name<span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"  autoComplete="off"
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
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="last_name "
                                className=" form-label mt-4"
                              >
                                Last Name<span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"  autoComplete="off"
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
                                component="div"
                                className="invalid-feedback"
                                name="last_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="password "
                                className=" form-label mt-4"
                              >
                                Password<span className="text-danger">*</span>
                              </label>
                              <Field
                                type="password"
                                className={`input101 ${
                                  errors.password && touched.password
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="password"
                                name="password"
                                placeholder="Password"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="password"
                              />
                            </FormGroup>
                          </Col>

                       
                       
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="email"
                                className=" form-label mt-4"
                              >
                                Email
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"  autoComplete="off"
                                className={`input101 ${
                                  errors.email && touched.email
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="email"
                                name="email"
                                placeholder="Email"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="email"
                              />
                            </FormGroup>
                          </Col>
                         
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="email"
                                className="form-label mt-4"
                              >
                                Send Welcome Email
                              </label>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange1}
                              />
                              <span className="ms-1">Yes</span>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="email"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="role"
                                className=" form-label mt-4"
                              >
                                Role
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.role && touched.role
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="role"
                                name="role"
                              >
                                <option value="">Select a Role</option>
                                {roleitems ? (
                                  roleitems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.role_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Role</option>
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
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/users/`}
                        >
                          Cancel
                        </Link>

                        <button
                          type="submit"
                          className="btn btn-primary me-2 "
                          // disabled={Object.keys(errors).length > 0}
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
        </>
      
    </>
  );
};

export default withApi(AddUsers);
