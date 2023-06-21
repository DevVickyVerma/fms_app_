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

const ShopSales = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
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
        const response = await axiosInstance.get(
          `/shop-sale/list?site_id=${SiteID}&drs_date=${ReportDate}`
        );

        const { data } = response;
        if (data) {
            setData(data?.data?.listing ? data.data.listing : []);
          setis_editable(data?.data ? data.data : {});

          // Create an array of form values based on the response data
          const formValues = data?.data?.listing
          ? data.data.listing.map((item) => {
                return {
                  id: item.id,
                  charge_value: item.charge_value,
                  deduction_value: item.deduction_value,

                  // value_per: item.value_per ,
                  // Add other properties as needed
                };
              })
            : [];

          // Set the formik values using setFieldValue
          formik.setFieldValue("data", formValues);
          console.log(formValues, "formValues");
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [SiteID, ReportDate]);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    console.log(values.data);

    // Create a new FormData object
    const formData = new FormData();

    for (const obj of values.data) {
      const { id, charge_value } = obj;
      const charge_valueKey = `charge_value[${id}]`;

      formData.append(charge_valueKey, charge_value);
    }

    formData.append("site_id", SiteID);
    formData.append("drs_date", ReportDate);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/valet-coffee/update`,
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
  const columns = [
    {
        name: "CHARGE GROUPS",
        selector: (row) => row.charge_name,
        sortable: false,
        width: "50%",
        center: false,
        cell: (row) => {
          if (row.charge_name) {
            return (
              <span className="text-muted fs-15 fw-semibold text-center">
                {row.charge_name}
              </span>
            );
          }
          return null; // Return null if `row.charge_name` doesn't exist
        },
      },
      
      
    {
      name: "SALES AMOUNT",
      selector: (row) => row.charge_value,
      sortable: false,
      width: "50%",
      center: false,
      cell: (row, index) => (
        <div className="table-input-headdiv">
          <input
            type="number"
            id={`charge_value-${index}`}
            name={`data[${index}].charge_value`}
            className={
              editable?.is_editable ? "table-input " : "table-input readonly "
            }
            value={formik.values.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
        // ... existing columns

        {
            name: "DEDUCTION GROUPS",
            selector: (row) => row.deduction_name,
            sortable: false,
            width: "25%",
            center: false,
            cell: (row) =>  (
              row.deduction_name ? (
                <span className="text-muted fs-15 fw-semibold text-center">
                  {row.deduction_name}
                </span>
              ) : null
            ),
          },
          
          
          {
            name: "SALES AMOUNT",
            selector: (row) => row.deduction_value,
            sortable: false,
            width: "25%",
            center: false,
            cell: (row, index) => (
              <div className="table-input-headdiv">
                <input
                  type="number"
                  id={`deduction_value-${index}`}
                  name={`data[${index}].deduction_value`}
                  className={
                    editable?.is_editable ? "table-input " : "table-input readonly "
                  }
                  value={formik.values.data[index]?.deduction_value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  readOnly={editable?.is_editable ? false : true}
                />
                {/* Error handling code */}
              </div>
            ),
          },


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
                <h3 className="card-title">Shop Sales</h3>
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

export default ShopSales;
