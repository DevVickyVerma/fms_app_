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
  Slide,
} from "@mui/material";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CustomModal = ({ open, onClose, selectedItem, selectedDrsDate }) => {
  // const [data, setData] = useState({
  //   head_array: [
  //     "Unleaded",
  //     "Super Unleaded",
  //     "Diesel",
  //     "Super Diesel",
  //     "Other",
  //   ],
  //   listing: [
  //     {
  //       id: "NnRMWitrM2srMXBXT25GSEVzYjY3dz09",
  //       site_name: "Spalding ",
  //       fuels: [
  //         [
  //           {
  //             id: "QXJmZHB1Si9FVWdkVWlDU1psVFlQUT09",
  //             time: "00:00",
  //             price: 1.499,
  //             prev_price: 1.499,
  //             date: "2023-08-16 00:00:00",
  //             prev_date: "2023-08-15 00:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "dzB4bHprM3BPNXZ3Zlp1enE5SDlvdz09",
  //             time: "15:00",
  //             price: 1.49,
  //             prev_price: 1.5,
  //             date: "2023-08-16 15:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "DOWN",
  //           },
  //           {
  //             id: "MkVuQTdNLzBVMnVkbzRSRnBJalFqdz09",
  //             time: "20:00",
  //             price: 1.5,
  //             prev_price: 1.5,
  //             date: "2023-08-16 20:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "SXlCQ0lpV00ydWZzNUk0SGo1SytTdz09",
  //             time: "",
  //             price: "",
  //             prev_price: "",
  //             date: "",
  //             prev_date: "",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //         ],
  //         [
  //           {
  //             id: "b2lRdVU2Y1o1RnQ3WVdYUkVFejFKUT09",
  //             time: "15:00",
  //             price: 1.66,
  //             prev_price: 1.658,
  //             date: "2023-08-16 15:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "UP",
  //           },
  //           {
  //             id: "dGFsL3ZhUW9VT0lQWUxYNDk1VTZBdz09",
  //             time: "00:00",
  //             price: 1.658,
  //             prev_price: 1.659,
  //             date: "2023-08-16 00:00:00",
  //             prev_date: "2023-08-15 00:00:00",
  //             is_editable: true,
  //             status: "DOWN",
  //           },
  //           {
  //             id: "T1ZtV3dFb2hKaVVLUmd1cEhrVFpadz09",
  //             time: "20:00",
  //             price: 1.658,
  //             prev_price: 1.658,
  //             date: "2023-08-16 20:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "T3ZrTmN0NEtoL2ZXZk0yU081UXdDZz09",
  //             time: "",
  //             price: "",
  //             prev_price: "",
  //             date: "",
  //             prev_date: "",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //         ],
  //         [
  //           {
  //             id: "TGsrYWV4VmNYL1YzYVVSVDJ6UzN1Zz09",
  //             time: "15:00",
  //             price: 1.52,
  //             prev_price: 1.53,
  //             date: "2023-08-16 15:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "DOWN",
  //           },
  //           {
  //             id: "eW0wcE9reXphQTNQSVZWVGVmdm8wZz09",
  //             time: "00:00",
  //             price: 1.53,
  //             prev_price: 1.529,
  //             date: "2023-08-16 00:00:00",
  //             prev_date: "2023-08-15 00:00:00",
  //             is_editable: true,
  //             status: "UP",
  //           },
  //           {
  //             id: "T0x3emlRMFA2cXBZb3BWZlZ2QTlkQT09",
  //             time: "20:00",
  //             price: 1.53,
  //             prev_price: 1.53,
  //             date: "2023-08-16 20:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "R0JPdlR1enFTRXpqelpGOGZ3WUlOQT09",
  //             time: "",
  //             price: "",
  //             prev_price: "",
  //             date: "",
  //             prev_date: "",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //         ],
  //         [
  //           {
  //             id: "MERHN0dzdkRXanRIaDRnRS83aEhtUT09",
  //             time: "00:00",
  //             price: 1.689,
  //             prev_price: 1.689,
  //             date: "2023-08-16 00:00:00",
  //             prev_date: "2023-08-15 00:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "aS9FRVRkWmI0ZDRjeElXMmhvUk9RUT09",
  //             time: "15:00",
  //             price: 1.675,
  //             prev_price: 1.69,
  //             date: "2023-08-16 15:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "DOWN",
  //           },
  //           {
  //             id: "SEhqb01tRENUb2hEN0p3WHRCWE9Idz09",
  //             time: "20:00",
  //             price: 1.69,
  //             prev_price: 1.69,
  //             date: "2023-08-16 20:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "ZkF3NFpUMDBPV29HbkFRbEFlRmlMQT09",
  //             time: "",
  //             price: "",
  //             prev_price: "",
  //             date: "",
  //             prev_date: "",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //         ],
  //         [
  //           {
  //             id: "cVBQdVFmOGpLVzFwKzdhRDZUbGxXZz09",
  //             time: "15:00",
  //             price: 0,
  //             prev_price: 0,
  //             date: "2023-08-16 15:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "REF0WitUVjArUS92cHlKeko3Slo4QT09",
  //             time: "20:00",
  //             price: 0,
  //             prev_price: 0,
  //             date: "2023-08-16 20:00:00",
  //             prev_date: "2023-08-16 20:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "MU1GblI3MDQwdXUxV0dKbUtTUlJvdz09",
  //             time: "00:00",
  //             price: 0,
  //             prev_price: 0,
  //             date: "2023-08-16 00:00:00",
  //             prev_date: "2023-08-15 00:00:00",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //           {
  //             id: "K1h2dnB5emZpN2pGOVhkZ1FGTDkydz09",
  //             time: "",
  //             price: "",
  //             prev_price: "",
  //             date: "",
  //             prev_date: "",
  //             is_editable: true,
  //             status: "SAME",
  //           },
  //         ],
  //       ],
  //     },
  //   ],
  // });
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
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
  const ErrorAlert = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  const SuccessAlert = (message) => toast.success(message);

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

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    formData.append("drs_date", selectedDrsDate);
    formData.append("site_id", selectedItem.id);
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(values, "values");

    try {
      const response = await axiosInstance.post(
        "/site/fuel-price/update-siteprice",
        formData
      );

      if (response.status === 200) {
        SuccessAlert("Fuel prices has been updated successfully");
        navigate("/fuelprice");
        onClose();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="1900px"
      >
        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
          className="ModalTitle"
        >
          <span
          // className="ModalTitle"
          >
            {" "}
            {selectedItem?.site_name}
          </span>
          <span
            // className="ModalTitle"
            onClick={onClose}
          >
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>
        {isLoading ? <Loaderimg /> : null}

        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  {data?.head_array.map((header, columnIndex) => (
                    <TableCell key={columnIndex}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.listing?.[0]?.fuels?.[0]?.map((fuel, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      {fuel.is_editable ? (
                        <TextField
                          name={`listing[0].fuels[${rowIndex}][0].time`}
                          type="time"
                          value={
                            formik.values?.listing[0]?.fuels[rowIndex][0]
                              ?.time || "00:00"
                          }
                          onChange={formik.handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 minutes interval
                          }}
                        />
                      ) : (
                        <span>{fuel?.time || "00:00"}</span>
                      )}
                    </TableCell>
                    {data?.listing?.[0]?.fuels?.map(
                      (fuelPrices, columnIndex) => {
                        const fuelPriceId = fuelPrices[rowIndex]?.id || "";
                        return (
                          <TableCell key={fuelPriceId}>
                            {fuelPrices[rowIndex]?.is_editable ? (
                              <TextField
                                type="number"
                                name={`listing[0].fuels[${columnIndex}][${rowIndex}].price`}
                                value={
                                  formik.values?.listing?.[0]?.fuels?.[
                                    columnIndex
                                  ]?.[rowIndex]?.price || ""
                                }
                                onChange={formik.handleChange}
                                className="inputwidth"
                              />
                            ) : (
                              <span>{fuelPrices[rowIndex]?.price}</span>
                            )}
                          </TableCell>
                        );
                      }
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-danger me-2"
            type="submit"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="btn btn-primary me-2"
            type="submit"
            onClick={formik.handleSubmit}
          >
            Submit
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomModal;
