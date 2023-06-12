import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
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
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const EditRoles = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissions, setPermissions] = useState([]);
  const [addonitem, setAddonitem] = useState([]);
  const [userpermissions, setUserPermissions] = useState([]);
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const [permissionArray, setPermissionArray] = useState([]);
  const [addonArray, setAddonArray] = useState([]);
  const successToasts = {}; // Object to store the toast IDs

  const navigate = useNavigate();
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  useEffect(() => {
    FetchPermisionList();
    console.clear();
  }, []);
  const FetchPermisionList = async () => {
    try {
      const EditRoleId = localStorage.getItem("EditRoleID");
      const formData = new FormData();
      formData.append("role_id", EditRoleId);
      const response = await getData("/role/detail", EditRoleId, formData);
      console.log(response.data.data, "ddd");
      if (response && response.data) {
        const { data } = response.data;

        for (const key of Object.keys(data.permissions)) {
          let array = [];
          for (const item of data.permissions[key].names) {
            if (item.checked) {
              array.push(item.name);
            }
          }
          setPermissionArray((prevState) => [
            ...new Set([...prevState, ...array]),
          ]);
        }
        setPermissions(data.permissions);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (values) => {
    const body = {
      name: values.name,
      permissions: values.permissions,

      role_id: localStorage.getItem("EditRoleID"),
    };

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/role/update`,
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
      navigate("/roles");
    } else {
      ErrorAlert(data.message);
    }
  };

  return (
    <>
    {isLoading ? (
     <Loaderimg />
    ) : null}
      <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Edit Role</h1>
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
              linkProps={{ to: "/roles" }}
            >
              Manage Roles
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Role
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Edit Role</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className="col-lg- col-md-12">
                  <Formik
                    initialValues={{
                      name: localStorage.getItem("EditRole_name") || "",
                      permissions: [],
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string()
                        .required("Role is required")
                        .matches(/^[a-zA-Z0-9_\- ]+$/, {
                          message:
                            "Role Name must not contain special characters",
                          excludeEmptyString: true,
                        })
                        .matches(
                          /^[a-zA-Z0-9_\- ]*([a-zA-Z0-9_\-][ ]+[a-zA-Z0-9_\-])*[a-zA-Z0-9_\- ]*$/,
                          {
                            message:
                              "Role Name must not have consecutive spaces",
                            excludeEmptyString: true,
                          }
                        )
                        .min(3, "The Role name must be at least 3 characters."),

                      permissions: Yup.array()
                        .required("At least one role is required")
                        .min(1, "At least one role is required"),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                      handleSubmit(values);
                    }}
                  >
                    {({ errors, touched, handleSubmit, setFieldValue }) => (
                      <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label className=" form-label mt-4" htmlFor="name"> Edit Role</label>
                          <Field
                            type="text"  autoComplete="off"
                            id="name"
                            name="name"
                            placeholder="RoleName"
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
                          <div>
                            <div className="table-heading">
                              <h2>
                                Permissions
                                <span className="text-danger danger-title">
                                  * Atleast One Permission is Required{" "}
                                </span>
                              </h2>
                            </div>
                            {Object.keys(permissions).length > 0 ? (
                              Object.keys(permissions).map((heading) => (
                                <div key={heading}>
                                  <div className="table-heading">
                                    <h2>{heading}</h2>
                                  </div>
                                  <div className="form-group">
                                    {permissions[heading].names.map(
                                      (nameItem) => (
                                        <div
                                          key={nameItem.id}
                                          className="form-check form-check-inline"
                                        >
                                          <input
                                            className={`form-check-input ${
                                              touched.permissions &&
                                              errors.permissions
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            type="checkbox"
                                            name="permissions"
                                            value={nameItem.name}
                                            id={`permission-${nameItem.id}`}
                                            checked={permissionArray.find(
                                              (item) => item === nameItem.name
                                            )}
                                            onChange={(e) => {
                                              // Get the name of the permission being changed from the current element
                                              const permissionName =
                                                nameItem.name;

                                              // Create a new array from the current state of permissionArray
                                              const updatedPermissionArray = [
                                                ...permissionArray,
                                              ];

                                              // Find the index of the permissionName in the updatedPermissionArray
                                              const findInd =
                                                updatedPermissionArray.findIndex(
                                                  (item) =>
                                                    item === permissionName
                                                );

                                              // If the permissionName is already in the array, remove it
                                              if (findInd >= 0) {
                                                updatedPermissionArray.splice(
                                                  findInd,
                                                  1
                                                );
                                              }
                                              // Otherwise, add the permissionName to the array
                                              else {
                                                updatedPermissionArray.push(
                                                  permissionName
                                                );
                                              }

                                              // Update the state of permissionArray with the updatedPermissionArray
                                              setPermissionArray(
                                                updatedPermissionArray
                                              );

                                              // Update the form field "permissionsList" with the updatedPermissionArray
                                              setFieldValue(
                                                "permissions",
                                                updatedPermissionArray
                                              );
                                            }}
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
                              ))
                            ) : (
                              <div>
                                No Records Found Please
                                {/* <Link className=" m-2 " to={`/addaddon/`}>
                                Add Addon
                              </Link> */}
                              </div>
                            )}
                          </div>

                          <ErrorMessage
                            name="permissions"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="text-end">
                          <Link className="btn btn-danger me-2 " to={`/roles/`}>
                            Cancel
                          </Link>

                          <button
                            type="submit"
                            className="btn btn-primary me-2 "
                            // disabled={Object.keys(errors).length > 0}
                          >
                            Save
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
  
    </>
  );
};
export default withApi(EditRoles);
