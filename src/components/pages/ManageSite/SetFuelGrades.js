import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";
import { useSelector } from "react-redux";

const SetFuelGrades = () => {
    const id = useParams();
    const UserPermissions = useSelector(
        (state) => state?.data?.data?.permissions || [],
    );

    const isEditPermissionAvailable = UserPermissions?.includes('site-fuel-grade-add');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
        },
        onSubmit: (values) => {
            handleSubmit1(values);
        },
    });


    const fetchData = async () => {
        const token = localStorage.getItem("token");

        const axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        try {
            setIsLoading(true); // Set loading state to true before fetching data
            const response = await axiosInstance.get(`/site/fuel-grade/${id?.id}`);
            const { data } = response;
            if (data && data?.data) {
                const userData = response?.data?.data; // Adjust type as needed
                formik.setValues(userData)
            }
        } catch (error) {
            console.error("API error:", error);
            handleError(error);
        } finally {
            setIsLoading(false); // Set loading state to false after data fetching is complete
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });



    const columns = [
        {
            name: "Category Name",
            selector: (row) => row?.category_name,
            sortable: false,
            width: "30%",
            center: false,
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold ">
                    {row?.category_name !== undefined ? `${row?.category_name}` : ""}
                </span>
            ),
        },
        {
            name: "Sub Category Name",
            selector: (row) => row?.sub_category_name,
            sortable: false,
            width: "30%",
            center: false,

            cell: (row,) =>


                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row?.sub_category_name !== undefined ? `${row?.sub_category_name}` : ""}</h6>
                    </div>
                </div>
        },
        {
            name: "Grades",
            selector: (row) => row?.grade,
            sortable: false,
            width: "40%",
            center: false,
            cell: (row, index) =>
                <div>
                    <input
                        type="text"
                        id={`fuels.${index}.grade`}
                        name={`fuels.[${index}].grade`}
                        className={"table-input "}
                        placeholder="Enter Fuel Grade"
                        value={formik?.values?.fuels?.[index]?.grade}
                        onChange={(e) => {
                            const { value } = e.target;
                            formik.setFieldValue(`fuels.[${index}].grade`, value === '0' ? '' : value);
                        }}
                        onBlur={formik.handleBlur}
                    />
                </div>
        },
    ];



    const handleSubmit1 = async (values) => {
        const token = localStorage.getItem("token");


        const formData = new FormData();



        values?.fuels?.forEach((grade) => {
            formData.append(`grade[${grade?.id}]`, grade?.grade);
        });

        formData.append("site_id", id?.id);

        try {
            setIsLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/site/fuel-grade/add`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const responseData = await response.json(); // Read the response once

            if (response.ok) {
                SuccessAlert(responseData.message);
                navigate("/sites");
            } else {
                ErrorAlert(responseData.message);
            }
        } catch (error) {
            // Handle request error
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <>

                <div className="page-header ">
                    <div>
                        <h1 className="page-title">
                            Set Fuel Grades
                        </h1>
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
                                linkProps={{ to: "/sites" }}
                            >
                                Manage Site
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Set Fuel Grades ({formik?.values?.site_name})
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <Row className="row-sm">
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">  Set Fuel Grades ({formik?.values?.site_name ? formik?.values?.site_name : ""})</h3>
                            </Card.Header>
                            <Card.Body>
                                {formik?.values?.fuels?.length > 0 ? (
                                    <>
                                        <form
                                            onSubmit={(event) => formik.handleSubmit(event)}
                                        >
                                            <div className="table-responsive deleted-table">
                                                <DataTable
                                                    columns={columns}
                                                    data={formik?.values?.fuels}
                                                    noHeader={true}
                                                    defaultSortField="id"
                                                    defaultSortAsc={false}
                                                    striped={true}
                                                    persistTableHead={true}
                                                    highlightOnHover={true}
                                                    searchable={false}
                                                />
                                            </div>


                                            <Card.Footer className="text-end">

                                                {isEditPermissionAvailable && (<>
                                                    <button className="btn btn-primary me-2" type="submit">
                                                        Save
                                                    </button>
                                                </>)}

                                            </Card.Footer>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={require("../../../assets/images/commonimages/no_data.png")}
                                            alt="MyChartImage"
                                            className="all-center-flex nodata-image"
                                        />
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        </>
    );
};


export default withApi(SetFuelGrades);