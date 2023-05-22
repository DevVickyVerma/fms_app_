import axios from "axios";
import { toast } from "react-toastify";

const notify = (message) => toast.success(message);
const errorNotify = (message) => toast.error(message);

const apiCall = async (url, options = {}, navigate) => {
  try {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await axiosInstance(url, options);

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      errorNotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      console.error(error);
    }
  }
};

export default apiCall;
