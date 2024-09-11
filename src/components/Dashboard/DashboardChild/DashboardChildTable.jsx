import React from "react";
import { useEffect, useState } from 'react';
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";

const DashboardChildTable = (props) => {
  const { isLoading, getData, searchdata, data, setData } = props;
  const [permissionsArray, setPermissionsArray] = useState([]);
  const UserPermissions = useSelector((state) => state?.data?.data);

  const navigate = useNavigate()

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isSitePermissionAvailable = permissionsArray?.includes("dashboard-site-detail");


  function handleSaveSingleSiteData(row) {
    const rowDataString = JSON.stringify(row);
    localStorage.setItem("singleSiteData", rowDataString);
  }


  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num;
    }
  };


  const renderTableHeader = () => {
    return (
      <tr className="fuelprice-tr " style={{ padding: "0px" }}>
        <th className="dashboard-child-thead">Sites</th>
        <th className="dashboard-child-thead">Gross Volume</th>
        <th className="dashboard-child-thead">Fuel Sales</th>
        <th className="dashboard-child-thead">Gross Profit</th>
        <th className="dashboard-child-thead">Gross Margin</th>
        <th className="dashboard-child-thead">Shop Sales</th>
        <th className="dashboard-child-thead">Shop Fees</th>
        <th className="dashboard-child-thead">Shop Profit</th>
      </tr>
    );
  };


  const handleFuelPriceLinkClick = (item) => {
    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
      let updatedStoredData = JSON.parse(storedData);

      updatedStoredData.site_id = item?.id; // Update the site_id here
      updatedStoredData.site_name = item?.name; // Update the site_id here

      localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));
      navigate(`/dashboard-details/${item?.id}`);
    }
  };



  const renderTableData = () => {
    return data?.map((item, index) => (
      <>
        {isSitePermissionAvailable ? (
          <div onClick={() => handleSaveSingleSiteData(item)} key={index}>
            <Link
              Link
              onClick={() => handleFuelPriceLinkClick(item)}
              // to={`/dashboard-details/${item?.id}`}
              style={{ padding: "0px", color: "black" }}
            >
              <tr
                className="fuelprice-tr"
                key={item.id}
                style={{ padding: "0px" }}
              >
                <td className="dashboard-child-tdata">
                  <div className="d-flex align-items-center justify-center h-100">
                    <div>
                      <img
                        src={item.image}
                        alt={item.image}
                        className="mr-2"
                        style={{
                          width: "30px",
                          height: "30px",
                          minWidth: "30px",
                        }}
                      />
                    </div>
                    {isSitePermissionAvailable ? (
                      <div onClick={() => handleSaveSingleSiteData(item)}>
                        <Link to={`/dashboard-details/${item?.id}`}>
                          <div className="d-flex">
                            <div className="ms-2 mt-0 mt-sm-2 d-block">
                              <h6 className="mb-0 fs-15 fw-semibold">
                                {item?.name}
                              </h6>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <div className="d-flex">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                          <h6 className="mb-0 fs-15 fw-semibold">
                            {item?.name}
                          </h6>
                        </div>
                      </div>
                    )}
                  </div>
                </td>


                <td className="dashboard-child-tdata">
                  <div className="d-flex align-items-center h-100 ">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold ">
                        L  {item.fuel_volume?.gross_volume
                          ? formatNumber(item.fuel_volume?.gross_volume)
                          : ""}
                      </h6>

                      <p
                        className={`me-1 ${item.fuel_volume?.status === "up"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        data-tip={`${item?.fuel_volume?.percentage}%`}
                      >
                        {item?.fuel_volume?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.fuel_volume?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.fuel_volume?.percentage}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="dashboard-child-tdata">

                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £ {item?.fuel_sales?.gross_value
                          ? formatNumber(item?.fuel_sales?.gross_value)
                          : ""}
                      </h6>
                      <p
                        className={`me-1 ${item?.fuel_sales?.status === "up"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        data-tip={`${item?.fuel_sales?.percentage}%`}
                      >
                        {item?.fuel_sales?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.fuel_sales?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.fuel_sales?.percentage}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="dashboard-child-tdata">

                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £ {item?.gross_profit?.gross_profit
                          ? formatNumber(item?.gross_profit?.gross_profit)
                          : ""}
                      </h6>
                      <p
                        className={`me-1 ${item?.gross_profit?.status === "up"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        data-tip={`${item?.gross_profit?.percentage}%`}
                      >
                        {item?.gross_profit?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.gross_profit?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.gross_profit?.percentage}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="dashboard-child-tdata">

                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        {item?.gross_margin?.gross_margin
                          ? formatNumber(item?.gross_margin?.gross_margin)
                          : ""}

                        ppl{""}  {item?.gross_margin?.is_ppl == 1 ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>{`${item?.gross_margin?.ppl_msg}%`}</Tooltip>
                            }
                          >
                            <i
                              className="fa fa-info-circle"
                              aria-hidden="true"
                            ></i>
                          </OverlayTrigger>
                        ) : (
                          ""
                        )}
                      </h6>
                      <p
                        className={`me-1 ${item?.gross_margin?.status === "up"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        data-tip={`${item?.gross_margin?.percentage}%`}
                      >
                        {item?.gross_margin?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.gross_margin?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.gross_margin?.percentage}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="dashboard-child-tdata">

                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £
                        {/* {item?.shop_sales?.shop_sales} */}
                        {item?.shop_sales?.shop_sales
                          ? formatNumber(item?.shop_sales?.shop_sales)
                          : ""}

                      </h6>
                      <p
                        className={`me-1 ${item?.shop_sales?.status === "up"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        data-tip={`${item?.shop_sales?.percentage}%`}
                      >
                        {item?.shop_sales?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.shop_sales?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.shop_sales?.percentage}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="dashboard-child-tdata">

                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £
                        {item?.shop_fees?.shop_fee
                          ? formatNumber(item?.shop_fees?.shop_fee)
                          : ""}

                        {/* {item?.shop_fees?.shop_fees || "0.00"} */}
                      </h6>
                      <p
                        className={`me-1 ${item?.shop_fees?.status === "up"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        data-tip={`${item?.shop_fees?.percentage}%`}
                      >
                        {item?.shop_fees?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.shop_fees?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.shop_fees?.percentage}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="dashboard-child-tdata">

                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £
                        {item?.shop_profit?.shop_profit
                          ? formatNumber(item?.shop_profit?.shop_profit)
                          : ""}

                        {/* {item?.shop_profit?.shop_profit || "0.00"} */}
                      </h6>
                      <p
                        className={`me-1 ${item?.shop_profit?.status === "up"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        data-tip={`${item?.shop_profit?.percentage}%`}
                      >
                        {item?.shop_profit?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.shop_profit?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.shop_profit?.percentage}%
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </Link>
          </div>
        ) : (
          <tr className="fuelprice-tr" key={item?.id} style={{ padding: "0px" }} >
            <td className="dashboard-child-tdata">
              <div className="d-flex align-items-center justify-center h-100">
                <div>
                  <img
                    src={item.image}
                    alt={item.image}
                    className="mr-2"
                    style={{ width: "30px", height: "30px", minWidth: "30px" }}
                  />
                </div>
                {isSitePermissionAvailable ? (
                  <div onClick={() => handleSaveSingleSiteData(item)}>
                    <Link to={`/dashboard-details/${item?.id}`}>
                      <div className="d-flex">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                          <h6 className="mb-0 fs-15 fw-semibold">
                            {item?.name}
                          </h6>
                        </div>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-15 fw-semibold">{item?.name}</h6>
                    </div>
                  </div>
                )}
              </div>
            </td>

            <td className="dashboard-child-tdata">
              <div className="d-flex align-items-center h-100 ">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold ">
                    L{item.fuel_volume?.gross_volume}
                  </h6>

                  <p
                    className={`me-1 ${item.fuel_volume?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${item?.fuel_volume?.percentage}%`}
                  >
                    {item?.fuel_volume?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {item?.fuel_volume?.percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {item?.fuel_volume?.percentage}%
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </td>

            <td className="dashboard-child-tdata">
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £{item?.fuel_sales?.gross_value}
                  </h6>
                  <p
                    className={`me-1 ${item?.fuel_sales?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${item?.fuel_sales?.percentage}%`}
                  >
                    {item?.fuel_sales?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {item?.fuel_sales?.percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {item?.fuel_sales?.percentage}%
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </td>

            <td className="dashboard-child-tdata">

              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £{item?.gross_profit?.gross_profit}
                  </h6>
                  <p
                    className={`me-1 ${item?.gross_profit?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${item?.gross_profit?.percentage}%`}
                  >
                    {item?.gross_profit?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {item?.gross_profit?.percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {item?.gross_profit?.percentage}%
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </td>

            <td className="dashboard-child-tdata">

              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    {item?.gross_margin?.gross_margin} ppl
                  </h6>
                  <p
                    className={`me-1 ${item?.gross_margin?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${item?.gross_margin?.percentage}%`}
                  >
                    {item?.gross_margin?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {item?.gross_margin?.percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {item?.gross_margin?.percentage}%
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </td>

            <td className="dashboard-child-tdata">

              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £ {item?.shop_sales?.shop_sales ? parseFloat(item?.shop_sales?.shop_sales)?.toLocaleString() : ""}
                    {/* {item?.shop_sales?.shop_sales} */}
                  </h6>
                  <p
                    className={`me-1 ${item?.shop_sales?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${item?.shop_sales?.percentage}%`}
                  >
                    {item?.shop_sales?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {item?.shop_sales?.percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {item?.shop_sales?.percentage}%
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </td>
            <td className="dashboard-child-tdata">

              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £ {item?.shop_profit?.shop_profit ? parseFloat(item?.shop_profit?.shop_profit)?.toLocaleString() : 0.0}
                    {/* {item?.shop_profit?.shop_profit || 0.0} */}
                  </h6>
                  <p
                    className={`me-1 ${item?.shop_profit?.status === "up"
                      ? "text-success"
                      : "text-danger"
                      }`}
                    data-tip={`${item?.shop_profit?.percentage}%`}
                  >
                    {item?.shop_profit?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {item?.shop_profit?.percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {item?.shop_profit?.percentage}%
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    ));
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <b>Site Stats</b>
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
                      <tr className="fuelprice-tr">{renderTableHeader()}</tr>
                    </thead>
                    <tbody>{renderTableData()}</tbody>
                  </table>
                </div>
              ) : (
                <img
                  src={require("../../../assets/images/commonimages/no_data.png")}
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

export default withApi(DashboardChildTable);
