import { useFormik } from 'formik';
import { useState } from 'react';
import { Card, Col, Modal, Row } from 'react-bootstrap';
import * as Yup from "yup";
import Loaderimg from '../../../Utils/Loader';
import { Slide, toast } from 'react-toastify';
import PropTypes from "prop-types";
import withApi from '../../../Utils/ApiHelper';

const UploadSageSales = (props) => {

    const { showUploadSageSalesModal, setShowUploadSageSalesModal, companyId, title, shortUrl } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState("")
    const token = localStorage.getItem("token");
    const handleCloseModal = () => {
        formik.setFieldValue("image", "")
        setShowUploadSageSalesModal(false);
        setShowErrorMessage("")
    };
    const SuccessToast = (message) => {
        toast.success(message, {
            autoClose: 1000,
            // position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
        });
    };
    const ErrorToast = (message) => {
        toast.error(message, {
            // position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            autoClose: 1000,
            theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
        });
    };

    const formik = useFormik({
        initialValues: {
            company_id: companyId || "",
            image: null,
        },
        validationSchema: Yup.object({
            image: Yup.string().required("File Is Required"),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });


    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append("company_id", companyId);
            if (shortUrl === "upload-sale") {

                formData.append("sales", formik.values.image);
            } else if (shortUrl === "upload-bank-ref") {
                formData.append("references", formik.values.image);
            }
            else if (shortUrl === "upload-bank-reimbursement") {
                formData.append("file", formik.values.image);
            }
            setIsLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/company/${shortUrl}`,
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
            console.error("Request Error:", error);

            // Handle request error
        } finally {
            setIsLoading(false);
        }
    };
    const handleDrop = (event) => {
        event.preventDefault();
    };


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
                centered={true}
                className="custom-modal-width custom-modal-height big-modal"
            >

                <div className="modal-header">
                    <span className="ModalTitle d-flex justify-content-between w-100 p-0 fw-normal"  >
                        <span>
                            {title}
                        </span>
                        <span onClick={handleCloseModal} >
                            <button className="close-button">
                                <i className="ph ph-x" />
                            </button>
                        </span>
                    </span>
                </div>

                <Modal.Body className="Disable2FA-modal">
                    <form onSubmit={formik.handleSubmit}>
                        <Card.Body>
                            <Row>
                                <Col lg={12} md={12}>
                                    <div className="form-group">
                                        <label htmlFor="image" className="form-label mt-4">
                                            File <span className="text-danger">*</span>
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
    onClose: PropTypes.func.isRequired,
};

export default withApi(UploadSageSales);