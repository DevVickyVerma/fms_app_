import { useEffect } from 'react';

import {
  Col,
  Row,
  Card,

  Breadcrumb,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const EditSiteNozzle = (props) => {
  const { isLoading, getData, postData } = props;
  const { id } = useParams();
  const { handleError } = useErrorHandler();
  useEffect(() => {
    try {
      FetchRoleList();
    } catch (error) {
      handleError(error);
    }
    
  }, [id]);

  const FetchRoleList = async () => {
    try {
      const response = await getData(`/site-nozzle/${id}`);

      if (response) {
        formik.setValues(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };



  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("code", values.code);
      formData.append("name", values.name);
      formData.append("status", values.status);
      formData.append("id", values.id);
      formData.append("site_id", values.site_id);
      formData.append("client_id", values.client_id);
      formData.append("site_pump_id", values.site_pump_id);
      formData.append("fuel_id", values.fuel_id);


      const postDataUrl = "/site-nozzle/update";
      const navigatePath = "/managesitenozzle";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };



  const formik = useFormik({
    initialValues: {
      name: "",

      status: "1",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Site Nozzle Name is required"),
      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Site Nozzle</h1>

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
                  linkProps={{ to: "/managesitenozzle" }}
                >
                  Manage Site Nozzles
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Site Nozzle
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Site Nozzle</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="name">
                            Site Nozzle Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.name && formik.touched.name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="name"
                            name="name"
                            placeholder="Site Nozzle Name"
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
                          <label
                            className=" form-label mt-4"
                            htmlFor="code"
                          >
                            Site Nozzle Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="code"
                            code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.code &&
                              formik.touched.code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Site Nozzle Code"
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
                          <label className=" form-label mt-4" htmlFor="status">
                            Site Nozzle Status{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.status && formik.touched.status
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
                        to={`/managesitenozzle/`}
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
export default withApi(EditSiteNozzle);
