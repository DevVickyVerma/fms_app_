import React from "react";
import { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const ShopSales = (props) => {
  const {
    apidata,
    error,
    getData,
    postData,
    company_id,
    client_id,
    site_id,
    start_date,
    sendDataToParent,
  } = props;
  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
    };

    // Call the callback function with the object containing all the props
    sendDataToParent(allPropsData);
  };


  const [data, setData] = useState([]);
  const [DeductionData, setDeductionData] = useState([]);
  const [editable, setis_editable] = useState();

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await axiosInstance.get(
          `/charge-deduction/list?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data ? data.data.charges : []);

          setDeductionData(data?.data ? data.data.deductions : []);
          setis_editable(data?.data ? data.data : {});

          // Create an array of form values based on the response data
          const formValues = data?.data?.charges
            ? data.data.charges.map((item) => ({
              id: item.charge_id,
              charge_value: item.charge_value,
              // value_per: item.value_per,
              // Add other properties as needed
            }))
            : [];

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);

          // Create an array of deduction form values based on the response data
          const deductionFormValues = data?.data?.deductions
            ? data.data.deductions.map((item) => ({
              id: item.deduction_id,
              deduction_value: item.deduction_value,
              // Add other properties as needed
            }))
            : [];

          // Set the formik values for deductions using setFieldValue
          formik.setFieldValue("deductions", deductionFormValues);

          // Call a function or pass the deductionFormValues array to another component
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [site_id, start_date]);

  const handleSubmit = async (values, deductionFormValues) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();

    for (const obj of values.data) {
      const { id, charge_value } = obj;
      const charge_valueKey = `charge[${id}]`;

      formData.append(charge_valueKey, charge_value);
    }

    for (const deductionObj of values.deductions) {
      const { id, deduction_value } = deductionObj;
      const deductionValueKey = `deduction[${id}]`;

      formData.append(deductionValueKey, deduction_value);
    }

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/shop-sale/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json(); // Read the response once

      if (response.ok) {
        SuccessAlert(responseData.message);
        handleButtonClick();
      } else {
        ErrorAlert(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      console.error("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });
  const chargesColumns = [
    {
      name: "CHARGE GROUPS",

      selector: (row) => row.charge_name,
      sortable: false,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.charge_name}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "	SALES AMOUNT",
      selector: (row) => row.charge_value,
      sortable: false,
      width: "50%",
      center: true,
      // Title: "CASH METERED SALES",

      cell: (row, index) =>
        row.charge_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.charge_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`charge_value-${index}`}
              name={`data[${index}].charge_value`}
              className={"table-input readonly"}
              value={formik.values?.data[index]?.charge_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
  ];
  const deductionsColumns = [
    {
      name: "DEDUCTION GROUPS",
      selector: (row) => row.deduction_name, // Update the selector to use a function
      sortable: false,
      center: false,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_name}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "	SALES AMOUNT",
      selector: (row) => row.deduction_value,
      sortable: false,
      width: "50%",
      center: true,
      // Title: "CASH METERED SALES",

      cell: (row, index) =>
        row.deduction_name === "Total" ? (
          <div>
            <input
              type="number"
              className="table-input readonly total-input"
              value={row.deduction_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`deduction_value-${index}`}
              name={`deductions[${index}].deduction_value`}
              className={"table-input readonly"}
              value={formik.values?.deductions?.[index]?.deduction_value || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
  ];
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
  const tableDatas = {
    chargesColumns,
    deductionsColumns,
    data,
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Charges & Deductions</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <div className="table-responsive deleted-table">
                    {data?.length > 0 ? (
                      <>
                        <DataTable
                          columns={chargesColumns}
                          data={data}
                          // pagination
                          // paginationPerPage={20}
                          responsive
                        />
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

                    {DeductionData?.length > 0 ? (
                      <>
                        <DataTable
                          columns={deductionsColumns}
                          data={DeductionData}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
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
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default ShopSales;
