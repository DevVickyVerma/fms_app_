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
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";


  const AddRoles = (props) => {
    const { apidata, isLoading, error, getData, postData } = props;
  const [permissions, setPermissions] = useState([]);

  const [userpermissions, setUserPermissions] = useState([]);
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
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
    FetchTableData()
  }, []);
  const FetchTableData = async () => {
    try {
      const response = await getData("/permission-list")
      console.log(response.data.data, "ddd");

      if (response && response.data && response.data) {
        setUserPermissions(response.data.data);
        setPermissions(response.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
     
    const formData = {
      name: values.name,
      permissions: values.permissions,
    };

    const postDataUrl = "/role/create";
    const navigatePath = "/roles";
  
    await postData(postDataUrl, formData, navigatePath);
  
   ; // Set the submission state to false after the API call is completed
  } catch (error) {
    handleError(error);
 ; // Set the submission state to false if an error occurs
  }
  };


  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  useEffect(() => {
    const isAddPermissionAvailable = permissionsArray?.includes("role-create");
  
    if (permissionsArray.length > 0) {
      if (isAddPermissionAvailable) {
        console.log(isAddPermissionAvailable, "AddPermissionAvailable");
        // Perform action when permission is available
        // Your code here
      } else {
        // console.log(isAddPermissionAvailable, "NoAddPermissionAvailable");
        // Perform action when permission is not available
        // Your code here
        navigate("/errorpage403");
      }
    }
  }, [permissionsArray]);




  return (
    <>
    {isLoading ? (
      <Loaderimg/>
    ) :(
      <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Add Role</h1>
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
              Add Role
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Add Role</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className="col-lg- col-md-12">
                  <Formik
                    initialValues={{ name: "", permissions: [] }}
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
                      setTimeout(() => {
                        if (values.permissions.length === 0) {
                          setSubmitting(false);
                        } else {
                          handleSubmit(values);
                          setSubmitting(false);
                        }
                      }, 400);
                    }}
                  >
                    {({ errors, touched, handleSubmit }) => (
                      <Form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="name"> Add Role</label>
                          <Field
                            type="text"
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
                          <div className="table-heading">
                            <h2>
                              Permissions
                              <span className="text-danger danger-title">
                                * Atleast One Permission is Required{" "}
                              </span>
                            </h2>
                          </div>
                          {permissions.data &&
                          Object.keys(permissions.data).length > 0 ? (
                            <div>
                              {Object.keys(permissions.data).map((heading) => (
                                <div key={heading}>
                                  <div className="table-heading">
                                    <h2>{heading}</h2>
                                  </div>
                                  <div className="form-group">
                                    {permissions.data[heading].names.map(
                                      (nameItem) => (
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
                                            name="permissions"
                                            value={nameItem.name}
                                            id={`permission-${nameItem.id}`}
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
                            <div>No permissions found.</div>
                          )}

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
                            disabled={Object.keys(errors).length > 0}
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
      )}
    </>
  );
}

  export default withApi(AddRoles);