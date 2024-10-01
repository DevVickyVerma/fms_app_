import React from "react";
import { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const FuelSales = (props) => {
  const { company_id, client_id, site_id, start_date, sendDataToParent } =
    props;

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
  const [editable, setis_editable] = useState();

  const [isLoading, setIsLoading] = useState(true);

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
        `/fuel-sale/list?site_id=${site_id}&drs_date=${start_date}`
      );

      const { data } = response;
      if (data) {
        setData(data?.data?.listing);
        setis_editable(data?.data);


        if (data?.data?.listing) {
          // formik.setValues(data?.data?.listing)
          formik.setFieldValue("data", data?.data?.listing);
        }

        // Set the formik values using setFieldValue
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false); // Set loading state to false after data fetching is complete
    }
  };
  useEffect(() => {
    if (start_date) {
      fetchData();
    }
    console.clear();
  }, [site_id, start_date]);

  const SubmitFuelSalesForm = async (values) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();

    formData.append("site_id", site_id);
    formData.append("drs_date", start_date);

    values?.data?.forEach((obj) => {
      const id = obj?.id;
      const grossValueKey = `gross_value[${id}]`;
      const discountKey = `discount[${id}]`;
      const nettValueKey = `nett_value[${id}]`;
      const adjValueKey = `adj_value[${id}]`;
      const salesVolumeKey = `sales_volume[${id}]`;


      if (id) {
        formData.append(grossValueKey, obj.gross_value.toString());
        formData.append(discountKey, obj.discount.toString());
        formData.append(nettValueKey, obj.nett_value.toString());
        formData.append(adjValueKey, obj.adj_value.toString());
        formData.append(salesVolumeKey, obj.sales_volume.toString());

      }


    });

    // formData.append('site_id',stationId? stationId:""); // Assuming stationId is your site_id
    // formData.append('drs_date', startDate); // Assuming startDate is your drs_date


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
        SuccessAlert(responseData.message);
        handleButtonClick();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        ErrorAlert(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const columns = [
    {
      name: "FUEL",
      selector: (row) => row?.fuel_name,
      sortable: false,
      width: "20%",
      center: false,
      cell: (row) => (
        <span className="text-muted coffe-item-category fw-semibold text-center">
          {row.fuel_name !== undefined ? `${row.fuel_name}` : ""}
        </span>
      ),
    },
    {
      name: "SALES VOLUME	",
      selector: (row) => row.sales_volume,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.sales_volume}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`sales_volume-${index}`}
              name={`data[${index}].sales_volume`}
              value={formik.values.data[index]?.sales_volume}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input  ${!row?.update_sales_volume ? 'readonly' : ''}`}
              readOnly={!row?.update_sales_volume}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "GROSS VALUE	",
      selector: (row) => row.gross_value,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.gross_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`gross_value-${index}`}
              name={`data[${index}].gross_value`}
              value={formik.values.data[index]?.gross_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input  ${!row?.update_gross_value ? 'readonly' : ''}`}
              readOnly={!row?.update_gross_value}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "DISCOUNT	",
      selector: (row) => row.discount,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.discount}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`discount-${index}`}
              name={`data[${index}].discount`}
              value={formik.values.data[index]?.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input  ${!row?.update_discount ? 'readonly' : ''}`}
              readOnly={!row?.update_discount}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "NETT VALUE",
      selector: (row) => row.nett_value,
      sortable: false,
      width: editable?.is_adjustable ? "16%" : "20%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row.nett_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`nett_value-${index}`}
              name={`data[${index}].nett_value`}
              value={formik.values.data[index]?.nett_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`table-input  ${!row?.update_nett_value ? 'readonly' : ''}`}
              readOnly={!row?.update_nett_value}
            />
            {/* Error handling code */}
          </div>
        ),
    },
  ];



  // Conditionally push the "ADJUSTMENT VALUE" column if `editable?.is_adjustable` is true
  if (editable?.is_adjustable) {
    columns?.push({
      name: "ADJUSTMENT VALUE",
      selector: (row) => row.adj_value,
      sortable: false,
      width: "16%",
      center: true,
      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <div>
            <input
              type="number"
              className={"table-input readonly"}
              value={row?.adj_value}
              readOnly
            />
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={`adj_value-${index}`}
              name={`data[${index}].adj_value`}
              className={`table-input ${!row?.edit_adj_value ? 'readonly' : ''}`}
              value={formik.values?.data?.[index]?.adj_value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly={!row?.edit_adj_value}
            />
          </div>
        ),
    });
  }


  const formik = useFormik({
    initialValues: {
      data: data,
    },
    onSubmit: (values) => {
      SubmitFuelSalesForm(values)
      // handlePostData(values);
    },
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
                {data?.length > 0 ? (
                  <>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="table-responsive deleted-table">
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
                      </div>

                      <div className="d-flex justify-content-end mt-3">
                        {editable?.is_editable && (
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                        )}
                      </div>
                    </form>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default FuelSales;

