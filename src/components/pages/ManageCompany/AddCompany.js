import { useEffect, useState } from "react";

import { Col, Row, Card, Form, FormGroup, Breadcrumb } from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, handleError } from "../../../Utils/ToastUtils";

const AddCompany = (props) => {
  const { isLoading, postData } = props;

  const navigate = useNavigate();
  const [dropdownValue, setDropdownValue] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );


  const [selectedItems, setSelectedItems] = useState(["1"]);

  const handleCheckboxChange = (checkboxId) => {
    if (selectedItems.includes(checkboxId)) {
      setSelectedItems(selectedItems.filter((item) => item !== checkboxId));
    } else {
      setSelectedItems([...selectedItems, checkboxId]);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchClientList();
    }

    console.clear();
  }, []);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchClientList = async () => {
    try {
      const response = await axiosInstance.get("/client/list");

      if (response.data.data.clients.length > 0) {
        // setData(response.data.data.sites);

        setDropdownValue(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
    }
  };

  const handleSubmit1 = async (values, setSubmitting) => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("start_month", values.start_month);
      formData.append("end_month", values.start_month);
      formData.append("website", values.website);
      formData.append("company_name", values.company_name);
      formData.append("company_details", values.company_details);
      formData.append("company_code", values.company_code);
      formData.append("address", values.address);
      formData.append("pc_code", values.pc_code);
      formData.append("sm_add_code", values.sm_add_code);
      formData.append("sm_sub_code", values.sm_sub_code);
      formData.append("bunkering_code", values.bunkering_code);
      formData.append("ma_option", JSON.stringify(selectedItems));
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", values.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
      }

      const postDataUrl = "/company/create";
      const navigatePath = "/managecompany";

      await postData(postDataUrl, formData, navigatePath);

      setSubmitting(false); // Set the submission state to false after the API call is completed
    } catch (error) {
      handleError(error);
      setSubmitting(false); // Set the submission state to false if an error occurs
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
      const isAddPermissionAvailable =
        permissionsArray?.includes("company-create");

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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Company</h1>

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
                  linkProps={{ to: "/managecompany" }}
                >
                  Manage Company
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Add Company
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Add Company</Card.Title>
                </Card.Header>
                <Formik
                  initialValues={{
                    company_code: "",
                    company_name: "",

                    address: "",
                    start_month: "",
                    end_month: "",

                    // start_month: "",

                    website: "",

                    client_id: "",
                    company_details: "",
                    pc_code: "",
                    sm_add_code: "",
                    sm_sub_code: "",
                    bunkering_code: "",
                  }}
                  validationSchema={Yup.object({
                    company_code: Yup.string()

                      .required("Company Code is required"),
                    company_details: Yup.string().required(
                      "Company Details is required"
                    ),
                    company_name: Yup.string()

                      .required("Company Name is required"),

                    address: Yup.string().required("Address is required"),

                    website: Yup.string().required("website is required"),

                    pc_code: Yup.string().required("Pc Code is required"),
                    sm_add_code: Yup.string().required(
                      "  Sm Add Code is required"
                    ),
                    sm_sub_code: Yup.string().required(
                      "  Sm Sub Code is required"
                    ),
                    bunkering_code: Yup.string().required(
                      " Bunkering Code is required"
                    ),
                    end_month: Yup.string().required(
                      " End Month is required"
                    ),

                    start_month: Yup.string().required(
                      " Start Month is required"
                    ),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    handleSubmit1(values, setSubmitting);
                  }}
                >
                  {({
                    handleSubmit,
                    isSubmitting,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className="form-label mt-4"
                                htmlFor="company_code"
                              >
                                Company Code
                                <span className="text-danger">*</span>
                              </label>

                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.company_code && touched.company_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="company_code"
                                name="company_code"
                                placeholder="Company Code"
                              />
                              <ErrorMessage
                                name="company_code"
                                component="div"
                                className="invalid-feedback"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="company_name"
                              >
                                Company Name
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.company_name && touched.company_name
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="company_name"
                                name="company_name"
                                placeholder="Company Name"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_name"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="address "
                                className=" form-label mt-4"
                              >
                                Address<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="textarea"
                                type="textarea"
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
                                htmlFor="website "
                                className=" form-label mt-4"
                              >
                                Website<span className="text-danger">*</span>
                              </label>
                              <Field
                                type="text"
                                autoComplete="off"
                                className={`input101 ${errors.website && touched.website
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="website"
                                name="website"
                                placeholder="Website"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="website"
                              />
                            </FormGroup>
                          </Col>
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
                              <Col lg={4} md={6}>
                                <FormGroup>
                                  <label
                                    htmlFor="client_id"
                                    className=" form-label mt-4"
                                  >
                                    Client<span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    as="select"
                                    className={`input101 ${errors.client_id && touched.client_id
                                      ? "is-invalid"
                                      : ""
                                      }`}
                                    id="client_id"
                                    name="client_id"
                                  >
                                    <option value=""> Select Client</option>
                                    {dropdownValue.clients &&
                                      dropdownValue.clients.length > 0 ? (
                                      dropdownValue.clients.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.client_name}
                                        </option>
                                      ))
                                    ) : (
                                      <option disabled>No clients</option>
                                    )}
                                  </Field>
                                  <ErrorMessage
                                    component="div"
                                    className="invalid-feedback"
                                    name="client_id"
                                  />
                                </FormGroup>
                              </Col>
                            )}
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="company_details"
                                className=" form-label mt-4"
                              >
                                Company Details
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="textarea"
                                type="textarea"
                                className={`input101 ${errors.company_details &&
                                  touched.company_details
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="company_details"
                                name="company_details"
                                placeholder="Company Details"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_details"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="start_month"
                                className=" form-label mt-4"
                              >
                                Start Month
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.start_month &&
                                  touched.start_month
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="start_month"
                                name="start_month"
                              >
                                <option value="">
                                  Select a  Start Month
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="start_month"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor=" end_month"
                                className=" form-label mt-4"
                              >
                                End Month
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.end_month &&
                                  touched.end_month
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="end_month"
                                name="end_month"
                              >
                                <option value="">
                                  Select a  End Month
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="end_month"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="bunkering_code"
                              >
                                Bunkering Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.bunkering_code &&
                                  touched.bunkering_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="bunkering_code"
                                name="bunkering_code"
                                placeholder=" Bunkering Code"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="bunkering_code"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="sm_sub_code"
                              >
                                Sm Sub Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.sm_sub_code && touched.sm_sub_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="sm_sub_code"
                                name="sm_sub_code"
                                placeholder="  Sm Sub Code"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="sm_sub_code"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="sm_add_code"
                              >
                                Sm Add Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.sm_add_code && touched.sm_add_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="sm_add_code"
                                name="sm_add_code"
                                placeholder="  Sm Add Code"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="sm_add_code"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                className=" form-label mt-4"
                                htmlFor="pc_code"
                              >
                                Pc Code
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                type="number"
                                autoComplete="off"
                                className={`input101 ${errors.pc_code && touched.pc_code
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="pc_code"
                                name="pc_code"
                                placeholder="Pc Code"
                              />
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="pc_code"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="email"
                                className=" form-label mt-4"
                              >
                                MA Options
                                <span className="text-danger">*</span>
                              </label>
                              <div className="mapotions">
                                <div className="maoptions-cover">
                                  <input
                                    type="checkbox"
                                    checked
                                    onChange={() => handleCheckboxChange("1")}
                                    className="form-check-input"
                                  />
                                  <span className="mx-2">Actual</span>
                                </div>

                                <br></br>
                                <div className="maoptions-cover">
                                  <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange("2")}
                                    className="form-check-input "
                                  />
                                  <span className="mx-2">Forecast</span>
                                </div>
                                <br></br>
                                <div className="maoptions-cover">
                                  <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange("3")}
                                    className="form-check-input"
                                  />
                                  <span className="mx-2">Variance</span>
                                </div>
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
                          to={`/managecompany/`}
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
        </div>
      </>
    </>
  );
};
export default withApi(AddCompany);
