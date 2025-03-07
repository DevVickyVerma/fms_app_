import { useEffect, useRef, useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { BsCapslock } from "react-icons/bs";
import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  Breadcrumb,
  Modal,
  OverlayTrigger,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { AiOutlineClose } from "react-icons/ai";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import { confirmPasswordTooltip, passwordTooltip } from "../../../Utils/commonFunctions/commonFunction";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import withApi from "../../../Utils/ApiHelper";

const EditProfile = ({ getData }) => {

  const { handleError } = useErrorHandler();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [UserPermissionstwo_factor, setUserPermissionstwo_factor] =
    useState(false);
  // eslint-disable-next-line no-unused-vars
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [passwordVisibleForCurrent, setPasswordVisibleForCurrent] =
    useState(true);
  const [passwordVisibleForNew, setPasswordVisibleForNew] = useState(true);
  const [passwordVisibleForConfirm, setPasswordVisibleForConfirm] =
    useState(true);

  const [factordata, setfactordata] = useState();

  useEffect(() => {
    if (UserPermissions) {
      setUserPermissionstwo_factor(UserPermissions?.two_factor);
      formik.setValues(UserPermissions);
    }
  }, [UserPermissions]);





  const togglePasswordVisibilityForNew = () => {
    setPasswordVisibleForNew(!passwordVisibleForNew);
  };
  const togglePasswordVisibilityForConfirm = () => {
    setPasswordVisibleForConfirm(!passwordVisibleForConfirm);
  };
  const togglePasswordVisibilityForCurrent = () => {
    setPasswordVisibleForCurrent(!passwordVisibleForCurrent);
  };

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Current Password is required"),
    password: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one numeric digit")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const initialValues = {
    old_password: "",
    password: "",
    password_confirmation: "",
  };

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
        SuccessAlert(data.message);

        setLoading(false);
      } else {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;

        ErrorAlert(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSubmit1 = async (values, setSubmitting) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);

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
      SuccessAlert(data.message);
      navigate("/dashboard");
      setSubmitting(false);
      setLoading(false);
    } else {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(" ")
        : data.message;

      setLoading(false);
      ErrorAlert(errorMessage);
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

        .required("Last name is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit1(values, setSubmitting);
    },
  });

  const Active2FA = async () => {
    setLoading(true);
    try {
      const response = await getData(`enable/two-factor`);
      if (response) {
        setfactordata(response?.data?.data);
        setLoading(false);
        setShowModal(true);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  const GetDetails = async () => {
    setLoading(true);
    try {
      const response = await getData(`/detail`);
      if (response) {
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
      const response = await getData(`disable/two-factor`);
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
        SuccessAlert(data.message);

        setUserPermissionstwo_factor(UserPermissions?.two_factor);
        GetDetails();
        setLoading(false);
      } else {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;

        ErrorAlert(errorMessage);
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
      "Authentication code is required"
    ),
  });

  const authenticationCodeformik = useFormik({
    initialValues: {
      authenticationCode: "", // Initial value for the authentication code
    },
    validationSchema: authenticationCodevalidationSchema,
    onSubmit: (values) => {
      handleVerifyAuthentication(values);
    },
  });
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your 2FA will get disable",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Disable it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Disable2FA();
      }
    });
  };
  const [twoFactorKey, setTwoFactorKey] = useState(
    localStorage.getItem("two_factor")
  );
  const storedKeyRef = useRef(localStorage.getItem("two_factor"));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedKey = localStorage.getItem("two_factor");
      storedKeyRef.current = storedKey;
      if (storedKey !== twoFactorKey) {
        setTwoFactorKey(storedKey);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [twoFactorKey]);
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

          <Row className="mb-6">
            <Col lg={12} xl={4} md={12} sm={12} style={{ margin: "20px 0" }}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(false);
                  handlesubmit(values);
                }}
              >
                {({ handleSubmit, isSubmitting, errors, touched }) => (
                  <Form onSubmit={handleSubmit} style={{ height: "100%" }}>
                    <Card className="profile-edit" style={{ height: "100%" }}>
                      <Card.Header>
                        <Card.Title as="h3">Update Password</Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <FormGroup>
                          <label
                            className=" form-label mt-4"
                            htmlFor="first_name"
                          >
                            Current Password

                            <span className="text-danger">*</span>
                          </label>

                          <div>
                            <div
                              className="wrap-input100 validate-input"
                              style={{ display: "flex" }}
                            >
                              <Field
                                // type="password"
                                type={
                                  passwordVisibleForCurrent
                                    ? "password"
                                    : "text"
                                }
                                className={` input101 ${errors.old_password && touched.old_password
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                name="old_password"
                                placeholder=" Current Password"
                              />
                              {capsLockActive ? (
                                <>
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    <BsCapslock size={16} />{" "}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}

                              {!capsLockActive ? (
                                <>
                                  <span
                                    onClick={togglePasswordVisibilityForCurrent}
                                    style={{
                                      cursor: "pointer",
                                      zIndex: "11",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    {passwordVisibleForCurrent ? (
                                      <AiFillEyeInvisible size={18} />
                                    ) : (
                                      <AiFillEye size={18} />
                                    )}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            <div
                              style={{ color: "#f82649", marginTop: "0.25rem" }}
                            >
                              <ErrorMessage
                                name="old_password"
                                // component="div"
                                className="invalid-feedback"
                                style={{ flexDirection: "row", color: "red" }}
                              />
                            </div>
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <label
                            className=" form-label mt-4"
                            htmlFor="first_name"
                          >
                            New Password
                            <OverlayTrigger placement="right" overlay={passwordTooltip}>
                              <i className="ph ph-info pointer" />
                            </OverlayTrigger>
                            <span className="text-danger">*</span>
                          </label>
                          <div>
                            <div
                              className="wrap-input100 validate-input"
                              style={{ display: "flex" }}
                            >
                              <Field
                                // type="password"
                                type={
                                  passwordVisibleForNew ? "password" : "text"
                                }
                                className={`input101  ${errors.password && touched.password
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                name="password"
                                placeholder=" New Password"
                              />

                              {capsLockActive ? (
                                <>
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    <BsCapslock size={16} />{" "}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}

                              {!capsLockActive ? (
                                <>
                                  <span
                                    onClick={togglePasswordVisibilityForNew}
                                    style={{
                                      cursor: "pointer",
                                      zIndex: "11",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    {passwordVisibleForNew ? (
                                      <AiFillEyeInvisible size={18} />
                                    ) : (
                                      <AiFillEye size={18} />
                                    )}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            <div
                              style={{ color: "#f82649", marginTop: "0.25rem" }}
                            >
                              <ErrorMessage
                                name="password"
                                // component="div"
                                className="invalid-feedback"
                                style={{ flexDirection: "row", color: "red" }}
                              />
                            </div>
                          </div>
                        </FormGroup>
                        <FormGroup>
                          <Form.Label className="form-label">
                            Confirm Password<OverlayTrigger placement="right" overlay={confirmPasswordTooltip}>
                              <i className="ph ph-info pointer " />
                            </OverlayTrigger>
                            <span className="text-danger">*</span>
                          </Form.Label>

                          <div>
                            <div
                              className="wrap-input100 validate-input"
                              style={{ display: "flex" }}
                            >
                              <Field
                                // type="password"
                                type={
                                  passwordVisibleForConfirm
                                    ? "password"
                                    : "text"
                                }
                                className={`input101 ${errors.password_confirmation &&
                                  touched.password_confirmation
                                  ? "is-invalid"
                                  : ""
                                  }`}

                                name="password_confirmation"
                                placeholder="Confirm Password"
                              />

                              {capsLockActive ? (
                                <>
                                  <span
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    <BsCapslock size={16} />{" "}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}

                              {!capsLockActive ? (
                                <>
                                  <span
                                    onClick={togglePasswordVisibilityForConfirm}
                                    style={{
                                      cursor: "pointer",
                                      zIndex: "11",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      borderTopRightRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                      marginLeft: "-31px",
                                      color: "rgb(28 97 218 / 67%)",
                                    }}
                                  >
                                    {" "}
                                    {passwordVisibleForConfirm ? (
                                      <AiFillEyeInvisible size={18} />
                                    ) : (
                                      <AiFillEye size={18} />
                                    )}
                                  </span>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            <div
                              style={{ color: "#f82649", marginTop: "0.25rem" }}
                            >
                              <ErrorMessage
                                name="password_confirmation"
                                // component="div"
                                className="invalid-feedback"
                                style={{ flexDirection: "row", color: "red" }}
                              />
                            </div>
                          </div>
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

            <Col lg={12} xl={4} md={12} sm={12} style={{ margin: "20px 0" }}>
              <Card style={{ height: "100%" }}>
                <Card.Header>
                  <Card.Title as="h3">Update Profile</Card.Title>
                </Card.Header>
                <form onSubmit={formik.handleSubmit} style={{ height: "100%" }}>
                  <Card.Body>
                    <Row>
                      <Col lg={12} md={12}>
                        <div className="form-group mb-0">
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
                            className={`input101 ${formik.errors.first_name &&
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
                        <div className="form-group mb-0 ">
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
                            className={`input101 ${formik.errors.last_name &&
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
                      <Col lg={12} md={12}>
                        <div className="form-group mb-0">
                          <label className=" form-label mt-4" htmlFor="email">
                            Email Address
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly`}
                            id="email"
                            name="email"
                            placeholder="Last Name"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            readOnly={true}
                          />
                          {formik.errors.email && formik.touched.email && (
                            <div className="invalid-feedback">
                              {formik.errors.email}
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
            <Col lg={12} xl={4} md={12} sm={12} style={{ margin: "20px 0" }}>
              <Card style={{ height: "100%" }}>
                <Card.Header>
                  <Card.Title as="h3">Mobile App Authentication </Card.Title>
                </Card.Header>

                <Card.Body>
                  <p className="all-center-flex f2a" style={{ height: "100%" }}>
                    <img
                      src={require("../../../assets/images/brand/two_factor.png")}
                      className="header-brand-img desktop-logo"
                      alt={"logo"}
                    />
                  </p>
                </Card.Body>
                <Card.Footer className="text-end">
                  {storedKeyRef.current === "true" ? (
                    <button
                      className="btn btn-danger ml-4"
                      type="submit"
                      onClick={handleDelete}
                    >
                      Disable 2FA
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary me-2"
                      onClick={Active2FA}
                    >
                      Enable 2FA
                    </button>
                  )}
                </Card.Footer>
              </Card>
              <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered={true}
                style={{ paddingBottom: "0px" }}
                className="custom-modal-width custom-modal-height big-modal"
              >
                <Modal.Header
                  style={{
                    color: "#fff",
                    background: "#2D8BA8",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ paddingBottom: "0px" }}>
                    <Modal.Title style={{ margin: "0px" }}>
                      Two-factor Authentication (2FA)
                    </Modal.Title>
                  </div>
                  <div>
                    <span
                      className="modal-icon close-button"
                      onClick={handleCloseModal}
                      style={{ cursor: "pointer" }}
                    >
                      <AiOutlineClose />
                    </span>
                  </div>
                </Modal.Header>
                <Modal.Body
                  className="Disable2FA-modal "
                  style={{ paddingBottom: "0px" }}
                >
                  <div className="modal-contentDisable2FA">
                    <div className="card">
                      <div className="card-body" style={{ padding: "10px" }}>
                        <Row>
                          <Col lg={12} md={12}>
                            <p className="instruction-text">
                              Use the following methods to set up 2FA:
                            </p>
                            <ul className="method-list">
                              <li>
                                Use the Authenticator App (Google, Microsoft,
                                etc.) to scan the QR Code
                              </li>

                              <li>
                                Use the Authenticator extension in Chrome to
                                scan the QR Code
                              </li>
                            </ul>
                            <hr />
                          </Col>

                          <Col lg={6} md={12}>
                            <strong className="f2A-name ">Scan QR Code</strong>

                            <img
                              src={factordata?.qrCode}
                              alt={"factordata"}
                              className="qr-code-image mx-auto d-block"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </Col>
                          <Col lg={6} md={12}>
                            <strong className="f2A-name">
                              OR Enter Code into your App
                            </strong>

                            <p className="secret-key mt-3 ">
                              <span className="instruction-text">
                                Secret Key:
                              </span>{" "}
                              {factordata?.secret}
                            </p>
                            <hr />
                            <strong className=" instruction-text ">
                              Enter Authenticator App Code:
                            </strong>
                            <hr />
                            <form
                              onSubmit={authenticationCodeformik.handleSubmit}
                            >
                              <input
                                type="text"
                                className="input101 authentication-code-input"
                                id="authenticationCode"
                                name="authenticationCode"
                                placeholder="Authentication Code"
                                value={
                                  authenticationCodeformik.values
                                    .authenticationCode
                                }
                                onChange={authenticationCodeformik.handleChange}
                                onBlur={authenticationCodeformik.handleBlur}
                              />
                              {authenticationCodeformik.touched
                                .authenticationCode &&
                                authenticationCodeformik.errors
                                  .authenticationCode && (
                                  <div className="error-message">
                                    {
                                      authenticationCodeformik.errors
                                        .authenticationCode
                                    }
                                  </div>
                                )}

                              <div className="text-end mt-4">
                                <button
                                  type="button"
                                  className="btn btn-danger mx-4"
                                  onClick={handleCloseModal}
                                >
                                  Cancel
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
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </div>
      </>
    </>
  )
}

export default withApi(EditProfile)