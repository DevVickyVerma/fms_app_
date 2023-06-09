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

const EditCards = (props) => {
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
    if (error.response && error.response.card_status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (
      error.response &&
      error.response.data.card_status_code === "403"
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
        const response = await axiosInstance.get(`/card/${id}`);
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

      formData.append("card_code", values.card_code);
      formData.append("card_name", values.card_name);
      formData.append("card_status", values.card_status);
      formData.append("id", values.id);

      const postDataUrl = "/card/update";
      const navigatePath = "/ManageCards";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      card_code: "",
      card_name: "",
      card_status: "",
    },
    validationSchema: Yup.object({
      card_code: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("card code is required"),

      card_name: Yup.string()
        .required("card_name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "card name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "card_name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      card_status: Yup.string().required("Card Status is required"),
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
    const selectedTypeData = AddSiteData.busines_types.find(
      (type) => type.name === selectedType
    );
    setSubTypes(selectedTypeData.sub_types);
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
                <h1 className="page-title">Edit Card</h1>

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
                    linkProps={{ to: "/managecards" }}
                  >
                    Manage Card
                  </Breadcrumb.Item>
                  <Breadcrumb.Item
                    className="breadcrumb-item active breadcrumds"
                    aria-current="page"
                  >
                    Edit Card
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>

            <Row>
              <Col lg={12} xl={12} md={12} sm={12}>
                <Card>
                  <Card.Header>
                    <Card.Title as="h3">Edit cards</Card.Title>
                  </Card.Header>

                  <div class="card-body">
                    <form onSubmit={formik.handleSubmit}>
                      <Row>
                      <Col lg={6} md={6}>
                          <div className="form-group">
                            <label
                              className="form-label mt-4"
                              htmlFor="card_name"
                            >
                              Card Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"  autocomplete="off"
                              className={`input101 ${
                                formik.errors.card_name &&
                                formik.touched.card_name
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="card_name"
                              name="card_name"
                              placeholder="Card Name"
                              onChange={formik.handleChange}
                              value={formik.values.card_name || ""}
                            />
                            {formik.errors.card_name &&
                              formik.touched.card_name && (
                                <div className="invalid-feedback">
                                  {formik.errors.card_name}
                                </div>
                              )}
                          </div>
                        </Col>
                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label
                              className="form-label mt-4"
                              htmlFor="card_code"
                            >
                              Card Code<span className="text-danger">*</span>
                            </label>
                            <input
                              id="card_code"
                              card_code="name"
                              type="text"  autocomplete="off"
                              className={`input101 ${
                                formik.errors.card_code &&
                                formik.touched.card_code
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Card Name"
                              onChange={formik.handleChange}
                              value={formik.values.card_code || ""}
                              readOnly
                            />
                            {formik.errors.card_code &&
                              formik.touched.card_code && (
                                <div className="invalid-feedback">
                                  {formik.errors.card_code}
                                </div>
                              )}
                          </div>
                        </Col>
                      

                        <Col lg={6} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="card_status"
                              className="form-label mt-4"
                            >
                              Card Status <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${
                                formik.errors.card_status &&
                                formik.touched.card_status
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="card_status"
                              name="card_status"
                              onChange={formik.handleChange}
                              value={formik.values.card_status}
                            >
                              
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </select>
                            {formik.errors.card_status &&
                              formik.touched.card_status && (
                                <div className="invalid-feedback">
                                  {formik.errors.card_status}
                                </div>
                              )}
                          </div>
                        </Col>
                      </Row>
                      <div className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managecards/`}
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
export default withApi(EditCards);
