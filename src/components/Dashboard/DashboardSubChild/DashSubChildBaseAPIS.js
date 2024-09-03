import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useMyContext } from "../../../Utils/MyContext";
import { handleError } from "../../../Utils/ToastUtils";
import DashSubChild from "./DashSubChild";

const DashSubChildBaseAPIS = (props) => {
  const { isLoading, getData } = props;
  const {
    setGradsGetSiteDetails,
    setDashboardShopSaleData,
    setDashboardGradsLoading,
    setDashboardSiteDetailsLoading,
    dashSubChildShopSaleLoading,
    setDashSubChildShopSaleLoading,
  } = useMyContext();
  const { id } = useParams();
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const [getSiteStats, setGetSiteStats] = useState(null);
  const [getSiteDetails, setGetSiteDetails] = useState(null);
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const [permissionsArray, setPermissionsArray] = useState([]);
  const [CompititorStats, setCompititorStats] = useState("");




  const FetchTableData = async (filters) => {
    let { client_id, company_id, site_id, client_name } = filters;

    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
      client_name = localStorage.getItem("First_name");
    }

    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append('client_id', client_id);
        if (company_id) queryParams.append('company_id', company_id);
        queryParams.append('site_id', id);

        const queryString = queryParams.toString();
        const response = await getData(`dashboard/get-site-stats?${queryString}`);
        if (response && response.data) {
          if (response?.data?.data?.siteInfo > 0) {
            localStorage.setItem("SiteDetailsModalShow", "true");
          } else {
            localStorage.setItem("SiteDetailsModalShow", "false");
          }
          setGetSiteStats(response?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        handleError(error)
      } finally {
      }
    }
  };


  const FetchGetSiteDetailsApi = async (filters) => {
    let { client_id, company_id, site_id, client_name } = filters;

    setDashboardSiteDetailsLoading(true);
    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
      client_name = localStorage.getItem("First_name");
    }

    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append('client_id', client_id);
        if (company_id) queryParams.append('company_id', company_id);
        queryParams.append('site_id', id);

        const queryString = queryParams.toString();
        const response2 = await axiosInstance.get(`dashboard/get-site-details?${queryString}`);
        if (response2 && response2.data) {
          setGetSiteDetails(response2?.data?.data);
          setDashboardSiteDetailsLoading(false);
        } else {
          setDashboardSiteDetailsLoading(false);
          throw new Error("No data available in the response");
        }
      } catch (error) {
        setDashboardSiteDetailsLoading(false);
        handleError(error)
      }
    }
  };

  // const FetchTableData = async () => {
  //   try {
  //     const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
  //     const superiorRole = localStorage.getItem("superiorRole");
  //     const role = localStorage.getItem("role");
  //     const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
  //     let companyId = ""; // Define companyId outside the conditionals

  //     if (superiorRole === "Client" && role !== "Client") {
  //       companyId =
  //         searchdata?.company_id !== undefined
  //           ? searchdata.company_id
  //           : localStoragecompanyId;
  //     } else {
  //       companyId =
  //         searchdata?.company_id !== undefined ? searchdata.company_id : "";
  //     }
  //     const response1 = await getData(
  //       localStorage.getItem("superiorRole") !== "Client"
  //         ? `/dashboard/get-site-stats?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
  //         : `/dashboard/get-site-stats?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
  //     );

  //     if (response1 && response1.data) {
  //       if (response1?.data?.data?.siteInfo > 0) {
  //         localStorage.setItem("SiteDetailsModalShow", "true");
  //       } else {
  //         localStorage.setItem("SiteDetailsModalShow", "false");
  //       }
  //       setGetSiteStats(response1?.data);
  //     } else {
  //       throw new Error("No data available in the response");
  //     }
  //   } catch (error) {
  //     handleError(error);
  //     console.error("API error:", error);
  //   }
  // };

  // const FetchGetSiteDetailsApi = async () => {
  //   setDashboardSiteDetailsLoading(true);
  //   try {
  //     const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
  //     const superiorRole = localStorage.getItem("superiorRole");
  //     const role = localStorage.getItem("role");
  //     const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
  //     let companyId = ""; // Define companyId outside the conditionals

  //     if (superiorRole === "Client" && role !== "Client") {
  //       companyId =
  //         searchdata?.company_id !== undefined
  //           ? searchdata.company_id
  //           : localStoragecompanyId;
  //     } else {
  //       companyId =
  //         searchdata?.company_id !== undefined ? searchdata.company_id : "";
  //     }
  //     const response2 = await axiosInstance.get(
  //       localStorage.getItem("superiorRole") !== "Client"
  //         ? `/dashboard/get-site-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
  //         : `/dashboard/get-site-details?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
  //     );

  //     if (response2 && response2.data) {
  //       setGetSiteDetails(response2?.data?.data);
  //       setDashboardSiteDetailsLoading(false);
  //     } else {
  //       setDashboardSiteDetailsLoading(false);
  //       throw new Error("No data available in the response");
  //     }
  //   } catch (error) {
  //     setDashboardSiteDetailsLoading(false);
  //     console.error("API error:", error);
  //     handleError(error);
  //   }
  //   setDashboardSiteDetailsLoading(false);
  // };


  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const [scrollY, setScrollY] = useState(0);
  const [callShopSaleApi, setCallShopSaleApi] = useState(false);
  const [callSiteFuelPerformanceApi, setCallSiteFuelPerformanceApi] =
    useState(false);



  const FetchShopSaleData = async (filters) => {
    let { client_id, company_id, site_id, client_name } = filters;

    setDashSubChildShopSaleLoading(true);
    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
      client_name = localStorage.getItem("First_name");
    }

    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        if (client_id) queryParams.append('client_id', client_id);
        if (company_id) queryParams.append('company_id', company_id);
        queryParams.append('site_id', id);

        const queryString = queryParams.toString();
        const response2 = await axiosInstance.get(`dashboard/get-site-shop-details?${queryString}`);
        if (response2 && response2.data) {
          setDashboardShopSaleData(response2?.data?.data);
          setDashSubChildShopSaleLoading(false);
        } else {
          setDashSubChildShopSaleLoading(false);
          throw new Error("No data available in the response");
        }
      } catch (error) {
        setDashSubChildShopSaleLoading(false);
        handleError(error)
      }
    }
  };

  const FetchSiteFuelPerformanceData = async (filters) => {

    setDashboardGradsLoading(true);
    // Check if the role is Client, then set the client_id and client_name from local storage


    try {
      const queryParams = new URLSearchParams();
      queryParams.append('site_id', id);

      const queryString = queryParams.toString();
      const response3 = await axiosInstance.get(`dashboard/get-site-fuel-performance?${queryString}`);
      if (response3 && response3.data) {
        setGradsGetSiteDetails(response3?.data?.data);
        setDashboardGradsLoading(false);
      } else {
        throw new Error("No data available in the response");
      }
      setDashboardGradsLoading(false);
    } catch (error) {
      setDashboardGradsLoading(false);
      handleError(error)
    }
  };

  // const FetchShopSaleData = async () => {
  //   try {
  //     setDashSubChildShopSaleLoading(true);
  //     const searchdata = await JSON.parse(localStorage.getItem("mySearchData"));
  //     const superiorRole = localStorage.getItem("superiorRole");
  //     const role = localStorage.getItem("role");
  //     const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
  //     let companyId = ""; // Define companyId outside the conditionals

  //     if (superiorRole === "Client" && role !== "Client") {
  //       companyId =
  //         searchdata?.company_id !== undefined
  //           ? searchdata.company_id
  //           : localStoragecompanyId;
  //     } else {
  //       companyId =
  //         searchdata?.company_id !== undefined ? searchdata.company_id : "";
  //     }

  //     const response2 = await axiosInstance.get(
  //       localStorage.getItem("superiorRole") !== "Client"
  //         ? `/dashboard/get-site-shop-details?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
  //         : `/dashboard/get-site-shop-details?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
  //     );

  //     if (response2 && response2.data) {
  //       setDashboardShopSaleData(response2?.data?.data);
  //       setDashSubChildShopSaleLoading(false);
  //     } else {
  //       setDashSubChildShopSaleLoading(false);
  //       throw new Error("No data available in the response");
  //     }
  //   } catch (error) {
  //     console.error("API error:", error);
  //     setDashSubChildShopSaleLoading(false);
  //     handleError(error);
  //   } finally {
  //     setDashSubChildShopSaleLoading(false);
  //   }
  //   setDashSubChildShopSaleLoading(false);
  // };

  // const FetchSiteFuelPerformanceData = async () => {
  //   setDashboardGradsLoading(true);
  //   try {
  //     if (localStorage.getItem("Dashboardsitestats") === "true") {
  //       try {
  //         // Attempt to parse JSON data from local storage
  //         const searchdata = await JSON.parse(
  //           localStorage.getItem("mySearchData")
  //         );
  //         const superiorRole = localStorage.getItem("superiorRole");
  //         const role = localStorage.getItem("role");
  //         const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
  //         let companyId = ""; // Define companyId outside the conditionals

  //         if (superiorRole === "Client" && role !== "Client") {
  //           // Set companyId based on conditions
  //           companyId =
  //             searchdata?.company_id !== undefined
  //               ? searchdata.company_id
  //               : localStoragecompanyId;
  //         } else {
  //           companyId =
  //             searchdata?.company_id !== undefined ? searchdata.company_id : "";
  //         }

  //         // Use async/await to fetch data

  //         const response3 = await axiosInstance.get(
  //           localStorage.getItem("superiorRole") !== "Client"
  //             ? `/dashboard/get-site-fuel-performance?site_id=${id}`
  //             : `/dashboard/get-site-fuel-performance?site_id=${id}`
  //         );

  //         if (response3 && response3.data) {
  //           setGradsGetSiteDetails(response3?.data?.data);
  //           setDashboardGradsLoading(false);
  //         } else {
  //           throw new Error("No data available in the response");
  //         }
  //         setDashboardGradsLoading(false);
  //       } catch (error) {
  //         // Handle errors that occur during the asynchronous operations
  //         setDashboardGradsLoading(false);
  //       }
  //     }
  //   } catch (error) {
  //     setDashboardGradsLoading(false);
  //     handleError(error);
  //   }
  //   setDashboardGradsLoading(false);
  // };

  // useEffect(() => {
  //   // FetchTableData();
  //   // FetchGetSiteDetailsApi();
  //   window.scrollTo(0, 0);
  // }, []);

  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);
  const dispatch = useDispatch();


  useEffect(() => {
    if (storedData) {
      FetchTableData(JSON.parse(storedData));
      FetchGetSiteDetailsApi(JSON.parse(storedData));
    }

    window.scrollTo(0, 0);

  }, [dispatch, storedKeyName,]); // Add any other dependencies needed here


  useEffect(() => {
    // Function to update scrollY when scrolling occurs
    function handleScroll() {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      if (currentScrollY > 150 && !callSiteFuelPerformanceApi) {
        setCallSiteFuelPerformanceApi(true);
      }

      if (currentScrollY > 250 && !callShopSaleApi) {
        setCallShopSaleApi(true);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [callShopSaleApi, callSiteFuelPerformanceApi]);

  useEffect(() => {
    if (callShopSaleApi) {
      // Call FetchCompititorData when alertShown becomes true
      if (storedData) {
        FetchShopSaleData(JSON.parse(storedData));
      }
    }
  }, [callShopSaleApi]);
  useEffect(() => {
    if (callSiteFuelPerformanceApi) {
      // Call FetchCompititorData when alertShown becomes true
      if (storedData) {
        FetchSiteFuelPerformanceData(JSON.parse(storedData));
      }
    }
  }, [callSiteFuelPerformanceApi]);

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
        <DashSubChild
          getSiteStats={getSiteStats}
          setGetSiteStats={setGetSiteStats}
          getSiteDetails={getSiteDetails}
          setGetSiteDetails={setGetSiteDetails}
          getCompetitorsPrice={getCompetitorsPrice}
          setGetCompetitorsPrice={setGetCompetitorsPrice}
          CompititorStats={CompititorStats}
          statsID={id}
        />
      </div>
    </>
  );
};

export default withApi(DashSubChildBaseAPIS);
