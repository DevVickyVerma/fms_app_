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
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const EditAddon = (props) => {
  const { isLoading, getData, } = props;
  const [AddonpermissionsList, setPermissions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [userpermissions, setUserPermissions] = useState([]);
  const [edituserDetails, setEdituserDetails] = useState("");
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  const [permissionArray, setPermissionArray] = useState([]);


  useEffect(() => {
    getData("/permission-list")
      .then((response) => {
        setUserPermissions(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch addon details and set permissions
    const addonId = localStorage.getItem("EditAddon");
    const formData = new FormData();
    formData.append("addon_id", addonId);

    FetchPermisionList();
    console.clear();
  }, []);

  const FetchPermisionList = async () => {
    try {
      const addonId = localStorage.getItem("EditAddon");
      const formData = new FormData();
      formData.append("addon_id", addonId);
      const response = await getData("addon/detail", addonId, formData);

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

  // Initialize a Set with the initial permissionArray
  const initialPermissionSet = new Set(permissionArray);
  const handleSelectAllPermissions = (heading, checked) => {
    const updatedSelectAllPermissions = { ...selectAllPermissions };
    updatedSelectAllPermissions[heading] = checked;
    setSelectAllPermissions(updatedSelectAllPermissions);

    const updatedPermissionSet = new Set(initialPermissionSet);

    // If checked, add all child permissions to the set, else remove them
    if (checked) {
      AddonpermissionsList.data.addon_permissions[heading].names.forEach(
        (nameItem) => {
          updatedPermissionSet.add(nameItem.permission_name);
        }
      );
    } else {
      AddonpermissionsList.data.addon_permissions[heading].names.forEach(
        (nameItem) => {
          updatedPermissionSet.delete(nameItem.permission_name);
        }
      );
    }

    const updatedPermissionArray = [...updatedPermissionSet];

    setPermissionArray(updatedPermissionArray);
    formik.setFieldValue("permissionsList", updatedPermissionArray);
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
                        {AddonpermissionsList.data &&
                          AddonpermissionsList.data.addon_permissions && (
                            <div>
                              {Object.keys(
                                AddonpermissionsList.data.addon_permissions
                              ).map((heading) => (
                                <div key={heading}>
                                  <div className="table-heading d-flex">
                                    <div className="heading-input">
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
                                          className={`form-check-input ${formik.touched.permissionsList &&
                                            formik.errors.permissionsList
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                          type="checkbox"
                                          name={`permissionsList.${nameItem.permission_name}`}
                                          id={`permissionsList-${nameItem.id}`}
                                          checked={initialPermissionSet.has(
                                            nameItem.permission_name
                                          )}
                                          onChange={() => {
                                            const permissionName =
                                              nameItem.permission_name;
                                            const updatedPermissionSet =
                                              new Set(initialPermissionSet);

                                            if (
                                              updatedPermissionSet.has(
                                                permissionName
                                              )
                                            ) {
                                              updatedPermissionSet.delete(
                                                permissionName
                                              );
                                            } else {
                                              updatedPermissionSet.add(
                                                permissionName
                                              );
                                            }

                                            const updatedPermissionArray = [
                                              ...updatedPermissionSet,
                                            ];

                                            setPermissionArray(
                                              updatedPermissionArray
                                            );

                                            // Check if all child checkboxes are checked, update the parent checkbox
                                            const allChildChecked =
                                              AddonpermissionsList.data.addon_permissions[
                                                heading
                                              ].names.every((item) =>
                                                updatedPermissionSet.has(
                                                  item.permission_name
                                                )
                                              );

                                            setSelectAllPermissions({
                                              ...selectAllPermissions,
                                              [heading]: allChildChecked,
                                            });

                                            formik.setFieldValue(
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
