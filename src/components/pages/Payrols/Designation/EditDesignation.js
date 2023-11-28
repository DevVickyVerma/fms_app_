import React, { useEffect, useState } from "react";

import {
    Col,
    Row,
    Card,
    Form,
    FormGroup,
    FormControl,
    ListGroup,
    Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import { ErrorAlert } from "../../../../Utils/ToastUtils";
import Loaderimg from "../../../../Utils/Loader";
import withApi from "../../../../Utils/ApiHelper";

const EditDesignation = (props) => {
    const { apidata, isLoading, error, getData, postData } = props;
    const reader = new FileReader();
    const navigate = useNavigate();

    const [AddSiteData, setAddSiteData] = useState([]);
    const [selectedBusinessType, setSelectedBusinessType] = useState("");
    const [subTypes, setSubTypes] = useState([]);
    const [EditSiteData, setEditSiteData] = useState();

    const [previewImage, setPreviewImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    function handleError(error) {
        if (error.response && error.response.status === 401) {
            navigate("/login");
            ErrorAlert("Invalid access token");
            localStorage.clear();
        } else if (
            error.response &&
            error.response.data.card_status_code === "403"
        ) {
            navigate("/errorpage403");
        } else {
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message.join(" ")
                : error.response.data.message;
            ErrorAlert(errorMessage);
        }
    }
    const { id } = useParams();


    useEffect(() => {
        try {
            FetchRoleList();
        } catch (error) {
            handleError(error);
        }
        console.clear();
    }, [id]);

    const FetchRoleList = async () => {
        try {
            const response = await getData(`/payroll/designation/detail/${id}`);

            if (response) {
                formik.setValues(response.data.data);
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("status", values.status);
            formData.append("id", values.id);

            const postDataUrl = "/payroll/designation/update";
            const navigatePath = `/designation-list/`;

            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            status: "",
            id: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("designation code is required"),
            status: Yup.string().required("designation Status is required"),
        }),
        onSubmit: handleSubmit,
    });

    const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

    // Use the isInvalid variable to conditionally set the class name

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <>
                <div>
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Edit Designation</h1>

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
                                    linkProps={{ to: "/designation-list" }}
                                >
                                    Designation List
                                </Breadcrumb.Item>
                                <Breadcrumb.Item
                                    className="breadcrumb-item active breadcrumds"
                                    aria-current="page"
                                >
                                    Edit Designation
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>

                    <Row>
                        <Col lg={12} xl={12} md={12} sm={12}>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h3">Edit Designation</Card.Title>
                                </Card.Header>

                                <div class="card-body">
                                    <form onSubmit={formik.handleSubmit}>
                                        <Row>
                                            <Col lg={6} md={6}>
                                                <div className="form-group">
                                                    <label
                                                        className="form-label mt-4"
                                                        htmlFor="name"
                                                    >
                                                        Designation Name <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        autoComplete="off"
                                                        className={`input101 ${formik.errors.name &&
                                                            formik.touched.name
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="name"
                                                        name="name"
                                                        placeholder="Designation Name"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.name || ""}
                                                    />
                                                    {formik.errors.name &&
                                                        formik.touched.name && (
                                                            <div className="invalid-feedback">
                                                                {formik.errors.name}
                                                            </div>
                                                        )}
                                                </div>
                                            </Col>


                                            <Col lg={6} md={6}>
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="status"
                                                        className="form-label mt-4"
                                                    >
                                                        Designation Status <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className={`input101 ${formik.errors.status &&
                                                            formik.touched.status
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="status"
                                                        name="status"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.status}
                                                    >
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                    {formik.errors.status &&
                                                        formik.touched.status && (
                                                            <div className="invalid-feedback">
                                                                {formik.errors.status}
                                                            </div>
                                                        )}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="text-end">
                                            <Link
                                                type="submit"
                                                className="btn btn-danger me-2 "
                                                to={`/type-designation/`}
                                            >
                                                Cancel
                                            </Link>

                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        </>
    );
};
export default withApi(EditDesignation);


