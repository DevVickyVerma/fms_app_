import { useEffect } from 'react';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { Card, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
const MiddayFuelPrice = ({ data, postData }) => {
    const { notify_operator, update_tlm_price } = data || {};

    const formik = useFormik({
        initialValues: {
            columns: [],
            rows: [],
            head_array: [],
            update_tlm_price: false,
            pricedata: []
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            // Your submit logic here
        },
    });

    const standardizeName = (name) => name?.toLowerCase().replace(/\s+/g, '_');
    const validationSchema = Yup.object({
        listing: Yup.array().of(
            Yup.array().of(
                Yup.object({
                    date: Yup.string().required('Date is required'),
                    time: Yup.string().required('Time is required'),
                    price: Yup.number().required('Price is required')
                })
            )
        )
    });
    const listing = [];
    const lsitingformik = useFormik({
        initialValues: { listing },
        validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
            // Optionally, you can handle form submission here, such as sending data to an API
        }
    });

    const { id: prarmSiteID } = useParams()
    useEffect(() => {

        if (data) {



            // Standardize column names
            const columns = data?.head_array?.map(item => standardizeName(item.name));
            const firstRow = data?.current[0] || [];
            const rows = firstRow?.reduce((acc, item) => {
                const standardizedName = standardizeName(item.name);
                acc.date = item.date;
                acc.time = item.time;
                acc[standardizedName] = item.price;
                acc.readonly = !item.is_editable;
                acc.currentprice = item.status === "SAME";
                return acc;
            }, {});

            formik.setValues({
                columns: columns,
                rows: [rows], // Make sure rows is an array with one object
                update_tlm_price: data?.update_tlm_price,
                notify_operator: data?.notify_operator,
                head_array: data?.head_array,
                pricedata: data
            });
            lsitingformik.setValues({
                listing: data?.listing,

            });

        }





    }, [data]);

    const handleChange = (e, rowIndex, column) => {

        const { name, value } = e.target;
        formik.setFieldValue(name, value);
        formik.setFieldValue(`rows[${rowIndex}].${column}`, value);
    };



    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append('site_id', prarmSiteID)
            if (formik?.values?.update_tlm_price == 1) {
                formData.append('update_tlm_price', formik?.values?.update_tlm_price == 1 ? true : false);
            }
            if (formik?.values?.notify_operator) {
                formData.append('notify_operator', formik?.values?.notify_operator);
            }


            const flattenedData = values?.listing?.flat();
            const editableItems = flattenedData.filter(item => item?.is_editable);


            formData.append(`drs_date`, editableItems[0]?.date);
            formData.append(`time`, editableItems[0]?.time);

            values?.listing.flat().forEach(item => {
                if (item?.is_editable) {
                    formData.append(`fuels[${item.id}]`, item.price);
                }
            });



            const postDataUrl = "/site/fuel-price/update-siteprice";
            const navigatePath = `/fuelprice`;

            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
        } catch (error) {
            console.log(error); // Set the submission state to false if an error occurs
        }
    };


    const handleShowDate = (index) => {
        const inputDateElement = document.querySelector(`#${index}`);
        if (inputDateElement && inputDateElement.showPicker) {
            inputDateElement.showPicker();
        }
    };

    return (
        <Row className="row-sm">
            <Col lg={12}>
                <Card style={{ overflowY: "auto" }}>
                    <Card.Header>
                        <h3 className="card-title w-100">
                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div>
                                    <span>Fuel Selling Price ({`${data?.currentDate}, ${data?.currentTime}`}) </span>
                                    <span className="d-flex pt-1 align-items-center" style={{ fontSize: "12px" }}>
                                        <span className="greenboxx me-2"></span>
                                        <span className="text-muted">Current Price</span>
                                    </span>
                                </div>
                            </div>
                        </h3>
                    </Card.Header>
                    <Card.Body>

                        <FormikProvider value={lsitingformik}>
                            <Form>

                                <div className="table-container table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                {formik.values?.head_array?.map((item) => (
                                                    <th key={item?.id}>{item?.name}</th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {formik?.values?.rows?.map((row, rowIndex) => (


                                                <tr className="middayModal-tr" key={rowIndex}>




                                                    {formik?.values?.columns?.map((column, colIndex) => (
                                                        <td className="middayModal-td" key={colIndex}>

                                                            {column === "date" ? (
                                                                <input
                                                                    type="date"
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                                                                    value={formik.values.pricedata?.currentDate}
                                                                    name={row[column]}
                                                                    onChange={(e) => handleChange(e, rowIndex, column)}
                                                                    disabled={row.readonly}
                                                                    placeholder="Enter price"
                                                                />
                                                            ) : column === "time" ? (
                                                                <input
                                                                    type="text"
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                                                                    name={`rows[${rowIndex}].${column}`}
                                                                    value={formik.values.pricedata?.currentTime}
                                                                    placeholder="Enter price"
                                                                    onChange={(e) => handleChange(e, rowIndex, column)}
                                                                    disabled={row.readonly}
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="number"
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                                                                    name={`rows[${rowIndex}].${column}`}
                                                                    value={row[column]}
                                                                    onChange={(e) => handleChange(e, rowIndex, column)}
                                                                    disabled={row.readonly}
                                                                    placeholder="Enter price"
                                                                />
                                                            )}
                                                        </td>
                                                    ))}

                                                </tr>
                                            ))}


                                            {lsitingformik?.values?.listing?.map((row, rowIndex) => (
                                                <>


                                                    <tr>
                                                        <th>
                                                            <div className="">
                                                                <Field
                                                                    name={`listing[${rowIndex}][0].date`}
                                                                    type="date"
                                                                    disabled={!row[0].is_editable}
                                                                    className={`table-input ${!row[0].is_editable ? 'readonly' : ''}`}
                                                                    placeholder="Enter Date"
                                                                />
                                                                <ErrorMessage name={`listing[${rowIndex}][0].date`} component="div" className="text-danger" />
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className="">
                                                                <Field
                                                                    name={`listing[${rowIndex}][0].time`}
                                                                    type="time"
                                                                    disabled={!row[0].is_editable}
                                                                    className={`table-input ${!row[0].is_editable ? 'readonly' : ''}`}
                                                                    placeholder="Enter time"
                                                                />
                                                                <ErrorMessage name={`listing[${rowIndex}][0].time`} component="div" className="text-danger" />
                                                            </div>
                                                        </th>

                                                        {row?.map((item, itemIndex) => (
                                                            <th key={item.id} className="">
                                                                <div className="">
                                                                    <Field
                                                                        name={`listing[${rowIndex}][${itemIndex}].price`}
                                                                        type="number"
                                                                        className={`table-input ${!item.is_editable ? 'readonly' : ''}`}
                                                                        disabled={!item.is_editable}
                                                                        placeholder="Enter price"
                                                                        step="0.010"
                                                                    />
                                                                    <ErrorMessage name={`listing[${rowIndex}][${itemIndex}].price`} component="div" className="text-danger" />
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>




                                                </>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>


                                <Card.Footer>


                                    <div className='text-end d-flex justify-content-end align-items-baseline gap-4'>

                                        {update_tlm_price !== 1 && notify_operator ? (
                                            <div className=' position-relative pointer'>
                                                <input
                                                    type="checkbox"
                                                    id="notify_operator"
                                                    name="notify_operator"
                                                    value={formik?.values?.notify_operator}
                                                    onChange={formik.handleChange}
                                                    className='mx-1 form-check-input form-check-input-updated pointer'
                                                />
                                                <label htmlFor="notify_operator" className='me-3 m-0 pointer'>Notify Operator</label>
                                            </div>
                                        ) : null}

                                        {update_tlm_price == 1 ? (
                                            <div className=' position-relative pointer'>
                                                <input
                                                    type="checkbox"
                                                    id="update_tlm_price"
                                                    name="update_tlm_price"
                                                    checked={formik?.values?.update_tlm_price === 1}
                                                    onChange={(e) => {
                                                        formik.setFieldValue('update_tlm_price', e.target.checked ? 1 : 0);
                                                    }}
                                                    className='mx-1 form-check-input form-check-input-updated pointer'

                                                />
                                                <label htmlFor="update_tlm_price" className='p-0 m-0 pointer'>Update TLM Price</label>
                                            </div>
                                        ) : null}


                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </Card.Footer>
                            </Form >
                        </FormikProvider >
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default MiddayFuelPrice;









