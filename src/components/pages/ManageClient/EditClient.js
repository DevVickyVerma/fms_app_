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

const EditClient = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const navigate = useNavigate();
  // const { id } = useParams();

  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState();

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);

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



  const { id } = useParams();

 

  useEffect(() => {
 
    try {
      FetchRoleList();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);


  const FetchRoleList = async () => {
   try {
      const response = await getData(`/client-detail?id=${id}`);

      if (response) {
        formik.setValues(response.data.data);
        console.log(formik.values);
        console.log(response.data.data);
        setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };


  const token = localStorage.getItem("token");
  const handleMaOptionChange = (value) => {
    const maOptionArray = [...formik.values.ma_option];
    const index = maOptionArray.indexOf(value);
  
    if (index === -1) {
      // If the value is not in the array, add it
      maOptionArray.push(value);
    } else {
      // If the value is in the array, remove it
      maOptionArray.splice(index, 1);
    }
  
    formik.setFieldValue("ma_option", maOptionArray);
  };
  




  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("client_code", values.client_code);
      formData.append("client_id", values.client_id);
      formData.append("created_date", values.created_date);
      formData.append("first_name", values.first_name);
      formData.append("financial_end_month", values.financial_end_month);
      formData.append("financial_start_month", values.financial_start_month);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("password", values.first_name);
      formData.append("status", values.status);
      formData.append("loomis_status", values.loomis_status);
      formData.append("work_flow", values.work_flow);
      formData.append("full_name", values.full_name);
      formData.append("id", values.id);
      formData.append("ma_option", values.ma_option);

      const postDataUrl = "/client/update";
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
      client_code: "",
      client_name: "",
      created_date: "",
      email: "",
      financial_end_month: "",
      financial_start_month: "",
      first_name: "",
      id: "",

      last_name: "",
      loomis_status: "",
      work_flow: "",
      ma_option: [],
      status: "1",
    },
    validationSchema: Yup.object({
      client_code: Yup.string()
        .max(20, "Must be 20 characters or less")
        // .min(10, "The client code must be 10 digits")
        .required("Client Code is required"),
      // client_name: Yup.string()
      //   .max(20, "Must be 20 characters or less")
      //   .required("Client Code is required"),
      created_date: Yup.string().required("Client Code is required"),
      email: Yup.string()
        .required(" Email is required")
        .email("Invalid email format"),
      financial_end_month: Yup.string().required(
        "Financial End Month is required"
      ),
      financial_start_month: Yup.string().required(
        "Financial Start Month is required"
      ),

      first_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("First Name is required"),
      last_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Last Name is required"),
      loomis_status: Yup.string().required("Lommis Status is required"),

      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      // console.log(values);
    },
  });

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
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Client</h1>

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
                  Manage Client
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Client
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Client</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="client_code"
                          >
                            Client Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="client_code"
                            name="client_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${
                              formik.errors.client_code &&
                              formik.touched.client_code
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Client Code"
                            onChange={formik.handleChange}
                            value={formik.values.client_code || ""}
                            readOnly
                          />
                          {formik.errors.client_code &&
                            formik.touched.client_code && (
                              <div className="invalid-feedback">
                                {formik.errors.client_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="first_name"
                          >
                            First Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.first_name &&
                              formik.touched.first_name
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
                          type="text"
                          autoComplete="off"
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
                        {formik.errors.last_name &&
                          formik.touched.last_name && (
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
                            type="text"
                            autoComplete="off"
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
                      {/* <Col lg={4} md={6}>
                    <div className="form-group">
                      <label className="form-label mt-4" htmlFor="password">
                        password<span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`input101 ${
                          formik.errors.password && formik.touched.password
                            ? "is-invalid"
                            : ""
                        }`}
                        id="password"
                        name="password"
                        placeholder="Company Name"
                        onChange={formik.handleChange}
                        value={formik.values.password || ""}
                      />
                      {formik.errors.password && formik.touched.password && (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>
                  </Col> */}

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="status" className="form-label mt-4">
                            Status<span className="text-danger">*</span>
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
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="financial_start_month"
                            className="form-label mt-4"
                          >
                            Financial Start Month
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.financial_start_month &&
                              formik.touched.financial_start_month
                                ? "is-invalid"
                                : ""
                            }`}
                            id="financial_start_month"
                            name="financial_start_month"
                            onChange={formik.handleChange}
                            value={formik.values.financial_start_month}
                          >
                            <option value="">
                              Select a Financial Start Month
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                          </select>
                          {formik.errors.financial_start_month &&
                            formik.touched.financial_start_month && (
                              <div className="invalid-feedback">
                                {formik.errors.financial_start_month}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="financial_end_month"
                            className="form-label mt-4"
                          >
                            Financial End Month
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.financial_end_month &&
                              formik.touched.financial_end_month
                                ? "is-invalid"
                                : ""
                            }`}
                            id="financial_end_month"
                            name="financial_end_month"
                            onChange={formik.handleChange}
                            value={formik.values.financial_end_month}
                          >
                            <option value="">
                              Select a Financial End Month
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                          </select>
                          {formik.errors.financial_end_month &&
                            formik.touched.financial_end_month && (
                              <div className="invalid-feedback">
                                {formik.errors.financial_end_month}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="loomis_status"
                            className="form-label mt-4"
                          >
                            Lommis Status<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.loomis_status &&
                              formik.touched.loomis_status
                                ? "is-invalid"
                                : ""
                            }`}
                            id="loomis_status"
                            name="loomis_status"
                            onChange={formik.handleChange}
                            value={formik.values.loomis_status}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.loomis_status &&
                            formik.touched.loomis_status && (
                              <div className="invalid-feedback">
                                {formik.errors.loomis_status}
                              </div>
                            )}
                        </div>
                      </Col>
                      {/* Work FLow status Start */}
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="work_flow"
                            className="form-label mt-4"
                          >
                            Work Flow
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.work_flow &&
                              formik.touched.work_flow
                                ? "is-invalid"
                                : ""
                            }`}
                            id="work_flow"
                            name="work_flow"
                            onChange={formik.handleChange}
                            value={formik.values.work_flow}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.work_flow &&
                            formik.touched.work_flow && (
                              <div className="invalid-feedback">
                                {formik.errors.work_flow}
                              </div>
                            )}
                        </div>
                      </Col>
                      {/* Work Flow Status End */}
                      <Col lg={4} md={6}>
                      <div>
                      <label
                            htmlFor="ma_option"
                            className="form-label mt-4"
                          >
                            MA Options
                            <span className="text-danger">*</span>
                          </label>
  <label>
    <input
      type="checkbox"
      name="ma_option"
      value="1"
      checked={formik.values.ma_option.includes("1")}
      onChange={() => handleMaOptionChange("1")}
    />
    Actual
  </label>
</div>
<div>
  <label>
    <input
      type="checkbox"
      name="ma_option"
      value="2"
      checked={formik.values.ma_option.includes("2")}
      onChange={() => handleMaOptionChange("2")}
    />
    Forecast
  </label>
</div>
<div>
  <label>
    <input
      type="checkbox"
      name="ma_option"
      value="3"
      checked={formik.values.ma_option.includes("3")}
      onChange={() => handleMaOptionChange("3")}
    />
    Variance
  </label>
</div>

                      </Col>
                    </Row>

                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/clients/`}
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

export default withApi(EditClient);
