import React, { useEffect, useState } from 'react'
import withApi from '../../../Utils/ApiHelper'
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import LoaderImg from '../../../Utils/Loader'
import NewFilterTab from '../Filtermodal/NewFilterTab'
import * as Yup from "yup";
import { useSelector } from 'react-redux'
import { handleFilterData } from '../../../Utils/commonFunctions/commonFunction'
import { useFormik } from 'formik'
import { ErrorAlert } from '../../../Utils/ToastUtils'
import FormikInput from '../../Formik/FormikInput'

const DailyDue = ({ isLoading, getData }) => {
    const [data, setData] = useState();
    const ReduxFullData = useSelector((state) => state?.data?.data);
    const { id: siteID } = useParams()


    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const validationSchemaForCustomInput = Yup.object({
        start_month: Yup.date()
            .required("Date is required")
    });

    // Define the validation schema

    // Define the validation schema using Yup
    const validationSchema = Yup.object({
        dues: Yup.array().of(
            Yup.object({
                e_date: Yup.date().required('Date is required').nullable(),
                invoice: Yup.number()
                    .required('Invoice claim is required')
                    .typeError('Invoice claim must be a number'),
                operator_pay: Yup.number()
                    .required('Payment by Operator is required')
                    .positive('Payment by Operator must be a positive number')
                    .typeError('Payment by Operator must be a valid number'),
                owner_pay: Yup.number()
                    .required('Payment by Owner is required')
                    .positive('Payment by Owner must be a positive number')
                    .min(Yup.ref('operator_pay'), 'Payment by Owner must be greater than or equal to Payment by Operator')
                    .typeError('Payment by Owner must be a valid number'),
                detail: Yup.string().required('Detail is required'),
            })
        ),
    });


    const formik = useFormik({
        initialValues: {
            site_name: "",
            dues: [],
            is_editable: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {

            console.log(values, "values submitterd");

            // handlePostData(values);
        },
    });




    const handleSubmit1 = async (values) => {
        try {
            const response = await getData(
                `site/daily-due/list?site_id=${siteID}&drs_month=${values.start_date}`
            );


            if (response?.data?.data) {
                console.log(response?.data?.data, "responseresponse");
                formik.setValues(response?.data?.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };


    const handleClearForm = async (resetForm) => {
        setData(null)
    };


    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    useEffect(() => {
        handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
    }, []);


    const handleApplyFilters = (values) => {
        if (values.start_month) {
            handleSubmit1(values)
        }
    }


    const pushnonbunkeredSalesRow = () => {
        if (formik.isValid) {
            formik.values?.dues?.push({
                detail: "",
                e_date: "",
                id: formik?.values?.dues?.length + 1,
                invoice: "",
                operator_pay: "",
                owner_pay: "",
            });
            formik.setFieldValue("dues", formik.values?.dues);
        } else {
            ErrorAlert(
                "Please fill all fields correctly before adding a new non-bunkered sales row."
            );
        }
    };



    const handleRemoveClick = (index) => {
        // Assuming your data structure has some property like 'id'
        const clickedId = formik.values.dues[index].id;
        removenonbunkeredSalesRow(index, clickedId);
    };

    const removenonbunkeredSalesRow = (index, clickedId) => {
        if (!clickedId) {
            const updatedRows = [...formik.values.dues];
            updatedRows.splice(index, 1);
            formik.setFieldValue("dues", updatedRows);
        }

        // clickedId && handleDelete(clickedId, index)
    };


    const handleShowDate = (event) => {
        if (event.target && event.target.showPicker) {
            event.target.showPicker(); // Trigger date picker directly from the event
        }
    };

    console.log(formik?.values, "formik vlauesss");
    console.log(formik?.errors, "formik errors");


    return (
        <>
            {isLoading ? <LoaderImg /> : null}
            <div>
                <div className="page-header d-flex">
                    <div>
                        <h1 className="page-title" > Daily Dues ({formik?.values?.site_name})</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item
                                className="breadcrumb-item"
                                linkAs={Link}
                                linkProps={{ to: "/dashboard" }}
                            >
                                Dashboard
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item"
                                linkAs={Link}
                                linkProps={{ to: "/sites" }}
                            >
                                Sites
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Daily Dues
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>


                <Row>
                    <Col md={12} xl={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title"> Fuel Price </h3>
                            </Card.Header>

                            <NewFilterTab
                                getData={getData}
                                isLoading={isLoading}
                                isStatic={true}
                                onApplyFilters={handleApplyFilters}
                                validationSchema={validationSchemaForCustomInput}
                                storedKeyName={storedKeyName}
                                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                                lg="4"
                                showStationValidation={false}
                                showDateInput={false}
                                showStationInput={false}
                                showClientInput={false}
                                showEntityInput={false}
                                showMonthInput={true}
                                showMonthValidation={true}
                                ClearForm={handleClearForm}
                            />

                        </Card>
                    </Col>
                </Row>


                <Row className=" row-sm">
                    <Col lg={12} md={12}>
                        <Card>
                            <Card.Header className=' w-100 d-flex justify-content-between'>
                                <h3 className="card-title">Daily Dues </h3>

                                <span className="text-end">
                                    {formik?.values?.dues?.length > 0 ? (
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={pushnonbunkeredSalesRow}
                                        >
                                            <i className="ph ph-plus"></i>
                                        </button>
                                    ) : null}
                                </span>
                            </Card.Header>
                            <Card.Body>
                                {formik?.values?.dues?.length > 0 ? (
                                    <>

                                        <form onSubmit={formik.handleSubmit} >
                                            {formik.values.dues.map((item, index) => (
                                                < >

                                                    <Row >
                                                        <Col lg={2}>
                                                            <div className="form-group mt-4">
                                                                <label htmlFor={`dues[${index}].e_date`}>Date<span class="text-danger">*</span></label>
                                                                <input
                                                                    type="date"
                                                                    name={`dues[${index}].e_date`}
                                                                    value={formik.values.dues[index].e_date || ''} // Bind the input value to Formik
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    id={`dues[${index}].e_date`}
                                                                    onClick={handleShowDate} // Directly pass handleShowDate
                                                                    className={formik.errors.e_date && formik.touched.e_date ? 'input101 text-danger' : 'input101'}

                                                                />

                                                                {formik.touched.dues?.[index]?.e_date && formik.errors.dues?.[index]?.e_date && (
                                                                    <div className="text-danger">{formik.errors.dues[index].e_date}</div>
                                                                )}
                                                            </div>
                                                        </Col>


                                                        <Col lg={2}>
                                                            <div className="form-group mt-4">
                                                                <label htmlFor={`dues[${index}].invoice`}>Invoice Claim<span class="text-danger">*</span></label>
                                                                <input
                                                                    type="number"
                                                                    name={`dues[${index}].invoice`}
                                                                    value={formik.values.dues[index].invoice || ''} // Bind the input value to Formik
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    id={`dues[${index}].invoice`}
                                                                    placeholder='Enter Invoice Value'
                                                                    onClick={handleShowDate} // Directly pass handleShowDate
                                                                    className={formik.errors.invoice && formik.touched.invoice ? 'input101 text-danger' : 'input101'}
                                                                />
                                                                {formik.touched.dues?.[index]?.invoice && formik.errors.dues?.[index]?.invoice && (
                                                                    <div className="text-danger">{formik.errors.dues[index].invoice}</div>
                                                                )}
                                                            </div>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <div className="form-group mt-4">
                                                                <label htmlFor={`dues[${index}].operator_pay`}>Payment By Operator<span class="text-danger">*</span></label>
                                                                <input
                                                                    type="number"
                                                                    name={`dues[${index}].operator_pay`}
                                                                    value={formik.values.dues[index].operator_pay || ''} // Bind the input value to Formik
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    id={`dues[${index}].operator_pay`}
                                                                    placeholder='Enter Payment By Operator Value'
                                                                    onClick={handleShowDate} // Directly pass handleShowDate
                                                                    className={formik.errors.operator_pay && formik.touched.operator_pay ? 'input101 text-danger' : 'input101'}
                                                                />
                                                                {formik?.touched?.dues && formik.errors?.dues?.[index]?.operator_pay && (
                                                                    <div className="text-danger">
                                                                        {formik.errors.dues[index].operator_pay}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>

                                                        <Col lg={2}>
                                                            <div className="form-group mt-4">
                                                                <label htmlFor={`dues[${index}].owner_pay`}>Payment By Owner<span class="text-danger">*</span></label>
                                                                <input
                                                                    type="number"
                                                                    name={`dues[${index}].owner_pay`}
                                                                    value={formik.values.dues[index].owner_pay || ''} // Bind the input value to Formik
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    id={`dues[${index}].owner_pay`}
                                                                    placeholder='Enter Payment By Owner Value'
                                                                    onClick={handleShowDate} // Directly pass handleShowDate
                                                                    className={formik.errors.owner_pay && formik.touched.owner_pay ? 'input101 text-danger' : 'input101'}
                                                                />
                                                                {formik?.touched?.dues && formik.errors?.dues?.[index]?.owner_pay && (
                                                                    <div className="text-danger">
                                                                        {formik.errors.dues[index].owner_pay}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>
                                                        <Col lg={2}>
                                                            <div className="form-group mt-4">
                                                                <label htmlFor={`dues[${index}].detail`}>Detail<span class="text-danger">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    name={`dues[${index}].detail`}
                                                                    value={formik.values.dues[index].detail || ''} // Bind the input value to Formik
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    id={`dues[${index}].detail`}
                                                                    placeholder='Enter Detail Value'
                                                                    onClick={handleShowDate} // Directly pass handleShowDate
                                                                    className={formik.errors.detail && formik.touched.detail ? 'input101 text-danger' : 'input101'}
                                                                />
                                                                {formik?.touched?.dues && formik.errors?.dues?.[index]?.detail && (
                                                                    <div className="text-danger">
                                                                        {formik.errors.dues[index].detail}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>

                                                        <Col lg={1} md={1} className="text-end">
                                                            {formik?.values?.dues?.length > 1 && (<>
                                                                <div
                                                                    className="text-end"
                                                                    style={{ marginTop: "36px" }}
                                                                >
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => handleRemoveClick(index)}
                                                                    >
                                                                        <i className="ph ph-minus"></i>
                                                                    </button>
                                                                </div>
                                                            </>)}

                                                        </Col>


                                                    </Row >
                                                </>
                                            ))}

                                            <button type="submit">Submit</button>
                                        </form>

                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={require("../../../assets/images/commonimages/no_data.png")}
                                            alt="MyChartImage"
                                            className="all-center-flex nodata-image"
                                        />
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


            </div>


        </>
    )
}

export default withApi(DailyDue)