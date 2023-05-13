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
import { useFormik } from "formik";
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

  const [permissionArray, setPermissionArray] = useState([]);
  const [permissionArray1, setPermissionArray1] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    // Fetch user permissions
    axiosInstance
      .post("/permission-list")
      .then((response) => {
        setUserPermissions(response.data.data);
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
  
    // Fetch addon details and set permissions
    const addonId = localStorage.getItem("EditAddon");
    const formData = new FormData();
    formData.append("addon_id", addonId);
  
    const getAddonDetails = async () => {
      try {
        const response = await axiosInstance.post("/addon/detail", formData);
        const { data } = response;
  
        const permissionArray = [];
        for (const key of Object.keys(data.data.addon_permissions)) {
          let array = [];
          for (const item of data?.data?.addon_permissions[key].names) {
            if (item.checked) {
              array.push(item.permission_name);
            }
          }
          permissionArray.push(...array);
        }
  
        setPermissionArray([...new Set(permissionArray)]);
  
        if (data) {
          setEdituserDetails(data.data.addon_name);
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
  
    getAddonDetails();
  }, []);
  

  useEffect(() => {
    setEdituserDetails();
    console.clear()
  }, [edituserDetails]);

  const handleSubmit = async (values) => {
    const body = {
      addon_name: values.name,
      permissions: values.permissionsList,
      addon_id: localStorage.getItem("EditAddon"),
    };

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/addon/update`,
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

  // const handleSubmit = (values) => {
  //   console.log(values, "final");
  // };

  // const handleSubmit=(values)=>{
  //   console.log(permissionArray, "final");

  // }
  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Edit Addon</h1>
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
                      permissionsList: [],
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
                      permissionsList: Yup.array()
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
                                {/* Add the filteredPermissions constant here */}

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
                                              touched.permissionsList &&
                                              errors.permissionsList
                                                ? "is-invalid"
                                                : ""
                                            }`}
                                            type="checkbox"
                                            name={`permissionsList.${nameItem.permission_name}`}
                                            id={`permissionsList-${nameItem.id}`}
                                            checked={permissionArray.find(
                                              (item) =>
                                                item ===
                                                nameItem.permission_name
                                            )}
                                            onChange={(e) => {
                                              // Get the name of the permission being changed from the current element
                                              const permissionName =
                                                nameItem.permission_name;

                                            

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

                                              // console.log(
                                              //   updatedPermissionArray,
                                              //   "updatedPermissionArray"
                                              // );

                                              // Update the state of permissionArray with the updatedPermissionArray
                                              setPermissionArray(
                                                updatedPermissionArray
                                              );

                                              // Update the form field "permissionsList" with the updatedPermissionArray
                                              setFieldValue(
                                                "permissionsList",
                                                updatedPermissionArray
                                              );
                                            }}
                                          />

                                          <label
                                            className="form-check-label"
                                            htmlFor={`permissionsList-${nameItem.id}`}
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
                            disabled={Object.keys(errors).length > 0}
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
