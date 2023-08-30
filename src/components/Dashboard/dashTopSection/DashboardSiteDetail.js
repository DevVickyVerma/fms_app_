import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import DashBoardSubChild from "./DashBoardSubChild";
import { useMyContext } from "../../../Utils/MyContext";
import Loaderimg from "../../../Utils/Loader";

const DashboardSiteDetail = (props) => {
  const { apidata, isLoading, error, getData, postData, searchdata } = props;
  const { id } = useParams();
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [data, setData] = useState();
  const [getSiteStats, setGetSiteStats] = useState();
  const [getSiteDetails, setGetSiteDetails] = useState();

  const FetchTableData = async () => {
    try {
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      console.log("my search data in sub child site", searchdata);
      const companyId =
        searchdata?.company_id !== undefined ? searchdata.company_id : "";
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
    } catch (error) {
      console.error("API error:", error);
    }
    try {
      const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
      console.log("my search data in sub child site", searchdata);
      const companyId =
        searchdata?.company_id !== undefined ? searchdata.company_id : "";
      const siteID =
        searchdata?.site_id !== undefined ? searchdata.site_id : "";
      const response2 = await getData(
        localStorage.getItem("superiorRole") !== "Client"
          ? `/dashboard/get-site-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
          : `/dashboard/get-site-details?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
      );
      if (response2 && response2.data) {
        setGetSiteDetails(response2?.data?.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchTableData();
    window.scrollTo(0, 0);
  }, []);

  console.log("data after fetching", data);

  return (
    <div
    // style={{ height: "100vh ", overflowY: "auto", overflowX: "hidden" }}
    >
      {isLoading ? <Loaderimg /> : null}
      <DashBoardSubChild
        getSiteStats={getSiteStats}
        setGetSiteStats={setGetSiteStats}
        getSiteDetails={getSiteDetails}
        setGetSiteDetails={setGetSiteDetails}
      />
    </div>
  );
};

export default withApi(DashboardSiteDetail);
