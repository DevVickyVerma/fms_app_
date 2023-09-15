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
  Modal,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
export default function EditProfile() {
  const UserPermissions = useSelector((state) => state?.data?.data);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [UserPermissionstwo_factor, setUserPermissionstwo_factor] =
    useState(false);

  const [factordata, setfactordata] = useState();

  useEffect(() => {
    if (UserPermissions) {
      console.log(UserPermissions, "two_factor");
      setUserPermissionstwo_factor(UserPermissions?.two_factor);
      formik.setValues(UserPermissions);
    }
  }, [UserPermissions]);

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Current Password is required"),
    password: Yup.string()
      .required("New Password is required")
      .min(5, "Password must be at least 5 characters long"),
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
  const token = localStorage.getItem("token");
  const handlesubmit = async (values) => {
    setLoading(true);
    try {
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
        localStorage.clear();
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
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
    // formData.append("role", values.role);
    // formData.append("phone_number", values.phone_number);

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
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Last name is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit1(values, setSubmitting);
    },
  });
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userPermissions = useSelector((state) => state?.data?.data);
  const Active2FA = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`enable/two-factor`);
      if (response) {
        console.log(response.data.data, "fetchDatafactor");
        setfactordata(response?.data?.data);
        setLoading(false);
        setShowModal(true);
        console.log(UserPermissions?.two_factor, "UserPermissions?.two_factor");

        console.log(userPermissions, "UserPermissions?.two_factor");
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  const GetDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/detail`);
      if (response) {
        console.log(response?.data?.data?.two_factor, "detailfetchDatafactor");
        setUserPermissionstwo_factor(response?.data?.data?.two_factor);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  const Disable2FA = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`disable/two-factor`);
      if (response) {
        GetDetails();
        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleVerifyAuthentication = async (value) => {
    console.log("handleVerifyAuthentication1", value);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("two_factor_code", value.authenticationCode);

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/enable/two-factor/verify`,
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
        setShowModal(false);
        notify(data.message);
        console.log(UserPermissions?.two_factor, "UserPermissions?.two_factor");
        setUserPermissionstwo_factor(UserPermissions?.two_factor);
        GetDetails();
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
  const authenticationCodevalidationSchema = Yup.object().shape({
    authenticationCode: Yup.string().required(
      "Authentication Code is required"
    ),
  });

  const authenticationCodeformik = useFormik({
    initialValues: {
      authenticationCode: "", // Initial value for the authentication code
    },
    validationSchema: authenticationCodevalidationSchema,
    onSubmit: (values) => {
      console.log(values, "handleVerifyAuthentication");
      handleVerifyAuthentication(values);
    },
  });

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
            <Col lg={12} xl={4} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Profile</Card.Title>
                </Card.Header>
                <form onSubmit={formik.handleSubmit}>
                  <Card.Body>
                    <Row>
                      <Col lg={12} md={12}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="first_name"
                          >
                            First Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.first_name &&
                              formik.touched.first_name
                                ? "is-invalid"
                                : ""
                            }`}
                            id="first_name"
                            name="first_name"
                            onChange={formik.handleChange}
                            placeholder="First Name"
                            value={formik.values.first_name}
                          />
                          {formik.errors.first_name &&
                            formik.touched.first_name && (
                              <div className="invalid-feedback">
                                {formik.errors.first_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={12} md={12}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="last_name"
                          >
                            Last Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.last_name &&
                              formik.touched.last_name
                                ? "is-invalid"
                                : ""
                            }`}
                            id="last_name"
                            name="last_name"
                            placeholder="Last Name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.last_name &&
                            formik.touched.last_name && (
                              <div className="invalid-feedback">
                                {formik.errors.last_name}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="text-end">
                    <button
                      className="btn btn-primary me-2"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      Update
                    </button>
                  </Card.Footer>
                </form>
              </Card>
            </Col>
            <Col lg={12} xl={4} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Mobile App Authentication </Card.Title>
                </Card.Header>

                <Card.Body>
                  <Row>
                    <p>Setup the 2FA feature</p>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-end">
                  {UserPermissionstwo_factor ? (
                    <button
                      className="btn btn-danger ml-4"
                      type="submit"
                      onClick={Disable2FA}
                    >
                      Disable 2FA
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary me-2"
                      onClick={Active2FA}
                    >
                      Setup 2FA
                    </button>
                  )}
                </Card.Footer>
              </Card>
              <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title style={{ color: "#333" }}>
                    Two-factor Authentication (2FA)
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="Disable2FA-modal ">
                  <div className="modal-contentDisable2FA">
                    {/* Add modal content here */}
                    <p className="instruction-text">
                      Use the following methods to set up 2FA:
                    </p>
                    <ul className="method-list">
                      <li>
                        Use the Google Authenticator app to scan the QR Code
                      </li>
                      <li>Use the Authy app to scan the QR Code</li>
                      <li>
                        Use the Authenticator extension in Chrome to scan the QR
                        Code
                      </li>
                    </ul>
                    <hr />
                    <strong className="text-muted fs-15 fw-semibold  fuel-site-name">
                      Scan QR Code
                    </strong>
                    <hr />
                    <img
                      src={factordata?.qrCode}
                      alt={"factordata"}
                      className="qr-code-image mx-auto d-block"
                      style={{ width: "200px", height: "200px" }}
                    />
                    <hr />
                    <strong className="text-muted fs-15 fw-semibold  fuel-site-name">
                      OR Enter Code into your App
                    </strong>
                    <hr />
                    <p className="secret-key">
                      Secret Key: {factordata?.secret}
                    </p>
                    <hr />
                    <strong className="text-muted fs-15 fw-semibold  fuel-site-name">
                      Verify Code
                    </strong>
                    <hr />
                    <form onSubmit={authenticationCodeformik.handleSubmit}>
                      <input
                        type="text"
                        className="input101 authentication-code-input"
                        id="authenticationCode"
                        name="authenticationCode"
                        placeholder="Authentication Code"
                        value={
                          authenticationCodeformik.values.authenticationCode
                        }
                        onChange={authenticationCodeformik.handleChange}
                        onBlur={authenticationCodeformik.handleBlur}
                      />
                      {authenticationCodeformik.touched.authenticationCode &&
                        authenticationCodeformik.errors.authenticationCode && (
                          <div className="error-message">
                            {authenticationCodeformik.errors.authenticationCode}
                          </div>
                        )}
                      <div className="text-end mt-4">
                        <button
                          type="btn"
                          className="btn btn-danger mx-4"
                          onClick={handleCloseModal}
                        >
                          Close
                        </button>

                        <button
                          className="btn btn-primary ml-4 verify-button"
                          type="submit"
                          disabled={!formik.isValid}
                        >
                          Verify & Authentication
                        </button>
                      </div>
                    </form>
                  </div>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
}
