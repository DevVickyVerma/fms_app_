import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Spinner } from "react-bootstrap";
import * as dashboard from "../../data/dashboard/dashboard";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../Utils/ApiHelper";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../Redux/dataSlice";
import SortIcon from "@mui/icons-material/Sort";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SideSearchbar from "../../data/Modal/SideSearchbar";
import DashBordModal from "../../data/Modal/DashBordmodal";
import Spinners from "../../components/Dashboard/Spinner";
// import Loader from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from "axios";
const Dashboard = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [IsDashboardLoading, setIsDashboardLoading] = useState(false);
  const [ShowTruw, setShowTruw] = useState(false);
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [searchdata, setSearchdata] = useState({});
  const [SearchList, setSearchList] = useState(false);
  const [GrossMarginValue, setGrossMarginValue] = useState();
  const [GrossProfitValue, setGrossProfitValue] = useState();
  const [FuelValue, setFuelValue] = useState();
  const [GrossVolume, setGrossVolume] = useState();

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

  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setClientID(localStorage.getItem("superiorId"));
    if (localStorage.getItem("tokenupdate") === "true") {
      window.location.reload();
      localStorage.setItem("tokenupdate", false);
    }
  }, [localStorage.getItem("tokenupdate")]);

  useEffect(() => {
    if (token) {
      dispatch(fetchData());
    } else {
      // Handle the case when there is no token
    }
  }, [dispatch, token]);

  useEffect(() => {
    const loggedInFlag = localStorage.getItem("justLoggedIn");

    if (loggedInFlag) {
      setJustLoggedIn(true);
      localStorage.removeItem("justLoggedIn"); // clear the flag
    }
  }, []);

  useEffect(() => {
    if (justLoggedIn) {
      SuccessToast("Login Successfully");
      setJustLoggedIn(false);
    }
    // console.clear();
  }, [justLoggedIn]);

  const handleToggleSidebar1 = () => {
    console.log(ShowTruw, "hi");
    setShowTruw(true);
    setSidebarVisible1(!sidebarVisible1);
  };

  const handleFetchData = async () => {
    try {
      const response = await getData("/detail");

      const { data } = response;
      if (data) {
        // const resData = JSON.stringify( data.data);
        // dispatch(setuser(resData));
        const firstName = data.data.first_name ?? "";
        const lastName = data.data.last_name ?? "";
        const phoneNumber = data.data.phone_number ?? "";
        const full_name = data.data.full_name ?? "";
        const superiorRole = data.data.superiorRole ?? "";
        const superiorId = data.data.superiorId ?? "";
        localStorage.setItem("First_name", firstName);
        localStorage.setItem("full_name", full_name);
        localStorage.setItem("Last_name", lastName);
        localStorage.setItem("Phone_Number", phoneNumber);
        localStorage.setItem("superiorRole", superiorRole);
        localStorage.setItem("superiorId", superiorId);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleFormSubmit = (values) => {
    // Process the form values here
    console.log(values);
  };

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const FetchGrossVolume = async () => {
    try {
      const response = await axiosInstance.get(
        `/dashboard/gross-volume?client_id=${ClientID}`
      );

      setIsDashboardLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        console.log(data);
        // setGrossVolume(data);
      }

      // setIsDashboardLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      console.error("API error:", error);
      setIsDashboardLoading(false); // Set isLoading to false if there is an error
    }
  };
  const FetchGrossProfit = async () => {
    try {
      const response = await axiosInstance.get(
        `/dashboard/gross-profit?client_id=${ClientID}`
      );

      setIsDashboardLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        console.log(data);
      }

      setIsDashboardLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      console.error("API error:", error);
      setIsDashboardLoading(false); // Set isLoading to false if there is an error
    }
  };
  const Fetchgrossmargin = async () => {
    try {
      const response = await axiosInstance.get(
        `/dashboard/gross-margin?client_id=${ClientID}`
      );

      setIsDashboardLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        console.log(data);
      }

      setIsDashboardLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      console.error("API error:", error);
      setIsDashboardLoading(false); // Set isLoading to false if there is an error
    }
  };
  const FetchFuelSales = async () => {
    try {
      const response = await axiosInstance.get(
        `/dashboard/fuel-sale?client_id=${ClientID}`
      );

      setIsDashboardLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        console.log(data);
      }

      setIsDashboardLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      console.error("API error:", error);
      setIsDashboardLoading(false); // Set isLoading to false if there is an error
    }
  };
  useEffect(() => {
    handleFetchData();
    if (ClientID) {
      FetchGrossVolume();
      // FetchFuelSales();
      // FetchGrossProfit();
      // Fetchgrossmargin();
    }
  }, [ClientID]);

  return (
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
        <div className="ms-auto pageheader-btn ">
          <span className="Search-data">
            {Object.entries(searchdata).map(([key, value]) => (
              <div key={key} className="badge">
                <span className="badge-key">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="badge-value">{value}</span>
              </div>
            ))}
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
            <Link className="btn btn-danger ms-2">
              Reset <RestartAltIcon />
            </Link>
          ) : (
            ""
          )}
        </div>
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
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <div className=" dashboard-box">
                        <div>
                          <h6 className="">Volume</h6>
                          {IsDashboardLoading ? (
                            <Spinners />
                          ) : GrossVolume?.data?.gross_volume ? (
                            <h3 className="mb-2 number-font">
                              <CountUp
                                end={GrossVolume?.data?.gross_volume}
                                separator=","
                                start={0}
                                duration={2.94}
                              />
                            </h3>
                          ) : (
                            <h3 className="mb-2 number-font">0124</h3>
                          )}

                          <p className="text-muted mb-0 mt-4">
                            <span className="text-primary me-1">
                              <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                              <span>3% </span>
                            </span>
                            last month
                          </p>
                        </div>
                        <div className="col col-auto">
                          <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                            <i className="icon icon-rocket text-white mb-5 "></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xl-4">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Gross Profit</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={56992}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-secondary me-1">
                          <i className="fa fa-chevron-circle-up text-secondary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                        <i className="icon icon-rocket text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
            <Col lg={6} md={12} sm={12} xl={4}>
              <Card className="card overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">Gross Margin</h6>
                      <h3 className="mb-2 number-font">
                        $
                        <CountUp
                          end={42567}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-success me-1">
                          <i className="fa fa-chevron-circle-down text-success me-1"></i>
                          <span>0.5% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-secondary-gradient box-shadow-secondary brround ms-auto">
                        <i className="fe fe-dollar-sign text-white mb-5 "></i>
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
        <Col className="col-sm-12 col-md-12 col-lg-12 col-xl-6">
          <Card>
            <Card.Header className="card-header">
              <h3 className="card-title">Total Transactions</h3>
            </Card.Header>
            <Card.Body className="card-body pb-0">
              <div id="chartArea" className="chart-donut">
                <ReactApexChart
                  options={dashboard.totalTransactions.options}
                  series={dashboard.totalTransactions.series}
                  type="area"
                  height={300}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={12} lg={12} xl={6}>
          <Row>
            <Col lg={6} md={12} sm={12} xl={6}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">COFFEE</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={34516}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-primary me-1">
                          <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                        <i className="fe fe-trending-up text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xl-6">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">LOTTERY SALES</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={56992}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-secondary me-1">
                          <i className="fa fa-chevron-circle-up text-secondary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                        <i className="icon icon-rocket text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12} xl={6}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">VALET</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={34516}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-primary me-1">
                          <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                        <i className="fe fe-trending-up text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xl-6">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">SHOP SALES</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={6992}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-secondary me-1">
                          <i className="fa fa-chevron-circle-up text-secondary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                        <i className="icon icon-rocket text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <Col lg={6} md={12} sm={12} xl={6}>
              <Card className=" overflow-hidden">
                <Card.Body className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">SHOP FACILITY FEE</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={3516}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-primary me-1">
                          <i className="fa fa-chevron-circle-up text-primary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-primary-gradient box-shadow-primary brround ms-auto">
                        <i className="fe fe-trending-up text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xl-6">
              <div className="card overflow-hidden">
                <div className="card-body">
                  <Row>
                    <div className="col">
                      <h6 className="">PAYPOINT SALES</h6>
                      <h3 className="mb-2 number-font">
                        <CountUp
                          end={15992}
                          separator=","
                          start={0}
                          duration={2.94}
                        />
                      </h3>
                      <p className="text-muted mb-0">
                        <span className="text-secondary me-1">
                          <i className="fa fa-chevron-circle-up text-secondary me-1"></i>
                          <span>3% </span>
                        </span>
                        last month
                      </p>
                    </div>
                    <div className="col col-auto">
                      <div className="counter-icon bg-danger-gradient box-shadow-danger brround  ms-auto">
                        <i className="icon icon-rocket text-white mb-5 "></i>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default withApi(Dashboard);
