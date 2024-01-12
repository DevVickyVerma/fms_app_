import React from 'react'
import withApi from '../../../Utils/ApiHelper'
import Loaderimg from '../../../Utils/Loader';
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ErrorAlert } from '../../../Utils/ToastUtils';

const AddOpeningBalance = ({ isLoading, postData }) => {

    const navigate = useNavigate();
    // const ErrorAlert = (message) => toast.error(message);
    const { id, siteName } = useParams()


    function handleError(error) {
        if (error.response && error.response.opening_balance_type === 401) {
            navigate("/login");
            ErrorAlert("Invalid access token");
            localStorage.clear();
        } else if (error.response && error.response.data.status_code === "403") {
            navigate("/errorpage403");
        } else {
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message.join(" ")
                : error.response.data.message;
            ErrorAlert(errorMessage);
        }
    }

    const handlePostData = async (values) => {
        try {
            const formData = new FormData();

            formData.append("opening_balance_type", values.opening_balance_type);
            formData.append("opening_balance_date", values.opening_balance_date);
            formData.append("opening_balance", values.opening_balance);
            formData.append("site_id", values.site_id);
            formData.append("opening_balance_loomis", values.opening_balance_loomis);
            formData.append("opening_balance_ou_loomis", values.opening_balance_ou_loomis);
            formData.append("opening_balance_ou_bank", values.opening_balance_ou_bank);
            formData.append("closing_balance_adjustment", values.closing_balance_adjustment);

            const postDataUrl = "/site/opening-balance/add";
            const navigatePath = `/opening-balance/${id}`;

            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed

        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    }


    const validationSchema = Yup.object({

        opening_balance_type: Yup.string().required('Opening Balance Type is required'),
        opening_balance_date: Yup.string().required('Opening Balance Date is required'),
        opening_balance: Yup.string().required('Opening Balance is required'),
        opening_balance_loomis: Yup.string().required('Opening Balance Loomis is required'),
        opening_balance_ou_loomis: Yup.string().required('Opening Balance ou lommis is required'),
        opening_balance_ou_bank: Yup.string().required('Opening Balance ou bank is required'),
        closing_balance_adjustment: Yup.string().required('Closing Balance is required'),
    });




    const formik = useFormik({
        initialValues: {
            site_id: id,
            opening_balance_type: "",
            opening_balance_date: "",
            opening_balance: "",
            opening_balance_loomis: "",
            opening_balance_ou_loomis: "",
            opening_balance_ou_bank: "",
            closing_balance_adjustment: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handlePostData(values);
        },
    });

    const handleShowDate = () => {
        const inputDateElement = document.querySelector('input[type="date"]');
        inputDateElement.showPicker();
    };

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Add Opening Balance  ({siteName})</h1>

                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item
                                className="breadcrumb-item"
                                linkAs={Link}
                                linkProps={{ to: "/dashboard" }}
                            >
                                Dashboard
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item  breadcrumds"
                                aria-current="page"
                                linkAs={Link}
                                linkProps={{ to: `/opening-balance/${id}` }}
                            >
                                Manage Opening Balance
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Add Opening Balance
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3">Add Opening Balance</Card.Title>
                            </Card.Header>
                            <form onSubmit={formik.handleSubmit}>
                                <Card.Body>
                                    <Row>
                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label htmlFor="opening_balance_type" className="form-label mt-4">
                                                    Balance Type<span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`input101 ${formik.errors.opening_balance_type && formik.touched.opening_balance_type
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="opening_balance_type"
                                                    name="opening_balance_type"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.opening_balance_type}
                                                >
                                                    <option value="">Select Balance Type</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="card">Card</option>
                                                </select>
                                                {formik.errors.opening_balance_type && formik.touched.opening_balance_type && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.opening_balance_type}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="opening_balance"
                                                >
                                                    Site Opening Balance :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.opening_balance &&
                                                        formik.touched.opening_balance
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="opening_balance"
                                                    name="opening_balance"
                                                    placeholder="Enter Site Opening Balance"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.opening_balance}
                                                    onBlur={formik.values.opening_balance}
                                                />
                                                {formik.errors.opening_balance &&
                                                    formik.touched.opening_balance && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.opening_balance}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={4}>
                                            <div className="form-group">
                                                <label htmlFor="opening_balance_date" className="form-label mt-4">
                                                    Start Date
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    className={`input101 ${formik.errors.opening_balance_date && formik.touched.opening_balance_date
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    type="date"
                                                    onChange={(e) => {
                                                        const selectedOpeningBalanceDate = e.target.value;
                                                        formik.setFieldValue("opening_balance_date", selectedOpeningBalanceDate);
                                                        // You can keep the logic for setting the field value here if needed
                                                    }}
                                                    id="opening_balance_date"
                                                    name="opening_balance_date"
                                                    onClick={handleShowDate}
                                                    value={formik.values.opening_balance_date}
                                                />
                                                {formik.errors.opening_balance_date && formik.touched.opening_balance_date && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.opening_balance_date}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="opening_balance_loomis"
                                                >
                                                    Loomis Opening Balance :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.opening_balance_loomis &&
                                                        formik.touched.opening_balance_loomis
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="opening_balance_loomis"
                                                    name="opening_balance_loomis"
                                                    placeholder="Enter Loomis Opening Balance"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.opening_balance_loomis}
                                                />
                                                {formik.errors.opening_balance_loomis &&
                                                    formik.touched.opening_balance_loomis && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.opening_balance_loomis}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="opening_balance_ou_loomis"
                                                >
                                                    Loomis under/over Balance :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.opening_balance_ou_loomis &&
                                                        formik.touched.opening_balance_ou_loomis
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="opening_balance_ou_loomis"
                                                    name="opening_balance_ou_loomis"
                                                    placeholder="Enter Loomis under/over Balance"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.opening_balance_ou_loomis}
                                                />
                                                {formik.errors.opening_balance_ou_loomis &&
                                                    formik.touched.opening_balance_ou_loomis && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.opening_balance_ou_loomis}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="opening_balance_ou_bank"
                                                >
                                                    Bank under/over Balance :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.opening_balance_ou_bank &&
                                                        formik.touched.opening_balance_ou_bank
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="opening_balance_ou_bank"
                                                    name="opening_balance_ou_bank"
                                                    placeholder="Enter Bank under/over Balance"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.opening_balance_ou_bank}
                                                />
                                                {formik.errors.opening_balance_ou_bank &&
                                                    formik.touched.opening_balance_ou_bank && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.opening_balance_ou_bank}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="closing_balance_adjustment"
                                                >
                                                    Closing Balance Adjustment :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.closing_balance_adjustment &&
                                                        formik.touched.closing_balance_adjustment
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="closing_balance_adjustment"
                                                    name="closing_balance_adjustment"
                                                    placeholder="Enter Closing Balance Adjustment"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.closing_balance_adjustment}
                                                />
                                                {formik.errors.closing_balance_adjustment &&
                                                    formik.touched.closing_balance_adjustment && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.closing_balance_adjustment}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className="text-end">
                                    <Link
                                        type="submit"
                                        className="btn btn-danger me-2 "
                                        to={`/opening-balance/${formik?.values?.site_id}`}
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary me-2 "
                                    // disabled={Object.keys(errors).length > 0}
                                    >
                                        Add Opening Balance
                                    </button>
                                </Card.Footer>
                            </form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default withApi(AddOpeningBalance);