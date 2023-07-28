import React, { Fragment, useEffect, useRef, useState } from "react";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/SideBar/SideBar";
import Footer from "../layouts/Footer/Footer";
import Switcher from "../layouts/Switcher/Switcher";

import * as Switcherdata from "../data/Switcher/Switcherdata";
import { Outlet, useLocation } from "react-router-dom";
import TabToTop from "../layouts/TabToTop/TabToTop";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "react-top-loading-bar";

import SweetAlert from 'sweetalert2';
import Swal from "sweetalert2";
import withApi from "../Utils/ApiHelper";



  const App = (props) => {
    const { apidata, isLoading, error, getData, postData } = props;
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
    inactivityTimeout = setTimeout(() => setIsInactive(true), 300000);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    inactivityTimeout = setTimeout(() => setIsInactive(true), 300000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      clearTimeout(inactivityTimeout);
    };
  console.clear()  }, []);
  const handleConfirm = () => {
    logout()
    console.log('Delete confirmed');
  };

  const handleCancel = () => {
    // Logic to handle cancellation
    console.log('Deletion canceled');
  };

  useEffect(() => {
    if (isInactive) {
      Swal.fire({
        title: 'Inactivity Alert',
        text: 'Oops, there is no activity from last 5 minutes, would you like to stay logged in or logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout!',
        cancelButtonText: 'Stay Loggedin',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          handleConfirm();
        } else {
          handleCancel();
        }
      });
  
      console.log('Inactivity Alert');
    }
  }, [isInactive, handleConfirm, handleCancel]);
  ;

  return (
    <Fragment>
      <div className="horizontalMenucontainer">
        <TabToTop />
        <div className="page">
          <div className="page-main">
            <TopLoadingBar
              style={{ height: "4px" }}
              color="#6259ca"
              ref={loadingBarRef}
            />

            <Header />
            <Sidebar />
            <div className="main-content app-content ">
              <div className="side-app">
                <div
                  className="main-container container-fluid"
                  onClick={() => {
                    Switcherdata.responsiveSidebarclose();
                    Switcherdata.Horizontalmenudefultclose();
                  }}
                >
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
  );
}
export default withApi(App);
