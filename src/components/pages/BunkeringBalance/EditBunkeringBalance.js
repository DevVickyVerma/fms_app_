import React, { useEffect, useState } from 'react'
import withApi from '../../../Utils/ApiHelper'
import Loaderimg from '../../../Utils/Loader';
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ErrorAlert } from '../../../Utils/ToastUtils';

const EditOpeningBalance = ({ isLoading, postData, getData }) => {
    const [data, setData] = useState();
    const [siteName, setSiteName] = useState("");

    useEffect(() => {
        fetchOpeningBalanceList();
    }, [])

    const navigate = useNavigate();
    const { id } = useParams()



    const validationSchema = Yup.object({
        balance_date: Yup.string().required('Bunkering Balance Date is required'),
        amount: Yup.string().required('Bunkering Balance Amount is required'),
    });

    const formik = useFormik({
        initialValues: {
            site_id: id,
            amount: "",
            balance_date: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // alert(JSON.stringify(values, null, 2));
            handlePostData(values);
        },
    });

    const fetchOpeningBalanceList = async () => {
        try {
            const response = await getData(`site/bunkering-balance/detail/${id}`);
            if (response && response.data) {
                setData(response?.data?.data);
                setSiteName(response?.data?.data?.site_name)
                formik.setValues(response?.data?.data)
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    }


    function handleError(error) {
        if (error.response && error.response.amount === 401) {
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

            formData.append("amount", values.amount);
            formData.append("balance_date", values.balance_date);
            formData.append("id", id);
            const postDataUrl = "/site/bunkering-balance/update";
            const navigatePath = `/bunkering-balance/${values.site_id}`;
            // await postData(postDataUrl, formData,); // Set the submission state to false after the API call is completed
            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed

        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    }









    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Edit Bunkering Balance ({siteName}) </h1>

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
                                linkProps={{ to: `/bunkering-balance/${formik?.values?.site_id}` }}
                            >
                                Manage Bunkering Balance
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Edit Bunkering Balance
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3">Edit Bunkering Balance</Card.Title>
                            </Card.Header>
                            <form onSubmit={formik.handleSubmit}>
                                <Card.Body>
                                    <Row>


                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="balance_date"
                                                >
                                                    Month :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 readonly ${formik.errors.balance_date &&
                                                        formik.touched.balance_date
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    readOnly
                                                    id="balance_date"
                                                    name="balance_date"
                                                    placeholder="Month"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.balance_date}
                                                />
                                                {formik.errors.balance_date &&
                                                    formik.touched.balance_date && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.balance_date}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="amount"
                                                >
                                                    Bunkering Balance Amount :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.amount &&
                                                        formik.touched.amount
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="amount"
                                                    name="amount"
                                                    placeholder="Bunkering Balance Amount"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.amount}
                                                />
                                                {formik.errors.amount &&
                                                    formik.touched.amount && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.amount}
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
                                        to={`/bunkering-balance/${formik?.values?.site_id}`}
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary me-2 "
                                    // disabled={Object.keys(errors).length > 0}
                                    >
                                        Save
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

export default withApi(EditOpeningBalance);