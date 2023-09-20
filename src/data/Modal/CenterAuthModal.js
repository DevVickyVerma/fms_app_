import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import Loaderimg from "../../Utils/Loader";
import SearchIcon from "@mui/icons-material/Search";
import { AiOutlineClose } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

const CenterAuthModal = (props) => {
  const {
    title,
    sidebarContent,
    visible,
    onClose,
    onSubmit,
    searchListstatus,
  } = props;
  const [open, setOpen] = useState(true);
  // const [keyword, setSearchQuery] = useState("");
  // const [start_date, setStartDate] = useState("");
  // const [end_date, setEndDate] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [factordata, setfactordata] = useState();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [showModal, setShowModal] = useState(false);
  const [UserPermissionstwo_factor, setUserPermissionstwo_factor] =
    useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const notify = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
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
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userPermissions = useSelector((state) => state?.data?.data);

  const Active2FA = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`enable/two-factor`);
      if (response) {
        console.log(response.data.data, "fetchDatafactor");
        setfactordata(response?.data?.data);
        setLoading(false);
        setShowModal(true);
        console.log(UserPermissions?.two_factor, "UserPermissions?.two_factor");

        console.log(userPermissions, "UserPermissions?.two_factor");
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const handleSubmit1 = async (values, setSubmitting) => {
    console.log(values, "values");
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    // formData.append("role", values.role);
    // formData.append("phone_number", values.phone_number);

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/update-profile`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      notify(data.message);
      navigate("/dashboard");
      setSubmitting(false);
      setLoading(false);
    } else {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(" ")
        : data.message;
      console.log(errorMessage);
      setLoading(false);
      Errornotify(errorMessage);
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Last name is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit1(values, setSubmitting);
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const GetDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/detail`);
      if (response) {
        console.log(response?.data?.data?.two_factor, "detailfetchDatafactor");
        setUserPermissionstwo_factor(response?.data?.data?.two_factor);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const handleVerifyAuthentication = async (value) => {
    console.log("handleVerifyAuthentication1", value);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("two_factor_code", value.authenticationCode);

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/enable/two-factor/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        notify(data.message);
        console.log(UserPermissions?.two_factor, "UserPermissions?.two_factor");
        setUserPermissionstwo_factor(UserPermissions?.two_factor);
        GetDetails();
        setLoading(false);
      } else {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;
        console.log(errorMessage);
        Errornotify(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
    setLoading(false);
  };

  const authenticationCodevalidationSchema = Yup.object().shape({
    authenticationCode: Yup.string().required(
      "Authentication Code is required"
    ),
  });

  const authenticationCodeformik = useFormik({
    initialValues: {
      authenticationCode: "", // Initial value for the authentication code
    },
    validationSchema: authenticationCodevalidationSchema,
    onSubmit: (values) => {
      console.log(values, "handleVerifyAuthentication");
      handleVerifyAuthentication(values);
    },
  });

  return (
    <>
      <div>
        {/* <div className="d-flex searchbar-top">
                    <Button
                        variant="primary"
                        className="modal-effect d-grid mb-3 d-flex"
                        href="#modaldemo8"
                        onClick={handleClickOpen}
                    >
                        Authentication{" "}
                        <span className="ms-2">
                            <SearchIcon />
                        </span>
                    </Button>
                </div> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          className="ModalTitle
                "
        >
          <span className="ModalTitle-2fa d-flex justify-content-between">
            Enable 2FA
            <span onClick={handleClose} style={{ cursor: "pointer" }}>
              <AiOutlineClose />
            </span>
          </span>
          <DialogContent>
            <DialogContentText>
              <>
                {isLoading ? (
                  <Loaderimg />
                ) : (
                  <>
                    <img
                      src={require("../../assets/images/dashboard/authModalImage.png")}
                      alt="MyChartImage"
                      className="all-center-flex object-fit-contain w-40 h-40 m-auto "
                    />
                    <div className=" text-center mt-2">
                      <strong className="fs-19">
                        Add Extra Security With Two Factor Authentication
                      </strong>
                    </div>
                    <p className=" text-center">
                      Help protect your account, even if someone gets hold your
                      password
                    </p>
                    <div className=" text-center">
                      <button
                        type="Search"
                        className="btn btn-danger"
                        // onClick={handleSubmit}
                        // onClick={Active2FA}
                        onClick={() => {
                          handleClose();
                          Active2FA();
                        }}
                      >
                        Enable 2FA
                      </button>
                    </div>
                  </>
                )}
              </>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>

      <Modal
        show={showModal}
        // onHide={handleCloseModal}
        centered
        // style={{ width: "200wvh" }}
        className="custom-modal-width custom-modal-height"
      >
        <Modal.Header
          closeButton
          style={{ color: "#fff", background: "#6259ca" }}
        >
          <Modal.Title>Two-factor Authentication (2FA)</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Disable2FA-modal">
          <div className="modal-contentDisable2FA">
            <div className="card">
              <div className="card-body" style={{ padding: "10px" }}>
                <Row>
                  <Col lg={12} md={12}>
                    <p className="instruction-text">
                      Use the following methods to set up 2FA:
                    </p>
                    <ul className="method-list">
                      <li>
                        Use the Authenticator App (Google, Microsoft, etc.) to
                        scan the QR Code
                      </li>

                      <li>
                        Use the Authenticator extension in Chrome to scan the QR
                        Code
                      </li>
                    </ul>
                    <hr />
                  </Col>

                  <Col lg={6} md={12}>
                    <strong className="f2A-name ">Scan QR Code</strong>

                    <img
                      src={factordata?.qrCode}
                      alt={"factordata"}
                      className="qr-code-image mx-auto d-block"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </Col>
                  <Col lg={6} md={12}>
                    <strong className="f2A-name">
                      OR Enter Code into your App
                    </strong>

                    <p className="secret-key mt-3 ">
                      <span className="instruction-text">Secret Key:</span>{" "}
                      {factordata?.secret}
                    </p>
                    <hr />
                    <strong className=" instruction-text ">
                      Enter Authenticator App Code:
                    </strong>
                    <hr />
                    <form onSubmit={authenticationCodeformik.handleSubmit}>
                      <input
                        type="text"
                        className="input101 authentication-code-input"
                        id="authenticationCode"
                        name="authenticationCode"
                        placeholder="Authentication Code"
                        value={
                          authenticationCodeformik.values.authenticationCode
                        }
                        onChange={authenticationCodeformik.handleChange}
                        onBlur={authenticationCodeformik.handleBlur}
                      />
                      {authenticationCodeformik.touched.authenticationCode &&
                        authenticationCodeformik.errors.authenticationCode && (
                          <div className="error-message">
                            {authenticationCodeformik.errors.authenticationCode}
                          </div>
                        )}
                      <div className="text-end mt-4">
                        <button
                          className="btn btn-primary ml-4 verify-button"
                          type="submit"
                          disabled={!formik.isValid}
                        >
                          Verify & Authentication
                        </button>
                        <button
                          type="btn"
                          className="btn btn-danger mx-4"
                          onClick={handleCloseModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

CenterAuthModal.propTypes = {
  title: PropTypes.string.isRequired,
  // sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchListstatus: PropTypes.bool.isRequired,
};

export default CenterAuthModal;
