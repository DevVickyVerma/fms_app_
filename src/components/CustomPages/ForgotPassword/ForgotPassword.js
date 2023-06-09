import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card,  } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Slide, ToastContainer, toast } from "react-toastify";
import Loaderimg from "../../../Utils/Loader";





export default function ForgotPassword() {


  const [isLoading, setLoading] = useState(false);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
 
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

  const handleSubmit = async (values) => {
    
    setLoading(true);
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/forgot/password`, {
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
       setLoading(false);
    }
    setLoading(false);
  };



  return (
    
    <div className="login-img">

      {isLoading ? <Loaderimg /> : null}
     
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
                                to={`/`}
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
