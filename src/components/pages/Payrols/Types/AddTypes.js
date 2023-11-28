import React, { useEffect, useState } from "react";

import { Col, Row, Card, Form, FormGroup, Breadcrumb } from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FileInput, ImageInput } from "formik-file-and-image-input/lib";
import Loaderimg from "../../../../Utils/Loader";
import withApi from "../../../../Utils/ApiHelper";

const AddTypes = (props) => {
    const { apidata, isLoading, error, getData, postData } = props;
    const [previewImage, setPreviewImage] = useState(null);
    let companyId = localStorage.getItem("cardsCompanyId") ? localStorage.getItem("cardsCompanyId") : "";

    const handleSubmit1 = async (values) => {
        console.log(values);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("status", values.type_status);
            formData.append("company_id", companyId);

            const postDataUrl = "payroll/types/add";

            const navigatePath = "/type-list";
            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
            // await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

        } catch (error) {
            console.log(error); // Set the submission state to false if an error occurs
        }
    };

    const navigate = useNavigate();
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [isPermissionsSet, setIsPermissionsSet] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const UserPermissions = useSelector((state) => state?.data?.data);

    useEffect(() => {
        if (UserPermissions) {
            setPermissionsArray(UserPermissions?.permissions);
            setIsPermissionsSet(true);
        }
    }, [UserPermissions]);

    useEffect(() => {
        if (isPermissionsSet) {
            const isAddPermissionAvailable =
                permissionsArray?.includes("type-create");

            if (permissionsArray?.length > 0) {
                if (isAddPermissionAvailable) {
                    // Perform action when permission is available
                    // Your code here
                } else {
                    // Perform action when permission is not available
                    // Your code here
                    navigate("/errorpage403");
                }
            }
            // else {
            //   navigate("/errorpage403");
            // }
        }
    }, [isPermissionsSet, permissionsArray]);

    const handleImageChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue("image", file);

        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (event, setFieldValue) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        setFieldValue("image", file);

        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <>
                <div>
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Add Type</h1>

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
                                    linkProps={{ to: "/type-list/" }}
                                >
                                    Type
                                </Breadcrumb.Item>
                                <Breadcrumb.Item
                                    className="breadcrumb-item active breadcrumds"
                                    aria-current="page"
                                >
                                    Add Type
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>

                    <Row>
                        <Col lg={12} xl={12} md={12} sm={12}>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h3">Add Type</Card.Title>
                                </Card.Header>
                                <Formik
                                    initialValues={{
                                        name: "",
                                        type_status: "1",
                                    }}
                                    validationSchema={Yup.object({
                                        name: Yup.string()
                                            .required(" Type Name is required"),


                                        type_status: Yup.string().required(
                                            "Type Status is required"
                                        ),
                                    })}
                                    onSubmit={(values) => {
                                        handleSubmit1(values);
                                    }}
                                >
                                    {({ handleSubmit, errors, touched, setFieldValue }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Card.Body>
                                                <Row>
                                                    <Col lg={6} md={6}>
                                                        <FormGroup>
                                                            <label
                                                                className=" form-label mt-4"
                                                                htmlFor="name"
                                                            >
                                                                Type Name
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <Field
                                                                type="text"
                                                                autoComplete="off"
                                                                // className="form-control"
                                                                className={`input101 ${errors.name && touched.name
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                id="name"
                                                                name="name"
                                                                placeholder="Type Name"
                                                            />
                                                            <ErrorMessage
                                                                component="div"
                                                                className="invalid-feedback"
                                                                name="name"
                                                            />
                                                        </FormGroup>
                                                    </Col>


                                                    <Col lg={6} md={6}>
                                                        <FormGroup>
                                                            <label
                                                                className=" form-label mt-4"
                                                                htmlFor="type_status"
                                                            >
                                                                Type Status
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <Field
                                                                as="select"
                                                                className={`input101 ${errors.type_status && touched.type_status
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                id="type_status"
                                                                name="type_status"
                                                            >
                                                                <option value="1">Active</option>
                                                                <option value="0">Inactive</option>
                                                            </Field>
                                                            <ErrorMessage
                                                                component="div"
                                                                className="invalid-feedback"
                                                                name="type_status"
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                </Row>
                                            </Card.Body>
                                            <Card.Footer className="text-end">
                                                <Link
                                                    type="submit"
                                                    className="btn btn-danger me-2 "
                                                    to={`/manageCards/`}
                                                >
                                                    Cancel
                                                </Link>
                                                <button className="btn btn-primary me-2" type="submit">
                                                    Add
                                                </button>
                                            </Card.Footer>
                                        </Form>
                                    )}
                                </Formik>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        </>
    );
};
export default withApi(AddTypes);

