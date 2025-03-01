import { useEffect, useState } from 'react';
import { Col, Modal, Row } from "react-bootstrap";
import Loaderimg from "../../Utils/Loader";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import withApi from "../../Utils/ApiHelper";
import { ErrorAlert, SuccessAlert } from "../../Utils/ToastUtils";
import useErrorHandler from "../../components/CommonComponent/useErrorHandler";

const SingleAuthModal = (props) => {
  const { setShowTruw, getData } = props;
  const [isLoading, setLoading] = useState(false);
  const [factordata, setfactordata] = useState();
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [showModal, setShowModal] = useState(false);
  const { handleError } = useErrorHandler();
  // eslint-disable-next-line no-unused-vars
  const [UserPermissionstwo_factor, setUserPermissionstwo_factor] =
    useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    Active2FA();
  }, []);

  const Active2FA = async () => {
    setLoading(true);
    try {
      const response = await getData(`enable/two-factor`);
      if (response) {
        setfactordata(response?.data?.data);
        setLoading(false);
        setShowModal(true);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const handleSubmit1 = async (values, setSubmitting) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);

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
      SuccessAlert(data.message);
      navigate("/dashboard");
      setSubmitting(false);
      setLoading(false);
    } else {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(" ")
        : data.message;

      setLoading(false);
      ErrorAlert(errorMessage);
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

        .required("Last name is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit1(values, setSubmitting);
    },
  });



  const handleCloseModal = () => {
    setShowModal(false);
    setShowTruw(false);
  };

  const GetDetails = async () => {
    setLoading(true);
    try {
      const response = await getData(`/detail`);
      if (response) {
        setUserPermissionstwo_factor(response?.data?.data?.two_factor);
        localStorage.setItem("two_factor", response?.data?.data?.two_factor);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const handleVerifyAuthentication = async (value) => {
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
        SuccessAlert(data.message);

        setUserPermissionstwo_factor(UserPermissions?.two_factor);

        localStorage.setItem("two_factor", "true");
        GetDetails();
        setLoading(false);
      } else {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;

        ErrorAlert(errorMessage);
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
      handleVerifyAuthentication(values);
    },
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <Modal
        show={showModal}
        centered={true}
        className="custom-modal-width custom-modal-height big-modal"
      >
        <Modal.Header
          style={{
            color: "#fff",
            background: "#2D8BA8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Modal.Title className=" mb-0">
              Two-factor Authentication (2FA)
            </Modal.Title>
          </div>
          <div>
            <span
              className="modal-icon"
              onClick={handleCloseModal}
              style={{ cursor: "pointer" }}
            >
              <AiOutlineClose />
            </span>
          </div>
        </Modal.Header>
        <Modal.Body className="Disable2FA-modal">
          <div className="modal-contentDisable2FA">
            <div className="card" style={{ marginBottom: "0px" }}>
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

SingleAuthModal.propTypes = {
};

export default withApi(SingleAuthModal);
