import { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";

export default function ForgotPassword() {
  const [isLoading, setLoading] = useState(false);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/forgot/password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();

    if (response.ok && data) {
      localStorage.setItem("token", data.data.access_token);
      SuccessAlert(data.message);
      // window.location.href = `/dashboard`;
    } else {
      console.error(data.message);
      ErrorAlert(data.message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="login-img overflow-hidden">
        <Row>
          <Col lg={12} md={12} sm={12} className="c-login-left-card">
            <div className="page" >
              <div className="container-login100 d-flex justify-content-center">
                <div className="wrap-login100 p-0">
                  <Card.Body>
                    <Formik
                      initialValues={{
                        email: "",
                      }}
                      validationSchema={ForgotPasswordSchema}
                      onSubmit={(values) => {
                        handleSubmit(values);
                      }}
                    >
                      {() => (
                        <Form className=" shadow-none p-0 m-0" method="post">
                          <Card.Body className="mx-auto p-0">
                            <div
                              display={"flex"}
                              flexDirection={"column"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              width={"271px"}
                              className="forgot-body"
                            >
                              <div className="text-center ">
                                <span
                                  className="login100-form-title"
                                  style={{ paddingBottom: "12px" }}
                                >
                                  <img
                                    src={require("../../../assets/images/brand/logo.png")}
                                    className="header-brand-img"
                                    alt=""
                                  />
                                </span>
                                {/* <p className=" m-0 p-0 font-weight-bold">
                                  Forgot Password
                                </p> */}
                                {/* <p className="text-muted">
                                    Enter the email address registered on your account
                                  </p> */}
                              </div>
                              <div className="pt-3 w-100" id="forgot">
                                <div className="form-group">
                                  <label
                                    className="form-label"
                                    htmlFor="email"
                                  >
                                    E-Mail
                                  </label>
                                  <Field
                                    className="input100"
                                    name="email"
                                    placeholder="Enter Your Email"
                                    type="email"
                                  />
                                  <span className="focus-input100"></span>

                                  <span className="symbol-input100">
                                    <i
                                      className="zmdi zmdi-email"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <ErrorMessage
                                    className="text-danger"
                                    name="email"
                                    component="div"
                                  />
                                </div>
                                <div className="container-login100-form-btn">
                                  <button
                                    type="submit"
                                    className=" w-100 btn  btn-primary"
                                  >
                                    Submit
                                  </button>
                                  {/* <ToastContainer /> */}
                                </div>
                                <div className="text-center mt-4">
                                  <p className="text-dark text-end mb-0">
                                    Forgot It?
                                    <Link
                                      to={`/`}
                                      className="text-primary ms-1"
                                    >
                                      Back to Login
                                    </Link>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card.Body>

                        </Form>
                      )}
                    </Formik>
                  </Card.Body>
                  <Card.Footer
                    className=" text-end p-2 color-white btn-primary"

                  >
                    <span className=" " style={{ paddingRight: "20px" }}>
                      SECURE WITH{" "}
                      <strong className="  font-weight-bold">2FA</strong>{" "}
                      <i className="fa fa-shield" aria-hidden="true"></i>
                      <i className="fa fa-brands-google"></i>
                      <i className="fa fa-brands-microsoft"></i>
                    </span>
                  </Card.Footer>
                </div>
              </div>
            </div>

          </Col >
        </Row >
      </div >
    </>
  );
}
