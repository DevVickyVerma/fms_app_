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
  const [permissions, setPermissions] = useState([]);
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
        const rolesList = response.data.data.map((item) => ({
          id: item.id,
          name: item.display_name,
          permission_name: item.name,
        }));
        console.log(rolesList, "rolesList");
        setPermissions(rolesList);
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

  const handleSubmit=(values)=>{
    console.log(values,"handleSubmit")
  }
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
                    initialValues={{ name: "", permissions: [] }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string().required("Addon is required"),
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
                          <label htmlFor="name"> Edit Addon</label>
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
                        <div className="col-lg-12 col-md-12 p-0">
                          <div className="table-heading">
                            <h2>Permissions</h2>
                          </div>
                        </div>
                        <div className="form-group">
                          {permissions.map((role) => (
                            <div
                              key={role.id}
                              className="form-check form-check-inline"
                            >
                              <Field
                                className={`form-check-input ${
                                  touched.permissions && errors.permissions
                                    ? "is-invalid"
                                    : ""
                                }`}
                                type="checkbox"
                                name="permissions"
                                value={role.permission_name}
                                id={`role-${role.permission_name}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`role-${role.id}`}
                              >
                                {role.name}
                              </label>
                            </div>
                          ))}
                          <ErrorMessage
                            name="permissions"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="text-end">
                          <button
                            type="submit"
                            className="btn btn-primary me-2 "
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
  );
}
