import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoaderImg from "../../../Utils/Loader";

export default function ResetPassword() {
  const { token } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState({});
  const [isTokenValid, setIsTokenValid] = useState(false);

  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/verify-token/${token}`)
      .then((response) => {
        setIsTokenValid(true);
        setUserId(response?.data?.data?.id);
      })
      .catch((error) => {
        setTimeout(() => {
          window.location.href = `/login`;
          localStorage.clear()
        }, 1000);

        ErrorAlert(error?.message);
        setIsTokenValid(false);
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
        console.log(response.data, "response.data.message");
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
    password: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters long"),
    password_confirmation: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  return (

    <>
      <div className="login-img overflow-hidden">

        {isLoading ? <LoaderImg /> : null}

        <Row>
          {/* <Col lg={7} sm={0} className="c-login-left-card">
            <div className="page">

              <div className=" d-flex align-items-center justify-content-center">
                <img
                  src={require("../../../assets/images/login.png")}
                  alt="MyChartImage"
                  className="c-login-img"
                />
              </div>
            </div>
          </Col> */}


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
                              <div className="wrap-input100 validate-input">
                                <Field
                                  className={`input100 ${errors.password && touched.password
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  type="password"
                                  name="password"
                                  placeholder="New password"
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                  <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                                </span>
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="wrap-input100 validate-input">
                                <Field
                                  className={`input100 ${errors.password_confirmation &&
                                    touched.password_confirmation
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  type="password"
                                  name="password_confirmation"
                                  placeholder="Confirm password"
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                  <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                                </span>
                                <ErrorMessage
                                  name="password_confirmation"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
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



      {/* <div className="login-img">
        <div className="page">
          <div className="">
            <div className="col col-login mx-auto">
              <div className="text-center login-logo">
                <img
                  src={require("../../../assets/images/brand/logo.png")}
                  className="header-brand-img"
                  alt=""
                />
              </div>
            </div>
            <div className="container-login100">
              <div className="wrap-login100 p-0">
                <Card.Body>
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
                        <div className="wrap-input100 validate-input">
                          <Field
                            className={`input100 ${errors.password && touched.password
                              ? "is-invalid"
                              : ""
                              }`}
                            type="password"
                            name="password"
                            placeholder="New password"
                          />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                          </span>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="wrap-input100 validate-input">
                          <Field
                            className={`input100 ${errors.password_confirmation &&
                              touched.password_confirmation
                              ? "is-invalid"
                              : ""
                              }`}
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm password"
                          />
                          <span className="focus-input100"></span>
                          <span className="symbol-input100">
                            <i className="zmdi zmdi-lock" aria-hidden="true"></i>
                          </span>
                          <ErrorMessage
                            name="password_confirmation"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
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
                </Card.Body>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>

  );
}
