import React, { useEffect, useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import Spinners from "../Spinner";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardSiteTopSection = (props) => {
  const {
    isLoading,
    // GrossVolume,
    // shopmargin,
    // GrossProfitValue,
    // GrossMarginValue,
    // FuelValue,
    // shopsale,
    // searchdata,
  } = props;

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
    ? singleSiteParsedData?.shop_margin
    : null;
  const singleSiteShopSale = singleSiteParsedData
    ? singleSiteParsedData?.shop_sales
    : null;

  const [UploadTabname, setUploadTabname] = useState();
  const [superiorRole, setsuperiorRole] = useState(
    localStorage.getItem("superiorRole")
  );
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
      console.log("my user permissions", UserPermissions);
    }
  }, [UserPermissions]);
  const isDetailPermissionAvailable =
    permissionsArray?.includes("dashboard-details");
  const navigate = useNavigate();

  return (
    <div>
      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  singleSiteFuelVolume?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <Card.Body
                //   className={`${
                //     isDetailPermissionAvailable ? "show-pointer-cursor" : ""
                //   }`}
                >
                  <Row>
                    <div className="col">
                      <div
                        className=" dashboard-box"
                        // onClick={GrossVolumehandleClick}
                        // onClick={() => {
                        //   const shouldNavigate =
                        //     (superiorRole === "Administrator" &&
                        //       searchdata &&
                        //       Object.keys(searchdata).length > 0) ||
                        //     (superiorRole !== "Administrator" &&
                        //       isDetailPermissionAvailable);

                        //   if (shouldNavigate) {
                        //     setUploadTabname("GrossVolume");
                        //     handleNavigateClick(UploadTabname);
                        //     handleNavigateClick(UploadTabname);
                        //   }
                        // }}
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
                                    ℓ{singleSiteFuelVolume?.gross_volume}
                                  </h4>
                                </div>
                                {/* <div className="border-left"></div>
                                <div className="ms-3">
                                  <h6>Bunkered Volume</h6>
                                  <h4 className="mb-2 number-font">
                                    ℓ{singleSiteFuelVolume?.bunkered_volume}
                                  </h4>
                                </div> */}
                              </div>

                              {/* <p className="p-0">Bunkered Volume</p> */}
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${singleSiteFuelVolume?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      singleSiteShopMargin?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                    data-tip={`${singleSiteFuelVolume?.percentage}%`}
                                  >
                                    {singleSiteFuelVolume?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {singleSiteFuelVolume?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {singleSiteFuelVolume?.percentage}%
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
                        <div className="col col-auto">
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
            <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  singleSiteGrossMargin?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <Card.Body>
                  <Row>
                    <div className="col">
                      <div className=" dashboard-box">
                        <div>
                          <h6>Gross Margin</h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                {" "}
                                {singleSiteGrossMargin?.gross_margin} ppl
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${singleSiteGrossMargin?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      singleSiteGrossMargin?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {singleSiteGrossMargin?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {singleSiteGrossMargin?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {singleSiteGrossMargin?.percentage}%
                                        </span>
                                      </>
                                    )}
                                    {/* <span>
                                      {GrossProfitValue?.percentage}%
                                    </span> */}
                                  </span>
                                  last month
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
            <div className={`col-lg-6 col-md-12 col-sm-12 col-xl-4 `}>
              <div
                className={`card overflow-hidden Dashboard-card ${
                  singleSiteGrossProfit?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <div className="card-body ">
                  <Row>
                    <div className="col">
                      <div
                        className=" dashboard-box "
                        // onClick={() => {
                        //   const shouldNavigate =
                        //     (superiorRole === "Administrator" &&
                        //       searchdata &&
                        //       Object.keys(searchdata).length > 0) ||
                        //     (superiorRole !== "Administrator" &&
                        //       isDetailPermissionAvailable);

                        //   if (shouldNavigate) {
                        //     setUploadTabname("Gross Profit");
                        //     handleNavigateClick(UploadTabname);
                        //     handleNavigateClick(UploadTabname);
                        //   }
                        // }}
                      >
                        <div>
                          <h6>Gross Profit</h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                {" "}
                                £{singleSiteGrossProfit?.gross_profit}
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${singleSiteGrossProfit?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      singleSiteGrossProfit?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {singleSiteGrossProfit?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {singleSiteGrossProfit?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {singleSiteGrossProfit?.percentage}%
                                        </span>
                                      </>
                                    )}
                                    {/* <span>
                                      {GrossProfitValue?.percentage}%
                                    </span> */}
                                  </span>
                                  last month
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
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} sm={12} xl={12}>
          <Row>
            <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  singleSiteFuelSales?.status === "up"
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
                        // onClick={() => {
                        //   const shouldNavigate =
                        //     (superiorRole === "Administrator" &&
                        //       searchdata &&
                        //       Object.keys(searchdata).length > 0) ||
                        //     (superiorRole !== "Administrator" &&
                        //       isDetailPermissionAvailable);

                        //   if (shouldNavigate) {
                        //     setUploadTabname("Fuel Sales");
                        //     handleNavigateClick(UploadTabname);
                        //     handleNavigateClick(UploadTabname);
                        //   }
                        // }}
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
                                    £{singleSiteFuelSales?.gross_value}
                                  </h4>
                                </div>
                                <div className="border-left"></div>
                                <div className="ms-3">
                                  <h6>Bunkered Sales</h6>
                                  <h4 className="mb-2 number-font">
                                    £{singleSiteFuelSales?.bunkered_value}
                                  </h4>
                                </div>
                              </div>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${singleSiteFuelSales?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      singleSiteFuelSales?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {singleSiteFuelSales?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {singleSiteFuelSales?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {singleSiteFuelSales?.percentage}%
                                        </span>
                                      </>
                                    )}
                                    {/* <span>{FuelValue?.percentage}%</span> */}
                                  </span>
                                  last month
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
            <div className={`col-lg-6 col-md-12 col-sm-12 col-xl-4 `}>
              <div
                className={`card overflow-hidden Dashboard-card ${
                  singleSiteShopSale?.status === "up"
                    ? "Dashboard-success-border"
                    : "Dashboard-loss-border"
                }`}
              >
                <div className="card-body ">
                  <Row>
                    <div className="col">
                      <div
                        className=" dashboard-box"
                        // onClick={() => {
                        //   const shouldNavigate =
                        //     (superiorRole === "Administrator" &&
                        //       searchdata &&
                        //       Object.keys(searchdata).length > 0) ||
                        //     (superiorRole !== "Administrator" &&
                        //       isDetailPermissionAvailable);

                        //   if (shouldNavigate) {
                        //     setUploadTabname("Shop Sales");
                        //     handleNavigateClick(UploadTabname);
                        //     handleNavigateClick(UploadTabname);
                        //   }
                        // }}
                      >
                        <div>
                          <h6>Shop Sales</h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                £{singleSiteShopSale?.shop_sales}
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${singleSiteShopSale?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      singleSiteShopSale?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {singleSiteShopSale?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {singleSiteShopSale?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {singleSiteShopSale?.percentage}%
                                        </span>
                                      </>
                                    )}
                                    {/* <span>{shopsale?.percentage}%</span> */}
                                  </span>
                                  last month
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
            </div>
            <Col lg={6} md={12} sm={12} xl={4}>
              <Card
                className={`card overflow-hidden Dashboard-card ${
                  singleSiteShopMargin?.status === "up"
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
                        // onClick={() => {
                        //   const shouldNavigate =
                        //     (superiorRole === "Administrator" &&
                        //       searchdata &&
                        //       Object.keys(searchdata).length > 0) ||
                        //     (superiorRole !== "Administrator" &&
                        //       isDetailPermissionAvailable);

                        //   if (shouldNavigate) {
                        //     setUploadTabname("Shop Margin");
                        //     handleNavigateClick(UploadTabname);
                        //     handleNavigateClick(UploadTabname);
                        //   }
                        // }}
                      >
                        <div>
                          <h6>Shop Margin</h6>
                          {isLoading ? (
                            <Spinners />
                          ) : (
                            <>
                              <h4 className="mb-2 number-font">
                                £{singleSiteShopMargin?.shop_margin}
                              </h4>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>{`${singleSiteShopMargin?.percentage}%`}</Tooltip>
                                }
                              >
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      singleSiteShopMargin?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {singleSiteShopMargin?.status === "up" ? (
                                      <>
                                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                        <span className="text-success">
                                          {singleSiteShopMargin?.percentage}%
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                        <span className="text-danger">
                                          {singleSiteShopMargin?.percentage}%
                                        </span>
                                      </>
                                    )}
                                    {/* <span>{shopmargin?.percentage}%</span> */}
                                  </span>
                                  last month
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
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSiteTopSection;
