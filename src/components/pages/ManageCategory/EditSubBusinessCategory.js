import { useEffect, useState } from 'react';

import { Col, Row, Card, Breadcrumb } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const EditBussiness = (props) => {
  const { isLoading, getData, postData } = props;
  const { handleError } = useErrorHandler();
  const [AddSiteData, setAddSiteData] = useState([]);


  useEffect(() => {
    const formData = new FormData();

    formData.append("id", id); // Use the retrieved ID from the URL


    const GetSiteData = async () => {
      try {
        const response = await getData("business/category");
        setAddSiteData(response.data);
        // if (response.data) {
        //   setAddSiteData(response.data.data);
        // }
      } catch (error) {
        handleError(error);
      }
    };
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    // console.clear()
    
  }, []);

  const { id } = useParams();

  useEffect(() => {
    try {
      FetchRoleList();
    } catch (error) {
      handleError(error);
    }
    
  }, [id]);

  const FetchRoleList = async () => {
    try {
      const response = await getData(`/business/subcategory/detail/${id}`);

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

      formData.append("sub_category_name", values.sub_category_name);
      formData.append("code", values.sub_category_code);
      formData.append("status", values.status);
      formData.append("id", id);
      formData.append("business_category_id", values.business_category_id);

      const postDataUrl = "/business/subcategory/update";
      const navigatePath = "/managesubbusinesscategory";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      sub_category_name: "",
      sub_category_code: "",
      business_category_id: "",
      status: "1",
    },
    validationSchema: Yup.object({
      sub_category_name: Yup.string()

        .required("SubBusiness  Category Name is required"),

      sub_category_code: Yup.string()
        .required("SubBusiness  Category Code is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Code must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Code must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      business_category_id: Yup.string().required(
        "SubBusiness  Category Type is required"
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
              <h1 className="page-title">Edit SubBusiness  Category</h1>

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
                  linkProps={{ to: "/managesubbusinesscategory" }}
                >
                  Manage SubBusiness Category
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit SubBusiness  Category
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit SubBusiness  Category</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="sub_category_name"
                          >
                            SubBusiness  Category Name
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="sub_category_name"
                            sub_category_name="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.sub_category_name &&
                              formik.touched.sub_category_name
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="SubBusiness  Category Name"
                            onChange={formik.handleChange}
                            value={formik.values.sub_category_name || ""}
                          />
                          {formik.errors.sub_category_name &&
                            formik.touched.sub_category_name && (
                              <div className="invalid-feedback">
                                {formik.errors.sub_category_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="sub_category_code"
                          >
                            SubBusiness  Category Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="sub_category_code"
                            code="sub_category_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.sub_category_code &&
                              formik.touched.sub_category_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="SubBusiness  Category Code"
                            onChange={formik.handleChange}
                            value={formik.values.sub_category_code}
                            readOnly={true}
                          />
                          {formik.errors.sub_category_code &&
                            formik.touched.sub_category_code && (
                              <div className="invalid-feedback">
                                {formik.errors.sub_category_code}
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
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="business_category_id"
                            className=" form-label mt-4"
                          >
                            Select Business Category
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.business_category_id &&
                              formik.touched.business_category_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="business_category_id"
                            name="business_category_id"
                            onChange={formik.handleChange}
                            value={formik.values.business_category_id}
                          >
                            <option value=""> Select Business Category</option>
                            {AddSiteData.data ? (
                              AddSiteData.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.category_name}
                                </option>
                              ))
                            ) : (
                              <option disabled={true}>No SubBusiness  Type</option>
                            )}
                          </select>
                          {formik.errors.business_category_id &&
                            formik.touched.business_category_id && (
                              <div className="invalid-feedback">
                                {formik.errors.business_category_id}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/managesubbusinesscategory/`}
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
