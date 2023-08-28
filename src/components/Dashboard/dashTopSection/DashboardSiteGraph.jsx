// import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import LiquidFillGauge from "react-liquid-gauge";

const DashboardSiteGraph = ({ getSiteStats, setGetSiteStats }) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const stockAlertData =
    getSiteStats && getSiteStats?.data?.stock_alert
      ? getSiteStats?.data?.stock_alert
      : [];

  console.log("my alert data", stockAlertData);

  const generateGradientStops = (color) => [
    {
      key: "0%",
      stopColor: color,
      stopOpacity: 1,
      offset: "0%",
    },
    {
      key: "50%",
      stopColor: color,
      stopOpacity: 0.75,
      offset: "50%",
    },
    {
      key: "100%",
      stopColor: color,
      stopOpacity: 0.5,
      offset: "100%",
    },
  ];

  const handleDateButtonClick = (dateIndex) => {
    setSelectedDateIndex(dateIndex);
  };

  // const selectedDateData = stockAlertData[selectedDateIndex];
  // const selectedDateData = stockAlertData[selectedDateIndex];

  return (
    <div>
      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3" className="gap-3 d-flex flex-wrap">
                {stockAlertData?.[0]?.map((tankDate, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={selectedDateIndex === index ? "purple" : "primary"}
                    onClick={() => handleDateButtonClick(index)}
                    className={`rounded-pill ${
                      selectedDateIndex === index
                        ? "text-black fs-6"
                        : "text-dark"
                    } text-bold`}
                    // disabled={selectedDateIndex === index}
                  >
                    {tankDate.date}
                  </Button>
                ))}
              </Card.Title>
            </Card.Header>

            <Card.Body>
              <Row>
                {stockAlertData?.map((tankData, index) => (
                  <Col lg={4} xl={4} md={6} sm={12}>
                    <div key={index} className="m-4">
                      <LiquidFillGauge
                        style={{ margin: "0 auto" }}
                        width={200} // Adjust the width and height as needed
                        height={200}
                        value={
                          tankData?.[selectedDateIndex]?.fuel_left_percentage
                        } // Use the relevant data point here
                        percent="%"
                        textSize={1}
                        textOffsetX={0}
                        textOffsetY={0}
                        textRenderer={(props) => (
                          <>
                            <tspan
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <tspan>
                                <tspan>{props?.value}</tspan>
                                <tspan>{props?.percent}</tspan>
                              </tspan>
                            </tspan>
                          </>
                        )}
                        riseAnimation
                        waveAnimation
                        waveFrequency={2}
                        waveAmplitude={1}
                        gradient
                        gradientStops={generateGradientStops(
                          tankData?.capacity_bg_color
                        )} // Use the relevant color property
                        circleStyle={{
                          fill: tankData?.[selectedDateIndex]
                            ?.fuel_left_bg_color,
                        }}
                        waveStyle={{
                          fill: tankData?.[selectedDateIndex]
                            ?.capacity_bg_color, // Use the relevant color property
                        }}
                        textStyle={{
                          fill: tankData?.[selectedDateIndex]
                            ?.fuel_left_bg_color, // Use the relevant color property
                          fontFamily: "Arial",
                        }}
                        waveTextStyle={{
                          fill: tankData?.[selectedDateIndex]
                            ?.fuel_left_bg_color, // Use the relevant color property
                          fontFamily: "Arial",
                        }}
                        // onClick={() => {
                        //   // Handle click event if needed
                        // }}
                      />
                      {/* Render other information as needed */}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSiteGraph;
