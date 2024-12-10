import React, { useState } from "react";
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

const CeoDashBoardBottomPage = () => {
  const [showCeoMopModal, setShowCeoMopModal] = useState(false);

  const handleMopModal = () => {
    setShowCeoMopModal(true);
  };
  const handleCloseSidebar = () => {
    console.log("closed called in parent ");
    setShowCeoMopModal(false);
  };

  const handleCardClick = (cardName) => {
    console.log(`Card clicked: ${cardName}`);

    if (cardName === "MOP Comparison") {
      handleMopModal();
    }
  };

  return (
    <>
      {showCeoMopModal && (
        <>
          <CeoMopModal
            title={"MOP Comparison"}
            sidebarContent={"sidebardataobject"}
            visible={showCeoMopModal}
            onClose={handleCloseSidebar}
          />
        </>
      )}

      <Row className="my-2">
        <Col
          md={9}
          style={{
            backgroundColor: "#5bc0de", // Blue background
            color: "#fff",
            height: "40px",
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaChartLine size={25} />
          <h3 style={{ fontSize: "18px" }} className="m-0 ms-2">
            Daily Wise Sales
          </h3>
        </Col>
        <Col
          md={3}
          style={{
            backgroundColor: "#f0ad4e", // Yellow background
            color: "#fff",
            height: "40px",
            fontSize: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3 style={{ fontSize: "18px" }} className="m-0">
            Live Margin
          </h3>
        </Col>
      </Row>

      {/* {/ Second Row /} */}
      <Row className="my-2">
        <Col md={3} onClick={() => handleCardClick("MOP Comparison")}>
          <div
            className="ceocard-hover"
            style={{
              backgroundColor: "#d9534f", // Red background
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
            <h5 className="m-0 mt-2">MOP Comparison</h5>
          </div>
        </Col>
        <Col md={3} onClick={() => handleCardClick("Comparison")}>
          <div
            className="ceocard-hover"
            style={{
              backgroundColor: "#0275d8", // Dark Blue background
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
        <Col md={3} onClick={() => handleCardClick("Performance")}>
          <div
            className="ceocard-hover"
            style={{
              backgroundColor: "#5bc0de", // Light Blue background
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
        <Col md={3} onClick={() => handleCardClick("Reports")}>
          <div
            className="ceocard-hover"
            style={{
              backgroundColor: "#f0ad4e", // Yellow background
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

      {/* {/ Fourth Row with Cards /} */}
      <Row className="my-2">
        <Col sm={12} md={8} onClick={() => handleCardClick("Fuel Price Logs")}>
          <Card className="h-100" style={{ transition: "opacity 0.3s ease" }}>
            <Card.Header className="p-4">
              <div className="spacebetween" style={{ width: "100%" }}>
                <h4 className="card-title">Fuel Price Logs</h4>
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

      {/* {/ Stock, Shrinkage, and Stock Details /} */}
      <Row className="my-2">
        <Col md={4} onClick={() => handleCardClick("Stock")}>
          <div
            className="ceocard-hover"
            style={{
              backgroundColor: "#5bc0de", // Light Blue background
              color: "#fff",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.3s ease", // Smooth opacity transition
            }}
          >
            <FaChartPie size={40} />
            <h5 className="m-0 mt-2">Stock</h5>
          </div>
        </Col>
        <Col md={4} onClick={() => handleCardClick("Shrinkage")}>
          <div
            className="ceocard-hover"
            style={{
              backgroundColor: "#0275d8", // Dark Blue background
              color: "#fff",
              height: "100px",
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
        <Col md={4} onClick={() => handleCardClick("Stock Details")}>
          <div
            className="ceocard-hover"
            style={{
              backgroundColor: "#d9534f", // Red background
              color: "#fff",
              height: "100px",
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
    </>
  );
};

export default CeoDashBoardBottomPage;
