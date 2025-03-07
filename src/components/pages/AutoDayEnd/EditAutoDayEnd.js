import React from "react";
import { useEffect, useState } from 'react';
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { ReactMultiEmail } from "react-multi-email";

const AddCompany = (props) => {
  const { isLoading, getData, postData } = props;
  const { id } = useParams();
  const UserPermissions = useSelector((state) => state?.data?.data?.data);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange1 = (event) => {
    setIsChecked(event.target.checked);
  };

  const FetchmannegerList = async () => {
    try {
      const response = await getData(`/site/auto-report/detail/${id}`);
      if (response && response.data) {
        setIsChecked(response.data?.data?.include_date === 1 ? true : false);
        formik.setValues({
          client_id: response.data?.data?.report_name,
          subject: response.data?.data?.subject,
          hit_type: response.data?.data?.hit_type,
          ccemails: response.data?.data?.cc_emails,
          to_emails: response.data?.data?.to_emails,
          site_id: response.data?.data?.site_id,
          include_date: response.data?.data?.site_id,
        });
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchmannegerList();
  }, [UserPermissions]);

  const handleSubmit = async () => {
    // event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      // formData.append("report_id", formik.values.client_id);
      formData.append("subject", formik.values.subject);
      formData.append("hit_type", formik.values.hit_type);
      formData.append("include_date", isChecked ? 1 : 0);

      if (
        formik.values.to_emails !== null &&
        formik.values.to_emails !== undefined
      ) {
        formik.values.to_emails.forEach((client, index) => {
          formData.append(`to_emails[${index}]`, client);
        });
      }
      if (
        formik.values.ccemails !== null &&
        formik.values.ccemails !== undefined
      ) {
        formik.values.ccemails.forEach((client, index) => {
          formData.append(`cc_emails[${index}]`, client);
        });
      }
      const postDataUrl = "/site/auto-report/update";
      const navigatePath = `/autodayend/${formik.values?.site_id}`;
      await postData(postDataUrl, formData, navigatePath);
    } catch (error) {
      console.error(error);
    }
  };
  const validationSchema = Yup.object({
    client_id: Yup.string().required("Report is required"),
    subject: Yup.string().required("Subject is required"),
    ccemails: Yup.array()
      .min(1, "At least one email is required")
      .of(
        Yup.string()
          .email("Invalid email address")
          .required("Email is required")
      ),
  });

  const formik = useFormik({
    initialValues: {
      client_id: "",
      subject: "",
      site_id: "",
      hit_type: "1",
      ccemails: [],
      to_emails: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });




  const handleToEmailChange = (newEmails) => {
    // Update Formik state when email input changes
    formik.setFieldValue("to_emails", newEmails);
  };

  const renderToEmailTag = (email, index, removeEmail) => (
    <div key={index} className="renderEmailTag">
      {email}
      <span className="closeicon" onClick={() => removeEmail(index)}>
        ×
      </span>
    </div>
  );
  const handleCCEmailChange = (newEmails) => {
    // Update Formik state when email input changes
    formik.setFieldValue("ccemails", newEmails);
  };

  const renderCCEmailTag = (email, index, removeEmail) => (
    <div key={index} className="renderEmailTag">
      {email}
      <span className="closeicon" onClick={() => removeEmail(index)}>
        ×
      </span>
    </div>
  );




  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Site Auto Report</h1>
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
                Edit Site Auto Report
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Card>
          <Card.Header>
            <Card.Title as="h3">Edit Site Auto Report</Card.Title>
          </Card.Header>
          <form onSubmit={(event) => formik.handleSubmit(event)}>
            <Card.Body>
              <Row>
                <Col lg={4} md={6}>
                  <div className="form-group">
                    <label htmlFor="client_id" className=" form-label mt-4">
                      Report<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`input101 readonly ${formik.errors.client_id && formik.touched.client_id
                        ? "is-invalid"
                        : ""
                        }`}
                      id="client_id"
                      name="client_id"
                      onChange={formik.handleChange}
                      value={formik.values.client_id}
                      readOnly={true}
                    />

                    {formik.errors.client_id && formik.touched.client_id && (
                      <div className="invalid-feedback">
                        {formik.errors.client_id}
                      </div>
                    )}
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form-group">
                    <label
                      htmlFor="hit_type"
                      className=" form-label mt-4"
                    >
                      Hit Type<span className="text-danger">*</span>
                    </label>
                    <select
                      as="select"
                      className={`input101 ${formik.errors.hit_type &&
                        formik.touched.hit_type
                        ? "is-invalid"
                        : ""
                        }`}
                      id="hit_type"
                      name="hit_type"
                      onChange={formik.handleChange}
                      value={formik?.values.hit_type}
                    >
                      <option value=""> Select Hit Type</option>
                      <option value='1'> Automated</option>
                      <option value='0'> Manual</option>

                    </select>
                    {formik.errors.hit_type &&
                      formik.touched.hit_type && (
                        <div className="invalid-feedback">
                          {formik.errors.hit_type}
                        </div>
                      )}
                  </div>
                </Col>
                <Col lg={4} md={6}>
                  <div className="form-group">
                    <label className="form-label mt-4" htmlFor="subject">
                      Subject<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      className={`input101 ${formik.errors.subject && formik.touched.subject
                        ? "is-invalid"
                        : ""
                        }`}
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      onChange={formik.handleChange}
                      value={formik.values.subject}
                    />
                    {formik.errors.subject && formik.touched.subject && (
                      <div className="invalid-feedback">
                        {formik.errors.subject}
                      </div>
                    )}
                  </div>
                </Col>

                <Col lg={4} md={6}>
                  <label htmlFor="fairbank_email" className="form-label mt-4">
                    To Emails
                    <span className="text-danger">*</span>
                  </label>
                  <div className="email-input">
                    <ReactMultiEmail
                      emails={formik.values.to_emails}
                      onChange={handleToEmailChange}
                      getLabel={renderToEmailTag}
                      maxTags={5}
                    />
                    {formik.errors.to_emails && formik.touched.to_emails && (
                      <div className="invalid-feedback">
                        {formik.errors.to_emails}
                      </div>
                    )}
                  </div>
                  <span className="fairbank-title">
                    * You can add multiple email IDs by using <strong>,</strong>
                  </span>
                </Col>
                <Col lg={4} md={6}>
                  <label htmlFor="fairbank_email" className="form-label mt-4">
                    CC Email
                    <span className="text-danger">*</span>
                  </label>
                  <div className="email-input">
                    <ReactMultiEmail
                      emails={formik.values.ccemails}
                      onChange={handleCCEmailChange}
                      getLabel={renderCCEmailTag}
                      maxTags={5}
                    />
                    {formik.errors.ccemails && formik.touched.ccemails && (
                      <div className="invalid-feedback">
                        {formik.errors.ccemails}
                      </div>
                    )}
                  </div>
                  <span className="fairbank-title">
                    * You can add multiple email IDs by using <strong>,</strong>
                  </span>
                </Col>

                <Col lg={4} md={6}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label mt-4">
                      Include Date
                    </label>
                    <div className="mapotions">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange1}
                        className="form-check-input"
                      />
                      <span className="ms-2">Yes</span>
                    </div>
                    {formik.errors.email && formik.touched.email && (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Link
                type="submit"
                className="btn btn-danger me-2 "
                to={`/autodayend/${formik.values?.site_id}`}
              >
                Cancel
              </Link>
              <button className="btn btn-primary me-2" type="submit">
                Submit
              </button>
            </Card.Footer>
          </form>
        </Card>
      </div>
    </>
  );
};
export default withApi(AddCompany);
