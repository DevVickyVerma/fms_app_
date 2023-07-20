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
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import { toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";

const EditAddon = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [AddonpermissionsList, setPermissions] = useState([]);
  const [userpermissions, setUserPermissions] = useState([]);
  const [edituserDetails, setEdituserDetails] = useState("");
  const [editName, seteditName] = useState("");
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const navigate = useNavigate();

  const [permissionArray, setPermissionArray] = useState([]);

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
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Fetch user permissions
    axiosInstance
      .get("/permission-list")
      .then((response) => {
        setUserPermissions(response.data.data);
      })
      .catch((error) => {
        handleError(error);
      });

    // Fetch addon details and set permissions
    const addonId = localStorage.getItem("EditAddon");
    const formData = new FormData();
    formData.append("addon_id", addonId);

    FetchPermisionList();
  }, []);

  const FetchPermisionList = async () => {
    try {
      const addonId = localStorage.getItem("EditAddon");
      const formData = new FormData();
      formData.append("addon_id", addonId);
      const response = await getData("addon/detail", addonId, formData);
      console.log(response.data.data, "ddd");
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
      if (response && response.data) {
        setEdituserDetails(data.data.addon_name);
        setPermissions(data);
        console.log(data?.data?.addon_permissions, "datadatadatadata");
        const enabledPermissions = [];

        // Loop through each category and check for enabled permissions
        Object.keys(data?.data?.addon_permissions).forEach((category) => {
          data?.data?.addon_permissions[category].names.forEach(
            (permission) => {
              if (permission.checked) {
                enabledPermissions.push(permission.permission_name);
              }
            }
          );
        });
        formik.setFieldValue("permissionsList", enabledPermissions);
        console.log(enabledPermissions, "enabledPermissions");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    setEdituserDetails();
    // console.clear();
  }, [edituserDetails]);

  const formik = useFormik({
    initialValues: {
      name: localStorage.getItem("EditAddon_name") || "",
      permissionsList: [],
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
      permissionsList: Yup.array()
        .required("At least one role is required")
        .min(1, "At least one role is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

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

  const [selectAllPermissions, setSelectAllPermissions] = useState({});
  const handleSelectAllPermissions = (heading, checked) => {
    const updatedPermissions = { ...selectAllPermissions };
    updatedPermissions[heading] = checked;

    // If the "Select All" input is checked, add all permissions to the permissionArray for that heading
    if (checked) {
      const permissionsToAdd = AddonpermissionsList.data.addon_permissions[
        heading
      ].names.map((nameItem) => nameItem.permission_name);

      formik.setFieldValue("permissionsList", permissionsToAdd);
      console.log(permissionsToAdd, "permissionsToAdd");
      setPermissionArray((prevPermissionArray) => [
        ...prevPermissionArray,
        ...permissionsToAdd,
      ]);
    } else {
      // If the "Select All" input is unchecked, remove all permissions of that heading from the permissionArray
      const permissionsToRemove = AddonpermissionsList.data.addon_permissions[
        heading
      ].names.map((nameItem) => nameItem.permission_name);
      formik.setFieldValue("permissionsList", permissionsToRemove);
      
      setPermissionArray((prevPermissionArray) =>
        prevPermissionArray.filter(
          (permission) => !permissionsToRemove.includes(permission)
        )
      );
    }

    setSelectAllPermissions(updatedPermissions);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Edit Addon</h1>
            <Breadcrumb className="breadcrumb">{/* ... */}</Breadcrumb>
          </div>
        </div>

        <Row>
          <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
            <Card>
              <Card.Header>
                <h4 className="card-title">
                  Edit Addon{" "}
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
                          Edit Addon
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          id="name"
                          name="name"
                          placeholder="Addonname"
                          className={`input101 ${
                            formik.touched.name && formik.errors.name
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
                        {AddonpermissionsList.data &&
                          AddonpermissionsList.data.addon_permissions && (
                            <div>
                              {/* Add the filteredPermissions constant here */}

                              {Object.keys(
                                AddonpermissionsList.data.addon_permissions
                              ).map((heading) => (
                                <div key={heading}>
                               
                                  <div className="table-heading d-flex">
                               

                               <div className="heading-input ">
                               <input
                                    className={`form-check-input ${
                                        formik.touched.permissions &&
                                        formik.errors.permissions
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                        type="checkbox"
                                        checked={
                                          selectAllPermissions[heading] || false
                                        }
                                        onChange={(e) =>
                                          handleSelectAllPermissions(
                                            heading,
                                            e.target.checked
                                          )
                                        }
                                      />
                               </div>
                               <div>
                             <h2>{heading}</h2>
                             </div>
                             </div>
                                  <div className="form-group">
                                    {AddonpermissionsList.data.addon_permissions[
                                      heading
                                    ].names.map((nameItem) => (
                                      <div
                                        key={nameItem.id}
                                        className="form-check form-check-inline"
                                      >
                                        <input
                                          className={`form-check-input ${
                                            formik.touched.permissionsList &&
                                            formik.errors.permissionsList
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          type="checkbox"
                                          name={`permissionsList.${nameItem.permission_name}`}
                                          id={`permissionsList-${nameItem.id}`}
                                          checked={permissionArray.find(
                                            (item) =>
                                              item === nameItem.permission_name
                                          )}
                                          onChange={(e) => {
                                            // Get the name of the permission being changed from the current element
                                            const permissionName =
                                              nameItem.permission_name;

                                            const updatedPermissionArray = [
                                              ...permissionArray,
                                            ];

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
                                            formik.setFieldValue(
                                              "permissionsList",
                                              updatedPermissionArray
                                            );
                                            console.log(
                                              updatedPermissionArray,
                                              "updatedPermissionArray"
                                            );
                                          }}
                                        />

                                        <label
                                          className="form-check-label"
                                          htmlFor={`permissionsList-${nameItem.id}`}
                                        >
                                          {nameItem.display_name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        {formik.touched.permissionsList &&
                          formik.errors.permissionsList && (
                            <div className="invalid-feedback">
                              {formik.errors.permissionsList}
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
                          disabled={Object.keys(formik.errors).length > 0}
                        >
                          Update
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
export default withApi(EditAddon);
