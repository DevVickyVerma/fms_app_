import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

const DynamicTableForm = () => {
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({})
  );

  const formik = useFormik({
    initialValues: {
      columns: [],
      rows: [],
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  useEffect(() => {
    async function fetchData() {

      const data = {
        columns: [
          "time",
          "petrol Type",
          "fuel Type",
          "petrol Type2",
          "fuel Type3",
          "quantity",
          "price",

        ],
        rows: [
          {
            id: uuidv4(),
            time: "08:00",
            "petrol Type": "Diesel",
            "fuel Type": "Type A",
            "petrol Type2": "Diesel",
            "fuel Type3": "Type A",
            quantity: 500,
            price: "1.429",

          },
          {
            id: uuidv4(),
            time: "10:00",
            "petrol Type": "Petrol",
            "fuel Type": "Type B",
            "petrol Type2": "Diesel",
            "fuel Type3": "Type A",
            quantity: 300,
            price: "1.529",

          },
          {
            id: uuidv4(),
            time: "12:00",
            "petrol Type": "Diesel",
            "fuel Type": "Type C",
            "petrol Type2": "Petrol",
            "fuel Type3": "Type B",
            quantity: 600,
            price: "1.629",

          },
          {
            id: uuidv4(),
            time: "14:00",
            "petrol Type": "Petrol",
            "fuel Type": "Type D",
            "petrol Type2": "Diesel",
            "fuel Type3": "Type C",
            quantity: 450,
            price: "1.529",

          },
          {
            id: uuidv4(),
            time: "16:00",
            "petrol Type": "Diesel",
            "fuel Type": "Type E",
            "petrol Type2": "Petrol",
            "fuel Type3": "Type D",
            quantity: 550,
            price: "1.429",

          },
          {
            id: uuidv4(),
            time: "18:00",
            "petrol Type": "Petrol",
            "fuel Type": "Type F",
            "petrol Type2": "Diesel",
            "fuel Type3": "Type E",
            quantity: 700,
            price: "1.729",

          },
        ],
      };

      formik.setValues({
        columns: data.columns,
        rows: data.rows,
      });
      const dynamicValidationSchema = Yup.object().shape({
        rows: Yup.array().of(
          Yup.object().shape(
            data.columns.reduce((schema, column) => {
              schema[column] = Yup.string().required(`${column} is required`);
              return schema;
            }, {})
          )
        ),
      });
      setValidationSchema(dynamicValidationSchema);
    }
    fetchData();
  }, []);

  const addNewRow = () => {
    const lastRow = formik.values.rows[formik.values.rows.length - 1];

    const newRow = formik.values.columns.reduce(
      (acc, column) => {
        acc[column] = lastRow ? lastRow[column] : ""; // Copy values from the last row or use empty string if no last row
        return acc;
      },
      { id: uuidv4() }
    );

    formik.setFieldValue("rows", [...formik.values.rows, newRow]);
  };

  const removeRow = (id) => {
    const updatedRows = formik.values.rows.filter((row) => row.id !== id);
    formik.setFieldValue("rows", updatedRows);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="text-end">
        <button className="  btn btn-primary" type="button" onClick={addNewRow}>
          Add Row
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {formik.values.columns.map((column, index) => (
              <th key={index}>
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {formik.values.rows.map((row, rowIndex) => (
            <tr className="middayModal-tr" key={row.id}>
              {formik.values.columns.map((column, colIndex) => (
                <td className="middayModal-td" key={colIndex}>
                  {column === "time" ? (
                    <input
                      type="time"
                      className="table-input"
                      name={`rows[${rowIndex}].${column}`}
                      value={formik.values.rows[rowIndex]?.[column] || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  ) : (
                    <input
                      className="table-input"
                      type="text"
                      name={`rows[${rowIndex}].${column}`}
                      value={formik.values.rows[rowIndex]?.[column] || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  )}
                  {formik.touched.rows &&
                    formik.touched.rows[rowIndex]?.[column] &&
                    formik.errors.rows &&
                    formik.errors.rows[rowIndex]?.[column] && (
                      <div style={{ color: "red" }}>
                        {formik.errors.rows[rowIndex][column]}
                      </div>
                    )}
                </td>
              ))}
              <td>
                {formik.values.rows.length > 1 && (
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => removeRow(row.id)}
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary mt-2" type="submit">Submit</button>
    </form>
  );
};

export default DynamicTableForm;
