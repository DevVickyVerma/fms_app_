import { useEffect, useState } from 'react';

import { Col, Row, Card, Breadcrumb } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const EditItems = (props) => {
  const { isLoading, getData, postData } = props;
  const [selectedItemTypeList, setselectedItemTypeList] = useState([]);
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
      const response = await getData(`/department-item/${id}`);

      if (response) {
        formik.setValues(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleItemData = async () => {
    try {
      const response = await getData("/item-type/list");

      const { data } = response;
      if (data) {
        setselectedItemTypeList(response.data.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    handleItemData();
    
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("id", values.id);
      formData.append("name", values.name);
      formData.append("status", values.status);
      formData.append("site_id", values.site_id);
      formData.append("item_type_id", values.item_type_id);
      formData.append("sage_purchase_code", values.sage_purchase_code);

      const postDataUrl = "/department-item/update";
      const navigatePath = "/manageitems";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      item_type_id: "",
      name: "",
      sage_purchase_code: "",
      status: "1",
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Item code is required"),

      name: Yup.string()
        .required("Item Name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Item Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Item Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),
      item_type_id: Yup.string().required("Item Type is required"),
      sage_purchase_code: Yup.string()
        .required("Sage Purchase Code is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Item Code must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Item Code must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

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
              <h1 className="page-title">Edit Department Item</h1>

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
                  linkProps={{ to: "/manageItems" }}
                >
                  Manage Items
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Department Item
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Department Item</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="name">
                            Item Name <span className="text-danger">*</span>
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
                            placeholder="Item Name"
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
                            htmlFor="item_type_id"
                            className="form-label mt-4"
                          >
                            Select Item Type
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.item_type_id &&
                              formik.touched.item_type_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="item_type_id"
                            name="item_type_id"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.item_type_id}
                          >
                            <option value="">Select a Item Type</option>
                            {selectedItemTypeList.length > 0 ? (
                              selectedItemTypeList.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.item_name}
                                </option>
                              ))
                            ) : (
                              <option disabled={true}>No Item Type</option>
                            )}
                          </select>
                          {formik.errors.item_type_id &&
                            formik.touched.item_type_id && (
                              <div className="invalid-feedback">
                                {formik.errors.item_type_id}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="code">
                            Item Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="code"
                            code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.code && formik.touched.code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Item Code"
                            onChange={formik.handleChange}
                            value={formik.values.code || ""}
                            readOnly={true}
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
                          <label className=" form-label mt-4" htmlFor="status">
                            Item Status <span className="text-danger">*</span>
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
                            className=" form-label mt-4"
                            htmlFor="sage_purchase_code"
                          >
                            Saga Purchase Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="sage_purchase_code"
                            code="name"
                            type="text"
                            autoComplete="off"
                            className={`input101  ${formik.errors.sage_purchase_code &&
                              formik.touched.sage_purchase_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Saga Purchase Code"
                            onChange={formik.handleChange}
                            value={formik.values.sage_purchase_code || ""}
                          />
                          {formik.errors.sage_purchase_code &&
                            formik.touched.sage_purchase_code && (
                              <div className="invalid-feedback">
                                {formik.errors.sage_purchase_code}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/manageitems/`}
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
export default withApi(EditItems);
