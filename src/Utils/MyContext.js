/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Device } from "@capacitor/device";
// Create the context
const MyContext = createContext();

// console.log();

// Create the provider component
const MyProvider = ({ children }) => {
  const [contextClients, setcontextClients] = useState([]);

  const [deviceInfo, setDeviceInfo] = useState(null);

  const [deviceType, setDeviceType] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = async () => {
      try {
        const info = await Device.getInfo();
        console.log(info, "deviceinfo");
        if (
          // info?.operatingSystem == "windows" ||
          // info?.operatingSystem == "android" ||
          // info?.operatingSystem == "unknown"
          info?.isVirtual
        ) {
          setIsMobile(false);
        } else {
          setIsMobile(true);
        }
        // Set platform directly
        setDeviceInfo(info);

        // Determine device type
        if (info.platform === "ios") {
          setDeviceType("iOS Device");
          document.documentElement.style.setProperty(
            "--font-family-sans-serif",
            '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", "Arial", sans-serif'
          );
          document.documentElement.style.setProperty(
            "--font-family-root",
            '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", "Arial", sans-serif'
          );
          document.documentElement.style.setProperty(
            "--font-family-monospace",
            '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", "Arial", sans-serif'
          );
        } else if (info.platform === "android") {
          setDeviceType("Android Device");
          document.documentElement.style.setProperty("--font-family-sans-serif", '"Nunito", sans-serif');
          document.documentElement.style.setProperty("--font-family-root", '"Nunito", sans-serif');
          document.documentElement.style.setProperty("--font-family-monospace", '"Nunito", sans-serif');

        } else if (info.platform === "web") {
          if (info.operatingSystem.toLowerCase().includes("windows")) {
            setDeviceType("Windows Device");
          } else {
            setDeviceType("Web Browser");
          }
        } else {
          document.documentElement.style.setProperty("--font-family-sans-serif", '"Nunito", sans-serif');
          document.documentElement.style.setProperty("--font-family-root", '"Nunito", sans-serif');
          document.documentElement.style.setProperty("--font-family-monospace", '"Nunito", sans-serif');


          setDeviceType("Unknown Device");
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
        setDeviceType("Error Detecting Device");
        setDeviceInfo("Unknown");
      }
    };

    const fetchClientList = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.REACT_APP_BASE_URL;

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/common/client-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        checkDevice();
        setcontextClients(response?.data?.data || []); // Assuming the client list is in `response.data.data`
      } catch (err) {
        console.log(
          err.response ? err.response.data.message : "Error fetching clients"
        );
      }
    };
    fetchClientList();
  }, []);

  const [searchdata, setSearchdata] = useState({});
  const [getSiteDetailsLoading, setGetSiteDetailsLoading] = useState(false);
  const [shouldNavigateToDetailsPage, setShouldNavigateToDetailsPage] =
    useState(false);
  const [getGradsSiteDetails, setGradsGetSiteDetails] = useState(null);
  const [dashboardShopSaleData, setDashboardShopSaleData] = useState(null);
  const [DashboardGradsLoading, setDashboardGradsLoading] = useState(false);
  const [DashboardSiteDetailsLoading, setDashboardSiteDetailsLoading] =
    useState(false);
  const [dashSubChildShopSaleLoading, setDashSubChildShopSaleLoading] =
    useState(false);
  // workflow Timer
  const [timeLeft, setTimeLeft] = useState(
    JSON.parse(localStorage.getItem("timeLeft"))
  );
  const [isTimerRunning, setIsTimerRunning] = useState(
    JSON.parse(localStorage.getItem("isTimerRunning"))
  );
  const [showSmallLoader, setshowSmallLoader] = useState(false);
  // Value object to provide to consumers
  const value = {
    searchdata,
    setSearchdata,
    getSiteDetailsLoading,
    setGetSiteDetailsLoading,
    shouldNavigateToDetailsPage,
    setShouldNavigateToDetailsPage,
    getGradsSiteDetails,
    setGradsGetSiteDetails,
    dashboardShopSaleData,
    setDashboardShopSaleData,
    DashboardGradsLoading,
    setDashboardGradsLoading,
    DashboardSiteDetailsLoading,
    setDashboardSiteDetailsLoading,
    dashSubChildShopSaleLoading,
    setDashSubChildShopSaleLoading,
    timeLeft,
    setTimeLeft,
    contextClients,
    setcontextClients,
    deviceInfo,
    setIsMobile,
    isMobile,
    setDeviceInfo,
    deviceType,
    setDeviceType,
    isTimerRunning,
    setIsTimerRunning,
    showSmallLoader,
    setshowSmallLoader,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// Custom hook to access the context
const useMyContext = () => useContext(MyContext);

export { MyProvider, useMyContext };
