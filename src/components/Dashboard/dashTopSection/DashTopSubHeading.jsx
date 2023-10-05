import { Typography } from "@mui/material";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import CustomModal from "../../../data/Modal/DashboardSiteDetails";
import DashboardGradsComponent from "./DashboardGradsComponent";
import { BsCalendarWeek } from "react-icons/bs";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { BsFillFuelPumpFill } from "react-icons/bs";
import moment from "moment/moment";
import DashboardSiteGraph from "./DashboardSiteGraph";
import DashboardSiteTopSection from "./DashboardSiteTopSection";
import StackedLineBarChart from "../StackedLineBarChart";
import DashboardCompetitorGraph from "./DashboardCompetitorGraph";
import DashboardShopSale from "./DashboardShopSale";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DashTopSubHeading = ({
  getSiteStats,
  setGetSiteStats,
  getSiteDetails,
  setGetSiteDetails,
  getCompetitorsPrice,
  setGetCompetitorsPrice,
  getGradsSiteDetails,
  setGradsGetSiteDetails,
}) => {


  const dateStr = getSiteDetails?.last_fuel_delivery_stats?.last_day
    ? getSiteDetails.last_fuel_delivery_stats.last_day
    : "";

  const day = moment(dateStr).format("Do");
  const MonthLastDelivery = moment(dateStr).format("MMM");

  // single site Stacked Line Bar chart
  const stackedLineBarDataForSite =
    getSiteDetails?.performance_reporting?.datasets;
  const stackedLineBarLabelsForSite =
    getSiteDetails?.performance_reporting?.labels;


  const [formattedDayForOpening, setFormattedDayForOpening] = useState("");
  const [formattedDayForClosing, setFormattedDayForClosing] = useState("");
  const [formattedMonthForHeading, setFormattedMonthForHeading] = useState("");


  useEffect(() => {
    const LastDayEndTimeString = getSiteDetails?.last_day_end;
    const closingTimeString = getSiteDetails?.fuel_site_timings?.closing_time;
    const startingTimeString = getSiteDetails?.fuel_site_timings?.opening_time;

    if (getSiteDetails) {
      const parshedFinalOpeningTime = moment(
        startingTimeString,
        "YYYY-MM-DD HH:mm"
      );
      const parshedFinalClosingTime = moment(
        closingTimeString,
        "YYYY-MM-DD HH:mm"
      );
      const parshedLastDayEndTimeString = moment(
        LastDayEndTimeString,
        "YYYY-MM-DD HH:mm"
      );

      const formattedCLosingTimeForSite =
        parshedFinalClosingTime.format("Do MMM HH:mm");

      const formattedOpeningTimeForSite =
        parshedFinalOpeningTime.format("Do MMM HH:mm");

      const formattedMonthForHeading =
        parshedLastDayEndTimeString.format("Do MMM ");

      setFormattedDayForClosing(formattedCLosingTimeForSite);
      setFormattedDayForOpening(formattedOpeningTimeForSite);
      setFormattedMonthForHeading(formattedMonthForHeading);
    } else {

    }
  }, [getSiteDetails]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = (item) => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const colors = [
    { name: "About to Finish", color: "#e84118" },
    { name: "Low Fuel", color: "#ffa801" },
    { name: "Enough Fuel", color: "#009432" },
  ];

  const alertStatus = getSiteStats?.data?.cash_tracker?.alert_status;

  return (
    <>
      {modalOpen ? (
        <CustomModal
          open={modalOpen}
          onClose={handleModalClose}
          siteName={getSiteDetails?.site_name}
        />
      ) : (
        ""
      )}

      <div style={{ marginBottom: "20px" }}>
        {alertStatus === true ? (
          <>
            <div
              style={{
                textAlign: "left",
                margin: " 13px 0",
                fontSize: "15px",
                color: "white",
                background: "#b52d2d",
                padding: "10px",
                borderRadius: "7px",
                display: "flex",
              }}
            >
              {getSiteStats?.data?.cash_tracker?.message}{" "}
              {getSiteStats?.data?.cash_tracker?.cash_amount}{" "}
              <span style={{ display: "flex", marginLeft: "6px" }}>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                      }}
                    >
                      {" "}
                      Security Amount :{" "}
                      {getSiteStats?.data?.cash_tracker?.security_amount}
                      <br />
                      Loomis Day :{" "}
                      {getSiteStats?.data?.cash_tracker?.last_loomis_day}
                      <br />
                      Loomis Date :{" "}
                      {getSiteStats?.data?.cash_tracker?.last_loomis_date}
                      <br />
                    </Tooltip>
                  }
                >
                  <i
                    class="fa fa-info-circle"
                    aria-hidden="true"
                    style={{ fontSize: "20px" }}
                  ></i>
                </OverlayTrigger>
              </span>
            </div>
          </>
        ) : (
          ""
        )}

        {/* Header section*/}

        <>
          <Box
            display={"flex"}
            gap={"5px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexWrap={"wrap"}
            bgcolor={"#ffffff"}
            color={"black"}
            mb={"38px"}
            py={"20px"}
            px={"20px"}
            boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"

          // position={["unset", "sticky"]}
          // top={0}
          // zIndex={1} // Ensure the sticky container overlays other content
          >
            {/* LEFT side heading title */}

            <Box display={"flex"} alignItems={"center"}>
              <box>
                {" "}
                {getSiteStats?.data?.site_image ? (
                  <img
                    src={getSiteStats?.data?.site_image}
                    alt={getSiteStats?.data?.site_image}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  <Skeleton style={{
                    border: '1px solid #ccc',
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center",
                    lineHeight: 2,
                    padding: '1rem',
                    // marginBottom: '0.5rem',
                    width: '100',
                    boxShadow: "0px 10px 10px -5px rgba(0,0,0,0.5)",
                  }}
                  />
                )}
              </box>
              <Box>
                <Typography
                  fontSize={"19px"}
                  fontWeight={500}
                  ml={"7px"}
                  variant="body1"
                >
                  {getSiteStats?.data?.site_name ? getSiteStats?.data?.site_name : ""}
                </Typography>
              </Box>
            </Box>

            {/* RIGHT side heading title */}
            <Box gap={"20px"} display={["contents", "flex"]}>
              {/*   Cash  tracker Card*/}


              <Box display={"flex"} flexDirection={"column"} bgcolor={"#ecf0f1"}>
                <Box
                  my={"4px"}
                  color={"#2d3436"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px={"13px"}
                >
                  <Typography fontSize={"14px"}>
                    Cash Tracker
                  </Typography>
                  <Typography
                    onClick={handleModalOpen}
                    style={{ cursor: "pointer" }}
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                          }}
                        >
                          {" "}
                          Security Amount :{" "}
                          {getSiteStats?.data?.cash_tracker?.security_amount}
                          <br />
                          Loomis Day :{" "}
                          {getSiteStats?.data?.cash_tracker?.last_loomis_day}
                          <br />
                          Loomis Date :{" "}
                          {getSiteStats?.data?.cash_tracker?.last_loomis_date}
                          <br />
                        </Tooltip>
                      }
                    >
                      <i
                        class="fa fa-info-circle"
                        aria-hidden="true"
                        style={{ fontSize: "20px" }}
                      ></i>
                    </OverlayTrigger>
                  </Typography>
                </Box>

                <Box display={"flex"}>
                  <Box>
                    <Typography
                      height={"48px"}
                      width={"140px"}
                      position={"relative"}
                      bgcolor={"rgb(25 122 66)"}
                      textAlign={"center"}
                      py={"2px"}
                      color={"#dfe6e9"}
                      fontSize={"14px"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      {" "}
                      {getSiteStats?.data?.cash_tracker?.cash_amount}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Skeleton style={{
                // border: '1px solid #ccc',
                display: 'flex',
                justifyContent: "center",
                alignItems: "center",
                lineHeight: 1,
                padding: '10px',
                // marginBottom: '0.5rem',
                minWidth: '200px',
                maxHeight: "5px",
                boxShadow: "0px 10px 10px -5px rgba(0,0,0,0.5)",
              }}
                count={2}
              />

              {/* last day end competitor */}
              <Box display={"flex"} flexDirection={"column"} bgcolor={"#ecf0f1"}>
                <Box
                  my={"4px"}
                  color={"#2d3436"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px={"13px"}
                >
                  <Typography fontSize={"14px"}>
                    Last Day End : { }
                    {/* {formattedMonthForHeading} */}

                    {
                      getSiteStats?.data?.last_dayend ? moment(getSiteStats?.data?.last_dayend).format("Do MMM") : ""
                    }

                    {/* {getSiteStats?.data?.last_dayend} */}
                  </Typography>
                  {localStorage.getItem("SiteDetailsModalShow") === "true" ? (
                    <Typography
                      onClick={handleModalOpen}
                      style={{ cursor: "pointer" }}
                    >
                      <BsCalendarWeek />
                    </Typography>
                  ) : (
                    ""
                  )}
                </Box>

                <Box display={"flex"}>
                  {/* Calendar Date With Updated OPening Time*/}
                  <Box>
                    <Typography
                      height={"48px"}
                      width={"140px"}
                      position={"relative"}
                      bgcolor={"rgb(25 122 66)"}
                      textAlign={"center"}
                      py={"2px"}
                      color={"#dfe6e9"}
                      fontSize={"14px"}
                    >
                      {" "}
                      Opening Time
                      <Typography
                        height={"27px"}
                        width={"100%"}
                        bgcolor={"rgb(25 122 66)"}
                        position={"absolute"}
                        bottom={0}
                        color={"#dfe6e9"}
                        textAlign={"center"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        {/* {formattedDayForOpening} */}
                        {
                          getSiteStats?.data?.opening ? moment(getSiteStats?.data?.opening).format("Do MMM, HH:mm") : ""
                        }
                      </Typography>
                    </Typography>
                  </Box>
                  {/* Calendar Date With Updated Closing Time */}
                  <Box>
                    <Typography
                      height={"48px"}
                      width={"140px"}
                      position={"relative"}
                      bgcolor={"#b52d2d"}
                      textAlign={"center"}
                      py={"2px"}
                      color={"#dfe6e9"}
                      fontSize={"14px"}
                    >
                      {" "}
                      Closing Time
                      <Typography
                        height={"27px"}
                        width={"100%"}
                        bgcolor={"#b52d2d"}
                        position={"absolute"}
                        bottom={0}
                        color={"#dfe6e9"}
                        textAlign={"center"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        fontSize={"14px"}
                      >
                        {/* {formattedDayForClosing} */}
                        {
                          getSiteStats?.data?.closing ? moment(getSiteStats?.data?.closing).format("Do MMM, HH:mm") : ""
                        }
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

        </>







        {/* dashboard site Top section */}
        <DashboardSiteTopSection />

        {/* grid values */}
        <Box
          display={"flex"}
          width={"100%"}
          bgcolor={"#ffffff"}
          color={"black"}
          my={"20px"}
          flexDirection={"column"}
          gap={4}
          p={"25px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
        >
          <Box>
            <Box display={"flex"} gap={"12px"}>
              <Typography
                height={"60px"}
                width={"60px"}
                borderRadius={"10px"}
                position={"relative"}
                bgcolor={"#d63031"}
                textAlign={"center"}
                py={"2px"}
                color={"#dfe6e9"}
                sx={{
                  transition: "background-color 0.3s, color 0.3s",
                  ":hover": {
                    backgroundColor: "#e6191a",
                    color: "#ffffff",
                    cursor: "pointer",
                  },
                }}
              >
                <strong style={{ fontWeight: 700 }}>
                  {" "}
                  {moment(MonthLastDelivery, "MMM").isValid()
                    ? MonthLastDelivery
                    : ""}
                </strong>
                <Typography
                  height={"27px"}
                  width={"77%"}
                  bgcolor={"#ecf0f1"}
                  position={"absolute"}
                  borderRadius={"8px"}
                  bottom={0}
                  m={"6px"}
                  color={"#2d3436"}
                  textAlign={"center"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {moment(day, "DD").isValid() ? day : ""}
                </Typography>
              </Typography>
              <Box variant="body1">
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Last Delivery on
                </Typography>
                <Typography variant="body1" fontSize={"18px"} fontWeight={500}>
                  {getSiteDetails?.last_fuel_delivery_stats?.last_day
                    ? getSiteDetails?.last_fuel_delivery_stats?.last_day
                    : ""}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box display={"flex"} gap={"25px"} flexWrap={"wrap"}>
            {" "}
            {getSiteDetails?.last_fuel_delivery_stats?.data?.map(
              (LastDeliveryState, index) => (
                <Box
                  borderRadius={"5px"}
                  bgcolor={"#f2f2f8"}
                  px={"20px"}
                  py={"15px"}
                  color={"black"}
                  minWidth={"250px"}
                >
                  <Typography
                    display={"flex"}
                    gap={"5px"}
                    alignItems={"center"}
                    mb={"5px"}
                  >
                    <BsFillFuelPumpFill />
                    {LastDeliveryState?.fuel}
                  </Typography>
                  <strong style={{ fontWeight: 700 }}>
                    {LastDeliveryState?.value}
                  </strong>
                </Box>
              )
            )}
          </Box>
        </Box>

        {/* Grads Section */}
        <DashboardGradsComponent
          getGradsSiteDetails={getGradsSiteDetails}
          setGradsGetSiteDetails={setGradsGetSiteDetails}
          getSiteDetails={getSiteDetails}
        />
      </div>

      {/* new Shop sale */}
      <DashboardShopSale getSiteDetails={getSiteDetails} />


      {/* tank analysis */}
      <Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <Col lg={12} md={12}>
          <Card>
            <Card.Header className="card-header">
              <div className="Tank-Details d-flex">
                <h4 className="card-title">Tank Analysis</h4>
                <div className="Tank-Details-icon">
                  <OverlayTrigger
                    placement="right"
                    className="Tank-Detailss"
                    overlay={
                      <Tooltip style={{ width: "200px" }}>
                        <div>
                          {colors.map((color, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "3px 10px",
                                color: "#fff",
                              }}
                            >
                              <div
                                style={{
                                  width: "20px", // Set the width for the color circle
                                  height: "20px",
                                  borderRadius: "50%",
                                  backgroundColor: color.color,
                                }}
                              ></div>
                              <span
                                style={{
                                  color: "#fff",
                                  marginLeft: "8px",
                                }}
                              >
                                {color.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Tooltip>
                    }
                  >
                    <img
                      alt=""
                      src={require("../../../assets/images/dashboard/dashboardTankImage.png")}
                    />
                  </OverlayTrigger>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="card-body pb-0">
              <div id="chart">
                <DashboardSiteGraph
                  getSiteStats={getSiteStats}
                  setGetSiteStats={setGetSiteStats}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>



      <Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <Col lg={12} md={12}>
          <Card>
            <Card.Header className="card-header">
              <h4 className="card-title">Performance Reporting</h4>
            </Card.Header>
            <Card.Body className="card-body pb-0">
              <div id="chart">
                <StackedLineBarChart
                  stackedLineBarData={stackedLineBarDataForSite}
                  stackedLineBarLabels={stackedLineBarLabelsForSite}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/*  */}

      {localStorage.getItem("Dashboardsitestats") === "true" ? (
        <>
          <Row
            style={{
              marginBottom: "10px",
              marginTop: "20px",
            }}
          >
            <Col lg={12} md={12}>
              <Card>
                <Card.Header className="card-header">
                  <h4 className="card-title"> Local Competitor Stats</h4>
                </Card.Header>
                <Card.Body className="card-body pb-0">
                  <div id="chart">
                    <DashboardCompetitorGraph
                      getCompetitorsPrice={getCompetitorsPrice}
                      setGetCompetitorsPrice={setGetCompetitorsPrice}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default DashTopSubHeading;
