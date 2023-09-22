import { Typography } from "@mui/material";
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
import LineChart from "../LineChart";
import BarChart from "../BarChart";
import DashboardSiteBarChart from "./DashboardSiteBarChart";
import { BsFillFuelPumpFill } from "react-icons/bs";
import moment from "moment/moment";
import DashboardSiteLineChart from "./DashboardSiteLineChart";
import StackedBarChart from "../StackedChart";
import DashboardSiteGraph from "./DashboardSiteGraph";
import DashboardSiteTopSection from "./DashboardSiteTopSection";
import Loaderimg from "../../../Utils/Loader";
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
  setGradsGetSiteDetails

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

  const [formattedClosingTime, setFormattedClosingTime] = useState();
  const [formattedStartingTime, setFormattedStartingTime] = useState();
  const [formattedDay, setFormattedDay] = useState("");
  const [formattedDayForOpening, setFormattedDayForOpening] = useState("");
  const [formattedDayForClosing, setFormattedDayForClosing] = useState("");
  const [formattedMonthForHeading, setFormattedMonthForHeading] = useState("");
  const [DeductedformattedDay, setDeductedformattedDay] = useState(
    getSiteDetails?.last_fuel_delivery_stats?.last_day
  );
  const [formattedMonths, setformattedMonth] = useState();

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
      const parsedClosingTime = moment(closingTimeString, "DD-MM-YYYY HH:mm");
      const parsedstartingTime = moment(startingTimeString, "DD-MM-YYYY HH:mm");
      const MonthDayDate = moment(startingTimeString, "DD-MM-YYYY");

      const formattedTime = parsedClosingTime.format("HH:mm");
      const formattedMonth = MonthDayDate.format("MMM");

      const formattedstartingTime = parsedstartingTime.format("HH:mm");
      const formattedDay = MonthDayDate.format("Do");

      const formattedCLosingTimeForSite =
        parshedFinalClosingTime.format("Do MMM HH:mm");

      const formattedOpeningTimeForSite =
        parshedFinalOpeningTime.format("Do MMM HH:mm");

      const formattedMonthForHeading =
        parshedLastDayEndTimeString.format("Do MMM ");

      setFormattedDayForClosing(formattedCLosingTimeForSite);
      setFormattedDayForOpening(formattedOpeningTimeForSite);
      setFormattedDay(formattedDay);
      setformattedMonth(formattedMonth);
      setFormattedClosingTime(formattedTime);
      setFormattedStartingTime(formattedstartingTime);
      setFormattedMonthForHeading(formattedMonthForHeading);
    } else {
      setFormattedClosingTime(null); // Handle case where closing time is not available
      setFormattedStartingTime(null); // Handle case where closing time is not available
    }
  }, [getSiteDetails]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleModalOpen = (item) => {
    setSelectedItem(item); // Set the selected item
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
      <CustomModal
        open={modalOpen}
        onClose={handleModalClose}
        siteName={getSiteDetails?.site_name}
      />
      <div style={{ marginBottom: "20px" }}>
        {/* top border section in sub child component */}

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
              }}
            >
              {getSiteStats?.data?.cash_tracker?.message}{" "}
              {getSiteStats?.data?.cash_tracker?.cash_amount}
            </div>
          </>
        ) : (
          ""
        )}

        {/* trial to build*/}
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
          position="sticky"
          top={0}
          zIndex={1} // Ensure the sticky container overlays other content
        >
          {/* LEFT side heading title */}
          <Box display={"flex"} alignItems={"center"}>
            <box>
              {" "}
              {getSiteDetails?.site_image ? (
                <img
                  src={getSiteDetails?.site_image}
                  alt={getSiteDetails?.site_name}
                  style={{ width: "50px", height: "50px" }}
                />
              ) : (
                getSiteDetails?.site_name
              )}
            </box>
            <Box>
              <Typography
                fontSize={"19px"}
                fontWeight={500}
                ml={"7px"}
                variant="body1"
              >
                {getSiteDetails?.site_name ? getSiteDetails?.site_name : ""}
              </Typography>
            </Box>
          </Box>
          {/* RIGHT side heading title */}
          <Box gap={"20px"} display={["contents", "flex"]}>
            {/*   Cash  tracker*/}
            <Box display={"flex"} flexDirection={"column"} bgcolor={"#ecf0f1"}>
              <Box
                my={"4px"}
                color={"#2d3436"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                px={"13px"}
              >
                <Typography
                  fontSize={"14px"}
                  textAlign={"center"}
                  margin={"auto"}
                >
                  Cash Tracker
                </Typography>
              </Box>

              <Box display={"flex"}>
                <Box>
                  <Typography
                    height={"48px"}
                    width={"140px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    display={"flex"}
                    // bgcolor={"rgb(25 122 66)"}
                    bgcolor={
                      alertStatus === true ? "#d63031" : "rgb(25 122 66)"
                    }
                    textAlign={"center"}
                    py={"2px"}
                    color={"#dfe6e9"}
                    fontSize={"14px"}
                  >
                    {" "}
                    {getSiteStats?.data?.cash_tracker?.cash_amount}
                  </Typography>
                </Box>
                {/* Calendar Date With Updated Closing Time */}
              </Box>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              bgcolor={"#ecf0f1"}
            >
              <Box
                my={"4px"}
                // borderBottom={"1px solid #2c3e50"}
                color={"#2d3436"}
                // textAlign={"center"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                px={"13px"}
              >
                <Typography
                  fontSize={"14px"}
                >
                  Last Day End : {formattedMonthForHeading}
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
                    // borderRadius={"10px"}
                    position={"relative"}
                    // bgcolor={"#2ecc71"}
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
                      {formattedDayForOpening}
                    </Typography>
                  </Typography>
                </Box>
                {/* Calendar Date With Updated Closing Time */}
                <Box>
                  <Typography
                    height={"48px"}
                    width={"140px"}
                    position={"relative"}
                    bgcolor={"#d63031"}
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
                      bgcolor={"#d63031"}
                      position={"absolute"}
                      bottom={0}
                      color={"#dfe6e9"}
                      textAlign={"center"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"14px"}
                    >
                      {formattedDayForClosing}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

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
        <DashboardGradsComponent getGradsSiteDetails={getGradsSiteDetails}
          setGradsGetSiteDetails={setGradsGetSiteDetails} getSiteDetails={getSiteDetails} />
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
