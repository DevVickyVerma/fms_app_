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

const CeoDashBoardBottomPage = () => {
  const [showCeoMopModal, setShowCeoMopModal] = useState(false);

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
            <Col
              md={9}
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
            <Col
              md={3}
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
                />{" "}{" "}    Margins
              </h3>
            </Col>
          </Row>
        </Col>
      </>

      {/* {/ Second Row /} */}
      <Row Row className="my-2">
        <Col lg={6}>
          <Row>
            <Col
              md={6}
              onClick={() => handleCardClick("MOP Breakdown")}
              className="slide-in-left mb-4"
            >
              <div
                className="ceocard-hover"
                style={{
                  backgroundColor: "#4663ac", // Red background
                  color: "#fff",
                  height: "120px",
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
              </div>
            </Col>

            <Col
              md={6}
              onClick={() => handleCardClick("Comparison")}
              className="slide-in-left mb-4"
            >
              <div
                className="ceocard-hover"
                style={{
                  backgroundColor: "#6764b3", // Dark Blue background
                  color: "#fff",
                  height: "120px",
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
              </div>
            </Col>

            <Col
              md={6}
              onClick={() => handleCardClick("Performance")}
              className="slide-in-right"
            >
              <div
                className="ceocard-hover"
                style={{
                  backgroundColor: "#8563b6", // Light Blue background
                  color: "#fff",
                  height: "120px",
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
              </div>
            </Col>
            <Col
              md={6}
              onClick={() => handleCardClick("Reports")}
              className="slide-in-right"
            >
              <div
                className="ceocard-hover"
                style={{
                  backgroundColor: "#7e95e4", // Yellow background
                  color: "#fff",
                  height: "120px",
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
              </div>
            </Col>
          </Row>
        </Col>

        <Col
          md={2}
          onClick={() => handleCardClick("Stock")}
          className="slide-in-bottom"
        >
          <Card
            className="ceocard-hover pie-card-default-height"
            style={{
              backgroundColor: "#8563b6", // Light Blue background
              color: "#fff",
              height: "100%",
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
          md={2}
          onClick={() => handleCardClick("Shrinkage")}
          className="slide-in-bottom"
        >
          <div
            className="ceocard-hover pie-card-default-height"
            style={{
              backgroundColor: "#7e95e4", // Dark Blue background
              color: "#fff",
              height: "100%",
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
          </div>
        </Col>
        <Col
          md={2}
          onClick={() => handleCardClick("Stock Details")}
          className="slide-in-bottom"
        >
          <div
            className="ceocard-hover pie-card-default-height"
            style={{
              backgroundColor: "#4663ac", // Red background
              color: "#fff",
              height: "100%",
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
          </div>
        </Col>
      </Row>

      {/* {/ Stock, Shrinkage, and Stock Details /} */}
      <Row className="my-2"></Row>

      {/* {/ Fourth Row with Cards /} */}
      <Row Row className="my-2">
        <Col sm={12} md={8} onClick={() => handleCardClick("Fuel Price Logs")}>
          <Card className="h-100" style={{ transition: "opacity 0.3s ease" }}>
            <Card.Header className="p-4">
              <div className="spacebetween" style={{ width: "100%" }}>
                <h4 className="card-title">Fuel Price Logs</h4>
                <span> <Link to="/fuel-selling-price-logs/">View All</Link></span>
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
        <Col sm={12} md={4} onClick={() => handleCardClick("Price Graph")}>
          <Card className="h-100" style={{ transition: "opacity 0.3s ease" }}>
            <Card.Header className="p-4">
              <div className="spacebetween" style={{ width: "100%" }}>
                <h4 className="card-title">Price Graph</h4>
                <span>View All</span>
              </div>
            </Card.Header>
            <Card.Body
              style={{
                maxHeight: "250px",
                overflowX: "auto",
                overflowY: "auto",
              }}
            >
              {/* {/ <PriceLogTable priceLogs={PriceLogs?.priceLogs} /> /} */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CeoDashBoardBottomPage;
