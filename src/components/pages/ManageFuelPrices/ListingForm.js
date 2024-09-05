import React from 'react';
import { useFormik, Field, FormikProvider, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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

// Validation schema
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

const ListingForm = () => {
    const formik = useFormik({
        initialValues: { listing },
        validationSchema,
        onSubmit: (values) => {
            console.log('Form Values:', values);
            // Optionally, you can handle form submission here, such as sending data to an API
        }
    });

    return (
        <FormikProvider value={formik}>
            <Form>
                {formik.values.listing.slice(0, 2).map((row, rowIndex) => (
                    <div key={rowIndex} className="row mb-3">
                        <div className="row mb-3">
                            <div className="col-md-2">
                                <div className="form-group">
                                    <Field
                                        name={`listing[${rowIndex}][0].date`}
                                        type="date"
                                        className="table-input"
                                    />
                                    <ErrorMessage name={`listing[${rowIndex}][0].date`} component="div" className="text-danger" />
                                </div>
                                <div className="form-group">
                                    <Field
                                        name={`listing[${rowIndex}][0].time`}
                                        type="time"
                                        className="table-input"
                                    />
                                    <ErrorMessage name={`listing[${rowIndex}][0].time`} component="div" className="text-danger" />
                                </div>
                            </div>
                        </div>
                        {row.map((item, itemIndex) => (
                            <div key={item.id} className="col-md-2">
                                <div className="form-group">
                                    <Field
                                        name={`listing[${rowIndex}][${itemIndex}].price`}
                                        type="number"
                                        className="table-input"
                                        disabled={!item.is_editable}
                                    />
                                    <ErrorMessage name={`listing[${rowIndex}][${itemIndex}].price`} component="div" className="text-danger" />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
        </FormikProvider>
    );
};

export default ListingForm;
