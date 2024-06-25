import React, { useEffect, useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import Spinners from "../Spinner";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardStatsBox = (props) => {
  const {
    isLoading,
    GrossVolume,
    shopmargin,
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
      {GrossVolume ? (
        <Row>
          <Col sm={12} md={6} lg={6} xl={4} key={Math.random()}>
            <Card
              onClick={handleNavigateClick}
              className={`card  dash-plates-1 img-card box-primary-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex justify-content-between">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      ℓ{GrossVolume?.gross_volume}
                    </h2>
                    <p className="boxtitle">Gross Volume</p>
                  </div>
                  <div className="text-white " >
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      ℓ{GrossVolume?.bunkered_volume}
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
          <Col sm={12} md={6} lg={6} xl={4} key={Math.random()}>
            <Card
              onClick={handleNavigateClick}
              className={`card dash-plates-6 img-card box-success-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex ">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £{GrossProfitValue?.gross_profit}
                    </h2>
                    <p className="boxtitle">Gross Profit</p>
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
          <Col sm={12} md={6} lg={6} xl={4} key={Math.random()}>
            <Card
              onClick={handleNavigateClick}
              className={`card dash-plates-2 img-card box-info-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      {GrossMarginValue?.gross_margin} ppl{" "}
                      {GrossMarginValue?.is_ppl == 1 ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{`${GrossMarginValue?.ppl_msg}%`}</Tooltip>
                          }
                        >
                          <i class="fa fa-info-circle" aria-hidden="true"></i>
                        </OverlayTrigger>
                      ) : (
                        ""
                      )}
                    </h2>
                    <p className="boxtitle">Gross Margin</p>
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
          <Col sm={12} md={6} lg={6} xl={4} key={Math.random()}>
            <Card
              onClick={handleNavigateClick}
              className={`card dash-plates-3 img-card box-danger-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex justify-content-between">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £{FuelValue?.gross_value}
                    </h2>
                    <p className="boxtitle">Fuel Sales</p>
                  </div>
                  <div className="text-white" >
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £{FuelValue?.bunkered_value}
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
          <Col sm={12} md={6} lg={6} xl={4} key={Math.random()}>
            <Card
              onClick={handleNavigateClick}
              className={`card dash-plates-4 img-card box-warning-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £
                      {shopsale?.shop_sales
                        ? parseFloat(shopsale?.shop_sales)?.toLocaleString()
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
          <Col sm={12} md={6} lg={6} xl={4} key={Math.random()}>
            <Card
              onClick={handleNavigateClick}
              className={`card  dash-plates-5 img-card box-primary-shadow`}
            >
              <Card.Body className="statscard">
                <div className="d-flex">
                  <div className="text-white">
                    <h2
                      style={{ fontSize: "18px" }}
                      className="mb-0 number-font"
                    >
                      {" "}
                      £
                      {shopmargin?.shop_profit
                        ? parseFloat(shopmargin?.shop_profit)?.toLocaleString()
                        : ""}
                    </h2>
                    <p className="boxtitle">Shop Profit</p>
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

      {/* <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  GrossVolume?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <Card.Body
                  className={`${
                    isDetailPermissionAvailable ? "show-pointer-cursor" : ""
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
                            <Spinners />
                          ) : (
                            <>
                              <div className="d-flex">
                                <div>
                                  <h6>Gross Volume</h6>
                                  <h4 className="mb-2 number-font">
                                    ℓ{GrossVolume?.gross_volume}
                                  </h4>
                                </div>
                                <div className="border-left"></div>
                                <div className="ms-3">
                                  <h6>Bunkered Volume</h6>
                                  <h4 className="mb-2 number-font">
                                    ℓ{GrossVolume?.bunkered_volume}
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
                                    className={`me-1 ${
                                      shopmargin?.status === "up"
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
                                          {GrossVolume?.percentage}% Last Month
                                        </span>
                                      </>
                                    )}
                                  </span>
                                  Last Month
                                </p>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                        <div className="col-auto">
                          <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                            <i className="icon icon-pound-sign text-white mb-5 ">
                              ℓ
                            </i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <div
              className={`col-lg-6 col-md-12 col-sm-12 col-xl-4 ${
                isDetailPermissionAvailable ? "show-pointer-cursor" : ""
              }`}
            >
              <div
                className={`card overflow-hidden Dashboard-card ${
                  GrossProfitValue?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <div className="card-body ">
                  <Row>
                    <div className="col">
                      <div
                        className=" dashboard-box "
                        onClick={handleNavigateClick}
                      >
                        <div>
                          <h6>Gross Profit</h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                {" "}
                                £{GrossProfitValue?.gross_profit}
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${GrossProfitValue?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      GrossProfitValue?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {GrossProfitValue?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {GrossProfitValue?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {GrossProfitValue?.percentage}%
                                        </span>
                                      </>
                                    )}
                                  </span>
                                  Last Month
                                </p>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                        <div className="col col-auto">
                          <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                            <i className="icon icon-pound-sign text-white mb-5 ">
                              &#163;
                            </i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
            <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  GrossMarginValue?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <Card.Body
                  className={`${
                    isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                  }`}
                >
                  <Row>
                    <div className="col">
                      <div
                        className=" dashboard-box"
                        onClick={handleNavigateClick}
                      >
                        <div>
                          <h6>Gross Margin</h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                {" "}
                                {GrossMarginValue?.gross_margin} ppl{" "}
                                {GrossMarginValue?.is_ppl == 1 ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip>{`${GrossMarginValue?.ppl_msg}%`}</Tooltip>
                                    }
                                  >
                                    <i
                                      class="fa fa-info-circle"
                                      aria-hidden="true"
                                    ></i>
                                  </OverlayTrigger>
                                ) : (
                                  ""
                                )}
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${GrossMarginValue?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      GrossMarginValue?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {GrossMarginValue?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {GrossMarginValue?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {GrossMarginValue?.percentage}%
                                        </span>
                                      </>
                                    )}
                                  </span>
                                  Last Month
                                </p>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                        <div className="col col-auto">
                          <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto text-white">
                            <OilBarrelIcon />
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
      </Row> */}

      {/* <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row> */}
      {/* <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  FuelValue?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <Card.Body
                  className={`${
                    isDetailPermissionAvailable ? "show-pointer-cursor" : ""
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
                            <Spinners />
                          ) : (
                            <>
                              <div className="d-flex">
                                <div>
                                  <h6>Fuel Sales</h6>
                                  <h4 className="mb-2 number-font">
                                    £ {FuelValue?.gross_value}
                                  </h4>
                                </div>
                                <div className="border-left"></div>
                                <div className="ms-3">
                                  <h6>Bunkered Sales</h6>
                                  <h4 className="mb-2 number-font">
                                    £{FuelValue?.bunkered_value}
                                  </h4>
                                </div>
                              </div>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${FuelValue?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      FuelValue?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {FuelValue?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {FuelValue?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {FuelValue?.percentage}%
                                        </span>
                                      </>
                                    )}
                                  </span>
                                  Last Month
                                </p>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                        <div className="col col-auto">
                          <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto text-white">
                            <OilBarrelIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col> */}
      {/* <div
              className={`col-lg-6 col-md-12 col-sm-12 col-xl-4 ${
                isDetailPermissionAvailable ? "show-pointer-cursor" : ""
              }`}
            >
              <div
                className={`card overflow-hidden Dashboard-card ${
                  shopsale?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <div className="card-body ">
                  <Row>
                    <div className="col">
                      <div
                        className=" dashboard-box"
                        onClick={handleNavigateClick}
                      >
                        <div>
                          <h6>Shop Sales</h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                £
                                {shopsale?.shop_sales
                                  ? parseFloat(
                                      shopsale?.shop_sales
                                    )?.toLocaleString()
                                  : ""}
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${shopsale?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopsale?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {shopsale?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {shopsale?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {shopsale?.percentage}%
                                        </span>
                                      </>
                                    )}
                                  </span>
                                  Last Month
                                </p>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                        <div className="col col-auto">
                          <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                            <i className="icon icon-pound-sign text-white mb-5 ">
                              &#163;
                            </i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div> */}
      {/* <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  shopmargin?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <Card.Body
                  className={`${
                    isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                  }`}
                >
                  <Row>
                    <div className="col">
                      <div
                        className=" dashboard-box"
                        onClick={() => {
                          handleNavigateClick();
                        }}
                      >
                        <div>
                          <h6>Shop Profit </h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                £
                                {shopmargin?.shop_profit
                                  ? parseFloat(
                                      shopmargin?.shop_profit
                                    )?.toLocaleString()
                                  : " "}
                               
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${shopmargin?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopmargin?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {shopmargin?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {shopmargin?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {shopmargin?.percentage}%
                                        </span>
                                      </>
                                    )}
                                  </span>
                                  Last Month
                                </p>
                              </OverlayTrigger>
                            </>
                          )}
                        </div>
                        <div className="col col-auto">
                          <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                            <i className="icon icon-pound-sign text-white mb-5 ">
                              &#163;
                            </i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col> */}
      {/* </Row>
        </Col>
      </Row> */}
    </div>
  );
};

export default DashboardStatsBox;
