import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
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

  return (
    <div>
      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3" className="gap-3 d-flex flex-wrap">
                {getSiteStats?.data?.dates?.map((tankDate, index) => (
                  <>
                    <Box
                      borderRadius={"5px"}
                      bgcolor={
                        selectedDateIndex === index ? "purple" : "#5444c1"
                      }
                      px={"20px"}
                      py={"15px"}
                      color={"white"}
                      // minWidth={"150px"}
                      onClick={() => handleDateButtonClick(index)}
                      key={index}
                      sx={{
                        ":hover": {
                          backgroundColor: "purple", // Change background color on hover
                          cursor: "pointer", // Change cursor to pointer on hover
                        },
                      }}
                    >
                      <Typography
                        display={"flex"}
                        gap={"5px"}
                        alignItems={"center"}
                        mb={"5px"}
                      >
                        {tankDate}
                      </Typography>
                    </Box>
                  </>
                ))}
              </Card.Title>
            </Card.Header>

            <Card.Body>
              <Row>
                {/* {stockAlertData?.map((tankData, index) => (
                  <Col lg={3} xl={3} md={6} sm={12}>
                    <div
                      key={index}
                      className="m-4"
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        background: "white",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <div>
                        <p className="text-center">
                          <strong
                            className="mb-2  text-dark font-weight-bold"
                            style={{ fontSize: "14px", fontWeight: "bold" }}
                          >
                            {tankData?.[selectedDateIndex]?.tank_name}
                          </strong>
                        </p>
                      </div>
                      <LiquidFillGauge
                        style={{ margin: "0 auto" }}
                        width={180}
                        height={180}
                        value={
                          tankData?.[selectedDateIndex]?.fuel_left_percentage
                        }
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
                                {Number(props?.value).toFixed(2)}
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
                          tankData?.[selectedDateIndex]?.bg_color
                        )}
                        circleStyle={{
                          fill: tankData?.[selectedDateIndex]?.bg_color,
                        }}
                        waveStyle={{
                          fill: tankData?.[selectedDateIndex]?.bg_color,
                        }}
                        textStyle={{
                          fill: tankData?.[selectedDateIndex]?.font_color,
                          fontFamily: "Arial",
                        }}
                        waveTextStyle={{
                          fill: tankData?.[selectedDateIndex]?.font_color,
                          fontFamily: "Arial",
                        }}
                      />

                      <div
                        className="pt-3 mt-3"
                        style={{
                          lineHeight: 1,
                        }}
                      >
                        <p>
                          <strong className="mb-0 fs-8 text-dark">
                            <span
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              Capacity:
                            </span>
                            {tankData?.[selectedDateIndex]?.capacity}ℓ{" "}
                            <span>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>
                                    {" "}
                                    Average Sale :{" "}
                                    {
                                      tankData?.[selectedDateIndex]
                                        ?.average_sale
                                    }
                                    ℓ{" "}
                                  </Tooltip>
                                }
                              >
                                <i
                                  class="fa fa-info-circle"
                                  aria-hidden="true"
                                ></i>
                              </OverlayTrigger>
                            </span>
                          </strong>
                        </p>
                        <p>
                          <strong className="mb-0 fs-8 text-dark">
                            <span
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              Ullage:
                            </span>
                            {tankData?.[selectedDateIndex]?.ullage}ℓ |{" "}
                            {tankData?.[selectedDateIndex]?.ullage_percentage}%
                          </strong>
                        </p>
                        <p>
                          <strong className="mb-0 fs-8 text-dark">
                            <span
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              Fuel:
                            </span>
                            {tankData?.[selectedDateIndex]?.fuel_left}ℓ
                          </strong>
                          <span
                            className="mb-0 mx-2 fs-8  badge  "
                            style={{
                              backgroundColor:
                                tankData?.[selectedDateIndex]?.bg_color ||
                                "gray",
                              color:
                                tankData?.[selectedDateIndex]?.font_color ||
                                "black",

                              borderRadius: "4px",
                            }}
                          >
                            {" "}
                            {tankData?.[selectedDateIndex]?.days_left} Days
                          </span>
                        </p>
                        <p></p>
                      </div>
                    </div>
                  </Col>
                ))} */}
                {Object?.keys(stockAlertData)?.map((tankName) => (
                  <>
                    {/* <div key={tankName}>
                      <h2>Tank: {tankName}</h2>
                      <ul>
                        {stockAlertData[tankName][selectedDateIndex].font_color}
                        {stockAlertData[tankName][selectedDateIndex].fuel_left}
                      </ul>
                    </div> */}
                    <Col lg={3} xl={3} md={6} sm={12}>
                      <div
                        key={tankName}
                        className="m-4"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                          background: "white",
                          padding: "10px",
                          borderRadius: "10px",
                        }}
                      >
                        <div>
                          <p className="text-center">
                            <strong
                              className="mb-2  text-dark font-weight-bold"
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              {/* {tankName?.[selectedDateIndex]?.tank_name} */}
                              {
                                stockAlertData?.[tankName]?.[selectedDateIndex]
                                  ?.tank_name
                              }
                            </strong>
                          </p>
                        </div>
                        <LiquidFillGauge
                          style={{ margin: "0 auto" }}
                          width={180}
                          height={180}
                          value={
                            stockAlertData?.[tankName]?.[selectedDateIndex]
                              ?.fuel_left_percentage
                          }
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
                                  {Number(props?.value).toFixed(2)}
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
                            stockAlertData?.[tankName]?.[selectedDateIndex]
                              ?.bg_color
                          )}
                          circleStyle={{
                            fill: stockAlertData?.[tankName]?.[
                              selectedDateIndex
                            ]?.bg_color,
                          }}
                          waveStyle={{
                            fill: stockAlertData?.[tankName]?.bg_color,
                          }}
                          textStyle={{
                            fill: stockAlertData?.[tankName]?.[
                              selectedDateIndex
                            ]?.font_color,
                            fontFamily: "Arial",
                          }}
                          waveTextStyle={{
                            fill: stockAlertData?.[tankName]?.[
                              selectedDateIndex
                            ]?.font_color,
                            fontFamily: "Arial",
                          }}
                        />

                        <div
                          className="pt-3 mt-3"
                          style={{
                            lineHeight: 1,
                          }}
                        >
                          <p>
                            <strong className="mb-0 fs-8 text-dark">
                              <span
                                style={{ fontSize: "14px", fontWeight: "bold" }}
                              >
                                Capacity:
                              </span>
                              {
                                stockAlertData?.[tankName]?.[selectedDateIndex]
                                  ?.capacity
                              }
                              ℓ{" "}
                              <span>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>
                                      {" "}
                                      Average Sale :{" "}
                                      {
                                        stockAlertData?.[tankName]?.[
                                          selectedDateIndex
                                        ]?.average_sale
                                      }
                                      ℓ{" "}
                                    </Tooltip>
                                  }
                                >
                                  <i
                                    class="fa fa-info-circle"
                                    aria-hidden="true"
                                  ></i>
                                </OverlayTrigger>
                              </span>
                            </strong>
                          </p>
                          <p>
                            <strong className="mb-0 fs-8 text-dark">
                              <span
                                style={{ fontSize: "14px", fontWeight: "bold" }}
                              >
                                Ullage:
                              </span>
                              {
                                stockAlertData?.[tankName]?.[selectedDateIndex]
                                  ?.ullage
                              }
                              {/* {Number(
                                stockAlertData?.[tankName]?.[selectedDateIndex]
                                  ?.ullage
                              ).toFixed(2)} */}
                              ℓ |{" "}
                              {
                                stockAlertData?.[tankName]?.[selectedDateIndex]
                                  ?.ullage_percentage
                              }
                              %
                            </strong>
                          </p>
                          <p>
                            <strong className="mb-0 fs-8 text-dark">
                              <span
                                style={{ fontSize: "14px", fontWeight: "bold" }}
                              >
                                Fuel:
                              </span>
                              {
                                stockAlertData?.[tankName]?.[selectedDateIndex]
                                  ?.fuel_left
                              }
                              ℓ
                            </strong>
                            <span
                              className="mb-0 mx-2 fs-8  badge  "
                              style={{
                                backgroundColor:
                                  stockAlertData?.[tankName]?.[
                                    selectedDateIndex
                                  ]?.bg_color || "gray",
                                color:
                                  stockAlertData?.[tankName]?.[
                                    selectedDateIndex
                                  ]?.font_color || "black",

                                borderRadius: "4px",
                              }}
                            >
                              {" "}
                              {
                                stockAlertData?.[tankName]?.[selectedDateIndex]
                                  ?.days_left
                              }{" "}
                              Days
                            </span>
                          </p>
                          <p></p>
                        </div>
                      </div>
                    </Col>
                  </>
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
