import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card,  } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";


const Loaderimg = () => {
  return (
    <div id="global-loader">
      <img
        src={require("../../../assets/images/loader.svg").default}
        className="loader-img"
        alt="Loader"
      />
    </div>
  );
};


export default function ForgotPassword() {


  const [loading, setLoading] = useState(false);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);

  const handleSubmit = async (values) => {

    setLoading(true);
    const response = await fetch("http://192.168.1.165:8000/v1/forgot/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
 

    if (response.ok && data) {
      localStorage.setItem("token", data.data.access_token);
      notify(data.message);
      // window.location.href = `/dashboard`;
     
    
    } else {
      console.error(data.message);
      Errornotify(data.message);
    }
    setLoading(false);
  };



  return (
    <div className="login-img">
     {loading && <Loaderimg />}
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
            <Row>
              <Col className=" col-login mx-auto">
                <Formik
                  initialValues={{
                    email: "",
                  }}
                  validationSchema={ForgotPasswordSchema}
                  onSubmit={(values) => {
                    handleSubmit(values);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="card shadow-none" method="post">
                      <Card.Body>
                        <div className="text-center">
                          <span className="login100-form-title">
                            Forgot Password
                          </span>
                          <p className="text-muted">
                            Enter the email address registered on your account
                          </p>
                        </div>
                        <div className="pt-3" id="forgot">
                          <div className="form-group">
                            <label className="form-label" htmlFor="email">
                              E-Mail
                            </label>
                            <Field
                              className="form-control"
                              name="email"
                              placeholder="Enter Your Email"
                              type="email"
                            />
                            <ErrorMessage
                              className="text-danger"
                              name="email"
                              component="div"
                            />
                          </div>
                        <div className="container-login100-form-btn">
                        <button
                          type="submit"
                          className="login100-form-btn btn-primary"
                        >
                          Submit
                        </button>
                         <ToastContainer />
                      </div>
                          <div className="text-center mt-4">
                            <p className="text-dark mb-0">
                              Forgot It?
                              <Link
                                to={`/login`}
                                className="text-primary ms-1"
                              >
                                Back to Login
                              </Link>
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
