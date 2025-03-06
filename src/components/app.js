import { Fragment, useEffect, useRef, useState } from "react";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/SideBar/SideBar";
import Footer from "../layouts/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import TabToTop from "../layouts/TabToTop/TabToTop";
import TopLoadingBar from "react-top-loading-bar";
import Swal from "sweetalert2";
import withApi from "../Utils/ApiHelper";
import { MyProvider } from "../Utils/MyContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../Redux/dataSlice";
import BlankDashboard from "./Dashboard/BlankDashboard";
import "phosphor-icons/src/css/icons.css"; // Import Phosphor Icons CSS
import { NavigationProvider } from "../Utils/NavigationProvider";
import { setupIonicReact } from "@ionic/react";
import { isPlatform } from "@ionic/react";
import { getPlatforms } from "@ionic/react";
import { Device } from "@capacitor/device";
import { PushNotifications } from "@capacitor/push-notifications";

setupIonicReact();
const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    checkDevice();
  }, []);
  const loadingBarRef = useRef();
  const location = useLocation();
  const simulateLoadingAndNavigate = () => {
    loadingBarRef?.current?.continuousStart();
    setTimeout(() => {
      loadingBarRef?.current?.complete();
    }, 50);
  };

  useEffect(() => {
    simulateLoadingAndNavigate();
    //
  }, [location.pathname]);
  const [autoLogout] = useState(localStorage.getItem("auto_logout"));

  const dispatch = useDispatch();
  const GetDetails = async () => {
    dispatch(fetchData());
  };

  useEffect(() => {
    GetDetails();
    //
  }, []);

  const [isInactive, setIsInactive] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [logoutTime, setLogoutTime] = useState(autoLogout * 60000); // Initialize logoutTime with the initial value

  let inactivityTimeout;

  const handleUserActivity = () => {
    clearTimeout(inactivityTimeout);
    setIsInactive(false);
    inactivityTimeout = setTimeout(() => setIsInactive(true), logoutTime);
  };
  const [plateform, setPlateform] = useState();
  const currentPlatforms = getPlatforms();

  useEffect(() => {
    if (currentPlatforms.includes("android")) {
      setPlateform("Android");

    } else if (currentPlatforms.includes("ios")) {
      setPlateform("iOS");

    } else {
      setPlateform("Web");

    }
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);

    inactivityTimeout = setTimeout(() => setIsInactive(true), logoutTime);

    //
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      clearTimeout(inactivityTimeout);
    };
  }, [logoutTime]);

  const handleConfirm = () => {
    localStorage.clear();
    window.location.replace("/");
  };

  useEffect(() => {
    if (isInactive) {
      localStorage.setItem("auto_logout_done", true);
      localStorage.setItem("token", "");
      Swal.fire({
        title: "Inactivity alert",
        text: `Oops, there is no activity from the last ${autoLogout} minutes.`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "OK!",
        iconColor: "red",
        customClass: {
          confirmButton: "btn-danger",
          iconColor: "#b52d2d",
        },
        reverseButtons: true,
      }).then(() => {
        handleConfirm();
      });
    } else {
      localStorage.setItem("auto_logout_done", false);
    }
    //
  }, [isInactive, autoLogout, logoutTime]);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const [deviceType, setDeviceType] = useState("");

  const checkDevice = async () => {
    try {
      const info = await Device.getInfo();
      if (
        // info?.operatingSystem == "windows"
        info?.isVirtual
      ) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
      console.log(info, "setDeviceInfo");
      setDeviceInfo(info);
    } catch (error) {
      console.error("Error fetching device info:", error);
      setDeviceType("Error Detecting Device");
      setDeviceInfo("Unknown");
    }
  };
  useEffect(() => {
    const handleNetworkChange = () => {
      const newIsOnline = window.navigator.onLine;

      if (newIsOnline) {
        // Display an online SweetAlert
        Swal.fire({
          title: "Online",
          text: "You are now online.",
          icon: "success",
        });
      } else {
        // Display an offline SweetAlert
        Swal.fire({
          title: "Offline",
          text: "You are now offline.",
          icon: "error",
        });
      }
    };
    checkDevice();
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {


    dispatch(fetchData());
  }, []);
  // document.body.classList.add("mobile-app");
  const registerPushNotifications = () => {
    if (deviceInfo?.platform == "web") {

      return; // Exit for unsupported platforms
    }



    // Request push notification permissions for native platforms
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        PushNotifications.register();
      } else {
        console.warn("Push notification permissions not granted.");
      }
    });

    // Listener for successful push registration (token)
    PushNotifications.addListener("registration", (token) => {
    });

    // Listener for registration errors
    PushNotifications.addListener("registrationError", (err) => {
      console.error("Push registration error:", err.error);
    });

    // Listener for when a push notification is received
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push notification received:", notification);
      }
    );

    // Listener for when a push notification action is performed (e.g., tapping a notification)
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push notification action performed:", notification);
      }
    );
  };

  // Call the function to register for push notifications
  if (deviceInfo?.platform == "web") {
    registerPushNotifications();
  } else {
    console.warn("Device info not available yet.");
  }
  console.log(deviceType, "deviceType");
  return (
    <MyProvider>
      <NavigationProvider>
        <Fragment>
          {UserPermissions?.permissions?.length > 0 ? (
            <>
              <div className="horizontalMenucontainer mt-4">
                <TabToTop />
                <div className="page">
                  <div className="page-main">
                    <TopLoadingBar
                      style={{ height: "4px" }}
                      color="#fff"
                      ref={loadingBarRef}
                    />

                    <Header />
                    <Sidebar />

                    <div className={`main-content app-content ${isMobile ? "app-mobile-main-content" : ""}`}>
                      <div className="side-app">
                        <div className="main-container container-fluid">
                          <Outlet />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Footer />
                </div>
              </div>
            </>
          ) : (
            <>
              <BlankDashboard />
            </>
          )}
        </Fragment>
      </NavigationProvider>
    </MyProvider>
  );
};

export default withApi(App);
