import { useEffect, useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardStatsBox = (props) => {
  const {
    GrossVolume,
    shopmargin,
    shop_fees,
    GrossProfitValue,
    GrossMarginValue,
    FuelValue,
    shopsale,
    searchdata,
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
    } else if (!ApplyFilterrequired && isDetailPermissionAvailable) {
      navigate(`/dashboard-details`);
    } else if (!ApplyFilterrequired && !isDetailPermissionAvailable) {

    }
  };


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
      {GrossVolume ? (
        <Row>
          <Col sm={12} md={6} lg={6} xl={3} key={Math.random()}>
            <Card
              onClick={handleNavigateClick}
              className={`card dash-card-default-height dash-plates-1 img-card box-primary-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex justify-content-between">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      ℓ {GrossVolume?.gross_volume
                        ? formatNumber(GrossVolume?.gross_volume)
                        : ""}
                    </h2>
                    <p className="boxtitle">Gross Volume</p>
                  </div>
                  <div className="text-white " >
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      ℓ  {GrossVolume?.bunkered_volume
                        ? formatNumber(GrossVolume?.bunkered_volume)
                        : ""}
                    </h2>
                    <p className="boxtitle">Bunkered Volume</p>
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
                          ℓ
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="margin-div">
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
                          {GrossVolume?.percentage}% Last Month
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {GrossVolume?.percentage}% Last Month
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
              onClick={handleNavigateClick}
              className={`card dash-card-default-height dash-plates-3 img-card box-danger-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex justify-content-between">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £ {FuelValue?.gross_value
                        ? formatNumber(FuelValue?.gross_value)
                        : ""}

                    </h2>
                    <p className="boxtitle">Fuel Sales (Ex. Vat)</p>
                  </div>
                  <div className="text-white" >
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £  {FuelValue?.bunkered_value
                        ? formatNumber(FuelValue?.bunkered_value)
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
                          ℓ
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="margin-div">
                  <span
                    className={`me-1 ${shopmargin?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${FuelValue?.percentage}%`}
                  >
                    {FuelValue?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {FuelValue?.percentage}% Last Month
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {FuelValue?.percentage}% Last Month
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
              onClick={handleNavigateClick}
              className={`card dash-card-default-height dash-plates-6 img-card box-success-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex ">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £ {GrossProfitValue?.gross_profit
                        ? formatNumber(GrossProfitValue?.gross_profit)
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
                    className={`me-1 ${shopmargin?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${GrossProfitValue?.percentage}%`}
                  >
                    {GrossProfitValue?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {GrossProfitValue?.percentage}% Last Month
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {GrossProfitValue?.percentage}% Last Month
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
              onClick={handleNavigateClick}
              className={`card dash-card-default-height dash-plates-2 img-card box-info-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}

                      {GrossMarginValue?.gross_margin
                        ? formatNumber(GrossMarginValue?.gross_margin)
                        : ""} ppl{" "}
                      {GrossMarginValue?.is_ppl == 1 ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{`${GrossMarginValue?.ppl_msg}%`}</Tooltip>
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
                          ℓ
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="margin-div">
                  <span
                    className={`me-1 ${shopmargin?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${GrossMarginValue?.percentage}%`}
                  >
                    {GrossMarginValue?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {GrossMarginValue?.percentage}% Last Month
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {GrossMarginValue?.percentage}% Last Month
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
              onClick={handleNavigateClick}
              className={`card dash-card-default-height dash-plates-4 img-card box-warning-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £  {shopsale?.shop_sales
                        ? formatNumber(shopsale?.shop_sales)
                        : ""}


                    </h2>
                    <p className="boxtitle">Shop Sales (Ex. Vat)</p>
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
                          ℓ
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="margin-div">
                  <span
                    className={`me-1 ${shopmargin?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${shopsale?.percentage}%`}
                  >
                    {shopsale?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {shopsale?.percentage}% Last Month
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {shopsale?.percentage}% Last Month
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
              onClick={handleNavigateClick}
              className={`card dash-card-default-height dash-plates-6 img-card box-primary-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £  {shop_fees?.shop_fee
                        ? formatNumber(shop_fees?.shop_fee)
                        : ""}
                    </h2>
                    <p className="boxtitle">Shop Fee </p>
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
                          ℓ
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="margin-div">
                  <span
                    className={`me-1 ${shop_fees?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${shop_fees?.percentage}%`}
                  >
                    {shop_fees?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {shop_fees?.percentage}% Last Month
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {shop_fees?.percentage}% Last Month
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
              onClick={handleNavigateClick}
              className={`card dash-card-default-height dash-plates-5 img-card box-primary-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £  {shopmargin?.shop_profit
                        ? formatNumber(shopmargin?.shop_profit)
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
                          ℓ
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="margin-div">
                  <span
                    className={`me-1 ${shopmargin?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${shopmargin?.percentage}%`}
                  >
                    {shopmargin?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {shopmargin?.percentage}% Last Month
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {shopmargin?.percentage}% Last Month
                        </span>
                      </>
                    )}
                  </span>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DashboardStatsBox;
