import React from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import withApi from "../../Utils/ApiHelper";
import LoaderImg from "../../Utils/Loader";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import { useSelector } from "react-redux";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const TitanDashboardChildTable = (props) => {
    const { isLoading, data, ceo } = props;
    const UserPermissions = useSelector(
        (state) => state?.data?.data?.permissions || []
    );
    const navigate = useNavigate();

    // ! Importent :- site permiossion is added one permission is needed to go into thrid screen
    const isSitePermissionAvailable = UserPermissions?.includes(
        "ceodashboard-site-detail"
    );
    const isSiteSecondPermissionAvailable = UserPermissions?.includes(
        "ceodashboard-site-stats"
    );

    function handleSaveSingleSiteData(row) {
        const rowDataString = JSON.stringify(row);
        localStorage.setItem("ceo-singleSiteData", rowDataString);
    }
    const formatHeader = (header) => {
        return header
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
    };


    const renderTableHeader = () => (
        <tr className="fuelprice-tr " style={{ padding: "0px" }}>
            <th className="dashboard-child-thead">Sites</th>
            <th className="dashboard-child-thead">{formatHeader(`wet_stock_volume`)}</th>
            <th className="dashboard-child-thead">{formatHeader(`delivery_loss_volume`)}</th>
            <th className="dashboard-child-thead">{formatHeader(`unkonwn_loss_volume`)}</th>
            <th className="dashboard-child-thead">{formatHeader(`wet_stock_value`)}</th>
            <th className="dashboard-child-thead">{formatHeader(`delivery_loss_value`)}</th>
            <th className="dashboard-child-thead">{formatHeader(`unkonwn_loss_value`)}</th>
            <th className="dashboard-child-thead">{formatHeader(`Dips Stock `)}</th>

        </tr>
    );

    const handleFuelPriceLinkClick = (item) => {
        // setting data for 3rd screen here with tha name of singleSiteData
        const rowDataString = JSON.stringify(item);
        localStorage.setItem("ceo-singleSiteData", rowDataString);

        // handling state manage here
        let storedKeyName = "localFilterModalData";
        const storedData = localStorage.getItem(storedKeyName);

        if (
            storedData &&
            (isSitePermissionAvailable || isSiteSecondPermissionAvailable)
        ) {
            let updatedStoredData = JSON.parse(storedData);

            updatedStoredData.site_id = item?.id; // Update the site_id here
            updatedStoredData.site_name = item?.name; // Update the site_id here

            localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));

            navigate(`/titandashboard-details/${item?.id}`);

            //   {
            //     ceo
            //       ? navigate(`/titandashboard-details/${item?.id}`, {
            //           state: { details: true }, // Pass the state when ceo is true
            //         })
            //       : navigate(`/titandashboard-details/${item?.id}`); // No state when ceo is false
            //   }
        }
    };

    const renderTableData = () =>
        data?.map((item, index) => (
            <React.Fragment key={index}>


                {console.log(item, "item")}
                {isSitePermissionAvailable || isSiteSecondPermissionAvailable ? (
                    <>

                        <tr
                            className={`fuelprice-tr p-0  ceo-sats-table-hover ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                                ? "pointer "
                                : ""
                                }`}
                            key={item.id}
                            onClick={() => handleFuelPriceLinkClick(item)}
                        >
                            <td className="dashboard-child-tdata">
                                <div className="d-flex align-items-center justify-center h-100">
                                    <div>
                                        <img
                                            src={item.image}
                                            alt={"No Img"}
                                            className="mr-2"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                minWidth: "30px",
                                            }}
                                        />
                                    </div>
                                    {isSitePermissionAvailable ||
                                        isSiteSecondPermissionAvailable ? (
                                        <div onClick={() => handleSaveSingleSiteData(item)}>
                                            <Link to={`/titandashboard-details/${item?.id}`}>
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
                                            <span className="l-sign">ℓ</span>{" "}

                                            {item?.detail?.wet_stock_volume
                                                ? formatNumber(item?.detail?.wet_stock_volume?.value)
                                                : "0"}
                                        </h6>

                                        <p
                                            className={`me-1 ${item?.detail?.wet_stock_volume?.status === "up"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                            data-tip={`${item?.detail?.wet_stock_volume?.percentage}%`}
                                        >
                                            {item?.detail?.wet_stock_volume?.status === "up" ? (
                                                <>
                                                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                    <span className="text-success">
                                                        {item?.detail?.wet_stock_volume?.percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                    <span className="text-danger">
                                                        {item?.detail?.wet_stock_volume?.percentage}%
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
                                            <span className="l-sign">ℓ</span>{" "}
                                            {item?.detail?.delivery_loss_volume
                                                ? formatNumber(item?.detail?.delivery_loss_volume?.value)
                                                : "0"}
                                        </h6>
                                        <p
                                            className={`me-1 ${item?.detail?.delivery_loss_volume?.status === "up"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                            data-tip={`${item?.detail?.delivery_loss_volume?.percentage}%`}
                                        >
                                            {item?.detail?.delivery_loss_volume?.status === "up" ? (
                                                <>
                                                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                    <span className="text-success">
                                                        {item?.detail?.delivery_loss_volume?.percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                    <span className="text-danger">
                                                        {item?.detail?.delivery_loss_volume?.percentage}%
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
                                            <span className="l-sign">ℓ {""}</span>
                                            {item?.detail?.unkonwn_loss_volume
                                                ? formatNumber(item?.detail?.unkonwn_loss_volume?.value)
                                                : "0"}
                                        </h6>
                                        <p
                                            className={`me-1 ${item?.detail?.unkonwn_loss_volume?.status === "up"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                            data-tip={`${item?.detail?.unkonwn_loss_volume?.percentage}%`}
                                        >
                                            {item?.detail?.unkonwn_loss_volume?.status === "up" ? (
                                                <>
                                                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                    <span className="text-success">
                                                        {item?.detail?.unkonwn_loss_volume?.percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                    <span className="text-danger">
                                                        {item?.detail?.unkonwn_loss_volume?.percentage}%
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
                                            {item?.detail?.wet_stock_value
                                                ? formatNumber(item?.detail?.wet_stock_value?.value)
                                                : "0"}
                                        </h6>
                                        <p
                                            className={`me-1 ${item?.detail?.wet_stock_value?.status === "up"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                            data-tip={`${item?.detail?.wet_stock_value?.percentage}%`}
                                        >
                                            {item?.detail?.wet_stock_value?.status === "up" ? (
                                                <>
                                                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                    <span className="text-success">
                                                        {item?.detail?.wet_stock_value?.percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                    <span className="text-danger">
                                                        {item?.detail?.wet_stock_value?.percentage}%
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
                                            {item?.detail?.delivery_loss_value
                                                ? formatNumber(item?.detail?.delivery_loss_value?.value)
                                                : "0"}
                                            {/* {item?.shop_profit?.shop_profit || "0.00"} */}
                                        </h6>
                                        <p
                                            className={`me-1 ${item?.detail?.delivery_loss_value?.status === "up"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                            data-tip={`${item?.detail?.delivery_loss_value?.percentage}%`}
                                        >
                                            {item?.detail?.delivery_loss_value?.status === "up" ? (
                                                <>
                                                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                    <span className="text-success">
                                                        {item?.detail?.delivery_loss_value?.percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                    <span className="text-danger">
                                                        {item?.detail?.delivery_loss_value?.percentage}%
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
                                            {item?.detail?.unkonwn_loss_value
                                                ? formatNumber(item?.detail?.unkonwn_loss_value?.value)
                                                : "0"}
                                            {/* {item?.valet_sales?.valet_sales || "0.00"} */}
                                        </h6>
                                        <p
                                            className={`me-1 ${item?.detail?.unkonwn_loss_value?.status === "up"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                            data-tip={`${item?.detail?.unkonwn_loss_value?.percentage}%`}
                                        >
                                            {item?.detail?.unkonwn_loss_value?.status === "up" ? (
                                                <>
                                                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                    <span className="text-success">
                                                        {item?.detail?.unkonwn_loss_value?.percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                    <span className="text-danger">
                                                        {item?.detail?.unkonwn_loss_value?.percentage}%
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
                                            {item?.detail?.unkonwn_loss_value
                                                ? formatNumber(item?.detail?.unkonwn_loss_value?.value)
                                                : "0"}
                                            {/* {item?.valet_sales?.valet_sales || "0.00"} */}
                                        </h6>
                                        <p
                                            className={`me-1 ${item?.detail?.unkonwn_loss_value?.status === "up"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                            data-tip={`${item?.detail?.unkonwn_loss_value?.percentage}%`}
                                        >
                                            {item?.detail?.unkonwn_loss_value?.status === "up" ? (
                                                <>
                                                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                    <span className="text-success">
                                                        {item?.detail?.unkonwn_loss_value?.percentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                    <span className="text-danger">
                                                        {item?.detail?.unkonwn_loss_value?.percentage}%
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </td>

                        </tr>
                    </>
                ) : (
                    <tr
                        className="fuelprice-tr ceo-sats-table-hover"
                        key={item?.id}
                        style={{ padding: "0px" }}
                    >
                        <td className="dashboard-child-tdata">
                            <div className="d-flex align-items-center justify-center h-100">
                                <div>
                                    <img
                                        src={item.image}
                                        alt={"No Img"}
                                        className="mr-2"
                                        style={{ width: "30px", height: "30px", minWidth: "30px" }}
                                    />
                                </div>
                                {isSitePermissionAvailable ||
                                    isSiteSecondPermissionAvailable ? (
                                    <div
                                    // onClick={() => handleSaveSingleSiteData(item)}
                                    >
                                        <Link to={`/titandashboard-details/${item?.id}`}>
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
                                        <span className="l-sign">ℓ</span>
                                        {item?.wet_stock_volume?.value}
                                    </h6>

                                    <p
                                        className={`me-1 ${item?.wet_stock_volume?.status === "up"
                                            ? "text-success"
                                            : "text-danger"
                                            }`}
                                        data-tip={`${item?.detail?.wet_stock_volume?.percentage}%`}
                                    >
                                        {item?.detail?.wet_stock_volume?.status === "up" ? (
                                            <>
                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                <span className="text-success">
                                                    {item?.detail?.wet_stock_volume?.percentage}%
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                <span className="text-danger">
                                                    {item?.detail?.wet_stock_volume?.percentage}%
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
                                        <span className="l-sign">ℓ</span>{item?.detail?.wet_stock_volume}
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
                                        £{" "}
                                        {item?.shop_sales?.shop_sales
                                            ? parseFloat(
                                                item?.shop_sales?.shop_sales
                                            )?.toLocaleString()
                                            : ""}
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
                        {/* <td className="dashboard-child-tdata">
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-14 fw-semibold">
                    £{" "}
                    {item?.shop_profit?.shop_profit
                      ? parseFloat(
                          item?.shop_profit?.shop_profit
                        )?.toLocaleString()
                      : 0.0}
                  </h6>
                  <p
                    className={`me-1 ${
                      item?.shop_profit?.status === "up"
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
            </td> */}
                        <td className="dashboard-child-tdata">
                            <div className="d-flex">
                                <div className="ms-2 mt-0 mt-sm-2 d-block">
                                    <h6 className="mb-0 fs-14 fw-semibold">
                                        £{" "}
                                        {item?.valet_sales?.valet_sales
                                            ? parseFloat(
                                                item?.valet_sales?.valet_sales
                                            )?.toLocaleString()
                                            : 0.0}
                                    </h6>
                                    <p
                                        className={`me-1 ${item?.valet_sales?.status === "up"
                                            ? "text-success"
                                            : "text-danger"
                                            }`}
                                        data-tip={`${item?.valet_sales?.percentage}%`}
                                    >
                                        {item?.valet_sales?.status === "up" ? (
                                            <>
                                                <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                                <span className="text-success">
                                                    {item?.valet_sales?.percentage}%
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                                <span className="text-danger">
                                                    {item?.valet_sales?.percentage}%
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        ));

    return (
        <>
            {isLoading ? <LoaderImg /> : null}

            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <b>Site Stats </b>
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
                                            <>{renderTableHeader()}</>
                                        </thead>
                                        <tbody>{renderTableData()}</tbody>
                                    </table>
                                </div>
                            ) : (
                                <NoDataComponent />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default withApi(TitanDashboardChildTable);
