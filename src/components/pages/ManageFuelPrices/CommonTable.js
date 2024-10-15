import React from 'react';

const CommonTable = ({
  formik,
  columns,
  rows,
  handleChange,
  handleBlur
}) => (
  <table className="w-100">
    <thead className="w-100">
      <tr>
        {columns.map((column, index) => (
          <th key={index}>
            {column.charAt(0).toUpperCase() + column.slice(1)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="w-100">
      {rows?.map((row, rowIndex) => (
        <tr className="middayModal-tr" key={row.id}>
          {columns.map((column, colIndex) => (
            <td className="middayModal-td" key={colIndex}>
              {column === "date" ? (
                <input
                  type="date"
                  className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                  title={row[column]}
                  name={`rows[${rowIndex}].${column}`}
                  value={row[column] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={row.readonly}
                />
              ) : column === "time" ? (
                <input
                  type="time"
                  className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                  title={row[column]}
                  name={`rows[${rowIndex}].${column}`}
                  value={row[column] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={row.readonly}
                />
              ) : (
                <input
                  className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${row.readonly ? "readonly" : ""}`}
                  type="number"
                  name={`rows[${rowIndex}].${column}`}
                  value={row[column] || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={row.readonly}
                  step="0.01"
                />
              )}
              {formik.touched.rows &&
                formik.touched.rows[rowIndex]?.[column] &&
                formik.errors.rows &&
                formik.errors.rows[rowIndex]?.[column] && (
                  <div style={{ color: "red" }} className="readonly">
                    {formik.errors.rows[rowIndex][column]}
                  </div>
                )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default CommonTable;
