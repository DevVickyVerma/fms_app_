import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import axios from "axios";
import { Slide, toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import Loaderimg from "../../../Utils/Loader";

const CompanySageOtherCodes = () => {
    const urlId = useParams();
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState([]);
    const [nominalCodesData, setNominalCodesData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
            data: data,
        },
        onSubmit: (values) => {
            handleSubmit1(values);
        },
    });


    const SuccessToast = (message) => {
        toast.success(message, {
            autoClose: 1000,
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            autoClose: 1000,
            theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
        });
    };
    const ErrorToast = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            autoClose: 1000,
            theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
        });
    };
    function handleError(error) {
        if (error.response && error.response.status === 401) {
            navigate("/login");
            SuccessToast("Invalid access token");
            localStorage.clear();
        } else if (error.response && error.response.data.status_code === "403") {
            navigate("/errorpage403");
        } else {
            const errorMessage = Array?.isArray(error?.response?.data?.message)
                ? error?.response?.data?.message?.join(" ")
                : error?.response?.data?.message;
            ErrorToast(errorMessage);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
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

            const response = await axiosInstance.get(
                `company/sage-other-codes/${urlId?.id}`
            );

            const { data } = response;
            if (data) {
                setData(data?.data?.codes);
                setNominalCodesData(data?.data?.nominal_codes)
                // setis_editable(data.data);

                // Create an array of form values based on the response data
                const formValues = data?.data?.codes?.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        nominal_code: item.nominal_code,
                    };
                });
                // Set the formik values using setFieldValue
                formik.setFieldValue("data", formValues);
            }
        } catch (error) {
            console?.error("API error:", error);
            handleError(error);
        } finally {
            setIsLoading(false); // Set loading state to false after data fetching is complete
        }
    };

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });

    const options = nominalCodesData?.map((nominalCode) => ({
        label: nominalCode.name,
        value: nominalCode.id,
    }));

    const columns = [
        {
            name: "Sage Name",
            selector: (row) => row.name,
            sortable: false,
            width: "50%",
            center: false,
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {row.name !== undefined ? `${row.name}` : ""}
                </span>
            ),
        },
        {
            name: "Nominal Codes",
            selector: (row) => row.nominal_codes,
            sortable: false,
            width: "50%",
            center: true,

            cell: (row, index) =>
                <div
                    className="company-sage-other-code-table-container"
                >
                    <MultiSelect
                        value={options.filter((option) =>
                            formik.values.data[index]?.nominal_code?.includes(option.value)
                        )}
                        onChange={(selectedOptions) =>
                            handleNominalCodeChange(index, selectedOptions)
                        }
                        labelledBy="Select Sites"
                        // disableSearch="true"
                        options={options}
                        showCheckbox="false"
                    />
                </div>
        }
    ];

    const handleNominalCodeChange = (index, selectedOptions) => {
        // Create a copy of the formik values
        const updatedData = [...formik.values.data];

        // Update the nominal_code for the specific row (index)
        updatedData[index].nominal_code = selectedOptions.map((option) => option.value);

        // Set the updated data back to formik values
        formik.setFieldValue('data', updatedData);
    };

    const tableDatas = {
        columns,
        data,
    };

    const handleSubmit1 = async (values) => {
        console.log(values, "handleSubmit1");
        const token = localStorage.getItem("token");

        const formData = new FormData();



        for (const obj of values.data) {
            const {
                id,
                name,
                slug,
                nominal_code,
            } = obj;
            const slugKey = `${slug}`;
            for (let i = 0; i < nominal_code.length; i++) {
                const singleNominalCode = nominal_code[i];
                formData.append(`${slugKey}[${i}]`, singleNominalCode);
            }
        }



        formData.append("company_id", urlId.id);



        try {
            setIsLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/company/update-other-codes`,
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
                SuccessToast(responseData.message);
                navigate("/managecompany");
            } else {
                ErrorToast(responseData.message);
            }
        } catch (error) {
            console.log("Request Error:", error);
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
                            Sage Other Code
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
                                linkProps={{ to: "/managecompany" }}
                            >
                                Manage Company
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Sage Other Code
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <Row className="row-sm">
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">Sage Other Code</h3>
                            </Card.Header>
                            {/* <Card.Body> */}
                            {data?.length > 0 ? (
                                <>
                                    <form onSubmit={(event) => formik.handleSubmit(event)}>
                                        <Card.Body>
                                            <Row>
                                                <div className="table-responsive deleted-table">
                                                    <DataTableExtensions {...tableDatas}>
                                                        <DataTable
                                                            columns={columns}
                                                            data={data}
                                                            noHeader
                                                            defaultSortField="id"
                                                            defaultSortAsc={false}
                                                            striped={true}
                                                            persistTableHead
                                                            highlightOnHover
                                                            searchable={false}
                                                        />
                                                    </DataTableExtensions>
                                                </div>
                                            </Row>
                                        </Card.Body>
                                        <Row>
                                            <Card.Footer>
                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        className="btn btn-primary"
                                                        type="submit"
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            </Card.Footer>
                                        </Row>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                                        alt="MyChartImage"
                                        className="all-center-flex nodata-image"
                                    />
                                </>
                            )}
                            {/* </Card.Body> */}
                        </Card>
                    </Col>
                </Row>
            </>
        </>
    );
};

export default CompanySageOtherCodes;
