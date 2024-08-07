import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    TableContainer,
} from "@mui/material";
import { Card, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoaderImg from "../../../Utils/Loader";
import { handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const CompiMiddayModal = ({
    open,
    onClose,
    selectedItem,
    selectedDrsDate,
    setSelectedDrsDate,
    onDataFromChild,
    getCompetitorsPrice,
}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [notificationTypes, setNotificationTypes] = useState({
        mobileSMS: false,
        email: false,
    });

    const navigate = useNavigate();


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
                    `/site/fuel-price/mid-day?site_id=${selectedItem}&drs_date=${selectedDrsDate}`
                );

                const responseData = response?.data?.data;
                setData(responseData);

                // Initialize Formik values with the fetched data
                formik.setValues({
                    siteId: selectedItem, // Save site_id in Formik
                    siteName: selectedItem?.site_name,
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


                if (responseData?.update_tlm_price == 1) {
                    formik.setFieldValue("update_tlm_price", true)
                }


            } catch (error) {
                console?.error("API error:", error);
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
            update_tlm_price: false
        },
        onSubmit: (values) => {
            // Handle form submission
            handleSubmit(values);
        },
    });

    const handleSubmit = async (values) => {
        setIsLoading(true);
        const formData = new FormData();

        values?.listing?.forEach((listing) => {
            listing.fuels.forEach((fuelGroup) => {
                fuelGroup?.forEach((fuel) => {
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
                });
            });
        });

        const isMobileSelected = selected.some(option => option.value === "mobile-sms");
        const isEmailSelected = selected.some(option => option.value === "email");

        formData.append("drs_date", selectedDrsDate);
        formData.append("site_id", selectedItem);
        formData.append("send_sms", notificationTypes?.mobileSMS);
        formData.append("notify_operator", notificationTypes?.email);
        formData.append("update_tlm_price", values?.update_tlm_price);
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
                // navigate("/fuelprice");
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

    const handleCheckboxChange = (name) => {
        setNotificationTypes((prevTypes) => ({
            ...prevTypes,
            [name]: !prevTypes[name],
        }));
    };

    const hadndleShowDate = () => {
        const inputDateElement = document.querySelector('input[type="date"]');
        inputDateElement.showPicker();
    };


    console.log(formik?.values, "formik values");



    return (
        <>
            {isLoading ? <LoaderImg /> : null}
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
                        {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
                        <span> ({selectedDrsDate})</span>
                    </div>
                    <span onClick={onClose}>
                        <button className="close-button">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </span>
                </span>
                {isLoading ? <LoaderImg /> : null}

                <DialogContent>

                    <Row>
                        <Col lg={3} md={3}>
                            <div className="" >
                                <div className="form-group">
                                    <label htmlFor="start_date" className="form-label mt-4">
                                        Date
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        // min={"2023-01-01"}
                                        // min={!isAdmin ? minDate : undefined}
                                        // max={getCurrentDate()}
                                        // onClick={hadndleShowDate}
                                        className={`input101 ${formik.errors.start_date &&
                                            formik.touched.start_date
                                            ? "is-invalid"
                                            : ""
                                            }`}
                                        value={selectedDrsDate}
                                        id="start_date"
                                        name="start_date"
                                        onChange={(e) => {
                                            const selectedCompany = e.target.value;
                                            formik.setFieldValue("start_date", selectedCompany);
                                            setSelectedDrsDate(selectedCompany);
                                        }}
                                    ></input>
                                    {formik.errors.start_date &&
                                        formik.touched.start_date && (
                                            <div className="invalid-feedback">
                                                {formik.errors.start_date}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </Col>
                    </Row>
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
                                        {data?.head_array?.map((header, columnIndex) => (
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
                                                        placeholder="Enter Values"
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
                        {/* <div className="Notification">
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
                Send Notifications
              </label>
            </div> */}
                        {/* <div
              //  className="Notification"
              style={{ width: "200px", textAlign: "left" }}
            >
              {!selected.length && (
                <>
                  {setSelected([{ label: "Send Notification Type", value: "", disabled: true }])}
                </>
              )}


              <MultiSelect
                value={selected}
                onChange={(values) => {
                  // Remove the placeholder option if it's selected
                  const updatedSelection = values.filter((value) => value.value !== "");
                  setSelected(updatedSelection);
                }}
                disableSearch={true}
                options={[
                  { label: "Mobile SMS Notification", value: "mobile-sms" },
                  { label: "Email Notification", value: "email" }
                ]}
                showCheckbox="false"
                style={{ width: "200px" }}
                placeholder="Notification Type"
              />

            </div> */}
                        {/* <div>
              <strong>Send Notification</strong>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="mobileSMS"
                      checked={notificationTypes.mobileSMS}
                      onChange={() => handleCheckboxChange("mobileSMS")}
                    />
                    {" "}Mobile
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="email"
                      checked={notificationTypes.email}
                      onChange={() => handleCheckboxChange("email")}
                    />
                    {" "}Email
                  </label>
                </div>
              </div>
            </div> */}

                        {data?.update_tlm_price == 1 && (<>
                            <div className="pointer" onClick={() => formik.setFieldValue('update_tlm_price', !formik.values.update_tlm_price)}>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="update_tlm_price"
                                            onChange={formik?.handleChange}
                                            checked={formik.values.update_tlm_price}
                                            className="form-check-input pointer mx-2"
                                        />
                                        <label htmlFor={"update_tlm_price"} className="mt-1 ms-6 pointer">
                                            Update TLM Price
                                        </label>

                                    </div>
                                </div>
                            </div>
                        </>)}



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
            </Dialog >
        </>
    );
};

export default CompiMiddayModal;