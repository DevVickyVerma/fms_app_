import { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const AddSubBusinessCategory = (props) => {
  const { isLoading, postData, getData } = props;

  const navigate = useNavigate();
  const [AddSiteData, setAddSiteData] = useState([]);
  const { handleError } = useErrorHandler();
  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("sub_category_name", values.sub_category_name);
      formData.append("code", values.code);
      formData.append("status", values.status);
      formData.append("business_category_id", values.business_category_id);

      const postDataUrl = "/business/subcategory/add";
      const navigatePath = "/managesubbusinesscategory";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
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
      const isAddPermissionAvailable = permissionsArray?.includes(
        "business-category-create"
      );

      if (permissionsArray?.length > 0) {
        if (isAddPermissionAvailable) {
          // Perform action when permission is available
          // Your code here
        } else {
          // Perform action when permission is not available
          // Your code here
          navigate("/errorpage403");
        }
      } else {
        navigate("/errorpage403");
      }
    }
  }, [isPermissionsSet, permissionsArray]);


  useEffect(() => {

    const GetSiteData = async () => {
      try {
        const response = await getData("business/category");
        setAddSiteData(response.data);
      } catch (error) {
        handleError(error);
      }
    };
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    
  }, []);



  return <>
    {isLoading ? <Loaderimg /> : null}

    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add SubBusiness  Category</h1>

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
              Add SubBusiness  Category
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Add SubBusiness  Category</Card.Title>
            </Card.Header>
            <Formik
              initialValues={{
                sub_category_name: "",
                code: "",
                business_category_id: " ",
                status: "1",
              }}
              validationSchema={Yup.object({
                sub_category_name: Yup.string().required(
                  " SubBusiness  Category Name is required"
                ),

                code: Yup.string()
                  .required("SubBusiness  Category Code  is required")
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

                status: Yup.string().required("Status is required"),
                business_category_id: Yup.string().required(
                  "SubBusiness  Category Type is required"
                ),
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
                            htmlFor="sub_category_name"
                          >
                            SubBusiness  Category Name
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            autoComplete="off"
                            // className="form-control"
                            className={`input101 ${errors.sub_category_name &&
                              touched.sub_category_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="sub_category_name"
                            name="sub_category_name"
                            placeholder="SubBusiness  Category Name"
                          />
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="sub_category_name"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label
                            className=" form-label mt-4"
                            htmlFor="code"
                          >
                            SubBusiness  Category Code
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            autoComplete="off"
                            className={`input101 ${errors.code && touched.code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="code"
                            name="code"
                            placeholder="SubBusiness  Category Code"
                          />
                          <ErrorMessage
                            name="code"
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
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            className={`input101 ${errors.status && touched.status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="status"
                            name="Status"
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
                      <Col lg={6} md={12}>
                        <FormGroup>
                          <label
                            htmlFor="business_category_id"
                            className=" form-label mt-4"
                          >
                            Select Business Category
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            className={`input101 ${errors.business_category_id &&
                              touched.business_category_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="business_category_id"
                            name="business_category_id"
                          >
                            <option value="">
                              {" "}
                              Select Business Category
                            </option>
                            {AddSiteData.data ? (
                              AddSiteData.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.category_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No SubBusiness  Type</option>
                            )}
                          </Field>
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="business_category_id"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="text-end">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/managesubbusinesscategory/`}
                    >
                      Cancel
                    </Link>
                    <button className="btn btn-primary me-2" type="submit">
                      Add
                    </button>
                  </Card.Footer>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </div>

  </>;
};
export default withApi(AddSubBusinessCategory);
