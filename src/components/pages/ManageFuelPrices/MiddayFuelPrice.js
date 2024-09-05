import { useEffect } from 'react';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { Card, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import ListingForm from './ListingForm';
const MiddayFuelPrice = ({ MiddayFuelPriceData }) => {

    console.log(MiddayFuelPriceData?.data, "MiddayFuelPriceData");

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
            console.log("Form Submitted:", values);
            // Your submit logic here
        },
    });

    const standardizeName = (name) => name?.toLowerCase().replace(/\s+/g, '_');

    useEffect(() => {

        if (MiddayFuelPriceData?.data) {

            const data = MiddayFuelPriceData?.data

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
                update_tlm_price: false,
                head_array: data?.head_array,
                pricedata: data
            });

        }





    }, []);

    const handleChange = (e, rowIndex, column) => {

        const { name, value } = e.target;
        formik.setFieldValue(name, value);
        formik.setFieldValue(`rows[${rowIndex}].${column}`, value);
    };


    const validationSchema = Yup.object({
        listing: Yup.array().of(
            Yup.array().of(
                Yup.object({
                    date: Yup.string().required('Date is required'),
                    time: Yup.string().required('Time is required'),
                    price: Yup.number().required('Price is required').positive('Price must be positive')
                })
            )
        )
    });

    const listing = [
        [
            { id: 'Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09', name: 'Unleaded', date: '2024-10-12', time: '12:00', price: '100', is_editable: false, status: 'SAME' },
            { id: 'OUNrS016Ym93czZsVzlMOHNkSE9hZz09', name: 'Super Unleaded', date: '2024-10-12', time: '12:00 AM', price: '200', is_editable: false, status: 'SAME' },
            { id: 'MkJWd25aSTlDekVwcWg4azgrNVh3UT09', name: 'Diesel', date: '2024-10-12', time: '12:00 AM', price: '300', is_editable: false, status: 'SAME' },
            { id: 'L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09', name: 'Super Diesel', date: '2024-10-12', time: '12:00 AM', price: '400', is_editable: false, status: 'SAME' }
        ],
        [
            { id: 'Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09', name: 'Unleaded', date: '2024-09-04', time: '11:56', is_editable: true, price: '500', status: 'SAME' },
            { id: 'OUNrS016Ym93czZsVzlMOHNkSE9hZz09', name: 'Super Unleaded', date: '2024-09-04', time: '11:56', is_editable: true, price: '600', status: 'SAME' },
            { id: 'MkJWd25aSTlDekVwcWg4azgrNVh3UT09', name: 'Diesel', date: '2024-09-04', time: '11:56', is_editable: true, price: '700', status: 'SAME' },
            { id: 'L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09', name: 'Super Diesel', date: '2024-09-04', time: '11:56', is_editable: true, price: '800', status: 'SAME' }
        ]
    ];
    const lsitingformik = useFormik({
        initialValues: { listing },
        validationSchema,
        onSubmit: (values) => {
            console.log('Form Values:', values);
            // Optionally, you can handle form submission here, such as sending data to an API
        }
    });


    return (
        <Row className="row-sm">
            <Col lg={12}>
                <Card style={{ overflowY: "auto" }}>
                    <Card.Header>
                        <h3 className="card-title w-100">
                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div>
                                    <span>Update Fuel Price (10-12-2024, 10:24 AM)</span>
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
                                                    <th key={item.id}>{item.name}</th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {formik.values?.rows?.map((row, rowIndex) => (
                                                <tr className="middayModal-tr" key={rowIndex}>
                                                    {formik.values?.columns.map((column, colIndex) => (
                                                        <td className="middayModal-td" key={colIndex}>
                                                            {column === "date" ? (
                                                                <input
                                                                    type="date"
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                                                                    value={formik.values.pricedata?.currentDate}
                                                                    name={row[column]}
                                                                    onChange={(e) => handleChange(e, rowIndex, column)}
                                                                    disabled={row.readonly}
                                                                />
                                                            ) : column === "time" ? (
                                                                <input
                                                                    type="text"
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                                                                    name={`rows[${rowIndex}].${column}`}
                                                                    value={formik.values.pricedata?.currentTime}

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
                                                                />
                                                            )}
                                                        </td>
                                                    ))}

                                                </tr>
                                            ))}


                                            {lsitingformik.values?.listing.slice(0, 2).map((row, rowIndex) => (
                                                <>
                                                    <tr>
                                                        <th>

                                                            <div className="">
                                                                <Field
                                                                    name={`listing[${rowIndex}][0].date`}
                                                                    type="date"
                                                                    className="table-input"
                                                                />
                                                                <ErrorMessage name={`listing[${rowIndex}][0].date`} component="div" className="text-danger" />
                                                            </div>
                                                        </th>

                                                        <th>

                                                            <div className="">
                                                                <Field
                                                                    name={`listing[${rowIndex}][0].time`}
                                                                    type="time"
                                                                    className="table-input"



                                                                />
                                                                <ErrorMessage name={`listing[${rowIndex}][0].time`} component="div" className="text-danger" />
                                                            </div>
                                                        </th>

                                                        {row.map((item, itemIndex) => (
                                                            <th key={item.id} className="">
                                                                <div className="">
                                                                    <Field
                                                                        name={`listing[${rowIndex}][${itemIndex}].price`}
                                                                        type="number"
                                                                        className="table-input"
                                                                        disabled={!item.is_editable}
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
                                    <div className='text-end'>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </Card.Footer>
                            </Form >
                        </FormikProvider >
                        {/* <ListingForm /> */}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default MiddayFuelPrice;









