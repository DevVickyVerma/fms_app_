import { useEffect, useRef, useState } from "react";
import { Dropdown, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import { SuccessAlert } from "../../Utils/ToastUtils";

const Header = (props) => {
  const { getData } = props;
  const [isTwoFactorPermissionAvailable, setIsTwoFactorPermissionAvailable] =
    useState(null);

  const logout = async () => {
    localStorage.clear();
    window.location.replace("/");
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

  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const reduxData = useSelector((state) => state?.data?.data);

  const [twoFactorKey, setTwoFactorKey] = useState(
    localStorage.getItem("two_factor")
  );
  const storedKeyRef = useRef(localStorage.getItem("two_factor"));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedKey = localStorage.getItem("two_factor");
      storedKeyRef.current = storedKey;
      if (storedKey !== twoFactorKey) {
        setTwoFactorKey(storedKey);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [twoFactorKey]);

  const isProfileUpdatePermissionAvailable = UserPermissions?.includes(
    "profile-update-profile"
  );
  const isSmSPermissionAvailable = UserPermissions?.includes("sms-list");

  const isSettingsPermissionAvailable =
    UserPermissions?.includes("config-setting");

  useEffect(() => {
    const isTwoFactorAvailable = JSON.parse(localStorage.getItem("two_factor"));
    setIsTwoFactorPermissionAvailable(isTwoFactorAvailable);
  }, [isTwoFactorPermissionAvailable]);

  const openCloseSidebar = () => {
    document.querySelector(".app").classList.toggle("sidenav-toggled");
  };
  const mybalance = String(reduxData?.smsCredit);

  return (
    <Navbar expand="md" className="app-header header sticky">
      <Container fluid={true} className="main-container">
        <div className="d-flex align-items-center">
          <Link
            aria-label="Hide Sidebar"
            className="app-sidebar__toggle"
            to="#"
            onClick={() => openCloseSidebar()}
          />
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
                <div className="d-flex order-lg-2 nav-header-box">
                  <Dropdown className=" d-md-flex profile-1 profile-drop-down">
                    <Dropdown.Toggle
                      className="nav-link profile profile-box leading-none d-flex px-1"
                      variant=""
                    >
                      <h5 className="header-name mb-0 d-flex">
                        <span className="header-welcome-text">
                          {`Welcome,  ${" "}`}&nbsp;
                        </span>
                        <span className="header-welcome-text-title">
                          {reduxData?.first_name
                            ? reduxData?.first_name
                            : " Admin"}
                        </span>
                      </h5>
                      <i className="ph ph-caret-circle-down ms-2" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu-end dropdown-menu-arrow"
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading">
                        <div className="">
                          <h5 className="text-dark mb-0">
                            {reduxData?.full_name
                              ? reduxData?.full_name
                              : "Admin"}{" "}
                            <br />{" "}
                          </h5>
                        </div>
                      </div>
                      <div className="dropdown-divider m-0" />
                      {isSmSPermissionAvailable &&
                      localStorage.getItem("superiorRole") == "Client" ? (
                        <Dropdown.Item as={Link} to="/manage-sms">
                          <i className="dropdown-icon ph ph-chat-text" /> MY SMS{" "}
                          <span className="mybalance">
                            {mybalance !== undefined ? mybalance : ""}
                          </span>
                        </Dropdown.Item>
                      ) : null}
                      {isProfileUpdatePermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/editprofile">
                          <i className="dropdown-icon ph ph-user" /> Edit
                          Profile
                        </Dropdown.Item>
                      ) : null}

                      {isSettingsPermissionAvailable ? (
                        <Dropdown.Item as={Link} to="/settings">
                          <i className="dropdown-icon ph ph-gear" />
                          Settings
                        </Dropdown.Item>
                      ) : null}

                      <Dropdown.Item onClick={logout}>
                        <i className="dropdown-icon ph ph-sign-out" />
                        Sign out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <ToastContainer />
                </div>
              </Navbar>
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default withApi(Header);
