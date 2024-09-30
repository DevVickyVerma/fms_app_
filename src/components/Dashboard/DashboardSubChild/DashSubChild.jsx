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
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { BsFillFuelPumpFill } from "react-icons/bs";
import moment from "moment/moment";
import StackedLineBarChart from "../StackedLineBarChart";
import DashSubStatsBox from "./DashSubStatsBox";
import DashSubChildGrads from "./DashSubChildGrads";
import DashSubChildShopSale from "./DashSubChildShopSale/DashSubChildShopSale";
import DashSubChildTankAnalysis from "./DashSubChildTankAnalysis";
import { Link, useParams } from "react-router-dom";
import { handleError } from "../../../Utils/ToastUtils";
import { useMyContext } from "../../../Utils/MyContext";
import { useSelector } from "react-redux";
import DashSubChildCompititorStats from "./DashSubChildCompititorStats";
import withApi from "../../../Utils/ApiHelper";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DashSubChild = ({
  getSiteStats,
  CompititorStats,
  setGetSiteStats,
  statsID,
  getSiteDetails,
  getData
}) => {
  const {
    dashSubChildShopSaleLoading,
    DashboardGradsLoading
  } = useMyContext();

  const [showLoader, setShowLoader] = useState(true);
  const id = useParams();
  const { id: current_site_id } = useParams();
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
  const stackedLineBarDataForSite = getSiteDetails?.performance_reporting?.datasets;
  const stackedLineBarLabelsForSite = getSiteDetails?.performance_reporting?.labels;

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


  const FetchCompititorData = async (selectedValues) => {
    const isDashboardSiteStats = localStorage.getItem("Dashboardsitestats") === "true";
    if (!isDashboardSiteStats || !current_site_id) return;

    const url = `/site/competitor-price/stats?site_id=${current_site_id}`;
    try {
      const response = await getData(url);
      if (response && response?.data && response?.data?.data) {
        setGetCompetitorsPrice(response?.data?.data);
      }
    } catch (error) {
      handleError(error);
    }
  };


  useEffect(() => {
    userPermissions?.includes("dashboard-site-stats") &&
      FetchCompititorData();
  }, [id]);


  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">
            {getSiteStats?.data?.site_name || "DashBoard Site details"}{" "}({getSiteStats?.data?.dateString})
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

      <div className="mb-4">
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
                    <Tooltip className=" d-flex align-items-start justify-content-start" >
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

          <div class="d-flex justify-content-between align-items-center flex-wrap bg-white text-black mb-5 py-3 px-3 primary-shadow gap-1">
            <div className=" d-flex align-items-center">
              <div className="">
                {getSiteStats?.data?.site_image ? (
                  <img
                    src={getSiteStats?.data?.site_image}
                    alt={getSiteStats?.data?.site_image}
                    style={{ width: "50px", height: "50px" }}
                  />
                ) : (
                  <span className="Smallloader"></span>
                )}
              </div>
              <div>
                <span class="fs-5 fw-light ms-2">
                  {getSiteStats?.data?.site_name || "No Site Name Found"}
                </span>
              </div>
            </div>


            {/* RIGHT side heading title */}
            <div className=" d-flex gap-5 ">
              <div className=" d-flex flex-column bg-light-gray">
                <div class="my-1 text-dark d-flex justify-content-between align-items-center px-2">
                  <span class="fs-7-5">Cash Tracker</span>
                  <span onClick={handleModalOpen} className="pointer">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip className="d-flex align-items-start justify-content-start">
                          Security Amount: {getSiteStats?.data?.cash_tracker?.security_amount}
                          <br />
                          Loomis Day: {getSiteStats?.data?.cash_tracker?.last_loomis_day}
                          <br />
                          Loomis Date: {getSiteStats?.data?.cash_tracker?.last_loomis_date}
                          <br />
                        </Tooltip>
                      }
                    >
                      <i className="fa fa-info-circle fs-5" aria-hidden="true"></i>
                    </OverlayTrigger>
                  </span>
                </div>

                <div class="d-flex">
                  <div>
                    <div
                      class="text-center py-1 all-center-flex position-relative fs-7-5 color-light-gray bg-dark-green"
                      style={{
                        height: "48px",
                        width: "140px",
                        backgroundColor: "rgb(25, 122, 66)",
                      }}
                    >
                      {getSiteStats?.data?.cash_tracker?.cash_amount ? (
                        getSiteStats.data.cash_tracker.cash_amount
                      ) : (
                        <span className="Smallloader"></span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>

        {/* dashboard site Top section */}
        <DashSubStatsBox />

        {/* grid values */}

        <Box
          display={"flex"}
          width={"100%"}
          bgcolor={"#ffffff"}
          color={"black"}
          mb={"20px"}
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
                            {colors?.map((color, index) => (
                              <div key={index} className=" d-flex align-items-center py-1 px-3 text-white" >
                                <div
                                  style={{
                                    width: "20px", // Set the width for the color circle
                                    height: "20px",
                                    borderRadius: "50%",
                                    backgroundColor: color?.color,
                                  }}
                                ></div>
                                <span className=" text-white ms-2" >   {color?.name}  </span>
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
            {getCompetitorsPrice ? <>
              <DashSubChildCompititorStats getCompetitorsPrice={getCompetitorsPrice} setGetCompetitorsPrice={setGetCompetitorsPrice} />
            </> :
              <>
                <img
                  src={require("../../../assets/images/commonimages/no_data.png")}
                  alt="MyChartImage"
                  className="all-center-flex nodata-image"
                />
              </>}
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

export default withApi(DashSubChild);
