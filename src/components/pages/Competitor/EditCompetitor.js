import React, { useEffect, useState } from 'react'
import withApi from '../../../Utils/ApiHelper';
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import axios from 'axios';


const AddCompetitor = ({ getData, postData }) => {
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [CompetitorData, setCompetitorData] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [AddSiteData, setAddSiteData] = useState([]);
    const [selectedSiteList, setSelectedSiteList] = useState([]);
    const [SupplierData, setSupplierData] = useState({});

    const navigate = useNavigate();

    console.log("selectedSiteList", selectedSiteList);
    const { id } = useParams();
    const GetDetails = async () => {
        try {
            const response = await getData(`/site/competitor/detail/${id}`);

            if (response && response.data) {
                console.log(response?.data?.data, "CompetitorData12");


                formik.setFieldValue("name",

                    response?.data?.data?.name
                );
                formik.setFieldValue("address",

                    response?.data?.data?.address
                );
                formik.setFieldValue("supplier",

                    response?.data?.data?.supplier
                );
                formik.setFieldValue("status",

                    response?.data?.data?.status
                );





            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    const Errornotify = (message) => toast.error(message);

    function handleError(error) {
        if (error.response && error.response.status === 401) {
            navigate("/login");
            Errornotify("Invalid access token");
            localStorage.clear();
        } else if (error.response && error.response.data.status_code === "403") {
            navigate("/errorpage403");
        } else {
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message.join(" ")
                : error.response.data.message;
            Errornotify(errorMessage);
        }
    }

    useEffect(() => {
        GetDetails()
        const token = localStorage.getItem("token");
        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const GetSiteData = async () => {
            try {
                const response = await axiosInstance.get("suppliers");

                if (response.data) {
                    setSupplierData(response.data.data);
                }
            } catch (error) {
                handleError(error);
            }
        };
        try {
            GetSiteData();
        } catch (error) {
            handleError(error);
        }
        // console.clear()
        console.clear();
    }, []);






    const formik = useFormik({
        initialValues: {


            name: "",
            supplier: "",

            address: "",
        },
        validationSchema: Yup.object({

            name: Yup.string().required("Competitor name is required"),
            supplier: Yup.string().required("Supplier is required"),
            address: Yup.string().required("Competitor address is required"),

        }),

        onSubmit: (values) => {
            handleSubmit(values)
            console.log(values, "useFormik");
        },
    });

    const fetchCommonListData = async () => {
        try {
            const response = await getData("/client/commonlist");

            const { data } = response;
            if (data) {
                setCompetitorData(response.data);
                // if (
                //     response?.data &&
                //     localStorage.getItem("superiorRole") === "Client"
                // ) {
                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    setSelectedClientId(clientId);

                    setSelectedCompanyList([]);

                    // setShowButton(false);
                    console.log(clientId, "clientId");
                    console.log(AddSiteData, "AddSiteData");

                    if (response?.data) {
                        const selectedClient = response?.data?.data?.find(
                            (client) => client.id === clientId
                        );
                        if (selectedClient) {
                            setSelectedCompanyList(selectedClient?.companies);
                        }
                    }
                    // }
                }
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };





    console.log(CompetitorData, "CompetitorData");

    useEffect(() => {
        fetchCommonListData();
    }, [])






    const handleSubmit = async (values) => {
        console.log(formik.values, "CompetitorData12CompetitorData12")
        try {
            const formData = new FormData();
            console.log(formData, "formData");

            formData.append("name", values.name);
            formData.append("status", values.status);
            formData.append("site_id", id);
            formData.append("address", values.address);
            formData.append("supplier_id", values.supplier);
            formData.append("id", id);


            const postDataUrl = "/site/competitor/add";
            const navigatePath = "/competitor";

            await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    };

    console.log(formik.values, "CompetitorData12")
    return (
        <>
            <div className="page-header ">
                <div>
                    <h1 className="page-title">Add Competitor</h1>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item
                            className="breadcrumb-item"
                            linkAs={Link}
                            linkProps={{ to: "/dashboard" }}
                        >
                            Dashboard
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item"
                            linkAs={Link}
                            linkProps={{ to: "/competitor" }}
                        >
                            Competitor
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            Edit  Competitor
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>


            {/* here I will start Body of competitor */}
            <Row>
                <Col lg={12} xl={12} md={12} sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h3">Add Competitor</Card.Title>
                        </Card.Header>
                        {/* here my body will start */}
                        <Card.Body>
                            <form onSubmit={formik.handleSubmit}>
                                <Row>



                                    <Col lg={4} md={6}>
                                        <div className="form-group">
                                            <label
                                                className="form-label mt-4"
                                                htmlFor="name"
                                            >
                                                Competitor Name<span className="text-danger">*</span>
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
                                                placeholder="Competitor Name "
                                                onChange={formik.handleChange}
                                                value={formik.values.name}
                                            />
                                            {formik.errors.name &&
                                                formik.touched.name && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.name}
                                                    </div>
                                                )}
                                        </div>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <div className="form-group">
                                            <label
                                                htmlFor="address"
                                                className="form-label mt-4"
                                            >
                                                Competitor Address<span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                className={`input101 ${formik.errors.address &&
                                                    formik.touched.address
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                id="address"
                                                name="address"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.address}
                                                placeholder="Competitor Address"
                                            />
                                            {formik.errors.address &&
                                                formik.touched.address && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.address}
                                                    </div>
                                                )}
                                        </div>
                                    </Col>

                                    <Col lg={4} md={6}>
                                        <div className="form-group">
                                            <label
                                                htmlFor="supplier"
                                                className="form-label mt-4"
                                            >
                                                Supplier Id<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`input101 ${formik.errors.supplier &&
                                                    formik.touched.supplier
                                                    ? "is-invalid"
                                                    : ""
                                                    }`}
                                                id="supplier"
                                                name="supplier"
                                                onChange={formik.handleChange}
                                                value={formik.values.supplier}
                                            >
                                                <option value="">Select a Supplier </option>
                                                {SupplierData &&
                                                    SupplierData.length > 0 ? (
                                                    SupplierData.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.supplier_name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>
                                                        No Supplier available
                                                    </option>
                                                )}
                                            </select>
                                            {formik.errors.supplier &&
                                                formik.touched.supplier && (
                                                    <div className="invalid-feedback">
                                                        {formik.errors.supplier}
                                                    </div>
                                                )}
                                        </div>
                                    </Col>


                                </Row>
                                <div className="text-end">
                                    <Link
                                        type="submit"
                                        className="btn btn-danger me-2 "
                                        to={`/competitor/`}
                                    >
                                        Cancel
                                    </Link>

                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </form>













                        </Card.Body>


                    </Card>
                </Col>
            </Row >
        </>
    )
}

export default withApi(AddCompetitor);