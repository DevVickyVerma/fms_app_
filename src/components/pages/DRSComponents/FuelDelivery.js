import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import Loaderimg from "../../../Utils/Loader";
import { Card, Col, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

const FuelDelivery = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [data, setData] = useState([
    {
      id: 1,
      name: "Petrol",
      closingAmount: 0,
      openingAmount: 0,
      totalAmount: 0,
    },
    {
      id: 2,
      name: "Diesel",
      closingAmount: 0,
      openingAmount: 0,
      totalAmount: 0,
    },
    {
      id: 3,
      name: "Gasoline",
      closingAmount: 0,
      openingAmount: 0,
      totalAmount: 0,
    },
    // Add more rows as needed
  ]);

  const handleInputChange = (index, field, value, setFieldValue) => {
    setFieldValue(`data[${index}].${field}`, value);
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  const columns = [
    // ... existing columns

    {
      name: "FUEL-Items",
      selector: "name",
      sortable: false,
      width: "25%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.name}
        </span>
      ),
    },

    {
      name: "closingAmount",
      selector: "closingAmount",
      sortable: false,
      width: "25%",
      center: true,
      cell: (row, index) => (
        <Field
          type="number"
          id={`closingAmount-${index}`}
          name={`closingAmount[${index}]`}
        />
      ),
    },
    {
      name: "openingAmount",
      selector: "openingAmount",
      sortable: false,
      width: "25%",
      center: true,
      cell: (row, index) => (
        <Field
          type="number"
          id={`openingAmount-${index}`}
          name={`openingAmount[${index}]`}
        />
      ),
    },
    {
      name: "totalAmount",
      selector: "totalAmount",
      sortable: false,
      width: "25%",
      center: true,
      cell: (row, index) => (
        <Field
          type="number"
          id={`totalAmount-${index}`}
          name={`totalAmount[${index}]`}
        />
      ),
    },
    // ... existing columns
  ];

  const tableDatas = {
    columns,
    data,
  };

  const handleButtonClick = () => {
    const fuelItems = data.map((row) => ({
      name: row.name,
      closingAmount: row.closingAmount,
      openingAmount: row.openingAmount,
      totalAmount: row.totalAmount,
    }));

    console.log(fuelItems);
  };

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <Row className="row-sm">
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title">Fuel Delivery</h3>
                </Card.Header>
                <Card.Body>
                  <Formik
                    initialValues={{
                      data: data.map((item) => ({
                        ...item,
                        closingAmount: item.closingAmount.toString(),
                        openingAmount: item.openingAmount.toString(),
                        totalAmount: item.totalAmount.toString(),
                      })),
                    }}
                    onSubmit={handleSubmit}
                    validate={(values) => {
                      const errors = {};

                      // Add validation rules here

                      return errors;
                    }}
                  >
                    {(formikProps) => (
                      <Form onSubmit={formikProps.handleSubmit}>
                        <div className="table-responsive deleted-table">
                          <DataTableExtensions {...tableDatas}>
                            <DataTable
                              columns={columns}
                              data={data}
                              noHeader
                              defaultSortField="id"
                              defaultSortAsc={false}
                              striped={true}
                              persistTableHead
                              highlightOnHover
                              searchable={false}
                            />
                          </DataTableExtensions>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                          <button
                            className="btn btn-secondary mx-2"
                            onClick={handleButtonClick}
                          >
                            Get Values
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <button
                    className="btn btn-secondary mx-2"
                    onClick={handleButtonClick}
                  >
                    Get Values
                  </button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default withApi(FuelDelivery);
