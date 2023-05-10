import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Dropdown,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { toast } from "react-toastify";

export default function AddAddon() {
  const [AddonpermissionsList, setPermissions] = useState([]);
  const [userpermissions, setUserPermissions] = useState([]);
  const [edituserDetails, setEdituserDetails] = useState("");
  const [editName, seteditName] = useState("");
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
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
      .post("/permission-list")
      .then((response) => {
        setUserPermissions(response.data.data);

        // setPermissions(response.data);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.data.status_code === "403"
        ) {
          navigate("/errorpage403");
        }
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const addonId = localStorage.getItem("EditAddon");
    const formData = new FormData();
    formData.append("addon_id", addonId);

    const GetAddonDetails = async () => {
      try {
        const response = await axiosInstance.post("/addon/detail", formData);
        const { data } = response;
        if (data) {
          setEdituserDetails(data.data.addon_name);
          // setPermissions(response.data);

          setPermissions(data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
          ErrorAlert("Invalid access token");
          localStorage.clear();
        } else if (
          error.response &&
          error.response.data.status_code === "403"
        ) {
          navigate("/errorpage403");
        }
      }
    };

    GetAddonDetails();
  }, []);

  useEffect(() => {
    setEdituserDetails();
  }, [edituserDetails]);

  // const handleSubmit = async (values) => {
  //   const body = {
  //     name: values.name,
  //     permissions: values.permissions,
  //   };

  //   const token = localStorage.getItem("token");

  //   const response = await fetch(
  //     `${process.env.REACT_APP_BASE_URL}/addon-create`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(body),
  //     }
  //   );

  //   const data = await response.json();

  //   if (response.ok) {
  //     SuccessAlert(data.message);
  //     navigate("/manageaddon");
  //   } else {
  //     ErrorAlert(data.message);
  //   }
  // };

  const handleSubmit = (values) => {
    console.log(values, "values");
  };

  //   const { permission_name } = nameItem;
  //   const permissions = values.permissions || [];

  //   // Check if the permission is already present in the permissions array
  //   const index = permissions.indexOf(permission_name);

  //   // If the permission is already present, remove it from the array
  //   if (index !== -1) {
  //     permissions.splice(index, 1);
  //   } else {
  //     // Otherwise, add it to the array
  //     permissions.push(permission_name);
  //   }

  //   // Set the updated permissions array in the form values
  //   setFieldValue("permissions", permissions);
  // };

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Edit Addon</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Addon
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Edit Addon</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className="col-lg- col-md-12">
                  <Formik
                    initialValues={{
                      name: localStorage.getItem("EditAddon_name") || "",
                      permissions: [],
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string()
                        .required("Addon is required")
                        .matches(/^[a-zA-Z0-9_\- ]+$/, {
                          message:
                            "Addon Name must not contain special characters",
                          excludeEmptyString: true,
                        })
                        .matches(
                          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                          {
                            message:
                              "Addon Name must not have consecutive spaces",
                            excludeEmptyString: true,
                          }
                        ),
                      permissions: Yup.array()
                        .required("At least one role is required")
                        .min(1, "At least one role is required"),
                    })}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                      handleSubmit(values);
                      setSubmitting(false);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleSubmit,
                      setFieldValue,
                    }) => (
                      <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="name"> Add Addon</label>
                          <Field
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Addonname"
                            className={`input101 ${
                              touched.name && errors.name ? "is-invalid" : ""
                            }`}
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="form-group">
                          {AddonpermissionsList.data &&
                            AddonpermissionsList.data.addon_permissions && (
                              <div>
                                {Object.keys(
                                  AddonpermissionsList.data.addon_permissions
                                ).map((heading) => (
                                  <div key={heading}>
                                    <div className="table-heading">
                                      <h2>{heading}</h2>
                                    </div>
                                    <div className="form-group">
                                      {AddonpermissionsList.data.addon_permissions[
                                        heading
                                      ].names.map((nameItem) => (
                                        <div
                                          key={nameItem.id}
                                          className="form-check form-check-inline"
                                        >
                                          <Field
                                            className={`form-check-input ${
                                              touched.permissions &&
                                              errors.permissions
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            type="checkbox"
                                            name={`permissions.${nameItem.permission_name}`}
                                            id={`permission-${nameItem.id}`}
                                            checked={nameItem.checked}
                                            onChange={(e) => {
                                              const checked = e.target.checked;
                                              const newPermissions = [
                                                ...values.permissions,
                                              ];
                                              if (checked) {
                                                console.log(
                                                  newPermissions,
                                                  "newPermissions"
                                                );
                                                newPermissions.push(
                                                  nameItem.permission_name
                                                );
                                              } else {
                                                const index =
                                                  newPermissions.indexOf(
                                                    nameItem.permission_name
                                                  );
                                                if (index !== -1) {
                                                  newPermissions.splice(
                                                    index,
                                                    1
                                                  );
                                                }
                                              }
                                              setFieldValue(
                                                "permissions",
                                                newPermissions
                                              );
                                              console.log(
                                                newPermissions,
                                                "newPermissions"
                                              );
                                            }}
                                          />

                                          <label
                                            className="form-check-label"
                                            htmlFor={`permission-${nameItem.id}`}
                                          >
                                            {nameItem.display_name}
                                          </label>
                                          {/* <p>{nameItem.permission_name}</p> */}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          <ErrorMessage
                            name="permissions"
                            component="div"
                            className="invalid-feedback"
                          />
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
                          >
                            Update
                          </button>
                          
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Row>
    </>
  );
}
