// ToastHandler.js
import { toast, Bounce } from 'react-toastify';
import { useNavigation } from './NavigationProvider';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const SuccessToast = (message) => {
  toast.success(message, {
    autoClose: 2000,
    hideProgressBar: false,
    transition: Bounce,
    theme: "colored",
  });
};

export const ErrorToast = (message) => {
  toast.error(message, {
    autoClose: 2000,
    hideProgressBar: false,
    transition: Bounce,
    theme: "colored",
  });
};
const { lastPath } = useNavigation();
const UserPermissions = useSelector((state) => state?.data?.data);
// console.log(lastPath, "lastPath");
const navigate = useNavigate();
export const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
  
      if (errorMessage) {
        if (currentPath === lastPath) {
          navigate(UserPermissions?.route);
        } else {
          navigate(lastPath);
        }
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
  };