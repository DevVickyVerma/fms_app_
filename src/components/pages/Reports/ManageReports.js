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

import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const ManageReports = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const [dropdownValue, setDropdownValue] = useState([]);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "supplier-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("supplier-edit");
  const isAddPermissionAvailable =
    permissionsArray?.includes("supplier-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("supplier-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("supplier-details");
  const isAssignPermissionAvailable =
    permissionsArray?.includes("supplier-assign");

  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();

  //   const handleSearch = (e) => {
  //     const value = e.target.value;
  //     setSearchText(value);

  //     const filteredData = searchvalue.filter((item) =>
  //       item.supplier_name.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setData(filteredData);
  //   };
  const names = [
    "Fuel Sales",
    "Bunkered Sales",
    "Fuel-Inventory",
    "Fuel Delivery",
    "Valet &  Coffee Sales",
    "Shop Sales",
    "Department Shop Sales",
    "Charges & Deduction",
    "Credit Card Banking",
    "Cash Banking",
    "Bank Deposits",
    "Department Shop Summary",
    "Summary",
  ]; // Array of names
  const names1 = [
    { id: 1, name: "Upload Bank Statement" },
    { id: 2, name: "Upload Fuel Purchases" },
    { id: 3, name: "Upload BP NCTT Statement" },
    { id: 4, name: "Upload Fairbank Statement" },
    { id: 5, name: "Upload BP Commission Statement" },
    { id: 6, name: "Upload Lottery & Phonecard Invoice data" },
    { id: 7, name: "Upload Coffee/Carwash Invoice data" },
    { id: 8, name: "Upload Sage Ledger (Sales)" },
    { id: 9, name: "Upload Safe Ledger (Budget)" },
    { id: 10, name: "Upload Vat Ledger" },
  ];

  const Cardvalue = (value) => {
    console.log(value, "CardValue");
  };

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      end_date: "",
      start_date: "",
      report: "",
    },

    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });
  const handleClick = (item) => {
    console.log("Clicked card:", item.name);
    console.log("Clicked card:", item.id);
  };

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Report</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
             Report
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col md={12} xl={12}>
          <Card>
           
            <Card.Header>
              <h3 className="card-title">Report</h3>
              </Card.Header>
              <Card.Body>
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={4} md={6}>
                    <div className="form-group d-flex">
                      <div>
                        <label htmlFor="client_id" className="form-label mx-4">
                          Client<span className="text-danger">*</span>
                        </label>
                      </div>
                      <select
                        className={`input101 ${
                          formik.errors.client_id && formik.touched.client_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="client_id"
                        name="client_id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.client_id}
                      >
                        <option value="">Select Client</option>
                        <option value="1">Active</option>
                                <option value="0">InActive</option>
                      </select>
                      {formik.errors.client_id && formik.touched.client_id && (
                        <div className="invalid-feedback">
                          {formik.errors.client_id}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group d-flex">
                      <div>
                        <label htmlFor="company_id" className="form-label mx-4">
                          Company<span className="text-danger">*</span>
                        </label>
                      </div>
                      <select
                        className={`input101 ${
                          formik.errors.company_id && formik.touched.company_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="company_id"
                        name="company_id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.company_id}
                      >
                        <option value="">Select Company</option>
                        <option value="1">Active</option>
                                <option value="0">InActive</option>
                      </select>
                      {formik.errors.client_id && formik.touched.client_id && (
                        <div className="invalid-feedback">
                          {formik.errors.client_id}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group d-flex">
                      <div>
                        <label htmlFor="site_id" className="form-label mx-4">
                          Site<span className="text-danger">*</span>
                        </label>
                      </div>
                      <select
                        className={`input101 ${
                          formik.errors.site_id && formik.touched.site_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="site_id"
                        name="site_id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.site_id}
                      >
                        <option value="">Select Site</option>
                        {/* {dropdownValue.clients &&
                        dropdownValue.clients.length > 0 ? (
                          dropdownValue.clients.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.company_name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Site</option>
                        )} */}
                        <option value="1">Active</option>
                                <option value="0">InActive</option>
                      </select>
                      {formik.errors.client_id && formik.touched.client_id && (
                        <div className="invalid-feedback">
                          {formik.errors.client_id}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group d-flex">
                      <div>
                        <label htmlFor="report" className="form-label mx-4">
                          Report<span className="text-danger">*</span>
                        </label>
                      </div>
                      <select
                        className={`input101 ${
                          formik.errors.report && formik.touched.report
                            ? "is-invalid"
                            : ""
                        }`}
                        id="report"
                        name="report"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.report}
                      >
                        <option value="">Select Report</option>
                        {/* {dropdownValue.clients &&
                        dropdownValue.clients.length > 0 ? (
                          dropdownValue.clients.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.company_name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Site</option>
                        )} */}
                        <option value="1">Active</option>
                                <option value="0">InActive</option>
                      </select>
                      {formik.errors.report && formik.touched.report && (
                        <div className="invalid-feedback">
                          {formik.errors.report}
                        </div>
                      )}
                    </div>
                  </Col>
               

                  {/* Repeat the above code for the remaining fields */}

                  <Col lg={4} md={6}>
                    <div className="form-group d-flex">
                      <div>
                        <label htmlFor="date" className="form-label mx-4">
                          From<span className="text-danger">*</span>
                        </label>
                      </div>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.start_date}
                      />
                      {formik.errors.start_date && formik.touched.start_date && (
                        <div className="invalid-feedback">
                          {formik.errors.start_date}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <div className="form-group d-flex">
                      <div>
                        <label htmlFor="end_date" className="form-label mx-4">
                          To<span className="text-danger">*</span>
                        </label>
                      </div>
                      <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.end_date}
                      />
                      {formik.errors.end_date && formik.touched.end_date && (
                        <div className="invalid-feedback">
                          {formik.errors.end_date}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="text-end">
                  <button type="reset" className="btn btn-danger me-2">
                    Reset
                  </button>
                  <button type="submit" className="btn btn-primary">
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
export default withApi(ManageReports);
