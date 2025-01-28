import { Card, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";
import { motion } from "framer-motion";
const TitanCommonCards = ({
    isParentComponent,
    leftSideData,
    leftSideTitle,
    RightSideData,
    RightSideTitle,
    statusValue,
    percentageValue,
    handleNavigateClick,
    showRightSide = false,
    icon = "",
    Righttooltip = null,
    Lefttooltip = null,
    showPPL = false,
    ppl_msg = null,
    lg = 6,
    xl = 4,
}) => {

    const StatusIndicator = ({ leftSideData }) => {

        const isUp = leftSideData >= 0;

        return (
            <div>
                <i
                    className={`fa ${isUp ? "fa-chevron-circle-up text-success" : "fa-chevron-circle-down text-danger"
                        } ms-2`}
                ></i>
            </div>
        );
    };
    return (

        <>
            {console.log(leftSideData, "leftSideData")}
            <motion.div
                onClick={handleNavigateClick}
                className={`uniform-card-height ceo-card-default-height ${isParentComponent ? "" : ""}`}
                style={{ backgroundColor: "#fff" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.10 }} // Animation on hover
                transition={{ duration: 0.3 }} // Animation duration
            >
                <Col sm={12} md={4} lg={lg} xl={xl} key={Math.random()}>
                    <Card
                        onClick={handleNavigateClick}
                        className={`uniform-card-height ceo-card-default-height ${isParentComponent ? "" : ""
                            }`}
                        style={{ backgroundColor: "violet" }}

                    >
                        <Card.Body
                            className={`text-center card-body-icon ${isParentComponent ? "pointer" : "default-pointer"
                                }`}
                        >
                            <i
                                className={`text-white fa-3x l-sign`}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    opacity: 0.2, /* Optional: To make it look like a background */
                                    pointerEvents: "none", /* Prevent interaction */
                                    color: "#fff"
                                }}
                            >
                                {icon ? icon : "ppl"}
                            </i>

                            <div className="d-flex  justify-content-between align-items-center">

                                <div className="flex-grow-1 spacebetween" style={{ textAlign: "start" }}>
                                    <div>
                                        <h6 className="mb-2 boxtitle">
                                            {leftSideTitle}
                                            {Lefttooltip && (
                                                <span className="ms-1">
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>{Lefttooltip}</Tooltip>}
                                                    >
                                                        <i
                                                            className="fa fa-info-circle pointer"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </OverlayTrigger>
                                                </span>
                                            )}
                                        </h6>
                                        <h2 className="mb-2 number-font c-fs-18 d-flex">

                                            {leftSideData ? formatNumber(leftSideData) : "0.0"}{" "}<StatusIndicator leftSideData={leftSideData} />
                                            {showPPL ? "ppl" : ""}
                                            {ppl_msg && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>{ppl_msg}</Tooltip>}
                                                >
                                                    <i
                                                        className="fa fa-info-circle pointer ms-1"
                                                        aria-hidden="true"
                                                    ></i>
                                                </OverlayTrigger>
                                            )}
                                        </h2>
                                    </div>
                                    <div>
                                        {showRightSide && (
                                            <div className="">

                                                <h6 className="mb-2 boxtitle">{RightSideTitle}    {Righttooltip && (
                                                    <span className="ms-1">
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip>{Righttooltip}</Tooltip>}
                                                        >
                                                            <i
                                                                className="fa fa-info-circle pointer"
                                                                aria-hidden="true"
                                                            ></i>
                                                        </OverlayTrigger>
                                                    </span>
                                                )}</h6>
                                                <h2 className="mb-0 number-font c-fs-18 d-flex">
                                                    {/* <span className="l-sign">{icon}</span>{" "} */}
                                                    {RightSideData ? formatNumber(RightSideData) : "0.00"}<StatusIndicator leftSideData={RightSideData} />
                                                </h2>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                {statusValue === "up" ? (
                                    <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span>{percentageValue}% Last Month</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span>{percentageValue}% Last Month</span>
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </motion.div>

        </>
    )
};

export default TitanCommonCards;




