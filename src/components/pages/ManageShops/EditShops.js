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

const EditShops = (props) => {
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
        const response = await axiosInstance.get(`/shop/${id}`);
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

      formData.append("code", values.code);
      formData.append("shop_name", values.name);
      formData.append("status", values.status);
      formData.append("id", values.id);

      const postDataUrl = "/shop/update";
      const navigatePath = "/manageshops";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",

      status: "",
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Shop Name is required"),

      name: Yup.string()
        .required("Shop Name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Shop Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Shop Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      status: Yup.string().required("Shop Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name
  const inputClass = `form-control ${isInvalid}`;
  const handleBusinessTypeChange = (e) => {
    const selectedType = e.target.value;

    formik.setFieldValue("business_type", selectedType);
    setSelectedBusinessType(selectedType);
    const selectedTypeData = AddSiteData.business_types.find(
      (type) => type.name === selectedType
    );
    setSubTypes(selectedTypeData.sub_types);
  };

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div>
            <div className="page-header">
              <div>
                <h1 className="page-title">Edit Shops</h1>

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
                    linkProps={{ to: "/ManageShops" }}
                  >
                    Manage Shop
                  </Breadcrumb.Item>
                  <Breadcrumb.Item
                    className="breadcrumb-item active breadcrumds"
                    aria-current="page"
                  >
                    Edit Shop
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>

            <Row>
              <Col lg={12} xl={12} md={12} sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title as="h3">Edit Shop</Card.Title>
                  </Card.Header>

                  <div class="card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <Row>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label className="form-label mt-4" htmlFor="name">
                              Shop Name<span className="text-danger">*</span>
                            </label>
                            <input
                              id="name"
                              code="name"
                              type="text"
                              className={`input101 ${
                                formik.errors.name && formik.touched.name
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Shop Name"
                              onChange={formik.handleChange}
                              value={formik.values.name || ""}
                              
                            />
                            {formik.errors.name && formik.touched.name && (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label className="form-label mt-4" htmlFor="code">
                              Shop code<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`input101 ${
                                formik.errors.code && formik.touched.code
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="code"
                              name="code"
                              placeholder="Shop Code"
                              onChange={formik.handleChange}
                              value={formik.values.code || ""}
                              readOnly
                            />
                            {formik.errors.code && formik.touched.code && (
                              <div className="invalid-feedback">
                                {formik.errors.code}
                              </div>
                            )}
                          </div>
                        </Col>

                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label htmlFor="status" className="form-label mt-4">
                              Shop Status <span className="text-danger">*</span>
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
                              <option value="">Select Status</option>
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
                          to={`/manageshops/`}
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
      )}
    </>
  );
};
export default withApi(EditShops);
