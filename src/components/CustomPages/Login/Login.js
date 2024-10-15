import { useEffect, useRef, useState } from 'react';
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
import { getLocalStorageData, setLocalStorageData } from "../../../Utils/cryptoUtils";
import CountdownTimer from "./CountdownTimer";



export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [showCaptcha, setshowCaptcha] = useState(false);
  const [showCaptchaBtn, setshowCaptchaBtn] = useState(false);
  const [showStillCaptcha, setshowStillCaptcha] = useState(false);
  const [showTime, setshowTime] = useState(false);
  const [captchatoken, setcaptchatoken] = useState("");
  const recaptchaRef = useRef(); // Create a ref for ReCAPTCHA
  const [backendTimer, setBackendTimer] = useState(localStorage.getItem("dynamicTime"));


  if (localStorage.getItem("myKey") === null) {
    if (!localStorage.getItem("refreshed")) {
      localStorage.setItem("refreshed", "true");
      window.location.reload();
    }
  }




  const handleKeyPress = (event) => {
    if (event.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission on Enter key
    }
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

  const handleSubmit = async (values, resetForm) => {
    setLoading(true);
    const finalValues = {
      ...values, // include form values
      ...(captchatoken && { captcha_token: captchatoken }), // add captcha_token if it exists
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalValues),
      });

      const data = await response.json();
      if (response.ok && data) {      // Handle success
        localStorage.setItem("token", data?.data?.access_token);
        localStorage.setItem("superiorId", data?.data?.superiorId);
        localStorage.setItem("superiorRole", data?.data?.superiorRole);
        localStorage.setItem("role", data?.data?.role);
        localStorage.setItem("auto_logout", data?.data?.auto_logout);
        localStorage.setItem("authToken", data?.data?.token);

        if (data?.data?.is_verified) {
          navigate(data?.data?.route);
        } else {
          navigate("/validateOtp");
        }
        localStorage.setItem("justLoggedIn", true);
        SuccessAlert(data?.message);
      } else {
        // Handle non-2xx responses
        if (data?.data?.show_captcha) {
          setLocalStorageData('capCheck', data?.data?.show_captcha);
          setshowCaptcha(data?.data?.show_captcha)
          setshowStillCaptcha(data?.data?.show_captcha)
          setshowStillCaptcha(true)
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
          resetForm()
        }
        if (data?.data?.show_timer) {
          setLocalStorageData("timer", data?.data?.show_timer);
          setshowTime(data?.data?.show_timer)
        }
        if (data?.data?.timer) {
          localStorage.setItem("dynamicTime", data?.data?.timer);
          setBackendTimer(data?.data?.timer);
        }
        ErrorAlert(data.message);
      }
      setLoading(false);
    } catch (error) {
      if (error.response) {
        // Handle specific status codes if available
        if (error.response.status === 401) {
          navigate("/login");
          ErrorAlert("Invalid access token");
          localStorage.clear();
        } else if (error.response.status === 403) {
          navigate("/errorpage403");
        } else {
          ErrorAlert(`Unexpected error: ${error.response.status}`);
        }
      } else if (error.message) {
        // Handle unexpected errors without response structure (like network issues)
        ErrorAlert(`Unexpected error: ${error.message}`);
      } else {
        ErrorAlert("An unknown error occurred.");
      }
      setLoading(false);
      navigate("/under-construction");
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };




  const onRecaptchaChange = async (token, resetForm) => {
    setcaptchatoken(token);
    setLoading(true);
    const formData = new FormData();
    formData.append('token', token);

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/validate-captcha`, {
        method: 'POST',
        body: formData, // No need to set Content-Type manually
      });

      const result = await response.json();




      if (result?.api_response == "success") {
        setshowCaptcha(false);
        localStorage.removeItem('capCheck');
        setshowCaptchaBtn(false)
      } else {
        ErrorAlert(result?.message); // Assuming ErrorAlert is defined elsewhere
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        // Reset form on error
        resetForm();
        setshowCaptchaBtn(true)
      }
    } catch (error) {
      console.error('Error validating reCAPTCHA token:', error);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      ErrorAlert('An error occurred. Please try again.'); // Provide a user-friendly message
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    const storedFlag = getLocalStorageData('capCheck');
    const test = getLocalStorageData('timer');
    if (test) {
      setshowTime(true)
    }


    if (storedFlag) {
      setshowCaptcha(true);
      setshowStillCaptcha(true);
    }



  }, [])


  const handleCountdownComplete = () => {
    setshowTime(false)
    localStorage.removeItem("timer");
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
                        onSubmit={(values, { resetForm }) => {
                          handleSubmit(values, resetForm);
                        }}
                      >
                        {({ errors, touched, resetForm }) => (
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

                            {(showCaptcha || showStillCaptcha) &&

                              <ReCAPTCHA
                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // Use your actual site key
                                // onChange={onRecaptchaChange} // Step 2: Capture token on change
                                onChange={(token) => onRecaptchaChange(token, resetForm)} // Pass resetForm to onRecaptchaChange
                                ref={recaptchaRef} // Assign the ref to ReCAPTCHA

                              />
                            }


                            <ErrorMessage name="recaptcha" component="div" className="invalid-feedback" />



                            <>

                              {(!showTime && !showCaptcha) && (
                                <>
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
                                </>
                              )}


                            </>



                            <div className="container-login100-form-btn">
                              <button
                                type="submit"
                                className="w-100 btn btn-primary d-flex justify-content-center  "
                                disabled={showTime || showCaptcha || showCaptchaBtn}
                              >
                                <span className="ml-2">Login</span>  {" "}

                                {showTime && (
                                  <CountdownTimer initialTime={backendTimer || 300} onCountdownComplete={handleCountdownComplete} />
                                )}


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
