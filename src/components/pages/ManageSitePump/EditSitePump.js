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
import { useSelector } from "react-redux";

const EditSitePump = (props) => {
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
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (
      error.response &&
      error.response.data.status_code === "403"
    ) {
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
      const response = await getData(`/site-pump/${id}`);

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

      formData.append("code", values.code);
      formData.append("name", values.name);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("id", values.id);

      const postDataUrl = "/site-pump/update";
      const navigatePath = "/managesitepump";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);

  useEffect(() => {
    if (isPermissionsSet) {
      const isEditPermissionAvailable =
        permissionsArray?.includes("charges-edit");

      if (permissionsArray?.length > 0) {
        if (isEditPermissionAvailable) {
          console.log(isEditPermissionAvailable, "EditPermissionAvailable");
        } else {
          navigate("/errorpage403");
        }
      } else {
        navigate("/errorpage403");
      }
    }
  }, [isPermissionsSet, permissionsArray]);

  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",

      status: "1",
    },
    validationSchema: Yup.object({
      code: Yup.string()
      .required("Site Pump Name is required"),

      // name: Yup.string()
      //   .required("Site Pump Name is required")
      //   .matches(/^[a-zA-Z0-9_\- ]+$/, {
      //     message: "Site Pump Name must not contain special characters",
      //     excludeEmptyString: true,
      //   })
      //   .matches(
      //     /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
      //     {
      //       message: "Site Pump Name must not have consecutive spaces",
      //       excludeEmptyString: true,
      //     }
      //   ),

      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Site Pump</h1>

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
                  linkProps={{ to: "/managecharges" }}
                >
                  Manage Site Pump
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Site Pump
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Site Pump</Card.Title>
                </Card.Header>

                <div class="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="name"
                          >
                            Site Pump Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.name &&
                              formik.touched.name
                                ? "is-invalid"
                                : ""
                            }`}
                            id="name"
                            name="name"
                            placeholder="Site Pump Name"
                            onChange={formik.handleChange}
                            value={formik.values.name || ""}
                          />
                          {formik.errors.name &&
                            formik.touched.name && (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="code"
                          >
                            Site Pump Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="code"
                            code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${
                              formik.errors.code &&
                              formik.touched.code
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Site Pump Code"
                            onChange={formik.handleChange}
                            value={formik.values.code || ""}
                            readOnly
                          />
                          {formik.errors.code &&
                            formik.touched.code && (
                              <div className="invalid-feedback">
                                {formik.errors.code}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="status"
                          >
                            Site Pump Status <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.status &&
                              formik.touched.status
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
                          {formik.errors.status &&
                            formik.touched.status && (
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
                        to={`/managesitepump/`}
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
export default withApi(EditSitePump);
