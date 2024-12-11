import { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import {
  FaChartLine,
  FaRegChartBar,
  FaGasPump,
  FaFileAlt,
  FaChartPie,
  FaClipboardList,
} from "react-icons/fa";
import { PriceLogsData } from "../../Utils/commonFunctions/CommonData";
import PriceLogTable from "./PriceLogTable";
import CeoMopModal from "../../components/Dashboard/CeoDashboardModal/CeoMopModal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CeoDashBoardBottomPage = () => {
  const [showCeoMopModal, setShowCeoMopModal] = useState(false);
  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const dailyWiseSalesPermission = userPermissions?.includes(
    "ceodashboard-daily-sales"
  );
  const liveMarginPermission = userPermissions?.includes(
    "ceodashboard-live-margin"
  );
  const liveAndDailyPermission =
    dailyWiseSalesPermission && liveMarginPermission;
  const mopPermission = userPermissions?.includes("ceodashboard-mop");
  const comparisonPermission = userPermissions?.includes(
    "ceodashboard-comparison"
  );
  const performancePermission = userPermissions?.includes(
    "ceodashboard-performance"
  );
  const reportsPermission = userPermissions?.includes("ceodashboard-reports");
  const stockDetailsPermission = userPermissions?.includes(
    "ceodashboard-stock-details"
  );

  const mopComparisonPerformanceReportsPermission =
    mopPermission ||
    comparisonPermission ||
    performancePermission ||
    reportsPermission;

  const priceLogsPermission = userPermissions?.includes(
    "ceodashboard-price-logs"
  );
  const priceGraphPermission = userPermissions?.includes(
    "ceodashboard-price-graph"
  );

  const priceLogAndGraphPermission =
    priceLogsPermission && priceGraphPermission;

  const handleCloseSidebar = () => {
    console.log("closed called in parent ");
    setShowCeoMopModal(false);
  };
  // Assuming modalTitle is set in state
  const [modalTitle, setModalTitle] = useState("");
  const handleCardClick = (cardName) => {
    console.log(`Card clicked: ${cardName}`);
    setModalTitle(cardName);
    setShowCeoMopModal(true);
  };

  return (
    <>
      {showCeoMopModal && (
        <>
          <CeoMopModal
            title={modalTitle}
            sidebarContent={"sidebardataobject"}
            visible={showCeoMopModal}
            onClose={handleCloseSidebar}
          />
        </>
      )}

      <>
        <Col lg={12} className="mb-4">
          <Row className="slide-in-right">
            {dailyWiseSalesPermission && (
              <>
                <Col
                  md={liveAndDailyPermission ? 9 : 12}
                  onClick={() => handleCardClick("Daily Wise Sales")}
                  style={{
                    backgroundColor: "#8563b6", // Blue background
                    color: "#fff",
                    height: "40px",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="ceo-sats-card-hover"
                >
                  <FaChartLine size={25} />
                  <h3 style={{ fontSize: "18px" }} className="m-0 ms-2">
                    Daily Wise Sales
                  </h3>
                </Col>
              </>
            )}

            {liveMarginPermission && (
              <Col
                md={liveAndDailyPermission ? 3 : 12}
                style={{
                  backgroundColor: "red", // Yellow background
                  color: "#fff",
                  height: "40px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="ceo-sats-card-hover"
              >
                <h3 style={{ fontSize: "18px" }} className="m-0">
                  <img
                    src={require("../../assets/images/commonimages/LiveIMg.gif")}
                    alt="Live Img"
                    className="Liveimage"
                  />{" "}
                  Margins
                </h3>
              </Col>
            )}
          </Row>
        </Col>
      </>

      {/* {/ Second Row /} */}
      <Row Row className="my-2">
        {mopComparisonPerformanceReportsPermission && (
          <>
            <Col lg={stockDetailsPermission ? 6 : 12}>
              <Row>
                {mopPermission && (
                  <>
                    <Col
                      md={6}
                      onClick={() => handleCardClick("MOP Breakdown")}
                      className="slide-in-left "
                    >
                      <Card
                        className="ceocard-hover"
                        style={{
                          backgroundColor: "#4663ac", // Red background
                          color: "#fff",
                          minHeight: "120px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          transition: "all 0.3s ease", // Smooth opacity transition
                        }}
                      >
                        <FaChartLine size={40} />
                        <h5 className="m-0 mt-2">MOP Breakdown</h5>
                      </Card>
                    </Col>
                  </>
                )}

                {comparisonPermission && (
                  <>
                    <Col
                      md={6}
                      onClick={() => handleCardClick("Comparison")}
                      className="slide-in-left "
                    >
                      <Card
                        className="ceocard-hover"
                        style={{
                          backgroundColor: "#6764b3", // Dark Blue background
                          color: "#fff",
                          minHeight: "120px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          transition: "all 0.3s ease", // Smooth opacity transition
                        }}
                      >
                        <FaRegChartBar size={40} />
                        <h5 className="m-0 mt-2">Comparison</h5>
                      </Card>
                    </Col>
                  </>
                )}

                {performancePermission && (
                  <>
                    <Col
                      md={6}
                      onClick={() => handleCardClick("Performance")}
                      className="slide-in-right"
                    >
                      <Card
                        className="ceocard-hover"
                        style={{
                          backgroundColor: "#8563b6", // Light Blue background
                          color: "#fff",
                          minHeight: "120px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          transition: "all 0.3s ease", // Smooth opacity transition
                        }}
                      >
                        <FaGasPump size={40} />
                        <h5 className="m-0 mt-2">Performance</h5>
                      </Card>
                    </Col>
                  </>
                )}
                {reportsPermission && (
                  <>
                    {" "}
                    <Col
                      md={6}
                      onClick={() => handleCardClick("Reports")}
                      className="slide-in-right"
                    >
                      <Card
                        className="ceocard-hover"
                        style={{
                          backgroundColor: "#7e95e4", // Yellow background
                          color: "#fff",
                          minHeight: "120px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          transition: "all 0.3s ease", // Smooth opacity transition
                        }}
                      >
                        <FaFileAlt size={40} />
                        <h5 className="m-0 mt-2">Reports</h5>
                      </Card>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </>
        )}

        {stockDetailsPermission && (
          <>
            <Col
              md={mopComparisonPerformanceReportsPermission ? 2 : 4}
              onClick={() => handleCardClick("Stock")}
              className="slide-in-bottom"
            >
              <Card
                className="ceocard-hover card-default-height"
                style={{
                  backgroundColor: "#8563b6", // Light Blue background
                  color: "#fff",
                  // height: "100%",
                  minHeight: "111px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease", // Smooth opacity transition
                }}
              >
                <div>
                  <FaChartPie size={40} />
                  <h5 className="m-0 mt-2">Stock</h5>
                </div>
              </Card>
            </Col>

            <Col
              md={mopComparisonPerformanceReportsPermission ? 2 : 4}
              onClick={() => handleCardClick("Shrinkage")}
              className="slide-in-bottom"
            >
              <Card
                className="ceocard-hover card-default-height"
                style={{
                  backgroundColor: "#7e95e4", // Dark Blue background
                  color: "#fff",
                  // height: "100%",
                  minHeight: "111px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease", // Smooth opacity transition
                }}
              >
                <FaClipboardList size={40} />
                <h5 className="m-0 mt-2">Shrinkage</h5>
              </Card>
            </Col>

            <Col
              md={mopComparisonPerformanceReportsPermission ? 2 : 4}
              onClick={() => handleCardClick("Stock Details")}
              className="slide-in-bottom"
            >
              <Card
                className="ceocard-hover card-default-height"
                style={{
                  backgroundColor: "#4663ac", // Red background
                  color: "#fff",
                  // height: "100%",
                  minHeight: "111px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease", // Smooth opacity transition
                }}
              >
                <FaGasPump size={40} />
                <h5 className="m-0 mt-2">Stock Details</h5>
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* {/ Stock, Shrinkage, and Stock Details /} */}
      <Row className="my-2"></Row>

      {/* {/ Fourth Row with Cards /} */}
      <Row Row className="my-2">
        {priceLogsPermission && (
          <>
            <Col sm={12} md={priceLogAndGraphPermission ? 8 : 12}>
              <Card
                className="h-100"
                style={{ transition: "opacity 0.3s ease" }}
              >
                <Card.Header className="p-4">
                  <div className="spacebetween" style={{ width: "100%" }}>
                    <h4 className="card-title">Fuel Price Logs</h4>
                    <span>
                      {" "}
                      <Link to="/fuel-selling-price-logs/">View All</Link>
                    </span>
                  </div>
                </Card.Header>
                <Card.Body
                  style={{
                    maxHeight: "250px",
                    overflowX: "auto",
                    overflowY: "auto",
                  }}
                >
                  <PriceLogTable priceLogs={PriceLogsData} />
                </Card.Body>
              </Card>
            </Col>
          </>
        )}

        {priceGraphPermission && (
          <>
            <Col sm={12} md={priceLogAndGraphPermission ? 4 : 12}>
              <Card
                className="h-100"
                style={{ transition: "opacity 0.3s ease" }}
              >
                <Card.Header className="p-4">
                  <div className="spacebetween" style={{ width: "100%" }}>
                    <h4 className="card-title">Price Graph</h4>
                    <span>View All</span>
                  </div>
                </Card.Header>
                <Card.Body>
                  <img
                    src={require("../../assets/images/commonimages/dotGraph.png")}
                    alt="dotGraph"
                    className="dotGraph"
                  />
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default CeoDashBoardBottomPage;
