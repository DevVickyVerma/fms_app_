import { useEffect, useState } from 'react';

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
import { ReactMultiEmail } from "react-multi-email";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const EditClient = (props) => {
  const { isLoading, getData, postData } = props;
  const [LoadingFetchClientDetail, setLoadingFetchClientDetail] = useState(false);
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
    setLoadingFetchClientDetail(true)
    try {
      const response = await getData(`/client-detail?id=${id}`);

      if (response) {
        formik.setValues(response.data.data);
        setLoadingFetchClientDetail(false)

      } else {
        setLoadingFetchClientDetail(false)
        throw new Error("No data available in the response");
      }
      setLoadingFetchClientDetail(false)

    } catch (error) {
      setLoadingFetchClientDetail(false)

      console.error("API error:", error);
    }
    setLoadingFetchClientDetail(false)
  };



  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("client_code", values.client_code);
      formData.append("client_id", values.client_id);
      formData.append("created_date", values.created_date);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("address", values.address);

      if (
        values.fairbank_email !== null &&
        values.fairbank_email !== undefined
      ) {
        values.fairbank_email.forEach((client, index) => {
          formData.append(`fairbank_email[${index}]`, client);
        });
      }
      formData.append("password", values.first_name);
      formData.append("status", values.status);
      formData.append("loomis_status", values.loomis_status);
      formData.append("work_flow", values.work_flow);
      formData.append("full_name", values.full_name);
      formData.append("id", values.id);

      const postDataUrl = "/client/update";
      const navigatePath = "/clients";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };
  const formik = useFormik({
    initialValues: {
      client_code: "",
      client_name: "",
      created_date: "",
      email: "",

      first_name: "",
      id: "",
      fairbank_email: [],
      last_name: "",
      loomis_status: "",
      work_flow: "",
      address: "",
      status: "1",
    },
    validationSchema: Yup.object({
      client_code: Yup.string()

        .required("Client Code is required"),
      created_date: Yup.string().required("Client Code is required"),
      email: Yup.string()
        .required(" Email is required")
        .email("Invalid email format"),
      address: Yup.string().required("Address is required"),
      first_name: Yup.string()

        .required("First Name is required"),
      last_name: Yup.string()

        .required("Last Name is required"),
      loomis_status: Yup.string().required("Lommis Status is required"),
      status: Yup.string().required(" Status is required"),
      fairbank_email: Yup.array()
        .required("At least one email is required")
        .max(5, "Maximum of 5 emails allowed")
        .of(Yup.string().email("Invalid email format")),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleEmailChange = (newEmails) => {
    formik.setFieldValue("fairbank_email", newEmails);
  };
  const renderEmailTag = (email, index,) => (
    <div data-tag={true} key={index} className="renderEmailTag">
      {email}
      <span
        className="closeicon"
        data-tag-handle={true}
        onClick={() => {
          const newEmails = formik.values?.fairbank_email?.filter(
            (_, i) => i !== index
          );
          handleEmailChange(newEmails);
        }}
      >
        ×
      </span>
    </div>
  );

  return (
    <>
      {isLoading || LoadingFetchClientDetail ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit Client</h1>

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
                  linkProps={{ to: "/clients" }}
                >
                  Manage Clients
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Client
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Client</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="client_code"
                          >
                            Client Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="client_code"
                            name="client_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 readonly ${formik.errors.client_code &&
                              formik.touched.client_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Client Code"
                            onChange={formik.handleChange}
                            value={formik.values.client_code || ""}
                            readOnly={true}
                          />
                          {formik.errors.client_code &&
                            formik.touched.client_code && (
                              <div className="invalid-feedback">
                                {formik.errors.client_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="first_name"
                          >
                            First Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.first_name &&
                              formik.touched.first_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="first_name"
                            name="first_name"
                            placeholder="Company Name"
                            onChange={formik.handleChange}
                            value={formik.values.first_name}
                          />
                          {formik.errors.first_name &&
                            formik.touched.first_name && (
                              <div className="invalid-feedback">
                                {formik.errors.first_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <label htmlFor="last_name" className="form-label mt-4">
                          Last Name<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${formik.errors.last_name && formik.touched.last_name
                            ? "is-invalid"
                            : ""
                            }`}
                          id="last_name"
                          name="last_name"
                          placeholder=" Company Details"
                          onChange={formik.handleChange}
                          value={formik.values.last_name || ""}
                        />
                        {formik.errors.last_name &&
                          formik.touched.last_name && (
                            <div className="invalid-feedback">
                              {formik.errors.last_name}
                            </div>
                          )}
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="email">
                            Email<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.email && formik.touched.email
                              ? "is-invalid"
                              : ""
                              }`}
                            id="email"
                            name="email"
                            placeholder="Company Name"
                            // onChange={formik.handleChange}
                            value={formik.values.email || ""}
                            readonly={true}
                          />
                          {formik.errors.email && formik.touched.email && (
                            <div className="invalid-feedback">
                              {formik.errors.email}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label className="form-label mt-4" htmlFor="address">
                            Address<span className="text-danger">*</span>
                          </label>
                          <textarea
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.address && formik.touched.address
                              ? "is-invalid"
                              : ""
                              }`}
                            id="address"
                            name="address"
                            placeholder="Address"
                            onChange={formik.handleChange}
                            value={formik.values.address}
                          />
                          {formik.errors.address && formik.touched.address && (
                            <div className="invalid-feedback">
                              {formik.errors.address}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="status" className="form-label mt-4">
                            Status<span className="text-danger">*</span>
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

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="loomis_status"
                            className="form-label mt-4"
                          >
                            Lommis Status<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.loomis_status &&
                              formik.touched.loomis_status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="loomis_status"
                            name="loomis_status"
                            onChange={formik.handleChange}
                            value={formik.values.loomis_status}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          {formik.errors.loomis_status &&
                            formik.touched.loomis_status && (
                              <div className="invalid-feedback">
                                {formik.errors.loomis_status}
                              </div>
                            )}
                        </div>
                      </Col>
                      {/* Work FLow status Start */}
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="work_flow"
                            className="form-label mt-4"
                          >
                            Workflow Notification
                          </label>
                          <select
                            className={`input101 ${formik.errors.work_flow &&
                              formik.touched.work_flow
                              ? "is-invalid"
                              : ""
                              }`}
                            id="work_flow"
                            name="work_flow"
                            onChange={formik.handleChange}
                            value={formik.values.work_flow}
                          >
                            <option value="1">Enable</option>
                            <option value="0">Disable</option>
                          </select>
                          {formik.errors.work_flow &&
                            formik.touched.work_flow && (
                              <div className="invalid-feedback">
                                {formik.errors.work_flow}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <label
                          htmlFor="fairbank_email"
                          className="form-label mt-4"
                        >
                          Fairbank Email
                          <span className="text-danger">*</span>
                        </label>
                        <div className="email-input">
                          <ReactMultiEmail
                            emails={formik.values?.fairbank_email}
                            onChange={handleEmailChange}
                            getLabel={renderEmailTag}
                            minTags={1}
                            onBlur={() =>
                              formik.setFieldTouched("fairbank_email", true)
                            }
                          />
                          {formik.touched.fairbank_email &&
                            formik.errors.fairbank_email ? (
                            <div className="error">
                              {formik.errors.fairbank_email}
                            </div>
                          ) : null}
                        </div>
                        <span className="fairbank-title">
                          {" "}
                          * You can add multiple email IDs by using{" "}
                          <strong>,</strong>
                        </span>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/clients/`}
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

export default withApi(EditClient);
