import React from "react";
import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const CompanySageFuels = (props) => {
    const id = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [taxCodes, setTaxCodes] = useState([]);
    const [typesData, setTypesData] = useState([]);

    const [editable, setis_editable] = useState();
    const [isLoading, setIsLoading] = useState(true);

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

            const response = await axiosInstance.get(`/company/sage-fuels/${id?.id}`);

            const { data } = response;
            if (data) {
                setData(data.data.fuels);
                setTaxCodes(data.data.taxCodes);
                setTypesData(data.data.types);
                setis_editable(data.data);

                // Create an array of form values based on the response data
                const formValues = data.data.fuels.map((item) => {
                    return {
                        id: item.id || "",
                        name: item.name || "",
                        negative_nominal_type_id: item.negative_nominal_type_id || "",
                        nominal_tax_code_id: item.nominal_tax_code_id || "",
                        positive_nominal_type_id: item.positive_nominal_type_id || "",
                        sage_account_code: item.sage_account_code || "",
                        sage_nominal_code: item.sage_nominal_code || "",
                        sage_purchage_code: item.sage_purchage_code || "",
                    };
                });
                // Set the formik values using setFieldValue
                formik.setFieldValue("data", formValues);
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

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });

    const handlePositiveNominalData = (index, newValue) => {
        // Update the positive_nominal_type_id of the object at the specified index
        const updatedData = [...formik.values.data]; // Create a copy of the data array
        updatedData[index].positive_nominal_type_id = newValue; // Update the specific value
        formik.setFieldValue("data", updatedData); // Update the data array in Formik
    };
    const handleNegativeNominalData = (index, newValue) => {
        // Update the negative_nominal_type_id of the object at the specified index
        const updatedData = [...formik.values.data]; // Create a copy of the data array
        updatedData[index].negative_nominal_type_id = newValue; // Update the specific value
        formik.setFieldValue("data", updatedData); // Update the data array in Formik
    };
    const handleTaxCodeData = (index, newValue) => {
        // Update the nominal_tax_code_id of the object at the specified index
        const updatedData = [...formik.values.data]; // Create a copy of the data array
        updatedData[index].nominal_tax_code_id = newValue; // Update the specific value
        formik.setFieldValue("data", updatedData); // Update the data array in Formik
    };

    const columns = [
        {
            name: "FUEL",
            selector: (row) => row.name,
            sortable: false,
            width: "14.2%",
            center: false,
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {row.name !== undefined ? `${row.name}` : ""}
                </span>
            ),
        },
        {
            name: "Sage Account Code",
            selector: (row) => row.sage_account_code,
            sortable: false,
            width: "14.2%",
            center: true,

            cell: (row, index) =>
                row.name === "Total" ? (
                    <div>
                        <input
                            type="number"
                            className={"table-input readonly"}
                            value={row.sage_account_code}
                            readOnly
                        />
                    </div>
                ) : (
                    <div>
                        <input
                            type="number"
                            id={`sage_account_code-${index}`}
                            name={`data[${index}].sage_account_code`}
                            className={"table-input "}
                            value={formik.values.data[index]?.sage_account_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        // readOnly
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "Sage Nominal Code",

            selector: (row) => row.sage_nominal_code,
            sortable: false,
            width: "14.2%",
            center: true,

            cell: (row, index) =>
                row.name === "Total" ? (
                    <div>
                        <input
                            type="number"
                            className={"table-input readonly"}
                            value={row.sage_nominal_code}
                            readOnly
                        />
                    </div>
                ) : (
                    <div>
                        <input
                            type="number"
                            id={`sage_nominal_code-${index}`}
                            name={`data[${index}].sage_nominal_code`}
                            className={"table-input "}
                            value={formik.values.data[index]?.sage_nominal_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "Sage Purchage Code",
            selector: (row) => row.sage_purchage_code,
            sortable: false,
            width: "14.2%",
            center: true,

            cell: (row, index) =>
                row.name === "Total" ? (
                    <div>
                        <input
                            type="number"
                            className={"table-input readonly"}
                            value={row.sage_purchage_code}
                            readOnly
                        />
                    </div>
                ) : (
                    <div>
                        <input
                            type="number"
                            id={`sage_purchage_code-${index}`}
                            name={`data[${index}].sage_purchage_code`}
                            className={"table-input"}
                            value={formik.values.data[index]?.sage_purchage_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "Positive Nominal Type",
            selector: (row) => row.positive_nominal_type_id,
            sortable: false,
            width: "14.4%",
            center: true,

            cell: (row, index) =>
                row.name === "Total" ? (
                    <div>
                        <input
                            type="number"
                            className={"table-input readonly"}

                            value={row.positive_nominal_type_id}
                            readOnly
                        />
                    </div>
                ) : (
                    <div>
                        <select
                            name={`data[${index}].positive_nominal_type_id`}
                            value={formik.values.data[index]?.positive_nominal_type_id}
                            onChange={(e) => handlePositiveNominalData(index, e.target.value)}
                            onBlur={formik.handleBlur}
                            className="w-100"
                            style={{ height: "36px" }}
                        >
                            <option value="" className="table-input ">
                                Select Positive Nominal Type Data
                            </option>
                            {typesData?.map((SingleType) => (
                                <option
                                    key={SingleType.id}
                                    value={SingleType.id}
                                    className="table-input "
                                >
                                    {SingleType.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ),
        },
        {
            name: "Negative Nominal Type",
            selector: (row) => row.negative_nominal_type_id,
            sortable: false,
            width: "14.4%",
            center: true,

            cell: (row, index) =>
                row.name === "Total" ? (
                    <div>
                        <input
                            type="number"
                            className={"table-input readonly"}
                            value={row.negative_nominal_type_id}
                            readOnly
                        />
                    </div>
                ) : (
                    <div>
                        <select

                            name={`data[${index}].negative_nominal_type_id`}
                            value={formik.values.data[index]?.negative_nominal_type_id}
                            onChange={(e) => handleNegativeNominalData(index, e.target.value)}
                            onBlur={formik.handleBlur}
                            className="w-100"
                            style={{ height: "36px" }}
                        >
                            <option value="" className="table-input ">
                                Select Negative Nominal Type
                            </option>
                            {typesData?.map((SingleType) => (
                                <option
                                    key={SingleType.id}
                                    value={SingleType.id}
                                    className="table-input "
                                >
                                    {SingleType.name}
                                </option>
                            ))}
                        </select>
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "Nominal Tax Code",
            selector: (row) => row.nominal_tax_code_id,
            sortable: false,
            width: "14%",
            center: true,

            cell: (row, index) =>
                row.name === "Total" ? (
                    <div>
                        <input
                            type="number"
                            className={"table-input readonly"}
                            value={row.nominal_tax_code_id}
                            readOnly
                        />
                    </div>
                ) : (
                    <div className=" w-100">
                        <select

                            name={`data[${index}].nominal_tax_code_id`}
                            value={formik.values.data[index]?.nominal_tax_code_id}
                            onChange={(e) => handleTaxCodeData(index, e.target.value)}
                            onBlur={formik.handleBlur}
                            className="w-100"
                            style={{ height: "36px" }}
                        >
                            <option value="" className="table-input ">
                                Select Nominal Tax Code
                            </option>
                            {taxCodes?.map((SingleType) => (
                                <option
                                    key={SingleType.id}
                                    value={SingleType.id}
                                    className="table-input "
                                >
                                    {SingleType.name}
                                </option>
                            ))}
                        </select>

                        {/* Error handling code */}
                    </div>
                ),
        },

        // ... remaining columns
    ];

    const tableDatas = {
        columns,
        data,
    };

    const formik = useFormik({
        initialValues: {
            data: data,
        },
        onSubmit: (values) => {
            handleSubmit1(values);
        },
    });

    const handleSubmit1 = async (values) => {
        const token = localStorage.getItem("token");

        const formData = new FormData();

        for (const obj of values.data) {
            const {
                id,
                negative_nominal_type_id,
                nominal_tax_code_id,
                positive_nominal_type_id,
                sage_account_code,
                sage_nominal_code,
                sage_purchage_code,
            } = obj;
            const negative_nominal_type_idKey = `negative_nominal_type_id[${id}]`;
            const nominal_tax_code_idKey = `nominal_tax_code_id[${id}]`;
            const positive_nominal_type_idKey = `positive_nominal_type_id[${id}]`;
            const sage_account_codeKey = `sage_account_code[${id}]`;
            const sage_nominal_codeKey = `sage_nominal_code[${id}]`;
            const sage_purchage_codeKey = `sage_purchage_code[${id}]`;

            formData.append(negative_nominal_type_idKey, negative_nominal_type_id);
            formData.append(nominal_tax_code_idKey, nominal_tax_code_id);
            formData.append(positive_nominal_type_idKey, positive_nominal_type_id);
            formData.append(sage_account_codeKey, sage_account_code);
            formData.append(sage_nominal_codeKey, sage_nominal_code);
            formData.append(sage_purchage_codeKey, sage_purchage_code);
        }
        formData.append("company_id", id?.id);

        try {
            setIsLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/company/update-config`,
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
                navigate("/managecompany");
            } else {
                ErrorAlert(responseData.message);
            }
        } catch (error) {
            console.error("Request Error:", error);
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
                            Manage Sage Fuel
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
                                Manage Sage Fuel
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <Row className="row-sm">
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">  Manage Sage Fuel</h3>
                            </Card.Header>
                            <Card.Body>
                                {data?.length > 0 ? (
                                    <>
                                        <form
                                            onSubmit={(event) => formik.handleSubmit(event)}
                                        // onSubmit={formik.SubmitFuelSalesForm}
                                        >
                                            <div className="table-responsive deleted-table">
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
                                            </div>

                                            <Card.Footer className="text-end">
                                                <button className="btn btn-primary me-2" type="submit">
                                                    Save
                                                </button>
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

export default CompanySageFuels;
