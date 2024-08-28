import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, TableContainer } from "@mui/material";
import { Card } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { handleError, SuccessAlert } from "../../Utils/ToastUtils";
import InputTime from "../../components/pages/Competitor/InputTime";

const CustomModal = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
}) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [Showerrormessage, setShowerrormessage] = useState("");
  const [notificationTypes, setNotificationTypes] = useState({
    mobileSMS: false,
    email: false,
  });


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
        setIsLoading(true);

        const response = await axiosInstance.get(
          `/site/fuel-price/mid-day?site_id=${selectedItem.id}&drs_date=${selectedDrsDate}`
        );

        const responseData = response?.data?.data;
        if (responseData) {
          setData(responseData);

          formik.setValues({
            siteId: selectedItem.id,
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

        }


        if (responseData?.update_tlm_price === 1) {
          formik.setFieldValue("update_tlm_price", true);
        }
      } catch (error) {
        console?.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedItem, selectedDrsDate]);

  const formik = useFormik({
    initialValues: {
      listing: data?.listing || [],
      update_tlm_price: false,
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    let isValid = true;
    let validationMessage = "";

    values?.listing.forEach((item) => {
      if (Array.isArray(item.fuels)) {
        item.fuels[0].forEach((_, fuelItemIndex) => {
          let hasPriceAtIndex = false;

          item.fuels.forEach((fuelArray) => {
            const priceAtIndex = fuelArray[fuelItemIndex].price;

            if (
              priceAtIndex !== null &&
              priceAtIndex !== undefined &&
              priceAtIndex !== ""
            ) {
              hasPriceAtIndex = true;
            }
          });

          if (hasPriceAtIndex) {
            item.fuels.forEach((fuelArray) => {
              const priceAtIndex = fuelArray[fuelItemIndex].price;

              if (
                priceAtIndex === null ||
                priceAtIndex === undefined ||
                priceAtIndex === ""
              ) {
                isValid = false;
                validationMessage += `Row ${fuelItemIndex + 1}:\nInput must not be empty.\n`;
              }
            });
          }
        });
      }
    });

    if (!isValid) {
      setShowerrormessage(validationMessage);
      setIsLoading(false);
    } else {
      setShowerrormessage("");
      values.listing.forEach((listing) => {
        listing.fuels.forEach((fuelGroup) => {
          fuelGroup.forEach((fuel) => {
            const siteId = values.siteId;
            const priceId = fuel.priceid;

            const fieldKey = `fuels[${siteId}][${priceId}]`;
            const timeKey = `time[${siteId}][${priceId}]`;
            const fieldValue = fuel.price.toString();
            const fieldTime = fuel.time;

            if (
              fieldValue !== "" &&
              fieldValue !== null &&
              fieldValue !== undefined &&
              fieldTime !== "" &&
              fieldTime !== null &&
              fieldTime !== undefined
            ) {
              formData.append(fieldKey, fieldValue);
              formData.append(timeKey, fieldTime);
            }
          });
        });
      });

      formData.append("drs_date", selectedDrsDate);
      formData.append("site_id", selectedItem.id);
      formData.append("send_sms", notificationTypes?.mobileSMS);
      formData.append("notify_operator", notificationTypes?.email);
      if (
        values?.update_tlm_price
      ) {
        formData.append("update_tlm_price", values?.update_tlm_price);
      }


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

        if (
          response.status === 200 &&
          response.data.api_response === "success"
        ) {
          onClose()
          sendDataToParent();
          SuccessAlert(response.data.message);
        } else {
          // Handle other cases or errors here
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTimeChange = (rowIndex, columnIndex, newTime) => {
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

  const sendDataToParent = () => {
    const dataToSend = "Data from child 123";
    onDataFromChild(dataToSend);
  };

  return (
    <>
      {isLoading && <Loaderimg />}
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
        {isLoading && <Loaderimg />}
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

                          <>
                            <InputTime
                              label="Time"
                              value={
                                formik.values?.listing[0]?.fuels[0][rowIndex]?.time
                              }
                              onChange={(newValue) =>
                                handleTimeChange(rowIndex, 0, newValue)
                              }
                            // onKeyDown={(e) => e.preventDefault()}
                            // onKeyUp={(e) => e.preventDefault()}
                            />
                          </>
                        ) : (
                          <span>
                            {
                              formik.values?.listing[0]?.fuels[0][rowIndex]
                                ?.time
                            }
                          </span>
                        )}
                      </td>
                      {data?.listing?.[0]?.fuels?.map((fuelPrices, columnIndex) => (
                        <td key={columnIndex} className="middayModal-td">
                          {fuelPrices[rowIndex]?.is_editable ? (
                            <input
                              className={`table-input ${fuelPrices[rowIndex]?.status === "UP"
                                ? "table-inputGreen"
                                : fuelPrices[rowIndex]?.status === "DOWN"
                                  ? "table-inputRed"
                                  : ""
                                }`}
                              type="number"
                              placeholder="Enter Values"
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
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableContainer>
        </DialogContent>
        <Card.Footer>
          <div className="text-end notification-class">
            {data?.update_tlm_price === 1 && (
              <div
                className="pointer"
                onClick={() =>
                  formik.setFieldValue(
                    "update_tlm_price",
                    !formik.values.update_tlm_price
                  )
                }
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <div>
                    <input
                      type="checkbox"
                      name="update_tlm_price"
                      onChange={formik.handleChange}
                      checked={formik.values.update_tlm_price}
                      className="form-check-input pointer mx-2"
                    />
                    <label
                      htmlFor={"update_tlm_price"}
                      className="mt-1 ms-6 pointer"
                    >
                      Update TLM Price
                    </label>
                  </div>
                </div>
              </div>
            )}
            {Showerrormessage && (
              <span style={{ fontSize: "13px" }} className="custom-error-class">
                {Showerrormessage}
              </span>
            )}

            <button
              className="btn btn-danger me-2"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
            {data?.btn_clickable && (
              <button
                className="btn btn-primary me-2"
                type="button"
                onClick={formik.handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </Card.Footer>
      </Dialog>
    </>
  );
};

export default CustomModal;
