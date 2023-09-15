import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Slide, ToastContainer, toast } from "react-toastify";
import Loaderimg from "../../../Utils/Loader";
import { Box } from "@material-ui/core";


export default function ValidateOtp() {


    const authToken = localStorage.getItem("authToken");
    console.log(authToken, "authToken");

    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    const ForgotPasswordSchema = Yup.object().shape({
        two_factor_code: Yup.string().required("authentication code is required"),
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

    // console.log(Token, "my token");

    const handleSubmit = async (values) => {
        console.log("valueonsubmit", values);
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/verify/two-factor`, {
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
            localStorage.setItem("authToken", data.data.token);

            // localStorage.setItem("token", data.data.access_token);
            navigate(data?.data?.route);
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
                                        // number: "",
                                        two_factor_code: "",
                                        token: authToken,
                                    }}
                                    validationSchema={ForgotPasswordSchema}
                                    onSubmit={(values) => {
                                        console.log("before callling ", values);
                                        handleSubmit(values);
                                    }}
                                >
                                    {({ errors, touched }) => (
                                        <Form className="card shadow-none " method="post">
                                            <Card.Body className="mx-auto">
                                                <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} width={"271px"} className="forgot-body">
                                                    <div className="text-center ">
                                                        <span className="login100-form-title">
                                                            Two Factor Authentication
                                                        </span>
                                                        <p className="text-muted">
                                                            Open the Two Step verification app on your mobile device to get your verification code
                                                        </p>
                                                    </div>
                                                    <div className="pt-3 w-100" id="forgot">
                                                        <div className="form-group">
                                                            <label className="form-label" htmlFor="two_factor_code">
                                                                Authentication Code
                                                            </label>
                                                            <Field
                                                                className="form-control"
                                                                name="two_factor_code"
                                                                placeholder="Authentication Code"
                                                                type="text"
                                                            />
                                                            <ErrorMessage
                                                                className="text-danger"
                                                                name="two_factor_code"
                                                                component="div"
                                                            />
                                                        </div>
                                                        <div className="container-login100-form-btn">
                                                            <button
                                                                type="submit"
                                                                className="login100-form-btn btn-primary"
                                                            >
                                                                Verify Code
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
                                                </Box>
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
