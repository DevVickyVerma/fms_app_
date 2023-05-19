import React, { Fragment, useEffect, useRef, useState } from "react";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/SideBar/SideBar";
import Footer from "../layouts/Footer/Footer";
import Switcher from "../layouts/Switcher/Switcher";
import RightSidebar from "../layouts/RightSidebar/RightSidebar";
import * as Switcherdata from "../data/Switcher/Switcherdata";
import { Outlet, useLocation } from "react-router-dom";
import TabToTop from "../layouts/TabToTop/TabToTop";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";
import axios from "axios";

export default function App() {
  const loadingBarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState("");

  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const simulateLoadingAndNavigate = () => {
    loadingBarRef.current.continuousStart();

    // simulate loading
    setTimeout(() => {
      loadingBarRef.current.complete();
      // navigate("/new-url"); // replace "/new-url" with the URL you want to navigate to
    }, 500);
  };

  useEffect(() => {
    simulateLoadingAndNavigate();
    // console.clear();
  }, [location.pathname]);

  useEffect(() => {
    fetchData();
  }, [localStorage.getItem("First_name")]);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.post("/detail");
      const { data } = response;
      if (data) {
        const firstName = data.data.first_name ?? "";
        const lastName = data.data.last_name ?? "";
        const phoneNumber = data.data.phone_number ?? "";
        const full_name = data.data.full_name ?? "";
        localStorage.setItem("First_name", firstName);
        localStorage.setItem("full_name", full_name);
        localStorage.setItem("Last_name", lastName);
        localStorage.setItem("Phone_Number", phoneNumber);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else {
        console.error(error);
      }
    }
  };

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
          <RightSidebar />
          <Switcher />
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}
