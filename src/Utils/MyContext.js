import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
const MyContext = createContext();

// Create the provider component
const MyProvider = ({ children }) => {
  const [contextClients, setcontextClients] = useState([]);
  const [setLoading] = useState(true);
  const [ setError] = useState(null);

  useEffect(() => {
    const fetchClientList = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.REACT_APP_BASE_URL;

      if (!token) {
        setError("Token not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/common/client-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setcontextClients(response?.data?.data || []); // Assuming the client list is in `response.data.data`
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClientList();
  }, []);


  const [searchdata, setSearchdata] = useState({});
  const [getSiteDetailsLoading, setGetSiteDetailsLoading] = useState(false)
  const [shouldNavigateToDetailsPage, setShouldNavigateToDetailsPage] = useState(false);
  const [getGradsSiteDetails, setGradsGetSiteDetails] = useState(null);
  const [dashboardShopSaleData, setDashboardShopSaleData] = useState(null);
  const [DashboardGradsLoading, setDashboardGradsLoading] = useState(false);
  const [DashboardSiteDetailsLoading, setDashboardSiteDetailsLoading] = useState(false);
  const [dashSubChildShopSaleLoading, setDashSubChildShopSaleLoading] = useState(false);
  // workflow Timer
  const [timeLeft, setTimeLeft] = useState(JSON.parse(
    localStorage.getItem("timeLeft")
  ));
  const [isTimerRunning, setIsTimerRunning] = useState(JSON.parse(
    localStorage.getItem("isTimerRunning")
  ));

  // Value object to provide to consumers
  const value = {
    searchdata,
    setSearchdata,
    getSiteDetailsLoading,
    setGetSiteDetailsLoading,
    shouldNavigateToDetailsPage, setShouldNavigateToDetailsPage,
    getGradsSiteDetails, setGradsGetSiteDetails,
    dashboardShopSaleData, setDashboardShopSaleData,
    DashboardGradsLoading, setDashboardGradsLoading,
    DashboardSiteDetailsLoading, setDashboardSiteDetailsLoading,
    dashSubChildShopSaleLoading, setDashSubChildShopSaleLoading,
    timeLeft, setTimeLeft,
    contextClients, setcontextClients,
    isTimerRunning, setIsTimerRunning,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// Custom hook to access the context
const useMyContext = () => {
  return useContext(MyContext);
};

export { MyProvider, useMyContext };
