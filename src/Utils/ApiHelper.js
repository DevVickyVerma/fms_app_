import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { useNavigation } from "./NavigationProvider";
import { useSelector } from "react-redux";
const withApi = (WrappedComponent) => {
  const WithApi = (props) => {
    const [apidata, setApiData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { lastPath } = useNavigation();
    // console.log(lastPath, "lastPath");
    const navigate = useNavigate();
    const SuccessToast = (message) => {
      toast.success(message, {
        autoClose: 2000,
        // // position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        transition: Bounce,
        theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
      });
    };
    const ErrorToast = (message) => {
      toast.error(message, {
        // // position: toast.POSITION.TOP_RIGHT,
        hideProgressBar: false,
        transition: Bounce,
        autoClose: 2000,
        theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
      });
    };

    const UserPermissions = useSelector((state) => state?.data?.data);
// console.log(UserPermissions?.route, "UserPermissions");

    const location = useLocation(); // useLocation hook to access current path
    const currentPath = location.pathname; // Current path as a string
  


    function handleError(error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorToast("Invalid access token");
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
            navigate(UserPermissions?.route)
          } else {
            // console.log("Navigating to last path:", lastPath);
            navigate(lastPath); // Navigate to lastPath if they are different
          }

          // navigate(lastPath);
          ErrorToast(errorMessage);
        }
      } else if (error.response && error.response.data.message) {
        const errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(" ")
          : error.response.data.message;

        if (errorMessage) {
          ErrorToast(errorMessage);
        }
      } else {
        ErrorToast("An error occurred.");
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
    }

    const postData = async (url, body, navigatePath) => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.post(url, body);
        if (response && response.data) {
          const data = response.data;

          setApiData(data);
          SuccessToast(data.message);
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
        throw error;        // Re-throw the error so the caller can handle it
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
