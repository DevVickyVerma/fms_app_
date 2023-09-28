import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { Margin } from "@mui/icons-material";
import { useSelector } from "react-redux";

const DashTopTableSection = (props) => {
  const { apidata, isLoading, error, getData, postData, searchdata } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isSitePermissionAvailable = permissionsArray?.includes(
    "dashboard-site-detail"
  );

  const [data, setData] = useState();
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const navigate = useNavigate();
  // http://192.168.1.169:5000/get-details?client_id=3&company_id=1&end_date=2023-07-31&start_date=2023-07-01
  const FetchTableData = async () => {
    try {
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const localStoragecompanyId = localStorage.getItem("PresetCompanyID");

      const siteID =
        searchdata?.site_id !== undefined ? searchdata.site_id : "";
      let companyId = ""; // Define companyId outside the conditionals

      if (superiorRole === "Client" && role !== "Client") {
        companyId =
          searchdata?.company_id !== undefined
            ? searchdata.company_id
            : localStoragecompanyId;
      } else {
        companyId =
          searchdata?.company_id !== undefined ? searchdata.company_id : "";
      }
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/get-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${siteID}`
          : `dashboard/get-details?client_id=${ClientID}&company_id=${companyId}&site_id=${siteID}`
      );

      if (response && response.data && response.data.data) {
        setData([]);
        setData(response?.data?.data?.sites);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchTableData();
    setClientID(localStorage.getItem("superiorId"));
  }, [searchdata]);

  const tableCustomStyles = {
    headCells: {
      style: {
        // fontSize: '20px',
        fontWeight: "bold",
        // paddingLeft: '0 8px',
        justifyContent: "center",
        backgroundColor: "#e2e2e2",
        margin: "0",
        paddingTop: "0 !important",
      },
    },
  };

  function handleSaveSingleSiteData(row) {
    const rowDataString = JSON.stringify(row);
    localStorage.setItem("singleSiteData", rowDataString);
  }

  const renderTableHeader = () => {
    return (
      <tr className="fuelprice-tr " style={{ padding: "0px" }}>
        <th className="dashboard-child-thead">Sites</th>
        <th className="dashboard-child-thead">Gross Volume</th>
        <th className="dashboard-child-thead">Fuel Sales</th>
        <th className="dashboard-child-thead">Gross Profit</th>
        <th className="dashboard-child-thead">Gross Margin</th>
        <th className="dashboard-child-thead">Shop Sales</th>
        <th className="dashboard-child-thead">Shop Margin</th>
      </tr>
    );
  };

  const renderTableData = () => {
    return data?.map((item) => (
      <>
        {isSitePermissionAvailable ? (
          <div onClick={() => handleSaveSingleSiteData(item)}>
            <Link
              Link
              to={`/dashboard-details/${item?.id}`}
              style={{ padding: "0px", color: "black" }}
            >
              <tr
                className="fuelprice-tr"
                key={item.id}
                style={{ padding: "0px" }}
              >
                <td className="dashboard-child-tdata">
                  <div className="d-flex align-items-center justify-center h-100">
                    <div
                    // className="d-flex align-items-center card-img"
                    >
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

                {/* <td>{item?.fuel_volume?.total_volume}</td> */}
                <td className="dashboard-child-tdata">
                  <div className="d-flex align-items-center h-100 ">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold ">
                        ℓ{item.fuel_volume?.gross_volume}
                      </h6>

                      <p
                        className={`me-1 ${
                          item.fuel_volume?.status === "up"
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
                  {/* {item?.fuel_sales?.total_value} */}
                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £{item?.fuel_sales?.gross_value}
                      </h6>
                      <p
                        className={`me-1 ${
                          item?.fuel_sales?.status === "up"
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
                  {/* {item?.gross_profit?.gross_profit} */}
                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £{item?.gross_profit?.gross_profit}
                      </h6>
                      <p
                        className={`me-1 ${
                          item?.gross_profit?.status === "up"
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
                  {/* {item?.gross_margin?.gross_margin} */}
                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        {item?.gross_margin?.gross_margin} ppl
                      </h6>
                      <p
                        className={`me-1 ${
                          item?.gross_margin?.status === "up"
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
                  {/* {item?.shop_sales?.shop_sales} */}
                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £{item?.shop_sales?.shop_sales}
                      </h6>
                      <p
                        className={`me-1 ${
                          item?.shop_sales?.status === "up"
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
                  {/* {item?.shop_margin?.shop_margin} */}
                  <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                      <h6 className="mb-0 fs-14 fw-semibold">
                        £{item?.shop_margin?.shop_margin}
                      </h6>
                      <p
                        className={`me-1 ${
                          item?.shop_margin?.status === "up"
                            ? "text-success"
                            : "text-danger"
                        }`}
                        data-tip={`${item?.shop_margin?.percentage}%`}
                      >
                        {item?.shop_margin?.status === "up" ? (
                          <>
                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                            <span className="text-success">
                              {item?.shop_margin?.percentage}%
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                            <span className="text-danger">
                              {item?.shop_margin?.percentage}%
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
          <tr className="fuelprice-tr" key={item.id} style={{ padding: "0px" }}>
            <td className="dashboard-child-tdata">
              <div className="d-flex align-items-center justify-center h-100">
                <div
                // className="d-flex align-items-center card-img"
                >
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

            {/* <td>{item?.fuel_volume?.total_volume}</td> */}
            <td className="dashboard-child-tdata">
              <div className="d-flex align-items-center h-100 ">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold ">
                    ℓ{item.fuel_volume?.gross_volume}
                  </h6>

                  <p
                    className={`me-1 ${
                      item.fuel_volume?.status === "up"
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
              {/* {item?.fuel_sales?.total_value} */}
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £{item?.fuel_sales?.gross_value}
                  </h6>
                  <p
                    className={`me-1 ${
                      item?.fuel_sales?.status === "up"
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
              {/* {item?.gross_profit?.gross_profit} */}
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £{item?.gross_profit?.gross_profit}
                  </h6>
                  <p
                    className={`me-1 ${
                      item?.gross_profit?.status === "up"
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
              {/* {item?.gross_margin?.gross_margin} */}
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    {item?.gross_margin?.gross_margin} ppl
                  </h6>
                  <p
                    className={`me-1 ${
                      item?.gross_margin?.status === "up"
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
              {/* {item?.shop_sales?.shop_sales} */}
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £{item?.shop_sales?.shop_sales}
                  </h6>
                  <p
                    className={`me-1 ${
                      item?.shop_sales?.status === "up"
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
              {/* {item?.shop_margin?.shop_margin} */}
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £{item?.shop_margin?.shop_margin}
                  </h6>
                  <p
                    className={`me-1 ${
                      item?.shop_margin?.status === "up"
                        ? "text-success"
                        : "text-danger"
                    }`}
                    data-tip={`${item?.shop_margin?.percentage}%`}
                  >
                    {item?.shop_margin?.status === "up" ? (
                      <>
                        <i className="fa fa-chevron-circle-up text-success me-1"></i>
                        <span className="text-success">
                          {item?.shop_margin?.percentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                        <span className="text-danger">
                          {item?.shop_margin?.percentage}%
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
              <b>{UserPermissions?.d_label}</b>
            </Card.Header>
            <Card.Body>
              {data ? (
                <div
                  className="table-container table-responsive"
                  // style={{ height: "700px", overflowY: "auto" }}
                  style={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 376px )",
                    minHeight: "300px",
                  }}
                  // height:"245"
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
                  src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
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

export default withApi(DashTopTableSection);
