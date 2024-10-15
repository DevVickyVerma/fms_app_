import React from 'react'
import { Card, Col, OverlayTrigger, Row, Tab, Tabs, Tooltip } from 'react-bootstrap'
import CompetitorSingleGraph from '../../pages/Competitor/CompetitorSingleGraph'
import { AiFillCaretDown, AiFillCaretRight, AiOutlineArrowRight } from 'react-icons/ai'
import { BsFuelPumpFill } from 'react-icons/bs'

const DashSubChildCompititorStats = ({ getCompetitorsPrice, setGetCompetitorsPrice }) => (
    <>
        <div className="panel panel-primary">
            <div className=" ">
                <div className="tabs-menu1 tabstyle2">
                    <Tabs
                        as="li"
                        variant="pills"
                        defaultActiveKey="tab5"
                        className="panel-tabs"
                    >
                        <Tab
                            as="li"
                            eventKey="tab5"
                            className=" me-1"
                            title="Competitors Stats"
                        >
                            <Row
                                style={{
                                    marginBottom: "10px",
                                    marginTop: "20px",
                                }}
                            >
                                <Col lg={12} md={12} className="">
                                    <Card className="">
                                        <Card.Header className=" my-cardd card-header ">
                                            <h4 className="card-title">
                                                {" "}
                                                {getCompetitorsPrice
                                                    ? getCompetitorsPrice?.siteName
                                                    : ""}{" "}
                                                Competitors Stats
                                            </h4>
                                        </Card.Header>
                                        <Card.Body className="my-cardd card-body pb-0 overflow-auto">
                                            <table className="w-100 mb-6">
                                                <tbody>
                                                    <tr>
                                                        <th className="font-500">
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
                                                        {Object?.keys(getCompetitorsPrice?.competitorListing)?.map((fuelType) => (
                                                            <th key={fuelType} className="font-500">
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
                                                                                    src={
                                                                                        competitorsName?.supplierImage
                                                                                    }
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
                                                                            <span
                                                                                style={{ minWidth: "200px" }}
                                                                            >
                                                                                {competitorsName?.name}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                {Object.keys(getCompetitorsPrice?.competitorListing).map(
                                                                    (fuelType, colIndex) => (
                                                                        <td key={colIndex}>
                                                                            <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                                                                                <span className="circle-info">
                                                                                    {
                                                                                        getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]
                                                                                            ?.last_updated
                                                                                    }
                                                                                    <span>
                                                                                        <OverlayTrigger
                                                                                            placement="top"
                                                                                            overlay={
                                                                                                <Tooltip
                                                                                                    className=" d-flex align-items-start justify-content-start"
                                                                                                    style={{
                                                                                                        width: "300px", // Set your desired width here
                                                                                                    }}
                                                                                                >
                                                                                                    {
                                                                                                        getCompetitorsPrice?.competitorListing?.[fuelType]?.[
                                                                                                            rowIndex
                                                                                                        ]?.last_date
                                                                                                    }
                                                                                                </Tooltip>
                                                                                            }
                                                                                        >
                                                                                            <p
                                                                                                className=" m-0 single-Competitor-distance"
                                                                                                style={{
                                                                                                    cursor: "pointer",
                                                                                                }}
                                                                                            >
                                                                                                {" "}
                                                                                                <i
                                                                                                    className="fa fa-info-circle ms-1"
                                                                                                    aria-hidden="true"
                                                                                                    style={{
                                                                                                        fontSize: "15px",
                                                                                                    }}
                                                                                                ></i>{" "}
                                                                                                <span></span>
                                                                                            </p>
                                                                                        </OverlayTrigger>
                                                                                    </span>
                                                                                </span>

                                                                                <span className=" d-flex justify-content-between align-items-center">
                                                                                    <span>
                                                                                        {
                                                                                            getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]
                                                                                                ?.price
                                                                                        }
                                                                                    </span>

                                                                                    {getCompetitorsPrice?.competitorListing?.[fuelType]?.[rowIndex]
                                                                                        ?.station ? (
                                                                                        ""
                                                                                    ) : (
                                                                                        <>
                                                                                            <span
                                                                                                className="PetrolPrices-img"
                                                                                                style={{
                                                                                                    width: "25px",
                                                                                                    height: "25px",
                                                                                                    fontSize: "20px",
                                                                                                    cursor: "pointer",
                                                                                                    marginLeft: "10px",
                                                                                                }}
                                                                                            >
                                                                                                <OverlayTrigger
                                                                                                    placement="top"
                                                                                                    overlay={
                                                                                                        <Tooltip
                                                                                                            style={{
                                                                                                                display: "flex align-items",
                                                                                                                alignItems:
                                                                                                                    "flex-start",
                                                                                                                justifyContent:
                                                                                                                    "flex-start",
                                                                                                            }}
                                                                                                            className=" d-flex"
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
                                                                                                            objectFit:
                                                                                                                "contain",
                                                                                                        }}
                                                                                                    />
                                                                                                </OverlayTrigger>
                                                                                            </span>
                                                                                        </>
                                                                                    )}
                                                                                </span>
                                                                            </span>
                                                                        </td>
                                                                    )
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab
                            as="li"
                            eventKey="tab6"
                            className="  me-1"
                            title="Competitor Stats Graph "
                        >
                            <Row
                                style={{
                                    marginBottom: "10px",
                                    marginTop: "20px",
                                }}
                            >
                                <Col lg={12} md={12}>
                                    <>
                                        <Card.Body className="card-body b-0">
                                            <div id="chart">
                                                <CompetitorSingleGraph
                                                    getCompetitorsPrice={getCompetitorsPrice}
                                                    setGetCompetitorsPrice={
                                                        setGetCompetitorsPrice
                                                    }
                                                />
                                            </div>
                                        </Card.Body>
                                    </>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    </>
)

export default DashSubChildCompititorStats