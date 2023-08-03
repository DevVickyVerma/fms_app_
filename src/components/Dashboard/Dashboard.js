import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";

import * as dashboard from "../../data/dashboard/dashboard";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../Utils/ApiHelper";

import { fetchData } from "../../Redux/dataSlice";
import SortIcon from "@mui/icons-material/Sort";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SideSearchbar from "../../data/Modal/SideSearchbar";
import DashBordModal from "../../data/Modal/DashBordmodal";
import PieDashboardChart from "../../components/pages/DashBoardChart/PieDashboardChart";
import Spinners from "../../components/Dashboard/Spinner";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import OilBarrelIcon from "@mui/icons-material/OilBarrel";
import { useDispatch, useSelector } from "react-redux";

import {
  Breadcrumb,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

const Dashboard = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [sidebarVisible1, setSidebarVisible1] = useState(true);

  const [ShowTruw, setShowTruw] = useState(false);
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [searchdata, setSearchdata] = useState({});
  const [SearchList, setSearchList] = useState(false);
  const [GrossMarginValue, setGrossMarginValue] = useState();
  const [GrossProfitValue, setGrossProfitValue] = useState();
  const [FuelValue, setFuelValue] = useState();
  const [GrossVolume, setGrossVolume] = useState();
  const [shopsale, setshopsale] = useState();
  const [shopmargin, setshopmargin] = useState();
  const [piechartValues, setpiechartValues] = useState();
  const [LinechartValues, setLinechartValues] = useState([]);
  const [LinechartOption, setLinechartOption] = useState();
  let LinechartOptions = [];
  const handleFetchSiteData = async () => {
    try {
      const response = await getData("/dashboard/stats");

      const { data } = response;
      if (data) {
        console.log(data?.data?.line_graph, "data?.data?.line_graph");
        LinechartOptions = data?.data?.line_graph?.option?.labels;
        console.log(LinechartOptions, "data?.data?.line_graph");
        setLinechartValues(data?.data?.line_graph?.series);
        setLinechartOption(data?.data?.line_graph?.option?.labels);

        setpiechartValues(data?.data?.pi_graph);
        setGrossMarginValue(data?.data?.gross_margin_);
        setGrossVolume(data?.data?.gross_volume);
        setGrossProfitValue(data?.data?.gross_profit);
        setFuelValue(data?.data?.fuel_sales);
        setshopsale(data?.data?.shop_sales);

        setshopmargin(data?.data?.shop_margin);
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }
  };
  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 500,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 500,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const Errornotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }

  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const token = localStorage.getItem("token");
  const loggedInFlag = localStorage.getItem("justLoggedIn");
  const tokenUpdated = localStorage.getItem("tokenupdate") === "true";
  const storedToken = localStorage.getItem("token");
  const dispatch = useDispatch();
  useEffect(() => {
    setClientID(localStorage.getItem("superiorId"));

    if (tokenUpdated) {
      window.location.reload();

      localStorage.setItem("tokenupdate", "false"); // Update the value to string "false"
      // Handle token update logic without page reload
    }

    if (loggedInFlag) {
      setJustLoggedIn(true);
      localStorage.removeItem("justLoggedIn"); // clear the flag
    }

    if (justLoggedIn) {
      SuccessToast("Login Successfully");
      setJustLoggedIn(false);
    }
    console.clear();
  }, [ClientID, dispatch, justLoggedIn, token]);

  useEffect(() => {
    handleFetchSiteData();
    if (token && storedToken) {
      dispatch(fetchData());
    }
    console.clear();
  }, [token]);

  const handleToggleSidebar1 = () => {
    setShowTruw(true);
    setSidebarVisible1(!sidebarVisible1);
  };

  const handleFormSubmit = async (values) => {
    setSearchdata(values);
    try {
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/stats?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}&end_date=${values.TOdate}&start_date=${values.fromdate}`
          : `dashboard/stats?client_id=${ClientID}&company_id=${values.company_id}&site_id=${values.site_id}&end_date=${values.TOdate}&start_date=${values.fromdate}`
      );

      const { data } = response;
      if (data) {
        setGrossMarginValue(data?.data?.gross_margin_);
        setLinechartValues(data?.data?.line_graph?.series);
        setpiechartValues(data?.data?.pi_graph);
        setGrossVolume(data?.data?.gross_volume);
        setGrossProfitValue(data?.data?.gross_profit);
        setFuelValue(data?.data?.fuel_sales);
        setshopsale(data?.data?.shop_sales);

        setshopmargin(data?.data?.shop_margin);
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }
  };

  const ResetForm = () => {
    setSearchdata({});
    handleFetchSiteData();
  };
  const [series] = useState([
    {
      name: "Fuel Volume",
      type: "line",
      data: [
        "3603748.97",
        "3773655.95",
        "4432385.55",
        "4625445.53",
        "4928706.67",
        "4861556.06",
        "3678807.2",
      ],
    },
    {
      name: "Fuel Margin",
      type: "line",
      data: [
        "136.7458",
        "134.57002",
        "133.24867",
        "130.55916",
        "126.50245",
        "122.73388",
        "119.84596",
      ],
    },
    {
      name: "Shop Sales",
      type: "line",
      data: [
        "645595.61",
        "675761.99",
        "866782.68",
        "1009859.18",
        "1111385.53",
        "1134722.21",
        "825244.2",
      ],
    },
  ]);
  const defaultLabels = [
    "30 Jan 2023",
    "28 Feb 2023",
    "31 Mar 2023",
    "30 Apr 2023",
    "31 May 2023",
    "30 Jun 2023",
    "31 Jul 2023",
  ];

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "line",
    },
    title: {
      text: "",
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [],
    },
    labels: defaultLabels,
    xaxis: {
      type: "datetime", // Set the xaxis type to "datetime"
    },
    yaxis: [
      {
        title: {
          text: "Fuel Volume",
        },
      },
      {
        opposite: true,
        title: {
          text: "Fuel Margin",
        },
      },
    ],
  });

  // Function to update the options
  const updateOptions = (newOptions) => {
    setOptions((prevOptions) => ({ ...prevOptions, ...newOptions }));
  };

  const isoDateLabels = defaultLabels.map((label) => {
    const [day, month, year] = label.split(" ");
    const monthIndex = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].indexOf(month) + 1;
    const zeroPaddedDay = day.padStart(2, "0");
    const zeroPaddedMonth = monthIndex.toString().padStart(2, "0");
    return `${year}-${zeroPaddedMonth}-${zeroPaddedDay}`;
  });

  console.log("isoDateLabels", isoDateLabels);


  console.log(options, "options");
  // Check if LinechartOption exists and update the labels accordingly
  useEffect(() => {
    if (LinechartOption) {
      updateOptions({ labels: LinechartOption });
    }
  }, [LinechartOption]);
  const piechartValuesss = {
    shop_sales: '1159784.81',
    fuel_sales: '7800693.4',
    bunkered_sales: '13461.94',
  };
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Dashboard
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {localStorage.getItem("role") !== "Operator" ? (
            <div className="ms-auto pageheader-btn ">
              <span className="Search-data">
                {Object.entries(searchdata).map(([key, value]) => {
                  if (
                    (key === "client_name" ||
                      key === "TOdate" ||
                      key === "company_name" ||
                      key === "site_name" ||
                      key === "fromdate") &&
                    value != null && // Check if value is not null or undefined
                    value !== ""
                  ) {
                    const formattedKey = key
                      .toLowerCase()
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");

                    return (
                      <div key={key} className="badge">
                        <span className="badge-key">{formattedKey}:</span>
                        <span className="badge-value">{value}</span>
                      </div>
                    );
                  } else {
                    return null; // Skip rendering if value is null or undefined, or key is not in the specified list
                  }
                })}
              </span>

              <Link
                className="btn btn-primary"
                onClick={() => {
                  handleToggleSidebar1();
                }}
              >
                Filter
                <span className="ms-2">
                  <SortIcon />
                </span>
              </Link>
              {Object.keys(searchdata).length > 0 ? (
                <Link
                  className="btn btn-danger ms-2"
                  onClick={() => {
                    ResetForm();
                  }}
                >
                  Reset <RestartAltIcon />
                </Link>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>

        {ShowTruw ? (
          <DashBordModal
            title="Search"
            visible={sidebarVisible1}
            onClose={handleToggleSidebar1}
            onSubmit={handleFormSubmit}
            searchListstatus={SearchList}
          />
        ) : (
          ""
        )}

        <Row>
          <Col lg={12} md={12} sm={12} xl={12}>
            <Row>
              <Col lg={6} md={12} sm={12} xl={4}>
                <Card
                  className={`card overflow-hidden Dashboard-card ${
                    GrossVolume?.status === "up"
                      ? "Dashboard-success-border"
                      : "Dashboard-loss-border"
                  }`}
                >
                  <Card.Body>
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            {isLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <div className="d-flex">
                                  <div>
                                    <h6>Gross Volume</h6>
                                    <h4 className="mb-2 number-font">
                                      {" "}
                                      ℓ{GrossVolume?.gross_volume}
                                    </h4>
                                  </div>
                                  <div className="border-left"></div>
                                  <div className="ms-3">
                                    <h6>Bunkered Volume</h6>
                                    <h4 className="mb-2 number-font">
                                      ℓ{GrossVolume?.bunkered_volume}
                                    </h4>
                                  </div>
                                </div>

                                {/* <p className="p-0">Bunkered Volume</p> */}
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>{`${GrossVolume?.percentage}%`}</Tooltip>
                                  }
                                >
                                  <p className="text-muted mb-0 mt-4">
                                    <span
                                      className={`me-1 ${
                                        shopmargin?.status === "up"
                                          ? "text-success"
                                          : "text-danger"
                                      }`}
                                      data-tip={`${GrossVolume?.percentage}%`}
                                    >
                                      {GrossVolume?.status === "up" ? (
                                        <>
                                          <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                          <span className="text-success">
                                            {GrossVolume?.percentage}%
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                          <span className="text-danger">
                                            {GrossVolume?.percentage}%
                                          </span>
                                        </>
                                      )}
                                    </span>
                                    last month
                                  </p>
                                </OverlayTrigger>
                              </>
                            )}
                          </div>
                          <div className="col col-auto">
                            <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                              <i className="icon icon-pound-sign text-white mb-5 ">
                                &#163;
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <div className="col-lg-6 col-md-12 col-sm-12 col-xl-4">
                <div
                  className={`card overflow-hidden Dashboard-card ${
                    GrossProfitValue?.status === "up"
                      ? "Dashboard-success-border"
                      : "Dashboard-loss-border"
                  }`}
                >
                  <div className="card-body ">
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box ">
                          <div>
                            <h6>Gross Profit</h6>
                            {isLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h4 className="mb-2 number-font">
                                  {" "}
                                  £{GrossProfitValue?.gross_profit}
                                </h4>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>{`${GrossProfitValue?.percentage}%`}</Tooltip>
                                  }
                                >
                                  <p className="text-muted mb-0 mt-4">
                                    <span
                                      className={`me-1 ${
                                        GrossProfitValue?.status === "up"
                                          ? "text-success"
                                          : "text-danger"
                                      }`}
                                    >
                                      {GrossProfitValue?.status === "up" ? (
                                        <>
                                          <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                          <span className="text-success">
                                            {GrossProfitValue?.percentage}%
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                          <span className="text-danger">
                                            {GrossProfitValue?.percentage}%
                                          </span>
                                        </>
                                      )}
                                      {/* <span>
                                      {GrossProfitValue?.percentage}%
                                    </span> */}
                                    </span>
                                    last month
                                  </p>
                                </OverlayTrigger>
                              </>
                            )}
                          </div>
                          <div className="col col-auto">
                            <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                              <i className="icon icon-pound-sign text-white mb-5 ">
                                &#163;
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
              <Col lg={6} md={12} sm={12} xl={4}>
                <Card
                  className={`card overflow-hidden Dashboard-card ${
                    GrossMarginValue?.status === "up"
                      ? "Dashboard-success-border"
                      : "Dashboard-loss-border"
                  }`}
                >
                  <Card.Body>
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            <h6>Gross Margin</h6>
                            {isLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h4 className="mb-2 number-font">
                                  {" "}
                                  {GrossMarginValue?.gross_margin} ppl
                                </h4>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>{`${GrossMarginValue?.percentage}%`}</Tooltip>
                                  }
                                >
                                  <p className="text-muted mb-0 mt-4">
                                    <span
                                      className={`me-1 ${
                                        GrossMarginValue?.status === "up"
                                          ? "text-success"
                                          : "text-danger"
                                      }`}
                                    >
                                      {GrossMarginValue?.status === "up" ? (
                                        <>
                                          <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                          <span className="text-success">
                                            {GrossMarginValue?.percentage}%
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                          <span className="text-danger">
                                            {GrossMarginValue?.percentage}%
                                          </span>
                                        </>
                                      )}
                                      {/* <span>
                                      {GrossProfitValue?.percentage}%
                                    </span> */}
                                    </span>
                                    last month
                                  </p>
                                </OverlayTrigger>
                              </>
                            )}
                          </div>
                          <div className="col col-auto">
                            <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto text-white">
                              <OilBarrelIcon />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col lg={12} md={12} sm={12} xl={12}>
            <Row>
              <Col lg={6} md={12} sm={12} xl={4}>
                <Card
                  className={`card overflow-hidden Dashboard-card ${
                    FuelValue?.status === "up"
                      ? "Dashboard-success-border"
                      : "Dashboard-loss-border"
                  }`}
                >
                  <Card.Body>
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            {isLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <div className="d-flex">
                                  <div>
                                    <h6>Fuel Sales</h6>
                                    <h4 className="mb-2 number-font">
                                      £{FuelValue?.gross_value}
                                    </h4>
                                  </div>
                                  <div className="border-left"></div>
                                  <div className="ms-3">
                                    <h6>Bunkered Sales</h6>
                                    <h4 className="mb-2 number-font">
                                      £{FuelValue?.bunkered_value}
                                    </h4>
                                  </div>
                                </div>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>{`${FuelValue?.percentage}%`}</Tooltip>
                                  }
                                >
                                  <p className="text-muted mb-0 mt-4">
                                    <span
                                      className={`me-1 ${
                                        FuelValue?.status === "up"
                                          ? "text-success"
                                          : "text-danger"
                                      }`}
                                    >
                                      {FuelValue?.status === "up" ? (
                                        <>
                                          <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                          <span className="text-success">
                                            {FuelValue?.percentage}%
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                          <span className="text-danger">
                                            {FuelValue?.percentage}%
                                          </span>
                                        </>
                                      )}
                                      {/* <span>{FuelValue?.percentage}%</span> */}
                                    </span>
                                    last month
                                  </p>
                                </OverlayTrigger>
                              </>
                            )}
                          </div>
                          <div className="col col-auto">
                            <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto text-white">
                              <OilBarrelIcon />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <div className="col-lg-6 col-md-12 col-sm-12 col-xl-4">
                <div
                  className={`card overflow-hidden Dashboard-card ${
                    shopsale?.status === "up"
                      ? "Dashboard-success-border"
                      : "Dashboard-loss-border"
                  }`}
                >
                  <div className="card-body ">
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            <h6>Shop Sales</h6>
                            {isLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h4 className="mb-2 number-font">
                                  £{shopsale?.shop_sales}
                                </h4>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>{`${shopsale?.percentage}%`}</Tooltip>
                                  }
                                >
                                  <p className="text-muted mb-0 mt-4">
                                    <span
                                      className={`me-1 ${
                                        shopsale?.status === "up"
                                          ? "text-success"
                                          : "text-danger"
                                      }`}
                                    >
                                      {shopsale?.status === "up" ? (
                                        <>
                                          <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                          <span className="text-success">
                                            {shopsale?.percentage}%
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                          <span className="text-danger">
                                            {shopsale?.percentage}%
                                          </span>
                                        </>
                                      )}
                                      {/* <span>{shopsale?.percentage}%</span> */}
                                    </span>
                                    last month
                                  </p>
                                </OverlayTrigger>
                              </>
                            )}
                          </div>
                          <div className="col col-auto">
                            <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                              <i className="icon icon-pound-sign text-white mb-5 ">
                                &#163;
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
              <Col lg={6} md={12} sm={12} xl={4}>
                <Card
                  className={`card overflow-hidden Dashboard-card ${
                    shopmargin?.status === "up"
                      ? "Dashboard-success-border"
                      : "Dashboard-loss-border"
                  }`}
                >
                  <Card.Body>
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            <h6>Shop Margin</h6>
                            {isLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h4 className="mb-2 number-font">
                                  £{shopmargin?.shop_margin}
                                </h4>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip>{`${shopmargin?.percentage}%`}</Tooltip>
                                  }
                                >
                                  <p className="text-muted mb-0 mt-4">
                                    <span
                                      className={`me-1 ${
                                        shopmargin?.status == "up"
                                          ? "text-success"
                                          : "text-danger"
                                      }`}
                                    >
                                      {shopmargin?.status === "up" ? (
                                        <>
                                          <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                          <span className="text-success">
                                            {shopmargin?.percentage}%
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                          <span className="text-danger">
                                            {shopmargin?.percentage}%
                                          </span>
                                        </>
                                      )}
                                      {/* <span>{shopmargin?.percentage}%</span> */}
                                    </span>
                                    last month
                                  </p>
                                </OverlayTrigger>
                              </>
                            )}
                          </div>
                          <div className="col col-auto">
                            <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                              <i className="icon icon-pound-sign text-white mb-5 ">
                                &#163;
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
                                        {/* Line chart */}
        <Row>
          <Col lg={7} md={12}>
            <Card className="fuel-card">
              <Card.Header className="card-header">
                <h4 className="card-title">Total Transactions</h4>
              </Card.Header>
              <Card.Body className="card-body pb-0">
                <div id="chart">
                <LineChart LinechartValues={LinechartValues} LinechartOption={LinechartOption} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5} md={12}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Overall Stats</h4>
              </Card.Header>
              <Card.Body className="apexchart">
              <BarChart piechartValues={piechartValuesss}   />
              </Card.Body>
            </Card>
          </Col>
        </Row>

    
      </div>
    </>
  );
};

export default withApi(Dashboard);
