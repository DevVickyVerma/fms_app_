import { Card, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const DashCommonCard = ({
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
  upperTooltipContent = null,
  showPPL = false,
  ppl_msg = null,
  containerStyle = "dash-plates-1",
  lg = 6,
  xl = 3,
}) => (
  <>
    <Col
      sm={12}
      md={6}
      lg={lg || 6}
      xl={xl || 3}
      key={Math.random()}
      className=""
    >
      <Card
        onClick={handleNavigateClick}
        className={`card dash-card-default-height img-card box-primary-shadow ${containerStyle}`}
      >
        <Card.Body
          className={`statscard c-stats-card ${isParentComponent ? "pointer" : "default-pointer"}`}
        >
          <div className="d-flex justify-content-between">
            <div className="text-white">
              <h2 style={{ fontSize: "18px" }} className="mb-0 number-font">
                {" "}
                <span className="l-sign">{icon}</span>{" "}
                {leftSideData ? formatNumber(leftSideData) : "0.0"}{" "}
                {showPPL ? "ppl" : ""}
                <span className="ms-1">
                  {ppl_msg && (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          <span>{`${ppl_msg}`}</span>
                        </Tooltip>
                      }
                    >
                      <i
                        className="fa fa-info-circle pointer"
                        aria-hidden="true"
                      ></i>
                    </OverlayTrigger>
                  )}
                </span>
              </h2>
              <p className="boxtitle">
                {leftSideTitle}
                {upperTooltipContent && (
                  <>
                    <span className="ms-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{upperTooltipContent} </Tooltip>}
                      >
                        <i
                          className="fa fa-info-circle pointer"
                          aria-hidden="true"
                        ></i>
                      </OverlayTrigger>
                    </span>
                  </>
                )}
              </p>
            </div>
            {showRightSide && (
              <>
                <div className="text-white ">
                  <h2 style={{ fontSize: "18px" }} className="mb-0 number-font">
                    {" "}
                    <span className="l-sign">{icon}</span>{" "}
                    {RightSideData ? formatNumber(RightSideData) : "0.0"}
                  </h2>
                  <p className="boxtitle">{RightSideTitle}</p>
                </div>
              </>
            )}

            <div className="">
              {icon && (
                <>
                  <div className="counter-icon  brround  ms-auto white-background">
                    <div className="counter-icon brround ms-auto white-background">
                      {" "}
                      <i
                        className="icon icon-pound-sign  "
                        style={{ color: "#000" }}
                      >
                        <span className="l-sign">{icon}</span>
                      </i>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <p className="margin-div">
            <span
              className={`me-1 ${
                statusValue === "up" ? "text-success" : "text-danger"
              }`}
              data-tip={`${percentageValue}%`}
            >
              {statusValue === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="white-text">
                    {percentageValue}% Last Month
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="white-text">
                    {percentageValue}% Last Month
                  </span>
                </>
              )}
            </span>
          </p>
        </Card.Body>
      </Card>
    </Col>

    {/* <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
            <Card onClick={handleNavigateClick}>
                <Card.Body className={`text-center ${isParentComponent ? 'pointer' : 'default-pointer'}`} >
                    <i className={`text-success fa-3x l-sign`}>{icon ? icon : "ppl"}</i>
                    <div className={showRightSide ? 'spacebetween' : ''}>


                        <div>
                            <h6 className="mt-4 mb-2 boxtitle">

                                {leftSideTitle}
                                {upperTooltipContent && (<>
                                    <span className="ms-1">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>{upperTooltipContent} </Tooltip>
                                            }
                                        >
                                            <i className="fa fa-info-circle pointer" aria-hidden="true"></i>
                                        </OverlayTrigger>
                                    </span>
                                </>)}


                            </h6>
                            <h2 className="mb-2 number-font">{leftSideData
                                ? formatNumber(leftSideData)
                                : "0.0"}  {showPPL ? "ppl" : ""}
                                <span className='ms-1'>
                                    {ppl_msg && (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    <span>
                                                        {`${ppl_msg}`}
                                                    </span>
                                                </Tooltip>
                                            }
                                        >
                                            <i className="fa fa-info-circle pointer" aria-hidden="true"></i>
                                        </OverlayTrigger>
                                    )}
                                </span></h2>
                        </div>

                        <h6  >
                            {showRightSide && (<>

                                <h6 className="mt-4 mb-2 boxtitle">{RightSideTitle}</h6>
                                <h2
                                    style={{ fontSize: "18px" }}
                                    className="mb-0 number-font "
                                >
                                    {" "}
                                    <span className="l-sign">{icon}</span>  {RightSideData
                                        ? formatNumber(RightSideData)
                                        : "0.0"}
                                </h2>


                            </>)}
                        </h6>
                    </div>

                    {statusValue === "up" ? (
                        <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="">
                                {percentageValue}% Last Month
                            </span>
                        </>
                    ) : (
                        <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="">
                                {percentageValue}% Last Month
                            </span>
                        </>
                    )}


                </Card.Body>
            </Card>
        </Col> */}
  </>
);

export default DashCommonCard;
