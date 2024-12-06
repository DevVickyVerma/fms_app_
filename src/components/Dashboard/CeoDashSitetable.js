import React from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import LoaderImg from "../../Utils/Loader";

const CeoDashSitetable = (props) => {
    const { isLoading, data, title, tootiptitle } = props;
    const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);

    const renderTableHeader = () => (
        <tr className="" style={{ padding: "0px" }}>
            <th className="">Sites</th>
            <th className="">Previous Month</th>
            <th className="">Current Month</th>


        </tr>
    );

    const renderTableData = () =>
        data?.map((item, index) => (
            <React.Fragment key={index}>
                <tr className="" key={item.id} style={{ padding: "0px" }}>
                    <td className="">
                        <div className="d-flex align-items-center justify-center h-100">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="mr-2"
                                style={{ width: "30px", height: "30px" }}
                            />
                            <h6 className="mb-0 fs-15 fw-semibold ms-2">{item.name}</h6>
                        </div>
                    </td>

                    <td className="">
                        <h6 className="mb-0 fs-14 fw-semibold d-flex">
                            <span className="l-sign">£ {" "}</span>{item.fuel_volume.total_volume}
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip

                                    >
                                        Fuel {tootiptitle} : £ {item.fuel_volume.gross_volume}
                                    </Tooltip>
                                }
                            >
                                <p
                                    className=" m-0"
                                >
                                    {" "}
                                    <i
                                        className="fa fa-info-circle ms-1"
                                        aria-hidden="true"
                                        style={{ fontSize: "15px" }}
                                    />{" "}
                                    <span />
                                </p>
                            </OverlayTrigger>
                        </h6>
                        <p
                            className={`m-0 ${item.fuel_volume.status === "up" ? "text-success" : "text-danger"
                                }`}
                        >
                            <i
                                className={`fa ${item.fuel_volume.status === "up"
                                    ? "fa-chevron-circle-up text-success"
                                    : "fa-chevron-circle-down text-danger"
                                    } me-1`}
                            ></i>
                            {item.fuel_volume.percentage}%
                        </p>
                    </td>

                    <td className="">
                        <h6 className="mb-0 fs-14 fw-semibold d-flex">
                            £{item.fuel_sales.total_value}
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip

                                    >
                                        Fuel {tootiptitle} : £ {item.fuel_sales.gross_value}
                                    </Tooltip>
                                }
                            >
                                <p
                                    className=" m-0"
                                >
                                    {" "}
                                    <i
                                        className="fa fa-info-circle ms-1"
                                        aria-hidden="true"
                                        style={{ fontSize: "15px" }}
                                    />{" "}
                                    <span />
                                </p>
                            </OverlayTrigger>
                        </h6>
                        <p
                            className={`m-0 ${item.fuel_sales.status === "up" ? "text-success" : "text-danger"
                                }`}
                        >
                            <i
                                className={`fa ${item.fuel_sales.status === "up"
                                    ? "fa-chevron-circle-up text-success"
                                    : "fa-chevron-circle-down text-danger"
                                    } me-1`}
                            ></i>
                            {item.fuel_sales.percentage}%
                        </p>
                    </td>


                </tr>
            </React.Fragment>
        ));

    return (
        <>
            {isLoading ? <LoaderImg /> : null}

            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <b>{title} </b>
                        </Card.Header>
                        <Card.Body>
                            {data ? (
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
                                            <>{renderTableHeader()}</>
                                        </thead>
                                        <tbody style={{ lineHeight: "15px" }}>{renderTableData()}</tbody>
                                    </table>
                                </div>
                            ) : (
                                <img
                                    src={require("../../assets/images/commonimages/no_data.png")}
                                    alt="MyChartImage"
                                    className="all-center-flex nodata-image"
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default withApi(CeoDashSitetable);
