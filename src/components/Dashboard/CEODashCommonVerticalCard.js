import { Card, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";
import React from "react";

const CEODashCommonVerticalCard = ({
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
  tooltipContent = null,
  showPPL = false,
  ppl_msg = null,
  containerStyle = "dash-plates-1",
  lg = 6,
  xl = 3,
}) => (
  <>
    <React.Fragment sm={12} md={6} lg={lg} xl={xl} key={Math.random()}>
      <Card
        onClick={handleNavigateClick}
        className="ceo-card-default-height ceo-sats-card-hover"
      >
        <Card.Body
          className={`text-center ${
            isParentComponent ? "pointer" : "default-pointer"
          } c-p-15 `}
        >
          <span className="vertical-iconborder">
            <i className={`text-white fa-3x l-sign`}>{icon ? icon : "ppl"}</i>
          </span>

          <div
            className={showRightSide ? "" : ""}
            style={{
              flexDirection: "column",
              height: "80%",
              display: "flex",
              justifyContent: "space-around",
              // marginTop: "10px",
            }}
          >
            <div>
              <h6 className="mt-4 mb-2 boxtitle">
                {leftSideTitle}
                {tooltipContent && (
                  <>
                    <span className="ms-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{tooltipContent} </Tooltip>}
                      >
                        <i
                          className="fa fa-info-circle pointer"
                          aria-hidden="true"
                        ></i>
                      </OverlayTrigger>
                    </span>
                  </>
                )}
              </h6>
              <h2 className="mb-2 number-font c-fs-18">
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
            </div>

            <div>
              {statusValue === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="">{percentageValue}% Last Month</span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="">{percentageValue}% Last Month</span>
                </>
              )}
            </div>

            <h6>
              {showRightSide && (
                <>
                  <h6 className="mt-4 mb-2 boxtitle">{RightSideTitle}</h6>
                  <h2
                    // style={{ fontSize: "18px" }}
                    className="mb-0 number-font c-fs-18"
                  >
                    {" "}
                    {/* <span className="l-sign">{icon}</span>{" "} */}
                    {RightSideData ? formatNumber(RightSideData) : "0.0"}
                  </h2>
                </>
              )}
            </h6>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  </>
);

export default CEODashCommonVerticalCard;
