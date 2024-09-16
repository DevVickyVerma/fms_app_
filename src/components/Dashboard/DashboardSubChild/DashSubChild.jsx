import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from 'react';
import CustomModal from "../../../data/Modal/DashboardSiteDetails";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tab,
  Tabs,
  Tooltip,
} from "react-bootstrap";
import makeAnimated from "react-select/animated";
import { BsFillFuelPumpFill, BsFuelPumpFill } from "react-icons/bs";
import moment from "moment/moment";
import StackedLineBarChart from "../StackedLineBarChart";
import DashSubStatsBox from "./DashSubStatsBox";
import DashSubChildGrads from "./DashSubChildGrads";
import DashSubChildShopSale from "./DashSubChildShopSale/DashSubChildShopSale";
import DashSubChildTankAnalysis from "./DashSubChildTankAnalysis";
import { Link, useNavigate, useParams } from "react-router-dom";
import CompetitorSingleGraph from "../../pages/Competitor/CompetitorSingleGraph";
import { handleError } from "../../../Utils/ToastUtils";
import LoaderImg from "../../../Utils/Loader";
import axios from "axios";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { useMyContext } from "../../../Utils/MyContext";
import { useSelector } from "react-redux";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DashSubChild = ({
  getSiteStats,
  CompititorStats,
  setGetSiteStats,
  statsID,
  getSiteDetails,
}) => {
  const {
    setGradsGetSiteDetails,
    setDashboardShopSaleData,
    setDashboardGradsLoading,
    setDashboardSiteDetailsLoading,
    dashSubChildShopSaleLoading,
    setDashSubChildShopSaleLoading,
    DashboardGradsLoading
  } = useMyContext();

  const [showLoader, setShowLoader] = useState(true);
  const id = useParams();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []); // Empty dependency array ensures the effect runs only once on mount

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
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(CompititorStats);
  const userPermissions = useSelector((state) => state?.data?.data?.permissions || []);
  const [Compititorloading, setCompititorloading] = useState(false);
  const [selected, setSelected] = useState();
  const [mySelectedDate, setMySelectedDate] = useState();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  const FetchCompititorData = async (selectedValues) => {
    setCompititorloading(true);
    if (localStorage.getItem("Dashboardsitestats") === "true") {
      try {
        // Use async/await to fetch data
        const response3 = await axiosInstance.get(
          selectedValues?.start_date
            ? `/site/competitor-price/stats?site_id=${id}&drs_date=${selectedValues?.start_date}`
            : `/site/competitor-price/stats?site_id=${statsID}`
        );

        if (response3 && response3.data) {
          setGetCompetitorsPrice(response3?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        // Handle errors that occur during the asynchronous operations
        console.error("API error:", error);
        handleError(error);
      } finally {
        // Set Compititorloading to false when the request is complete (whether successful or not)
        setCompititorloading(false);
      }
    }
  };

  useEffect(() => {

    userPermissions?.includes("dashboard-site-stats") &&
      FetchCompititorData();
  }, [id]);


  if (Compititorloading) {
    return <LoaderImg />;
  }

  if (!getCompetitorsPrice) {
    return (
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
            <Card.Body className="card-body pb-0 overflow-auto">
              {" "}
              <img
                src={require("../../../assets/images/commonimages/no_data.png")}
                alt="MyChartImage"
                className="all-center-flex nodata-image"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  const data = getCompetitorsPrice?.competitorListing;
  const animatedComponents = makeAnimated();
  const Optionssingle = selected?.map((item) => ({
    value: item?.id,
    label: item?.site_name,
  }));

  const handleSitePathChange = (values) => {
    navigate(`/sitecompetitor/${values.value}`);
  };

  const byDefaultSelectValue = {
    value: id,
    label: getCompetitorsPrice?.siteName,
  };

  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };

  const today = new Date(); // Current date
  const maxDate = new Date(today); // Set max date as current date
  maxDate.setDate(today.getDate() - 1); // Set max date to yesterday
  const formattedMaxDate = maxDate.toISOString().split("T")[0]; // Format max date

  const minDate = new Date(today); // Set min date as current date
  minDate.setMonth(minDate.getMonth() - 2); // Set min date to 2 months ago
  const formattedMinDate = minDate.toISOString().split("T")[0]; // Format min date

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">
            {getSiteStats?.data?.site_name
              ? getSiteStats?.data?.site_name
              : "DashBoard Site details"}{" "}
            ({getSiteStats?.data?.dateString})
          </h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard-details" }}
            >
              Details
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              {getSiteStats?.data?.site_name
                ? getSiteStats?.data?.site_name
                : "DashBoard Site details"}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="Show-title">
          <span>
            {" "}
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
                  Opening Time :{" "}
                  {getSiteStats?.data?.opening ? (
                    moment(getSiteStats?.data?.opening).format("Do MMM, HH:mm")
                  ) : (
                    <span className="Smallloader"></span>
                  )}
                  <br />
                  Closing Time :{" "}
                  {getSiteStats?.data?.closing ? (
                    moment(getSiteStats?.data?.closing).format("Do MMM, HH:mm")
                  ) : (
                    <span className="Smallloader"></span>
                  )}
                  <br />
                </Tooltip>
              }
            >
              <h1
                className="page-title"
                style={{ fontSize: "15px", fontWeight: "400" }}
              >
                Last Day End :{" "}
                {getSiteStats?.data?.last_dayend ? (
                  moment(getSiteStats?.data?.last_dayend).format("Do MMM")
                ) : (
                  <span className="Smallloader"></span>
                )}{" "}
                <i className="fa fa-info-circle" aria-hidden="true">
                  {" "}
                </i>
              </h1>
            </OverlayTrigger>
          </span>
        </div>
      </div>

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
                    className="fa fa-info-circle"
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
          >
            <Box display={"flex"} alignItems={"center"}>
              <Box>
                {" "}
                {getSiteStats?.data?.site_image ? (
                  <img
                    src={getSiteStats?.data?.site_image}
                    alt={getSiteStats?.data?.site_image}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  <span className="Smallloader"></span>
                )}
              </Box>
              <Box>
                <Typography
                  fontSize={"19px"}
                  fontWeight={500}
                  ml={"7px"}
                  variant="body1"
                >
                  {getSiteStats?.data?.site_name
                    ? getSiteStats?.data?.site_name
                    : ""}
                </Typography>
              </Box>
            </Box>

            {/* RIGHT side heading title */}
            <Box gap={"20px"} display={["contents", "flex"]}>
              {/*   Cash  tracker Card*/}

              <Box
                display={"flex"}
                flexDirection={"column"}
                bgcolor={"#ecf0f1"}
              >
                <Box
                  my={"4px"}
                  color={"#2d3436"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px={"13px"}
                >
                  <Typography fontSize={"14px"}>Cash Tracker</Typography>
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
                        className="fa fa-info-circle"
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
                      {getSiteStats?.data?.cash_tracker?.cash_amount ? (
                        getSiteStats.data.cash_tracker.cash_amount
                      ) : (
                        <span className="Smallloader"></span>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </>

        {/* dashboard site Top section */}
        <DashSubStatsBox />

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
                  {
                    moment(MonthLastDelivery, "MMM").isValid()
                      ? MonthLastDelivery
                      : "" // <span className="Smallloader"></span>
                  }
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
                  {showLoader && <span className="Smallloader"></span>}
                  {!showLoader && moment(day, "DD").isValid() && day}
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
          <Box display={"flex"} gap={"25px"} flexWrap={"wrap"} justifyContent={["center", "flex-start"]}>
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


      </div>


      {/* Grads Section */}
      {DashboardGradsLoading ? <>
        <Row>
          <Col lg={12}>

            <Card>
              <Card.Header>

                <h3 className="card-title">Grades Analysis</h3>
              </Card.Header>

              <Card.Body>
                <span className="Smallloader"></span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </> :
        <>

          <DashSubChildGrads getSiteStats={getSiteStats} />
        </>
      }


      {/* Grads Section */}
      {dashSubChildShopSaleLoading ? <>
        <Row>
          <Col lg={12}>

            <Card>
              <Card.Header>

                <h3 className="card-title">Shop Sales</h3>
              </Card.Header>

              <Card.Body>
                <span className="Smallloader"></span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </> :
        <>

          {/* new Shop sale */}
          <DashSubChildShopSale
            getSiteDetails={getSiteDetails}
            getSiteStats={getSiteStats}
          />
        </>
      }



      {/* tank analysis */}
      <Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <Col lg={12} md={12}>
          <>
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
              <Card.Body className="card-body p-0 m-0">
                <div id="chart">
                  <DashSubChildTankAnalysis
                    getSiteStats={getSiteStats}
                    setGetSiteStats={setGetSiteStats}
                  />
                </div>
              </Card.Body>
            </Card>
          </>
        </Col>
      </Row>

      <Col xl={12} className="p-0">
        <Card>
          <Card.Header>
            <div className="Tank-Details d-flex">
              <h4 className="card-title">Competitor Stats</h4>

            </div>
          </Card.Header>
          <Card.Body className="p-6">
            <div className="panel panel-primary">
              <div className=" ">
                <div className="tabs-menu1 tabstyle2">
                  <Tabs
                    as="li"
                    variant="pills"
                    defaultActiveKey="tab5"
                    className="panel-tabs"
                  >
                    <Tab
                      as="li"
                      eventKey="tab5"
                      className=" me-1"
                      title="Competitors Stats"
                    >
                      <Row
                        style={{
                          marginBottom: "10px",
                          marginTop: "20px",
                        }}
                      >
                        <Col lg={12} md={12} className="">
                          <Card className="">
                            <Card.Header className=" my-cardd card-header ">
                              <h4 className="card-title">
                                {" "}
                                {getCompetitorsPrice
                                  ? getCompetitorsPrice?.siteName
                                  : ""}{" "}
                                Competitors Stats
                              </h4>
                            </Card.Header>
                            <Card.Body className="my-cardd card-body pb-0 overflow-auto">
                              <table className="w-100 mb-6">
                                <tbody>
                                  <tr>
                                    <th className="font-500">
                                      <span className="single-Competitor-heading cardd  d-flex justify-content-between w-99">
                                        <span>
                                          Competitors Name <AiFillCaretDown />
                                        </span>
                                        <span className="text-end">
                                          Fuel{" "}
                                          <span className="hidden-in-small-screen">
                                            {" "}
                                            Type
                                          </span>{" "}
                                          <AiFillCaretRight />
                                        </span>
                                      </span>
                                    </th>
                                    {Object?.keys(data)?.map((fuelType) => (
                                      <th key={fuelType} className="font-500">
                                        <span className="single-Competitor-heading cardd block w-99 ">
                                          <BsFuelPumpFill /> {fuelType}
                                        </span>
                                      </th>
                                    ))}
                                  </tr>
                                  {getCompetitorsPrice?.competitors?.map(
                                    (competitorsName, rowIndex) => (
                                      <tr key={rowIndex}>
                                        <td>
                                          <div className="single-Competitor-heading d-flex w-99.9 cardd">
                                            <p className=" m-0 d-flex align-items-center">
                                              <span>
                                                <img
                                                  src={
                                                    competitorsName?.supplierImage
                                                  }
                                                  alt="supplierImage"
                                                  className=" mx-3"
                                                  style={{
                                                    width: "36px",
                                                    height: "36px",
                                                  }}
                                                />
                                              </span>
                                            </p>

                                            <p
                                              className=" d-flex flex-column m-0"
                                              style={{ minWidth: "55px" }}
                                            >
                                              <span className="single-Competitor-distance">
                                                <AiOutlineArrowRight />{" "}
                                                {competitorsName?.station
                                                  ? "My station"
                                                  : `${competitorsName?.dist_miles} miles away`}
                                              </span>
                                              <span
                                                style={{ minWidth: "200px" }}
                                              >
                                                {competitorsName?.name}
                                              </span>
                                            </p>
                                          </div>
                                        </td>
                                        {Object.keys(data).map(
                                          (fuelType, colIndex) => (
                                            <td key={colIndex}>
                                              <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                                                <span className="circle-info">
                                                  {
                                                    data[fuelType]?.[rowIndex]
                                                      ?.last_updated
                                                  }
                                                  <span>
                                                    <OverlayTrigger
                                                      placement="top"
                                                      overlay={
                                                        <Tooltip
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "flex-start",
                                                            justifyContent:
                                                              "flex-start",
                                                            width: "300px", // Set your desired width here
                                                          }}
                                                        >
                                                          {
                                                            data[fuelType]?.[
                                                              rowIndex
                                                            ]?.last_date
                                                          }
                                                        </Tooltip>
                                                      }
                                                    >
                                                      <p
                                                        className=" m-0 single-Competitor-distance"
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                      >
                                                        {" "}
                                                        <i
                                                          className="fa fa-info-circle ms-1"
                                                          aria-hidden="true"
                                                          style={{
                                                            fontSize: "15px",
                                                          }}
                                                        ></i>{" "}
                                                        <span></span>
                                                      </p>
                                                    </OverlayTrigger>
                                                  </span>
                                                </span>

                                                <span className=" d-flex justify-content-between align-items-center">
                                                  <span>
                                                    {
                                                      data[fuelType]?.[rowIndex]
                                                        ?.price
                                                    }
                                                  </span>

                                                  {data[fuelType]?.[rowIndex]
                                                    ?.station ? (
                                                    ""
                                                  ) : (
                                                    <>
                                                      <span
                                                        className="PetrolPrices-img"
                                                        style={{
                                                          width: "25px",
                                                          height: "25px",
                                                          fontSize: "20px",
                                                          cursor: "pointer",
                                                          marginLeft: "10px",
                                                        }}
                                                      >
                                                        <OverlayTrigger
                                                          placement="top"
                                                          overlay={
                                                            <Tooltip
                                                              style={{
                                                                display: "flex",
                                                                alignItems:
                                                                  "flex-start",
                                                                justifyContent:
                                                                  "flex-start",
                                                              }}
                                                            >
                                                              <span>{data?.[fuelType]?.[rowIndex]?.logo_tip}</span>
                                                            </Tooltip>
                                                          }
                                                        >
                                                          <img
                                                            alt=""
                                                            src={data?.[fuelType]?.[rowIndex]?.logo}
                                                            className=""
                                                            style={{
                                                              objectFit:
                                                                "contain",
                                                            }}
                                                          />
                                                        </OverlayTrigger>
                                                      </span>
                                                    </>
                                                  )}
                                                </span>
                                              </span>
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Tab>
                    <Tab
                      as="li"
                      eventKey="tab6"
                      className="  me-1"
                      title="Competitor Stats Graph "
                    >
                      <Row
                        style={{
                          marginBottom: "10px",
                          marginTop: "20px",
                        }}
                      >
                        <Col lg={12} md={12}>
                          <>
                            <Card.Body className="card-body b-0">
                              <div id="chart">
                                <CompetitorSingleGraph
                                  getCompetitorsPrice={getCompetitorsPrice}
                                  setGetCompetitorsPrice={
                                    setGetCompetitorsPrice
                                  }
                                />
                              </div>
                            </Card.Body>
                          </>
                        </Col>
                      </Row>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>


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

export default DashSubChild;
