import { useEffect, useReducer, useState } from "react";
import { Col, Row, Card, Breadcrumb, FormGroup } from "react-bootstrap";
import { useFormik } from "formik";
import { Link, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import FormikInput from "../../Formik/FormikInput";
import * as Yup from "yup";
import LoaderImg from "../../../Utils/Loader";
import FormikReactSelect from "../../Formik/FormikReactSelect";
import { countryCodes } from "../../../Utils/commonFunctions/CommonData";
import { MultiSelect } from "react-multi-select-component";
import FormikCheckOneBox from "../../Formik/FormikCheckOneBox";

// Define the initial state
const initialState = {
  levels: [],
  clientList: [],
  roleList: [],
  loading: true,
  error: null,
};

// Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LEVELS":
      return { ...state, levels: action.payload, loading: false };
    case "SET_CLIENT_LIST":
      return { ...state, clientList: action.payload, loading: false };
    case "SET_ROLE_LIST":
      return { ...state, roleList: action.payload, loading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const ManageAddEditUsers = (props) => {
  const { isLoading, postData, getData } = props;
  const { id: urlId } = useParams();
  const [selected, setSelected] = useState([]);

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCommonList = async () => {
    try {
      const levelsResponse = await getData(`/levels`);
      dispatch({
        type: "SET_LEVELS",
        payload: levelsResponse?.data?.data || [],
      });
    } catch (error) {
      console.error("Error fetching levels:", error);
      dispatch({ type: "SET_LEVELS", payload: [] });
    }

    try {
      const clientListResponse = await getData(`/common/client-list`);
      dispatch({
        type: "SET_CLIENT_LIST",
        payload: clientListResponse?.data?.data || [],
      });
    } catch (error) {
      console.error("Error fetching client list:", error);
      dispatch({ type: "SET_CLIENT_LIST", payload: [] });
    }

    try {
      const roleListResponse = await getData(`/roles`);
      dispatch({
        type: "SET_ROLE_LIST",
        payload: roleListResponse?.data?.data || [],
      });
    } catch (error) {
      console.error("Error fetching role list:", error);
      dispatch({ type: "SET_ROLE_LIST", payload: [] });
    }
  };

  const fetchDetailList = async (urlId) => {
    try {
      const response = await getData(`/user/detail?id=${urlId}`);

      if (response) {
        formik.setValues(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const AddSiteinitialValues = {
    name: "",
    country_code: "",
    sort_order: "",
    is_final: 0,
    email: "",
    password: "",
    clients: [], // Empty array for clients
    first_name: "",
    last_name: "",
    phone_number: "",
    role_id: "",
    level_id: "",
  };

  const formik = useFormik({
    initialValues: AddSiteinitialValues,
    validationSchema: Yup.object({
      first_name: Yup.string().required("First Name is required"),
      role_id: Yup.string().required("Role is required"),
      last_name: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .required(" Email is required")
        .email("Invalid email format"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one numeric digit")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character"
        ),
      phone_number: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be a 10-digit number")
        .required("Phone Number is required"),
    }),
    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });

  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("sort_order", values.sort_order);
      formData.append("is_final", values.is_final);

      if (urlId) {
        formData.append("id", values.id);
      }

      let postDataUrl = "/level/";
      postDataUrl += urlId ? "update" : "create";

      const navigatePath = "/manage-levels/";
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  useEffect(() => {
    if (urlId) {
      fetchDetailList(urlId);
    }
    fetchCommonList();
  }, [urlId]);

  console.log(state, "state");
  console.log(formik?.values, "formik?.values");

  return (
    <>
      {isLoading ? <LoaderImg /> : null}
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">{urlId ? "Edit User" : "Add User"} </h1>

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
                linkProps={{ to: "/users/" }}
              >
                Manage Users
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                {urlId ? "Edit User" : "Add User"}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">
                  {urlId ? "Edit User" : "Add User"}{" "}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col lg={4}>
                      <FormikInput
                        formik={formik}
                        type="text"
                        name="first_name"
                      />
                    </Col>

                    <Col lg={4}>
                      <FormikInput
                        formik={formik}
                        type="text"
                        name="last_name"
                      />
                    </Col>

                    <Col lg={4} md={6}>
                      <label htmlFor="phone_number" className="form-label mt-0">
                        Phone Number<span className="text-danger">*</span>
                      </label>
                      <div className=" d-flex cursor-pointer">
                        <select
                          disabled
                          value={formik?.values?.country_code}
                          onChange={formik.handleChange}
                          id="country_code"
                          name="country_code"
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

                    <Col lg={4}>
                      <FormikInput
                        formik={formik}
                        type="email"
                        name="email"
                        label="Email"
                      />
                    </Col>

                    <Col lg={4}>
                      <FormikInput
                        formik={formik}
                        type="password"
                        name="password"
                        label="Password"
                      />
                    </Col>

                    <div className="mt-0 col-lg-4">
                      <FormikReactSelect
                        formik={formik}
                        name="role_id"
                        label="Role"
                        options={[
                          { value: "", label: "Select Role" },
                          ...(state?.roleList?.map((item) => ({
                            value: item?.id,
                            label: item?.role_name,
                          })) || []),
                        ]}
                        onChange={(selectedOption) => {
                          formik.handleChange(selectedOption.value);
                        }}
                      />
                    </div>

                    <div className="mt-0 col-lg-4">
                      <FormikReactSelect
                        formik={formik}
                        name="level_id"
                        label="Level"
                        isRequired={false}
                        options={[
                          { value: "", label: "Select Level" },
                          ...(state?.levels?.map((item) => ({
                            value: item?.id,
                            label: item?.name,
                          })) || []),
                        ]}
                        onChange={(selectedOption) => {
                          formik.handleChange(selectedOption.value);
                        }}
                      />
                    </div>

                    {localStorage.getItem("superiorRole") !== "Client" ? (
                      <Col lg={4} md={6}>
                        <FormGroup>
                          <label className="form-label mt-1">
                            Select Client
                          </label>
                          <MultiSelect
                            value={formik?.values?.clients || []}
                            onChange={(selectedOption) =>
                              formik?.setFieldValue("clients", selectedOption)
                            }
                            labelledBy="Select Client"
                            disableSearch="true"
                            options={
                              state?.clientList?.map((site) => ({
                                label: site?.full_name,
                                value: site?.id,
                              })) || []
                            }
                            showCheckbox="false"
                          />
                        </FormGroup>
                      </Col>
                    ) : (
                      ""
                    )}

                    <Col lg={4} md={6}>
                      <FormikCheckOneBox
                        label="Is Main Approver"
                        name="is_main"
                        formik={formik}
                        // disabled={true} // You can toggle this between true/false to enable/disable the checkbox
                      />
                    </Col>

                    {!urlId && (
                      <>
                        <Col lg={4} md={6}>
                          <FormikCheckOneBox
                            label="Send Welcome Email"
                            name="send_mail"
                            formik={formik}
                            // disabled={true} // You can toggle this between true/false to enable/disable the checkbox
                          />
                        </Col>
                      </>
                    )}
                  </Row>
                  <Card.Footer className="text-end">
                    <Link
                      type="submit"
                      className="btn btn-danger me-2 "
                      to={`/manage-levels/`}
                    >
                      Cancel
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary me-2 "
                      // disabled={Object.keys(errors).length > 0}
                    >
                      {urlId ? "Update" : "Save"}
                    </button>
                  </Card.Footer>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageAddEditUsers);
