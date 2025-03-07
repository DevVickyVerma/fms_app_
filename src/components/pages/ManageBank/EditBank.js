import { useEffect, useState } from 'react';
import withApi from '../../../Utils/ApiHelper'
import Loaderimg from '../../../Utils/Loader';
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useErrorHandler from "../../CommonComponent/useErrorHandler";


const EditBank = ({ isLoading, getData, postData }) => {
    const [data, setData] = useState();
    const [siteName, setSiteName] = useState("");
    const { id } = useParams();
    const { handleError } = useErrorHandler();

    useEffect(() => {
        fetchBankManagerList();
    }, [])



    const fetchBankManagerList = async () => {
        try {
            const response = await getData(`site/bank-manager/detail/${id}`);
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



    const handlePostData = async (values) => {
        try {
            const formData = new FormData();
            formData.append("manager_name", values.manager_name);
            formData.append("id", id);
            formData.append("bank_name", values.bank_name);
            formData.append("account_name", values.account_name);
            formData.append("account_no", values.account_no);
            formData.append("sort_code", values.sort_code);

            const postDataUrl = `/site/bank-manager/update`;
            const navigatePath = `/managebank/:${data?.site_id}`;
            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    }

    const validationSchema = Yup.object({
        manager_name: Yup.string().required('name is required'),
        bank_name: Yup.string().required('bank name is required'),
        account_name: Yup.string().required('account is required'),
        account_no: Yup.string().required('account no is required'),
        sort_code: Yup.string().required('sort code is required'),
    });
    const formik = useFormik({
        initialValues: {
            manager_name: "",
            bank_name: "",
            account_name: "",
            account_no: "",
            sort_code: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handlePostData(values);
        },
    })

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Edit Bank Manager ({siteName}) </h1>

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
                                linkProps={{ to: `/managebank/${formik?.values?.site_id}` }}
                            >
                                Bank Manager
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Edit Bank Manager
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3">Edit Bank Manager</Card.Title>
                            </Card.Header>
                            <form onSubmit={formik.handleSubmit}>
                                <Card.Body>
                                    <Row>
                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="manager_name"
                                                >
                                                    Manager Name :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.manager_name &&
                                                        formik.touched.manager_name
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="manager_name"
                                                    name="manager_name"
                                                    placeholder="Enter Manager Name"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.manager_name}
                                                />
                                                {formik.errors.manager_name &&
                                                    formik.touched.manager_name && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.manager_name}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="bank_name"
                                                >
                                                    Bank Name :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.bank_name &&
                                                        formik.touched.bank_name
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="bank_name"
                                                    name="bank_name"
                                                    placeholder="Enter Bank Name"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.bank_name}
                                                />
                                                {formik.errors.bank_name &&
                                                    formik.touched.bank_name && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.bank_name}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="account_name"
                                                >
                                                    Account Name :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.account_name &&
                                                        formik.touched.account_name
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="account_name"
                                                    name="account_name"
                                                    placeholder="Enter Account Name"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.account_name}
                                                />
                                                {formik.errors.account_name &&
                                                    formik.touched.account_name && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.account_name}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="account_no"
                                                >
                                                    Account Number :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.account_no &&
                                                        formik.touched.account_no
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="account_no"
                                                    name="account_no"
                                                    placeholder="Enter Account Number"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.account_no}
                                                />
                                                {formik.errors.account_no &&
                                                    formik.touched.account_no && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.account_no}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>

                                        <Col lg={4} md={6}>
                                            <div className="form-group">
                                                <label
                                                    className="form-label mt-4"
                                                    htmlFor="sort_code"
                                                >
                                                    Sort Code  :<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    className={`input101 ${formik.errors.sort_code &&
                                                        formik.touched.sort_code
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    id="sort_code"
                                                    name="sort_code"
                                                    placeholder="Enter Sort Code"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.sort_code}
                                                />
                                                {formik.errors.sort_code &&
                                                    formik.touched.sort_code && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.sort_code}
                                                        </div>
                                                    )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer>
                                    <div className="text-end my-5 text-end-small-screen">
                                        <Link
                                            type="submit"
                                            className="btn btn-danger me-2 "
                                            to={`/managebank/${formik?.values?.site_id}`}
                                        >
                                            Cancel
                                        </Link>
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>
                                </Card.Footer>
                            </form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default withApi(EditBank);