import React from "react";
import { useEffect, useState } from 'react';
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

import { ReactMultiEmail } from "react-multi-email";

import { MultiSelect } from "react-multi-select-component";

const AddCompany = (props) => {
  const { isLoading, getData, postData } = props;
  const [dropdownValue, setDropdownValue] = useState([]);
  const [dropdowSite, setdropdowSite] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const UserPermissions = useSelector((state) => state?.data?.data);
  const FetchReportList = async (storedItemId) => {
    try {
      const response = await getData(`/client/reportlist?client_id=${storedItemId}`);
      if (response && response.data) {
        setDropdownValue(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const FetchSiteList = async () => {
    try {
      const response = await getData(`company/auto-report/site-list?company_id=${id}`);
      if (response && response.data) {
        setdropdowSite(response);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {

    // Retrieve the stored item ID from localStorage
    const storedItemId = localStorage.getItem('reportclientID');

    // Check if the stored item ID exists and is not null
    if (storedItemId) {
      FetchReportList(storedItemId);
      // Use the retrieved ID as needed
    }


    FetchSiteList();
  }, [UserPermissions]);
  const options =
    dropdowSite?.data?.data?.map((site) => ({
      label: site?.site_name,
      value: site?.id,
    })) || [];

  const handleSubmit = async (event, values) => {
    // event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("company_id", id);
      formData.append("report_id", formik.values.client_id);
      formData.append("subject", formik.values.subject);
      formData.append("include_date", isChecked);
      if (selected !== null && selected !== undefined) {
        selected.forEach((client, index) => {
          formData.append(`site_ids[${index}]`, client.value); // Use client.value to get the selected value
        });
      }
      if (emails !== null && emails !== undefined) {
        emails.forEach((client, index) => {
          formData.append(`to_emails[${index}]`, client);
        });
      }
      if (formik.values.ccemails !== null && formik.values.ccemails !== undefined) {
        formik.values.ccemails.forEach((client, index) => {
          formData.append(`cc_emails[${index}]`, client);
        });
      }
      const postDataUrl = "/company/auto-report/add";
      const navigatePath = `/companyautoreport/${id}`;

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
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
      ccemails: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange1 = (event) => {
    setIsChecked(event.target.checked);
  };
  const [emails, setEmails] = useState([]);

  const handleEmailChange = (newEmails) => {
    setEmails(newEmails);
  };

  const renderEmailTag = (email, index, removeEmail) => (
    <div data-tag key={index} className="renderEmailTag">
      {email}
      <span
        className="closeicon"
        data-tag-handle
        onClick={() => removeEmail(index)}
      >
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
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Company Auto Report</h1>

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
                  linkProps={{ to: `/companyautoreport/${id}` }}
                >
                  Company Auto Report
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Add Company Auto Report
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Company Auto Report</Card.Title>
                </Card.Header>

                <form onSubmit={(event) => formik.handleSubmit(event)}>
                  <Card.Body>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label className="form-label mt-4">
                            Select Sites
                            <span className="text-danger">*</span>
                          </label>

                          <MultiSelect
                            value={selected}
                            onChange={setSelected}
                            labelledBy="Select Client"
                            disableSearch="true"
                            options={options}
                            showCheckbox="false"
                          />
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className=" form-label mt-4"
                          >
                            Report<span className="text-danger">*</span>
                          </label>
                          <select
                            as="select"
                            className={`input101 ${formik.errors.client_id &&
                              formik.touched.client_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="client_id"
                            name="client_id"
                            onChange={formik.handleChange}
                          >
                            <option value=""> Select Report</option>
                            {dropdownValue.reports &&
                              dropdownValue.reports.length > 0 ? (
                              dropdownValue.reports.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.report_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Report</option>
                            )}
                          </select>
                          {formik.errors.client_id &&
                            formik.touched.client_id && (
                              <div className="invalid-feedback">
                                {formik.errors.client_id}
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
                        <label
                          htmlFor="fairbank_email"
                          className=" form-label mt-4"
                        >
                          To Email
                          <span className="text-danger">*</span>
                        </label>
                        <div className="email-input">
                          <ReactMultiEmail
                            emails={emails}
                            onChange={handleEmailChange}
                            getLabel={renderEmailTag}
                            maxTags={5} // You can set the maximum number of emails/tags
                          />

                          {formik.errors.email && formik.touched.email && (
                            <div className="invalid-feedback">
                              {formik.errors.email}
                            </div>
                          )}
                        </div>
                        <span className="fairbank-title">
                          {" "}
                          * You can add multiple email IDs by using{" "}
                          <strong>,</strong>
                        </span>
                      </Col>
                      <Col lg={4} md={6}>
                        <label
                          htmlFor="fairbank_email"
                          className="form-label mt-4"
                        >
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
                          {formik.errors.ccemails &&
                            formik.touched.ccemails && (
                              <div className="invalid-feedback">
                                {formik.errors.ccemails}
                              </div>
                            )}
                        </div>
                        <span className="fairbank-title">
                          * You can add multiple email IDs by using{" "}
                          <strong>,</strong>
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
                      to={`/companyautoreport/${id}`}
                    >
                      Cancel
                    </Link>
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
