import React, { useState } from "react";
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
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CustomModal = ({ open, onClose, selectedItem }) => {
  const [data, setData] = useState({
    head_array: [
      "Unleaded",
      "Super Unleaded",
      "Diesel",
      "Super Diesel",
      "Other",
    ],
    listing: [
      {
        id: "NnRMWitrM2srMXBXT25GSEVzYjY3dz09",
        site_name: "Spalding ",
        fuels: [
          [
            {
              id: "QXJmZHB1Si9FVWdkVWlDU1psVFlQUT09",
              time: "00:00",
              price: 1.499,
              prev_price: 1.499,
              date: "2023-08-16 00:00:00",
              prev_date: "2023-08-15 00:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "dzB4bHprM3BPNXZ3Zlp1enE5SDlvdz09",
              time: "15:00",
              price: 1.49,
              prev_price: 1.5,
              date: "2023-08-16 15:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "DOWN",
            },
            {
              id: "MkVuQTdNLzBVMnVkbzRSRnBJalFqdz09",
              time: "20:00",
              price: 1.5,
              prev_price: 1.5,
              date: "2023-08-16 20:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "SXlCQ0lpV00ydWZzNUk0SGo1SytTdz09",
              time: "",
              price: "",
              prev_price: "",
              date: "",
              prev_date: "",
              is_editable: true,
              status: "SAME",
            },
          ],
          [
            {
              id: "b2lRdVU2Y1o1RnQ3WVdYUkVFejFKUT09",
              time: "15:00",
              price: 1.66,
              prev_price: 1.658,
              date: "2023-08-16 15:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "UP",
            },
            {
              id: "dGFsL3ZhUW9VT0lQWUxYNDk1VTZBdz09",
              time: "00:00",
              price: 1.658,
              prev_price: 1.659,
              date: "2023-08-16 00:00:00",
              prev_date: "2023-08-15 00:00:00",
              is_editable: true,
              status: "DOWN",
            },
            {
              id: "T1ZtV3dFb2hKaVVLUmd1cEhrVFpadz09",
              time: "20:00",
              price: 1.658,
              prev_price: 1.658,
              date: "2023-08-16 20:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "T3ZrTmN0NEtoL2ZXZk0yU081UXdDZz09",
              time: "",
              price: "",
              prev_price: "",
              date: "",
              prev_date: "",
              is_editable: true,
              status: "SAME",
            },
          ],
          [
            {
              id: "TGsrYWV4VmNYL1YzYVVSVDJ6UzN1Zz09",
              time: "15:00",
              price: 1.52,
              prev_price: 1.53,
              date: "2023-08-16 15:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "DOWN",
            },
            {
              id: "eW0wcE9reXphQTNQSVZWVGVmdm8wZz09",
              time: "00:00",
              price: 1.53,
              prev_price: 1.529,
              date: "2023-08-16 00:00:00",
              prev_date: "2023-08-15 00:00:00",
              is_editable: true,
              status: "UP",
            },
            {
              id: "T0x3emlRMFA2cXBZb3BWZlZ2QTlkQT09",
              time: "20:00",
              price: 1.53,
              prev_price: 1.53,
              date: "2023-08-16 20:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "R0JPdlR1enFTRXpqelpGOGZ3WUlOQT09",
              time: "",
              price: "",
              prev_price: "",
              date: "",
              prev_date: "",
              is_editable: true,
              status: "SAME",
            },
          ],
          [
            {
              id: "MERHN0dzdkRXanRIaDRnRS83aEhtUT09",
              time: "00:00",
              price: 1.689,
              prev_price: 1.689,
              date: "2023-08-16 00:00:00",
              prev_date: "2023-08-15 00:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "aS9FRVRkWmI0ZDRjeElXMmhvUk9RUT09",
              time: "15:00",
              price: 1.675,
              prev_price: 1.69,
              date: "2023-08-16 15:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "DOWN",
            },
            {
              id: "SEhqb01tRENUb2hEN0p3WHRCWE9Idz09",
              time: "20:00",
              price: 1.69,
              prev_price: 1.69,
              date: "2023-08-16 20:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "ZkF3NFpUMDBPV29HbkFRbEFlRmlMQT09",
              time: "",
              price: "",
              prev_price: "",
              date: "",
              prev_date: "",
              is_editable: true,
              status: "SAME",
            },
          ],
          [
            {
              id: "cVBQdVFmOGpLVzFwKzdhRDZUbGxXZz09",
              time: "15:00",
              price: 0,
              prev_price: 0,
              date: "2023-08-16 15:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "REF0WitUVjArUS92cHlKeko3Slo4QT09",
              time: "20:00",
              price: 0,
              prev_price: 0,
              date: "2023-08-16 20:00:00",
              prev_date: "2023-08-16 20:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "MU1GblI3MDQwdXUxV0dKbUtTUlJvdz09",
              time: "00:00",
              price: 0,
              prev_price: 0,
              date: "2023-08-16 00:00:00",
              prev_date: "2023-08-15 00:00:00",
              is_editable: true,
              status: "SAME",
            },
            {
              id: "K1h2dnB5emZpN2pGOVhkZ1FGTDkydz09",
              time: "",
              price: "",
              prev_price: "",
              date: "",
              prev_date: "",
              is_editable: true,
              status: "SAME",
            },
          ],
        ],
      },
    ],
  });

  const initialValues = JSON.parse(JSON.stringify(data));

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values, "values");
      const formData = new FormData();

      values?.listing?.forEach((item) => {
        const siteId = item.id;
        console.log("formData", item);
        item.fuels.forEach((fuelArray, index) => {
          fuelArray.forEach((fuel) => {
            if (fuel.price !== "") {
              const priceId = fuel.id;
              const fieldKey = `fuels[${siteId}][${index}][${priceId}]`;
              const timeKey = `time[${siteId}][${index}][${priceId}]`;
              console.log(fieldKey, fuel.price.toString(), " fuel.price");
              console.log(timeKey, fuel?.time, " fuel.time");
              formData.append(fieldKey, fuel.price.toString());
              formData.append(timeKey, fuel.time || "");
            }
          });
        });
      });

      // Now you can use the formData for your API request or further processing
      console.log("Form data:", formData);
    },
  });

  function formatTo24Hour(time12) {
    const [time, modifier] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
    return `${hours}:${minutes}`;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      maxWidth="1800px"
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

      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                {data.head_array.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.listing[0].fuels[0].map((fuel, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <TextField
                      name={`listing[0].fuels[${rowIndex}][${rowIndex}].time`}
                      type="time"
                      value={formatTo24Hour(
                        formik.values.listing[0].fuels[rowIndex][0].time
                      )}
                      onChange={formik.handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5 minutes interval
                      }}
                      className="needed" // Apply styling if needed
                    />
                  </TableCell>
                  {data.listing[0].fuels.map((fuelPrices, columnIndex) => {
                    const fuelPriceId = fuelPrices[rowIndex].id;
                    return (
                      <TableCell key={fuelPriceId}>
                        {fuelPrices[rowIndex].is_editable ? (
                          <TextField
                            style={{
                              color: "blue",
                              fontSize: "16px",
                              width: "200px",
                            }}
                            type="number"
                            name={`listing[0].fuels[${columnIndex}][${rowIndex}].price`}
                            value={
                              formik.values.listing[0].fuels[columnIndex][
                                rowIndex
                              ].price
                            }
                            onChange={formik.handleChange}
                            className="fuelprice-input"
                          />
                        ) : (
                          <span>{fuelPrices[rowIndex].price}</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <button className="btn btn-danger me-2" type="submit" onClick={onClose}>
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
  );
};

export default CustomModal;
