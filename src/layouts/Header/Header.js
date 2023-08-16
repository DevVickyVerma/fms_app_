import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Navbar, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Slide, ToastContainer, toast } from "react-toastify";
import * as loderdata from "../../data/Component/loderdata/loderdata";

import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";

const Header = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  // Fetch the API response when the component mounts or whenever needed

  const SuccessAlert = (message) => {
    toast.success(message, {
      autoClose: 500,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 500,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const Errornotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState();
  const [headingusername, setHeadingUsername] = useState();

  const logout = async (row) => {
    try {
      const response = await getData("/logout");

      if (response.data.api_response === "success") {
        localStorage.clear();

        setTimeout(() => {
          window.location.replace("/");
        }, 500);

        SuccessAlert(response.data.message);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error here, such as displaying an error message or performing other actions
    }
  };

  const permissionsToCheck = [
    "profile-update-profile",
    "profile-update-password",
  ];

  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
      setUsername(UserPermissions.full_name);
      setHeadingUsername(UserPermissions.first_name);
    }
  }, [UserPermissions]);

  const isProfileUpdatePermissionAvailable = permissionsArray?.includes(
    "profile-update-profile"
  );
  const isUpdatePasswordPermissionAvailable = permissionsArray?.includes(
    "profile-update-password"
  );
  const isSettingsPermissionAvailable =
    permissionsArray?.includes("config-setting");

  //full screen
  function Fullscreen() {
    if (
      (document.fullScreenElement && document.fullScreenElement === null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }
  //dark-mode
  const Darkmode = () => {
    document.querySelector(".app").classList.toggle("dark-mode");
  };
  //leftsidemenu
  const openCloseSidebar = () => {
    document.querySelector(".app").classList.toggle("sidenav-toggled");
  };
  //rightsidebar
  const openCloseSidebarright = () => {
    document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
  };

  // responsivesearch
  const responsivesearch = () => {
    document.querySelector(".header-search").classList.toggle("show");
  };
  //swichermainright
  // const swichermainright = () => {
  //   document.querySelector(".demo_changer").classList.toggle("active");
  //   document.querySelector(".demo_changer").style.right = "0px";
  // };

  return (
    <Navbar expand="md" className="app-header header sticky">
      {loading && <loderdata.Loadersbigsizes1 />}
      <Container fluid className="main-container">
        <div className="d-flex align-items-center">
          <Link
            aria-label="Hide Sidebar"
            className="app-sidebar__toggle"
            to="#"
            onClick={() => openCloseSidebar()}
          ></Link>
          <div className="responsive-logo">
            <Link to={`/dashboard/`} className="header-logo">
              <img
                src={require("../../assets/images/brand/logo-3.png")}
                className="mobile-logo logo-1"
                alt="logo"
              />
              <img
                src={require("../../assets/images/brand/logo.png")}
                className="mobile-logo dark-logo-1"
                alt="logo"
              />
            </Link>
          </div>
          <Link className="logo-horizontal " to={`/dashboard/`}>
            <img
              src={require("../../assets/images/brand/logo.png")}
              className="header-brand-img desktop-logo"
              alt="logo"
            />
            <img
              src={require("../../assets/images/brand/logo-3.png")}
              className="header-brand-img light-logo1"
              alt="logo"
            />
          </Link>

          <div className="d-flex order-lg-2 ms-auto header-right-icons">
            <div>
              <Navbar id="navbarSupportedContent-4">
                <div className="d-flex order-lg-2">
                  <Dropdown className=" d-md-flex profile-1">
                    <Dropdown.Toggle
                      className="nav-link profile profile-box leading-none d-flex px-1"
                      variant=""
                    >
                      <h5 className="header-name mb-0 d-flex">
                      <span className="header-welcome-text">
                          {`Welcome,  ${" "}`}&nbsp; 
                      </span>
                       <span className="header-welcome-text-title">
                       {
                          (headingusername ?  headingusername : " Admin")}
                       </span>
                       
                      </h5>
                      <i className="fa fa-chevron-circle-down  ms-2"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu-end dropdown-menu-arrow"
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading">
                        <div className="text-center">
                          <h5 className="text-dark mb-0">
                            {username ? username : "Admin"}
                          </h5>
                        </div>
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      {isProfileUpdatePermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/editprofile">
                          <i className="dropdown-icon fe fe-user"></i> Edit
                          Profile
                        </Dropdown.Item>
                      ) : null}
                      {isUpdatePasswordPermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/editprofile">
                          <i className="dropdown-icon fe fe-user"></i>Change
                          Password
                        </Dropdown.Item>
                      ) : null}
                      {isSettingsPermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/settings">
                          <i className="dropdown-icon fe fe-settings"></i>
                          Settings
                        </Dropdown.Item>
                      ) : null}

                      <Dropdown.Item onClick={logout}>
                        <i className="dropdown-icon fe fe-alert-circle"></i>
                        Sign out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <ToastContainer />
                </div>
              </Navbar>
              {/*  </Navbar.Collapse> */}
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default withApi(Header);
