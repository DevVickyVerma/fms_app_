import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FuelSales = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [Apidata, setApiData] = useState([]);
  const [editable, setis_editable] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorToast(errorMessage);
    }
  }

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
        setIsLoading(true); // Set loading state to true before fetching data

        const response = await axiosInstance.get(
          `/fuel-sale/list?site_id=${SiteID}&drs_date=${ReportDate}`
        );

        const { data } = response;
        if (data) {
          setData(data.data.listing);
          setis_editable(data.data);

          // Create an array of form values based on the response data
          const formValues = data.data.listing.map((item) => {
            return {
              id: item.id,
              fuel_name: item.fuel_name,
              sales_volume: item.sales_volume,
              gross_value: item.gross_value,
              discount: item.discount,
              nett_value: item.nett_value,
            };
          });

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false); // Set loading state to false after data fetching is complete
      }
    };

    if (ReportDate) {
      fetchData();
    }
  }, [SiteID, ReportDate]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();
    console.log(values.data)

    values.data.forEach((obj) => {
      const id = obj.id;
      const grossValueKey = `gross_value[${id}]`;
      const discountKey = `discount[${id}]`;
      const nettValueKey = `nett_value[${id}]`;
      const sales_volume = `sales_volume[${id}]`;
      // const actionKey = `action[${id}]`;

      const grossValue = obj.gross_value;
      const discount = obj.discount;
      const nettValue = obj.nett_value;
      const salesValue = obj.sales_volume;
      // const action = obj.action;

      formData.append(grossValueKey, grossValue);
      formData.append(discountKey, discount);
      formData.append(nettValueKey, nettValue);
      formData.append(sales_volume, salesValue);
    });

    formData.append("site_id", SiteID);
    formData.append("drs_date", ReportDate);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/fuel-sale/update`,
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
        console.log("Done");
        SuccessToast(responseData.message);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        ErrorToast(responseData.message);

        console.log("API Error:", responseData);
        // Handle specific error cases if needed
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
     
    }
  });

  const columns = [
    {
      name: "FUEL",
      selector: (row) => row.fuel_name,
      sortable: false,
      width: "20%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.fuel_name !== undefined ? `${row.fuel_name}` : ""}
        </span>
      ),
    },
    {
      name: "SALES VOLUME	",
      selector: (row) => row.sales_volume,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
       
           <input
        type="number"
       className="table-input readonly total-input-FuelSales"
        value={row.sales_volume}
        readOnly
        />
        ) : (
          <div>
            <input
              type="number"
              id={`sales_volume-${index}`}
              name={`data[${index}].sales_volume`}
              className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.sales_volume}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "GROSS VALUE	",

      selector: (row) => row.gross_value,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
        
          <input
          type="number"
         className="table-input readonly total-input-FuelSales"
          value={row.gross_value}
          readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`gross_value-${index}`}
              name={`data[${index}].gross_value`}
              className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.gross_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "DISCOUNT	",
      selector: (row) => row.discount,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <input
          type="number"
         className="table-input readonly total-input-FuelSales"
          value={row.discount}
          readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`discount-${index}`}
              name={`data[${index}].discount`}
          
              className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "NETT VALUE",
      selector: (row) => row.nett_value,
      sortable: false,
      width: "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <input
          type="number"
         className="table-input readonly total-input-FuelSales"
          value={row.nett_value}
          readOnly
          />
        ) : (
          <div>
            <input
              type="number"
              id={`nett_value-${index}`}
              name={`data[${index}].nett_value`}
                className={
                  "table-input readonly"
              }
              value={formik.values.data[index]?.nett_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];

  const tableDatas = {
    columns,
    data,
  };

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel Sales</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
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
                {/* {data.length>0 ?  <div className="d-flex justify-content-end mt-3">
                    {editable ? (
                      <button className="btn btn-primary" type="submit">
                        Submit
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled
                      >
                        Submit
                      </button>
                    )}
                  </div> :""} */}
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default FuelSales;
