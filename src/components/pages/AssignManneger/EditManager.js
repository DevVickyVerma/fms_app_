import React, { useEffect, useState } from "react";

import { Col, Row, Card, Form, FormGroup, Breadcrumb } from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

const AddCompany = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const navigate = useNavigate();

  const [dropdownValue, setDropdownValue] = useState([]);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);
  const [selectedSiteList1, setSelectedSiteList1] = useState([]);
  const { id } = useParams();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [ReportsData, setReportsData] = useState([]);

  const FetchmannegerList = async () => {
    try {
      const response = await getData(`/site/manager/detail/${id}`);

      if (response && response.data) {
        console.log(response.data, "dddd");
        // setData(response.data.data.roles);
        setDropdownValue(response?.data?.data);

        setReportsData(response?.data?.data?.reports);

        formik.setFieldValue(
          "FormikreportsData",
          response?.data?.data?.reports
        );
        formik.setFieldValue("AllData", response?.data?.data);

        console.log(formik?.values?.AllData,"dsdsdsd");
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchmannegerList();
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  const ReportsColumn = [
    {
      name: "Select",
      selector: (row) => row.checked,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikreportsData[${index}].checked`}
            className="table-input"
            checked={
              formik.values?.FormikreportsData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Reports",
      selector: (row) => row.report_name,
      sortable: true,
      width: "80%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.report_name}</h6>
          </div>
        </div>
      ),
    },
  ];

  const handleSubmit = async (event, values) => {
    // event.preventDefault();

    console.log(formik.values, "user_id");
    try {
      const formData = new FormData();

      formData.append("user_id", "VmN0Ym1wMitQS3VaeUpKNUZhUUR6Zz09");
      formData.append("id", formik.values.AllData.id);
      const selectedReportsIds = [];
      const reports_models_valueKey = "reports";

      for (let i = 0; i < formik.values.FormikreportsData.length; i++) {
        const { id, checked } = formik.values.FormikreportsData[i];

        if (checked) {
          const reportIdKey = `${reports_models_valueKey}[${i}]`;
          const reportIdValue = id;
          const reportIdEntry = { [reportIdKey]: reportIdValue };
          selectedReportsIds.push(reportIdEntry);
        }
      }

      selectedReportsIds.forEach((reportIdEntry) => {
        const key = Object.keys(reportIdEntry)[0];
        const value = reportIdEntry[key];
        formData.append(key, value);
      });

      const postDataUrl = "/site/manager/update";
      const navigatePath = `/assignmanger/${formik.values.AllData.id}`;

      await postData(postDataUrl, formData, ); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      user_id: "",
    },

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit User</h1>

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
                  Edit User
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit User</Card.Title>
                </Card.Header>

                <form onSubmit={(event) => formik.handleSubmit(event)}>
                  <Card.Body>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label htmlFor="user_id" className=" form-label mt-4">
                            User<span className="text-danger">*</span>
                          </label>
                          <select
                            as="select"
                            className={`input101 ${
                              formik.errors.user_id && formik.touched.user_id
                                ? "is-invalid"
                                : ""
                            }`} 
                            id="user_id"
                            name="user_id"
                            onChange={formik.handleChange}
                            value={formik.values.user_id}
                          >
                            <option value=""> Select User</option>
                            {dropdownValue.users &&
                            dropdownValue.users.length > 0 ? (
                              dropdownValue.users.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.user_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No User</option>
                            )}
                          </select>
                          {formik.errors.user_id && formik.touched.user_id && (
                            <div className="invalid-feedback">
                              {formik.errors.user_id}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <Card.Header className="cardheader-table">
                          <h3 className="card-title">Reports</h3>
                        </Card.Header>
                        <div className="module-height-Manager">
                          <DataTable
                            columns={ReportsColumn}
                            data={ReportsData}
                            noHeader
                            defaultSortField="id"
                            defaultSortAsc={false}
                            striped={true}
                            persistTableHead
                            highlightOnHover
                            searchable={false}
                            responsive
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>

                  <Card.Footer className="text-end">
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
