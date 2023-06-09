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


  
  const EditBussiness = (props) => {
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
    if (error.response && error.response.charge_status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.charge_status_code === "403") {
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
        const response = await axiosInstance.get(`/charge/${id}`);
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
  
      formData.append("charge_code", values.charge_code);
      formData.append("charge_name", values.charge_name);
      formData.append("charge_status", values.charge_status);
      formData.append("id", values.id);

    const postDataUrl = "/charge/update";
    const navigatePath = "/managecharges";
  
    await postData(postDataUrl, formData, navigatePath);
  
   ; // Set the submission state to false after the API call is completed
  } catch (error) {
    handleError(error);
 ; // Set the submission state to false if an error occurs
  }
  };

  const formik = useFormik({
    initialValues: {
      charge_code: "",
      charge_name: "",

      charge_status: "1",
    },
    validationSchema: Yup.object({
      charge_code: Yup.string()
       
        .required("Charge code is required"),

        charge_name: Yup.string()
        .required("Charge Name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Charge Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Charge Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),


      charge_status: Yup.string().required(" Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

  // Use the isInvalid variable to conditionally set the class name
  
 

  return (
    <>
    {isLoading ? (
     <Loaderimg />
    ) : null}
      <>
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Charges</h1>

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
              Manage Charges
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Charges
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Edit Charges</Card.Title>
            </Card.Header>

            <div class="card-body">
              <form onSubmit={formik.handleSubmit}>
                <Row>
                
                  <Col lg={6} md={6}>
                    <div className="form-group">
                      <label  className=" form-label mt-4" htmlFor="charge_name">
                       Charges Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input101 ${
                          formik.errors.charge_name && formik.touched.charge_name
                            ? "is-invalid"
                            : ""
                        }`}
                        id="charge_name"
                        name="charge_name"
                        placeholder="Charge Code"
                        onChange={formik.handleChange}
                        value={formik.values.charge_name || ""}
                      />
                      {formik.errors.charge_name && formik.touched.charge_name && (
                        <div className="invalid-feedback">
                          {formik.errors.charge_name}
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col lg={6} md={6}>
                    <div className="form-group">
                      <label
                      className=" form-label mt-4"
                        htmlFor="charge_code"
                      >
                        Charges Code<span className="text-danger">*</span>
                      </label>
                      <input
                        id="charge_code"
                        charge_code="name"
                        type="text"
                        className={`input101 readonly ${
                          formik.errors.charge_code &&
                          formik.touched.charge_code
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Charge Code"
                        onChange={formik.handleChange}
                        value={formik.values.charge_code || ""}
                        readOnly
                      />
                      {formik.errors.charge_code &&
                        formik.touched.charge_code && (
                          <div className="invalid-feedback">
                            {formik.errors.charge_code}
                          </div>
                        )}
                    </div>
                  </Col>

                  <Col lg={6} md={6}>
                    <div className="form-group">
                      <label  className=" form-label mt-4" htmlFor="charge_status" >
                        Charge Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.charge_status && formik.touched.charge_status
                            ? "is-invalid"
                            : ""
                        }`}
                        id="charge_status"
                        name="charge_status"
                        onChange={formik.handleChange}
                        value={formik.values.charge_status}
                      >
                        
                        <option value="1">Active</option>
                            <option value="0">Inactive</option>
                      </select>
                      {formik.errors.charge_status && formik.touched.charge_status && (
                        <div className="invalid-feedback">
                          {formik.errors.charge_status}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="text-end">
                  <Link
                    type="sussbmit"
                    className="btn btn-danger me-2 "
                    to={`/managecharges/`}
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
}
export default withApi(EditBussiness);