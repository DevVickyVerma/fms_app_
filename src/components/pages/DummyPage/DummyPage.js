import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';

const DynamicTableForm = () => {
    const formik = useFormik({
        initialValues: {
            columns: [],
            rows: [],
        },
        enableReinitialize: true, // Reinitialize form when columns or rows are updated
        onSubmit: (values) => {
            console.log('Form Submitted:', values);
        },
    });

    useEffect(() => {
        async function fetchData() {
            // Simulate fetching data from an API
            const data = {
                columns: ['time', 'petrol Type', 'fuel Type',], // Dynamic columns
                rows: [
                    { id: uuidv4(), time: '08:00', 'petrol Type': 'Diesel', 'fuel Type': 'Type A', },
                    { id: uuidv4(), time: '10:00', 'petrol Type': 'Petrol', 'fuel Type': 'Type B', },
                ], // Initial rows with unique IDs
            };

            formik.setValues({
                columns: data.columns,
                rows: data.rows,
            });
        }

        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount

    const addNewRow = () => {
        const newRow = formik.values.columns.reduce((acc, column) => {
            acc[column] = ''; // Initialize with empty string
            return acc;
        }, { id: uuidv4() });

        const updatedRows = [...formik.values.rows, newRow];
        formik.setFieldValue('rows', updatedRows);
    };

    const removeRow = (id) => {
        const updatedRows = formik.values.rows.filter(row => row.id !== id);
        formik.setFieldValue('rows', updatedRows);
    };



    console.log(formik?.values);

    return (
        <form onSubmit={formik.handleSubmit}>
            <table>
                <thead>
                    <tr>
                        {formik.values.columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {formik.values.rows.map((row, rowIndex) => (
                        <tr key={row.id}>
                            {formik.values.columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column === 'time' ? (
                                        <input
                                            type="time"
                                            name={`rows[${rowIndex}].${column}`}
                                            value={formik.values.rows[rowIndex]?.[column] || ''}
                                            onChange={formik.handleChange}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name={`rows[${rowIndex}].${column}`}
                                            value={formik.values.rows[rowIndex]?.[column] || ''}
                                            onChange={formik.handleChange}
                                        />
                                    )}
                                </td>
                            ))}
                            <td>
                                <button type="button" onClick={() => removeRow(row.id)}>
                                    Remove
                                </button>
                                <button type="button" onClick={addNewRow}>
                                    Add Row
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="submit">Submit</button>
        </form>
    );
};

export default DynamicTableForm;
