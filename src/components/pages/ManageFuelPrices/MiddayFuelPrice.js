import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { Card, Row, Col } from 'react-bootstrap';

const MiddayFuelPrice = () => {
  const formik = useFormik({
    initialValues: {
      columns: [],
      rows: [],
      update_tlm_price: false,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      // Your submit logic here
    },
  });

  // Fetch data and set it in Formik
  useEffect(() => {
    async function fetchData() {
      const data = {
        columns: [
          "date",
          "time",
          "Unleaded",
          "Superunleaded",
          "Diesel",
          "SuperDiesel",
          "Adblue",
          "Other",
        ],
        rows: [
          {
            id: uuidv4(),
            date: "2024-09-02",
            time: "08:00",
            Unleaded: 1.459,
            Superunleaded: 1.86,
            Diesel: 1.50,
            SuperDiesel: 4.50,
            Adblue: 1.20,
            Other: 1.455,
            readonly: false,
            currentprice: true,
          },
          {
            id: uuidv4(),
            date: "2024-09-02",
            time: "10:00",
            Unleaded: 1.53,
            Superunleaded: 1.23,
            Diesel: 1.459,
            SuperDiesel: 1.25,
            Adblue: 1.50,
            Other: 1.26,
            currentprice: false,
            readonly: true,
          },
          {
            id: uuidv4(),
            date: "2024-09-02",
            time: "12:00",
            Unleaded: 4.50,
            Superunleaded: 400,
            Diesel: 1.20,
            SuperDiesel: 1.459,
            Adblue: 1.23,
            Other: 2.36,
            readonly: false,
            currentprice: false,
          },
        ],
      };

      formik.setValues({
        columns: data.columns,
        rows: data.rows,
      });
    }

    fetchData();
  }, []);

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
            <form onSubmit={formik.handleSubmit}>
              <table className="w-100">
                <thead>
                  <tr>
                    {formik.values.columns.map((column, index) => (
                      <th key={index}>{column.charAt(0).toUpperCase() + column.slice(1)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formik.values.rows.map((row, rowIndex) => (
                    <tr className="middayModal-tr" key={row.id}>
                      {formik.values.columns.map((column, colIndex) => (
                        <td className="middayModal-td" key={colIndex}>
                          {column === "date" ? (
                            <input
                              type="date"
                              className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${
                                row.readonly ? "readonly" : ""
                              }`}
                              name={`rows[${rowIndex}].${column}`}
                              value={row[column] || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              readOnly={row.readonly}
                            />
                          ) : column === "time" ? (
                            <input
                              type="time"
                              className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${
                                row.readonly ? "readonly" : ""
                              }`}
                              name={`rows[${rowIndex}].${column}`}
                              value={row[column] || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              readOnly={row.readonly}
                            />
                          ) : (
                            <input
                              type="number"
                              className={`table-input ${row.currentprice ? "fuel-readonly" : ""} ${
                                row.readonly ? "readonly" : ""
                              }`}
                              name={`rows[${rowIndex}].${column}`}
                              value={row[column] || ""}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
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
            </form>
          </Card.Body>
          <Card.Footer>
            <div className="text-end d-flex align-items-end justify-content-end">
              <div
                className="pointer"
                onClick={() =>
                  formik.setFieldValue("update_tlm_price", !formik.values.update_tlm_price)
                }
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <div>
                    <input
                      type="checkbox"
                      name="update_tlm_price"
                      onChange={formik.handleChange}
                      checked={formik.values.update_tlm_price}
                      className="form-check-input pointer mx-2"
                    />
                    <label htmlFor="update_tlm_price" className="mt-1 ms-6 pointer">
                      Update TLM Price
                    </label>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary mt-2 ms-2" type="submit">
                Submit
              </button>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default MiddayFuelPrice;
