import React, { Fragment, useEffect, useRef, useState } from "react";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/SideBar/SideBar";
import Footer from "../layouts/Footer/Footer";
import Switcher from "../layouts/Switcher/Switcher";

import { Outlet, useLocation } from "react-router-dom";
import TabToTop from "../layouts/TabToTop/TabToTop";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "react-top-loading-bar";

import SweetAlert from "sweetalert2";
import Swal from "sweetalert2";
import withApi from "../Utils/ApiHelper";
import { MyProvider } from "../Utils/MyContext";

const App = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [logoutTime, setLogoutTime] = useState(
    parseInt(localStorage.getItem("auto_logout")) * 60000
  );

  const loadingBarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      const response = await getData("/logout");

      if (response.data.api_response === "success") {
        localStorage.clear();

        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error here, such as displaying an error message or performing other actions
    }
  };

  const simulateLoadingAndNavigate = () => {
    loadingBarRef.current.continuousStart();

    // simulate loading
    setTimeout(() => {
      loadingBarRef.current.complete();
      // navigate("/new-url"); // replace "/new-url" with the URL you want to navigate to
    }, 50);
  };

  useEffect(() => {
    simulateLoadingAndNavigate();
    // console.clear();
  }, [location.pathname]);

  const [isInactive, setIsInactive] = useState(false);
  let inactivityTimeout;

  const handleUserActivity = () => {
    clearTimeout(inactivityTimeout);
    setIsInactive(false);
    inactivityTimeout = setTimeout(() => setIsInactive(true), logoutTime);
  };

  useEffect(() => {
    console.log(localStorage.getItem("auto_logout"), "auto_logout111");
    console.log(logoutTime, "auto_logout111logoutTime");
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);

    inactivityTimeout = setTimeout(() => setIsInactive(true), logoutTime);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
      clearTimeout(inactivityTimeout);
    };
    console.clear();
  }, []);
  const handleConfirm = () => {
    logout();
  };

  const handleCancel = () => {
    console.log("Deletion canceledlogout");
    logout();
  };

  useEffect(() => {
    if (isInactive) {
      Swal.fire({
        title: "Inactivity Alert",
        text: `Oops, there is no activity from last ${localStorage.getItem(
          "auto_logout"
        )} minutes,`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "OK!",
        iconColor: "red",
        customClass: {
          confirmButton: "btn-danger",
          iconColor: "#b52d2d",
        },

        reverseButtons: true,
      }).then((result) => {
        handleConfirm();
      });

      console.log("Inactivity Alert");
    }
  }, [isInactive, handleConfirm, handleCancel]);
  return (
    <MyProvider>
      <Fragment>
        <div className="horizontalMenucontainer">
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
              <div className="main-content app-content ">
                <div className="side-app">
                  <div className="main-container container-fluid">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>

            <Switcher />
            <Footer />
          </div>
        </div>
      </Fragment>
    </MyProvider>
  );
};
export default withApi(App);
