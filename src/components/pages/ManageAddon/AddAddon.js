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
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";


  const AddAddon = (props) => {
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
        setUserPermissions(response.data.data);
        setPermissions(response.data);
      })

      .catch((error) => {
        handleError(error);
      });
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

  const [permissionsArray, setPermissionsArray] = useState([]);
  const [isPermissionsSet, setIsPermissionsSet] = useState(false);
  
  const UserPermissions = useSelector((state) => state?.data?.data);
  
  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      setIsPermissionsSet(true);
    }
  }, [UserPermissions]);
  
  useEffect(() => {
    if (isPermissionsSet) {
      const isAddPermissionAvailable = permissionsArray?.includes("addons-create");
    
      if (permissionsArray?.length > 0) {
        if (isAddPermissionAvailable) {
          console.log(isAddPermissionAvailable, "AddPermissionAvailable");
          // Perform action when permission is available
          // Your code here
        } else {
          // Perform action when permission is not available
          // Your code here
          navigate("/errorpage403");
        }
      } else {
        navigate("/errorpage403");
      }
    }
  }, [isPermissionsSet, permissionsArray]);
  



  return (
    <>
     {isLoading ? (
      <Loaderimg />
      ) : null}
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
              <h4 className="card-title">Add Addon    <span className="text-danger danger-title">
                                * Atleast One Permission is Required{" "}
                              </span></h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className="col-lg- col-md-12">
                  <Formik
                    initialValues={{ name: "", permissions: [] }}
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
                        )
                        .min(3, "The addon name must be at least 3 characters."),

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
                          <label  className=" form-label mt-4" htmlFor="name"> Add Addon</label>
                          <Field
                            type="text"  autoComplete="off"
                            id="name"
                            name="name"
                            placeholder="Addon Name"
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
                            <div>No permissions available.</div>
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
}

  export default withApi(AddAddon);