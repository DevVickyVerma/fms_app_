import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const FuelDelivery = (props) => {
  const { apidata, isLoading, error, getData, postData, SiteID, ReportDate } =
    props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = localStorage.getItem("token");

  //     const axiosInstance = axios.create({
  //       baseURL: process.env.REACT_APP_BASE_URL,
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     try {
  //       const response = await axiosInstance.get(`/fuel-delivery/list?site_id=${SiteID}&drs_date=${ReportDate}`);
  //       console.log(response.data, "fuels");
  //       const { data } = response;
  //       if (data) {
  //         console.log(data.data, "innerfuels");
  //         setData(data.data)

  //       }
  //     } catch (error) {
  //       console.error("API error:", error);
  //     }
  //   };

  //   fetchData();
  // }, [SiteID, ReportDate]);
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
        console.log(response.data, "fuels");
        const { data } = response;
        if (data) {
          console.log(data.data, "innerfuels");
          setData(data.data);

          // Create an array of form values based on the response data
          const formValues = data.data.map((item) => {
            console.log(item, "items");
            return {
              start_dip: item.start_dip || "",
              bunkd_delivery_volume: item.bunkd_delivery_volume || "",
              delivery_volume: item.delivery_volume || "",
              end_dip: item.end_dip || "",
              sales_volume : item.sales_volume  || "",
              end_book : item.end_book  || "",
              variance  : item.variance   || "",
              percentage_sales   : item.percentage_sales    || "",
              variance_lt    : item.variance_lt     || "",
              variance_per    : item.variance_per     || "",
              // Add other properties as needed
            };
          });

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
        }
      } catch (error) {
        console.error("API error:", error);
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
          {row.fuel_name !== undefined ? `${row.tank_name}-${row.fuel_name}` : ''}
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
            className="table-input"
            value={formik.values.data[index]?.start_dip || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.bunkd_delivery_volume || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.delivery_volume || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.end_dip || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.sales_volume || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.end_book || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.variance || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.percentage_sales || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.variance_lt || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            className="table-input"
            value={formik.values.data[index]?.variance_per || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    
    
    
    
    // ... remaining columns
  ];

  // Update the existing columns array with the modified one


  // const columns = [
  //   // ... existing columns

  //   {
  //     name: "TANK-FUEL",
  //     selector: (row) => row.fuel_name,
  //     sortable: false,
  //         width: "8%",
  //     center: true,
  //     cell: (row) => (
  //       <span className="text-muted fs-15 fw-semibold text-center">
  //         {`${row.tank_name}-${row.fuel_name}`}
  //       </span>
  //     ),
  //   },

  //     { name: "OPENING",
  //     selector: (row) => row.start_dip,
  //     sortable: false,
  //         width: "8%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`start_dip-${index}`}
  //           name={`data[${index}].start_dip`}
  //           className="table-input"
  //           value={formik.values.data[index]?.start_dip || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* Error handling code */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "BUNKER DELIVERIES",
  //     selector: (row) => row.bunkd_delivery_volume,
  //     sortable: false,
  //         width: "8%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`bunkd_delivery_volume-${index}`}
  //           name={`data[${index}].bunkd_delivery_volume`}
  //           className="table-input"
  //           value={formik.values.data[index]?.bunkd_delivery_volume || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* Error handling code */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "DELIVERIES",
  //     selector: (row) => row.delivery_volume,
  //     sortable: false,
  //         width: "8%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`delivery_volume-${index}`}
  //           name={`data[${index}].delivery_volume`}
  //           className="table-input"
  //           value={formik.values.data[index]?.delivery_volume || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* Error handling code */}
  //       </div>
  //     ),
  //   },
  
  //   {
  //     name: "DIPS STOCK",
  //     selector: (row) => row.end_dip,
  //     sortable: false,
  //         width: "8%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`end_dip-${index}`}
  //           name={`data[${index}].end_dip`}
  //           className="table-input"
  //           value={formik.values.data[index].end_dip || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].end_dip && (
  //             <div className="error-message">
  //               {formik.errors.data[index].end_dip}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "DIPS STOCK",
  //     selector: (row) => row.end_dip,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`end_dip-${index}`}
  //           name={`data[${index}].end_dip`}
  //           className="table-input"
  //           value={formik.values.data[index].end_dip || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].end_dip && (
  //             <div className="error-message">
  //               {formik.errors.data[index].end_dip}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "SALES",
  //     selector: (row) => row.sales_volume,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`sales_volume-${index}`}
  //           name={`data[${index}].sales_volume`}
  //           className="table-input"
  //           value={formik.values.data[index].sales_volume || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].sales_volume && (
  //             <div className="error-message">
  //               {formik.errors.data[index].sales_volume}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "SALES",
  //     selector: (row) => row.sales_volume,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`sales_volume-${index}`}
  //           name={`data[${index}].sales_volume`}
  //           className="table-input"
  //           value={formik.values.data[index].sales_volume || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].sales_volume && (
  //             <div className="error-message">
  //               {formik.errors.data[index].sales_volume}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "BOOKED STOCK",
  //     selector: (row) => row.end_book,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`end_book-${index}`}
  //           name={`data[${index}].end_book`}
  //           className="table-input"
  //           value={formik.values.data[index].end_book || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].end_book && (
  //             <div className="error-message">
  //               {formik.errors.data[index].end_book}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },

  //   {
  //     name: "VARIANCE (L)",
  //     selector: (row) => row.variance,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`variance-${index}`}
  //           name={`data[${index}].variance`}
  //           className="table-input"
  //           value={formik.values.data[index].variance || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].variance && (
  //             <div className="error-message">
  //               {formik.errors.data[index].variance}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "VARIANCE (%)",
  //     selector: (row) => row.percentage_sales,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`percentage_sales-${index}`}
  //           name={`data[${index}].percentage_sales`}
  //           className="table-input"
  //           value={formik.values.data[index].percentage_sales || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].percentage_sales && (
  //             <div className="error-message">
  //               {formik.errors.data[index].percentage_sales}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "VARIANCE (L) 30 DAYS",
  //     selector: (row) => row.variance_lt,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`variance_lt-${index}`}
  //           name={`data[${index}].variance_lt`}
  //           className="table-input"
  //           value={formik.values.data[index].variance_lt || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].variance_lt && (
  //             <div className="error-message">
  //               {formik.errors.data[index].variance_lt}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: "VARIANCE (%) 30 DAYS",
  //     selector: (row) => row.variance_per,
  //     sortable: false,
  //     width: "15%",
  //     center: true,
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="text"
  //           id={`variance_per-${index}`}
  //           name={`data[${index}].variance_per`}
  //           className="table-input"
  //           value={formik.values.data[index].variance_per || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //         />
  //         {/* {formik.touched.data &&
  //           formik.touched.data[index] &&
  //           formik.errors.data &&
  //           formik.errors.data[index] &&
  //           formik.errors.data[index].variance_per && (
  //             <div className="error-message">
  //               {formik.errors.data[index].variance_per}
  //             </div>
  //           )} */}
  //       </div>
  //     ),
  //   },
  //   // ... existing columns
  // ]; 
  const tableDatas = {
    columns,
    data,
  };

  // const validationSchema = Yup.object().shape({
  //   data: Yup.array().of(
  //     Yup.object().shape({
  //       start_dip: Yup.number()
  //         .typeError("Closing Amount must be a number")
  //         .required("Closing Amount is required"),
  //       bunkd_delivery_volume: Yup.number()
  //         .typeError("Opening Amount must be a number")
  //         .required("Opening Amount is required"),
  //       delivery_volume: Yup.number()
  //         .typeError("Total Amount must be a number")
  //         .required("Total Amount is required"),
  //     })
  //   ),
  // });

  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: handleSubmit,
    // validationSchema: validationSchema,
  });

  return (
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
  );
};

export default FuelDelivery;
