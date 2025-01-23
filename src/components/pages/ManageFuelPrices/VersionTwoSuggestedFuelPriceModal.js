import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, TableContainer } from "@mui/material";
import { Card, Col, Modal, OverlayTrigger, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Link, useNavigate } from "react-router-dom";
import { SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../../components/CommonComponent/useErrorHandler";
import { useSelector } from "react-redux";
import withApi from "../../../Utils/ApiHelper";
import {
  renderTooltip,
  staticCompiPriceCommon2,
} from "../../../Utils/commonFunctions/commonFunction";
import PublicCompetitorFuelPricesUpdate from "./PublicCompetitorFuelPricesUpdate";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  const [data, setData] = useState(staticCompiPriceCommon2); // Initialize data as null
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

  // Dummy data for approval timeline
  const approvalTimelineData = [
    {
      id: 1,
      title: "Price Update for Site A",
      description: "Price updated for Site A to $1200",
      status: "3",
      date: "02 Dec 2024",
      time: "10:30 AM",
      updatedBy: "John Doe",
    },
    {
      id: 2,
      title: "Price Update for Site B",
      description: "Price updated for Site B to $1500",
      status: "1",
      date: "01 Dec 2024",
      time: "03:45 PM",
      updatedBy: "Jane Smith",
    },
    {
      id: 3,
      title: "Price Update for Site C",
      description: "Price updated for Site C to $950",
      status: "Rejected",
      date: "30 Nov 2024",
      time: "11:15 AM",
      updatedBy: "Alice Johnson",
    },
    {
      id: 4,
      title: "Price Update for Site D",
      description: "Price updated for Site D to $1100",
      status: "3",
      date: "28 Nov 2024",
      time: "09:00 AM",
      updatedBy: "Bob Williams",
    },
    {
      id: 5,
      title: "Price Update for Site E",
      description: "Price updated for Site E to $1350",
      status: "1",
      date: "27 Nov 2024",
      time: "12:30 PM",
      updatedBy: "Emily Davis",
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Modal
        show={open}
        onHide={onClose}
        centered
        // size={"sm"}
        className="dashboard-center-modal"
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
                    <>
                      <div className="vtimeline ">
                        {data?.logs?.map((item) => (
                          <div
                            key={item.id}
                            className={`timeline-wrapper timeline-inverted ${
                              item.status === 1
                                ? "timeline-wrapper-warning"
                                : item.status === 2
                                ? "timeline-wrapper-danger"
                                : item.status === 3
                                ? "timeline-wrapper-success"
                                : item.status === 4
                                ? "timeline-wrapper-modified"
                                : "timeline-wrapper-no-case"
                            }`}
                          >
                            <div className="timeline-badge"></div>
                            <div className="timeline-panel">
                              <div className="timeline-heading">
                                <h6 className="timeline-title">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip("Creator")}
                                  >
                                    <>{item?.creator}</>
                                  </OverlayTrigger>
                                </h6>
                              </div>
                              <div className="timeline-body">
                                <p>{item?.description}</p>
                              </div>
                              <div className="table-container table-responsive">
                                <table className="table table-modern tracking-in-expand">
                                  <thead>
                                    <tr>
                                      {data?.fuel_head_array?.map((item) => (
                                        <th
                                          key={item?.id}
                                          className="middy-table-head"
                                        >
                                          {item?.name}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {data?.logs?.map((row, rowIndex) => (
                                      <React.Fragment key={rowIndex}>
                                        <tr className="">
                                          {row?.prices?.map(
                                            (item, itemIndex) => (
                                              <td
                                                key={item.id}
                                                className="middayModal-td"
                                              >
                                                <div className="py-1">
                                                  <div className=" d-flex align-items-center  w-100 h-100 ">
                                                    <div
                                                      className=" fs-14 "
                                                      style={{
                                                        color:
                                                          item?.price_color,
                                                      }}
                                                    >
                                                      <span
                                                        className={`ms-2 ${
                                                          item?.status === "UP"
                                                            ? "text-success"
                                                            : item?.status ===
                                                              "DOWN"
                                                            ? "text-danger"
                                                            : ""
                                                        }`}
                                                      >
                                                        {item.price}
                                                      </span>
                                                      <span>
                                                        {item?.status ===
                                                          "UP" && (
                                                          <>
                                                            <ArrowUpwardIcon
                                                              fontSize="10"
                                                              className="text-success ms-1 position-relative c-top-minus-1"
                                                            />
                                                          </>
                                                        )}
                                                      </span>
                                                      <span>
                                                        {item?.status ===
                                                          "DOWN" && (
                                                          <>
                                                            <ArrowDownwardIcon
                                                              fontSize="10"
                                                              className="text-danger ms-1 position-relative c-top-minus-1"
                                                            />
                                                          </>
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </td>
                                            )
                                          )}
                                        </tr>
                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="timeline-footer d-flex align-items-center flex-wrap mt-2">
                                <i
                                  className={` ${
                                    item?.status === "1"
                                      ? " ph ph-hourglass-medium text-warning"
                                      : item?.status === "3"
                                      ? "ph ph-check-circle text-success"
                                      : "ph ph-smiley-sad text-danger"
                                  } c-fs-18 me-2`}
                                ></i>
                                <span>
                                  {item?.modified_at} "modified_at" by{" "}
                                  {item?.modifier} "modifier"
                                </span>
                                &nbsp;
                                <span className="ms-auto">
                                  <i className="fe fe-calendar text-muted me-1"></i>{" "}
                                  {item?.created_at}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* {data ? (
                        <div className="mt-7">
                          <>
                            <PublicCompetitorFuelPricesUpdate
                              data={data}
                              postData={postData}
                              //   handleFormSubmit={handleFormSubmit}
                              accordionSiteID={accordionSiteID}
                            />
                          </>
                        </div>
                      ) : (
                        <div></div> // Optionally provide a fallback UI
                      )} */}
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
