import withApi from '../../../Utils/ApiHelper'
import Loaderimg from '../../../Utils/Loader';
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleError } from '../../../Utils/ToastUtils';

const AddOpeningBalance = ({ isLoading, postData }) => {

    const { id, siteName } = useParams()




    const handlePostData = async (values) => {
        try {
            const formData = new FormData();
            formData.append("site_id", values.site_id);

            formData.append("balance_date", values.balance_date);
            formData.append("amount", values.amount);

            const postDataUrl = "/site/bunkering-balance/add";
            const navigatePath = `/bunkering-balance/${id}`;

            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed

        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    }


    const validationSchema = Yup.object({

        amount: Yup.string().required('Bunkering Balance Amount is required'),
        balance_date: Yup.string().required('Bunkering Balance Date is required'),
    });




    const formik = useFormik({
        initialValues: {
            site_id: id,
            amount: "",
            balance_date: "",
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
                        <h1 className="page-title">Add Bunkering Balance ({siteName})</h1>

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
                                linkProps={{ to: `/bunkering-balance/${id}` }}
                            >
                                Manage Bunkering Balance
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Add Bunkering Balance
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3">Add Bunkering Balance</Card.Title>
                            </Card.Header>
                            <form onSubmit={formik.handleSubmit}>
                                <Card.Body>
                                    <Row>

                                        <Col lg={4} md={4}>
                                            <div className="form-group">
                                                <label htmlFor="balance_date" className="form-label mt-4">
                                                    Balance Date
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    className={`input101 ${formik.errors.balance_date && formik.touched.balance_date
                                                        ? "is-invalid"
                                                        : ""
                                                        }`}
                                                    type="date"
                                                    onChange={(e) => {
                                                        const selectedOpeningBalanceDate = e.target.value;
                                                        formik.setFieldValue("balance_date", selectedOpeningBalanceDate);
                                                        // You can keep the logic for setting the field value here if needed
                                                    }}
                                                    id="balance_date"
                                                    name="balance_date"
                                                    onClick={handleShowDate}
                                                    value={formik.values.balance_date}
                                                />
                                                {formik.errors.balance_date && formik.touched.balance_date && (
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
                                    >
                                        Add Bunkering Balance
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