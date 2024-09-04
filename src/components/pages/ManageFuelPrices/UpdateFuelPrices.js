import { useEffect, useState } from "react";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import CustomModal from "../../../data/Modal/MiddayModal";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useSelector } from "react-redux";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import { handleError } from "../../../Utils/ToastUtils";
import {
    AiFillCaretDown,
    AiFillCaretRight,
    AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";

const UpdateFuelPrices = (props) => {
    const { apidata, getData, postData, isLoading } = props;

    const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
    const [editable, setis_editable] = useState();
    const navigate = useNavigate();
    const [selectedDrsDate, setSelectedDrsDate] = useState("");
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [headingData, setheadingData] = useState([]);
    const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
        localStorage.getItem("superiorId")
    );
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");

    const [ClientList, setClientList] = useState([]);
    const [CompanyList, setCompanyList] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const formik = useFormik({
        initialValues: {
            columns: [],
            rows: [],
        },
        // validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log("Form Submitted:", values);
        },
    });
    const { id: paramSite_id } = useParams();

    console.log(paramSite_id, "site_idsite_id");

    const UserPermissions = useSelector(
        (state) => state?.data?.data?.permissions || []
    );
    const isFuelHistoryPermissionAvailable =
        UserPermissions?.includes("fuel-price-history");

    useEffect(() => {
        setclientIDLocalStorage(localStorage.getItem("superiorId"));
    }, []);

    const callFetchFilterData = async (filters) => {
        let { client_id, company_id, site_id, client_name, start_date } = filters;

        // Check if the role is Client, then set the client_id and client_name from local storage
        if (localStorage.getItem("superiorRole") === "Client") {
            client_id = localStorage.getItem("superiorId");
            client_name = localStorage.getItem("First_name");
        }

        // Update the filters object with new values
        const updatedFilters = {
            ...filters,
            client_id,
            client_name,
        };

        if (client_id) {
            try {
                const queryParams = new URLSearchParams();
                queryParams.append("site_id", paramSite_id);
                if (start_date) queryParams.append("drs_date", start_date);

                const queryString = queryParams.toString();
                const response = await getData(
                    `site/competitor-price/stats?${queryString}`
                );
                // const response2 = await getData(
                //     `site/fuel-price/mid-day?${queryString}`
                // );
                if (response && response.data && response.data.data) {
                    setGetCompetitorsPrice(response?.data?.data);
                }
                // setData(response.data);
            } catch (error) {
                handleError(error);
            }
        }
    };

    const handleSubmit1 = async (values) => {
        setSelectedCompanyId(values.company_id);
        setSelectedDrsDate(values.start_date);

        try {
            const formData = new FormData();
            formData.append("start_date", values.start_date);
            formData.append("client_id", values.client_id);
            formData.append("company_id", values.company_id);

            // ...

            setSelectedClientId(values?.client_id);
            let clientIDCondition = "";
            if (localStorage.getItem("superiorRole") !== "Client") {
                clientIDCondition = `client_id=${values.client_id}&`;
            } else {
                clientIDCondition = `client_id=${clientIDLocalStorage}&`;
                formik.setFieldValue("client_id", clientIDLocalStorage);
                GetCompanyList(clientIDLocalStorage);
            }
            const response1 = await getData(
                `site/fuel-price?${clientIDCondition}company_id=${values?.company_id}&drs_date=${values.start_date}`
            );

            const { data } = response1;

            if (data) {
                if (data.api_response === "success") {
                    setheadingData(data.data?.head_array || []);
                    setData(data.data || {});
                    setis_editable(data.data?.btn_clickable || false);
                    setIsChecked(data.data?.notify_operator || false);

                    // setNotificationTypes((prevTypes) => ({
                    //   mobileSMS: data.data?.notify_operator || false,
                    //   // email: data?.data?.
                    // }));
                } else {
                    // Handle the error case
                    // You can display an error message or take appropriate action
                    console.error(data?.message);
                }
            } else {
                // Handle the case where data is null
                // You may want to set default values or handle it differently
                setheadingData([]);
                setData({});
                setis_editable(false);
                setIsChecked(false);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const [isNotClient] = useState(
        localStorage.getItem("superiorRole") !== "Client"
    );
    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),
        start_date: Yup.date()
            .required("Date is required")
            .min(new Date("2023-01-01"), "Date cannot be before January 1, 2023"),
    });



    const handleClearForm = async (resetForm) => {
        console.log("celared callled");
        setData(null);
    };


    const [data, setData] = useState();


    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleModalClose = () => {
        setModalOpen(false);
    };



    const handleDataFromChild = async (dataFromChild) => {
        try {
            // Assuming you have the 'values' object constructed from 'dataFromChild'
            const values = {
                start_date: selectedDrsDate,
                client_id: selectedClientId,
                company_id: selectedCompanyId,
            };

            await handleSubmit1(values);
        } catch (error) {
            console.error("Error handling data from child:", error);
        }
    };



    const fetchCommonListData = async () => {
        try {
            const response = await getData("/common/client-list");

            const { data } = response;
            if (data) {
                setClientList(response.data);

                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    setSelectedClientId(clientId);
                    setSelectedCompanyList([]);

                    if (response?.data) {
                        const selectedClient = response?.data?.data?.find(
                            (client) => client.id === clientId
                        );
                        if (selectedClient) {
                            setSelectedCompanyList(selectedClient?.companies);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const GetCompanyList = async (values) => {
        try {
            if (values) {
                const response = await getData(
                    `common/company-list?client_id=${values}`
                );

                if (response) {
                    setCompanyList(response?.data?.data);
                } else {
                    throw new Error("No data available in the response");
                }
            } else {
                console.error("No site_id found ");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };



    useEffect(() => {
        const clientId = localStorage.getItem("superiorId");

        if (localStorage.getItem("superiorRole") !== "Client") {
            fetchCommonListData();
        } else {
            setSelectedClientId(clientId);
            GetCompanyList(clientId);
            formik.setFieldValue("client_id", clientId);
        }
    }, []);


    const handleLinkClick = () => {
        const futurepriceLog = {
            client_id: formik?.values?.client_id,
            company_id: formik?.values?.company_id,
        };
        localStorage.setItem("futurepriceLog", JSON.stringify(futurepriceLog));
        navigate("/future-price-logs");
    };

    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    useEffect(() => {

        if (storedData) {
            let updatedStoredData = JSON.parse(storedData);

            // updatedStoredData = JSON.parse(storedData);
            updatedStoredData.site_id = paramSite_id; // Update the site_id here

            localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));
            // localStorage.setItem(storedKeyName, updatedStoredData)
            handleApplyFilters(updatedStoredData);

            // localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData))
        } else if (localStorage.getItem("superiorRole") === "Client") {
            const storedClientIdData = localStorage.getItem("superiorId");

            if (storedClientIdData) {
                // fetchCompanyList(storedClientIdData)
                const futurepriceLog = {
                    client_id: storedClientIdData,
                };
                // localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));
                handleApplyFilters(futurepriceLog);
            }
        }
    }, [storedKeyName, paramSite_id]); // Add any other dependencies needed here

    const handleApplyFilters = (values) => {
        console.log(values, "submitted values");

        navigate(`/update-fuel-price/${values?.site_id}`);

        if (values?.start_date) {
            handleSubmit1(values);
            callFetchFilterData(values);

        }
    };

    useEffect(() => {
        async function fetchData() {


            const data = {
                columns: [
                    "date",
                    "time",
                    "Unleaded",
                    "Superunleaded",
                    "Diesel",
                    "SuperDiesel",
                    "Adblue",
                    "Other",

                ],
                rows: [
                    {
                        id: uuidv4(),
                        date: "2024-09-02",
                        time: "08:00",
                        Unleaded: 1.459,
                        Superunleaded: 1.86,
                        Diesel: 1.50,
                        SuperDiesel: 4.50,
                        Adblue: 1.20,
                        Other: 1.455,
                        readonly: false,
                        currentprice: true,
                    },
                    {
                        id: uuidv4(),
                        date: "2024-09-02",
                        time: "10:00",
                        Unleaded: 1.53,
                        Superunleaded: 1.23,
                        Diesel: 1.459,
                        SuperDiesel: 1.25,
                        Adblue: 1.50,
                        Other: 1.26,
                        currentprice: false,
                        readonly: true,
                    },
                    {
                        id: uuidv4(),
                        date: "2024-09-02",
                        time: "12:00",
                        Unleaded: 4.50,
                        Superunleaded: 400,
                        Diesel: 1.20,
                        SuperDiesel: 1.459,
                        Adblue: 1.23,
                        Other: 2.36,
                        readonly: false,
                        currentprice: false,
                    },

                ],
            };

            formik.setValues({
                columns: data.columns,
                rows: data.rows,
            });
            const dynamicValidationSchema = Yup.object().shape({
                rows: Yup.array().of(
                    Yup.object().shape(
                        data.columns.reduce((schema, column) => {
                            schema[column] = Yup.string().required(`${column} is required`);
                            return schema;
                        }, {})
                    )
                ),
            });
            // setValidationSchema(dynamicValidationSchema);
        }
        fetchData();
    }, []);

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div className="overflow-container" >
                {modalOpen && (
                    <>
                        <CustomModal
                            open={modalOpen}
                            onClose={handleModalClose}
                            selectedItem={selectedItem}
                            selectedDrsDate={selectedDrsDate}
                            onDataFromChild={handleDataFromChild}
                        />
                    </>
                )}

                <div className="page-header ">
                    <div>
                        <h1 className="page-title"> Update Fuel Price</h1>
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
                                linkProps={{ to: "/fuelprice" }}
                            >
                                Fuel Price
                            </Breadcrumb.Item>

                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Update Fuel Price
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>



                <Row>
                    <Col md={12} xl={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">Update Fuel Price </h3>
                            </Card.Header>
                            <NewFilterTab
                                getData={getData}
                                isLoading={isLoading}
                                isStatic={true}
                                onApplyFilters={handleApplyFilters}
                                validationSchema={validationSchemaForCustomInput}
                                storedKeyName={storedKeyName}
                                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                                lg="4"
                                showClientInput={false}
                                showEntityInput={false}
                                showDateInput={false}
                                showStationValidation={true}
                                showMonthInput={false}
                                showStationInput={true}
                                ClearForm={handleClearForm}
                                showResetBtn={false}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row className="row-sm">
                    <Col lg={12}>
                        <Card
                            style={{
                                //  height: "calc(100vh - 180px)",
                                overflowY: "auto",
                            }}
                        >
                            <Card.Header>
                                <h3 className="card-title w-100 ">
                                    <div className=" d-flex w-100 justify-content-between align-items-center">
                                        <div>
                                            <span>Update {getCompetitorsPrice
                                                ? getCompetitorsPrice?.siteName
                                                : " "} {" Fuel "} Price (10-12-2024, 10:24 AM)
                                            </span>
                                            <span className=" d-flex pt-1 align-items-center" style={{ fontSize: "12px" }}>
                                                <span className="greenboxx me-2 "> </span>
                                                <span className="text-mute">
                                                    Current Price
                                                </span>
                                                {/* <span className="Readonlyboxx me-2 ms-2 "> </span>
                                                <span className="text-mute">
                                                    ReadOnly input
                                                </span> */}
                                            </span>
                                        </div>

                                        {formik?.values?.client_id &&
                                            formik?.values?.company_id &&
                                            isFuelHistoryPermissionAvailable && (
                                                <>
                                                    <Button
                                                        className="btn btn-primary btn-icon text-white"
                                                        onClick={handleLinkClick}
                                                    >
                                                        <span></span>
                                                        Go To Future Price Logs <ExitToAppIcon />
                                                    </Button>
                                                </>
                                            )}
                                    </div>
                                </h3>
                            </Card.Header>
                            <Card.Body>
                                <form onSubmit={formik.handleSubmit}>


                                    <table className="w-100">
                                        <thead className="w-100">
                                            <tr>
                                                {formik.values.columns.map((column, index) => (
                                                    <th key={index}>
                                                        {column.charAt(0).toUpperCase() + column.slice(1)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody className="w-100">
                                            {formik.values.rows.map((row, rowIndex) => (
                                                <tr className="middayModal-tr" key={row.id}>
                                                    {formik.values.columns.map((column, colIndex) => (
                                                        <td className="middayModal-td" key={colIndex}>
                                                            {column === "date" ? (
                                                                <input
                                                                    type="date"
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : "" // Add `fuel-readonly` class if `currentprice` is true
                                                                        } ${row.readonly ? "readonly" : "" // Add `readOnly` class if `readonly` is true
                                                                        }`}
                                                                    title={row[column]} // Use the actual value for the title
                                                                    name={`rows[${rowIndex}].${column}`}
                                                                    value={row[column] || ""}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    readOnly={row.readonly} // Apply readOnly property
                                                                />
                                                            ) : column === "time" ? (
                                                                <input
                                                                    type="time"
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : ""
                                                                        } ${row.readonly ? "readonly" : ""}`}
                                                                    title={row[column]} // Use the actual value for the title
                                                                    name={`rows[${rowIndex}].${column}`}
                                                                    value={row[column] || ""}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    readOnly={row.readonly} // Apply readOnly property
                                                                />
                                                            ) : (
                                                                <input
                                                                    className={`table-input ${row.currentprice ? "fuel-readonly" : ""
                                                                        } ${row.readonly ? "readonly" : ""}`}
                                                                    type="number"
                                                                    name={`rows[${rowIndex}].${column}`}
                                                                    value={row[column] || ""}
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    readOnly={row.readonly} // Apply readOnly property
                                                                    step="0.01" // Allows two decimal places for the price
                                                                />
                                                            )}
                                                            {formik.touched.rows &&
                                                                formik.touched.rows[rowIndex]?.[column] &&
                                                                formik.errors.rows &&
                                                                formik.errors.rows[rowIndex]?.[column] && (
                                                                    <div
                                                                        style={{ color: "red" }}
                                                                        className="readonly"
                                                                    >
                                                                        {formik.errors.rows[rowIndex][column]}
                                                                    </div>
                                                                )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </form>
                            </Card.Body>
                            <Card.Footer>
                                <div className="text-end d-flex align-items-end justify-content-end">

                                    <div
                                        className="pointer"
                                        onClick={() =>
                                            formik.setFieldValue(
                                                "update_tlm_price",
                                                !formik.values.update_tlm_price
                                            )
                                        }
                                    >
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    name="update_tlm_price"
                                                    onChange={formik.handleChange}
                                                    checked={formik.values.update_tlm_price}
                                                    className="form-check-input pointer mx-2"
                                                />
                                                <label
                                                    htmlFor={"update_tlm_price"}
                                                    className="mt-1 ms-6 pointer"
                                                >
                                                    Update TLM Price
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary mt-2 ms-2" type="submit">
                                        Submit
                                    </button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>

                {getCompetitorsPrice && (
                    <>
                        <Row
                            style={{
                                marginBottom: "10px",
                                marginTop: "20px",
                            }}
                        >
                            <Col lg={12} md={12} className="">
                                <Card className="">
                                    <Card.Header className=" my-cardd card-header ">
                                        <div className=" d-flex w-100 justify-content-between align-items-center  card-title w-100 ">
                                            <h4 className="card-title">
                                                {" "}
                                                {getCompetitorsPrice
                                                    ? getCompetitorsPrice?.siteName
                                                    : ""}{" "}
                                                Competitors Stats
                                            </h4>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="my-cardd card-body pb-0 overflow-auto">
                                        <table className="w-100 mb-6">
                                            <tbody>
                                                <tr>
                                                    <th>
                                                        <span className="single-Competitor-heading cardd  d-flex justify-content-between w-99">
                                                            <span>
                                                                Competitors Name <AiFillCaretDown />
                                                            </span>
                                                            <span className="text-end">
                                                                Fuel{" "}
                                                                <span className="hidden-in-small-screen">
                                                                    {" "}
                                                                    Type
                                                                </span>{" "}
                                                                <AiFillCaretRight />
                                                            </span>
                                                        </span>
                                                    </th>
                                                    {Object?.keys(
                                                        getCompetitorsPrice?.competitorListing
                                                    )?.map((fuelType) => (
                                                        <th key={fuelType}>
                                                            <span className="single-Competitor-heading cardd block w-99 ">
                                                                <BsFuelPumpFill /> {fuelType}
                                                            </span>
                                                        </th>
                                                    ))}
                                                </tr>
                                                {getCompetitorsPrice?.competitors?.map(
                                                    (competitorsName, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            <td>
                                                                <div className="single-Competitor-heading d-flex w-99.9 cardd">
                                                                    <p className=" m-0 d-flex align-items-center">
                                                                        <span>
                                                                            <img
                                                                                src={competitorsName?.supplierImage}
                                                                                alt="supplierImage"
                                                                                className=" mx-3"
                                                                                style={{
                                                                                    width: "36px",
                                                                                    height: "36px",
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    </p>

                                                                    <p
                                                                        className=" d-flex flex-column m-0"
                                                                        style={{ minWidth: "55px" }}
                                                                    >
                                                                        <span className="single-Competitor-distance">
                                                                            <AiOutlineArrowRight />{" "}
                                                                            {competitorsName?.station
                                                                                ? "My station"
                                                                                : `${competitorsName?.dist_miles} miles away`}
                                                                        </span>
                                                                        <span style={{ minWidth: "200px" }}>
                                                                            {competitorsName?.name}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            {Object.keys(
                                                                getCompetitorsPrice?.competitorListing
                                                            ).map((fuelType, colIndex) => (
                                                                <td key={colIndex}>
                                                                    <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                                                                        <span className="circle-info">
                                                                            {
                                                                                getCompetitorsPrice
                                                                                    ?.competitorListing?.[fuelType]?.[
                                                                                    rowIndex
                                                                                ]?.last_updated
                                                                            }
                                                                            <span>
                                                                                <OverlayTrigger
                                                                                    placement="top"
                                                                                    overlay={
                                                                                        <Tooltip
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                alignItems: "flex-start",
                                                                                                justifyContent: "flex-start",
                                                                                                width: "300px", // Set your desired width here
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                getCompetitorsPrice
                                                                                                    ?.competitorListing?.[
                                                                                                    fuelType
                                                                                                ]?.[rowIndex]?.last_date
                                                                                            }
                                                                                        </Tooltip>
                                                                                    }
                                                                                >
                                                                                    <p
                                                                                        className=" m-0 single-Competitor-distance"
                                                                                        style={{ cursor: "pointer" }}
                                                                                    >
                                                                                        {" "}
                                                                                        <i
                                                                                            className="fa fa-info-circle ms-1"
                                                                                            aria-hidden="true"
                                                                                            style={{ fontSize: "15px" }}
                                                                                        ></i>{" "}
                                                                                        <span></span>
                                                                                    </p>
                                                                                </OverlayTrigger>
                                                                            </span>
                                                                        </span>

                                                                        <span className=" d-flex justify-content-between align-items-center">
                                                                            <span>
                                                                                {
                                                                                    getCompetitorsPrice
                                                                                        ?.competitorListing?.[fuelType]?.[
                                                                                        rowIndex
                                                                                    ]?.price
                                                                                }
                                                                            </span>

                                                                            <span>
                                                                                {getCompetitorsPrice
                                                                                    ?.competitorListing?.[fuelType]?.[
                                                                                    rowIndex
                                                                                ]?.station ? (
                                                                                    ""
                                                                                ) : (
                                                                                    <>
                                                                                        <>
                                                                                            <span
                                                                                                className="PetrolPrices-img"
                                                                                                style={{
                                                                                                    width: "25px",
                                                                                                    height: "25px",
                                                                                                    fontSize: "20px",
                                                                                                    cursor: "pointer",
                                                                                                    marginLeft: "10px",
                                                                                                    display: "flex",
                                                                                                }}
                                                                                            >
                                                                                                <OverlayTrigger
                                                                                                    placement="top"
                                                                                                    overlay={
                                                                                                        <Tooltip
                                                                                                            style={{
                                                                                                                display: "flex",
                                                                                                                alignItems:
                                                                                                                    "flex-start",
                                                                                                                justifyContent:
                                                                                                                    "flex-start",
                                                                                                            }}
                                                                                                        >
                                                                                                            <span>
                                                                                                                {
                                                                                                                    getCompetitorsPrice
                                                                                                                        ?.competitorListing?.[
                                                                                                                        fuelType
                                                                                                                    ]?.[rowIndex]
                                                                                                                        ?.logo_tip
                                                                                                                }
                                                                                                            </span>
                                                                                                        </Tooltip>
                                                                                                    }
                                                                                                >
                                                                                                    <img
                                                                                                        alt=""
                                                                                                        src={
                                                                                                            getCompetitorsPrice
                                                                                                                ?.competitorListing?.[
                                                                                                                fuelType
                                                                                                            ]?.[rowIndex]?.logo
                                                                                                        }
                                                                                                        className=""
                                                                                                        style={{
                                                                                                            objectFit: "contain",
                                                                                                        }}
                                                                                                    />
                                                                                                </OverlayTrigger>
                                                                                            </span>
                                                                                        </>
                                                                                    </>
                                                                                )}
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </>
    );
};

export default withApi(UpdateFuelPrices);
