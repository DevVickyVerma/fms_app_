import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Col, FormGroup, OverlayTrigger, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoaderImg from "../../../Utils/Loader";
import { confirmPasswordTooltip, passwordTooltip } from "../../../Utils/commonFunctions/commonFunction";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function ResetPassword() {
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState({});

  const [capsLockActive] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(true);
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/verify-token/${token}`)
      .then((response) => {

        setUserId(response?.data?.data?.id);
      })
      .catch((error) => {
        setTimeout(() => {
          window.location.href = `/login`;
          localStorage.clear()
        }, 1000);

        ErrorAlert(error?.message);

      });
  }, [token]);

  const handleSubmit = async (values) => {

    setIsLoading(true)
    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);
    formData.append("id", userId);
    formData.append("token", token);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/reset/password`,
        formData
      );


      if (response.data.status_code === "200") {
        setIsLoading(false)
        SuccessAlert(response.data.message);
        window.location.href = `/login`;
      }


    } catch (error) {

      setIsLoading(false)
      console.error(error);
    }
  };

  const ResetPasswordSchema = Yup.object().shape({
    // password: Yup.string()
    //   .required("New password is required")
    //   .min(8, "Password must be at least 8 characters long"),
    password: Yup.string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one numeric digit")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    password_confirmation: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };



  return (

    <>
      <div className="login-img overflow-hidden">

        {isLoading ? <LoaderImg /> : null}

        <Row>


          <Col lg={12} sm={12} className="c-login-left-card">
            <div className="page">
              <div className="container-login100 d-flex justify-content-center">

                <div className="wrap-login100 p-0">
                  <div className="col col-login mx-auto">
                    <div className="text-center login-logo">

                    </div>
                  </div>
                  <div className="container-login100">
                    <Row>
                      <Col className=" col-login mx-auto">
                        <Formik
                          initialValues={{ password: "", password_confirmation: "" }}
                          validationSchema={ResetPasswordSchema}
                          onSubmit={(values) => {
                            handleSubmit(values);
                          }}
                        >
                          {({ errors, touched }) => (
                            <Form className="login100-form validate-form">
                              <span className="login100-form-title">
                                {" "}
                                Reset Password
                              </span>


                              <FormGroup>
                                <label
                                  htmlFor="password "
                                  className=" form-label mt-4"
                                >
                                  New Password
                                  <OverlayTrigger placement="right" overlay={passwordTooltip}>
                                    <i className="ph ph-info pointer"></i>
                                  </OverlayTrigger>
                                  <span className="text-danger">*</span>
                                </label>

                                <div>
                                  <div
                                    className="wrap-input100 validate-input"
                                    style={{ display: "flex" }}
                                  >
                                    <Field
                                      className={`input100 ${errors.password && touched.password
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      // type="password"
                                      type={passwordVisible ? "password" : "text"}
                                      name="password"
                                      placeholder="Password"
                                    // onKeyPress={handleKeyPress}
                                    />
                                    <span className="focus-input100"></span>

                                    <span className="symbol-input100">
                                      <i
                                        className="zmdi zmdi-lock"
                                        aria-hidden="true"
                                      ></i>
                                    </span>

                                    {!capsLockActive ? (
                                      <>
                                        <span
                                          onClick={togglePasswordVisibility}
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
                                          {passwordVisible ? (
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
                                    style={{ color: "#f82649", marginTop: "-0.25rem" }}
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
                                <label
                                  htmlFor="password_confirmation "
                                  className=" form-label mt-4"
                                >
                                  Confirm Password
                                  <OverlayTrigger placement="right" overlay={confirmPasswordTooltip}>
                                    <i className="ph ph-info pointer"></i>
                                  </OverlayTrigger>
                                  <span className="text-danger">*</span>
                                </label>

                                <div>
                                  <div
                                    className="wrap-input100 validate-input"
                                    style={{ display: "flex" }}
                                  >
                                    <Field
                                      className={`input100 ${errors.password_confirmation && touched.password_confirmation
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      // type="password"
                                      type={passwordConfirmVisible ? "password" : "text"}
                                      name="password_confirmation"
                                      placeholder=" Confirm Password"
                                    // onKeyPress={handleKeyPress}
                                    />
                                    <span className="focus-input100"></span>

                                    <span className="symbol-input100">
                                      <i
                                        className="zmdi zmdi-lock"
                                        aria-hidden="true"
                                      ></i>
                                    </span>

                                    {!capsLockActive ? (
                                      <>
                                        <span
                                          onClick={togglePasswordConfirmVisibility}
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
                                          {passwordConfirmVisible ? (
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
                                    style={{ color: "#f82649", marginTop: "-0.25rem" }}
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






                              <div className="text-end pt-1">
                                <p className="mb-0">
                                  <Link to={`/login`} className="text-primary ms-1">
                                    Back to Login
                                  </Link>
                                </p>
                              </div>
                              <div className="container-login100-form-btn">
                                <button
                                  type="submit"
                                  className="login100-form-btn btn-primary"
                                >
                                  Reset Password
                                </button>
                                <ToastContainer />
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </Col>
                    </Row>
                  </div>
                </div>

              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>

  );
}
