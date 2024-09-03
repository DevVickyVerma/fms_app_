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
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import CustomModal from "../../../data/Modal/MiddayModal";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useSelector } from "react-redux";
import moment from "moment";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import { handleError } from "../../../Utils/ToastUtils";
import { AiFillCaretDown, AiFillCaretRight, AiOutlineArrowRight } from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";


const UpdateFuelPrices = (props) => {
    const { apidata, getData, postData, isLoading } =
        props;

    const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
    const [editable, setis_editable] = useState();
    const navigate = useNavigate()
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
    const [SiteList, setSiteList] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [notificationTypes, setNotificationTypes] = useState({
        mobileSMS: false,
        email: false,
    });
    const UserPermissions = useSelector(
        (state) => state?.data?.data?.permissions || [],
    );
    const isFuelHistoryPermissionAvailable = UserPermissions?.includes('fuel-price-history');

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
            client_name
        };


        if (client_id) {
            try {
                const queryParams = new URLSearchParams();
                if (site_id) queryParams.append('site_id', site_id);
                if (start_date) queryParams.append('drs_date', start_date);

                const queryString = queryParams.toString();
                const response = await getData(`site/competitor-price/stats?${queryString}`);
                if (response && response.data && response.data.data) {

                    setGetCompetitorsPrice(response?.data?.data);
                }
                // setData(response.data);
            } catch (error) {
                handleError(error)
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

            setSelectedClientId(values?.client_id)
            let clientIDCondition = "";
            if (localStorage.getItem("superiorRole") !== "Client") {
                clientIDCondition = `client_id=${values.client_id}&`;
            } else {
                clientIDCondition = `client_id=${clientIDLocalStorage}&`;
                formik.setFieldValue("client_id", clientIDLocalStorage)
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


    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),
        start_date: Yup.date()
            .required("Date is required")
            .min(
                new Date("2023-01-01"),
                "Date cannot be before January 1, 2023"
            ),
    });

    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
            site_id: "",
            start_date: "",
            notify_operator: "",
            email: false,
        },
        validationSchema: validationSchemaForCustomInput,
        // validationSchema: Yup.object({
        //   company_id: Yup.string().required("Company is required"),
        //   start_date: Yup.date()
        //     .required("Date is required")
        //     .min(
        //       new Date("2023-01-01"),
        //       "Date cannot be before January 1, 2023"
        //     ),
        // }),

        onSubmit: (values) => {
            localStorage.setItem('fuelSellingPrice', JSON.stringify(values));
            handleSubmit1(values);
        },
    });



    const handleClearForm = async (resetForm) => {

        console.log("celared callled");
        setData(null)
        // formik.resetForm()
        // formik.setFieldValue("site_id", "")
        // formik.setFieldValue("start_date", "")
        // formik.setFieldValue("client_id", "")
        // formik.setFieldValue("company_id", "")
        // formik.setFieldValue("endDate", "")
        // formik.setFieldValue("startDate", "")
        // formik.resetForm()
        // setSelectedCompanyList([]);
        // setSelectedClientId("");
        // setCompanyList([])
        // setData(null)
        // localStorage.removeItem("fuelSellingPrice")
        // const clientId = localStorage.getItem("superiorId");

        // Check if the role is Client, then set the client_id and client_name from local storage

        // if (localStorage.getItem("superiorRole") !== "Client") {
        //   fetchCommonListData();
        //   formik.setFieldValue("client_id", "")
        //   setCompanyList([])
        // } else {
        //   setSelectedClientId(clientId);
        //   GetCompanyList(clientId);
        //   formik.setFieldValue("client_id", clientId)
        // }
    };

    console.log(formik?.values, "formik valuesssss");




    const [data, setData] = useState();
    const renderTableHeader = () => {
        return (
            <tr className="fuelprice-tr" style={{ padding: "0px" }}>
                {data?.head_array &&
                    data.head_array.map((item, index) => <th key={index}>{item}</th>)}
            </tr>
        );
    };

    const hadndleShowDate = () => {
        const inputDateElement = document.querySelector('input[type="date"]');
        inputDateElement.showPicker();
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemDate, setSelectedItemDate] = useState();
    const handleModalOpen = (item) => {
        setSelectedItem(item); // Set the selected item
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const renderTableData = () => {
        return data?.listing?.map((item) => (
            <tr className="fuelprice-tr" key={item?.id} style={{ padding: "0px" }}>
                <td style={{ maxWidth: "14.28%" }}>
                    <span
                        className={
                            item?.link_clickable
                                ? "text-muted fs-15 fw-semibold text-center fuel-site-name"
                                : "text-muted fs-15 fw-semibold text-center"
                        }
                        onClick={item?.link_clickable ? () => handleModalOpen(item) : null}
                    >
                        {item?.site_name} <span className="itemcount">{item?.count}</span>
                    </span>
                </td>
                <td>
                    <span className="text-muted fs-15 fw-semibold text-center ">
                        {item?.time}
                    </span>
                </td>

                {Array.isArray(item?.fuels) &&
                    item.fuels.map((fuel, index) => (
                        <td key={index}>
                            {Array.isArray(fuel) ? (
                                <input type="text" className="table-input readonly" readOnly />
                            ) : (
                                <input
                                    type="number"
                                    step="0.010"
                                    className={`table-input ${fuel?.status === "UP"
                                        ? "table-inputGreen"
                                        : fuel?.status === "DOWN"
                                            ? "table-inputRed"
                                            : ""
                                        } ${!fuel?.is_editable ? "readonly" : ""}`}
                                    value={fuel?.price}
                                    readOnly={!fuel?.is_editable}
                                    id={fuel?.id}
                                    onChange={(e) =>
                                        handleInputChange(e.target.id, e.target.value)
                                    }
                                />
                            )}
                        </td>
                    ))}
            </tr>
        ));
    };

    const handleInputChange = (id, value) => {
        const updatedData = {
            ...data,
            listing: data?.listing?.map((item) => ({
                ...item,
                fuels: item.fuels.map((fuel) =>
                    fuel.id === id ? { ...fuel, price: value } : fuel
                ),
            })),
        };

        setData(updatedData);
    };

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            data?.listing?.forEach((item) => {
                const siteId = item.id;

                item.fuels.forEach((fuel) => {
                    if (!Array.isArray(fuel) && fuel.price !== undefined) {
                        const priceId = fuel.id;
                        const fieldKey = `fuels[${siteId}][${priceId}]`;
                        const timeKey = `time[${siteId}][${priceId}]`;
                        const fieldValue = fuel.price.toString();
                        const fieldtime = fuel.time;
                        formData.append(fieldKey, fieldValue);
                        formData.append(timeKey, fieldtime);
                    }
                });
            });

            // const isMobileSelected = selected.some(option => option.value === "mobile-sms");
            // const isEmailSelected = selected.some(option => option.value === "email");

            setSelectedItemDate(selectedDrsDate);
            formData.append("send_sms", notificationTypes?.mobileSMS);
            formData.append("notify_operator", notificationTypes?.email);
            formData.append("drs_date", selectedDrsDate);
            formData.append("client_id", selectedClientId);
            formData.append("company_id", selectedCompanyId);
            // setSelectedClientId()
            const response = await postData(
                "/site/fuel-price/update-midday",
                formData
            );

            if (apidata.status_code === "200") {
                const values = {
                    start_date: selectedDrsDate,
                    client_id: selectedClientId,
                    company_id: selectedCompanyId,
                };
                handleModalClose()
                handleSubmit1(values);
            }
            // Set the submission state to false after the API call is completed
        } catch (error) {
            console.log(error); // Set the submission state to false if an error occurs
        }
    };

    const SendNotification = (event) => {
        setIsChecked(event.target.checked);
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

    const headerHeight = 135;

    const containerStyles = {
        // overflowY: "scroll", // or 'auto'
        // overflowX: "hidden", // or 'auto'
        // maxHeight: "100vh", // Set a maximum height for the container
        // maxHeight: `calc(100vh - ${headerHeight}px)`,
        // border: "1px solid #ccc",
        // backgroundColor: "#f5f5f5",
        // padding: "10px",
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

    const GetSiteList = async (values) => {
        try {
            if (values) {
                const response = await getData(`common/site-list?company_id=${values}`);

                if (response) {

                    setSiteList(response?.data?.data);
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
            formik.setFieldValue("client_id", clientId)
        }
    }, []);

    // useEffect(() => {
    //   const fuelSellingPrice = JSON.parse(localStorage.getItem('fuelSellingPrice'));
    //   if (fuelSellingPrice) {
    //     formik.setFieldValue('client_id', fuelSellingPrice.client_id);
    //     formik.setFieldValue('company_id', fuelSellingPrice.company_id);
    //     formik.setFieldValue('start_date', fuelSellingPrice.start_date);


    //     GetCompanyList(fuelSellingPrice.client_id);
    //     GetSiteList(fuelSellingPrice.company_id)
    //     handleSubmit1(fuelSellingPrice);
    //   }
    // }, []);


    const handleLinkClick = () => {
        const futurepriceLog = {
            client_id: formik?.values?.client_id,
            company_id: formik?.values?.company_id,
        };
        localStorage.setItem('futurepriceLog', JSON.stringify(futurepriceLog));
        navigate('/future-price-logs');
    };



    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    useEffect(() => {

        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
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

    }, [storedKeyName,]); // Add any other dependencies needed here



    const handleApplyFilters = (values) => {
        console.log(values, "submitted values");

        if (values?.start_date) {
            handleSubmit1(values)
            callFetchFilterData(values)
        }

    }


    const dataa = getCompetitorsPrice?.competitorListing;


    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div className="overflow-container" style={containerStyles}>

                {modalOpen && (<>
                    <CustomModal
                        open={modalOpen}
                        onClose={handleModalClose}
                        selectedItem={selectedItem}
                        selectedDrsDate={selectedDrsDate}
                        onDataFromChild={handleDataFromChild}
                    />

                </>)}

                <div className="page-header ">
                    <div>
                        <h1 className="page-title"> Fuel Price</h1>
                        <Breadcrumb className="breadcrumb">
                            <Breadcrumb.Item
                                className="breadcrumb-item"
                                linkAs={Link}
                                linkProps={{ to: "/dashboard" }}
                            >
                                Dashboard
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Fuel Price
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>



                <Row>
                    <Col md={12} xl={12}>
                        <Card>

                            <NewFilterTab
                                getData={getData}
                                isLoading={isLoading}
                                isStatic={true}
                                onApplyFilters={handleApplyFilters}
                                validationSchema={validationSchemaForCustomInput}
                                storedKeyName={storedKeyName}
                                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                                lg="4"
                                showStationValidation={false}
                                showMonthInput={false}
                                showDateInput={true}
                                showStationInput={false}
                                ClearForm={handleClearForm}
                            />

                        </Card>
                    </Col>
                </Row>
                <Row className="row-sm">
                    <Col lg={12}>
                        <Card
                            style={{
                                //  height: "calc(100vh - 180px)",
                                overflowY: "auto"
                            }}
                        >
                            <Card.Header>
                                <h3 className="card-title w-100 ">

                                    <div className=" d-flex w-100 justify-content-between align-items-center">
                                        <span>
                                            Fuel Price (10-12-2024, 10:24 AM)
                                        </span>

                                        {formik?.values?.client_id && formik?.values?.company_id && isFuelHistoryPermissionAvailable && (<>
                                            <Button className="btn btn-primary btn-icon text-white" onClick={handleLinkClick}>
                                                <span>
                                                </span>
                                                Go To Future Price Logs <ExitToAppIcon />
                                            </Button>
                                        </>)}


                                    </div>
                                </h3>
                            </Card.Header>
                            <Card.Body>


                                {data?.head_array ? (
                                    <div style={{
                                        overflowY: "auto",
                                        maxHeight: "calc(100vh - 376px )",
                                    }}>
                                        <>
                                            <table className='table table-modern'>
                                                <thead style={{
                                                    position: "sticky",
                                                    top: "0",
                                                    width: "100%",
                                                }}>
                                                    <tr
                                                        // className="fuelprice-tr" 
                                                        style={{ padding: "0px" }}>
                                                        {data?.head_array &&
                                                            data?.head_array?.map((item, index) => <th key={index} scope='col'>

                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={
                                                                        <Tooltip
                                                                            style={{
                                                                                display: "flex",
                                                                                alignItems: "flex-start",
                                                                                justifyContent: "flex-start",
                                                                            }}
                                                                        >
                                                                            {item}


                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <span>
                                                                        {item?.length > 10 ? `${item?.substring(0, 10)}...` : item}
                                                                    </span>
                                                                </OverlayTrigger>
                                                            </th>)}
                                                    </tr>
                                                </thead>
                                                <tbody style={{ border: "1px solid #eaedf1", maxHeight: "200px", overflow: "auto" }}>
                                                    {data?.listing?.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className=" align-middle">
                                                                <div className='fuel-site-name fuel-price-conent'>
                                                                    <div
                                                                        className={
                                                                            item?.link_clickable
                                                                                ? "text-muted fs-15 fw-semibold  flex-grow-1 "
                                                                                : "text-muted fs-15 fw-semibold  flex-grow-1"
                                                                        }

                                                                        onClick={() => navigate("/update-fuel-price")}
                                                                    // onClick={item?.link_clickable && item?.count > 0 ? () => handleModalOpen(item) : null}
                                                                    >
                                                                        {item?.site_name} <span className="itemcount ">
                                                                            <span className=" d-flex justify-content-center">
                                                                                {item?.count}
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className=" align-middle fuel-price-conent">
                                                                <span className="text-muted fs-15 fw-semibold text-center  ">
                                                                    {item?.time ? moment(item?.time, 'HH:mm').format('h:mm A') : ''}
                                                                </span>
                                                            </td>

                                                            {Array.isArray(item?.fuels) &&
                                                                item.fuels.map((fuel, index) => (
                                                                    <td key={index}>
                                                                        {Array.isArray(fuel) ? (
                                                                            <input type="text" className="table-input readonly fuel-price-conent" readOnly />
                                                                        ) : (
                                                                            <input
                                                                                type="number"
                                                                                step="0.010"
                                                                                placeholder="Enter Values"
                                                                                className={`table-input fuel-price-conent ${fuel?.status === "UP"
                                                                                    ? "table-inputGreen"
                                                                                    : fuel?.status === "DOWN"
                                                                                        ? "table-inputRed"
                                                                                        : ""
                                                                                    } ${!fuel?.is_editable ? "readonly" : ""}`}
                                                                                value={fuel?.price}
                                                                                readOnly={!fuel?.is_editable}
                                                                                id={fuel?.id}
                                                                                onChange={(e) =>
                                                                                    handleInputChange(e.target.id, e.target.value)
                                                                                }
                                                                            />
                                                                        )}
                                                                    </td>
                                                                ))}

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                        {/* <div
                      className="table-container table-responsive"
                      // style={{ height: "700px", overflowY: "auto" }}
                      style={{
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 376px )",
                      }}
                    // height:"245"
                    >
                      <table className="table">
                        <colgroup>
                          {data?.head_array &&
                            data.head_array.map((_, index) => (
                              <col key={index} />
                            ))}
                        </colgroup>
                        <thead
                          style={{
                            position: "sticky",
                            top: "0",
                            width: "100%",
                          }}
                        >
                          <tr className="fuelprice-tr">{renderTableHeader()}</tr>
                        </thead>
                        <tbody>{renderTableData()}</tbody>
                      </table>
                    </div> */}
                                    </div>
                                ) : (
                                    <img
                                        src={require("../../../assets/images/commonimages/no_data.png")}
                                        alt="MyChartImage"
                                        className="all-center-flex nodata-image"
                                    />
                                )}
                            </Card.Body>
                            <Card.Footer>
                                {data?.head_array ? (
                                    <div className="text-end notification-class">
                                        <div style={{ width: "200px", textAlign: "left" }} >





                                        </div>


                                        {data?.btn_clickable ? (
                                            <button
                                                className="btn btn-primary me-2"
                                                type="submit"
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </button>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>

                {getCompetitorsPrice && (<>

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
                                            {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
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
                                                            <span className="hidden-in-small-screen"> Type</span>{" "}
                                                            <AiFillCaretRight />
                                                        </span>
                                                    </span>
                                                </th>
                                                {Object.keys(getCompetitorsPrice?.competitorListing).map((fuelType) => (
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
                                                                            style={{ width: "36px", height: "36px" }}
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
                                                        {Object.keys(getCompetitorsPrice?.competitorListing).map((fuelType, colIndex) => (
                                                            <td key={colIndex}>
                                                                <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                                                                    <span className="circle-info">
                                                                        {getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]?.last_updated}
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
                                                                                        {getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]?.last_date}
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
                                                                        <span>{getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]?.price}</span>

                                                                        <span>

                                                                            {getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]?.station ? (
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
                                                                                                display: "flex"
                                                                                            }}
                                                                                        >
                                                                                            <OverlayTrigger
                                                                                                placement="top"
                                                                                                overlay={
                                                                                                    <Tooltip
                                                                                                        style={{
                                                                                                            display: "flex",
                                                                                                            alignItems: "flex-start",
                                                                                                            justifyContent: "flex-start",
                                                                                                        }}
                                                                                                    >
                                                                                                        <span>{getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]?.logo_tip}</span>
                                                                                                    </Tooltip>
                                                                                                }
                                                                                            >
                                                                                                <img
                                                                                                    alt=""
                                                                                                    src={getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]?.logo}
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
                </>)}






            </div >
        </>
    );
};

export default withApi(UpdateFuelPrices);

