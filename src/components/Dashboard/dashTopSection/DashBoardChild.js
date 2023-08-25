import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashTopSection from "./DashTopSection";
import DashTopTableSection from "./DashTopTableSection";
import { useMyContext } from "../../../Utils/MyContext";
import Loaderimg from "../../../Utils/Loader";
import { Box, Slide } from "@mui/material";
import DashBordModal from "../../../data/Modal/DashBordmodal";
import { toast } from "react-toastify";
import SortIcon from "@mui/icons-material/Sort";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const DashBoardChild = (props) => {
  const { isLoading, getData } = props;

  const [ShowTruw, setShowTruw] = useState(false);
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [SearchList, setSearchList] = useState(false);

  const navigate = useNavigate();
  const {
    searchdata,
    setSearchdata,
    testIsWorking,
    settestIsWorking,
    setGrossMarginValue,
    // GrossProfitValue,
    setGrossProfitValue,
    // FuelValue,
    setFuelValue,
    // GrossVolume,
    setGrossVolume,
    // shopsale,
    setshopsale,
    // shopmargin,
    setshopmargin,
    // GrossMarginValue,
  } = useMyContext();
  console.log("searched data in child ", searchdata.client_id);

  settestIsWorking(true);

  const storedData = localStorage.getItem("savedDataOfDashboard");
  const parsedData = JSON.parse(storedData);

  const GrossVolume = parsedData ? parsedData?.GrossVolume : null;
  const shopmargin = parsedData ? parsedData?.shopmargin : null;
  const GrossProfitValue = parsedData ? parsedData?.GrossProfitValue : null;
  const GrossMarginValue = parsedData ? parsedData?.GrossMarginValue : null;
  const FuelValue = parsedData ? parsedData?.FuelValue : null;
  const shopsale = parsedData ? parsedData?.shopsale : null;
  // const searchdata = parsedData ? parsedData?.searchdata : null;
  console.log(searchdata, "searchdata inside the child components");

  const handleToggleSidebar1 = () => {
    console.log(ShowTruw, "Toggle sidebar");
    console.log(sidebarVisible1, "Toggle sidebar");
    setShowTruw(true);
    setSidebarVisible1(!sidebarVisible1);
  };
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

  const handleFormSubmit = async (values) => {
    setSearchdata(values);
    localStorage.setItem("mySearchData", JSON.stringify(values));
    // console.log("my values while submitting", values);
    setSearchdata(localStorage.setItem("mySearchData", JSON.parse(values)));
    try {
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/stats?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}&end_date=${values.TOdate}&start_date=${values.fromdate}`
          : `dashboard/stats?client_id=${ClientID}&company_id=${values.company_id}&site_id=${values.site_id}&end_date=${values.TOdate}&start_date=${values.fromdate}`
      );

      const { data } = response;
      if (data) {
        setGrossMarginValue(data?.data?.gross_margin_);
        setGrossVolume(data?.data?.gross_volume);
        setGrossProfitValue(data?.data?.gross_profit);
        setFuelValue(data?.data?.fuel_sales);
        setshopsale(data?.data?.shop_sales);

        setshopmargin(data?.data?.shop_margin);

        const savedDataOfDashboard = {
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
        setGrossMarginValue(data?.data?.gross_margin_);
        setGrossVolume(data?.data?.gross_volume);
        setGrossProfitValue(data?.data?.gross_profit);
        setFuelValue(data?.data?.fuel_sales);
        setshopsale(data?.data?.shop_sales);
        setshopmargin(data?.data?.shop_margin);

        const savedDataOfDashboard = {
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

  const ResetForm = () => {
    setSearchdata({});
    handleFetchSiteData();
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      {/* latest CODE */}

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
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Dashboard Details
              </Breadcrumb.Item>
            </Breadcrumb>
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
                {Object?.entries(searchdata).map(([key, value]) => {
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

                {Object?.keys(searchdata)?.length > 0 ? (
                  <Link
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      ResetForm();
                    }}
                  >
                    Reset
                    <RestartAltIcon />
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
      </div>

      {/* previous CODE */}
      {/* <div className="page-header ">
        <div>
          <h1 className="page-title"> Dashboard Details </h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Dashboard Details
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div> */}

      <Row>
        <DashTopSection
          GrossVolume={GrossVolume}
          shopmargin={shopmargin}
          GrossProfitValue={GrossProfitValue}
          GrossMarginValue={GrossMarginValue}
          FuelValue={FuelValue}
          shopsale={shopsale}
          searchdata={searchdata}
        />
      </Row>

      {/* <Row> */}
      <DashTopTableSection searchdata={searchdata} />
      {/* </Row> */}
    </>
  );
};

export default DashBoardChild;
