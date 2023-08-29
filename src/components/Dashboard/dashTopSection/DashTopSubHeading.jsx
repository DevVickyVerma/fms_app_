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
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Card, Col, Row } from "react-bootstrap";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
import DashboardSiteBarChart from "./DashboardSiteBarChart";
import { BsFillFuelPumpFill } from "react-icons/bs";
import moment from "moment/moment";
import DashboardSiteLineChart from "./DashboardSiteLineChart";
import StackedBarChart from "../StackedChart";
import DashboardSiteGraph from "./DashboardSiteGraph";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DashTopSubHeading = ({
  getSiteStats,
  setGetSiteStats,
  getSiteDetails,
  setGetSiteDetails,
}) => {
  const [isGradsOpen, setIsGradsOpen] = useState(true);
  const [gridIndex, setGridIndex] = useState(0);
  const [LinechartValues, setLinechartValues] = useState([]);
  const [LinechartOption, setLinechartOption] = useState();

  // console.log("my site details data", getSiteDetails);

  const currentDate = moment(
    getSiteDetails?.last_fuel_delivery_stats?.last_day
  );

  // const currentDate = moment(); // Create a moment object for the current date
  const formattedDate = currentDate.format("Do"); // Format the date
  const formattedMonth = currentDate.format("MMM"); // Format the date
  const formattedFullDate = currentDate.format("Do MMM YY"); // Format the date
  // console.log("my current date", formattedDate);

  // opening Time Date format

  const openingTimeDateForSiteCheck = moment(
    getSiteDetails?.fuel_site_timings?.opening_time
  );
  const closingTimeDateForSiteCheck = moment(
    getSiteDetails?.fuel_site_timings?.closing_time
  );
  console.log("openingTimeDateForSiteCheck", openingTimeDateForSiteCheck);

  const openingTimeMonthForSite = openingTimeDateForSiteCheck.format("MMM");
  const openingTimeDateForSite = openingTimeDateForSiteCheck.format("Do");
  const openingTimeForSite = openingTimeDateForSiteCheck.format("LT");
  const closingTimeForSite = closingTimeDateForSiteCheck.format("LT");
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

  function handleAccessSingleSiteData() {
    // Retrieve the JSON string from local storage
    const rowDataString = localStorage.getItem("singleSiteData");

    if (rowDataString) {
      // Parse the JSON string to get back the original row object
      const savedRow = JSON.parse(rowDataString);

      // Now you can use the savedRow object as needed
      console.log(savedRow);
    }
  }

  const singleSiteStoredData = localStorage.getItem("singleSiteData");
  const singleSiteParsedData = JSON.parse(singleSiteStoredData);

  const singleSiteFuelSales = singleSiteParsedData
    ? singleSiteParsedData?.fuel_sales
    : null;
  const singleSiteFuelVolume = singleSiteParsedData
    ? singleSiteParsedData?.fuel_volume
    : null;
  const singleSiteGrossMargin = singleSiteParsedData
    ? singleSiteParsedData?.gross_margin
    : null;
  const singleSiteGrossProfit = singleSiteParsedData
    ? singleSiteParsedData?.gross_profit
    : null;
  const singleSiteShopMargin = singleSiteParsedData
    ? singleSiteParsedData?.shop_margin
    : null;
  const singleSiteShopSale = singleSiteParsedData
    ? singleSiteParsedData?.shop_sales
    : null;

  console.log("singlesiteshopsalesales", singleSiteShopSale);

  return (
    <>
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
          mb={"20px"}
          py={"20px"}
          px={"20px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
          position="sticky"
          // top={"114px"} // Adjust the value as needed
          top={0}
          zIndex={1} // Ensure the sticky container overlays other content
          className="sticky stickyClass "
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
                {getSiteDetails?.site_name
                  ? getSiteDetails?.site_name
                  : "Site Name"}
              </Typography>
            </Box>
          </Box>
          {/* RIGHT side heading title */}
          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            {/* Calendar Date */}
            <Box>
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
                {" "}
                {openingTimeMonthForSite}
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
                  {openingTimeDateForSite}
                </Typography>
              </Typography>
            </Box>
            {/* opening Time */}
            <Box variant="body1">
              <Typography variant="body3" sx={{ opacity: 0.5 }}>
                {/* Last Date Deducted Delivery was on */}
                Opening Time
              </Typography>
              <Typography
                variant="body1"
                fontSize={"16px"}
                fontWeight={500}
                color={"#2ecc71"}
              >
                {openingTimeForSite}
              </Typography>
            </Box>
            {/* Close Time */}
            <Box variant="body1">
              <Typography variant="body3" sx={{ opacity: 0.5 }}>
                {/* Last Date Deducted Delivery was on */}
                Closing Time
              </Typography>
              <Typography
                variant="body1"
                fontSize={"16px"}
                fontWeight={500}
                color={"#e6191a"}
              >
                {closingTimeForSite}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Single Site Details Stats */}
        <Box
          width={"100%"}
          // height={"60px"}
          flexWrap={"wrap"}
          bgcolor={"#ffffff"}
          color={"black"}
          mb={"20px"}
          display={"flex"}
          alignItems={"center"}
          justifyContent="start"
          gap={4}
          py={"10px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
        >
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            width={"100%"}
            gap={"15px"}
            justifyContent={"space-evenly"}
          >
            <Box
              flex={1}
              borderRight="1px solid #2a282863"
              height={"100%"}
              alignItems={"center"}
              display={"flex"}
              // px={"20px"}
              // pl={["0", "20px"]}
              // pr={"20px"}
              pr={"20px"}
              maxWidth={"350px"}
              minWidth={"250px"}
            >
              {/* <BsDroplet size={"22px"} color="red" /> */}
              {/* <WaterDropIcon /> */}

              <div className="col col-auto">
                <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto text-white">
                  <OilBarrelIcon />
                </div>
              </div>
              <Box
                flexGrow={1}
                ml={2}
                flexDirection={"column"}
                display={"flex"}
              >
                <Typography variant="body1"> Fuel Sales</Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Gross Value {singleSiteFuelSales?.gross_value}
                </Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Total Value {singleSiteFuelSales?.total_value}
                </Typography>
              </Box>
              <Typography variant="body1">
                {" "}
                {singleSiteFuelSales?.status === "up" ? (
                  <>
                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                    <span className="text-success">
                      {singleSiteFuelSales?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                    <span className="text-danger">
                      {singleSiteFuelSales?.percentage}%
                    </span>
                  </>
                )}
              </Typography>
            </Box>
            <Box
              flex={1}
              borderRight="1px solid  #2a282863"
              alignItems={"center"}
              display={"flex"}
              height={"100%"}
              pr={"20px"}
              maxWidth={"350px"}
              minWidth={"250px"}
            >
              {/* <AiOutlinePauseCircle size={"22px"} color="red" /> */}
              <div className="col col-auto">
                <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto text-white">
                  <OilBarrelIcon />
                </div>
              </div>
              <Box flexGrow={1} ml={2}>
                <Typography variant="body1">Gross Margin</Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  {singleSiteGrossMargin?.gross_margin}
                </Typography>
              </Box>
              <Typography variant="body1">
                {singleSiteGrossMargin?.status === "up" ? (
                  <>
                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                    <span className="text-success">
                      {singleSiteGrossMargin?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                    <span className="text-danger">
                      {singleSiteGrossMargin?.percentage}%
                    </span>
                  </>
                )}
              </Typography>
            </Box>
            <Box
              flex={1}
              borderRight="1px solid  #2a282863"
              alignItems={"center"}
              display={"flex"}
              height={"100%"}
              pr={"20px"}
              maxWidth={"350px"}
              minWidth={"250px"}
            >
              {/* <AiOutlineBarChart size={"22px"} color="red" /> */}
              <div className="col col-auto">
                <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                  <i className="icon icon-pound-sign text-white mb-5 ">
                    &#163;
                  </i>
                </div>
              </div>
              <Box flexGrow={1} ml={2}>
                <Typography variant="body1">Gross Profit</Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Gross Profit {singleSiteGrossProfit?.gross_profit}
                </Typography>
              </Box>
              <Typography variant="body1">
                {singleSiteGrossProfit?.status === "up" ? (
                  <>
                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                    <span className="text-success">
                      {singleSiteGrossProfit?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                    <span className="text-danger">
                      {singleSiteGrossProfit?.percentage}%
                    </span>
                  </>
                )}
              </Typography>
            </Box>
          </Box>
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            width={"100%"}
            gap={"15px"}
            justifyContent={"space-evenly"}
          >
            <Box
              flex={1}
              borderRight="1px solid #2a282863"
              height={"100%"}
              alignItems={"center"}
              display={"flex"}
              // px={"20px"}
              // pl={["0", "20px"]}
              // pr={"20px"}
              pr={"20px"}
              maxWidth={"350px"}
              minWidth={"250px"}
            >
              <div className="col col-auto">
                <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                  <i className="icon icon-pound-sign text-white mb-5 ">ℓ</i>
                </div>
              </div>
              {/* <BsDroplet size={"22px"} color="red" /> */}
              {/* <WaterDropIcon /> */}
              <Box
                flexGrow={1}
                ml={2}
                flexDirection={"column"}
                display={"flex"}
              >
                <Typography variant="body1"> Fuel Volume</Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Gross Volume {singleSiteFuelVolume?.gross_volume}
                </Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Total Volume {singleSiteFuelVolume?.total_volume}
                </Typography>
              </Box>
              <Typography variant="body1">
                {" "}
                {singleSiteFuelVolume?.status === "up" ? (
                  <>
                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                    <span className="text-success">
                      {singleSiteFuelVolume?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                    <span className="text-danger">
                      {singleSiteFuelVolume?.percentage}%
                    </span>
                  </>
                )}
              </Typography>
            </Box>
            <Box
              flex={1}
              borderRight="1px solid  #2a282863"
              alignItems={"center"}
              display={"flex"}
              height={"100%"}
              pr={"20px"}
              maxWidth={"350px"}
              minWidth={"250px"}
            >
              {/* <AiOutlinePauseCircle size={"22px"} color="red" /> */}
              <div className="col col-auto">
                <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                  <i className="icon icon-pound-sign text-white mb-5 ">
                    &#163;
                  </i>
                </div>
              </div>
              <Box flexGrow={1} ml={2}>
                <Typography variant="body1">Shop Margin</Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Shop Margin {singleSiteShopMargin?.shop_margin}
                </Typography>
              </Box>
              <Typography variant="body1">
                {" "}
                {singleSiteShopMargin?.status === "up" ? (
                  <>
                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                    <span className="text-success">
                      {singleSiteShopMargin?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                    <span className="text-danger">
                      {singleSiteShopMargin?.percentage}%
                    </span>
                  </>
                )}
              </Typography>
            </Box>
            <Box
              flex={1}
              alignItems={"center"}
              display={"flex"}
              height={"100%"}
              pr={"20px"}
              maxWidth={"350px"}
              minWidth={"250px"}
              borderRight="1px solid  #2a282863"
            >
              {/* <AiOutlineEuroCircle size={"22px"} color="red" /> */}
              <div className="col col-auto">
                <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                  <i className="icon icon-pound-sign text-white mb-5 ">
                    &#163;
                  </i>
                </div>
              </div>
              <Box flexGrow={1} ml={2}>
                <Typography variant="body1">Shop Sales</Typography>
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Shop Sales {singleSiteShopSale?.shop_sales}
                </Typography>
              </Box>
              <Typography variant="body1">
                {singleSiteShopSale?.status === "up" ? (
                  <>
                    <i className="fa fa-chevron-circle-up text-success me-1"></i>
                    <span className="text-success">
                      {singleSiteShopSale?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                    <span className="text-danger">
                      {singleSiteShopSale?.percentage}%
                    </span>
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        </Box>

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
                {" "}
                {formattedMonth}
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
                  {formattedDate}
                </Typography>
              </Typography>
              <Box variant="body1">
                <Typography variant="body3" sx={{ opacity: 0.5 }}>
                  Last Date Deducted Delivery was on
                </Typography>
                <Typography variant="body1" fontSize={"22px"} fontWeight={500}>
                  {formattedFullDate}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            display={"flex"}
            gap={"25px"}
            flexWrap={"wrap"}
            justifyContent={["space-between"]}
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
              <Typography variant="body1">Fuel Stats</Typography>
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
                <Typography variant="body1">
                  Payment Type Total Volume
                </Typography>

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
          <Typography>WetStock analysis</Typography>
          <Box
            display={"flex"}
            gap={"23px"}
            flexWrap={"wrap"}
            justifyContent={["space-around"]}
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
              <h4 className="card-title">Performance Reporting</h4>
            </Card.Header>
            <Card.Body className="card-body pb-0">
              <div id="chart">
                <DashboardSiteLineChart
                  getSiteStats={getSiteStats}
                  setGetSiteStats={setGetSiteStats}
                  getSiteDetails={getSiteDetails}
                  setGetSiteDetails={setGetSiteDetails}
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
              <h4 className="card-title">Total Transactions</h4>
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
    </>
  );
};

export default DashTopSubHeading;
