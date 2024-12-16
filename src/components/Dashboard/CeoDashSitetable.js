import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../Utils/ApiHelper";
import LoaderImg from "../../Utils/Loader";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CeoDashSitetable = (props) => {
  const { isLoading, data, title, tootiptitle } = props;

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

  const handleFuelPriceLinkClick = (item) => {
    // setting data for 3rd screen here with tha name of singleSiteData
    const rowDataString = JSON.stringify(item);
    localStorage.setItem("ceo-singleSiteData", rowDataString);

    // handling state manage here
    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    console.log("item", "itemitem", item);

    if (
      storedData &&
      (isSitePermissionAvailable || isSiteSecondPermissionAvailable)
    ) {
      let updatedStoredData = JSON.parse(storedData);

      updatedStoredData.site_id = item?.id; // Update the site_id here
      updatedStoredData.site_name = item?.name; // Update the site_id here

      localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));

      navigate(`/ceodashboard-details/${item?.id}`);
    }
  };

  const columns = [
    {
      name: "Sites",
      selector: (row) => [row?.name],
      sortable: false,
      width: "16%",
      id: "1",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-flex">
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
                className={`d-flex ${
                  isSitePermissionAvailable || isSiteSecondPermissionAvailable
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
      name: "Gross Volume",
      selector: (row) =>
        row.fuel_volume?.gross_volume
          ? parseFloat(row.fuel_volume.gross_volume)
          : 0,
      sortable: true,
      id: "gross_volume",
      width: "12%",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="d-flex align-items-center h-100 ">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold ">
                <span className="l-sign">ℓ</span>{" "}
                {row.fuel_volume?.gross_volume
                  ? formatNumber(row.fuel_volume?.gross_volume)
                  : "0"}
              </h6>

              <p
                className={`me-1 ${
                  row.fuel_volume?.status === "up"
                    ? "text-success"
                    : "text-danger"
                }`}
                data-tip={`${row?.fuel_volume?.percentage}%`}
              >
                {row?.fuel_volume?.status === "up" ? (
                  <>
                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                    <span className="text-success">
                      {row?.fuel_volume?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                    <span className="text-danger">
                      {row?.fuel_volume?.percentage}%
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Sales",
      selector: (row) =>
        row?.fuel_sales?.gross_value
          ? parseFloat(row?.fuel_sales?.gross_value)
          : 0,
      sortable: true,
      id: "3",
      width: "12%",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              £{" "}
              {row?.fuel_sales?.gross_value
                ? formatNumber(row?.fuel_sales?.gross_value)
                : "0"}
            </h6>
            <p
              className={`me-1 ${
                row?.fuel_sales?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row?.fuel_sales?.percentage}%`}
            >
              {row?.fuel_sales?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row?.fuel_sales?.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row?.fuel_sales?.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Gross Profit",
      selector: (row) =>
        row?.gross_profit?.gross_profit
          ? parseFloat(row?.gross_profit?.gross_profit)
          : 0,
      sortable: true,
      width: "12%",
      id: "4",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              £{" "}
              {row?.gross_profit?.gross_profit
                ? formatNumber(row?.gross_profit?.gross_profit)
                : "0"}
            </h6>
            <p
              className={`me-1 ${
                row?.gross_profit?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row?.gross_profit?.percentage}%`}
            >
              {row?.gross_profit?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row?.gross_profit?.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row?.gross_profit?.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Gross Margin",
      selector: (row) =>
        row?.gross_margin?.gross_margin
          ? parseFloat(row?.gross_margin?.gross_margin)
          : 0,
      sortable: true,
      id: "5",
      width: "12%",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {row?.gross_margin?.gross_margin
                ? formatNumber(row?.gross_margin?.gross_margin)
                : "0"}
              ppl{""}{" "}
              {row?.gross_margin?.is_ppl == 1 ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{`${row?.gross_margin?.ppl_msg}`}</Tooltip>}
                >
                  <i className="fa fa-info-circle" aria-hidden="true"></i>
                </OverlayTrigger>
              ) : (
                ""
              )}
            </h6>
            <p
              className={`me-1 ${
                row?.gross_margin?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row?.gross_margin?.percentage}%`}
            >
              {row?.gross_margin?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row?.gross_margin?.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row?.gross_margin?.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Shop Sales",
      selector: (row) =>
        row?.shop_sales?.shop_sales
          ? parseFloat(row?.shop_sales?.shop_sales)
          : 0,
      sortable: true,
      id: "6",
      width: "12%",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              £{/* {row?.shop_sales?.shop_sales} */}
              {row?.shop_sales?.shop_sales
                ? formatNumber(row?.shop_sales?.shop_sales)
                : "0"}
            </h6>
            <p
              className={`me-1 ${
                row?.shop_sales?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row?.shop_sales?.percentage}%`}
            >
              {row?.shop_sales?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row?.shop_sales?.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row?.shop_sales?.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Shop Fees",
      selector: (row) =>
        row?.shop_fees?.shop_fee ? parseFloat(row?.shop_fees?.shop_fee) : 0,
      sortable: true,
      width: "12%",
      id: "7",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              £
              {row?.shop_fees?.shop_fee
                ? formatNumber(row?.shop_fees?.shop_fee)
                : "0"}
              {/* {row?.shop_fees?.shop_fees || "0.00"} */}
            </h6>
            <p
              className={`me-1 ${
                row?.shop_fees?.status === "up" ? "text-success" : "text-danger"
              }`}
              data-tip={`${row?.shop_fees?.percentage}%`}
            >
              {row?.shop_fees?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row?.shop_fees?.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row?.shop_fees?.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Shop Profit",
      selector: (row) =>
        row?.shop_profit?.shop_profit
          ? parseFloat(row?.shop_profit?.shop_profit)
          : 0,
      sortable: true,
      width: "12%",
      id: "8",
      cell: (row) => (
        <div
          className={`d-flex ${
            isSitePermissionAvailable || isSiteSecondPermissionAvailable
              ? "pointer"
              : ""
          }`}
          onClick={() => handleFuelPriceLinkClick(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              £
              {row?.shop_profit?.shop_profit
                ? formatNumber(row?.shop_profit?.shop_profit)
                : "0"}
              {/* {row?.shop_profit?.shop_profit || "0.00"} */}
            </h6>
            <p
              className={`me-1 ${
                row?.shop_profit?.status === "up"
                  ? "text-success"
                  : "text-danger"
              }`}
              data-tip={`${row?.shop_profit?.percentage}%`}
            >
              {row?.shop_profit?.status === "up" ? (
                <>
                  <i className="fa fa-chevron-circle-up text-success me-1"></i>
                  <span className="text-success">
                    {row?.shop_profit?.percentage}%
                  </span>
                </>
              ) : (
                <>
                  <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                  <span className="text-danger">
                    {row?.shop_profit?.percentage}%
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <LoaderImg /> : null}

      <Row className=" row-sm">
        <Col lg={12}>
          <Card className="mt-5">
            <Card.Body>
              {data?.length > 0 ? (
                <>
                  <div
                    className={`table-responsive deleted-table ${
                      isSitePermissionAvailable ||
                      isSiteSecondPermissionAvailable
                        ? "show-ceo-hover-effect-data-table"
                        : ""
                    }`}
                  >
                    <DataTable
                      columns={columns}
                      data={data}
                      defaultSortField="gross_volume"
                      noHeader={true}
                      defaultSortFieldId={"gross_volume"}
                      // defaultSortField="id"
                      defaultSortAsc={false}
                      striped={true}
                      persistTableHead={true}
                      highlightOnHover={true}
                      responsive={true}
                    />
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={require("../../assets/images/commonimages/no_data.png")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Row className="h-100">
        <Col lg={12} className="h-100">
          <Card className="h-100">
            <Card.Body className="h-100">
              {data ? (
                <>
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
                </>
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
      </Row> */}
    </>
  );
};

export default withApi(CeoDashSitetable);
