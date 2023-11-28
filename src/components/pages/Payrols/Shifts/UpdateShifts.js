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

const UpdateShifts = (props) => {
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
        if (error.response && error.response.card_status === 401) {
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

    const handleImageChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue("image", file);

        // Preview the image

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

    // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   const formData = new FormData();

    //   formData.append("id", id); // Use the retrieved ID from the URL

    //   const axiosInstance = axios.create({
    //     baseURL: process.env.REACT_APP_BASE_URL,
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   const fetchData = async () => {
    //     try {
    //       const response = await axiosInstance.get(`/card/${id}`);
    //       if (response) {
    //
    //         setEditSiteData(response.data.data);
    //         formik.setValues(response.data.data);
    //         if (formik.values.image) {
    //           setPreviewImage(formik.values.logo);
    //         } else {
    //           setPreviewImage(null);
    //         }
    //       }
    //     } catch (error) {
    //       handleError(error);
    //     }
    //   };

    //   try {
    //     fetchData();
    //   } catch (error) {
    //     handleError(error);
    //   }
    //   console.clear();
    // }, [id]);

    // const token = localStorage.getItem("token");
    // const axiosInstance = axios.create({
    //   baseURL: process.env.REACT_APP_BASE_URL,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

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
            const response = await getData(`/payroll/shift/detail/${id}`);
            if (response) {
                console.log(response.data.data, "formikset");
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
            formData.append("shift_status", values.shift_status);
            formData.append("card_name", values.card_name);
            formData.append("card_status", values.card_status);
            formData.append("id", values.id);
            formData.append("logo", values.image);

            const postDataUrl = "/card/update";
            const navigatePath = "/ManageCards";

            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            card_name: "",
            card_status: "",
            shift_status: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(20, "Must be 20 characters or less")
                .required("card code is required"),
            card_status: Yup.string().required("Card status is required"),
        }),
        onSubmit: handleSubmit,
    });

    const isInvalid = formik.errors && formik.touched.name ? "is-invalid" : "";

    // Use the isInvalid variable to conditionally set the class name
    const inputClass = `form-control ${isInvalid}`;
    const handleBusinessTypeChange = (e) => {
        const selectedType = e.target.value;

        formik.setFieldValue("business_type", selectedType);
        setSelectedBusinessType(selectedType);
        const selectedTypeData = AddSiteData.busines_types.find(
            (type) => type.name === selectedType
        );
        setSubTypes(selectedTypeData.sub_types);
    };

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <>
                <div>
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Edit Card</h1>

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
                                    linkProps={{ to: "/managecards" }}
                                >
                                    Manage Card
                                </Breadcrumb.Item>
                                <Breadcrumb.Item
                                    className="breadcrumb-item active breadcrumds"
                                    aria-current="page"
                                >
                                    Edit Card
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>

                    <Row>
                        <Col lg={12} xl={12} md={12} sm={12}>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h3">Edit cards</Card.Title>
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
                                                        Shift Name <span className="text-danger">*</span>
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
                                                        placeholder="Card Name"
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
                                                        htmlFor="shift_status"
                                                        className="form-label mt-4"
                                                    >
                                                        Shift status
                                                    </label>
                                                    <select
                                                        className={`input101 ${formik.errors.shift_status &&
                                                            formik.touched.shift_status
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="shift_status"
                                                        name="shift_status"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.shift_status}
                                                    >
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                    </select>
                                                    {formik.errors.shift_status &&
                                                        formik.touched.shift_status && (
                                                            <div className="invalid-feedback">
                                                                {formik.errors.shift_status}
                                                            </div>
                                                        )}
                                                </div>
                                            </Col>

                                        </Row>
                                        <div className="text-end">
                                            <Link
                                                type="submit"
                                                className="btn btn-danger me-2 "
                                                to={`/managecards/`}
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
export default withApi(UpdateShifts);