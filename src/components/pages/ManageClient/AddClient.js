import { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  Breadcrumb,
  OverlayTrigger,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { ReactMultiEmail } from "react-multi-email";
import { passwordTooltip } from "../../../Utils/commonFunctions/commonFunction";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const AddClient = (props) => {
  const { isLoading, postData } = props;
  const { handleError } = useErrorHandler();

  const navigate = useNavigate();

  const handleSubmit1 = async (values, setSubmitting) => {
    try {
      setSubmitting(true); // Set the submission state to true before making the API call

      const formData = new FormData();
      formData.append("email", values.email);

      if (emails !== null && emails !== undefined) {
        emails.forEach((client, index) => {
          formData.append(`fairbank_email[${index}]`, client);
        });
      }
      formData.append("password", values.password);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("client_code", values.client_code);

      formData.append("lommis_status", values.lommis_status);
      formData.append("work_flow", values.work_flow);
      formData.append("address", values.address);

      formData.append("send_mail", isChecked);


      const postDataUrl = "/client/add";
      const navigatePath = "/clients";

      await postData(postDataUrl, formData, navigatePath);

      setSubmitting(false); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error);
      setSubmitting(false); // Set the submission state to false if an error occurs
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange1 = (event) => {
    setIsChecked(event.target.checked);
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
      const isAddPermissionAvailable =
        permissionsArray?.includes("client-create");

      if (permissionsArray?.length > 0) {
        if (isAddPermissionAvailable) {
        } else {
          navigate("/errorpage403");
        }
      }
    }
  }, [isPermissionsSet, permissionsArray, navigate]);

  const [emails, setEmails] = useState([]);

  const handleEmailChange = (newEmails) => {
    setEmails(newEmails);
  };

  const renderEmailTag = (email, index, removeEmail) => (
    <div data-tag={true} key={index} className="renderEmailTag">
      {email}
      <span
        className="closeicon"
        data-tag-handle={true}
        onClick={() => removeEmail(index)}
      >
        ×
      </span>
    </div>
  );

  return <>
    {isLoading ? <Loaderimg /> : null}
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Client</h1>

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
              Add Client
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Add Client</Card.Title>
            </Card.Header>
            <Formik
              initialValues={{
                client_code: "",
                first_name: "",
                role: "",



                last_name: "",
                email: "",
                fairbank_email: "",
                password: "",

                status: "1",

                lommis_status: "1",
                work_flow: "0",
                send_mail: "1",
                address: "",
              }}
              validationSchema={Yup.object({
                client_code: Yup.string()

                  .required("Client Code is required"),
                first_name: Yup.string()

                  .required("First Name is required"),

                lommis_status: Yup.string().required(
                  "Lommis Status is required"
                ),

                last_name: Yup.string().required("Last Name is required"),
                status: Yup.string().required(" Status is required"),

                address: Yup.string().required("Address is required"),

                email: Yup.string()
                  .required(" Email is required")
                  .email("Invalid email format"),

                // password: Yup.string().required("Password is required"),
                password: Yup.string()
                  .required(" Password is required")
                  .min(8, "Password must be at least 8 characters long")
                  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                  .matches(/\d/, "Password must contain at least one numeric digit")
                  .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit1(values, setSubmitting);
              }}
            >
              {({
                handleSubmit,
                errors,
                touched,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Card.Body>
                    <Row>
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            className="form-label mt-4"
                            htmlFor="client_code"
                          >
                            Client Code
                            <span className="text-danger">*</span>
                          </label>

                          <Field
                            type="text"
                            autoComplete="off"
                            className={`input101 ${errors.client_code && touched.client_code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="client_code"
                            name="client_code"
                            placeholder="Client Code"
                          />
                          <ErrorMessage
                            name="client_code"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label htmlFor="email" className=" form-label mt-4">
                            Email
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            autoComplete="off"
                            className={`input101 ${errors.email && touched.email
                              ? "is-invalid"
                              : ""
                              }`}
                            id="email"
                            name="email"
                            placeholder="Email"
                          />
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="email"
                          />
                        </FormGroup>
                      </Col>

                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            htmlFor="password "
                            className=" form-label mt-4"
                          >
                            Password
                            <OverlayTrigger placement="right" overlay={passwordTooltip}>
                              <i className="ph ph-info pointer me-1" />
                            </OverlayTrigger>
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="password"
                            className={`input101 ${errors.password && touched.password
                              ? "is-invalid"
                              : ""
                              }`}
                            id="password"
                            name="password"
                            placeholder="Password"
                          />
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="password"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            className=" form-label mt-4"
                            htmlFor="first_name"
                          >
                            First Name<span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            autoComplete="off"
                            className={`input101 ${errors.first_name && touched.first_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="first_name"
                            name="first_name"
                            placeholder="First Name"
                          />
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="first_name"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            htmlFor="last_name "
                            className=" form-label mt-4"
                          >
                            Last Name<span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            autoComplete="off"
                            className={`input101 ${errors.last_name && touched.last_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="last_name"
                            name="last_name"
                            placeholder="Last Name"
                          />
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="last_name"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            htmlFor="address"
                            className=" form-label mt-4"
                          >
                            Address<span className="text-danger">*</span>
                          </label>
                          <Field
                            // type="address"
                            as="textarea"
                            autoComplete="off"
                            className={`input101 ${errors.address && touched.address
                              ? "is-invalid"
                              : ""
                              }`}
                            id="address"
                            name="address"
                            placeholder="Address"
                          />

                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="address"
                          />
                        </FormGroup>
                      </Col>

                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            htmlFor="status"
                            className=" form-label mt-4"
                          >
                            Status<span className="text-danger">*</span>
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
                            htmlFor="lommis_status"
                            className=" form-label mt-4"
                          >
                            Lommis Status
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            className={`input101 ${errors.lommis_status && touched.lommis_status
                              ? "is-invalid"
                              : ""
                              }`}
                            id="lommis_status"
                            name="lommis_status"
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </Field>
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="lommis_status"
                          />
                        </FormGroup>
                      </Col>
                      {/* Work FLow status Start */}
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label
                            htmlFor="work_flow"
                            className=" form-label mt-4"
                          >
                            Workflow Notification
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <Field
                            as="select"
                            className={`input101 ${errors.work_flow && touched.work_flow
                              ? "is-invalid"
                              : ""
                              }`}
                            id="work_flow"
                            name="work_flow"
                          >
                            <option value="1">Enable</option>
                            <option value="0">Disable</option>
                          </Field>
                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="work_flow"
                          />
                        </FormGroup>
                      </Col>
                      {/* Work Flow Status End */}


                      <Col lg={4} md={6}>
                        <label
                          htmlFor="fairbank_email"
                          className=" form-label mt-4"
                        >
                          Fairbank Email
                          <span className="text-danger">*</span>
                        </label>
                        <div className="email-input">
                          <ReactMultiEmail
                            emails={emails}
                            onChange={handleEmailChange}
                            getLabel={renderEmailTag}
                            maxTags={5} // You can set the maximum number of emails/tags
                          />

                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="fairbank_email"
                          />
                        </div>
                        <span className="fairbank-title">
                          {" "}
                          * You can add multiple email IDs by using{" "}
                          <strong>,</strong>
                        </span>
                      </Col>

                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label htmlFor="email" className="form-label mt-4">
                            Send Welcome Email
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

                          <ErrorMessage
                            component="div"
                            className="invalid-feedback"
                            name="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Card.Body>

                  <Card.Footer className="text-end">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/clients/`}
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary me-2 "
                    // disabled={Object.keys(errors).length > 0}
                    >
                      Save
                    </button>
                  </Card.Footer>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </>
  </>;
};

export default withApi(AddClient);
