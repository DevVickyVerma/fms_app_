import React from "react";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { BsCapslock } from "react-icons/bs";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import ReCAPTCHA from "react-google-recaptcha";
export default function Login(props) {
  const [isLoading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [Showcaptcha, setShowcaptcha] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(""); // Step 1: Add state for ReCAPTCHA token



  if (localStorage.getItem("myKey") === null) {
    if (!localStorage.getItem("refreshed")) {
      localStorage.setItem("refreshed", "true");
      window.location.reload();
    }
  }

  const handleKeyPress = (event) => {
    // if (event.getModifierState("CapsLock")) {
    //   setCapsLockActive(true);
    // } else {
    //   setCapsLockActive(false);
    // }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    // recaptcha: Yup.string().required("Please complete the CAPTCHA"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);


    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok && data) {
        localStorage.setItem("token", data?.data?.access_token);
        localStorage.setItem("superiorId", data?.data?.superiorId);
        localStorage.setItem("superiorRole", data?.data?.superiorRole);
        localStorage.setItem("role", data?.data?.role);
        localStorage.setItem("auto_logout", data?.data?.auto_logout);
        localStorage.setItem("authToken", data?.data?.token);


        if (data?.data?.is_verified === true) {
          navigate(data?.data?.route);
        } else {
          if (data?.data?.is_verified === false) {
            // setAuthToken(data?.data?.token)
            navigate("/validateOtp");
          }
        }
        localStorage.setItem("justLoggedIn", true);
        SuccessAlert(data?.message);
        setLoading(false);
      } else {
        setShowcaptcha(data?.data?.show_captcha)
        ErrorAlert(data.message);
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else {

        navigate("/under-construction");
        ErrorAlert(error.message);
      }
    }

    setLoading(false);
  };
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const onRecaptchaChange = async (token) => {



    setLoading(true);


    const formData = new FormData();
    formData.append("token", token);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/validate-captcha`, {
        method: "POST",
        body: formData, // No need to set Content-Type manually
      });

      const result = await response.json();
   
      if (result.status_code == 200) {
        setIsTokenVerified(true)
        SuccessAlert(result?.message)
      
      } else {
        ErrorAlert(result?.message)
      }


    } catch (error) {

      console.error('Error validating reCAPTCHA token:', error);
      return false;
    } finally {
      setLoading(false);
    }





  };


  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="login-img overflow-hidden" >

          <Row>


            <Col lg={12} md={12} sm={12} className="c-login-left-card">
              <div className="page" >
                <div className="container-login100 d-flex justify-content-center">
                  <div className="wrap-login100 p-0">
                    <Card.Body>
                      <Formik
                        initialValues={{ email: "", password: "", }}
                        validationSchema={LoginSchema}
                        onSubmit={(values) => {
                          handleSubmit(values);
                        }}
                      >
                        {({ errors, touched }) => (
                          <Form className="login100-form validate-form">
                            <span className="login100-form-title">
                              <img
                                src={require("../../../assets/images/brand/logo.png")}
                                className="header-brand-img"
                                alt=""
                              />
                            </span>

                            <div>
                              <div
                                className="wrap-input100 validate-input"
                                style={{ display: "flex" }}
                              >
                                <Field
                                  className={`input100 ${errors.email && touched.email
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  // type="password"
                                  type="text"
                                  name="email"
                                  placeholder="Email"
                                  onKeyPress={handleKeyPress}
                                />
                                <span className="focus-input100"></span>

                                <span className="symbol-input100">
                                  <i
                                    className="zmdi zmdi-email"
                                    aria-hidden="true"
                                  ></i>
                                </span>

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
                                    ></span>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>

                              <div
                                style={{ color: "#f82649", marginTop: "0.25rem" }}
                              >
                                <ErrorMessage
                                  name="email"
                                  // component="div"
                                  className="invalid-feedback"
                                  style={{ flexDirection: "row", color: "red" }}
                                />
                              </div>
                            </div>
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
                                  onKeyPress={handleKeyPress}
                                />
                                <span className="focus-input100"></span>

                                <span className="symbol-input100">
                                  <i
                                    className="zmdi zmdi-lock"
                                    aria-hidden="true"
                                  ></i>
                                </span>

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

                            {Showcaptcha && <ReCAPTCHA
                              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // Use your actual site key
                              onChange={onRecaptchaChange} // Step 2: Capture token on change
                            />}


                            <ErrorMessage name="recaptcha" component="div" className="invalid-feedback" />

                            <div className="text-end pt-1">
                              <p className="mb-0">
                                <Link
                                  to={`/custompages/forgotPassword/`}
                                  className="text-primary ms-1"
                                >
                                  Forgot Password?
                                </Link>
                              </p>
                            </div>
                            <div className="container-login100-form-btn">
                              <button
                                type="submit"
                                className="w-100 btn btn-primary "
                                disabled={Showcaptcha ? !isTokenVerified : false}
                              >
                                Login
                              </button>
                              <ToastContainer />
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </Card.Body>
                    <Card.Footer
                      className=" text-end p-2 color-white"
                      style={{
                        background:
                          "linear-gradient(90deg, #000000 0%, #353535 91.71%)",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      <span className=" " style={{ paddingRight: "20px" }}>
                        SECURE WITH{" "}
                        <strong className="  font-weight-bold">2FA</strong>{" "}
                        <i className="fa fa-shield" aria-hidden="true"></i>
                      </span>
                    </Card.Footer>
                  </div>
                </div>
              </div>
            </Col>

          </Row>

        </div>
      </>
    </>
  );
}
