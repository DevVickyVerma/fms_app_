import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Card, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const AddAddon = (props) => {
  const { isLoading, } = props;
  const [permissions, setPermissions] = useState([]);
<<<<<<< HEAD
=======
  // eslint-disable-next-line no-unused-vars
  const [userpermissions, setUserPermissions] = useState([]);
>>>>>>> 4ac3e596442186a9370a598fc6d43318d9cff7d9



  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    axiosInstance
      .get("/permission-list")
      .then((response) => {
        setPermissions(response.data);
      })

      .catch((error) => {
        handleError(error);
      });
    console.clear();
  }, []);

  const handleSubmit = async (values) => {
    const body = {
      name: values.name,
      permissions: values.permissions,
    };

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/addon/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (response.ok) {
      SuccessAlert(data.message);
      navigate("/manageaddon");
    } else {
      ErrorAlert(data.message);
    }
  };

<<<<<<< HEAD


=======
>>>>>>> 4ac3e596442186a9370a598fc6d43318d9cff7d9
  const formik = useFormik({
    initialValues: {
      name: "",
      permissions: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("Addon is required")
        .matches(/^[a-zA-Z0-9_\- ]+$/, {
          message: "Addon Name must not contain special characters",
          excludeEmptyString: true,
        })
        .matches(
          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
          {
            message: "Addon Name must not have consecutive spaces",
            excludeEmptyString: true,
          }
        )
        .min(3, "The addon name must be at least 3 characters."),

      permissions: Yup.array()
        .required("At least one role is required")
        .min(1, "At least one role is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (values.permissions.length === 0) {
        setSubmitting(false);
      } else {
        handleSubmit(values);
        setSubmitting(false);
      }
    },
  });
  // Add these states
  const [selectAllPermissions, setSelectAllPermissions] = useState({});

  useEffect(() => {
    if (permissions.data && Object.keys(permissions.data).length > 0) {
      const initialSelectAllState = {};
      Object.keys(permissions.data).forEach((heading) => {
        initialSelectAllState[heading] = false;
      });
      setSelectAllPermissions(initialSelectAllState);
    }
  }, [permissions.data]);

  const handleSelectAllPermissions = (heading, event) => {
    const newSelectAllState = { ...selectAllPermissions };
    newSelectAllState[heading] = event.target.checked;

    // Select/deselect all permissions in the group
    const permissionsInGroup = permissions.data[heading]?.names.map(
      (nameItem) => nameItem.name
    );
    formik.setFieldValue(`permissions`, [
      ...formik.values.permissions.filter(
        (permission) => !permissionsInGroup.includes(permission)
      ),
      ...(event.target.checked ? permissionsInGroup : []),
    ]);

    setSelectAllPermissions(newSelectAllState);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Add Addon</h1>
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
                linkProps={{ to: "/manageaddon" }}
              >
                Manage Addons
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Add Addon
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row>
          <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
            <Card>
              <Card.Header>
                <h4 className="card-title">
                  Add Addon{" "}
                  <span className="text-danger danger-title">
                    * Atleast One Permission is Required{" "}
                  </span>
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <div className="col-lg- col-md-12">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="form-group">
                        <label className="form-label mt-4" htmlFor="name">
                          {" "}
                          Add Addon
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          id="name"
                          name="name"
                          placeholder="Addon Name"
                          className={`input101 ${formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                            }`}
                          {...formik.getFieldProps("name")}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="invalid-feedback">
                            {formik.errors.name}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        {permissions.data &&
                          Object.keys(permissions.data).length > 0 ? (
                          <div>
                            {Object.keys(permissions.data).map((heading) => (
                              <div key={heading}>
                                <div className="table-heading d-flex">
                                  <div className="heading-input ">
                                    <input
                                      className={`form-check-input ${formik.touched.permissions &&
                                        formik.errors.permissions
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                      type="checkbox"
                                      checked={
                                        selectAllPermissions[heading] || false
                                      }
                                      onChange={(event) =>
                                        handleSelectAllPermissions(
                                          heading,
                                          event
                                        )
                                      }
                                    />
                                  </div>
                                  <div>
                                    <h2>{heading}</h2>
                                  </div>
                                </div>
                                <div className="form-group">
                                  {permissions.data[heading].names.map(
                                    (nameItem) => (
                                      <div
                                        key={nameItem.id}
                                        className="form-check form-check-inline"
                                      >
                                        <input
                                          className={`form-check-input ${formik.touched.permissions &&
                                            formik.errors.permissions
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                          type="checkbox"
                                          name="permissions"
                                          value={nameItem.name}
                                          id={`permission-${nameItem.id}`}
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          checked={formik.values.permissions.includes(
                                            nameItem.name
                                          )}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`permission-${nameItem.id}`}
                                        >
                                          {nameItem.display_name}
                                        </label>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>No permissions available.</div>
                        )}

                        {formik.touched.permissions &&
                          formik.errors.permissions && (
                            <div className="invalid-feedback">
                              {formik.errors.permissions}
                            </div>
                          )}
                      </div>

                      <div className="text-end">
                        <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/manageaddon/`}
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary me-2 "
                        // disabled={Object.keys(formik.errors).length > 0}
                        >
                          Save
                        </button>
                      </div>
                    </Form>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </>
    </>
  );
};

export default withApi(AddAddon);
