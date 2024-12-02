import { useEffect } from "react";

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
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const Editdeductions = (props) => {
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
      const response = await getData(`/deduction/${id}`);

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

      formData.append("deduction_code", values.deduction_code);
      formData.append("deduction_name", values.deduction_name);
      formData.append("deduction_status", values.deduction_status);
      formData.append("id", values.id);

      const postDataUrl = "/deduction/update";
      const navigatePath = "/Managedeductions";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const formik = useFormik({
    initialValues: {
      deduction_code: "",
      deduction_name: "",
      deduction_status: "1",
    },
    validationSchema: Yup.object({
      deduction_code: Yup.string()

        .required("Deduction code is required"),

      deduction_name: Yup.string()
        .required("Deduction Name is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Deduction Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Deduction Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        ),

      deduction_status: Yup.string().required("Deduction Status is required"),
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
              <h1 className="page-title">Edit deduction</h1>

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
                  linkProps={{ to: "/managedeductions" }}
                >
                  Manage Deduction
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Deduction
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Deductions</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="deduction_name"
                          >
                            Deduction Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.deduction_name &&
                              formik.touched.deduction_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="deduction_name"
                            name="deduction_name"
                            placeholder="Deduction Name"
                            onChange={formik.handleChange}
                            value={formik.values.deduction_name || ""}
                          />
                          {formik.errors.deduction_name &&
                            formik.touched.deduction_name && (
                              <div className="invalid-feedback">
                                {formik.errors.deduction_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="deduction_code"
                          >
                            Deduction Code
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            id="deduction_code"
                            deduction_code="code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.deduction_code &&
                              formik.touched.deduction_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Deduction Code"
                            onChange={formik.handleChange}
                            value={formik.values.deduction_code || ""}
                            readOnly={true}
                          />
                          {formik.errors.deduction_code &&
                            formik.touched.deduction_code && (
                              <div className="invalid-feedback">
                                {formik.errors.deduction_code}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={6} md={6}>
                        <div className="form-group">
                          <label
                            className=" form-label mt-4"
                            htmlFor="deduction_status"
                          >
                            Deduction Status{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.deduction_status &&
                              formik.touched.deduction_status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="deduction_status"
                            name="deduction_status"
                            onChange={formik.handleChange}
                            value={formik.values.deduction_status}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.deduction_status &&
                            formik.touched.deduction_status && (
                              <div className="invalid-feedback">
                                {formik.errors.deduction_status}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/managedeductions/`}
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
export default withApi(Editdeductions);
