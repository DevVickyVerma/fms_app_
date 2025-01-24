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
                                <h6 className=" fw-600">
                                  Fuel Suggested For ({item?.date}, {item?.time}
                                  )
                                  <span>
                                    {item?.status === 1 ? (
                                      <span className="btn btn-warning btn-sm ms-2">
                                        <i className="ph ph-hourglass-low  c-fs-12 me-1"></i>
                                        <span>Pending</span>
                                      </span>
                                    ) : item?.status === 2 ? (
                                      <span className="btn btn-danger btn-sm ms-2">
                                        <i className="ph ph-x  c-fs-12 me-1"></i>
                                        <span>Rejected</span>
                                      </span>
                                    ) : item?.status === 3 ? (
                                      <span className="btn btn-success btn-sm ms-2">
                                        <i className="ph ph-check  c-fs-12 me-1"></i>
                                        <span>Approved</span>
                                      </span>
                                    ) : item?.status === 4 ? (
                                      <span className="btn btn-info btn-sm ms-2">
                                        <i className="ph ph-checks  c-fs-12 me-1"></i>
                                        <span>Modified</span>
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </span>
                                </h6>
                                <div className=" c-fs-13 ">
                                  Creator -{" "}
                                  <span className=" fw-500">
                                    {item?.creator}
                                  </span>
                                </div>
                                <div className=" c-fs-13 ">
                                  Created At -{" "}
                                  <span className=" fw-500">
                                    {item?.created_at}
                                  </span>
                                </div>
                                <div></div>
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
                                <span>
                                  {item?.modifier ? (
                                    <>Modifier - {item?.modifier},</>
                                  ) : (
                                    ""
                                  )}{" "}
                                  {item?.modified_at ? (
                                    <>Modified At - {item?.modified_at}</>
                                  ) : (
                                    ""
                                  )}{" "}
                                </span>
                                &nbsp;
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

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
