import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CompanySageFuels = (props) => {
    const {
        apidata,
        error,
        getData,
        postData,
        company_id,
        client_id,
        site_id,
        start_date,
        sendDataToParent,
    } = props;

    const id = useParams()

    const handleButtonClick = () => {
        const allPropsData = {
            company_id,
            client_id,
            site_id,
            start_date,
        };

        // Call the callback function with the object containing all the props
        sendDataToParent(allPropsData);
    };


    // const [data, setData] = useState()
    const [data, setData] = useState([]);
    const [taxCodes, setTaxCodes] = useState([]);
    const [typesData, setTypesData] = useState([]);

    const [Apidata, setApiData] = useState([]);
    const [editable, setis_editable] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
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
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message.join(" ")
                : error.response.data.message;
            ErrorToast(errorMessage);
        }
    }
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
                `/company/sage-fuels/${id?.id}`
            );

            const { data } = response;
            if (data) {
                setData(data.data.fuels);
                setTaxCodes(data.data.taxCodes)
                setTypesData(data.data.types)
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

    const SubmitFuelSalesForm = async (values) => {
        console.log("aftersubmist", values);


        // const token = localStorage.getItem("token");

        // // Create a new FormData object
        // const formData = new FormData();

        // values.data.forEach((obj) => {
        //     const id = obj.id;
        //     const grossValueKey = `negative_nominal_type_id[${id}]`;
        //     const discountKey = `discount[${id}]`;
        //     const nettValueKey = `nominal_tax_code_id[${id}]`;
        //     // const actionKey = `action[${id}]`;

        //     const grossValue = obj.negative_nominal_type_id;
        //     const discount = obj.discount;
        //     const nettValue = obj.nominal_tax_code_id;
        //     // const action = obj.action;

        //     formData.append(grossValueKey, grossValue);
        //     formData.append(discountKey, discount);
        //     formData.append(nettValueKey, nettValue);
        // });

        // formData.append("site_id", site_id);
        // formData.append("drs_date", start_date);

        // try {
        //     setIsLoading(true);
        //     const response = await fetch(
        //         `${process.env.REACT_APP_BASE_URL}/fuel-sale/update`,
        //         {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             body: formData,
        //         }
        //     );

        //     const responseData = await response.json(); // Read the response once

        //     if (response.ok) {
        //         SuccessToast(responseData.message);
        //         handleButtonClick();
        //         window.scrollTo({ top: 0, behavior: "smooth" });
        //     } else {
        //         ErrorToast(responseData.message);

        //         // Handle specific error cases if needed
        //     }
        // } catch (error) {
        //     console.error("API error:", error);
        //     handleError(error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });


    const handlePositiveNominalData = (index, newValue) => {
        // Update the positive_nominal_type_id of the object at the specified index
        const updatedData = [...formik.values.data]; // Create a copy of the data array
        updatedData[index].positive_nominal_type_id = newValue; // Update the specific value
        formik.setFieldValue('data', updatedData); // Update the data array in Formik
    };
    const handleNegativeNominalData = (index, newValue) => {
        // Update the negative_nominal_type_id of the object at the specified index
        const updatedData = [...formik.values.data]; // Create a copy of the data array
        updatedData[index].negative_nominal_type_id = newValue; // Update the specific value
        formik.setFieldValue('data', updatedData); // Update the data array in Formik
    }
    const handleTaxCodeData = (index, newValue) => {
        // Update the nominal_tax_code_id of the object at the specified index
        const updatedData = [...formik.values.data]; // Create a copy of the data array
        updatedData[index].nominal_tax_code_id = newValue; // Update the specific value
        formik.setFieldValue('data', updatedData); // Update the data array in Formik
    }



    const columns = [
        {
            name: "FUEL",
            selector: (row) => row.name,
            sortable: false,
            width: "10%",
            center: false,
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {row.name !== undefined ? `${row.name}` : ""}
                </span>
            ),
        },
        {
            name: "sage_account_code",
            selector: (row) => row.sage_account_code,
            sortable: false,
            width: "10%",
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
                            className={"table-input readonly"}
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
            name: "sage_nominal_code",

            selector: (row) => row.sage_nominal_code,
            sortable: false,
            width: "10%",
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
                            className={"table-input readonly"}
                            value={formik.values.data[index]?.sage_nominal_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "sage_purchage_code",
            selector: (row) => row.sage_purchage_code,
            sortable: false,
            width: "10%",
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
                            className={"table-input readonly"}
                            value={formik.values.data[index]?.sage_purchage_code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {/* Error handling code */}
                    </div>
                ),
        },
        {
            name: "positive_nominal_type_id",
            selector: (row) => row.positive_nominal_type_id,
            sortable: false,
            width: "10%",
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
                            name="positive_nominal_type_id" // Set the name attribute to the corresponding field name
                            value={row.positive_nominal_type_id}
                            onChange={(e) => handlePositiveNominalData(index, e.target.value)}
                            onBlur={formik.handleBlur}
                            className="w-100"
                            style={{ height: "36px" }}
                        >
                            <option value="" className="table-input readonly">
                                Select Positive Nominal Type Data
                            </option>
                            {typesData?.map((SingleType) => (
                                <option
                                    key={SingleType.id}
                                    value={SingleType.id}
                                    className="table-input readonly"
                                >
                                    {SingleType.name}
                                </option>
                            ))}
                        </select>
                        {/* Error handling code */}
                    </div >
                ),
        },
        {
            name: "negative_nominal_type_id",
            selector: (row) => row.negative_nominal_type_id,
            sortable: false,
            width: "10%",
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
                            name="negative_nominal_type_id" // Set the name attribute to the corresponding field name
                            value={row.negative_nominal_type_id}
                            onChange={(e) => handleNegativeNominalData(index, e.target.value)}
                            onBlur={formik.handleBlur}
                            className="w-100"
                            style={{ height: "36px" }}
                        >
                            <option value="" className="table-input readonly">
                                Select Positive Nominal Type Data
                            </option>
                            {typesData?.map((SingleType) => (
                                <option
                                    key={SingleType.id}
                                    value={SingleType.id}
                                    className="table-input readonly"
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
            name: "nominal_tax_code_id",
            selector: (row) => row.nominal_tax_code_id,
            sortable: false,
            width: "10%",
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
                            name="nominal_tax_code_id" // Set the name attribute to the corresponding field name
                            value={row.nominal_tax_code_id}
                            onChange={(e) => handleTaxCodeData(index, e.target.value)}
                            onBlur={formik.handleBlur}
                            className="w-100"
                            style={{ height: "36px" }}
                        >
                            <option value="" className="table-input readonly">
                                Select Positive Nominal Type Data
                            </option>
                            {typesData?.map((SingleType) => (
                                <option
                                    key={SingleType.id}
                                    value={SingleType.id}
                                    className="table-input readonly"
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
            // console.log(values, "zxczxc");
        },
        // onSubmit: (SubmitFuelSalesForm),
        // validationSchema: validationSchema,
    });

    const handleSubmit1 = async (values, event) => {
        const token = localStorage.getItem("token");

        const transformedData = values?.data.map(item => {
            return {
                id: item.id,
                name: item.name,
                negative_nominal_type_id: item.negative_nominal_type_id || "",
                nominal_tax_code_id: item.nominal_tax_code_id || "",
                positive_nominal_type_id: item.positive_nominal_type_id || "",
                sage_account_code: item.sage_account_code || "",
                sage_nominal_code: item.sage_nominal_code || "",
                sage_purchage_code: item.sage_purchage_code || ""
            };
        });

        // Now, the transformedData array contains the data in the desired format
        console.log(transformedData, "transformedData");

        console.log(values, "mydata");

        const formData = new FormData();

        for (const obj of values.data) {
            const {
                id,
                name,
                metered_sale,
                metered_sale_value,
                adjustment,
                adjustment_euro,
                adjusted_sale,
                adjusted_sale_value,
                actual_sales,
                due_sales,
                tests,
                bunkered_sale,
            } = obj;

            console.log(obj.id, "opbj");
            const fuel_priceKey = `fuel_price[${id}]`;
            const idkey = obj.id;
            const nameKey = `name[${id}]`;
            const discountKey = `metered_sale[${id}]`;
            const nettValueKey = `metered_sale_value[${id}]`;
            const salesValueKey = `adjustment[${id}]`;
            const actionKey = `adjustment_euro[${id}]`;
            const bookStockKey = `adjusted_sale[${id}]`;
            const adjusted_sale_valueKey = `adjusted_sale_value[${id}]`;
            const adjusted_sale_valueLtKey = `actual_sales[${id}]`;
            const adjusted_sale_valuePerKey = `due_sales[${id}]`;
            const testsKey = `tests[${id}]`;
            const bunkered_saleKey = `bunkered_sale[${id}]`;

            formData.append(fuel_priceKey, name);

            // formData.append("idkey", idkey);
            // formData.append("name", obj.name);
            // formData.append("negative_nominal_type_id", obj.negative_nominal_type_id);
            // formData.append("nominal_tax_code_id", obj.nominal_tax_code_id);

            // formData.append("positive_nominal_type_id", obj.positive_nominal_type_id);

            // formData.append("sage_account_code", obj.sage_account_code);

            // formData.append("sage_nominal_code", obj.sage_nominal_code);
            // formData.append("sage_purchage_code", obj.sage_purchage_code);
        }


        formData.append("site_id", site_id);
        formData.append("drs_date", start_date);
        console.log(formData, "afterloop")

        try {
            setIsLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/fuel-inventory/update`,
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
                //
                SuccessToast(responseData.message);
                handleButtonClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                ErrorToast(responseData.message);

                // Handle specific error cases if needed
            }
        } catch (error) {
            // Handle request error
        } finally {
            setIsLoading(false);
        }
    };




    // console.log("formikvakuye", formik?.values)

    return (
        <>
            {/* {isLoading ? <Loaderimg /> : null} */}
            <>
                <Row className="row-sm">
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">Fuel Sales</h3>
                            </Card.Header>
                            <Card.Body>
                                {data?.length > 0 ? (
                                    <>
                                        <form
                                            onSubmit={(event) => formik.handleSubmit(event)}
                                        // onSubmit={formik.SubmitFuelSalesForm}
                                        >
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

                                            <Card.Footer className="text-end">
                                                <button
                                                    className="btn btn-primary me-2"
                                                    type="submit"
                                                >
                                                    Update
                                                </button>
                                            </Card.Footer>
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
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        </>
    );
};

export default CompanySageFuels;
