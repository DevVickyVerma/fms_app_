import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { BsDroplet } from "react-icons/bs";
import { GiProfit } from "react-icons/gi";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import {
  AiOutlineBarChart,
  AiOutlineEuroCircle,
  AiOutlinePauseCircle,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import { Image } from "@mui/icons-material";
import { BiLogoCodepen } from "react-icons/bi";
import { Line } from "react-chartjs-2";
import CustomModal from "../../../data/Modal/DashboardSiteDetails";
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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DashTopSubHeading = ({
  getSiteStats,
  setGetSiteStats,
  getSiteDetails,
  setGetSiteDetails,
}) => {
  const [isGradsOpen, setIsGradsOpen] = useState(true);
  const [gridIndex, setGridIndex] = useState(0);

  // console.log("my site details data", getSiteDetails);
  const dateStr = getSiteDetails?.last_fuel_delivery_stats?.last_day
    ? getSiteDetails.last_fuel_delivery_stats.last_day
    : "";
  const day = moment(dateStr).format("Do");

  // console.log(day, "day");

  const currentDate = moment(
    getSiteDetails?.last_fuel_delivery_stats?.last_day
  );

  // single site Stacked Line Bar chart
  const stackedLineBarDataForSite =
    getSiteDetails?.performance_reporting?.datasets;
  const stackedLineBarLabelsForSite =
    getSiteDetails?.performance_reporting?.labels;

  // console.log(
  //   "StackedLineBarChart, stackedLineBarLabels, stackedLineBarData",
  //   stackedLineBarDataForSite,
  //   stackedLineBarLabelsForSite
  // );

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

  console.log("formattedMonthForHeading", formattedMonthForHeading);

  useEffect(() => {
    const LastDayEndTimeString = getSiteDetails?.last_day_end;
    const closingTimeString = getSiteDetails?.fuel_site_timings?.closing_time;
    const startingTimeString = getSiteDetails?.fuel_site_timings?.opening_time;

    // console.log(DeductedformattedDay, "DeductedformattedDay");

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
        closingTimeString,
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
  // console.log(formattedDayForOpening, "finalOpeningTime");

  const handleGradsClick = (index) => {
    // setIsGradsOpen(!isGradsOpen);
    setGridIndex(index);
  };

  const dashboardLineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Looping tension",
        data: [65, 59, 80, 81, 26, 55, 40],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const config = {
    type: "line",
    data: dashboardLineChartData,
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
      scales: {
        y: {
          // defining min and max so hiding the dataset does not change scale range
          min: 0,
          max: 100,
        },
      },
    },
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDate, setSelectedItemDate] = useState();
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

  return (
    <>
      <CustomModal
        open={modalOpen}
        onClose={handleModalClose}
        siteName={getSiteDetails?.site_name}
      />
      <div style={{ marginBottom: "20px" }}>
        {/* top border section in sub child component */}

        {/* build code for future */}
        <Box
          display={"flex"}
          gap={"5px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          // width={"100%"}
          // height={"60px"}
          flexWrap={"wrap"}
          bgcolor={"#ffffff"}
          color={"black"}
          mb={"38px"}
          py={"20px"}
          px={"20px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
          position="sticky"
          // top={"114px"} // Adjust the value as needed
          top={0}
          zIndex={1} // Ensure the sticky container overlays other content
          // className="sticky stickyClass "
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
          <Box display={"flex"} gap={"20px"}>
            <Box
              //  bgcolor={"red"}
              display={"flex"}
              flexDirection={"column"}
              bgcolor={"#ecf0f1"}
              // gap={"5px"}
              // borderRadius={"8px"}
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
                  // height={"27px"}
                  // width={"90%"}

                  // position={"absolute"}
                  // borderRadius={"8px"}
                  // bottom={0}
                  fontSize={"14px"}
                >
                  {/* 20 Aug, 17:25 */}
                  {/* {formattedDay} {formattedMonths} {formattedClosingTime} */}
                  Last Day End : {formattedMonthForHeading}
                  {/* {getSiteDetails?.last_day_end} */}
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

                {/* {localStorage.getItem("SiteDetailsModalShow") === "false"
                  ? ""
                  : ""} */}
                {/* {localStorage.getItem("SiteDetailsModalShow") === "true" ? (
                  <h1 onClick={handleModalOpen} style={{ cursor: "pointer" }}>
                    <BsCalendarWeek />
                  </h1>
                ) : (
                  ""
                )} */}
              </Box>

              <Box
                display={"flex"}
                // gap={"10px"}
              >
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
                    // sx={{
                    //   transition: "background-color 0.3s, color 0.3s", // Add smooth transition
                    //   ":hover": {
                    //     // color: "#2d3436", // Dark gray for better contrast
                    //     backgroundColor: "#27ae60", // Darker red shade
                    //     color: "#ffffff", // White for better contrast
                    //     cursor: "pointer",
                    //   },
                    // }}
                    fontSize={"14px"}
                  >
                    {" "}
                    Opening Time
                    {/* {formattedMonths} */}
                    <Typography
                      height={"27px"}
                      width={"100%"}
                      // bgcolor={"#ecf0f1"}
                      bgcolor={"rgb(25 122 66)"}
                      position={"absolute"}
                      // borderRadius={"8px"}
                      bottom={0}
                      // mx={"6px"}
                      // color={"#2d3436"}
                      color={"#dfe6e9"}
                      textAlign={"center"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"14px"}
                    >
                      {/* 20 Aug, 17:25 */}
                      {/* {formattedDay} {formattedMonths} {formattedStartingTime} */}
                      {formattedDayForOpening}
                    </Typography>
                  </Typography>
                </Box>
                {/* Calendar Date With Updated Closing Time */}
                <Box>
                  <Typography
                    height={"48px"}
                    width={"140px"}
                    // borderRadius={"10px"}
                    position={"relative"}
                    bgcolor={"#d63031"}
                    textAlign={"center"}
                    py={"2px"}
                    color={"#dfe6e9"}
                    fontSize={"14px"}
                    // sx={{
                    //   transition: "background-color 0.3s, color 0.3s", // Add smooth transition
                    //   ":hover": {
                    //     // color: "#2d3436", // Dark gray for better contrast
                    //     backgroundColor: "#e6191a", // Darker red shade
                    //     color: "#ffffff", // White for better contrast
                    //     cursor: "pointer",
                    //   },
                    // }}
                  >
                    {" "}
                    Closing Time
                    {/* {formattedMonths} */}
                    <Typography
                      height={"27px"}
                      width={"100%"}
                      // bgcolor={"#ecf0f1"}
                      bgcolor={"#d63031"}
                      position={"absolute"}
                      // borderRadius={"8px"}
                      bottom={0}
                      // mx={"6px"}
                      // color={"#2d3436"}
                      color={"#dfe6e9"}
                      textAlign={"center"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"14px"}
                    >
                      {/* 20 Aug, 17:25 */}
                      {/* {formattedDay} {formattedMonths} {formattedClosingTime} */}
                      {formattedDayForClosing}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* {localStorage.getItem("SiteDetailsModalShow") === "false"
              ? 
              {
                   <Box
                // className="btn text-white btn-sm"
                onClick={handleModalOpen}
                style={{
                  background: "rgb(25 122 66)",
                  transform: "rotate(90deg)",
                  transformOrigin: "top left",
                  display: "flex",
                  // width: "100px",
                  height: "20px",
                }}
              >
                <Typography fontSize={"12px"}>Monthly Details</Typography>
              </Box> 
                }
              : ""} */}
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
          // alignItems={"center"}
          flexDirection={"column"}
          // justifyContent="center"
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
                  transition: "background-color 0.3s, color 0.3s", // Add smooth transition
                  ":hover": {
                    // color: "#2d3436", // Dark gray for better contrast
                    backgroundColor: "#e6191a", // Darker red shade
                    color: "#ffffff", // White for better contrast
                    cursor: "pointer",
                  },
                }}
              >
                {formattedMonths}
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
          <Box
            display={"flex"}
            gap={"25px"}
            flexWrap={"wrap"}
            // justifyContent={["space-between"]}
          >
            {" "}
            {getSiteDetails?.last_fuel_delivery_stats?.data?.map(
              (LastDeliveryState, index) => (
                <Box
                  borderRadius={"5px"}
                  bgcolor={"#5444c1"}
                  px={"20px"}
                  py={"15px"}
                  color={"white"}
                  minWidth={"250px"}
                  // key={index}
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
                    <BsFillFuelPumpFill />
                    {LastDeliveryState?.fuel}
                  </Typography>
                  <Typography>{LastDeliveryState?.value} ℓ</Typography>
                </Box>
              )
            )}
          </Box>
        </Box>

        {/* Grad stats */}

        <Box
          display={"flex"}
          width={"100%"}
          bgcolor={"#ffffff"}
          color={"black"}
          my={"20px"}
          // alignItems={"center"}
          // flexDirection={"column"}
          justifyContent="space-between"
          // gap={4}
          p={"20px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
          overflow={"auto"}
        >
          <Box pr={["160px", "20px"]}>
            <Box display={"flex"} gap={"5px"}>
              <Typography variant="body1">Grades</Typography>
            </Box>
            <Box
              gap={"27px"}
              display={"flex"}
              flexDirection={"column"}
              my={"10px"}
              p={"10px"}
            >
              {getSiteDetails?.fuel_stats?.data?.map((fuelState, index) => (
                <Box
                  borderRadius={"5px"}
                  // bgcolor={"#5444c1"}
                  bgcolor={gridIndex === index ? "purple" : "#5444c1"}
                  px={"20px"}
                  py={"15px"}
                  color={"white"}
                  minWidth={"250px"}
                  onClick={() => handleGradsClick(index)}
                  // key={index}
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
                    <BsFillFuelPumpFill />
                    {/* {LastDeliveryState?.fuel} */}
                    {fuelState?.fuel}
                  </Typography>
                  {/* <Typography>{LastDeliveryState?.value} L</Typography> */}
                </Box>
              ))}
            </Box>
          </Box>
          {/* <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  gap={"45px"}
                  p={"15px"}
                  bgcolor={"#dfe6e9"}
                  alignItems={"center"}
                  minWidth={"200px"}
                  borderRadius={"5px"}
                  onClick={() => handleGradsClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    gap={"12px"}
                  >
                    <Typography
                      display={"flex"}
                      gap={"5px"}
                      alignItems={"center"}
                      mb={"5px"}
                    >
                      <BsFillFuelPumpFill size={22} />
                      {fuelState?.fuel}
                    </Typography>
                  </Box>
                </Box> */}
          {isGradsOpen && (
            <Box
              display={"flex"}
              justifyContent="space-between"
              mx={"14px"}
              width={"inherit"}
              gap={"60px"}
            >
              <Box width={"350px"}>
                <Typography variant="body1">Key Matrices</Typography>
                {/* key matrices item  */}
                <Box
                  display={"flex"}
                  gap={"27px"}
                  flexDirection={"column"}
                  my={"10px"}
                  py={"5px"}
                  minWidth={"250px"}
                >
                  <Box
                    display={"flex"}
                    // justifyContent={"space-between"}
                    gap={"45px"}
                    px={"10px"}
                    py={"10px"}
                    // border={"0.4px solid "}
                    minWidth={"200px"}
                    flexDirection={"column"}
                    // alignItems={"center"}
                    bgcolor={"#5444c1"}
                    color={"white"}
                    borderRadius={"5px"}
                  >
                    <Box display={"flex"} gap={"20px"}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Gross Margin
                      </Typography>
                      <Typography variant="body2">
                        {
                          getSiteDetails?.fuel_stats?.data[gridIndex]
                            ?.gross_margin
                        }{" "}
                        ppl
                      </Typography>
                    </Box>
                    <Box display={"flex"} gap={"20px"}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Gross Profit
                      </Typography>
                      <Typography variant="body2">
                        ℓ
                        {
                          getSiteDetails?.fuel_stats?.data[gridIndex]
                            ?.gross_profit
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box width={"350px"}>
                <Typography variant="body1">Fuel Volume</Typography>

                <Box
                  display={"flex"}
                  gap={"27px"}
                  flexDirection={"column"}
                  my={"10px"}
                  py={"5px"}
                  minWidth={"250px"}
                >
                  <Box
                    display={"flex"}
                    // justifyContent={"space-between"}
                    gap={"45px"}
                    px={"10px"}
                    py={"10px"}
                    // border={"0.4px solid "}
                    minWidth={"200px"}
                    // flexDirection={"column"}
                    alignItems={"center"}
                    bgcolor={"#5444c1"}
                    color={"white"}
                    borderRadius={"5px"}
                  >
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Fuel Volume
                    </Typography>
                    {/* <Box> */}
                    {/* <Typography variant="body2">Fuel Volume</Typography> */}
                    <Typography variant="body2">
                      {getSiteDetails?.fuel_stats?.data[gridIndex]?.fuel_volume}
                    </Typography>
                    {/* </Box> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Wet stock analysis */}
        <Box
          display={"flex"}
          width={"100%"}
          bgcolor={"#ffffff"}
          color={"black"}
          my={"20px"}
          // alignItems={"center"}
          flexDirection={"column"}
          justifyContent="space-between"
          gap={4}
          p={"20px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
        >
          <Typography>WetStock Analysis</Typography>
          <Box
            display={"flex"}
            gap={"23px"}
            flexWrap={"wrap"}
            // justifyContent={["space-around"]}
          >
            {getSiteDetails?.last_end_dip_stats?.data?.map(
              (endDipState, index) => (
                <>
                  <Box
                    borderRadius={"5px"}
                    bgcolor={"#5444c1"}
                    px={"20px"}
                    py={"15px"}
                    color={"white"}
                    minWidth={"250px"}
                    // key={index}
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
                      <BsFillFuelPumpFill />
                      {endDipState?.fuel}
                    </Typography>
                    <Typography>{endDipState?.value} ℓ</Typography>
                  </Box>
                </>
              )
            )}
          </Box>
        </Box>

        {/* Line Chart */}
        {/* <Box
          // mt={"120px"}
          display={"flex"}
          width={"100%"}
          bgcolor={"#ffffff"}
          color={"black"}
          my={["20px", "40px"]}
          // alignItems={"center"}
          flexDirection={"column"}
          justifyContent="space-between"
          gap={10}
          p={"20px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
        >
          <Line
            data={dashboardLineChartData}
            // options={{
            //   animations: {
            //     tension: {
            //       duration: 1000,
            //       easing: "linear",
            //       from: 1,
            //       to: 0,
            //       loop: true,
            //     },
            //   },
            //   scales: {
            //     y: {
            //       // defining min and max so hiding the dataset does not change scale range
            //       min: 0,
            //       max: 100,
            //     },
            //   },
            // }}
            options={dashboardLineChartData}
          ></Line>
        </Box> */}
      </div>

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
                {/* <DashboardSiteBarChart /> */}
                {/* <StackedBarChart /> */}
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
    </>
  );
};

export default DashTopSubHeading;
