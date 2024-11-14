import { useNavigate, useLocation } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

import { useSelector } from "react-redux";
import { useNavigation } from "../../Utils/NavigationProvider";

const useErrorHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lastPath } = useNavigation();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const currentPath = location.pathname; // Current path as a string


  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 2000,
      hideProgressBar: false,
      transition: Bounce,
      theme: "colored",
    });
  };

  const ErrorToast = (message) => {
    toast.error(message, {
      autoClose: 2000,
      hideProgressBar: false,
      transition: Bounce,
      theme: "colored",
    });
  };



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

        console.log(errorMessage, "errorMessageerrorMessageerrorMessageerrorMessage", currentPath, lastPath);

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

  return {
    handleError,
    SuccessToast,
    ErrorToast,
  };
};

export default useErrorHandler;
