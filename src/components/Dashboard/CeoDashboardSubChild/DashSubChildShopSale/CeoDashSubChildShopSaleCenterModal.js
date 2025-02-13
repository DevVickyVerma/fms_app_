import { Card, Col, Modal, Row } from "react-bootstrap";

const CeoDashSubChildShopSaleCenterModal = (props) => {
  const { showModal, setShowModal, shopPerformanceData } = props;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderTableHeader = () => (
    <tr className="fuelprice-tr p-0 ">
      <th
        className="dashboard-shopSale-table-width dashboard-shopSale-table-th"
        style={{ paddingLeft: "25px" }}
      >
        Name
      </th>
      <th className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center">
        Shop Sales
      </th>
      <th className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center">
        Quantity
      </th>
      <th className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center">
        Transactions
      </th>
    </tr>
  );

  const renderTableData = () => (
    <>
      {shopPerformanceData?.card_details?.map((cardDetail) => (
        <tr className="fuelprice-tr p-0">
          <td
            className="dashboard-shopSale-table-width dashboard-shopSale-table-td "
            style={{ minWidth: "25%" }}
          >
            <div className="d-flex align-items-center justify-center h-100">
              <div className="d-flex">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  <h6 className="mb-0 fs-15 fw-semibold small-screen-fs">
                    <img
                      src={cardDetail.image}
                      alt={cardDetail.card_name || "Card Image Alt Text"}
                      style={{
                        background: "#FFF",
                        padding: "5px",
                        borderRadius: "8px",
                        margin: "0 5px",
                      }}
                      className="small-img"
                    />
                    <span className="">{cardDetail?.card_name}</span>
                  </h6>
                </div>
              </div>
            </div>
          </td>

          <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
            <div className="d-flex align-items-center h-100 ">
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <h6 className="mb-0 fs-14 fw-semibold small-screen-fs">
                  {cardDetail?.shop_sales}
                </h6>
              </div>
            </div>
          </td>

          <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
            <div className="d-flex align-items-center h-100 ">
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <h6 className="mb-0 fs-14 fw-semibold small-screen-fs">
                  {cardDetail?.quantity}
                </h6>
              </div>
            </div>
          </td>

          <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
            <div className="d-flex align-items-center h-100 ">
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <h6 className="mb-0 fs-14 fw-semibold ">
                  {cardDetail?.transactions}
                </h6>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      centered
      className="custom-modal-width custom-modal-height big-modal "
    >
      <div className="modal-header">
        <span className="ModalTitle d-flex justify-content-between w-100 p-0 fw-normal">
          <span>{shopPerformanceData?.name}</span>
          <span onClick={handleCloseModal}>
            <button className="close-button">
              <i className="ph ph-x"></i>
            </button>
          </span>
        </span>
      </div>

      <Modal.Body className="Disable2FA-modal">
        <>
          <Card.Body>
            <Row className=" d-flex justify-content-between m-0 small-screen-fs">
              <Col lg={4} className="">
                <span className=" d-flex dashboardSubChildCard align-items-center mb-2">
                  <strong className="fw-600">
                    {" "}
                    Shop Sales :{shopPerformanceData?.shop_sales}
                  </strong>
                  {}
                </span>
              </Col>
              <Col lg={4} className=" ">
                <span className=" d-flex dashboardSubChildCard align-items-center mb-2">
                  <strong className="fw-600">
                    {" "}
                    Quantity :{shopPerformanceData?.quantity}
                  </strong>
                  {}
                </span>
              </Col>
              <Col lg={4} className=" ">
                <span className=" d-flex dashboardSubChildCard align-items-center mb-2">
                  <strong className="fw-600">
                    {" "}
                    Transactions :{shopPerformanceData?.transactions}
                  </strong>
                  {}
                </span>
              </Col>
            </Row>

            {shopPerformanceData ? (
              <div
                className="table-container table-responsive mt-4"
                style={{
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 300px )",
                  // minHeight: "100px"
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
                src={require("../../../../assets/images/commonimages/no_data.png")}
                alt="MyChartImage"
                className="all-center-flex nodata-image"
              />
            )}
          </Card.Body>
        </>
      </Modal.Body>
    </Modal>
  );
};

export default CeoDashSubChildShopSaleCenterModal;
