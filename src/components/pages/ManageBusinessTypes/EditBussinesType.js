import { useEffect } from 'react';
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const EditBussiness = (props) => {
  const { isLoading, getData, postData } = props;
  const { id } = useParams();
  const { handleError } = useErrorHandler();
  useEffect(() => {
    try {
      FetchRoleList();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);

  const FetchRoleList = async () => {
    const url = "/business/type";
    try {
      const response = await getData(url, id);

      if (response) {
        formik.setValues(response.data.data);
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

      formData.append("business_name", values.business_name);
      formData.append("slug", values.slug);
      formData.append("status", values.status);
      formData.append("id", values.id);

      const postDataUrl = "/business/update-type";
      const navigatePath = "/business";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      business_name: "",
      slug: "",
      status: "1",
    },
    validationSchema: Yup.object({
      business_name: Yup.string()

        .required("Business Type Name is required"),

      slug: Yup.string()
        .required("Slug is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Slug must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Slug must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      status: Yup.string().required("Status is required"),
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
              <h1 className="page-title">Edit Business Type</h1>

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
                  linkProps={{ to: "/business" }}
                > 
                  Manage Business Type
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Business Type
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Business Type</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="business_name"
                          >
                            Business Type Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="business_name"
                            business_name="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.business_name &&
                              formik.touched.business_name
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Business Type Name"
                            onChange={formik.handleChange}
                            value={formik.values.business_name || ""}
                          />
                          {formik.errors.business_name &&
                            formik.touched.business_name && (
                              <div className="invalid-feedback">
                                {formik.errors.business_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="slug">
                            Slug<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.slug && formik.touched.slug
                              ? "is-invalid"
                              : ""
                              }`}
                            id="slug"
                            name="slug"
                            placeholder="Slug"
                            onChange={formik.handleChange}
                            value={formik.values.slug || ""}
                          />
                          {formik.errors.slug && formik.touched.slug && (
                            <div className="invalid-feedback">
                              {formik.errors.slug}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label htmlFor="status" className="form-label mt-4">
                            Status <span className="text-danger">*</span>
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
                        type="sussbmit"
                        className="btn btn-danger me-2 "
                        to={`/business/`}
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
export default withApi(EditBussiness);
