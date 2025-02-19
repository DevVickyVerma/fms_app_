import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigation } from "./NavigationProvider";
import { useSelector } from "react-redux";
import { ErrorAlert, SuccessAlert } from "./ToastUtils";

const withApi = (WrappedComponent) => {
  const WithApi = (props) => {
    const [apidata, setApiData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { lastPath } = useNavigation();
    const navigate = useNavigate();

    const UserPermissions = useSelector((state) => state?.data?.data);

    const location = useLocation(); // useLocation hook to access current path
    const currentPath = location.pathname; // Current path as a string

    function handleError(error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        const errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(" ")
          : error.response.data.message;

        if (errorMessage) {
          // console.log("Current Path:", currentPath);
          // console.log("Current Pathl:", lastPath);
          // console.log(lastPath, "errorMessage");
          if (currentPath === lastPath) {
            // console.log(" Navigating Same path: no navigation needed");
            navigate(UserPermissions?.route);
          } else {
            // console.log("Navigating to last path:", lastPath);
            navigate(lastPath); // Navigate to lastPath if they are different
          }

          // navigate(lastPath);
          ErrorAlert(errorMessage);
        }
      } else if (error.response && error.response.data.message) {
        const errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(" ")
          : error.response.data.message;

        if (errorMessage) {
          ErrorAlert(errorMessage);
        }
      } else {
        ErrorAlert("An error occurred.");
      }
    }
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const pendingRequests = useRef(0); // Ref to track ongoing requests
    const manageLoadingState = (isStarting) => {
      if (isStarting) {
        pendingRequests.current += 1;
        setIsLoading(true);
      } else {
        pendingRequests.current -= 1;
        if (pendingRequests.current === 0) {
          setIsLoading(false);
        }
      }
    };

    const getData = async (url, id, formData) => {
      manageLoadingState(true); // Start loading

      try {
        const modifiedUrl = id ? `${url}/${id}` : url;
        const response = await axiosInstance.get(modifiedUrl, {
          params: formData,
        });

        if (response && response.data) {
          const data = response.data;
          setApiData(data);
          return response;
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        handleError(error);
        setError(error);
        throw error;
      } finally {
        manageLoadingState(false); // End loading
      }
    };

    const postData = async (url, body, navigatePath) => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.post(url, body);
        if (response && response.data) {
          const data = response.data;

          setApiData(data);
          SuccessAlert(data.message);
          setIsLoading(false);
          navigate(navigatePath);
          return data;
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        handleError(error);
        setError(error);
        setIsLoading(false);
        throw error; // Re-throw the error so the caller can handle it
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <WrappedComponent
        apidata={apidata}
        isLoading={isLoading}
        error={error}
        getData={getData}
        postData={postData}
        {...props}
      />
    );
  };

  return WithApi;
};

export default withApi;
