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
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import withApi from "../../../Utils/ApiHelper";

const SiteSettings = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const navigate = useNavigate();

  const [Listcompany, setCompanylist] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [subTypes, setSubTypes] = useState([]);
  const [EditSiteData, setEditSiteData] = useState("");
  const [companyId, setCompanyId] = useState();

  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [ToleranceData, setToleranceData] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
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
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.clear();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (selectedSiteId) {
  //       try {
  //         const response = await getData(
  //           `/tolerance/?site_id=${formik.values.site_id}&client_id=${formik.values.client_id}&company_id=${formik.values.company_id}`
  //         );
  //         const { data } = response;
  //         if (data) {
  //           console.log(data);
  //           formik.setValues(data.data);
  //           // Process the API response and update your state or perform other actions
  //         }
  //       } catch (error) {
  //         console.error("API error:", error);
  //         // Handle error if the API call fails
  //       }
  //     }
  //   };

  //   if (selectedSiteId !== undefined) {
  //     fetchData();
  //   }
  // }, [selectedSiteId]);

  const handleSubmit = async (values) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues: {
      client_id: "",
    },
    validationSchema: Yup.object({
      client_id: Yup.string().required("Client  is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tolerances</h1>

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
              linkProps={{ to: "/sites" }}
            >
              Tolerances
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Tolerances</Card.Title>
            </Card.Header>

            <div class="card-body">
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col lg={4} md={6}>
                    <div className="form-group">
                      <label htmlFor="client_id" className="form-label mt-4">
                        Client
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`input101 ${
                          formik.errors.client_id && formik.touched.client_id
                            ? "is-invalid"
                            : ""
                        }`}
                        id="client_id"
                        name="client_id"
                     
                        onChange={formik.handleChange}
                      >
                        <option value="">Select a Client</option>
                        <option value="">User</option>
                        <option value="">value</option>
                    
                      </select>
                      {/* Replace this line with a self-closing tag */}
                      {formik.errors.client_id && formik.touched.client_id && (
                        <div className="invalid-feedback">
                          {formik.errors.client_id}
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="text-end">
                  <Link
                    type="sussbmit"
                    className="btn btn-danger me-2 "
                    to={`/sites/`}
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
  );
};
export default withApi(SiteSettings);
