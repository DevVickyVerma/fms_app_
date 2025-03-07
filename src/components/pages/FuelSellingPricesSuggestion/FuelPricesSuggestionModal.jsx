import React from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, TableContainer } from "@mui/material";
import { Card, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
// import Loaderimg from "../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../../components/CommonComponent/useErrorHandler";
import withApi from "../../../Utils/ApiHelper";
import MiddayFuelPrice from "../../../components/pages/ManageFuelPrices/MiddayFuelPrice";
import CompetitorfuelpricesUpdate from "../../../components/pages/ManageFuelPrices/competitorfuelpricesUpdate";
import { useSelector } from "react-redux";
import LoaderImg from "../../../Utils/Loader";

const FuelPricesSuggestionModal = ({
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
  const [data, setData] = useState(null); // Initialize data as null
  const [isLoading, setIsLoading] = useState(false);
  const [hasListing, setHasListing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (selectedItem && selectedDrsDate) {
        try {
          setIsLoading(true);

          const response = await getData(
            `/site/competitor-price/listing?site_id=${accordionSiteID}&drs_date=${selectedDrsDate}`
          );

          const responseData = response?.data?.data;

          if (responseData?.listing) {
            setHasListing(true);
          } else {
            setHasListing(false);
          }
          setData(responseData);
          if (responseData?.listing) {
            const initialValues = {
              siteId: accordionSiteID,
              siteName: selectedItem.competitorname,
              listing: responseData.listing[0]?.competitors || [],
            };
            formik.setValues(initialValues);
          } else {
            // Set initialValues to an empty object or your preferred default values
            const initialValues = {
              siteId: "",
              siteName: "",
              listing: [],
            };
            formik.setValues(initialValues);
          }

          // Initialize the form with default values
        } catch (error) {
          console.error("API error:", error);
          handleError(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedItem, selectedDrsDate]);

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
  const handleFormSubmit = (values) => {
    console.log(values, "submited");

    // const dataToSend = "Data from child 123";
    // onDataFromChild(dataToSend);
  };

  return (
    <>
      {isLoading ? <LoaderImg /> : null}

      <Modal
        show={open}
        onHide={onClose}
        centered
        size={"xl"}
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
              <div className="">
                <span> {selectedItem?.competitorname}</span>
                <span> ({selectedDrsDate})</span>
              </div>
              <span onClick={onClose}>
                <button className="close-button">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            </span>
          </Modal.Header>

          <form onSubmit={formik.handleSubmit}>
            <Card.Body>
              {hasListing ? (
                <TableContainer>
                  <div className="table-container table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Competitor</th>

                          {data?.head_array?.map((header, columnIndex) => (
                            <th key={columnIndex}>{header}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {formik.values.listing.map(
                          (competitor, competitorIndex) => (
                            <tr key={competitor.id} className="middayModal-tr">
                              <td className="middayModal-td text-muted fs-15 fw-semibold">
                                {competitor.competitor_name}
                              </td>

                              {competitor.fuels.map((fuel, fuelIndex) => (
                                <td key={fuel.id} className="middayModal-td">
                                  {!fuel.is_editable ? (
                                    <input
                                      className={`table-input readonly`}
                                      readOnly
                                      type="number"
                                      step="0.010"
                                      name={`listing[${competitorIndex}].fuels[${fuelIndex}].price`}
                                      value={
                                        formik.values.listing[competitorIndex]
                                          .fuels[fuelIndex].price
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  ) : (
                                    <span>{fuel.price}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </TableContainer>
              ) : (
                <p>No Data...........</p>
              )}

              {userPermissions?.includes("fuel-suggestion-create") && data ? (
                <CompetitorfuelpricesUpdate
                  data={data}
                  postData={postData}
                  handleFormSubmit={handleFormSubmit}
                  accordionSiteID={accordionSiteID}
                />
              ) : (
                <div></div> // Optionally provide a fallback UI
              )}
            </Card.Body>
          </form>
        </div>
      </Modal>

      {/* <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="100px"
      >
        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
          className="ModalTitle"
        >
          <div className="ModalTitle-date">
            <span> {selectedItem?.competitorname}</span>
            <span> ({selectedDrsDate})</span>
          </div>
          <span onClick={onClose}>
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>

        <DialogContent>
          {hasListing ? (
            <TableContainer>
              <div className="table-container table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Competitor</th>

                      {data?.head_array?.map((header, columnIndex) => (
                        <th key={columnIndex}>{header}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {formik.values.listing.map(
                      (competitor, competitorIndex) => (
                        <tr key={competitor.id} className="middayModal-tr">
                          <td className="middayModal-td text-muted fs-15 fw-semibold">
                            {competitor.competitor_name}
                          </td>

                          {competitor.fuels.map((fuel, fuelIndex) => (
                            <td key={fuel.id} className="middayModal-td">
                              {!fuel.is_editable ? (
                                <input
                                  className={`table-input readonly`}
                                  readOnly
                                  type="number"
                                  step="0.010"
                                  name={`listing[${competitorIndex}].fuels[${fuelIndex}].price`}
                                  value={
                                    formik.values.listing[competitorIndex]
                                      .fuels[fuelIndex].price
                                  }
                                  onChange={formik.handleChange}
                                />
                              ) : (
                                <span>{fuel.price}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </TableContainer>
          ) : (
            <p>No Data...........</p>
          )}
        </DialogContent>

        {userPermissions?.includes("fuel-suggestion-create") && data ? (
          <CompetitorfuelpricesUpdate
            data={data}
            postData={postData}
            handleFormSubmit={handleFormSubmit}
            accordionSiteID={accordionSiteID}
          />
        ) : (
          <div></div> // Optionally provide a fallback UI
        )}
      </Dialog> */}
    </>
  );
};

export default withApi(FuelPricesSuggestionModal);
