import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

const FuelDelivery = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [editable, setis_editable] = useState();

  const [loading, setLoading] = useState(true);
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
        const response = await axiosInstance.get(
          `/fuel-delivery/list?site_id=${SiteID}&drs_date=${ReportDate}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data?.listing ? data.data.listing : []);
          setis_editable(data?.data ? data.data : {});
          

          // Create an array of form values based on the response data
          const formValues = data?.data?.listing
          ? data.data.listing.map((item) => {
              return {
                start_dip: item.start_dip || "",
                bunkd_delivery_volume: item.bunkd_delivery_volume || "",
                delivery_volume: item.delivery_volume || "",
                end_dip: item.end_dip || "",
                sales_volume: item.sales_volume || "",
                end_book: item.end_book || "",
                variance: item.variance || "",
                percentage_sales: item.percentage_sales || "",
                variance_lt: item.variance_lt || "",
                variance_per: item.variance_per || "",
                // Add other properties as needed
              };
            })
          : [];
        

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [SiteID, ReportDate]);

  if (SiteID && ReportDate) {
    console.log("client_id:", SiteID);
    console.log("start_date:", ReportDate);
  }

  const handleSubmit = (values) => {
    console.log(values, "Submit");
  };

  const columns = [
    // ... existing columns

    {
      name: "TANK-FUEL",
      selector: (row) => row.fuel_name,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.fuel_name !== undefined
            ? `${row.tank_name}-${row.fuel_name}`
            : ""}
        </span>
      ),
    },
    {
      name: "OPENING",
      selector: (row) => row.start_dip,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`start_dip-${index}`}
            name={`data[${index}].start_dip`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.start_dip || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "BUNKER DELIVERIES",
      selector: (row) => row.bunkd_delivery_volume,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`bunkd_delivery_volume-${index}`}
            name={`data[${index}].bunkd_delivery_volume`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.bunkd_delivery_volume || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "DELIVERIES",
      selector: (row) => row.delivery_volume,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`delivery_volume-${index}`}
            name={`data[${index}].delivery_volume`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.delivery_volume || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "DIPS STOCK",
      selector: (row) => row.end_dip,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`end_dip-${index}`}
            name={`data[${index}].end_dip`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.end_dip || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "SALES",
      selector: (row) => row.sales_volume,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`sales_volume-${index}`}
            name={`data[${index}].sales_volume`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.sales_volume || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "BOOKED STOCK",
      selector: (row) => row.end_book,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`end_book-${index}`}
            name={`data[${index}].end_book`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.end_book || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (L)",
      selector: (row) => row.variance,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`variance-${index}`}
            name={`data[${index}].variance`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.variance || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (%)",
      selector: (row) => row.percentage_sales,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`percentage_sales-${index}`}
            name={`data[${index}].percentage_sales`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.percentage_sales || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (L) 30 DAYS",
      selector: (row) => row.variance_lt,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`variance_lt-${index}`}
            name={`data[${index}].variance_lt`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.variance_lt || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "VARIANCE (%) 30 DAYS",
      selector: (row) => row.variance_per,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="text"
            id={`variance_per-${index}`}
            name={`data[${index}].variance_per`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.variance_per || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
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
      {loading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel Delivery</h3>
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
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
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

export default FuelDelivery;
