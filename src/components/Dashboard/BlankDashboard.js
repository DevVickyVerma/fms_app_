import { useSelector } from "react-redux";
import withApi from "../../Utils/ApiHelper";
import LoaderImg from "../../Utils/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlankDashboard = () => {
  const reduxLoading = useSelector((state) => state?.data?.loading);

  return (
    <>
      {reduxLoading ? <LoaderImg /> : null}

      <div
        className="w-100 d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <img
          src={require("../../assets/images/brand/logo.png")}
          alt="Logo"
          className="blank-icon-image"
          id="icon"
          style={{ maxWidth: "180px" }}
        />
      </div>

      {/* <ToastContainer /> */}
    </>
  );
};

export default withApi(BlankDashboard);
