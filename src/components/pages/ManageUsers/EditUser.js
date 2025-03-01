import { useEffect, useState } from "react";

import { Col, Row, Card, Breadcrumb, FormGroup } from "react-bootstrap";

import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import FormikReactSelect from "../../Formik/FormikReactSelect";
import { MultiSelect } from "react-multi-select-component";

const EditUsers = (props) => {
  const { isLoading, getData, postData } = props;
  const [selectedCountryCode, setSelectedCountryCode] = useState("+44");
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [SelectedClient, setSelectedClient] = useState();
  const [roleItems, setRoleItems] = useState("");
  const [LoadingFetchUserDetail, setLoadingFetchUserDetail] = useState(false);
  const [selected, setSelected] = useState([]);

  const [levelitems, setLevelItems] = useState("");

  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
    formik.setFieldValue("country_code", e.target.value);
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

  const handleFetchData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setAddSiteData(response?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    fetchClientList();
    handleFetchData();
    FetchRoleList();
    FetchLevelList();
  }, []);

  const { id } = useParams();
  let combinedClientNames = [];
  const fetchClientList = async () => {
    setLoadingFetchUserDetail(true);
    try {
      const response = await getData(`/user/detail?id=${id}`);

      if (response) {
        formik.setValues(response.data.data);
        setSelected(response.data.data?.clients);

        setSelectedItems(combinedClientNames);
        setLoadingFetchUserDetail(false);
      }
    } catch (error) {
      setLoadingFetchUserDetail(false);
    }
    setLoadingFetchUserDetail(false);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("first_name", values.first_name);

      formData.append("last_name", values.last_name);
      formData.append("phone_number", values.phone_number);
      formData.append("is_main", values.is_main);

      formData.append("id", id);

      formData.append("role_id", values.role_id);

      if (values?.level_id) {
        formData.append("level_id", values?.level_id);
      }

      formData.append("country_code", selectedCountryCode);

      localStorage.getItem("superiorRole") === "Client" &&
        formData.append("work_flow", values.work_flow);

      formData.append("status", values.status);
      if (selected !== null && selected !== undefined) {
        selected?.forEach((client, index) => {
          formData.append(`assign_client[${index}]`, client?.value);
        });
      }

      const postDataUrl = "/user/update";
      const navigatePath = "/users";

      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };
  const formik = useFormik({
    initialValues: {
      first_name: "",
      id: "",
      role_id: "",
      level_id: "",
      last_name: "",
      work_flow: "",
      phone_number: "",
      selected_country_code: "+44",
      status: "1",
      is_main: "0",
    },
    validationSchema: Yup.object({
      role_id: Yup.string().required("Role is required"),
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      phone_number: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be a 10-digit number")
        .required("Phone Number is required"),
      status: Yup.string().required(" Status is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const FetchRoleList = async () => {
    try {
      const response = await getData("/role/list");

      if (response && response.data && response.data.data.roles) {
        setRoleItems(response.data.data.roles);
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

  return (
    <>
      {isLoading || LoadingFetchUserDetail ? <Loaderimg /> : null}
      <>
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Edit User</h1>

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
                  Edit User
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit User</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
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
                            className={`input101 ${
                              formik.errors.first_name &&
                              formik.touched.first_name
                                ? "is-invalid"
                                : ""
                            }`}
                            id="first_name"
                            name="first_name"
                            placeholder="First Name Name"
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
                          className={`input101 ${
                            formik.errors.last_name && formik.touched.last_name
                              ? "is-invalid"
                              : ""
                          }`}
                          id="last_name"
                          name="last_name"
                          placeholder="  Last Name"
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
                        <label
                          htmlFor="phone_number"
                          className="form-label mt-4"
                        >
                          Phone Number<span className="text-danger">*</span>
                        </label>
                        <div className=" d-flex cursor-pointer">
                          {/* <span className=" d-flex align-items-center disable-pre-number">
                            +44
                          </span> */}
                          <select
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
                          </select>
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${
                              formik.errors.phone_number &&
                              formik.touched.phone_number
                                ? "is-invalid"
                                : ""
                            }`}
                            id="phone_number"
                            name="phone_number"
                            placeholder="Phone Number"
                            onChange={formik.handleChange}
                            value={formik.values.phone_number || ""}
                            style={{ borderRadius: "0px" }}
                          />
                        </div>

                        {formik.errors.phone_number &&
                          formik.touched.last_name && (
                            <div className="custom-error-class">
                              {formik.errors.phone_number}
                            </div>
                          )}
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="status" className="form-label mt-4">
                            Status<span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.status && formik.touched.status
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
                          <label htmlFor="role_id" className="form-label mt-4">
                            Role
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.role_id && formik.touched.role_id
                                ? "is-invalid"
                                : ""
                            }`}
                            id="role_id"
                            name="role_id"
                            onChange={formik.handleChange}
                            value={formik.values.role_id}
                          >
                            <option value="">Select a Role</option>
                            {roleItems ? (
                              roleItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))
                            ) : (
                              <option disabled={true}>No Role</option>
                            )}
                          </select>
                          {formik.errors.role_id && formik.touched.role_id && (
                            <div className="invalid-feedback">
                              {formik.errors.role_id}
                            </div>
                          )}
                        </div>
                      </Col>

                      {localStorage.getItem("superiorRole") !== "Client" ? (
                        <Col lg={4} md={6}>
                          <FormGroup>
                            <label className="form-label mt-4">
                              Select Assign Client
                              <span className="text-danger">*</span>
                            </label>
                            <MultiSelect
                              value={selected}
                              onChange={setSelected}
                              labelledBy="Select Assign Client"
                              // disableSearch="true"
                              options={
                                AddSiteData?.data?.map((site) => ({
                                  label: site?.client_name,
                                  value: site?.id,
                                })) || []
                              }
                              showCheckbox="true"
                            />
                          </FormGroup>
                        </Col>
                      ) : (
                        ""
                      )}

                      {localStorage.getItem("role") === "Client" ? (
                        <Col lg={4} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="work_flow"
                              className="form-label mt-4"
                            >
                              Workflow Notification
                            </label>
                            <select
                              className={`input101 ${
                                formik.errors.work_flow &&
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
                      ) : (
                        ""
                      )}

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="level_id" className="form-label mt-4">
                            Level
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.level_id && formik.touched.level_id
                                ? "is-invalid"
                                : ""
                            }`}
                            id="level_id"
                            name="level_id"
                            onChange={formik.handleChange}
                            value={formik.values.level_id}
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
                          </select>
                          {formik.errors.level_id &&
                            formik.touched.level_id && (
                              <div className="invalid-feedback">
                                {formik.errors.level_id}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group d-flex align-items-center h-100 ms-3 mt-4">
                          <div className=" position-relative pointer  ms-4">
                            <input
                              type="checkbox"
                              id="is_main"
                              name="is_main"
                              checked={formik?.values?.is_main === 1}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "is_main",
                                  e.target.checked ? 1 : 0
                                );
                              }}
                              className="mx-1 form-check-input form-check-input-updated pointer"
                            />
                            <label
                              htmlFor="is_main"
                              className="p-0 m-0 pointer"
                            >
                              {" "}
                              Is Main Approver
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="text-end my-5 text-end-small-screen">
                      <Link
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/users/`}
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

export default withApi(EditUsers);
