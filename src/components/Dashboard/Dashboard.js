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
import DashTopSection from "./dashTopSection/DashTopSection";
import DashTopTableSection from "./dashTopSection/DashTopTableSection";
import { Box } from "@material-ui/core";
import { useMyContext } from "../../Utils/MyContext";
import CenterFilterModal from "../../data/Modal/CenterFilterModal";
import CenterSearchmodal from "../../data/Modal/CenterSearchmodal";
import StackedLineBarChart from "./StackedLineBarChart";

const Dashboard = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [sidebarVisible1, setSidebarVisible1] = useState(true);

  const [ShowTruw, setShowTruw] = useState(false);
  const [ClientID, setClientID] = useState();
  // const [searchdata, setSearchdata] = useState({});
  const [SearchList, setSearchList] = useState(false);

  const [myData, setMyData] = useState();
  let LinechartOptions = [];

  const {
    searchdata,
    setSearchdata,
    GrossMarginValue,
    setGrossMarginValue,
    GrossProfitValue,
    setGrossProfitValue,
    FuelValue,
    setFuelValue,
    GrossVolume,
    setGrossVolume,
    shopsale,
    setshopsale,
    shopmargin,
    setshopmargin,
    piechartValues,
    setpiechartValues,
    LinechartValues,
    setLinechartValues,
    LinechartOption,
    setLinechartOption,
    DLinechartValues,
    setDLinechartValues,
    DLinechartOption,
    setDLinechartOption,
  } = useMyContext();

  // console.log("search list in dashboard: ", SearchList);
  console.log("search data in dashboard: ", searchdata);
  const superiorRole = localStorage.getItem("superiorRole");
  const handleFetchSiteData = async () => {
    try {
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      let url = "";
      if (superiorRole === "Administrator") {
        url = "/dashboard/stats";
      } else if (superiorRole === "Client") {
        url = `/dashboard/stats?client_id=${ClientID}`;
      } else if (superiorRole === "Client" && role === "Operator") {
        url = "/dashboard/stats";
      }

      const response = await getData(url);
      const { data } = response;
      // console.log("my response: " ,data);

      if (data) {
        LinechartOptions = data?.data?.line_graph?.option?.labels;

        setLinechartValues(data?.data?.line_graph?.series);
        setDLinechartValues(data?.data?.d_line_graph?.series);
        setLinechartOption(data?.data?.line_graph?.option?.labels);
        setDLinechartOption(data?.data?.d_line_graph?.option?.labels);

        setpiechartValues(data?.data?.pi_graph);
        setGrossMarginValue(data?.data?.gross_margin_);
        setGrossVolume(data?.data?.gross_volume);
        setGrossProfitValue(data?.data?.gross_profit);
        setFuelValue(data?.data?.fuel_sales);
        setshopsale(data?.data?.shop_sales);
        setshopmargin(data?.data?.shop_margin);

        const savedDataOfDashboard = {
          LinechartValues: data?.data?.line_graph?.series,
          DLinechartValues: data?.data?.d_line_graph?.series,
          LinechartOption: data?.data?.line_graph?.option?.labels,
          DLinechartOption: data?.data?.d_line_graph?.option?.labels,
          GrossMarginValue: data?.data?.gross_margin_,
          GrossVolume: data?.data?.gross_volume,
          GrossProfitValue: data?.data?.gross_profit,
          FuelValue: data?.data?.fuel_sales,
          shopsale: data?.data?.shop_sales,
          shopmargin: data?.data?.shop_margin,
        };
        // Save the data object to local storage
        localStorage.setItem(
          "savedDataOfDashboard",
          JSON.stringify(savedDataOfDashboard)
        );
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }
  };
  // console.log("pi chart values", piechartValues);
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

  const handleToggleSidebar1 = () => {
    console.log(ShowTruw, "Toggle sidebar");
    console.log(sidebarVisible1, "Toggle sidebar");
    setShowTruw(true);
    setSidebarVisible1(!sidebarVisible1);
  };

  const handleFormSubmit = async (values) => {
    setSearchdata(values);
    localStorage.setItem("mySearchData", JSON.stringify(values));
    console.log("submitting", values);

    try {
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/stats?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}&end_date=${values.TOdate}&start_date=${values.fromdate}`
          : `dashboard/stats?client_id=${ClientID}&company_id=${values.company_id}&site_id=${values.site_id}&end_date=${values.TOdate}&start_date=${values.fromdate}`
      );

      const { data } = response;
      console.log("data my for pi", data);
      if (data) {
        LinechartOptions = data?.data?.line_graph?.option?.labels;

        setLinechartValues(data?.data?.line_graph?.series);
        setDLinechartValues(data?.data?.d_line_graph?.series);
        setLinechartOption(data?.data?.line_graph?.option?.labels);
        setDLinechartOption(data?.data?.d_line_graph?.option?.labels);

        setGrossMarginValue(data?.data?.gross_margin_);
        setLinechartValues(data?.data?.line_graph?.series);
        setpiechartValues(data?.data?.pi_graph);
        setGrossVolume(data?.data?.gross_volume);
        setGrossProfitValue(data?.data?.gross_profit);
        setFuelValue(data?.data?.fuel_sales);
        setshopsale(data?.data?.shop_sales);

        setshopmargin(data?.data?.shop_margin);

        const savedDataOfDashboard = {
          LinechartValues: data?.data?.line_graph?.series,
          DLinechartValues: data?.data?.d_line_graph?.series,
          LinechartOption: data?.data?.line_graph?.series,
          DLinechartOption: data?.data?.d_line_graph?.series,
          GrossMarginValue: data?.data?.gross_margin_,
          GrossVolume: data?.data?.gross_volume,
          GrossProfitValue: data?.data?.gross_profit,
          FuelValue: data?.data?.fuel_sales,
          shopsale: data?.data?.shop_sales,
          shopmargin: data?.data?.shop_margin,
        };
        // Save the data object to local storage
        localStorage.setItem(
          "savedDataOfDashboard",
          JSON.stringify(savedDataOfDashboard)
        );
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }
  };

  const [isLoadingState, setIsLoading] = useState(false);
  const ResetForm = () => {
    // Set isLoading to true when the button is clicked
    console.log("ResetForm called");
    console.log("isLoading state:", isLoading);
    setIsLoading(true);

    setSearchdata({});
    localStorage.removeItem("savedDataOfDashboard");
    localStorage.removeItem("mySearchData");

    if (superiorRole !== "Administrator") {
      // Assuming handleFetchSiteData is an asynchronous function
      handleFetchSiteData()
        .then(() => {
          // After the data is fetched, set isLoading to false
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        })
        .catch((error) => {
          // Handle error and set isLoading to false
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          console.log("isLoading state:", isLoading);
        });
    } else {
      // Assuming these functions are synchronous
      setLinechartValues();
      setLinechartOption();
      setDLinechartValues();
      setDLinechartOption();
      setpiechartValues();
      setGrossMarginValue();
      setGrossVolume();
      setGrossProfitValue();
      setFuelValue();
      setshopsale();
      setshopmargin();

      // Set isLoading to false after performing necessary actions
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      console.log("isLoading state:", isLoading);
    }
  };

  // console.log("pi bunkerd sales",data.pi_graph.bunkered_sales);
  const piechartValuesss = {
    shop_sales: piechartValues?.shop_sales,
    fuel_sales: piechartValues?.fuel_sales,
    bunkered_sales: piechartValues?.bunkered_sales,
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
    navigate(UserPermissions?.route);
  }, [UserPermissions]);
  const isStatusPermissionAvailable =
    permissionsArray?.includes("dashboard-view");

  useEffect(() => {
    if (token && storedToken) {
      dispatch(fetchData());
    }
    console.clear();
  }, [token]);

  useEffect(() => {
    if (Object.keys(searchdata).length === 0) {
      localStorage.removeItem("mySearchData");
    }
    if (isStatusPermissionAvailable && superiorRole !== "Administrator") {
      handleFetchSiteData();
    }
    console.clear();
    console.log("my search data on dashboard", searchdata);
  }, [permissionsArray]);

  return (
    <>
      {isLoading || isLoadingState ? <Loaderimg /> : null}

      <div>
        {/* <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}> */}
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          minHeight={"90px"}
          className="center-filter-modal-responsive"
          //  className="page-header "
        >
          <Box alignSelf={"flex-start"} mt={"33px"}>
            <h1 className="page-title">Dashboard</h1>
            {/* <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Dashboard
              </Breadcrumb.Item>
            </Breadcrumb> */}
          </Box>

          {localStorage.getItem("superiorRole") === "Client" &&
          localStorage.getItem("role") === "Operator" ? (
            ""
          ) : (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"baseline"}
              my={"20px"}
              gap={"5px"}
              mx={"10px"}
              flexDirection={"inherit"}
              className="filter-responsive"
              // className="ms-auto pageheader-btn "
            >
              <span
                className="Search-data"
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  gap: "5px",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
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
              <Box display={"flex"} ml={"4px"} alignSelf={"center"}>
                <Link
                  className="btn btn-primary"
                  onClick={() => {
                    handleToggleSidebar1();
                  }}
                  // onClick={setShowTruw(true)}
                  title="filter"
                  visible={sidebarVisible1}
                  onClose={handleToggleSidebar1}
                  onSubmit={handleFormSubmit}
                  searchListstatus={SearchList}
                >
                  Filter
                  <span className="ms-2">
                    <SortIcon />
                  </span>
                </Link>

                {/* <Link >
              <CenterFilterModal
                title="filter"
                visible={sidebarVisible1}
                onClick={() => {
                  handleToggleSidebar1();
                }}
                onClose={handleToggleSidebar1}
                onSubmit={handleFormSubmit}
                searchListstatus={SearchList}
                // sendDataToParent={handleDataFromChild}
              />
            </Link> */}

                {/* 
                <Link
                  className="btn btn-primary sbsbo"
                  onClick={() => {
                    handleToggleSidebar1();
                  }}
                >
                  <DashBordModal
                    title="Filter"
                    visible={sidebarVisible1}
                    onClick={() => {
                      handleToggleSidebar1();
                    }}
                    onClose={handleToggleSidebar1}
                    onSubmit={handleFormSubmit}
                    searchListstatus={SearchList}
                    // title="Search"
                    // visible={sidebarVisible1}
                    // onClose={handleToggleSidebar1}
                    // onSubmit={handleFormSubmit}
                    // searchListstatus={SearchList}
                  />
                </Link> */}

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
              </Box>
            </Box>
          )}
        </Box>

        {ShowTruw ? (
          <DashBordModal
            title="Search"
            visible={sidebarVisible1}
            onClose={handleToggleSidebar1}
            onSubmit={handleFormSubmit}
            searchListstatus={SearchList}
            onClick={() => {
              handleToggleSidebar1();
            }}
          />
        ) : (
          ""
        )}

        {localStorage.getItem("superiorRole") === "Administrator" &&
        Object.keys(searchdata).length === 0 ? (
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
            Please Select Values from Filter.....
          </div>
        ) : (
          ""
        )}

        <DashTopSection
          GrossVolume={GrossVolume}
          shopmargin={shopmargin}
          GrossProfitValue={GrossProfitValue}
          GrossMarginValue={GrossMarginValue}
          FuelValue={FuelValue}
          shopsale={shopsale}
          searchdata={searchdata}
        />

        {/* <DashTopTableSection  />          */}

        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Col lg={7} md={12}>
            <Card>
              <Card.Header className="card-header">
                <h4 className="card-title">Total Transactions</h4>
              </Card.Header>
              <Card.Body className="card-body pb-0">
                <div id="chart">
                  {/* <LineChart
                    LinechartValues={LinechartValues}
                    LinechartOption={LinechartOption}
                  /> */}
                  <StackedLineBarChart />
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
                <BarChart piechartValues={piechartValuesss} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
          <Col lg={12} md={12}>
            <Card>
              <Card.Header className="card-header">
                <h4 className="card-title">Total Transactions</h4>
              </Card.Header>
              <Card.Body className="card-body pb-0">
                <div id="chart">
                  {/* <LineChart
                    LinechartValues={DLinechartValues}
                    LinechartOption={DLinechartOption}
                  /> */}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(Dashboard);
