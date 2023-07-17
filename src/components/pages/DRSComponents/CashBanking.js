import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FormModal } from "../../../data/Modal/Modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";

const CashBanking = (props) => {
  const { apidata, isLoading, error, getData, postData, SiteID, ReportDate } =
    props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState();
  const [Editdata, setEditData] = useState(false);
  const navigate = useNavigate();
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const [editable, setis_editable] = useState();
 
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("id", id);
        DeleteClient(formData);
      }
    });
  };
  const DeleteClient = async (formData) => {
    try {
      const response = await postData("drs/cash-banking/delete", formData);
      console.log(response, "response"); // Console log the response
      if (apidata.api_response === "success") {
        FetchTableData();
      }
    } catch (error) {
      handleError(error);
    }
  };



  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

    useEffect(() => {
      FetchTableData();
    }, []);


 



  const FetchTableData = async () => {
    try {
      const response = await getData(
    
        `/drs/cash-banking/?site_id=${SiteID}&drs_date=${ReportDate}`
       
      );
      console.log(response.data.data, "cards");

      if (response && response.data && response.data.data) {
        console.log(response.data.data.cash_value, "cawwwwwwrds");
        formik.setFieldValue("value", response?.data?.data?.cash_value);
        console.log(formik.values, "cash_value");
        setis_editable(response?.data?.data);
        console.log(response?.data?.data,"ssssis_editable")
        setData(response?.data?.data?.listing);
        setSearchvalue(response.data.data.cards);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "cards-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("card-edit");
  const isAddPermissionAvailable = permissionsArray?.includes("card-create");
  const isDeletePermissionAvailable = permissionsArray?.includes("card-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("cards-details");
  const isAssignPermissionAvailable = permissionsArray?.includes("card-assign");

  const validationSchema = Yup.object({
    reference: Yup.string().required("Refrence is required"),
    value: Yup.string()
    .required('Value is required')
    .test('is-number', 'Invalid value. Please enter a number', (value) =>
      /^-?\d*\.?\d+$/.test(value)
    ),
});

  const initialValues = {
    reference: "",
    value: "",
  };

const handleEdit =(item)=>{
    console.log(item,"item")
    formik.setValues(item);
    setEditData(true)
}


  //
  const handleSubmit = async (values, setSubmitting) => {
    const token = localStorage.getItem("token");
  
    try {
      const formData = new FormData();


      console.log(values.created_date,"editable")
  
      formData.append("reference", values.reference);
      formData.append("value", values.value);
  
      formData.append("site_id", SiteID);
      formData.append("drs_date", ReportDate);
      if (Editdata) {
        formData.append("id", values.id);
      }
      
  
      const postDataUrl = Editdata  ? "/drs/cash-banking/update" : "/drs/cash-banking/add";

  
      const response = await postData(postDataUrl, formData);
      console.log(response, "response"); // Console log the response
      if (apidata.api_response === "success") {
        setEditData(false)
        FetchTableData();
       
        // Handle your form submission logic here
        // ...
    
        // Reset the form values
        formik.resetForm();
      }
  
    //   if (response.ok ) {
    //     FetchTableData();
    //   }
  
     
    } catch (error) {
      console.log(error);
      // Set the submission state to false if an error occurs
    }
  };
  

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "10%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Reference",
      selector: (row) => [row.reference],
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.reference}</h6>
          </div>
        </div>
      ),
    },
    {
        name: "Value",
        selector: (row) => [row.value],
        sortable: true,
        width: "10%",
        cell: (row, index) => (
          <div className="d-flex">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold">{row.value}</h6>
            </div>
          </div>
        ),
      },
    {
        name: "Created Date",
        selector: (row) => [row.created_date],
        sortable: true,
        width: "20%",
        cell: (row, index) => (
          <div className="d-flex">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
            </div>
          </div>
        ),
      },
    {
        name: "Type",
        selector: (row) => [row.type],
        sortable: true,
        width: "20%",
        cell: (row, index) => (
          <div className="d-flex">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold">{row.type}</h6>
            </div>
          </div>
        ),
      },
   

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                 // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 me-2"
                onClick={() => handleEdit(row)}
              >
                <i>
                  <svg
                    className="table-edit"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11"
                onClick={() => handleDelete(row.id)}
              >
                <i>
                  <svg
                    className="table-delete"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
        </span>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };
  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
     
    }
  });

console.log(editable,"editable?.is_editable")

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
      {editable?.is_editable ? (
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Add Cash Banking</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col lg={6} xl={6} md={6} sm={6}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="reference">
                          Refrence<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${
                            formik.errors.reference && formik.touched.reference
                              ? "is-invalid"
                              : ""
                          }`}
                          id="reference"
                          name="reference"
                          placeholder="Refrence"
                          onChange={formik.handleChange}
                          value={formik.values.reference}
                        />
                        {formik.errors.reference &&
                          formik.touched.reference && (
                            <div className="invalid-feedback">
                              {formik.errors.reference}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={6} xl={6} md={6} sm={6}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="value">
                          Value<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${
                            formik.errors.value && formik.touched.value
                              ? "is-invalid"
                              : ""
                          }`}
                          id="value"
                          name="value"
                          placeholder="Value"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.value}
                        />
                         {formik.errors.value &&
                          formik.touched.value && (
                            <div className="invalid-feedback">
                              {formik.errors.value}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end">



              {   Editdata?    <button type="submit" className="btn btn-primary">
                      Update
                    </button>:    <button type="submit" className="btn btn-primary">
                      Add
                    </button>}
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>):""}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Cash Banking</h3>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive deleted-table">
                  <DataTableExtensions {...tableDatas}>
                    <DataTable
                      columns={columns}
                      data={data}
                      noHeader
                      defaultSortField="id"
                      defaultSortAsc={false}
                      striped={true}
                      // center={true}
                      persistTableHead
                      pagination
                      highlightOnHover
                      searchable={true}
                      className="dsrCpt"
                    />
                  </DataTableExtensions>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(CashBanking);
