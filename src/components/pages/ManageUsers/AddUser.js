import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { MultiSelect } from "react-multi-select-component";
import { passwordTooltip } from "../../../Utils/commonFunctions/commonFunction";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const AddUsers = (props) => {
  const { isLoading, getData, postData } = props;
  const [roleitems, setRoleItems] = useState("");
  const [levelitems, setLevelItems] = useState("");
  const [selectRole, setselectRole] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+44");

  const { handleError } = useErrorHandler();

  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  const countryCodes = [
    { code: "+1", name: "United States", flag: "🇺🇸", shortName: "USA" },
    { code: "+44", name: "United Kingdom", flag: "🇬🇧", shortName: "UK" },
    { code: "+61", name: "Australia", flag: "🇦🇺", shortName: "AUS" },
    { code: "+49", name: "Germany", flag: "🇩🇪", shortName: "GER" },
    { code: "+33", name: "France", flag: "🇫🇷", shortName: "FRA" },
    { code: "+91", name: "India", flag: "🇮🇳", shortName: "IND" },
    { code: "+86", name: "China", flag: "🇨🇳", shortName: "CHN" },
    { code: "+55", name: "Brazil", flag: "🇧🇷", shortName: "BRA" },
    { code: "+81", name: "Japan", flag: "🇯🇵", shortName: "JPN" },
  ];

  const handleSubmit1 = async (values, setSubmitting) => {
    try {
      setSubmitting(true); // Set the submission state to true before making the API call

      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("phone_number", values.phone_number);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("role_id", values.role);
      formData.append("send_mail", isChecked);
      formData.append("country_code", selectedCountryCode);

      if (values?.level_id) {
        formData.append("level_id", values?.level_id);
      }

      localStorage.getItem("superiorRole") === "Client" &&
        formData.append("work_flow", values.work_flow);

      if (selected !== null && selected !== undefined) {
        selected.forEach((client, index) => {
          formData.append(`assign_client[${index}]`, client.value); // Use client.value to get the selected value
        });
      }

      const postDataUrl = "/user/add";
      const navigatePath = "/users";

      await postData(postDataUrl, formData, navigatePath);

      setSubmitting(false); // Set the submission state to false after the API call is completed
    } catch (error) {
      setSubmitting(false); // Set the submission state to false if an error occurs
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const SendMail = (event) => {
    setIsChecked(event.target.checked);
  };

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    FetchRoleList();
    FetchLevelList();
    handleFetchData();
  }, [UserPermissions]);

  const handleFetchData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setselectRole(response?.data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const FetchRoleList = async () => {
    try {
      const response = await getData("/roles");

      if (response && response.data && response.data.data) {
        setRoleItems(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const FetchLevelList = async () => {
    try {
      const response = await getData("/levels");

      if (response && response.data && response.data.data) {
        setLevelItems(response?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const [selected, setSelected] = useState([]);

  const options = selectRole?.map((site) => ({
    label: site?.full_name,
    value: site?.id,
  }));

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Add User</h1>

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
                linkProps={{ to: "/users" }}
              >
                Manage User
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Add User
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card style={{ minHeight: "700px" }}>
              <Card.Header>
                <Card.Title as="h3">Add User</Card.Title>
              </Card.Header>
              <Formik
                initialValues={{
                  first_name: "",
                  role: "",
                  level_id: "",
                  last_name: "",

                  email: "",
                  password: "",

                  send_mail: "1",
                  work_flow: "",
                  phone_number: "",
                  selected_country_code: "+44",
                }}
                validationSchema={Yup.object({
                  first_name: Yup.string().required("First Name is required"),

                  role: Yup.string().required("Role is required"),
                  last_name: Yup.string().required("Last Name is required"),

                  email: Yup.string()
                    .required(" Email is required")
                    .email("Invalid email format"),

                  password: Yup.string()
                    .required("Password is required")
                    .min(8, "Password must be at least 8 characters long")
                    .matches(
                      /[A-Z]/,
                      "Password must contain at least one uppercase letter"
                    )
                    .matches(
                      /\d/,
                      "Password must contain at least one numeric digit"
                    )
                    .matches(
                      /[!@#$%^&*(),.?":{}|<>]/,
                      "Password must contain at least one special character"
                    ),
                  // password: Yup.string().required("Password is required"),
                  // phone_number: Yup.string()
                  //   .matches(phoneRegExp, "Phone number is not valid")
                  //   .required("Phone Number is required"),
                  phone_number: Yup.string()
                    .matches(
                      /^[0-9]{10}$/,
                      "Phone number must be a 10-digit number"
                    )
                    .required("Phone Number is required"),
                  // selectedCountryCode: Yup.string().required("Country Code is required"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  handleSubmit1(values, setSubmitting);
                }}
              >
                {({ handleSubmit, errors, touched }) => (
                  <Form onSubmit={handleSubmit}>
                    <Card.Body>
                      <Row>
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
                              className={`input101 ${
                                errors.first_name && touched.first_name
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
                              className={`input101 ${
                                errors.last_name && touched.last_name
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
                              htmlFor="phone_number "
                              className=" form-label mt-4"
                            >
                              Phone Number<span className="text-danger">*</span>
                            </label>
                            <div className=" d-flex cursor-pointer">
                              <Field
                                as="select"
                                value={selectedCountryCode}
                                onChange={handleCountryCodeChange}
                                className="d-flex align-items-center disable-pre-number "
                                style={{ width: "100px", borderRadius: "0px" }}
                              >
                                {countryCodes.map((country, index) => (
                                  <option key={index} value={country.code}>
                                    {`${country.code} (${country.shortName})`}
                                  </option>
                                ))}
                              </Field>
                              <Field
                                type="number"
                                className={`input101 ${
                                  errors.phone_number && touched.phone_number
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="phone_number"
                                name="phone_number"
                                placeholder="Phone Number"
                                style={{ borderRadius: "0px" }}
                              />
                            </div>
                            <ErrorMessage
                              component="div"
                              className="custom-error-class"
                              name="phone_number"
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
                              className={`input101 ${
                                errors.email && touched.email
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
                              <OverlayTrigger
                                placement="right"
                                overlay={passwordTooltip}
                              >
                                <i className="ph ph-info pointer" />
                              </OverlayTrigger>
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="password"
                              className={`input101 ${
                                errors.password && touched.password
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
                            <label htmlFor="role" className=" form-label mt-4">
                              Role
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              className={`input101 ${
                                errors.role && touched.role ? "is-invalid" : ""
                              }`}
                              id="role"
                              name="role"
                            >
                              <option value="">Select a Role</option>
                              {roleitems ? (
                                roleitems.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.role_name}
                                  </option>
                                ))
                              ) : (
                                <option disabled={true}>No Role</option>
                              )}
                            </Field>
                            <ErrorMessage
                              component="div"
                              className="invalid-feedback"
                              name="role"
                            />
                          </FormGroup>
                        </Col>

                        <Col lg={4} md={6}>
                          <FormGroup>
                            <label
                              htmlFor="level_id"
                              className=" form-label mt-4"
                            >
                              Level
                            </label>
                            <Field
                              as="select"
                              className={`input101 ${
                                errors.level_id && touched.level_id
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="level_id"
                              name="level_id"
                            >
                              <option value="">Select a Level</option>
                              {levelitems ? (
                                levelitems.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled={true}>No Level</option>
                              )}
                            </Field>
                            <ErrorMessage
                              component="div"
                              className="invalid-feedback"
                              name="level_id"
                            />
                          </FormGroup>
                        </Col>

                        {localStorage.getItem("superiorRole") !== "Client" ? (
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label className="form-label mt-4">
                                Select Client
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
                            </FormGroup>
                          </Col>
                        ) : (
                          ""
                        )}
                        {localStorage.getItem("role") === "Client" ? (
                          <Col lg={4} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="work_flow"
                                className=" form-label mt-4"
                              >
                                Workflow Notification
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.work_flow && touched.work_flow
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="work_flow"
                                name="work_flow"
                              >
                                <option value="">Select a Work Flow</option>
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
                        ) : (
                          ""
                        )}

                        <Col lg={4} md={6}>
                          <FormGroup className="sendemail">
                            <label htmlFor="email" className="form-label mt-4">
                              Send Welcome Email
                            </label>
                            <div className="mapotions">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={SendMail}
                                className="form-check-input"
                              />
                              <span className="ms-2 mt-2">Yes</span>
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
                        to={`/users/`}
                      >
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary me-2 ">
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
    </>
  );
};

export default withApi(AddUsers);
