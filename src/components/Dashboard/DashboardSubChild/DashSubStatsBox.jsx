import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

const DashSubStatsBox = (props) => {
  const { isLoading } = props;
  const singleSiteStoredData = localStorage.getItem("singleSiteData");
  const singleSiteParsedData = JSON.parse(singleSiteStoredData);

  const singleSiteFuelSales = singleSiteParsedData
    ? singleSiteParsedData?.fuel_sales
    : null;
  const singleSiteFuelVolume = singleSiteParsedData
    ? singleSiteParsedData?.fuel_volume
    : null;
  const singleSiteGrossMargin = singleSiteParsedData
    ? singleSiteParsedData?.gross_margin
    : null;
  const singleSiteGrossProfit = singleSiteParsedData
    ? singleSiteParsedData?.gross_profit
    : null;
  const singleSiteShopMargin = singleSiteParsedData
    ? singleSiteParsedData?.shop_profit
    : null;
  const singleSiteShopSale = singleSiteParsedData
    ? singleSiteParsedData?.shop_sales
    : null;
  const singleSiteShopFee = singleSiteParsedData
    ? singleSiteParsedData?.shop_fees
    : null;

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num;
    }
  };

  return (
    <div>
      <Row>
        <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
          <Card

            className={`card dash-card-default-height dash-plates-1 img-card box-primary-shadow`}
          >
            <Card.Body className="statscard c-stats-card">
              <div className="d-flex justify-content-between">
                <div className="text-white">
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    ℓ  {singleSiteFuelVolume?.gross_volume
                      ? formatNumber(singleSiteFuelVolume?.gross_volume)
                      : ""}
                  </h2>
                  <p className="boxtitle">Fuel Volume</p>
                </div>
                <div className="text-white " >
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    ℓ {singleSiteFuelVolume?.bunkered_volume
                      ? formatNumber(singleSiteFuelVolume?.bunkered_volume)
                      : ""}
                  </h2>
                  <p className="boxtitle">Bunkered Volume</p>
                </div>
                <div >
                  <div
                    className="counter-icon  brround  ms-auto"

                    style={{ background: "#fff", color: "#ddd" }}
                  >
                    <div
                      style={{ background: "#fff", color: "#ddd" }}
                      className="counter-icon   brround ms-auto "
                    >
                      {" "}
                      <i
                        className="icon icon-pound-sign  "
                        style={{ color: "#000" }}
                      >
                        ℓ
                      </i>
                    </div>
                  </div>
                </div>
              </div>
              <p className="margin-div">
                <span
                  className={`me-1 ${singleSiteFuelVolume?.status === "up"
                    ? "text-success"
                    : "text-danger"
                    }`}
                  data-tip={`${singleSiteFuelVolume?.percentage}%`}
                >
                  {singleSiteFuelVolume?.status === "up" ? (
                    <>
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span className="text-success">
                        {singleSiteFuelVolume?.percentage}% Last Month
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                      <span className="text-danger">
                        {singleSiteFuelVolume?.percentage}% Last Month
                      </span>
                    </>
                  )}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
          <Card

            className={`card dash-card-default-height dash-plates-3 img-card box-danger-shadow`}
          >
            <Card.Body className="statscard c-stats-card">
              <div className="d-flex justify-content-between">
                <div className="text-white">
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    £ {singleSiteFuelSales?.gross_value
                      ? formatNumber(singleSiteFuelSales?.gross_value)
                      : ""}
                  </h2>
                  <p className="boxtitle">Fuel Sales</p>
                </div>
                <div className="text-white" >
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    £ {singleSiteFuelSales?.bunkered_value
                      ? formatNumber(singleSiteFuelSales?.bunkered_value)
                      : ""}
                  </h2>
                  <p className="boxtitle">Bunkered Sales</p>
                </div>

                <div className="">
                  <div
                    className="counter-icon  brround  ms-auto"

                    style={{ background: "#fff", color: "#ddd" }}
                  >
                    <div
                      style={{ background: "#fff", color: "#ddd" }}
                      className="counter-icon   brround ms-auto "
                    >
                      {" "}
                      <i
                        className="icon icon-pound-sign  "
                        style={{ color: "#000" }}
                      >
                        £
                      </i>
                    </div>
                  </div>
                </div>
              </div>
              <p className="margin-div">
                <span
                  className={`me-1 ${singleSiteFuelSales?.status === "up"
                    ? "text-success"
                    : "text-danger"
                    }`}
                  data-tip={`${singleSiteFuelSales?.percentage}%`}
                >
                  {singleSiteFuelSales?.status === "up" ? (
                    <>
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span className="text-success">
                        {singleSiteFuelSales?.percentage}% Last Month
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                      <span className="text-danger">
                        {singleSiteFuelSales?.percentage}% Last Month
                      </span>
                    </>
                  )}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
          <Card

            className={`card dash-card-default-height dash-plates-6 img-card box-success-shadow`}
          >
            <Card.Body className="statscard c-stats-card">
              <div className="d-flex">
                <div className="text-white">
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    £ {singleSiteGrossProfit?.gross_profit
                      ? formatNumber(singleSiteGrossProfit?.gross_profit)
                      : ""}
                  </h2>
                  <p className="boxtitle">Gross Profit

                    <span className="ms-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{`Gross Profit = Total Sales - Opening Stock- Purchases(Deliveries) + Closing Stock`}</Tooltip>
                        }
                      >
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                      </OverlayTrigger>
                    </span>
                  </p>
                </div>

                <div className="ms-auto">
                  <div
                    className="counter-icon  brround  ms-auto"
                    style={{ fontSize: "18px" }}
                  >
                    <div
                      style={{ background: "#fff", color: "#ddd" }}
                      className="counter-icon   brround ms-auto "
                    >
                      {" "}
                      <i
                        className="icon icon-pound-sign "
                        style={{ color: "#000" }}
                      >
                        &#163;
                      </i>
                    </div>
                  </div>
                </div>
              </div>
              <p className="margin-div">
                <span
                  className={`me-1 ${singleSiteGrossProfit?.status === "up"
                    ? "text-success"
                    : "text-danger"
                    }`}
                  data-tip={`${singleSiteGrossProfit?.percentage}%`}
                >
                  {singleSiteGrossProfit?.status === "up" ? (
                    <>
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span className="text-success">
                        {singleSiteGrossProfit?.percentage}% Last Month
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                      <span className="text-danger">
                        {singleSiteGrossProfit?.percentage}% Last Month
                      </span>
                    </>
                  )}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
          <Card

            className={`card dash-card-default-height dash-plates-2 img-card box-info-shadow`}
          >
            <Card.Body className="statscard c-stats-card">
              <div className="d-flex">
                <div className="text-white">
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}

                    {singleSiteGrossMargin?.gross_margin
                      ? formatNumber(singleSiteGrossMargin?.gross_margin)
                      : ""} ppl{" "}
                    {singleSiteGrossMargin?.is_ppl == 1 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{`${singleSiteGrossMargin?.ppl_msg}%`}</Tooltip>
                        }
                      >
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                      </OverlayTrigger>
                    ) : (
                      ""
                    )}
                  </h2>
                  <p className="boxtitle">Gross Margin

                    <span className="ms-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{`Gross Margin = (Gross Profit/Sales) * 100`}</Tooltip>
                        }
                      >
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                      </OverlayTrigger>
                    </span>
                  </p>
                </div>

                {/* <div className="ms-auto">
                  <div
                    className="counter-icon  brround  ms-auto"

                    style={{ background: "#fff", color: "#ddd" }}
                  >
                    <div
                      style={{ background: "#fff", color: "#ddd" }}
                      className="counter-icon   brround ms-auto "
                    >
                      {" "}
                      <i
                        className="icon icon-pound-sign  "
                        style={{ color: "#000" }}
                      >
                        ℓ
                      </i>
                    </div>
                  </div>
                </div> */}
              </div>
              <p className="margin-div">
                <span
                  className={`me-1 ${singleSiteGrossMargin?.status === "up"
                    ? "text-success"
                    : "text-danger"
                    }`}
                  data-tip={`${singleSiteGrossMargin?.percentage}%`}
                >
                  {singleSiteGrossMargin?.status === "up" ? (
                    <>
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span className="text-success">
                        {singleSiteGrossMargin?.percentage}% Last Month
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                      <span className="text-danger">
                        {singleSiteGrossMargin?.percentage}% Last Month
                      </span>
                    </>
                  )}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
          <Card

            className={`card dash-card-default-height dash-plates-4 img-card box-warning-shadow`}
          >
            <Card.Body className="statscard c-stats-card">
              <div className="d-flex">
                <div className="text-white">
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    £ {singleSiteShopSale?.shop_sales
                      ? formatNumber(singleSiteShopSale?.shop_sales)
                      : ""}
                  </h2>
                  <p className="boxtitle">Shop Sales</p>
                </div>

                <div className="ms-auto">
                  <div
                    className="counter-icon  brround  ms-auto"

                    style={{ background: "#fff", color: "#ddd" }}
                  >
                    <div
                      style={{ background: "#fff", color: "#ddd" }}
                      className="counter-icon   brround ms-auto "
                    >
                      {" "}
                      <i
                        className="icon icon-pound-sign  "
                        style={{ color: "#000" }}
                      >
                        £
                      </i>
                    </div>
                  </div>
                </div>
              </div>
              <p className="margin-div">
                <span
                  className={`me-1 ${singleSiteShopSale?.status === "up"
                    ? "text-success"
                    : "text-danger"
                    }`}
                  data-tip={`${singleSiteShopSale?.percentage}%`}
                >
                  {singleSiteShopSale?.status === "up" ? (
                    <>
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span className="text-success">
                        {singleSiteShopSale?.percentage}% Last Month
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                      <span className="text-danger">
                        {singleSiteShopSale?.percentage}% Last Month
                      </span>
                    </>
                  )}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
          <Card

            className={`card dash-card-default-height dash-plates-6 img-card box-primary-shadow`}
          >
            <Card.Body className="statscard c-stats-card">
              <div className="d-flex">
                <div className="text-white">
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    £ {singleSiteShopFee?.shop_fee
                      ? formatNumber(singleSiteShopFee?.shop_fee)
                      : ""}

                  </h2>
                  <p className="boxtitle">Shop Fee
                  </p>
                </div>

                <div className="ms-auto">
                  <div
                    className="counter-icon  brround  ms-auto"

                    style={{ background: "#fff", color: "#ddd" }}
                  >
                    <div
                      style={{ background: "#fff", color: "#ddd" }}
                      className="counter-icon   brround ms-auto "
                    >
                      {" "}
                      <i
                        className="icon icon-pound-sign  "
                        style={{ color: "#000" }}
                      >
                        £
                      </i>
                    </div>
                  </div>
                </div>
              </div>
              <p className="margin-div">
                <span
                  className={`me-1 ${singleSiteShopFee?.status === "up"
                    ? "text-success"
                    : "text-danger"
                    }`}
                  data-tip={`${singleSiteShopFee?.percentage}%`}
                >
                  {singleSiteShopFee?.status === "up" ? (
                    <>
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span className="text-success">
                        {singleSiteShopFee?.percentage}% Last Month
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                      <span className="text-danger">
                        {singleSiteShopFee?.percentage}% Last Month
                      </span>
                    </>
                  )}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
          <Card

            className={`card dash-card-default-height dash-plates-5 img-card box-primary-shadow`}
          >
            <Card.Body className="statscard c-stats-card">
              <div className="d-flex">
                <div className="text-white">
                  <h2
                    style={{ fontSize: "18px" }}
                    className="mb-0 number-font"
                  >
                    {" "}
                    £ {singleSiteShopMargin?.shop_profit
                      ? formatNumber(singleSiteShopMargin?.shop_profit)
                      : ""}

                  </h2>
                  <p className="boxtitle">Shop Profit

                    <span className="ms-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{`The data is accurately sourced from back-office system`}</Tooltip>
                        }
                      >
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                      </OverlayTrigger>
                    </span>
                  </p>
                </div>

                <div className="ms-auto">
                  <div
                    className="counter-icon  brround  ms-auto"

                    style={{ background: "#fff", color: "#ddd" }}
                  >
                    <div
                      style={{ background: "#fff", color: "#ddd" }}
                      className="counter-icon   brround ms-auto "
                    >
                      {" "}
                      <i
                        className="icon icon-pound-sign  "
                        style={{ color: "#000" }}
                      >
                        £
                      </i>
                    </div>
                  </div>
                </div>
              </div>
              <p className="margin-div">
                <span
                  className={`me-1 ${singleSiteShopMargin?.status === "up"
                    ? "text-success"
                    : "text-danger"
                    }`}
                  data-tip={`${singleSiteShopMargin?.percentage}%`}
                >
                  {singleSiteShopMargin?.status === "up" ? (
                    <>
                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                      <span className="text-success">
                        {singleSiteShopMargin?.percentage}% Last Month
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                      <span className="text-danger">
                        {singleSiteShopMargin?.percentage}% Last Month
                      </span>
                    </>
                  )}
                </span>
              </p>
            </Card.Body>
          </Card>
        </Col>

      </Row>


    </div >
  );
};

export default DashSubStatsBox;
