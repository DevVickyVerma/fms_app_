import { Card, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const CEODashCommonCard = ({
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
  lg = 6,
  xl = 4,
}) => (
  <>
    <Col sm={12} md={4} lg={lg} xl={xl} key={Math.random()}>
      <Card
        onClick={handleNavigateClick}
        className={`uniform-card-height ceo-card-default-height ${
          isParentComponent ? "ceo-sats-card-hover" : ""
        }`}
      >
        <Card.Body
          className={`text-center ${
            isParentComponent ? "pointer" : "default-pointer"
          } d-flex  justify-content-between align-items-center c-p-15`}
        >
          <span className="vertical-iconborder">
            <i className={`text-white fa-3x l-sign`}>{icon ? icon : "ppl"}</i>
          </span>
          <div className="flex-grow-1">
            <h6 className="mb-2 boxtitle">
              {leftSideTitle}
              {tooltipContent && (
                <span className="ms-1">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{tooltipContent}</Tooltip>}
                  >
                    <i
                      className="fa fa-info-circle pointer"
                      aria-hidden="true"
                    ></i>
                  </OverlayTrigger>
                </span>
              )}
            </h6>
            <h2 className="mb-2 number-font c-fs-18">
              {leftSideData ? formatNumber(leftSideData) : "0.0"}{" "}
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

            {showRightSide && (
              <div className="mt-3">
                <h6 className="mb-2 boxtitle">{RightSideTitle}</h6>
                <h2 className="mb-0 number-font c-fs-18">
                  <span className="l-sign">{icon}</span>{" "}
                  {RightSideData ? formatNumber(RightSideData) : "0.0"}
                </h2>
              </div>
            )}
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
          </div>
        </Card.Body>
      </Card>
    </Col>
  </>
);

export default CEODashCommonCard;
