// toastUtils.js
import { Bounce, Flip, toast } from "react-toastify";
const SuccessAlert = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Flip,
  });
};

const ErrorAlert = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Flip,
  });
};

// const handleError = (error, navigate) => {
//     if (error.response && error.response.status === 401) {
//         navigate("/login");
//         SuccessAlert("Invalid access token");
//         localStorage.clear();
//     } else if (error.response && error.response.data.status_code === "403") {
//         navigate("/errorpage403");
//     } else {
//         const errorMessage = Array.isArray(error.response?.data?.message)
//             ? error.response?.data?.message.join(" ")
//             : error.response?.data?.message;
//         ErrorAlert(errorMessage);
//     }
// };

export { SuccessAlert, ErrorAlert };
