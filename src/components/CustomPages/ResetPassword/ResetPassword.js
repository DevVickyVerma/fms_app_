import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import axios from "axios";



export default function ResetPassword() {
    const { token } = useParams();
    const [userId, setUserId] = useState({});
    const [isTokenValid, setIsTokenValid] = useState(false);

    const SuccessAlert = (message) => toast.success(message);
    const ErrorAlert = (message) => toast.error(message);

    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/verify-token/${token}`)
          .then(response => {
            setIsTokenValid(true)
            setUserId(response.data.data.id)
            console.log(response.data.data.id,"response")
          })
          .catch(error => {
            setTimeout(() => {
                window.location.href = `/login`;
            }, 1000);
           
            console.log(error)
            ErrorAlert("Invalid forgot password token")
            setIsTokenValid(false)
          });
      }, [token]);


      
      const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('password', values.password);
        formData.append('password_confirmation', values.password_confirmation);
        formData.append('id', userId);
        formData.append('token', token);
      
        try {
          const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/reset/password`, formData);
          console.log(response.data, 'done');
          SuccessAlert(response.data.message)
          window.location.href = `/login`;
        } catch (error) {
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

 


//     console.log(values, "Object");
  
//     try {
//       const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       });
  
//       const data = await response.json();
  
//       if (response.ok && data) {
//         localStorage.setItem("token", data.data.access_token);
  
//         notify(data.message);
//         window.location.href = `/dashboard`;
//       } else {
//         Errornotify(data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       Errornotify("Network error: Please check your internet connection and try again.");
//     }
//   };
  
// const handleSubmit = (values)=>{
//     console.log(userId,"token")
//     console.log(values,"values")
// }

  return (
    <div className="login-img">
      {/* {loading && <Loaderimg />} */}
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
                      <span className="login100-form-title"> Reset Password</span>
                      <div className="wrap-input100 validate-input">
                        <Field
                          className={`input100 ${
                            errors.password && touched.password
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
                          className={`input100 ${
                            errors.password_confirmation && touched.password_confirmation
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
                          <Link
                            to={`/login`}
                            className="text-primary ms-1"
                          >
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
    </div>
  );
}
