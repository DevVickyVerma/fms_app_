import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";


import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import withApi from "../../Utils/ApiHelper";
import LoaderImg from "../../Utils/Loader";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const TitanStatsTable = (props) => {
    const { isLoading, data, title } = props;

    const UserPermissions = useSelector(
        (state) => state?.data?.data?.permissions || []
    );
    const isSitePermissionAvailable = UserPermissions?.includes(
        "ceodashboard-site-detail"
    );
    const isSiteSecondPermissionAvailable = UserPermissions?.includes(
        "ceodashboard-site-stats"
    );

    const handleFuelPriceLinkClick = (item) => {


        console.log(item, "item");
        // setting data for 3rd screen here with tha name of singleSiteData
        // const rowDataString = JSON.stringify(item);
        // localStorage.setItem("ceo-singleSiteData", rowDataString);

        // // handling state manage here
        // let storedKeyName = "localFilterModalData";
        // const storedData = localStorage.getItem(storedKeyName);

        // if (
        //   storedData &&
        //   (isSitePermissionAvailable || isSiteSecondPermissionAvailable)
        // ) {
        //   let updatedStoredData = JSON.parse(storedData);

        //   updatedStoredData.site_id = item?.id; // Update the site_id here
        //   updatedStoredData.site_name = item?.name; // Update the site_id here

        //   localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));

        //   navigate(`/ceodashboard-details/${item?.id}`);
        // }
    };

    const columns = [
        {
            name: "Sites",
            selector: (row) => [row?.name],
            sortable: false,
            width: "23%",
            id: "1",
            cell: (row) => (
                <div
                    className={`spacebetween   ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                        ? "pointer"
                        : ""
                        }`}
                    onClick={() => handleFuelPriceLinkClick(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-flex  ">
                        <div className="d-flex align-items-center justify-center h-100">
                            <div>
                                <img
                                    src={row.image}
                                    alt={row.image}
                                    className="mr-2"
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        minWidth: "30px",
                                    }}
                                />
                            </div>
                            <div
                                className={`spacebetween ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                                    ? "pointer"
                                    : ""
                                    }`}
                                onClick={() => handleFuelPriceLinkClick(row)}
                            >
                                <div className="ms-2 mt-0 mt-sm-2 d-block">
                                    <h6 className="mb-0 fs-15 fw-semibold">{row?.name}</h6>
                                    <small>{row.date ? `(${row.date})` : ""}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            name: "Wet Stock",
            selector: (row) =>
                row.detail?.wet_stock_value
                    ? parseFloat(row.detail?.wet_stock_value?.value)
                    : 0,
            sortable: true,
            id: "wet_stock_value",
            width: "19.25%",
            cell: (row) => (
                <div
                    className={` spacebetween  ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                        ? "pointer"
                        : ""
                        }`}
                    onClick={() => handleFuelPriceLinkClick(row)}
                    style={{ width: "100%" }}
                >

                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Wet Stock Value</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.wet_stock_value?.value
                                        ? formatNumber(row.detail?.wet_stock_value?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Value</Tooltip>}>

                                <p>
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.wet_stock_value?.ytd_value
                                        ? formatNumber(row.detail?.wet_stock_value?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.wet_stock_value?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.wet_stock_value?.percentage}%`}
                                >
                                    {row.detail?.wet_stock_value?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.wet_stock_value?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.wet_stock_value?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>


                        </div>
                    </div>
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Wet Stock Volume</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.wet_stock_value?.value
                                        ? formatNumber(row.detail?.wet_stock_volume?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Volume</Tooltip>}>

                                <p>
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.wet_stock_volume?.ytd_value
                                        ? formatNumber(row.detail?.wet_stock_volume?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.wet_stock_volume?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.wet_stock_volume?.percentage}%`}
                                >
                                    {row.detail?.wet_stock_volume?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.wet_stock_volume?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.wet_stock_volume?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>


                        </div>
                    </div>
                </div>

            ),
        },
        {
            name: "Delivery Loss",
            selector: (row) =>
                row.detail?.delivery_loss_value
                    ? parseFloat(row.detail?.delivery_loss_value?.value)
                    : 0,
            sortable: true,
            id: "delivery_loss_value",
            width: "19.25%",
            cell: (row) => (
                <div
                    className={`spacebetween   ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                        ? "pointer"
                        : ""
                        }`}
                    onClick={() => handleFuelPriceLinkClick(row)}
                    style={{ width: "100%" }}
                >
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delivery Loss Value</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.delivery_loss_value?.value
                                        ? formatNumber(row.detail?.delivery_loss_value?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Value</Tooltip>}>

                                <p>
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.delivery_loss_value?.ytd_value
                                        ? formatNumber(row.detail?.delivery_loss_value?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.delivery_loss_value?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.delivery_loss_value?.percentage}%`}
                                >
                                    {row.detail?.delivery_loss_value?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.delivery_loss_value?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.delivery_loss_value?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>


                        </div>
                    </div>
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delivery Loss Volume</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.delivery_loss_volume?.value
                                        ? formatNumber(row.detail?.delivery_loss_volume?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Volume</Tooltip>}>

                                <p>
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.delivery_loss_volume?.ytd_value
                                        ? formatNumber(row.detail?.delivery_loss_volume?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.delivery_loss_volume?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.delivery_loss_volume?.percentage}%`}
                                >
                                    {row.detail?.delivery_loss_volume?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.delivery_loss_volume?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.delivery_loss_volume?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>


                        </div>
                    </div>
                </div>
            ),
        },
        {
            name: "Unkonwn Loss Value",
            selector: (row) =>
                row.detail?.unkonwn_loss_value
                    ? parseFloat(row.detail?.unkonwn_loss_value?.value)
                    : 0,
            sortable: true,
            id: "unkonwn_loss_value",
            width: "19.25%",
            cell: (row) => (
                <div
                    className={`spacebetween   ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                        ? "pointer"
                        : ""
                        }`}
                    onClick={() => handleFuelPriceLinkClick(row)}
                    style={{ width: "100%" }}
                >
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Unkonwn Loss Value</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.unkonwn_loss_value?.value
                                        ? formatNumber(row.detail?.unkonwn_loss_value?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Value</Tooltip>}>

                                <p>
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.unkonwn_loss_value?.ytd_value
                                        ? formatNumber(row.detail?.unkonwn_loss_value?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.unkonwn_loss_value?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.unkonwn_loss_value?.percentage}%`}
                                >
                                    {row.detail?.unkonwn_loss_value?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.unkonwn_loss_value?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.unkonwn_loss_value?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>


                        </div>
                    </div>
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Unkonwn Loss Volume</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.unkonwn_loss_volume?.value
                                        ? formatNumber(row.detail?.unkonwn_loss_volume?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Volume</Tooltip>}>

                                <p>
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.unkonwn_loss_volume?.ytd_value
                                        ? formatNumber(row.detail?.unkonwn_loss_volume?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.unkonwn_loss_volume?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.unkonwn_loss_volume?.percentage}%`}
                                >
                                    {row.detail?.unkonwn_loss_volume?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.unkonwn_loss_volume?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.unkonwn_loss_volume?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>


                        </div>
                    </div>
                </div>
            ),
        },
        {
            name: "Closing Stock",
            selector: (row) =>
                row.detail?.dip_stock_value
                    ? parseFloat(row.detail?.dip_stock_value?.value)
                    : 0,
            sortable: true,
            id: "dip_stock_value",
            width: "19.25%",
            cell: (row) => (
                <div
                    className={`spacebetween   ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                        ? "pointer"
                        : ""
                        }`}
                    onClick={() => handleFuelPriceLinkClick(row)}
                    style={{ width: "100%" }}
                >
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Closing Stock Value</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.dip_stock_value?.value
                                        ? formatNumber(row.detail?.dip_stock_value?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Value</Tooltip>}>

                                <p>
                                    <span className="l-sign">£</span>{" "}
                                    {row.detail?.dip_stock_value?.ytd_value
                                        ? formatNumber(row.detail?.dip_stock_value?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.dip_stock_value?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.dip_stock_value?.percentage}%`}
                                >
                                    {row.detail?.dip_stock_value?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.dip_stock_value?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.dip_stock_value?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>


                        </div>
                    </div>
                    <div className="d-flex align-items-center h-100 ">
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Closing Stock Volume</Tooltip>}>

                                <h4 className="mb-0 fs-15 fw-semibold ">
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.dip_stock_volume?.value
                                        ? formatNumber(row.detail?.dip_stock_volume?.value)
                                        : "0"}

                                </h4>
                            </OverlayTrigger>

                            <OverlayTrigger placement="top" overlay={<Tooltip>YTD Volume</Tooltip>}>

                                <p>
                                    <span className="l-sign">ℓ</span>{" "}
                                    {row.detail?.dip_stock_volume?.ytd_value
                                        ? formatNumber(row.detail?.dip_stock_volume?.ytd_value)
                                        : "0"}
                                </p>

                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Percentage</Tooltip>}>
                                <p
                                    className={`me-1 mb-0 c-fs-10 ${row.detail?.dip_stock_volume?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                    data-tip={`${row.detail?.dip_stock_volume?.percentage}%`}
                                >
                                    {row.detail?.dip_stock_volume?.status == "up" ? (
                                        <>
                                            <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                            <span className="text-success">
                                                {row.detail?.dip_stock_volume?.percentage}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                            <span className="text-danger">
                                                {row.detail?.dip_stock_volume?.percentage}%
                                            </span>
                                        </>
                                    )}
                                </p>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
            ),
        },

    ];
    const TableComponent = () => (
        <div
            className={`table-responsive deleted-table performance-col ${isSitePermissionAvailable || isSiteSecondPermissionAvailable
                ? "show-ceo-hover-effect-data-table"
                : ""
                }`}
        >
            <DataTable
                columns={columns}
                data={data}
                defaultSortField="gross_volume"
                noHeader
                defaultSortFieldId="gross_volume"
                defaultSortAsc={false}
                striped
                persistTableHead
                highlightOnHover
                responsive
            />
        </div>
    );

    const NoDataComponent = () => (
        <img
            src={require("../../assets/images/commonimages/no_data.png")}
            alt="No Data Available"
            className="all-center-flex nodata-image"
        />
    );

    return (
        <>
            {isLoading ? <LoaderImg /> : null}

            <Row className=" row-sm">
                <Col lg={12}>
                    {title ? (
                        <Card>
                            <Card.Header>{title}</Card.Header>
                            <Card.Body>
                                {data?.length > 0 ? (
                                    <TableComponent />
                                ) : (
                                    <NoDataComponent />
                                )}
                            </Card.Body>
                        </Card>
                    ) : data?.length > 0 ? (
                        <TableComponent />
                    ) : (
                        <NoDataComponent />
                    )}
                </Col>

            </Row>
        </>
    );
};

export default withApi(TitanStatsTable);
