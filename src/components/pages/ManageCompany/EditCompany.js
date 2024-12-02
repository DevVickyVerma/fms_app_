import { useEffect, useState } from 'react';
import { Col, Row, Card, Breadcrumb } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const EditCompany = (props) => {
  const { handleError } = useErrorHandler();
  const { isLoading, getData,postData } = props;
  const navigate = useNavigate();
  const [dropdownValue, setDropdownValue] = useState([]);

  useEffect(() => {
    const Company_Client_id = localStorage.getItem("Company_Client_id");
    const Company_id = localStorage.getItem("Company_id");

    const formData = new FormData();

    formData.append("client_id", Company_Client_id);
    formData.append("company_id", Company_id);


    const fetchData = async () => {
      try {
        const response = await postData("/company/detail", formData);
        if (response) {
          // formik.setFieldValue("company_code", response?.data?.data?.company_code);
          formik.setValues(response?.data);
          console.log(response?.data, "response?.data?.data");
        }
      } catch (error) {
        handleError(error);
      }
    };

    try {
      fetchData();
    } catch (error) {
      handleError(error);
    }
    
  }, []);


  useEffect(() => {
    if (localStorage.getItem("superiorRole") !== "Client") {
      handleFetchData();
    }

    
  }, []);


  const handleFetchData = async () => {
    try {
      const response = await getData("/client/list");

      if (response && response.data && response.data.data) {
        setDropdownValue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleMaOptionChange = (value) => {
    const maOptionArray = [...formik.values.ma_option];
    const index = maOptionArray.indexOf(value);

    if (index === -1) {
      // If the value is not in the array, add it
      maOptionArray.push(value);
    } else {
      // If the value is in the array, remove it
      maOptionArray.splice(index, 1);
    }

    formik.setFieldValue("ma_option", maOptionArray);
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const Company_id = localStorage.getItem("Company_id");
    const formData = new FormData();

    // Iterate over formik.values and convert null to empty strings
    for (const [key, value] of Object.entries(formik.values)) {
      const convertedValue = value === null ? "" : value;
      formData.append(key, convertedValue);
    }
    formData.append("company_id", Company_id);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/company/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        SuccessAlert(data.message);
        navigate("/managecompany");
      } else {
        ErrorAlert(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      company_code: "",
      company_name: "",
      address: "",
      end_month: "",
      start_month: "",
      pc_code: "",
      sm_add_code: "",
      sm_sub_code: "",
      bunkering_code: "",
      ma_option: [],
      website: "",
      client_id: "",
      company_details: "",
    },
    validationSchema: Yup.object({
      company_code: Yup.string()

        .required("Company Code is required"),
      company_details: Yup.string().required("Company Details is required"),
      company_name: Yup.string()

        .required("Company Name is required"),

      address: Yup.string().required("Address is required"),

      website: Yup.string().required("website is required"),
      end_month: Yup.string().required(
        " End Month is required"
      ),
      start_month: Yup.string().required(
        " Start Month is required"
      ),
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
              <h1 className="page-title">Edit Company</h1>

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
                  Manage Companies
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  Edit Company
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card>
                <Card.Header>
                  <Card.Title as="h3">Edit Company</Card.Title>
                </Card.Header>

                <div className="card-body">
                  <form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="company_code"
                          >
                            Company Code<span className="text-danger">*</span>
                          </label>
                          <input
                            id="company_code"
                            name="company_code"
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.company_code &&
                              formik.touched.company_code
                              ? "is-invalid"
                              : ""
                              }`}
                            placeholder="Company Code"
                            onChange={formik.handleChange}
                            value={formik.values?.company_code}
                          />
                          {formik.errors.company_code &&
                            formik.touched.company_code && (
                              <div className="invalid-feedback">
                                {formik.errors.company_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="company_name"
                          >
                            Company Name<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.company_name &&
                              formik.touched.company_name
                              ? "is-invalid"
                              : ""
                              }`}
                            id="company_name"
                            name="company_name"
                            placeholder="Company Name"
                            onChange={formik.handleChange}
                            value={formik.values?.company_name}
                          />
                          {formik.errors.company_name &&
                            formik.touched.company_name && (
                              <div className="invalid-feedback">
                                {formik.errors.company_name}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <label
                          htmlFor="company_details"
                          className="form-label mt-4"
                        >
                          Company Details<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className={`input101 ${formik.errors.company_details &&
                            formik.touched.company_details
                            ? "is-invalid"
                            : ""
                            }`}
                          id="company_details"
                          name="company_details"
                          placeholder=" Company Details"
                          onChange={formik.handleChange}
                          value={formik.values?.company_details}
                        />
                        {formik.errors.company_details &&
                          formik.touched.company_details && (
                            <div className="invalid-feedback">
                              {formik.errors.company_details}
                            </div>
                          )}
                      </Col>
                      {localStorage.getItem("superiorRole") !== "Client" && (
                        <Col lg={4} md={6}>
                          <div className="form-group">
                            <label
                              htmlFor="client_id"
                              className="form-label mt-4"
                            >
                              Client <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`input101 ${formik.errors.client_id &&
                                formik.touched.client_id
                                ? "is-invalid"
                                : ""
                                }`}
                              id="client_id"
                              name="client_id"
                              onChange={formik.handleChange}
                              value={formik.values?.client_id}
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
                                <option disabled={true}>No clients</option>
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
                      )}
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label htmlFor="address" className="form-label mt-4">
                            Address<span className="text-danger">*</span>
                          </label>
                          <textarea
                            className={`input101 ${formik.errors.address && formik.touched.address
                              ? "is-invalid"
                              : ""
                              }`}
                            id="address"
                            name="address"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.address}
                            placeholder=" Address"
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
                          <label htmlFor="website" className="form-label mt-4">
                            Website
                          </label>
                          <input
                            type="text"
                            autoComplete="off"
                            className={`input101 ${formik.errors.website && formik.touched.website
                              ? "is-invalid"
                              : ""
                              }`}
                            id="website"
                            name="website"
                            placeholder="website"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values?.website}
                          />
                          {formik.errors.website && formik.touched.website && (
                            <div className="invalid-feedback">
                              {formik.errors.website}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="start_month"
                            className="form-label mt-4"
                          >
                            Start Month
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.start_month &&
                              formik.touched.start_month
                              ? "is-invalid"
                              : ""
                              }`}
                            id="start_month"
                            name="start_month"
                            onChange={formik.handleChange}
                            value={formik.values?.start_month}
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
                          </select>
                          {formik.errors.start_month &&
                            formik.touched.start_month && (
                              <div className="invalid-feedback">
                                {formik.errors.start_month}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="end_month"
                            className="form-label mt-4"
                          >
                            End Month
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.end_month &&
                              formik.touched.end_month
                              ? "is-invalid"
                              : ""
                              }`}
                            id="end_month"
                            name="end_month"
                            onChange={formik.handleChange}
                            value={formik.values?.end_month}
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
                          </select>
                          {formik.errors.end_month &&
                            formik.touched.end_month && (
                              <div className="invalid-feedback">
                                {formik.errors.end_month}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="pc_code"
                          >
                            Pc Code<span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.pc_code &&
                              formik.touched.pc_code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="pc_code"
                            name="pc_code"
                            placeholder="Pc Code"
                            onChange={formik.handleChange}
                            value={formik.values?.pc_code}
                          />
                          {formik.errors.pc_code &&
                            formik.touched.pc_code && (
                              <div className="invalid-feedback">
                                {formik.errors.pc_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="sm_add_code"
                          >
                            Sm Add Code<span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.sm_add_code &&
                              formik.touched.sm_add_code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="sm_add_code"
                            name="sm_add_code"
                            placeholder="Sm Add Code"
                            onChange={formik.handleChange}
                            value={formik.values?.sm_add_code}
                          />
                          {formik.errors.sm_add_code &&
                            formik.touched.sm_add_code && (
                              <div className="invalid-feedback">
                                {formik.errors.sm_add_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="sm_sub_code"
                          >
                            Sm Sub Code<span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.sm_sub_code &&
                              formik.touched.sm_sub_code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="sm_sub_code"
                            name="sm_sub_code"
                            placeholder="Sm Sub Code"
                            onChange={formik.handleChange}
                            value={formik.values?.sm_sub_code}
                          />
                          {formik.errors.sm_sub_code &&
                            formik.touched.sm_sub_code && (
                              <div className="invalid-feedback">
                                {formik.errors.sm_sub_code}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            className="form-label mt-4"
                            htmlFor="bunkering_code"
                          >
                            Bunkering Code<span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            autoComplete="off"
                            className={`input101 ${formik.errors.bunkering_code &&
                              formik.touched.bunkering_code
                              ? "is-invalid"
                              : ""
                              }`}
                            id="bunkering_code"
                            name="bunkering_code"
                            placeholder="bunkering_code"
                            onChange={formik.handleChange}
                            value={formik.values?.bunkering_code}
                          />
                          {formik.errors.bunkering_code &&
                            formik.touched.bunkering_code && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkering_code}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={4} md={6}>
                        <div>
                          <label
                            htmlFor="ma_option"
                            className="form-label mt-4"
                          >
                            MA Options
                            <span className="text-danger">*</span>
                          </label>
                          <div className="mapotions">
                            <label>
                              <input
                                type="checkbox"
                                name="ma_option"
                                value="1"
                                checked={formik.values?.ma_option?.includes("1")}
                                onChange={() => handleMaOptionChange("1")}
                                className="form-check-input"
                              />
                              <span className="ms-2"> Actual</span>
                            </label>
                          </div>
                        </div>
                        <div className="mapotions">
                          <label>
                            <input
                              type="checkbox"
                              name="ma_option"
                              value="2"
                              checked={formik.values?.ma_option?.includes("2")}
                              onChange={() => handleMaOptionChange("2")}
                              className="form-check-input"
                            />

                            <span className="ms-2"> Forecast</span>
                          </label>
                        </div>
                        <div className="mapotions">
                          <label>
                            <input
                              type="checkbox"
                              name="ma_option"
                              value="3"
                              checked={formik.values?.ma_option?.includes("3")}
                              onChange={() => handleMaOptionChange("3")}
                              className="form-check-input"
                            />

                            <span className="ms-2"> Variance</span>
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Link
                        type="sussbmit"
                        className="btn btn-danger me-2 "
                        to={`/managecompany/`}
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
export default withApi(EditCompany);
