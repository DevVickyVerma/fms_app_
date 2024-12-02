import { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Card,

  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import withApi from '../../../Utils/ApiHelper';

const Settings = ({ getData }) => {
  const [isLoading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();


  const navigate = useNavigate();
  useEffect(() => {
    configsetting();
    
  }, []);

  const token = localStorage.getItem("token");
  const GetDetails = async () => {
    setLoading(true);
    try {
      const response = await getData(`/detail`);
      if (response) {
        localStorage.setItem("auto_logout", response?.data?.data?.auto_logout);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  const configsetting = async () => {
    setLoading(true);
    try {
      const response = await getData("/config-setting");
      const { data } = response;
      if (data) {
        formik2.setValues(data?.data); // Set field values for formik2

        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
    setLoading(false);
  };

  const initialValues2 = {
    date_format: "",
    pagination: "",
    auto_logout: "",
  };
  const validationSchema2 = Yup.object({
    date_format: Yup.string().required("Date Format is required"),

    pagination: Yup.string().required("Pagination is required"),
    auto_logout: Yup.string().required("Auto Logout is required"),
  });
  const handleSubmit2 = async (values) => {
    setLoading(true);
    const formData = new FormData();

    if (typeof values === "object") {
      const keys = Object.keys(values);
      const valuesArray = Object.values(values);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = valuesArray[i];
        const encodedKey = `key[${i}]`;
        const encodedValue = `value[${i}]`;

        formData.append(encodedKey, key);
        formData.append(encodedValue, value);
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/config-setting/update`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok) {
          SuccessAlert(data.message);
          GetDetails();
          navigate("/dashboard");
          setLoading(false);
        } else {
          ErrorAlert(data.message);
          setLoading(false);
        }
      } catch (error) {
        handleError(error);
        setLoading(false);
      }
    } else {
      console.error("Values must be an object.");
    }
  };
  const formik2 = useFormik({
    initialValues: initialValues2,
    validationSchema: validationSchema2,
    onSubmit: handleSubmit2,
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Settings</h1>
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
                  Settings
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <form onSubmit={formik2.handleSubmit}>
                <Card className="profile-edit">
                  <Card.Header>
                    <Card.Title as="h3">Other Settings</Card.Title>
                  </Card.Header>
                  <div className="card-body">
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="host">
                            Date Format<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik2.errors.date_format &&
                              formik2.touched.date_format
                              ? "is-invalid"
                              : ""
                              }`}
                            id="date_format"
                            name="date_format"
                            onChange={formik2.handleChange}
                            value={formik2.values.date_format}
                          >
                            <option value="">Select a date format</option>
                            <option value="Y-m-d">YYYY-MM-DD</option>
                            <option value="m-d-Y">MM-DD-YYYY</option>
                            <option value="d-m-Y">DD-MM-YYYY</option>
                          </select>
                          {formik2.errors.date_format &&
                            formik2.touched.date_format && (
                              <div className="invalid-feedback">
                                {formik2.errors.date_format}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="pagination"
                          >
                            Pagination<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik2.errors.pagination &&
                              formik2.touched.pagination
                              ? "is-invalid"
                              : ""
                              }`}
                            id="pagination"
                            name="pagination"
                            placeholder="Pagination"
                            onChange={formik2.handleChange}
                            value={formik2.values.pagination}
                          />
                          {formik2.errors.pagination &&
                            formik2.touched.pagination && (
                              <div className="invalid-feedback">
                                {formik2.errors.pagination}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="auto-logout"
                          >
                            Auto Logout<span className="text-danger">*</span>
                          </label>
                          <select
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik2.errors.auto_logout &&
                              formik2.touched.auto_logout
                              ? "is-invalid"
                              : ""
                              }`}
                            id="auto_logout"
                            name="auto_logout"
                            placeholder="auto_logout"
                            onChange={formik2.handleChange}
                            value={formik2.values.auto_logout}
                          >
                            <option value="">Select a Auto Logout Time</option>

                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                          </select>
                          {formik2.errors.auto_logout &&
                            formik2.touched.auto_logout && (
                              <div className="invalid-feedback">
                                {formik2.errors.auto_logout}
                              </div>
                            )}
                        </div>
                      </Col>

                      <div className="text-end">
                        <button
                          className="btn btn-primary me-2"
                          type="submit"
                          disabled={formik2.isSubmitting}
                        >
                          Update
                        </button>
                      </div>
                    </Row>
                  </div>
                </Card>
              </form>
            </Col>
          </Row>
        </div>
      </>
    </>
  )
}

export default withApi(Settings)