import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import './MobileLogin.css'; // Import the CSS file
import { SuccessAlert } from '../../Utils/ToastUtils';
import { useNavigate } from 'react-router-dom';
import useErrorHandler from '../CommonComponent/useErrorHandler';
import LoaderImg from '../../Utils/Loader';

// Validation schema
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
const forgotSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
});
const MobileLogin = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [isLoading, setLoading] = useState(false);
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const { handleError } = useErrorHandler();

    // const handleSubmit = async (values, resetForm) => {
    //     setLoading(true);
    //     const finalValues = {
    //         ...values, // include form values
    //     };

    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(finalValues),
    //         });

    //         const data = await response.json();
    //         if (response.ok && data) {

    //             localStorage.setItem("token", data?.data?.access_token);
    //             localStorage.setItem("superiorId", data?.data?.superiorId);
    //             localStorage.setItem("superiorRole", data?.data?.superiorRole);
    //             localStorage.setItem("role", data?.data?.role);
    //             localStorage.setItem("auto_logout", data?.data?.auto_logout);
    //             localStorage.setItem("authToken", data?.data?.token);
    //             localStorage.setItem("justLoggedIn", true);
    //             if (data?.data?.is_verified) {
    //                 navigate(data?.data?.route);
    //             } else {
    //                 navigate("/validateOtp");
    //             }
    //             SuccessAlert(data?.message);
    //         } else {
    //             // Handle non-2xx responses
    //             handleError(error);
    //         }
    //         setLoading(false);
    //     } catch (error) {
    //         handleError(error);
    //         setLoading(false);
    //         navigate("/under-construction");
    //     } finally {
    //         setLoading(false);
    //     }
    //     setLoading(false);
    // };


    const handleSubmit = async (values, resetForm) => {
        setLoading(true);
        const finalValues = {
            ...values, // include form values
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

            if (response.ok) {
                localStorage.setItem("token", data?.data?.access_token);
                localStorage.setItem("superiorId", data?.data?.superiorId);
                localStorage.setItem("superiorRole", data?.data?.superiorRole);
                localStorage.setItem("role", data?.data?.role);
                localStorage.setItem("auto_logout", data?.data?.auto_logout);
                localStorage.setItem("authToken", data?.data?.token);
                localStorage.setItem("justLoggedIn", true);

                if (data?.data?.is_verified) {
                    navigate(data?.data?.route);
                } else {
                    navigate("/validateOtp");
                }
                SuccessAlert(data?.message);
            } else {
                // Extract meaningful error message
                const errorMessage = data?.message || "Something went wrong. Please try again.";
                handleError(new Error(errorMessage));
            }
        } catch (error) {
            handleError(error);
            navigate("/under-construction");
        } finally {
            setLoading(false);
        }
    };

    const handleformgotSubmit = async (values) => {
        setLoading(true);
        try {
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
                handleError(data.message);
                setLoading(false);
            }
            setLoading(false);
        } catch (error) {
            handleError(error);
            setLoading(false);
            navigate("/under-construction");
        } finally {
            setLoading(false);
        }


        setLoading(false);
    };
    return (

        <>
            {isLoading ? <LoaderImg /> : null}
            <>
                < div className="mob-container" >
                    <motion.div
                        className="mob-card"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Login Form */}
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={LoginSchema}
                            onSubmit={(values, { resetForm }) => {
                                handleSubmit(values, resetForm);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form className="mob-form-container mob-login-form">
                                    <h2>Login</h2>
                                    <div className="wrap-input100 validate-input">
                                        <Field
                                            className={`mob-input ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                        />
                                        <span className="focus-input100"></span>

                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="wrap-input100 validate-input">
                                        <div className="mob-input-container">
                                            <Field
                                                className={`mob-input ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="Password"
                                            />
                                            <div className="mob-password-toggle-icon" onClick={togglePasswordVisibility}>
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </div>
                                        </div>
                                        <span className="focus-input100"></span>

                                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="text-end pt-1" onClick={handleFlip}>
                                        <p className="mb-0">
                                            <a href="#" className="text-primary ms-1">
                                                Forgot Password?
                                            </a>
                                        </p>
                                    </div>

                                    <div className="container-login100-form-btn">
                                        <button type="submit" className="w-100 btn btn-primary">
                                            Login
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                        {/* Signup Form */}
                        <div className="mob-form-container mob-signup-form">

                            <Formik
                                initialValues={{ email: '' }}
                                validationSchema={forgotSchema}
                                onSubmit={(values, { resetForm }) => {
                                    handleformgotSubmit(values, resetForm);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form className="mob-form-container login-form">
                                        <h2>Forgot Password</h2>
                                        <div className="wrap-input100 validate-input">
                                            <Field
                                                className={`mob-input ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                            />
                                            <span className="focus-input100"></span>

                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>



                                        <div className="text-end pt-1" onClick={handleFlip}>
                                            <p className="mb-0">
                                                <a href="#" className="text-primary ms-1">
                                                    Back To Login ?
                                                </a>
                                            </p>
                                        </div>

                                        <div className="container-login100-form-btn">
                                            <button type="submit" className="w-100 btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>

                        </div>
                    </motion.div>

                    {/* Toggle button for switching between login and signup */}

                </ div >
            </>
        </>
    );
};

export default MobileLogin;
