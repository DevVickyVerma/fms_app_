import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import DashBoardSubChild from "./DashBoardSubChild";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import axios from "axios";
import { useMyContext } from "../../../Utils/MyContext";

const DashboardSiteDetail = (props) => {
  const { isLoading, getData } = props;
  const {
    getGradsSiteDetails,
    setGradsGetSiteDetails,
    dashboardShopSaleData,
    setDashboardShopSaleData,
  } = useMyContext();
  const { id } = useParams();
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [getSiteStats, setGetSiteStats] = useState(null);
  const [getSiteDetails, setGetSiteDetails] = useState(null);
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const [permissionsArray, setPermissionsArray] = useState([]);
  // const [getGradsSiteDetails, setGradsGetSiteDetails] = useState(null);

  const FetchTableData = async () => {
    try {
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
      let companyId = ""; // Define companyId outside the conditionals

      if (superiorRole === "Client" && role !== "Client") {
        companyId =
          searchdata?.company_id !== undefined
            ? searchdata.company_id
            : localStoragecompanyId;
      } else {
        companyId =
          searchdata?.company_id !== undefined ? searchdata.company_id : "";
      }
      const response1 = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `/dashboard/get-site-stats?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
          : `/dashboard/get-site-stats?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
      );

      if (response1 && response1.data) {
        if (response1?.data?.data?.siteInfo > 0) {
          localStorage.setItem("SiteDetailsModalShow", "true");
        } else {
          localStorage.setItem("SiteDetailsModalShow", "false");
        }
        setGetSiteStats(response1?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
    try {
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
      let companyId = ""; // Define companyId outside the conditionals

      if (superiorRole === "Client" && role !== "Client") {
        companyId =
          searchdata?.company_id !== undefined
            ? searchdata.company_id
            : localStoragecompanyId;
      } else {
        companyId =
          searchdata?.company_id !== undefined ? searchdata.company_id : "";
      }
      const response2 = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `/dashboard/get-site-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
          : `/dashboard/get-site-details?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
      );
      if (response2 && response2.data) {
        setGetSiteDetails(response2?.data?.data);
        // setGradsGetSiteDetails(response2?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
    try {
      if (localStorage.getItem("Dashboardsitestats") === "true") {
        try {
          // Attempt to parse JSON data from local storage
          const searchdata = await JSON.parse(
            localStorage.getItem("mySearchData")
          );
          const superiorRole = localStorage.getItem("superiorRole");
          const role = localStorage.getItem("role");
          const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
          let companyId = ""; // Define companyId outside the conditionals

          if (superiorRole === "Client" && role !== "Client") {
            // Set companyId based on conditions
            companyId =
              searchdata?.company_id !== undefined
                ? searchdata.company_id
                : localStoragecompanyId;
          } else {
            companyId =
              searchdata?.company_id !== undefined ? searchdata.company_id : "";
          }

          // Use async/await to fetch data
          const response3 = await getData(
            localStorage.getItem("superiorRole") !== "Client"
              ? `/dashboard/get-site-fuel-performance?site_id=${id}`
              : `/dashboard/get-site-fuel-performance?site_id=${id}`
          );

          if (response3 && response3.data) {
            setGradsGetSiteDetails(response3?.data?.data);
            // notify(response3?.data?.message);
            // setShowModal(false);
            // setShowDate(true);
          } else {
            throw new Error("No data available in the response");
          }
          // setGradsLoading(false);
        } catch (error) {
          // Handle errors that occur during the asynchronous operations
          // setGradsLoading(false);
        }
      }
    } catch (error) {
      // setGradsLoading(false);
    }
  };
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const [scrollY, setScrollY] = useState(0);
  const [alertShown, setAlertShown] = useState(false);
  const [callShopSaleApi, setCallShopSaleApi] = useState(false);
  const [Compititorloading, setCompititorloading] = useState(false);
  const [shopSaleLoading, setShopSaleLoading] = useState(false);
  const FetchCompititorData = async () => {
    setCompititorloading(true);
    if (localStorage.getItem("Dashboardsitestats") === "true") {
      try {
        const searchdata = await JSON.parse(
          localStorage.getItem("mySearchData")
        );
        const superiorRole = localStorage.getItem("superiorRole");
        const role = localStorage.getItem("role");
        const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
        let companyId = ""; // Define companyId outside the conditionals

        if (superiorRole === "Client" && role !== "Client") {
          // Set companyId based on conditions
          companyId =
            searchdata?.company_id !== undefined
              ? searchdata.company_id
              : localStoragecompanyId;
        } else {
          companyId =
            searchdata?.company_id !== undefined ? searchdata.company_id : "";
        }

        // Use async/await to fetch data
        const response3 = await axiosInstance.get(
          localStorage.getItem("superiorRole") !== "Client"
            ? `/dashboard/get-competitors-price?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
            : `/dashboard/get-competitors-price?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
        );

        if (response3 && response3.data) {
          setGetCompetitorsPrice(response3?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        // Handle errors that occur during the asynchronous operations
        console.error("API error:", error);
      } finally {
        // Set Compititorloading to false when the request is complete (whether successful or not)
        setCompititorloading(false);
      }
    }
  };

  const FetchShopSaleData = async () => {
    try {
      setShopSaleLoading(true);
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      const superiorRole = localStorage.getItem("superiorRole");
      const role = localStorage.getItem("role");
      const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
      let companyId = ""; // Define companyId outside the conditionals

      if (superiorRole === "Client" && role !== "Client") {
        companyId =
          searchdata?.company_id !== undefined
            ? searchdata.company_id
            : localStoragecompanyId;
      } else {
        companyId =
          searchdata?.company_id !== undefined ? searchdata.company_id : "";
      }

      const response2 = await axiosInstance.get(
        localStorage.getItem("superiorRole") !== "Client"
          ? `/dashboard/get-site-shop-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
          : `/dashboard/get-site-shop-details?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
      );

      if (response2 && response2.data) {
        setDashboardShopSaleData(response2?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setShopSaleLoading(false);
    }
  };

  useEffect(() => {
    FetchTableData();

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Function to update scrollY when scrolling occurs
    function handleScroll() {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY > 450 && !callShopSaleApi) {
        setCallShopSaleApi(true);
      }
      if (currentScrollY > 2800 && !alertShown) {
        setAlertShown(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [alertShown, callShopSaleApi]);
  useEffect(() => {
    if (alertShown) {
      // Call FetchCompititorData when alertShown becomes true
      FetchCompititorData();
    }
  }, [alertShown]);
  useEffect(() => {
    if (callShopSaleApi) {
      // Call FetchCompititorData when alertShown becomes true
      FetchShopSaleData();
    }
  }, [callShopSaleApi]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <div className="overflow-container">
        <DashBoardSubChild
          getSiteStats={getSiteStats}
          setGetSiteStats={setGetSiteStats}
          getSiteDetails={getSiteDetails}
          setGetSiteDetails={setGetSiteDetails}
          getCompetitorsPrice={getCompetitorsPrice}
          setGetCompetitorsPrice={setGetCompetitorsPrice}
          // getGradsSiteDetails={getGradsSiteDetails}
          // setGradsGetSiteDetails={setGradsGetSiteDetails}
        />
      </div>
    </>
  );
};

export default withApi(DashboardSiteDetail);
