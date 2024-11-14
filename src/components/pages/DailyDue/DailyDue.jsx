import { useEffect, useState } from 'react';
import withApi from '../../../Utils/ApiHelper'
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import LoaderImg from '../../../Utils/Loader'
import NewFilterTab from '../Filtermodal/NewFilterTab'
import * as Yup from "yup";
import { useSelector } from 'react-redux'
import { handleFilterData } from '../../../Utils/commonFunctions/commonFunction'
import { useFormik } from 'formik'
import { ErrorAlert } from '../../../Utils/ToastUtils';
import FormikInput from '../../Formik/FormikInput';
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const DailyDue = ({ isLoading, getData, postData }) => {
    const [dateValidation, setDateValidation] = useState({ minDate: "", maxDate: "", drs_month: "" });
    const ReduxFullData = useSelector((state) => state?.data?.data);
    const { id: siteID } = useParams()
    const { handleError } = useErrorHandler();
    const validationSchemaForCustomInput = Yup.object({
        start_month: Yup.date()
            .required("Date is required")
    });

    // Define the validation schema using Yup
    const validationSchema = Yup.object({
        dues: Yup.array().of(
            Yup.object({
                e_date: Yup.date().required('Date is required').nullable(),
                invoice: Yup.number()
                    .required('Invoice claim is required').min(0, 'Value must be zero or greater')
                    .typeError('Invoice claim must be a number'),
                operator_pay: Yup.number()
                    .required('Payment by Operator is required').min(0, 'Value must be zero or greater'),
                owner_pay: Yup.number()
                    .required('Payment by Owner is required').min(0, 'Value must be zero or greater'),
                detail: Yup.string().required('Detail is required'),
            })
        ),
        owner_balance_carry: Yup.number()
            .required('Balance Carry Forward From Owner').min(0, 'Value must be zero or greater'),
        operator_balance_carry: Yup.number()
            .required('Balance Carry Forward From Operator').min(0, 'Value must be zero or greater'),
    });


    const formik = useFormik({
        initialValues: {
            site_name: "",
            dues: [],
            is_editable: "",
            operator_balance_carry: "",
            owner_balance_carry: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });




    const fetchDailyDue = async (values) => {

        try {
            // Extract year and month from start_date
            const startDate = new Date(values?.start_month);
            const year = startDate.getFullYear();
            const month = (startDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is 2 digits
            const drs_month = `${year}-${month}`;
            // Calculate start and end dates of the month
            const startOfMonth = new Date(year, startDate.getMonth(), 1).toISOString().split('T')[0];
            const endOfMonth = new Date(year, startDate.getMonth() + 1, 0).toISOString().split('T')[0];

            setDateValidation({
                minDate: startOfMonth,
                maxDate: endOfMonth,
                drs_month: drs_month,
            })
            const response = await getData(
                `site/daily-due/list?site_id=${siteID}&drs_month=${drs_month}`
            );

            if (response?.data?.data) {
                formik.setValues(response?.data?.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append('site_id', siteID)
            formData.append('drs_month', dateValidation?.drs_month)
            formData.append('operator_balance_carry', values?.operator_balance_carry)
            formData.append('owner_balance_carry', values?.owner_balance_carry)


            values?.dues?.forEach((item, index) => {
                formData.append(`e_date[${index}]`, item?.e_date);
                formData.append(`invoice[${index}]`, item?.invoice);
                formData.append(`detail[${index}]`, item?.detail);
                formData.append(`owner_pay[${index}]`, item?.owner_pay);
                formData.append(`operator_pay[${index}]`, item?.operator_pay);
                formData.append(`invoice[${index}]`, item?.invoice);
            });


            const postDataUrl = "/site/daily-due/update";

            await postData(postDataUrl, formData,); // Set the submission state to false after the API call is completed
            handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);

        } catch (error) {
            handleError(error)
            console.log(error); // Set the submission state to false if an error occurs
        }
    };


    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    useEffect(() => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`; // Formats as yyyy-MM


        if (storedData) {
            let parsedData = JSON.parse(storedData);

            if (!parsedData.start_month) {

                parsedData.start_month = currentMonth;

                localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
                // handleApplyFilters(parsedData);
            }
        } else {
            let parsedData = {
                start_month: currentMonth
            };
            localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        }

        handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
    }, [storedData]);


    const handleApplyFilters = (values) => {
        if (values.start_month) {
            fetchDailyDue(values)
        }
    }


    const pushnonbunkeredSalesRow = () => {
        if (formik.isValid) {
            formik.values?.dues?.push({
                detail: "",
                e_date: "",
                id: formik?.values?.dues?.length + 1,
                invoice: "0.00",
                operator_pay: "0.00",
                owner_pay: "0.00",
            });
            formik.setFieldValue("dues", formik.values?.dues);
        } else {
            ErrorAlert("Please fill all fields correctly before adding a new Daily Due row.");
        }
    };



    const handleRemoveClick = (index) => {
        // Create a new array with the item at the specified index removed
        const updatedDues = formik?.values?.dues?.filter((_, i) => i !== index);
        // Update Formik values
        formik.setFieldValue('dues', updatedDues);
    };



    const handleShowDate = (event) => {
        if (event.target && event.target.showPicker) {
            event.target.showPicker(); // Trigger date picker directly from the event
        }
    };



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
                                showResetBtn={false}
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

                                            <Row >
                                                <Col lg={6}>
                                                    <FormikInput formik={formik} type="number" label="Balance Carry Forward From Operator(£)" name="operator_balance_carry" />
                                                </Col>
                                                <Col lg={6}>
                                                    <FormikInput formik={formik} type="number" label="Balance Carry Forward From Owner(£)" name="owner_balance_carry" />
                                                </Col>
                                            </Row>

                                            {formik?.values?.dues?.map((item, index) => (
                                                <Row key={item?.id || index}>
                                                    <Col lg={2}>
                                                        <div className="form-group mt-4">
                                                            <label htmlFor={`dues[${index}].e_date`}>Date<span className="text-danger">*</span></label>
                                                            <input
                                                                type="date"
                                                                name={`dues[${index}].e_date`}
                                                                value={formik?.values?.dues?.[index]?.e_date || ''} // Bind the input value to Formik
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                id={`dues[${index}].e_date`}
                                                                onClick={handleShowDate} // Directly pass handleShowDate
                                                                className={`input101 ${formik.errors.e_date && formik.touched?.e_date ? 'text-danger' : ''} ${formik.values.is_editable ? '' : 'readonly'}`}
                                                                min={dateValidation?.minDate}
                                                                max={dateValidation?.maxDate}
                                                                disabled={!formik.values.is_editable}
                                                            />

                                                            {formik.touched?.dues?.[index]?.e_date && formik.errors.dues?.[index]?.e_date && (
                                                                <div className="text-danger">{formik.errors.dues[index].e_date}</div>
                                                            )}
                                                        </div>
                                                    </Col>


                                                    <Col lg={2}>
                                                        <div className="form-group mt-4">
                                                            <label htmlFor={`dues[${index}].invoice`}>Invoice Claim<span className="text-danger">*</span></label>
                                                            <input
                                                                type="number"
                                                                name={`dues[${index}].invoice`}
                                                                value={formik.values.dues[index].invoice || '0'} // Bind the input value to Formik
                                                                // onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                id={`dues[${index}].invoice`}
                                                                placeholder='Enter Invoice Value'
                                                                onChange={(e) => formik.setFieldValue(
                                                                    e.target.name,
                                                                    e.target.value === '' ? 0 : parseFloat(e.target.value)
                                                                )}
                                                                onClick={handleShowDate} // Directly pass handleShowDate
                                                                className={`input101 ${formik.errors.invoice && formik.touched?.invoice ? 'text-danger' : ''} ${formik.values.is_editable ? '' : 'readonly'}`}
                                                                disabled={!formik.values.is_editable}
                                                            />
                                                            {formik.touched?.dues?.[index]?.invoice && formik.errors.dues?.[index]?.invoice && (
                                                                <div className="text-danger">{formik.errors.dues[index].invoice}</div>
                                                            )}
                                                        </div>
                                                    </Col>

                                                    <Col lg={2}>
                                                        <div className="form-group mt-4">
                                                            <label htmlFor={`dues[${index}].operator_pay`}>Payment By Operator<span className="text-danger">*</span></label>
                                                            <input
                                                                type="number"
                                                                name={`dues[${index}].operator_pay`}
                                                                value={formik.values.dues[index].operator_pay || '0'} // Bind the input value to Formik
                                                                onChange={(e) => formik.setFieldValue(e.target.name, e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                                                onBlur={formik.handleBlur}
                                                                id={`dues[${index}].operator_pay`}
                                                                placeholder='Enter Payment By Operator Value'
                                                                onClick={handleShowDate} // Directly pass handleShowDate
                                                                className={`input101 ${formik.errors.operator_pay && formik.touched?.operator_pay ? 'text-danger' : ''} ${formik.values.is_editable ? '' : 'readonly'}`}
                                                                disabled={!formik.values.is_editable}
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
                                                            <label htmlFor={`dues[${index}].owner_pay`}>Payment By Owner<span className="text-danger">*</span></label>
                                                            <input
                                                                type="number"
                                                                name={`dues[${index}].owner_pay`}
                                                                value={formik.values.dues[index].owner_pay || '0'} // Bind the input value to Formik
                                                                onChange={(e) => formik.setFieldValue(e.target.name, e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                                                onBlur={formik.handleBlur}
                                                                id={`dues[${index}].owner_pay`}
                                                                placeholder='Enter Payment By Owner Value'
                                                                onClick={handleShowDate} // Directly pass handleShowDate
                                                                className={`input101 ${formik.errors.owner_pay && formik.touched?.owner_pay ? 'text-danger' : ''} ${formik.values.is_editable ? '' : 'readonly'}`}
                                                                disabled={!formik.values.is_editable}
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
                                                            <label htmlFor={`dues[${index}].detail`}>Detail<span className="text-danger">*</span></label>
                                                            <input
                                                                type='text'
                                                                name={`dues[${index}].detail`}
                                                                value={formik.values.dues[index].detail || ''} // Bind the input value to Formik
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                id={`dues[${index}].detail`}
                                                                placeholder='Enter Detail Value'
                                                                onClick={handleShowDate} // Directly pass handleShowDate
                                                                className={`input101 ${formik.errors.detail && formik.touched?.detail ? 'text-danger' : ''} ${formik.values.is_editable ? '' : 'readonly'}`}
                                                                disabled={!formik.values.is_editable}
                                                            />
                                                            {formik?.touched?.dues && formik.errors?.dues?.[index]?.detail && (
                                                                <div className="text-danger">
                                                                    {formik.errors.dues[index].detail}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>

                                                    <Col lg={2} className="text-end">
                                                        {formik?.values?.dues?.length > 1 && (<>
                                                            <div
                                                                className="text-end"
                                                                style={{ marginTop: "40px" }}
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
                                            ))}

                                            <Card.Footer>
                                                {formik?.values?.is_editable && (
                                                    <div className="bunkered-action">
                                                        <div className="text-end mt-3">
                                                            <button
                                                                className="btn btn-primary"
                                                                type="submit"
                                                            >
                                                                Submit
                                                            </button>

                                                        </div>
                                                    </div>
                                                )}
                                            </Card.Footer>

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