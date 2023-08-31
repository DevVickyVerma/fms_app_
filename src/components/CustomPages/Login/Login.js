import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Slide, ToastContainer, toast } from "react-toastify";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import { useNavigate } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";

export default function Login(props) {
  const [isNavigated, setIsNavigated] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    console.clear();
    console.clear();
  }, []);
  if (localStorage.getItem("myKey") === null) {
    if (!localStorage.getItem("refreshed")) {
      localStorage.setItem("refreshed", "true");
      window.location.reload();
    }
  }

  const navigate = useNavigate();

  if (props.token) {
    return <Navigate to="/dashboard" />;
  }

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
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
        localStorage.setItem("token", data.data.access_token);
        localStorage.setItem("superiorId", data.data.superiorId);
        localStorage.setItem("superiorRole", data.data.superiorRole);
        localStorage.setItem("role", data.data.role);

        navigate(data?.data?.route);
        localStorage.setItem("justLoggedIn", true);
        notify(data.message);
        setLoading(false);
      } else {
        Errornotify(data.message);
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        Errornotify("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else {
        console.error(error);
        Errornotify(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="login-img">
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
                      initialValues={{ email: "", password: "" }}
                      validationSchema={LoginSchema}
                      onSubmit={(values) => {
                        handleSubmit(values);
                      }}
                    >
                      {({ errors, touched }) => (
                        <Form className="login100-form validate-form">
                          <span className="login100-form-title">Login</span>
                          <div className="wrap-input100 validate-input">
                            <Field
                              className={`input100 ${
                                errors.email && touched.email
                                  ? "is-invalid"
                                  : ""
                              }`}
                              type="text"
                              name="email"
                              placeholder="Email"
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                              <i
                                className="zmdi zmdi-email"
                                aria-hidden="true"
                              ></i>
                            </span>
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                          <div className="wrap-input100 validate-input">
                            <Field
                              className={`input100 ${
                                errors.password && touched.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                              type="password"
                              name="password"
                              placeholder="Password"
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                              <i
                                className="zmdi zmdi-lock"
                                aria-hidden="true"
                              ></i>
                            </span>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
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
                              className="login100-form-btn btn-primary"
                            >
                              Login
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
        </div>
      </>
    </>
  );
}
