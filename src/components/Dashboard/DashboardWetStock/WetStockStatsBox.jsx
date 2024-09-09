import React, { useEffect, useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const WetStockStatsBox = (props) => {
    const {
        isLoading,
        GrossVolume,
        shopmargin,
        GrossProfitValue,
        GrossMarginValue,
        FuelValue,
        shopsale,
        searchdata,
        shouldNavigateToDetailsPage,
    } = props;

    const [permissionsArray, setPermissionsArray] = useState([]);

    const UserPermissions = useSelector((state) => state?.data?.data);

    useEffect(() => {
        if (UserPermissions) {
            setPermissionsArray(UserPermissions?.permissions);
        }
    }, [UserPermissions]);
    const isDetailPermissionAvailable =
        permissionsArray?.includes("dashboard-details");
    const navigate = useNavigate();

    const handleNavigateClick = () => {
        let ApplyFilterrequired = UserPermissions?.applyFilter;

        if (searchdata && Object.keys(searchdata).length > 0) {
            // Set ApplyFilterrequired to false if searchdata has keys
            ApplyFilterrequired = false;
        }

        if (ApplyFilterrequired && isDetailPermissionAvailable) {
            // console.log(
            //   "applyFilterNot clickable NavigatetoDetails is true and has isDetailPermissionAvailable",
            //   ApplyFilterrequired
            // );
        } else if (!ApplyFilterrequired && isDetailPermissionAvailable) {
            // console.log(
            //   "applyFilterclickable NavigatetoDetails is false and has isDetailPermissionAvailable ",
            //   ApplyFilterrequired
            // );
            navigate(`/dashboard-details`);
        } else if (!ApplyFilterrequired && !isDetailPermissionAvailable) {
            // console.log(
            //   "applyFilterNot clickable NavigatetoDetails is false and has no isDetailPermissionAvailable",
            //   ApplyFilterrequired
            // );
        }
    };

    return (
        <div>
            <Row>
                <Col lg={12} md={12} sm={12} xl={12}>
                    <Row>



                        <Col lg={4} md={12} sm={12} xl={4}>
                            <Card
                                className={`card overflow-hidden Dashboard-card  ${GrossVolume?.status === "up"
                                    ? "Dashboard-success-border"
                                    : "Dashboard-loss-border"
                                    }`}
                            >
                                <Card.Body
                                    className={`${isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                                        }`}
                                >
                                    <Row>
                                        <div className="col">
                                            <div
                                                className=" dashboard-box"
                                                onClick={handleNavigateClick}
                                            >
                                                <div>
                                                    {isLoading ? (
                                                        <>
                                                            {/* <Spinners /> */}
                                                        </>

                                                    ) : (
                                                        <>
                                                            <div className="d-flex">
                                                                <div>
                                                                    <h6>Wetstock Loss</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        £ 1111
                                                                        {/* {GrossVolume?.gross_volume} */}
                                                                    </h4>
                                                                </div>
                                                                <div className="border-left"></div>
                                                                <div className="ms-3">
                                                                    <h6>YTD Value</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        £ 4444
                                                                        {/* {GrossVolume?.bunkered_volume} */}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip>{`${GrossVolume?.percentage}%`}</Tooltip>
                                                                }
                                                            >
                                                                <p className="text-muted mb-0 mt-4">
                                                                    <span
                                                                        className={`me-1 ${shopmargin?.status === "up"
                                                                            ? "text-success"
                                                                            : "text-danger"
                                                                            }`}
                                                                        data-tip={`${GrossVolume?.percentage}%`}
                                                                    >
                                                                        {GrossVolume?.status === "up" ? (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                                <span className="text-success">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                                <span className="text-danger">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                    last month
                                                                </p>
                                                            </OverlayTrigger>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-auto">
                                                    <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                                                        <i className="icon icon-pound-sign text-white mb-5 ">
                                                            &#163;
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        {/* <div className="my-2 wetstock-dashboard-center-line"></div> */}



                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>









                        <Col lg={4} md={12} sm={12} xl={4}>
                            <Card
                                className={`card overflow-hidden Dashboard-card  ${GrossVolume?.status === "up"
                                    ? "Dashboard-success-border"
                                    : "Dashboard-loss-border"
                                    }`}
                            >
                                <Card.Body
                                    className={`${isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                                        }`}
                                >
                                    <Row>
                                        <div className="col">
                                            <div
                                                className=" dashboard-box"
                                                onClick={handleNavigateClick}
                                            >
                                                <div>
                                                    {isLoading ? (
                                                        <>
                                                            {/* <Spinners /> */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="d-flex">
                                                                <div>
                                                                    <h6>Delivery Loss</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        £ 765
                                                                        {/* {GrossVolume?.gross_volume} */}
                                                                    </h4>
                                                                </div>
                                                                <div className="border-left"></div>
                                                                <div className="ms-3">
                                                                    <h6>YTD Value</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        £ 65
                                                                        {/* {GrossVolume?.bunkered_volume} */}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip>{`${GrossVolume?.percentage}%`}</Tooltip>
                                                                }
                                                            >
                                                                <p className="text-muted mb-0 mt-4">
                                                                    <span
                                                                        className={`me-1 ${shopmargin?.status === "up"
                                                                            ? "text-success"
                                                                            : "text-danger"
                                                                            }`}
                                                                        data-tip={`${GrossVolume?.percentage}%`}
                                                                    >
                                                                        {GrossVolume?.status === "up" ? (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                                <span className="text-success">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                                <span className="text-danger">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                    last month
                                                                </p>
                                                            </OverlayTrigger>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-auto">
                                                    <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                                                        <i className="icon icon-pound-sign text-white mb-5 ">
                                                            &#163;
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        {/* <div className="my-2 Unknown-dashboard-center-line"></div> */}



                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>









                        <Col lg={4} md={12} sm={12} xl={4}>
                            <Card
                                className={`card overflow-hidden Dashboard-card  ${GrossVolume?.status === "up"
                                    ? "Dashboard-success-border"
                                    : "Dashboard-loss-border"
                                    }`}
                            >
                                <Card.Body
                                    className={`${isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                                        }`}
                                >
                                    <Row>
                                        <div className="col">
                                            <div
                                                className=" dashboard-box"
                                                onClick={handleNavigateClick}
                                            >
                                                <div>
                                                    {isLoading ? (
                                                        <>
                                                            {/* <Spinners /> */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="d-flex">
                                                                <div>
                                                                    <h6>Unknown Loss</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        £ 2321
                                                                        {/* {GrossVolume?.gross_volume} */}
                                                                    </h4>
                                                                </div>
                                                                <div className="border-left"></div>
                                                                <div className="ms-3">
                                                                    <h6>YTD Value</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        £ 43
                                                                        {/* {GrossVolume?.bunkered_volume} */}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip>{`${GrossVolume?.percentage}%`}</Tooltip>
                                                                }
                                                            >
                                                                <p className="text-muted mb-0 mt-4">
                                                                    <span
                                                                        className={`me-1 ${shopmargin?.status === "up"
                                                                            ? "text-success"
                                                                            : "text-danger"
                                                                            }`}
                                                                        data-tip={`${GrossVolume?.percentage}%`}
                                                                    >
                                                                        {GrossVolume?.status === "up" ? (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                                <span className="text-success">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                                <span className="text-danger">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                    last month
                                                                </p>
                                                            </OverlayTrigger>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-auto">
                                                    <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                                                        <i className="icon icon-pound-sign text-white mb-5 ">
                                                            &#163;
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        {/* <div className="my-2 Unknown-dashboard-center-line"></div> */}



                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col lg={4} md={12} sm={12} xl={4}>
                            <Card
                                className={`card overflow-hidden Dashboard-card  ${GrossVolume?.status === "up"
                                    ? "Dashboard-success-border"
                                    : "Dashboard-loss-border"
                                    }`}
                            >
                                <Card.Body
                                    className={`${isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                                        }`}
                                >
                                    <Row>


                                        <div className="col">
                                            <div
                                                className=" dashboard-box"
                                                onClick={handleNavigateClick}
                                            >
                                                <div>
                                                    {isLoading ? (
                                                        <>
                                                            {/* <Spinners /> */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="d-flex">
                                                                <div>
                                                                    <h6>Wetstock Loss</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        L 9743
                                                                        {/* {GrossVolume?.gross_volume} */}
                                                                    </h4>
                                                                </div>
                                                                <div className="border-left"></div>
                                                                <div className="ms-3">
                                                                    <h6>YTD Value</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        L 233
                                                                        {/* {GrossVolume?.bunkered_volume} */}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip>{`${GrossVolume?.percentage}%`}</Tooltip>
                                                                }
                                                            >
                                                                <p className="text-muted mb-0 mt-4">
                                                                    <span
                                                                        className={`me-1 ${shopmargin?.status === "up"
                                                                            ? "text-success"
                                                                            : "text-danger"
                                                                            }`}
                                                                        data-tip={`${GrossVolume?.percentage}%`}
                                                                    >
                                                                        {GrossVolume?.status === "up" ? (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                                <span className="text-success">
                                                                                    {/* {GrossVolume?.percentage} */}
                                                                                    1
                                                                                    %
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                                <span className="text-danger">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                    last month
                                                                </p>
                                                            </OverlayTrigger>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-auto">
                                                    <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                                                        <i className="icon icon-pound-sign text-white mb-5 ">
                                                            L
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4} md={12} sm={12} xl={4}>
                            <Card
                                className={`card overflow-hidden Dashboard-card  ${GrossVolume?.status === "up"
                                    ? "Dashboard-success-border"
                                    : "Dashboard-loss-border"
                                    }`}
                            >
                                <Card.Body
                                    className={`${isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                                        }`}
                                >
                                    <Row>


                                        <div className="col">
                                            <div
                                                className=" dashboard-box"
                                                onClick={handleNavigateClick}
                                            >
                                                <div>
                                                    {isLoading ? (
                                                        <>
                                                            {/* <Spinners /> */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="d-flex">
                                                                <div>
                                                                    <h6>Delivery Loss </h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        L 5644
                                                                        {/* {GrossVolume?.gross_volume} */}
                                                                    </h4>
                                                                </div>
                                                                <div className="border-left"></div>
                                                                <div className="ms-3">
                                                                    <h6>YTD Value</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        L 76
                                                                        {/* {GrossVolume?.bunkered_volume} */}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip>{`${GrossVolume?.percentage}%`}</Tooltip>
                                                                }
                                                            >
                                                                <p className="text-muted mb-0 mt-4">
                                                                    <span
                                                                        className={`me-1 ${shopmargin?.status === "up"
                                                                            ? "text-success"
                                                                            : "text-danger"
                                                                            }`}
                                                                        data-tip={`${GrossVolume?.percentage}%`}
                                                                    >
                                                                        {GrossVolume?.status === "up" ? (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                                <span className="text-success">
                                                                                    {/* {GrossVolume?.percentage} */}
                                                                                    1
                                                                                    %
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                                <span className="text-danger">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                    last month
                                                                </p>
                                                            </OverlayTrigger>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-auto">
                                                    <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                                                        <i className="icon icon-pound-sign text-white mb-5 ">
                                                            L
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col lg={4} md={12} sm={12} xl={4}>
                            <Card
                                className={`card overflow-hidden Dashboard-card  ${GrossVolume?.status === "up"
                                    ? "Dashboard-success-border"
                                    : "Dashboard-loss-border"
                                    }`}
                            >
                                <Card.Body
                                    className={`${isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                                        }`}
                                >
                                    <Row>


                                        <div className="col">
                                            <div
                                                className=" dashboard-box"
                                                onClick={handleNavigateClick}
                                            >
                                                <div>
                                                    {isLoading ? (
                                                        <>
                                                            {/* <Spinners /> */}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="d-flex">
                                                                <div>
                                                                    <h6>Unknown Loss</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        L 5644
                                                                        {/* {GrossVolume?.gross_volume} */}
                                                                    </h4>
                                                                </div>
                                                                <div className="border-left"></div>
                                                                <div className="ms-3">
                                                                    <h6>YTD Value</h6>
                                                                    <h4 className="mb-2 number-font">
                                                                        L 76
                                                                        {/* {GrossVolume?.bunkered_volume} */}
                                                                    </h4>
                                                                </div>
                                                            </div>

                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip>{`${GrossVolume?.percentage}%`}</Tooltip>
                                                                }
                                                            >
                                                                <p className="text-muted mb-0 mt-4">
                                                                    <span
                                                                        className={`me-1 ${shopmargin?.status === "up"
                                                                            ? "text-success"
                                                                            : "text-danger"
                                                                            }`}
                                                                        data-tip={`${GrossVolume?.percentage}%`}
                                                                    >
                                                                        {GrossVolume?.status === "up" ? (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                                                <span className="text-success">
                                                                                    {/* {GrossVolume?.percentage} */}
                                                                                    1
                                                                                    %
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                                                <span className="text-danger">
                                                                                    {GrossVolume?.percentage}%
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </span>
                                                                    last month
                                                                </p>
                                                            </OverlayTrigger>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="col-auto">
                                                    <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                                                        <i className="icon icon-pound-sign text-white mb-5 ">
                                                            L
                                                        </i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                </Col>
            </Row>


        </div>
    );
};

export default WetStockStatsBox;