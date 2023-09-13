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
import { useSelector } from "react-redux";

const DashBoardChild = (props) => {
  const { isLoading, getData } = props;

  const [ShowTruw, setShowTruw] = useState(false);
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [SearchList, setSearchList] = useState(false);
  // const [searchdata, setSearchdata] = useState({});

  const navigate = useNavigate();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const {
    searchdata,
    setSearchdata,
    testIsWorking,
    settestIsWorking,
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
    GrossMarginValue,
    piechartValues,
    setpiechartValues,
  } = useMyContext();

  // console.log(searchdata, "settestIsWorking");
  // console.log(GrossProfitValue, "settestIsWorking");

  settestIsWorking(true);

  const storedData = localStorage.getItem("savedDataOfDashboard");
  const parsedData = JSON.parse(storedData);

  const handleToggleSidebar1 = () => {
    // console.log(ShowTruw, "Toggle sidebar");
    // console.log(sidebarVisible1, "Toggle sidebar");
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
  const superiorRole = localStorage.getItem("superiorRole");

  const role = localStorage.getItem("role");
  const handleFormSubmit = async (values) => {
    // console.log(values, "handleFormSubmit");
    const companyId =
      values.company_id !== undefined
        ? values.company_id
        : localStorage.getItem("PresetCompanyID");

    try {
      // console.log(response, "response");
      const response = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `dashboard/stats?client_id=${values.client_id}&company_id=${companyId}&site_id=${values.site_id}`
          : `dashboard/stats?client_id=${ClientID}&company_id=${companyId}&site_id=${values.site_id}`
      );
      // console.log(response, "response");
      const { data } = response;
      if (data) {
        // console.log(data, "handleFormSubmit");
        setGrossMarginValue(data?.data?.gross_margin_);
        setGrossVolume(data?.data?.gross_volume);
        setGrossProfitValue(data?.data?.gross_profit);
        setFuelValue(data?.data?.fuel_sales);
        setshopsale(data?.data?.shop_sales);
        setpiechartValues(data?.data?.pi_graph);
        setshopmargin(data?.data?.shop_margin);
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }

    if (searchdata?.length > 0) {
      setSearchdata({});
    }
    setSearchdata(values);

    if (values.site_id) {
      // If site_id is present, set site_name to its value
      values.site_name = values.site_name || "";
    } else {
      // If site_id is not present, set site_name to an empty string
      values.site_name = "";
    }

    localStorage.setItem("mySearchData", JSON.stringify(values));

    console.log("mySearchData", values);
    setSearchdata(localStorage.setItem("mySearchData", JSON.parse(values)));
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
            <h1 className="page-title">Dashboard Details ({UserPermissions?.dates})</h1>
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
                <>
                  {Object.entries(searchdata).some(
                    ([key, value]) =>
                      [
                        "client_name",
                        "TOdate",
                        "company_name",
                        "site_name",
                        "fromdate",
                      ].includes(key) &&
                      value != null &&
                      value !== ""
                  ) ? (
                    Object.entries(searchdata).map(([key, value]) => {
                      if (
                        [
                          "client_name",
                          "TOdate",
                          "company_name",
                          "site_name",
                          "fromdate",
                        ].includes(key) &&
                        value != null &&
                        value !== ""
                      ) {
                        const formattedKey = key
                          .toLowerCase()
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        return (
                          <div key={key} className="badge">
                            <span className="badge-key">{formattedKey}:</span>
                            <span className="badge-value">{value}</span>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : superiorRole === "Client" && role !== "Client" ? (
                    <div className="badge">
                      <span className="badge-key">Company Name:</span>
                      <span className="badge-value">
                        {localStorage.getItem("PresetCompanyName")}
                      </span>
                    </div>
                  ) : null}
                </>
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
