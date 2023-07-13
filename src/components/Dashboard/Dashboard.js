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
import PieDashboardChart from "../../components/pages/DashBoardChart/PieDashboardChart";
import Spinners from "../../components/Dashboard/Spinner";

// import Loader from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";

const Dashboard = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [IsDashboardLoading, setIsDashboardLoading] = useState(true);
  const [GrossMarginValueLoading, setGrossMarginValueLoading] = useState(true);
  const [GrossProfitValueLoading, setGrossProfitValueLoading] = useState(true);
  const [GrossVolumeeLoading, setGrossVolumeeLoading] = useState(true);
  const [Loading, setLoading] = useState(true);
  const [FuelValueeLoading, setFuelValueeLoading] = useState(true);
  const [shopsaleLoading, setshopsaleLoading] = useState(true);
  const [shopmarginLoading, setshopmarginLoading] = useState(true);
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
    console.log(
      dashboard.totalTransactions.series,
      "dashboard.totalTransactions.series"
    );
    console.log(
      dashboard.totalTransactions.options,
      "dashboard.totalTransactions.serieswww"
    );
    Getlinegraph();
    piechart();
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
      handleError(error);
      console.error("API error:", error);
    }
  };

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const FetchGrossVolume = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/gross-volume?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/gross-volume?client_id=${ClientID}`
      );

      setGrossVolumeeLoading(true); // Set isLoading to true to indicate the loading state
      setLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        console.log(data);
        setGrossVolume(data);
      }

      setGrossVolumeeLoading(false); // Set isLoading to false after the API call is complete
      setLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);

      setGrossVolumeeLoading(false); // Set isLoading to false if there is an error
      setLoading(false); // Set isLoading to false if there is an error
    }
  };
  const Getlinegraph = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/line-graph?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/line-graph`
      );

      setLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        setLinechartValues(data?.data);
        console.log(data.data, "line graph");
      }
      // Set isLoading to false after the API call is complete
      setLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);

      // Set isLoading to false if there is an error
      setLoading(false); // Set isLoading to false if there is an error
    }
  };
  const piechart = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/pie-chart?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/pie-chart`
      );

      setLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        console.log(data, "piechart");
        console.log(data?.data, "piechartValues");
        setpiechartValues(data?.data);
      }
      // Set isLoading to false after the API call is complete
      setLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);

      // Set isLoading to false if there is an error
      setLoading(false); // Set isLoading to false if there is an error
    }
  };
  const FetchGrossProfit = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/gross-profit?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/gross-profit?client_id=${ClientID}`
      );

      setGrossProfitValueLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        setGrossProfitValue(data);
      }

      setGrossProfitValueLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setGrossProfitValueLoading(false); // Set isLoading to false if there is an error
    }
  };
  const Fetchgrossmargin = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/gross-margin?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/gross-margin?client_id=${ClientID}`
      );

      setGrossMarginValueLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        console.log(data);
      }

      setGrossMarginValueLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setGrossMarginValueLoading(false); // Set isLoading to false if there is an error
    }
  };
  const FetchFuelSales = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/fuel-sale?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/fuel-sale?client_id=${ClientID}`
      );

      setFuelValueeLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        setFuelValue(data);
      }

      setFuelValueeLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setFuelValueeLoading(false); // Set isLoading to false if there is an error
    }
  };
  const FetchShopSales = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/shop-sale?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/shop-sale?client_id=${ClientID}`
      );

      setshopsaleLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        setshopsale(data);
      }

      setshopsaleLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setshopsaleLoading(false); // Set isLoading to false if there is an error
    }
  };
  const FetchShopMargin = async (values) => {
    try {
      const response = await axiosInstance.get(
        values
          ? `dashboard/shop-margin?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}`
          : `/dashboard/shop-margin?client_id=${ClientID}`
      );

      setshopmarginLoading(true); // Set isLoading to true to indicate the loading state

      const { data } = response;
      if (data) {
        setshopmargin(data);
      }

      setshopmarginLoading(false); // Set isLoading to false after the API call is complete
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
      setshopmarginLoading(false); // Set isLoading to false if there is an error
    }
  };

  useEffect(() => {
    handleFetchData();
    FetchGrossVolume();
    FetchFuelSales();
    FetchGrossProfit();
    Fetchgrossmargin();
    FetchShopMargin();
    FetchShopSales();
  }, [ClientID]);

  const handleFormSubmit = async (values) => {
    console.log(values, "valuessss");
    setSearchdata(values);
    try {
      setLoading(true); // Set loading to true before making API calls

      await FetchGrossVolume(values);
      await handleFetchData(values);
      await FetchFuelSales(values);
      await FetchGrossProfit(values);
      await Fetchgrossmargin(values);
      await FetchShopMargin(values);
      await FetchShopSales(values);
      await piechart(values);
      await Getlinegraph(values);

      setLoading(false); // Set loading to false after API calls are completed
    } catch (error) {
      handleError(error);
      console.log(error); // Handle any errors that occurred during the API calls
      setLoading(false); // Make sure to set loading to false in case of error
    }
  };

  const ResetForm = async (values) => {
    try {
      setLoading(true);
      setSearchdata({});
      handleFetchData();
      FetchGrossVolume();
      FetchFuelSales();
      FetchGrossProfit();
      Fetchgrossmargin();
      FetchShopMargin();
      FetchShopSales();
    } catch (error) {
      handleError(error);
      console.log(error); // Handle any errors that occurred during the API calls
      setLoading(false); // Make sure to set loading to false in case of error
    }
  };

  return (
    <>
      {Loading ? <Loaderimg /> : null}
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
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
                            {GrossVolumeeLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <div className="d-flex">
                                  <div>
                                    <h6 className="">Gross Volume</h6>
                                    <h3 className="mb-2 number-font">
                                      {" "}
                                      ℓ{GrossVolume?.data?.gross_volume}
                                    </h3>
                                  </div>
                                  <div className="border-left"></div>
                                  <div className="ms-4">
                                    <h6 className="">Bunkered Volume</h6>
                                    <h3 className="mb-2 number-font">
                                  
                                      ℓ{GrossVolume?.data?.bunkered_volume}
                                    </h3>
                                  </div>
                                </div>

                                {/* <p className="p-0">Bunkered Volume</p> */}
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopmargin?.data?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {GrossVolume?.data?.status === "up" ? (
                                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                    ) : (
                                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                    )}
                                    <span>
                                      {GrossVolume?.data?.percentage}%
                                    </span>
                                  </span>
                                  last month
                                </p>
                              </>
                            )}
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
                        <div className=" dashboard-box">
                          <div>
                            <h6 className="">Gross Profit</h6>
                            {GrossProfitValueLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h3 className="mb-2 number-font">
                                  {" "}
                                  £{GrossProfitValue?.data?.gross_profit}
                                </h3>
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopmargin?.data?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {GrossProfitValue?.data?.status === "up" ? (
                                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                    ) : (
                                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                    )}
                                    <span>
                                      {GrossProfitValue?.data?.percentage}%
                                    </span>
                                  </span>
                                  last month
                                </p>
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
                <Card className="card overflow-hidden">
                  <Card.Body className="card-body">
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            <h6 className="">Gross Margin</h6>
                            {GrossMarginValueLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h3 className="mb-2 number-font">
                                  {" "}
                                  £{GrossProfitValue?.data?.gross_margin}
                                </h3>
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopmargin?.data?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {GrossProfitValue?.data?.status === "up" ? (
                                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                    ) : (
                                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                    )}
                                    <span>
                                      {GrossProfitValue?.data?.percentage}%
                                    </span>
                                  </span>
                                  last month
                                </p>
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
                <Card className=" overflow-hidden">
                  <Card.Body className="card-body">
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                          

                            {FuelValueeLoading ? (
                              <Spinners />
                            ) : (
                              <>
                           
                                <div className="d-flex">
                                  <div>
                                    <h6 className="">Fuel Sales</h6>
                                    <h3 className="mb-2 number-font">
                                   
                                      £{FuelValue?.data?.gross_value}
                                    </h3>
                                  </div>
                                  <div className="border-left"></div>
                                  <div className="ms-4">
                                    <h6 className="">Bunkered Volue</h6>
                                    <h3 className="mb-2 number-font">
                                  
                                    £{FuelValue?.data?.bunkered_value}
                                    </h3>
                                  </div>
                                </div>
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopmargin?.data?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {FuelValue?.data?.status === "up" ? (
                                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                    ) : (
                                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                    )}
                                    <span>{FuelValue?.data?.percentage}%</span>
                                  </span>
                                  last month
                                </p>
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
                <div className="card overflow-hidden">
                  <div className="card-body">
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            <h6 className="">Shop Sales</h6>
                            {shopsaleLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h3 className="mb-2 number-font">
                                  £{shopsale?.data?.shop_sales}
                                </h3>
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopmargin?.data?.status === "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {shopsale?.data?.status === "up" ? (
                                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                    ) : (
                                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                    )}
                                    <span>{shopsale?.data?.percentage}%</span>
                                  </span>
                                  last month
                                </p>
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
                <Card className="card overflow-hidden">
                  <Card.Body className="card-body">
                    <Row>
                      <div className="col">
                        <div className=" dashboard-box">
                          <div>
                            <h6 className="">Shop Margin</h6>
                            {shopmarginLoading ? (
                              <Spinners />
                            ) : (
                              <>
                                <h3 className="mb-2 number-font">
                                  £{shopmargin?.data?.shop_margin}
                                </h3>
                                <p className="text-muted mb-0 mt-4">
                                  <span
                                    className={`me-1 ${
                                      shopmargin?.data?.status == "up"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {shopmargin?.data?.status === "up" ? (
                                      <i className="fa fa-chevron-circle-up text-success me-1"></i>
                                    ) : (
                                      <i className="fa fa-chevron-circle-down text-danger me-1"></i>
                                    )}
                                    <span>{shopmargin?.data?.percentage}%</span>
                                  </span>
                                  last month
                                </p>
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

        <Row>
          <Col lg={7} md={12}>
            <Card>
              <Card.Header className="card-header">
                <h3 className="card-title">Total Transactions</h3>
              </Card.Header>
              <Card.Body className="card-body pb-0">
                <div id="chartArea" className="chart-donut">
                  <ReactApexChart
                    options={
                      dashboard &&
                      dashboard.totalTransactions &&
                      dashboard.totalTransactions.options
                    }
                    series={LinechartValues}
                    type="area"
                    height={300}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5} md={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Overall Stats</h3>
              </Card.Header>
              <Card.Body className="apexchart">
                <PieDashboardChart data={piechartValues} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(Dashboard);
