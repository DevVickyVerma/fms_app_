import React, { useEffect, useState } from 'react'
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loaderimg from '../../../Utils/Loader'
import DashboardCompetitorGraph from '../../Dashboard/dashTopSection/DashboardCompetitorGraph'
import axios from 'axios'
import { Slide, toast } from 'react-toastify'

const SingleStatsCompetitor = ({ isLoading }) => {
    const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
    const [Compititorloading, setCompititorloading] = useState(false);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
    const { id } = useParams();




    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const navigate = useNavigate();
    const SuccessToast = (message) => {
        toast.success(message, {
            autoClose: 500,
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: true,
            transition: Slide,
            theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
        });
    };
    const Errornotify = (message) => {
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
            const errorMessage = Array.isArray(error.response?.data?.message)
                ? error.response?.data?.message.join(" ")
                : error.response?.data?.message;
            Errornotify(errorMessage);
        }
    }

    const FetchCompititorData = async () => {
        setCompititorloading(true);
        if (localStorage.getItem("Dashboardsitestats") === "true") {
            try {
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
                const response3 = await axiosInstance.get(
                    localStorage.getItem("superiorRole") !== "Client"
                        ? `/dashboard/get-competitors-price?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
                        : `/dashboard/get-competitors-price?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
                );

                if (response3 && response3.data) {
                    setGetCompetitorsPrice(response3?.data?.data);
                } else {
                    throw new Error("No data available in the response");
                }
            } catch (error) {
                // Handle errors that occur during the asynchronous operations
                console.error("API error:", error);
                handleError(error)
            } finally {
                // Set Compititorloading to false when the request is complete (whether successful or not)
                setCompititorloading(false);
            }
        }
    };
    useEffect(() => {
        FetchCompititorData()
    }, [])


    if (!getCompetitorsPrice) {
        return <h1>sdadsda</h1>
    }


    const { dates, dataArray, fuelTypes, competitors } = getCompetitorsPrice;

    console.log(getCompetitorsPrice, "getCompetitorsPrice");


    const renderTableHeader = () => {
        return (
            <tr className="fuelprice-tr " style={{ padding: "0px" }}>
                <th className="dashboard-child-thead">Competitor Name</th>
                {
                    getCompetitorsPrice?.fuelTypes?.map((fuelTypesName) => (
                        <th className="dashboard-child-thead">{fuelTypesName} </th>
                    ))
                }
            </tr>
        );
    };
    const renderTableData = () => {
        return (
            getCompetitorsPrice?.competitors?.map((item, index) => (
                <>
                    <tr className="fuelprice-tr" key={item?.id} style={{ padding: "0px" }} >
                        <td className="dashboard-child-tdata">
                            <div className="d-flex align-items-center justify-center h-100">
                                <div >
                                    <div className="d-flex">
                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                            <h6 className="mb-0 fs-15 fw-semibold">
                                                {item}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>

                </>
            ))
        )

    };

    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div className="page-header d-flex">
                <div>
                    <h1 className="page-title ">Single Competitor Stats</h1>
                    <Breadcrumb className="breadcrumb breadcrumb-subheader">
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
                            linkProps={{ to: "/CompetitorStats" }}
                        >
                            Competitor Stats
                        </Breadcrumb.Item>

                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            Single Competitor Stats
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="ms-auto ">
                    <div className="input-group">

                    </div>
                </div>
            </div>

            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>

                        </Card.Header>
                        <Card.Body>
                            {getCompetitorsPrice ? (
                                <div
                                    className="table-container table-responsive"
                                    style={{
                                        overflowY: "auto",
                                        maxHeight: "calc(100vh - 376px )",
                                        minHeight: "300px",
                                    }}
                                >
                                    <table className="table">
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
                                </div>
                            ) : (
                                <img
                                    src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                                    alt="MyChartImage"
                                    className="all-center-flex nodata-image"
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row
                style={{
                    marginBottom: "10px",
                    marginTop: "20px",
                }}
            >
                <Col lg={12} md={12}>
                    <Card>
                        <Card.Header className="card-header">
                            <h4 className="card-title"> Local Competitor Stats</h4>
                        </Card.Header>
                        <Card.Body className="card-body pb-0">
                            <div id="chart">
                                <DashboardCompetitorGraph
                                    getCompetitorsPrice={getCompetitorsPrice}
                                    setGetCompetitorsPrice={setGetCompetitorsPrice}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            {competitors?.map((competitor) => (
                                <th key={competitor}>{competitor}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dates?.map((date) => (
                            <tr key={date}>
                                <td>{date}</td>
                                {competitors?.map((competitor) => (
                                    <td key={competitor}>
                                        {dataArray[date] && dataArray[date][fuelTypes[0]]
                                            ? dataArray[date][fuelTypes[0]]
                                                .filter((item) => item.name === competitor)
                                                .map((item) => item.price)
                                            : 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


        </>
    )
}

export default SingleStatsCompetitor