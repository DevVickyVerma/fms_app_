import { ErrorMessage, Field, Formik } from 'formik';
import React, { useState } from 'react'
import { Card, Col, Form, FormGroup, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import * as Yup from "yup";
import withApi from '../../../Utils/ApiHelper';
import { useParams } from 'react-router-dom';
import { BsFillFuelPumpFill } from "react-icons/bs";
import Loaderimg from '../../../Utils/Loader';
import { Slide, toast } from 'react-toastify';
import { MdOutlineCalendarMonth } from "react-icons/md"
import moment from 'moment';
import { AiOutlineClose } from 'react-icons/ai';

const DashboardGradsComponent = ({ getData, getGradsSiteDetails,
    setGradsGetSiteDetails, getSiteDetails
}) => {
    // const [ShowButton, setShowButton] = useState(false);
    const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
    const [gradsLoading, setGradsLoading] = useState(false);
    const [gridIndex, setGridIndex] = useState(0);
    const [gradsFormData, setGradsFormData] = useState();
    // const [getGradsSiteDetails, setGradsGetSiteDetails] = useState()
    const { id } = useParams();
    const [isGradsOpen, setIsGradsOpen] = useState(true);
    const [minSelectedDate, setMinSelectedDate] = useState();

    const handleGradsClick = (index) => {
        // setIsGradsOpen(!isGradsOpen);
        setGridIndex(index);
    };
    const notify = (message) => {
        toast.success(message, {
            autoClose: 1000,
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            autoClose: 1000,
            theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
        });
    };
    const handleSubmit1 = async (formValues) => {
        setGradsLoading(true)

        try {
            const formData = new FormData();
            console.log(formValues, "formValues");
            formData.append("start_date", formValues.start_date);
            formData.append("end_date", formValues.end_date);
            setGradsFormData(formValues);
            if (localStorage.getItem("Dashboardsitestats") === "true") {
                try {
                    // Attempt to parse JSON data from local storage
                    const searchdata = await JSON.parse(
                        localStorage.getItem("mySearchData")
                    );
                    const superiorRole = localStorage.getItem("superiorRole");
                    const role = localStorage.getItem("role");
                    const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
                    let companyId = ""; // Define companyId outside the conditionals

                    if (superiorRole === "Client" && role !== "Client") {
                        // Set companyId based on conditions
                        companyId =
                            searchdata?.company_id !== undefined
                                ? searchdata.company_id
                                : localStoragecompanyId;
                    } else {
                        companyId =
                            searchdata?.company_id !== undefined ? searchdata.company_id : "";
                    }

                    // Use async/await to fetch data
                    const response3 = await getData(
                        localStorage.getItem("superiorRole") !== "Client"
                            ? `/dashboard/get-site-fuel-performance?site_id=${id}&end_date=${formValues.end_date}&start_date=${formValues?.start_date}`
                            : `/dashboard/get-site-fuel-performance?site_id=${id}&end_date=${formValues.end_date}&start_date=${formValues?.start_date}`
                    );
                    if (response3 && response3.data) {
                        // setGetSiteDetails(response3?.data?.data);

                        setGradsGetSiteDetails(response3?.data?.data)
                        notify(response3?.data?.message)
                        setShowModal(false);
                    } else {
                        throw new Error("No data available in the response");
                    }
                    setGradsLoading(false)
                } catch (error) {
                    // Handle errors that occur during the asynchronous operations
                    console.error("API error:", error);
                    setGradsLoading(false)
                }
            }
        } catch (error) {
            console.log(error);
            setGradsLoading(false)
        }
        setGradsLoading(false)
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
        return `${year}-${month}-${day}`;
    };

    const getFirstDateOfPreviousMonth = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        // Calculate the first day of the previous month
        const firstDayOfPreviousMonth = new Date(year, month - 1, 1);

        // Format the date as "YYYY-MM-DD"
        const formattedDate = `${firstDayOfPreviousMonth.getFullYear()}-${String(firstDayOfPreviousMonth.getMonth() + 1).padStart(2, "0")}-01`;

        return formattedDate;
    };
    const handleShowDate = () => {
        const inputDateElement = document.querySelector("#start_date");
        inputDateElement.showPicker();
    };

    const handleShowDate1 = () => {
        const inputDateElement = document.querySelector("#end_date");
        inputDateElement.showPicker();
    };

    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    }




    return (
        <>
            {gradsLoading ? <Loaderimg /> : ""}
            {/* Grads with bootstrap */}
            <Row>
                <Col lg={12} xl={12} md={12} sm={12}>
                    <Card>
                        <Card.Header className='d-flex justify-content-between'>
                            <h3 className="card-title">Grads Date Report</h3>
                            <button className='btn btn-primary' onClick={handleOpenModal}>  <MdOutlineCalendarMonth /> {gradsFormData ? `${moment(gradsFormData?.start_date).format("MMM Do")} - ${moment(gradsFormData?.end_date).format("MMM Do")}` : moment(getSiteDetails?.last_day_end).format("MMM Do")} </button>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col lg={4} md={4} xl={4} sm={4}>
                                    <Card.Header>
                                        <h3 className="card-title">Grades</h3>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row style={{ display: "flex", flexDirection: "column" }}>
                                            {getGradsSiteDetails?.fuel_stats?.data?.map(
                                                (fuelState, index) => (
                                                    <Col
                                                        lg={12}
                                                        md={12}
                                                        className="dashboardSubChildCard my-4"
                                                        borderRadius={"5px"}
                                                        onClick={() => handleGradsClick(index)}
                                                        style={{
                                                            border:
                                                                gridIndex === index
                                                                    ? "1px dashed #b3b3b3"
                                                                    : "",
                                                            cursor: "pointer",
                                                            fontWeight: gridIndex === index ? 700 : "",
                                                            background:
                                                                gridIndex === index
                                                                    ? "rgba(182, 185, 198, 0.5098039216)"
                                                                    : "",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                gap: "5px",
                                                                alignItems: "center",
                                                                marginBottom: "5px",
                                                            }}
                                                        >
                                                            <BsFillFuelPumpFill />
                                                            {fuelState?.fuel}
                                                        </span>
                                                    </Col>
                                                )
                                            )}
                                        </Row>
                                    </Card.Body>
                                </Col>

                                {isGradsOpen && (
                                    <>
                                        <Col lg={4} md={4} xl={4} sm={4}>
                                            <Card.Header>
                                                <h3 className="card-title">Key Matrices</h3>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row
                                                    style={{ display: "flex", flexDirection: "column" }}
                                                >
                                                    {/* total Transaction */}
                                                    <Col
                                                        lg={12}
                                                        md={12}
                                                        className="dashboardSubChildCard my-4"
                                                        borderRadius={"5px"}
                                                    >
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                gap: "5px",
                                                                alignItems: "center",
                                                                marginBottom: "5px",
                                                            }}
                                                        >
                                                            <strong style={{ fontWeight: 700 }}>
                                                                {" "}
                                                                Total Transaction :
                                                            </strong>
                                                            {
                                                                getGradsSiteDetails?.fuel_stats?.data[gridIndex]
                                                                    ?.cards?.total_transactions
                                                            }
                                                        </span>
                                                    </Col>

                                                    {/* 2nd Total fuel value */}
                                                    <Col
                                                        lg={12}
                                                        md={12}
                                                        className="dashboardSubChildCard my-4"
                                                        borderRadius={"5px"}
                                                    >
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                gap: "5px",
                                                                alignItems: "center",
                                                                marginBottom: "5px",
                                                            }}
                                                        >
                                                            <strong style={{ fontWeight: 700 }}>
                                                                {" "}
                                                                Total Fuel Volume :{" "}
                                                            </strong>
                                                            {
                                                                getGradsSiteDetails?.fuel_stats?.data[gridIndex]
                                                                    ?.cards?.total_fuel_sale_volume
                                                            }
                                                        </span>
                                                    </Col>
                                                    {/* Total Fuel Sales */}
                                                    <Col
                                                        lg={12}
                                                        md={12}
                                                        className="dashboardSubChildCard my-4"
                                                        borderRadius={"5px"}
                                                    >
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                gap: "5px",
                                                                alignItems: "center",
                                                                marginBottom: "5px",
                                                            }}
                                                        >
                                                            <strong style={{ fontWeight: 700 }}>
                                                                {" "}
                                                                Total Fuel Sales :
                                                            </strong>
                                                            {
                                                                getGradsSiteDetails?.fuel_stats?.data[gridIndex]
                                                                    ?.cards?.total_fuel_sale_value
                                                            }
                                                        </span>
                                                    </Col>

                                                    {/* Gross Margin */}
                                                    <Col
                                                        lg={12}
                                                        md={12}
                                                        className="dashboardSubChildCard my-4"
                                                        borderRadius={"5px"}
                                                    >
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                gap: "5px",
                                                                alignItems: "center",
                                                                marginBottom: "5px",
                                                            }}
                                                        >
                                                            <strong style={{ fontWeight: 700 }}>
                                                                {" "}
                                                                Gross Margin :
                                                            </strong>
                                                            {
                                                                getGradsSiteDetails?.fuel_stats?.data[gridIndex]
                                                                    ?.gross_margin
                                                            }
                                                        </span>
                                                    </Col>

                                                    {/* Gross Profit */}
                                                    <Col
                                                        lg={12}
                                                        md={12}
                                                        className="dashboardSubChildCard my-4"
                                                        borderRadius={"5px"}
                                                    >
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                gap: "5px",
                                                                alignItems: "center",
                                                                marginBottom: "5px",
                                                            }}
                                                        >
                                                            <strong style={{ fontWeight: 700 }}>
                                                                {" "}
                                                                Gross Profit :
                                                            </strong>
                                                            {
                                                                getGradsSiteDetails?.fuel_stats?.data[gridIndex]
                                                                    ?.gross_profit
                                                            }
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Col>

                                        {/* 3rd column */}
                                        <Col lg={4} md={4} xl={4} sm={4}>
                                            <Card.Header>
                                                <h3 className="card-title">Fuel Volume</h3>
                                            </Card.Header>

                                            <Card.Body
                                                style={{ maxHeight: "467px", overflowY: "auto" }}
                                            >
                                                <Row
                                                    style={{ display: "flex", flexDirection: "column" }}
                                                >
                                                    {getGradsSiteDetails?.fuel_stats?.data?.[
                                                        gridIndex
                                                    ]?.cards?.card_details?.map((cardDetail, index) => (
                                                        <Col
                                                            lg={12}
                                                            md={12}
                                                            className=" my-4"
                                                            borderRadius={"5px"}
                                                            style={{
                                                                background: "#f2f2f8",
                                                                padding: "6px 20px",
                                                                color: "black",
                                                                borderRadius: "5px",
                                                            }}
                                                        >
                                                            <p
                                                                style={{
                                                                    display: "flex",
                                                                    gap: "5px",
                                                                    alignItems: "center",
                                                                    marginBottom: "5px",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        flex: 1,
                                                                        gap: "5px",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                    }}
                                                                >
                                                                    {cardDetail?.image && (
                                                                        <img
                                                                            src={cardDetail.image}
                                                                            alt={
                                                                                cardDetail.card_name ||
                                                                                "Card Image Alt Text"
                                                                            }
                                                                            style={{
                                                                                width: "60px",
                                                                                height: "40px",
                                                                                background: "#FFF",
                                                                                padding: "5px",
                                                                                borderRadius: "8px",
                                                                            }}
                                                                        />
                                                                    )}
                                                                </span>
                                                                <span style={{ flex: 1, display: "flex" }}>
                                                                    {" "}
                                                                    {cardDetail?.card_name}
                                                                </span>
                                                                <span style={{ flex: 1, display: "flex" }}>
                                                                    {cardDetail?.total_fuel_sale_volume &&
                                                                        cardDetail?.total_fuel_sale_volume}
                                                                </span>

                                                                <span style={{ display: "flex" }}>
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
                                                                                {" "}
                                                                                Total Transactions :{" "}
                                                                                {cardDetail?.total_transactions}
                                                                                <br />
                                                                                Total Fuel Sale :{" "}
                                                                                {cardDetail?.total_fuel_sale_value}
                                                                                <br />
                                                                                Total Fuel Volume :{" "}
                                                                                {cardDetail?.total_fuel_sale_volume}
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <i
                                                                            class="fa fa-info-circle"
                                                                            aria-hidden="true"
                                                                            style={{ fontSize: "20px" }}
                                                                        ></i>
                                                                    </OverlayTrigger>
                                                                </span>
                                                            </p>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Card.Body>
                                        </Col>
                                    </>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                className="custom-modal-width custom-modal-height"
            >
                <div class="modal-header" style={{ color: "#fff", background: "#6259ca" }}>
                    <h5 class="modal-title">  Grades Date Reports</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span onClick={handleCloseModal} style={{ cursor: "pointer" }}>
                            <AiOutlineClose color='#fff' />
                        </span>
                    </button>
                </div>

                <Modal.Body className="Disable2FA-modal">
                    <div className="modal-contentDisable2FA">

                        <Row>
                            <Col lg={12} md={12}>
                                <Formik
                                    initialValues={{
                                        start_date: "",
                                        end_date: "",
                                    }}
                                    validationSchema={Yup.object().shape({
                                        start_date: Yup.date().required("Start Date is required"),
                                        end_date: Yup.date().required("End Date is required"),

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
                                                                htmlFor="start_date"
                                                                className="form-label"
                                                            >
                                                                Start Date
                                                            </label>
                                                            <Field
                                                                type="date"
                                                                min={getFirstDateOfPreviousMonth()}
                                                                max={getCurrentDate()}
                                                                onClick={handleShowDate}
                                                                className={`input101 ${errors.start_date && touched.start_date
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                id="start_date"
                                                                name="start_date"
                                                                onChange={(e) => {
                                                                    const selectedstart_date = e.target.value;

                                                                    setMinSelectedDate(selectedstart_date)
                                                                    setFieldValue(
                                                                        "start_date",
                                                                        selectedstart_date
                                                                    );
                                                                }}
                                                            ></Field>
                                                            <ErrorMessage
                                                                component="div"
                                                                className="invalid-feedback"
                                                                name="start_date"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6} md={6}>
                                                        <FormGroup>
                                                            <label
                                                                htmlFor="end_date"
                                                                className="form-label"
                                                            >
                                                                End Date
                                                            </label>
                                                            <Field
                                                                type="date"
                                                                min={minSelectedDate ? minSelectedDate : getFirstDateOfPreviousMonth()}
                                                                max={getCurrentDate()}
                                                                onClick={handleShowDate1}
                                                                className={`input101 ${errors.end_date && touched.end_date
                                                                    ? "is-invalid"
                                                                    : ""
                                                                    }`}
                                                                id="end_date"
                                                                name="end_date"
                                                                onChange={(e) => {
                                                                    const selectedend_date_date =
                                                                        e.target.value;

                                                                    setFieldValue(
                                                                        "end_date",
                                                                        selectedend_date_date
                                                                    );
                                                                    // setShowButton(false);
                                                                }}
                                                            ></Field>
                                                            <ErrorMessage
                                                                component="div"
                                                                className="invalid-feedback"
                                                                name="end_date"
                                                            />
                                                        </FormGroup>
                                                    </Col >
                                                </Row>
                                            </Card.Body>
                                            <Card.Footer>
                                                <div className='text-end'>
                                                    <button type="submit" className="btn btn-primary f-size-5">
                                                        Confirm
                                                    </button>
                                                </div>
                                            </Card.Footer>
                                        </Form>
                                    )}
                                </Formik>
                            </Col>
                        </Row>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default withApi(DashboardGradsComponent);