import { useFormik } from 'formik';
import React, { useState } from 'react'
import { Card, Col, Modal, Row } from 'react-bootstrap';
import { AiOutlineClose } from "react-icons/ai";
import * as Yup from "yup";
import Loaderimg from '../../../Utils/Loader';
import { Slide, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import withApi from '../../../Utils/ApiHelper';

const UploadSageSales = (props) => {

    const { showUploadSageSalesModal, setShowUploadSageSalesModal, companyId, postData, apidata } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState("")
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const handleCloseModal = () => {
        formik.setFieldValue("image", "")
        setShowUploadSageSalesModal(false);
        setShowErrorMessage("")
    };
    const SuccessToast = (message) => {
        toast.success(message, {
            autoClose: 1000,
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            autoClose: 1000,
            theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
        });
    };
    const ErrorToast = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            autoClose: 1000,
            theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
        });
    };
    function handleError(error) {
        if (error.response && error.response.status === 401) {
            navigate("/login");
            SuccessToast("Invalid access token");
            localStorage.clear();
        } else if (error.response && error.response.data.status_code === "403") {
            navigate("/errorpage403");
        } else {
            const errorMessage = Array?.isArray(error?.response?.data?.message)
                ? error?.response?.data?.message?.join(" ")
                : error?.response?.data?.message;
            ErrorToast(errorMessage);
        }
    }

    const formik = useFormik({
        initialValues: {
            company_id: companyId || "",
            image: null,
        },
        validationSchema: Yup.object({
            image: Yup.string().required("Sage File Is Required"),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });



    const isShowButtonDisabled =
        // formik.values.company_id &&
        formik.values.image !== null &&
        formik.values.image;

    const Onupload = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            formData.append("company_id", companyId);
            formData.append("sales", formik.values.image);
            const postDataUrl = "/company/upload-sale";

            const postResponse = await postData(postDataUrl, formData);

            if (postResponse?.status_code === "200") {
                setShowUploadSageSalesModal(false)
            }
            formik.setFieldValue("image", "")
            setIsLoading(false);
            // setShowUploadSageSalesModal(false)
        } catch (error) {
            setIsLoading(false);
            formik.setFieldValue("image", "")
            handleError(error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append("company_id", companyId);
            formData.append("sales", formik.values.image);
            setIsLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/company/upload-sale`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const responseData = await response.json(); // Read the response once

            if (response.ok) {
                handleCloseModal()
                SuccessToast(responseData.message);
            } else {
                ErrorToast(responseData.message);
                setShowErrorMessage(responseData.message)
            }
        } catch (error) {
            console.log("Request Error:", error);
            // Handle request error
        } finally {
            setIsLoading(false);
        }
    };
    const handleDrop = (event) => {
        event.preventDefault();
    };
    const isButtonDisabled = formik.values.client_id && formik.values.company_id;


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setShowErrorMessage("")
        if (file) {
            formik.setFieldValue("image", file);
            formik.setFieldTouched("image", true);
        } else {
            formik.setFieldValue("image", "");
            formik.setFieldTouched("image", false);
        }
    };
    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <Modal
                show={showUploadSageSalesModal}
                onHide={handleCloseModal}
                centered
                className="custom-modal-width custom-modal-height"
            // style={{ overflow: "auto" }}
            >
                <div
                    class="modal-header"
                    style={{ color: "#fff", background: "#6259ca" }}
                >
                    <h5 class="modal-title"> Upload Sage Sales</h5>
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span onClick={handleCloseModal} style={{ cursor: "pointer" }}>
                            <AiOutlineClose color="#fff" />
                        </span>
                    </button>
                </div>

                <Modal.Body className="Disable2FA-modal">
                    <form onSubmit={formik.handleSubmit}>
                        <Card.Body>
                            <Row>
                                <Col lg={12} md={12}>
                                    <div className="form-group">
                                        <label htmlFor="image" className="form-label mt-4">
                                            File *
                                        </label>
                                        <div
                                            className={`dropzone ${formik.errors.image && formik.touched.image
                                                ? "is-invalid"
                                                : ""
                                                }`}
                                            onDrop={(event) => handleDrop(event)}
                                            onDragOver={(event) => event.preventDefault()}
                                        >
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                accept=".xlsx, .xls"
                                                onChange={(event) => handleImageChange(event)}
                                                className="form-control"
                                            />
                                        </div>
                                        {formik.errors.image && formik.touched.image && (
                                            <div className="invalid-feedback">
                                                {formik.errors.image}
                                            </div>
                                        )}
                                        <div className=' text-red my-1'>
                                            {showErrorMessage}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                            <div className="text-end">
                                <button
                                    type="submit" // Change the type to "button" to prevent form submission
                                    className="btn btn-primary me-2"
                                // disabled={!isShowButtonDisabled}
                                // onClick={() => {
                                //     // Onupload();
                                //     handleSubmit();
                                // }}
                                // onClick={() => {
                                //     handleSubmit();
                                // }}
                                >
                                    Submit
                                </button>
                            </div>
                        </Card.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}


UploadSageSales.propTypes = {
    // title: PropTypes.string.isRequired,
    // visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    // onSubmit: PropTypes.func.isRequired,
    // searchListstatus: PropTypes.bool.isRequired,
};

export default withApi(UploadSageSales);