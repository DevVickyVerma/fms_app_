import React, { useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import LoaderImg from "../../Utils/Loader";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const CeoDashSitetable = (props) => {
  const { isLoading, data, title, tootiptitle } = props;
  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const renderTableHeader = () => (
    <tr className="fuelprice-tr " style={{ padding: "0px" }}>
      <th className="dashboard-child-thead c-width-500 overflow-wrap-anywhere">
        Sites
      </th>
      <th className="dashboard-child-thead">Gross Volume</th>
      <th className="dashboard-child-thead">Fuel Sales</th>
      <th className="dashboard-child-thead">Gross Profit</th>
      <th className="dashboard-child-thead">Gross Margin</th>
      <th className="dashboard-child-thead">Shop Sales</th>
      <th className="dashboard-child-thead">Shop Fees</th>
      <th className="dashboard-child-thead">Shop Profit</th>
    </tr>
  );

  const renderTableData = () =>
    data?.map((item, index) => (
      <React.Fragment key={index}>
        <tr className={`fuelprice-tr p-0  ceo-sats-table-hover`} key={item.id}>
          <td className="dashboard-child-tdata c-width-500 overflow-wrap-anywhere">
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
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-15 fw-semibold">{item?.name}</h6>
                  <small>{item.date ? `(${item.date})` : ""}</small>
                </div>
              </div>
            </div>
          </td>

          <td className="dashboard-child-tdata">
            <div className="d-flex align-items-center h-100 ">
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <h6 className="mb-0 fs-14 fw-semibold ">
                  <span className="l-sign">ℓ</span>{" "}
                  {item.fuel_volume?.gross_volume
                    ? formatNumber(item.fuel_volume?.gross_volume)
                    : "0"}
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
                  £{" "}
                  {item?.fuel_sales?.gross_value
                    ? formatNumber(item?.fuel_sales?.gross_value)
                    : "0"}
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
                  £{" "}
                  {item?.gross_profit?.gross_profit
                    ? formatNumber(item?.gross_profit?.gross_profit)
                    : "0"}
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
                    : "0"}
                  ppl{""}{" "}
                  {item?.gross_margin?.is_ppl == 1 ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>{`${item?.gross_margin?.ppl_msg}`}</Tooltip>
                      }
                    >
                      <i className="fa fa-info-circle" aria-hidden="true"></i>
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
                  £{/* {item?.shop_sales?.shop_sales} */}
                  {item?.shop_sales?.shop_sales
                    ? formatNumber(item?.shop_sales?.shop_sales)
                    : "0"}
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
                    : "0"}
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
                    : "0"}
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
      </React.Fragment>
    ));

  const sortDataByFuelVolume = () => {
    const sortedData = [...data].sort((a, b) => {
      const volumeA = parseFloat(a.fuel_volume.gross_volume);
      const volumeB = parseFloat(b.fuel_volume.gross_volume);
      return volumeB - volumeA; // Descending order
    });
    console.log(sortedData, "FuelVolume");

  };
  const sortDataByFuelValue = () => {
    const sortedData = [...data].sort((a, b) => {
      const volumeA = parseFloat(a.fuel_sales.gross_value);
      const volumeB = parseFloat(b.fuel_sales.gross_value);
      return volumeB - volumeA; // Descending order
    });
    console.log(sortedData, "FuelValue");

  };




  return (
    <>
      {isLoading ? <LoaderImg /> : null}
      <button className="btn btn-primary" onClick={sortDataByFuelVolume}>Sort by Fuel Volume</button>
      <button className="btn btn-primary ms-2" onClick={sortDataByFuelValue}>Sort by Fuel Value</button>


      <Row className="h-100">
        <Col lg={12} className="h-100">
          <Card className="h-100">
            {/* <Card.Header>
              <b>{title} </b>
            </Card.Header> */}

            <Card.Body className="h-100">
              {data ? (
                <div
                  className="table-container table-responsive"
                  style={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 176px )",

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
                      <>{renderTableHeader()}</>
                    </thead>
                    <tbody>{renderTableData()}</tbody>
                  </table>
                </div>
              ) : (
                <img
                  src={require("../../assets/images/commonimages/no_data.png")}
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

export default withApi(CeoDashSitetable);
