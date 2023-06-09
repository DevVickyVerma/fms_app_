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

import { Formik, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const Editsuppliers = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState();

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);
  function handleError(error) {
    if (error.response && error.response.Status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.Status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("id", id); // Use the retrieved ID from the URL

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/supplier/${id}`);
        if (response) {
          console.log(response.data.data);
          setEditSiteData(response.data.data);
          formik.setValues(response.data.data);
        }
      } catch (error) {
        handleError(error);
      }
    };

    try {
      fetchData();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      console.log(formData, "formData");

      formData.append("supplier_code", values.supplier_code);
      formData.append("supplier_name", values.supplier_name);
      formData.append("status", values.status);
      formData.append("id", values.id);

      const postDataUrl = "/supplier/update";
      const navigatePath = "/Managesuppliers";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      supplier_code: "",
      supplier_name: "",
      status:"1",
    },
    validationSchema: Yup.object({
      supplier_code: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Supplier code is required"),

      supplier_name: Yup.string()
        .required("Supplier Name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Supplier Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Supplier Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      status: Yup.string().required("Supplier Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <>
    {isLoading ? (
     <Loaderimg />
    ) : null}
        <>
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title">Edit Supplier</h1>

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
                    linkProps={{ to: "/managesuppliers" }}
                  >
                    Manage Supplier
                  </Breadcrumb.Item>
                  <Breadcrumb.Item
                    className="breadcrumb-item active breadcrumds"
                    aria-current="page"
                  >
                    Edit Supplier
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>

            <Row>
              <Col lg={12} xl={12} md={12} sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title as="h3">Edit Supplier</Card.Title>
                  </Card.Header>

                  <div class="card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <Row>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label htmlFor="supplier_name">
                              Supplier Name{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`input101 ${
                                formik.errors.supplier_name &&
                                formik.touched.supplier_name
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="supplier_name"
                              name="supplier_name"
                              placeholder="Supplier Name"
                              onChange={formik.handleChange}
                              value={formik.values.supplier_name || ""}
                            />
                            {formik.errors.supplier_name &&
                              formik.touched.supplier_name && (
                                <div className="invalid-feedback">
                                  {formik.errors.supplier_name}
                                </div>
                              )}
                          </div>
                        </Col>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label htmlFor="supplier_code">
                              Supplier Code
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              id="supplier_code"
                              name="supplier_code"
                              type="text"
                              className={`input101 readonly ${
                                formik.errors.supplier_code &&
                                formik.touched.supplier_code
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Supplier Code"
                              onChange={formik.handleChange}
                              value={formik.values.supplier_code || ""}
                              readOnly
                            />
                            {formik.errors.supplier_code &&
                              formik.touched.supplier_code && (
                                <div className="invalid-feedback">
                                  {formik.errors.supplier_code}
                                </div>
                              )}
                          </div>
                        </Col>

                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label htmlFor="status">
                              Status <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${
                                formik.errors.status && formik.touched.status
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="status"
                              name="status"
                              onChange={formik.handleChange}
                              value={formik.values.status}
                            >
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </select>
                            {formik.errors.status && formik.touched.status && (
                              <div className="invalid-feedback">
                                {formik.errors.status}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <div className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managesuppliers/`}
                        >
                          Cancel
                        </Link>

                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </>

    </>
  );
};
export default withApi(Editsuppliers);
