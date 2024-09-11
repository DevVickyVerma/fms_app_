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
import 'phosphor-icons/src/css/icons.css'; // Import Phosphor Icons CSS

const App = (props) => {
  const loadingBarRef = useRef();
  const location = useLocation();
  const simulateLoadingAndNavigate = () => {
    loadingBarRef?.current?.continuousStart();
    // simulate loading
    setTimeout(() => {
      loadingBarRef?.current?.complete();
      // navigate("/new-url"); // replace "/new-url" with the URL you want to navigate to
    }, 50);
  };

  useEffect(() => {
    simulateLoadingAndNavigate();
    // console.clear();
  }, [location.pathname]);
  const [autoLogout, setAutoLogout] = useState(
    localStorage.getItem("auto_logout")
  );

  const dispatch = useDispatch();
  const GetDetails = async () => {
    dispatch(fetchData())
  };

  useEffect(() => {
    GetDetails()
    // console.clear();
  }, []);

  const [isInactive, setIsInactive] = useState(false);
  const [logoutTime, setLogoutTime] = useState(autoLogout * 60000); // Initialize logoutTime with the initial value

  let inactivityTimeout;

  const handleUserActivity = () => {
    clearTimeout(inactivityTimeout);
    setIsInactive(false);
    inactivityTimeout = setTimeout(() => setIsInactive(true), logoutTime);
  };

  useEffect(() => {
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
        title: "Inactivity Alert",
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
      }).then((result) => {
        handleConfirm();
      });
    } else {
      localStorage.setItem("auto_logout_done", false);
    }
    // console.clear();
  }, [isInactive, autoLogout, logoutTime]);

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleNetworkChange = () => {
      const newIsOnline = window.navigator.onLine;
      setIsOnline(newIsOnline);

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

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  const UserPermissions = useSelector((state) => state?.data?.data);



  return (
    <MyProvider>
      <Fragment>

        {UserPermissions?.permissions?.length > 0 ? <>
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
              <Footer />
            </div>
          </div>
        </> : <>
          <BlankDashboard />
        </>}

      </Fragment>
    </MyProvider>
  );
};
export default withApi(App);
