import React, { useEffect, useState } from "react";
import { Card, Col, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../../components/CommonComponent/useErrorHandler";
import { useSelector } from "react-redux";
import withApi from "../../../Utils/ApiHelper";
import PublicCompetitorFuelPricesUpdate from "./PublicCompetitorFuelPricesUpdate";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FuelPriceTimeLineLogs from "../ManageVersionTwoCompetitorFuelPrice/FuelPriceTimeLineLogs";

const VersionTwoSuggestedFuelPriceModal = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
  accordionSiteID,
  getData,
  postData,
}) => {
  const { handleError } = useErrorHandler();

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const [data, setData] = useState(); // Initialize data as null
  const [isLoading, setIsLoading] = useState(false);
  const [hasListing, setHasListing] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      siteId: "",
      siteName: "",
      listing: [],
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    fetchData();
  }, [accordionSiteID]);

  const fetchData = async () => {
    if (accordionSiteID) {
      try {
        setIsLoading(true);

        const response = await getData(
          `/site/fuel-price/suggestion/detail/${accordionSiteID}`
        );

        if (response && response.data && response.data.data) {
          setData(response.data.data);
          formik.setValues(response.data.data);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const CallListingApi = () => {
    fetchData();
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    values?.listing?.forEach((listingItem) => {
      listingItem.fuels.forEach((fuel) => {
        const priceId = fuel?.id;

        const fieldKey = `fuels[${priceId}]`;
        const fieldValue = fuel?.price.toString();
        const fieldTime = fuel?.time || "00:00";

        if (
          fieldValue !== "" &&
          fieldValue !== null &&
          fieldValue !== undefined &&
          fieldTime !== "" &&
          fieldTime !== null &&
          fieldTime !== undefined
        ) {
          formData.append(fieldKey, fieldValue);
          // formData.append(timeKey, fieldTime);
        }
      });
    });

    formData.append("drs_date", selectedDrsDate);
    formData.append("site_id", accordionSiteID);
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.post(
        "/site/competitor-price/update",
        formData
      );

      if (response.status === 200 && response.data.api_response === "success") {
        sendDataToParent();
        SuccessAlert(response.data.message);
        navigate("/competitor-fuel-price");
        onClose();
      } else {
        // Handle other cases or errors here
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendDataToParent = () => {
    const dataToSend = "Data from child 123";
    onDataFromChild(dataToSend);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Modal
        show={open}
        onHide={onClose}
        centered
        // size={"sm"}
        className="dashboard-center-modal"
        aria-labelledby="rejectReasonModalLabel"
        aria-hidden="false"
        tabIndex="-1"
      >
        <div>
          <Modal.Header
            style={{
              color: "#fff",
            }}
            className="p-0 m-0 d-flex justify-content-between align-items-center"
          >
            <span className="ModalTitle d-flex justify-content-between w-100  fw-normal">
              <span>
                {" "}
                Fuel Selling Price Suggestion For {data?.site_name} ({" "}
                {data?.date} ){" "}
                <span className="d-flex pt-1 align-items-center c-fs-12">
                  <span className="greenboxx me-2"></span>
                  <span className="text-muted">Current Price</span>
                </span>
              </span>
              <span onClick={onClose}>
                <button className="close-button">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            </span>
          </Modal.Header>

          <form onSubmit={formik.handleSubmit}>
            <Card.Body>
              <Row className="row-sm">
                <Col lg={12}>
                  <>
                    <FuelPriceTimeLineLogs data={data} />

                    <>
                      {data?.accept_suggestion?.length > 0 ? (
                        <div className="mt-7">
                          <>
                            <PublicCompetitorFuelPricesUpdate
                              data={data}
                              postData={postData}
                              //   handleFormSubmit={handleFormSubmit}
                              accordionSiteID={accordionSiteID}
                              CallListingApi={CallListingApi}
                            />
                          </>
                        </div>
                      ) : (
                        <div></div> // Optionally provide a fallback UI
                      )}
                    </>
                  </>
                </Col>
              </Row>
            </Card.Body>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default withApi(VersionTwoSuggestedFuelPriceModal);
