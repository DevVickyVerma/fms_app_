import { useEffect, useState } from 'react';

import { Col, Row, Card, Form, FormGroup, Breadcrumb } from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const AddSubBussiness = (props) => {
  const { isLoading, getData, postData } = props;
  const [dropdownValue, setDropdownValue] = useState([]);

  const { handleError } = useErrorHandler();


  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("business_sub_name", values.business_name);
      formData.append("slug", values.slug);
      formData.append("status", values.status);
      formData.append("business_type_id", values.business_type_id);

      const postDataUrl = "/business/add-sub-type";
      const navigatePath = "/sub-business";

      await postData(postDataUrl, formData, navigatePath);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    handleFetchData();
    
  }, []);

  const handleFetchData = async () => {
    try {
      const response = await getData("/business/types");

      if (response && response.data && response.data.data) {
        setDropdownValue(response.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };






  return <>
    {isLoading ? (
      <Loaderimg />
    ) : (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Add SubBusiness </h1>

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
                Manage SubBusiness 
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Add SubBusiness </Card.Title>
              </Card.Header>
              <Formik
                initialValues={{
                  business_name: "",
                  slug: "",
                  status: "1",
                  business_type_id: "",
                }}
                validationSchema={Yup.object({
                  business_name: Yup.string().required(
                    " Bussiness Name is required"
                  ),
                  business_type_id: Yup.string().required(
                    "Business Type is required"
                  ),

                  slug: Yup.string()
                    .required("Slug is required")
                    .matches(/^[a-zA-Z0-9_\- ]+$/, {
                      message: "Slug must not contain special characters",
                      excludeEmptyString: true,
                    }),

                  status: Yup.string().required("status is required"),
                })}
                onSubmit={(values) => {
                  handleSubmit1(values);
                }}
              >
                {({ handleSubmit, errors, touched }) => (
                  <Form onSubmit={handleSubmit}>
                    <Card.Body>
                      <Row>
                        <Col lg={6} md={12}>
                          <FormGroup>
                            <label
                              className=" form-label mt-4"
                              htmlFor="business_name"
                            >
                              Bussiness Name
                            </label>
                            <Field
                              type="text"
                              autoComplete="off"
                              // className="form-control"
                              className={`input101 ${errors.business_name && touched.business_name
                                ? "is-invalid"
                                : ""
                                }`}
                              id="business_name"
                              name="business_name"
                              placeholder="Bussiness Name"
                            />
                            <ErrorMessage
                              component="div"
                              className="invalid-feedback"
                              name="business_name"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6} md={12}>
                          <FormGroup>
                            <label
                              className=" form-label mt-4"
                              htmlFor="slug"
                            >
                              Slug
                            </label>
                            <Field
                              type="text"
                              autoComplete="off"
                              className={`input101 ${errors.slug && touched.slug
                                ? "is-invalid"
                                : ""
                                }`}
                              id="slug"
                              name="slug"
                              placeholder="Slug"
                            />
                            <ErrorMessage
                              name="slug"
                              component="div"
                              className="invalid-feedback"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col lg={6} md={12}>
                          <FormGroup>
                            <label
                              className=" form-label mt-4"
                              htmlFor="status"
                            >
                              Status
                            </label>
                            <Field
                              as="select"
                              className={`input101 ${errors.status && touched.status
                                ? "is-invalid"
                                : ""
                                }`}
                              id="status"
                              name="status"
                            >
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </Field>
                            <ErrorMessage
                              component="div"
                              className="invalid-feedback"
                              name="status"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={4} md={6}>
                          <FormGroup>
                            <label
                              className=" form-label mt-4"
                              htmlFor="business_type_id"
                            >
                              Business Type{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              className={`input101 ${errors.business_type_id &&
                                touched.business_type_id
                                ? "is-invalid"
                                : ""
                                }`}
                              id="business_type_id"
                              name="business_type_id"
                            >
                              <option value=""> Select Business Type</option>
                              {dropdownValue.data &&
                                dropdownValue.data.length > 0 ? (
                                dropdownValue.data.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.business_name}
                                  </option>
                                ))
                              ) : (
                                <option disabled={true}>No Business Type</option>
                              )}
                            </Field>
                            <ErrorMessage
                              component="div"
                              className="invalid-feedback"
                              name="business_type_id"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Footer className="text-end">
                      <button className="btn btn-primary me-2" type="submit">
                        Add
                      </button>
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/sub-business/`}
                      >
                        Cancel
                      </Link>
                    </Card.Footer>
                  </Form>
                )}
              </Formik>
            </Card>
          </Col>
        </Row>
      </>
    )}
  </>;
};

export default withApi(AddSubBussiness);
