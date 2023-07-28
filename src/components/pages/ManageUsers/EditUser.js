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
  FormFloating,
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

const EditUsers = (props) => {
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
  const [roleitems, setRoleItems] = useState("");
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }

  useEffect(() => {
    fetchClientList();
    FetchRoleList();
    console.clear();
  console.clear()  }, []);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 const { id } = useParams();
  const fetchClientList = async () => {
    
    try {
    
       const response = await axiosInstance.get(`/user/detail?id=${id}`);
      console.log(response.data.data);
      if (response) {
        formik.setValues(response.data.data);
        console.log(formik.values);
        console.log(response.data.data);
        setDropdownValue(response.data.data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("client_id", values.client_id);
      formData.append("created_date", values.created_date);
      formData.append("first_name", values.first_name);

      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("password", values.first_name);

      formData.append("full_name", values.full_name);
      formData.append("id", values.id);

      formData.append("role_id", values.role_id);

      const postDataUrl = "/update-client";
      const navigatePath = "/clients";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  // const handleSubmit = (values) => {

  //   console.log(formData, "formData");
  // };
  const formik = useFormik({
    initialValues: {
      created_date: "",
      email: "",

      first_name: "",
      id: "",
      role_id: "",
      last_name: "",

      status: "1",
    },
    validationSchema: Yup.object({
      created_date: Yup.string().required("Client Code is required"),
      email: Yup.string()
        .required(" Email is required")
        .email("Invalid email format"),

        role_id: Yup.string().required("Role is required"),
      first_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("First Name is required"),
      last_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Last Name is required"),

      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      // console.log(values);
    },
  });
  const FetchRoleList = async () => {
    try {
      const response = await getData("/role/list");

      if (response && response.data && response.data.data.roles) {
        setRoleItems(response.data.data.roles);
        console.log(response.data.data.roles[0].name, "response.data");
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleCheckBoxChange = (value) => {
    console.log(value, "value");
    const { ma_option } = formik.values;
    console.log(ma_option, "ma_option");

    let updateOptions = [];
    if (ma_option.includes("value")) {
      updateOptions.push("value");
      console.log(ma_option, "value");
    } else {
      updateOptions.pop(value);
      console.log(ma_option, "value");
    }

    formik.setFieldValue("ma_option", updateOptions);
  };

  return (
    <>
      {isLoading ? (
       <Loaderimg />
      ) : null}
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
              className="breadcrumb-item  breadcrumds"
              aria-current="page"
              linkAs={Link}
              linkProps={{ to: "/managecompany" }}
            >
              Manage User
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

            <div class="card-body">
              <form onSubmit={formik.handleSubmit}>
                <Row>
                
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="first_name">
                        First Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"  autoComplete="off"
                        className={`input101 ${
                          formik.errors.first_name && formik.touched.first_name
                            ? "is-invalid"
                            : ""
                        }`}
                        id="first_name"
                        name="first_name"
                        placeholder="Company Name"
                        onChange={formik.handleChange}
                        value={formik.values.first_name}
                      />
                      {formik.errors.first_name &&
                        formik.touched.first_name && (
                          <div className="invalid-feedback">
                            {formik.errors.first_name}
                          </div>
                        )}
                    </div>
                  </Col>
                  <Col lg={4} md={6}>
                    <label htmlFor="last_name" className="form-label mt-4">
                      Last Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"  autoComplete="off"
                      className={`input101 ${
                        formik.errors.last_name && formik.touched.last_name
                          ? "is-invalid"
                          : ""
                      }`}
                      id="last_name"
                      name="last_name"
                      placeholder=" Company Details"
                      onChange={formik.handleChange}
                      value={formik.values.last_name || ""}
                    />
                    {formik.errors.last_name && formik.touched.last_name && (
                      <div className="invalid-feedback">
                        {formik.errors.last_name}
                      </div>
                    )}
                  </Col>

                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="email">
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"  autoComplete="off"
                        className={`input101 ${
                          formik.errors.email && formik.touched.email
                            ? "is-invalid"
                            : ""
                        }`}
                        id="email"
                        name="email"
                        placeholder="Company Name"
                        // onChange={formik.handleChange}
                        value={formik.values.email || ""}
                        readonly
                      />
                      {formik.errors.email && formik.touched.email && (
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                  </Col>
            

               
                
                 
                
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="role_id" className="form-label mt-4">
                        Role
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.role_id && formik.touched.role_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="role_id"
                        name="role_id"
                        onChange={formik.handleChange}
                        value={formik.values.role_id}
                      >
                        <option value="">Select a Role</option>
                        {roleitems ? (
                          roleitems.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No Role</option>
                        )}
                      </select>
                      {formik.errors.role_id && formik.touched.role_id && (
                        <div className="invalid-feedback">
                          {formik.errors.role_id}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                <div className="text-end">
                  <Link
                    type="submit"
                    className="btn btn-danger me-2 "
                    to={`/users/`}
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

export default withApi(EditUsers);
