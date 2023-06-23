import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  FormControl,
  ListGroup,
  Breadcrumb,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";

const SiteSettings = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [DeductionData, setDeductionData] = useState([]);
  const [BussinesModelData, setBussinesModelData] = useState([]);
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

  const { id } = useParams();

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
          `/site/get-setting-list/${id}`
        );

        const { data } = response;
        if (data) {
          // setData(data?.data ? data.data.charges : []);
          // setDeductionData(data?.data ? data.data.deductions : []);
          setBussinesModelData(data?.data ? data.data.business_models : []);
          setis_editable(data?.data ? data.data : {});

          const BussinesModelValues = data?.data?.business_models
            ? data.data.business_models.map((item) => ({
                id: item.charge_id,
                BussinesModelName_name: item.item_name,
                // value_per: item.value_per,
                // Add other properties as needed
              }))
            : [];

          formik.setFieldValue("business_models", BussinesModelValues);

          // Create an array of deduction form values based on the response data
          // const deductionFormValues = data?.data?.deductions
          //   ? data.data.deductions.map((item) => ({
          //       id: item.deduction_id,
          //       deduction_value: item.deduction_value,
          //       // Add other properties as needed
          //     }))
          //   : [];

          // formik.setFieldValue("deductions", deductionFormValues);

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
  }, [SiteID, ReportDate]);

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

    formData.append("site_id", SiteID);
    formData.append("drs_date", ReportDate);

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
        SuccessToast(responseData.message);
      } else {
        ErrorToast(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      console.log("Request Error:", error);
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
  // const chargesColumns = [
  //   {
  //     name: "CHARGE GROUPS",

  //     selector: (row) => row.charge_name,
  //     sortable: true,
  //     cell: (row, index) => (
  //       <div className="d-flex">
  //         <div className="ms-2 mt-0 mt-sm-2 d-block">
  //           <h6 className="mb-0 fs-14 fw-semibold">{row.charge_name}</h6>
  //         </div>
  //       </div>
  //     ),
  //   },

  //   {
  //     name: "	SALES AMOUNT",
  //     selector: (row) => row.charge_value,
  //     sortable: false,
  //     width: "50%",
  //     center: true,
  //     // Title: "CASH METERED SALES",
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="number"
  //           id={`charge_value-${index}`}
  //           name={`data[${index}].charge_value`}
  //           className={
  //             editable?.is_editable ? "table-input " : "table-input readonly "
  //           }
  //           value={formik.values?.data[index]?.charge_value}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //           readOnly={editable?.is_editable ? false : true}
  //         />
  //         {/* Error handling code */}
  //       </div>
  //     ),
  //   },
  // ];
  // const deductionsColumns = [
  //   {
  //     name: "DEDUCTION GROUPS",
  //     selector: (row) => row.deduction_name, // Update the selector to use a function
  //     sortable: true,
  //     cell: (row, index) => (
  //       <div className="d-flex">
  //         <div className="ms-2 mt-0 mt-sm-2 d-block">
  //           <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_name}</h6>
  //         </div>
  //       </div>
  //     ),
  //   },

  //   {
  //     name: "	SALES AMOUNT",
  //     selector: (row) => row.deduction_value,
  //     sortable: false,
  //     width: "50%",
  //     center: true,
  //     // Title: "CASH METERED SALES",
  //     cell: (row, index) => (
  //       <div>
  //         <input
  //           type="number"
  //           id={`deduction_value-${index}`}
  //           name={`deductions[${index}].deduction_value`}
  //           className={
  //             editable?.is_editable ? "table-input " : "table-input readonly "
  //           }
  //           value={formik.values?.deductions?.[index]?.deduction_value || ""}
  //           onChange={formik.handleChange}
  //           onBlur={formik.handleBlur}
  //           // readOnly={editable?.is_editable ? false : true}
  //         />
  //         {/* Error handling code */}
  //       </div>
  //     ),
  //   },
  // ];
  const BussinesModelColumn = [
    {
      name: "DEDUCTION GROUPS",
      selector: (row) => row.item_name,
      sortable: true,
      width: "40%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.item_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Charge Rent",
      selector: (row) => row.business_model_types[0].id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input type="radio" checked={row.business_model_types[0].checked} />
          </div>
        </div>
      ),
    },
    {
      name: "Pay Commission",
      selector: (row) => row.business_model_types[1].id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input type="radio" checked={row.business_model_types[1].checked} />
          </div>
        </div>
      ),
    },
    {
      name: "Direct Managed",
      selector: (row) => row.business_model_types[2].id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input type="radio" checked={row.business_model_types[2].checked} />
          </div>
        </div>
      ),
    },
    
    
  ];
  
  
  
  
  

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Site</h1>

            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item  breadcrumds"
                aria-current="page"
                linkAs={Link}
                linkProps={{ to: "/sites" }}
              >
                Manage Sites
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Site Settings
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Shop Sales</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <div className="table-responsive deleted-table">
                    <Row>
                      <Col lg={6} md={6}>
                        <DataTable
                          columns={BussinesModelColumn}
                          data={BussinesModelData}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </Col>
                    </Row>
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

export default withApi(SiteSettings);
