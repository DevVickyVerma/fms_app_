import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Row, Col, Form, Card } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CustomModal = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const SuccessAlert = (message) => {
    toast.success(message, {
      autoClose: 500,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 500,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorAlert = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored",
    });
  };
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        setIsLoading(true); // Set loading state to true before fetching data

        const response = await axiosInstance.get(
          `/site/fuel-price/mid-day?site_id=${selectedItem.id}&drs_date=${selectedDrsDate}`
        );

        const responseData = response?.data?.data;
        setData(responseData);

        // Initialize Formik values with the fetched data
        formik.setValues({
          siteId: selectedItem.id, // Save site_id in Formik
          siteName: selectedItem.site_name,
          listing: responseData?.listing?.map((listingItem) => ({
            fuels: listingItem?.fuels?.map((fuelArray) =>
              fuelArray.map((fuel) => ({
                time: fuel.time,
                price: fuel.price || "",
                priceid: fuel.id || "",
              }))
            ),
          })),
        });
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false); // Set loading state to false after data fetching is complete
      }
    };

    fetchData();
  }, [selectedItem, selectedDrsDate]); // Add selectedDrsDate to the dependency array

  let initialValues = {}; // Initialize initialValues as an empty object

  if (data) {
    initialValues = {
      ...data,
      // You might need to adjust this part depending on your data structure
    };
  }

  const formik = useFormik({
    initialValues: {
      listing: data?.listing || [], // Initialize with fetched data or an empty array
    },
    onSubmit: (values) => {
      // Handle form submission

      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    values.listing.forEach((listing) => {
      listing.fuels.forEach((fuelGroup) => {
        fuelGroup.forEach((fuel) => {
          const siteId = values.siteId;
          const priceId = fuel.priceid;

          const fieldKey = `fuels[${siteId}][${priceId}]`;
          const timeKey = `time[${siteId}][${priceId}]`;
          const fieldValue = fuel.price.toString();
          const fieldTime = fuel.time;
          // Add validation to check if fieldValue and fieldTime are not empty, null, or undefined
          if (
            fieldValue !== "" &&
            fieldValue !== null &&
            fieldValue !== undefined &&
            fieldTime !== "" &&
            fieldTime !== null &&
            fieldTime !== undefined
          ) {
            // Append the fuel price and time to the FormData
            formData.append(fieldKey, fieldValue);
            formData.append(timeKey, fieldTime);
          }
          // formData.append(fieldKey, fieldValue);
          // formData.append(timeKey, fieldTime);
        });
      });
    });

    formData.append("drs_date", selectedDrsDate);
    formData.append("site_id", selectedItem.id);
    formData.append("notify_operator", isChecked);
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.post(
        "/site/fuel-price/update-siteprice",
        formData
      );

      if (response.status === 200 && response.data.api_response === "success") {
        sendDataToParent();
        SuccessAlert(response.data.message);
        navigate("/fuelprice");
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
  const handleTimeChange = (columnIndex, rowIndex, newTime) => {
    formik.setFieldValue(
      `listing[0].fuels[${columnIndex}][${rowIndex}].time`,
      newTime
    );

    // Update other cells in the same column with the new time
    const numColumns = data?.listing?.[0]?.fuels.length;
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
      if (colIndex !== columnIndex) {
        formik.setFieldValue(
          `listing[0].fuels[${colIndex}][${rowIndex}].time`,
          newTime
        );
      }
    }
  };
  const SendNotification = (event) => {
    setIsChecked(event.target.checked);
  };
  const sendDataToParent = () => {
    const dataToSend = "Data from child 123";
    onDataFromChild(dataToSend); // Call the callback function with the data
  };
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Dialog
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
            <span> {selectedItem?.site_name}</span>
            <span> ({selectedDrsDate})</span>
          </div>
          <span onClick={onClose}>
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>
        {isLoading ? <Loaderimg /> : null}

        <DialogContent>
          <TableContainer>
            <div className="table-container table-responsive">
              <table className="table">
                <thead
                  style={{
                    background: "#aeb1bd",
                    color: "#000",
                    fontWeight: "700",
                  }}
                >
                  <tr>
                    <th>Time</th>
                    {data?.head_array.map((header, columnIndex) => (
                      <th key={columnIndex}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.listing?.[0]?.fuels?.[0]?.map((fuel, rowIndex) => (
                    <tr key={rowIndex} className="middayModal-tr">
                      <td className="middayModal-td">
                        {fuel.is_editable ? (
                          <input
                            className="table-input"
                            name={`listing[0].fuels[0][${rowIndex}].time`}
                            type="time"
                            value={
                              formik.values?.listing[0]?.fuels[0][rowIndex]
                                ?.time
                            }
                            onChange={
                              (e) =>
                                handleTimeChange(0, rowIndex, e.target.value) // Column index is 0
                            }
                          />
                        ) : (
                          <span>
                            {
                              formik.values?.listing[0]?.fuels[0][rowIndex]
                                ?.time
                            }
                          </span>
                        )}
                      </td>
                      {data?.listing?.[0]?.fuels?.map(
                        (fuelPrices, columnIndex) => (
                          <td key={columnIndex} className="middayModal-td">
                            {fuelPrices[rowIndex]?.is_editable ? (
                              <input
                                className={`table-input ${
                                  fuelPrices[rowIndex]?.status === "UP"
                                    ? "table-inputGreen"
                                    : fuelPrices[rowIndex]?.status === "DOWN"
                                    ? "table-inputRed"
                                    : ""
                                }`}
                                type="number"
                                name={`listing[0].fuels[${columnIndex}][${rowIndex}].price`}
                                value={
                                  formik.values?.listing[0]?.fuels[columnIndex][
                                    rowIndex
                                  ]?.price
                                }
                                onChange={formik.handleChange}
                                step="0.010"
                              />
                            ) : (
                              <span>{fuelPrices[rowIndex]?.price}</span>
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableContainer>
        </DialogContent>
        <Card.Footer>
          <div className="text-end notification-class">
            <div className="Notification">
              <input
                type="checkbox"
                id="notificationCheckboxmidday" // Add an id attribute here
                checked={isChecked}
                onChange={SendNotification}
              />
              <label
                htmlFor="notificationCheckboxmidday"
                className="form-label ms-2 "
              >
                Send Notification
              </label>
            </div>

            <button
              className="btn btn-danger me-2"
              type="submit"
              onClick={onClose}
            >
              Close
            </button>
            {data?.btn_clickable ? (
              <button
                className="btn btn-primary me-2"
                type="submit"
                onClick={formik.handleSubmit}
              >
                Submit
              </button>
            ) : (
              ""
            )}
          </div>
        </Card.Footer>
      </Dialog>
    </>
  );
};

export default CustomModal;
