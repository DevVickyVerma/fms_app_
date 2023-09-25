import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

const DashboardShopSale = ({ getSiteDetails }) => {
    return (
        <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <h3 className="card-title">Shop Sales</h3>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: "467px", overflowY: "auto" }}>
                        <Col lg={12} md={12} xl={12} sm={12}>
                            <Row
                                style={{ display: "flex", flexDirection: "column" }}
                            >
                                <Col
                                    lg={12}
                                    md={12}
                                    className="my-4"
                                    borderRadius={"5px"}
                                    style={{
                                        background: "rgb(174 177 189)",
                                        padding: "6px 20px",
                                        color: "black",
                                        borderRadius: "5px",
                                        position: "sticky",
                                        top: "-25px",
                                        zIndex: "1",
                                        fontWeight: 700,
                                        minWidth: "500px"
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
                                                gap: "5px",
                                                alignItems: "center",
                                                minWidth: "90px", maxWidth: "90px"
                                            }}
                                        >
                                            Name
                                        </span>
                                        <span style={{
                                            display: "flex",
                                            //  minWidth: "68px", maxWidth: "68px", 
                                            justifyContent: "flex-end"
                                        }}>
                                            {" "}
                                            Gross Sales
                                        </span>


                                        <span style={{
                                            display: "flex", minWidth: "68px", maxWidth: "68px", justifyContent: "flex-end"
                                        }}>
                                            Net Sales
                                        </span>
                                        <span style={{
                                            display: "flex", minWidth: "68px", maxWidth: "68px", justifyContent: "flex-end"
                                        }}>
                                            Profit
                                        </span>


                                    </p>
                                </Col>
                                {getSiteDetails?.shop_sales?.data?.map((cardDetail, index) => (
                                    <>
                                        <Col
                                            lg={12}
                                            md={12}

                                            className=" my-2"
                                            borderRadius={"5px"}
                                            style={{
                                                background: "rgb(242, 242, 248)",
                                                padding: "6px 20px",
                                                color: "black",
                                                borderRadius: "5px",
                                                minWidth: "500px"
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
                                                        gap: "5px",
                                                        alignItems: "center",
                                                        minWidth: "90px", maxWidth: "90px"
                                                    }}
                                                >
                                                    {cardDetail?.name}
                                                </span>
                                                <span style={{

                                                    display: "flex", minWidth: "68px", maxWidth: "68px", justifyContent: "flex-end"
                                                }}>
                                                    {" "}
                                                    {cardDetail?.gross_sales}
                                                </span>
                                                <span style={{

                                                    display: "flex", minWidth: "68px", maxWidth: "68px", justifyContent: "flex-end"
                                                }}>
                                                    {cardDetail?.nett_sales}
                                                </span>
                                                <span style={{

                                                    display: "flex", minWidth: "68px", maxWidth: "68px", justifyContent: "flex-end"
                                                }}>
                                                    {cardDetail?.profit}
                                                </span>
                                            </p>
                                        </Col>
                                    </>
                                ))}
                            </Row>
                        </Col>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default DashboardShopSale