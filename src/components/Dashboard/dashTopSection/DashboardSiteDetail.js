import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import DashBoardSubChild from "./DashBoardSubChild";
import { useMyContext } from "../../../Utils/MyContext";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";

const DashboardSiteDetail = (props) => {
  const {
    isLoading,
    getData,
  } = props;
  const { id } = useParams();
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [data, setData] = useState();
  const [getSiteStats, setGetSiteStats] = useState(null);
  const [getSiteDetails, setGetSiteDetails] = useState(null);
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const [permissionsArray, setPermissionsArray] = useState([]);
  const [getGradsSiteDetails, setGradsGetSiteDetails] = useState(null)

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
        setGetSiteStats(response1?.data);
      } else {
        throw new Error("No data available in the response");
      }
      // setIsLoadingState(false);
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
        setGradsGetSiteDetails(response2?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }

    // 3rd api
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
            ? `/dashboard/get-competitors-price?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
            : `/dashboard/get-competitors-price?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
        );

        if (response3 && response3.data) {
          // Set data using setGetCompetitorsPrice
          setGetCompetitorsPrice(response3?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        // Handle errors that occur during the asynchronous operations
        console.error("API error:", error);
      }
    }
  };

  useEffect(() => {
    FetchTableData();
    window.scrollTo(0, 0);

  }, []);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const headerHeight = 135;

  const containerStyles = {
    overflowY: "scroll", // or 'auto'
    overflowX: "hidden", // or 'auto'
    maxHeight: `calc(100vh - ${headerHeight}px)`,
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div
        className="overflow-container"
        style={containerStyles}
      >
        <DashBoardSubChild
          getSiteStats={getSiteStats}
          setGetSiteStats={setGetSiteStats}
          getSiteDetails={getSiteDetails}
          setGetSiteDetails={setGetSiteDetails}
          getCompetitorsPrice={getCompetitorsPrice}
          setGetCompetitorsPrice={setGetCompetitorsPrice}
          getGradsSiteDetails={getGradsSiteDetails}
          setGradsGetSiteDetails={setGradsGetSiteDetails}
        />
      </div>
    </>
  );
};

export default withApi(DashboardSiteDetail);
