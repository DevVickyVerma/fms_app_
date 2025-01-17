import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from "formik";
import { Card, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import InputTime from "../Competitor/InputTime";
import ConfirmModal from "./ConfirmModal";

const PublicCompetitorFuelPricesUpdate = ({
  data,
  postData,
  handleFormSubmit,
  accordionSiteID,
}) => {
  const { notify_operator, update_tlm_price } = data || {};
  const [filterData, setFilterData] = useState();
  const [formValues, setFormValues] = useState(null); // State to hold form values
  const [priceSuggestionEditable, setPriceSuggestionEditable] = useState(false);
  const [isEdited, setIsEdited] = useState(false); // Track if user has edited any input

  const formik = useFormik({
    initialValues: {
      columns: [],
      rows: [],
      head_array: [],
      update_tlm_price: false,
      notify_operator: false,
      confirmation_required: true,
      pricedata: [],
    },
    enableReinitialize: true,
    onSubmit: () => {
      // Your submit logic here
    },
  });

  const standardizeName = (name) => name?.toLowerCase().replace(/\s+/g, "_");
  const validationSchema = Yup.object({
    fuels: Yup.array().of(
      Yup.array().of(
        Yup.object({
          date: Yup.string().required("Date is required"),
          time: Yup.string().required("Time is required"),
          price: Yup.number().required("Price is required"),
        })
      )
    ),
  });

  const fuels = [];
  const lsitingformik = useFormik({
    initialValues: { fuels },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
      setFormValues(values); // Store form values
      // setIsModalOpen(true); // Open the modal
    },
  });

  const { id: prarmSiteID } = useParams();

  useEffect(() => {
    if (data) {
      //   Standardize column names
      const columns = data?.head_arrayMain?.map((item) =>
        standardizeName(item.name)
      );
      const firstRow = data?.current[0] || [];
      const rows = firstRow?.reduce((acc, item) => {
        const standardizedName = standardizeName(item.name);
        acc.date = item.date;
        acc.time = item.time;
        acc[standardizedName] = item.price;
        acc.readonly = !item?.is_editable;
        acc.currentprice = item.status === "SAME";
        return acc;
      }, {});

      formik.setValues({
        columns: columns,
        rows: [rows], // Make sure rows is an array with one object
        update_tlm_price: data?.update_tlm_price,
        confirmation_required: data?.confirmation_required,
        notify_operator: data?.notify_operator,
        head_array: data?.head_array,
        pricedata: data,
      });
      lsitingformik.setValues({
        fuels: data?.fuels,
      });
    }
  }, [data]);

  const handleChange = (e, rowIndex, column) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
    formik.setFieldValue(`rows[${rowIndex}].${column}`, value);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("site_id", accordionSiteID);
      if (formik?.values?.update_tlm_price == 1) {
        formData.append(
          "update_tlm_price",
          formik?.values?.update_tlm_price == 1 ? true : false
        );
        formData.append(
          "confirmation_required",
          formik?.values?.confirmation_required == 1 ? true : false
        );
      }

      if (formik?.values?.notify_operator) {
        formData.append("notify_operator", formik?.values?.notify_operator);
      }

      const flattenedData = values?.fuels?.flat();
      const editableItems = flattenedData.filter((item) => item?.is_editable);

      formData.append(`drs_date`, editableItems[0]?.date);
      formData.append(`time`, editableItems[0]?.time);

      values?.fuels.flat().forEach((item) => {
        if (item?.is_editable) {
          formData.append(`fuels[${item.id}]`, item.price);
        }
      });

      const postDataUrl = "/site/fuel-price/suggestion/add";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

      // handleFormSubmit()
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };

  const handleShowDate = (e) => {
    const inputDateElement = e.target; // Get the clicked input element
    if (inputDateElement && inputDateElement.showPicker) {
      inputDateElement.showPicker(); // Programmatically trigger the date picker
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the form from submitting
    }
  };

  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let updatedStoredData = JSON.parse(storedData);
      setFilterData(updatedStoredData);
    }
  }, [storedKeyName, storedData]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    handleSubmit(formValues);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without submitting
  };
  const handleEditPrice = () => {
    setPriceSuggestionEditable(true); // Close the modal without submitting
  };

  // Track changes to detect if user has edited any field
  const handleFieldChange = (e, rowIndex, itemIndex) => {
    lsitingformik.handleChange(e);
    setIsEdited(true); // Mark as edited when any input changes
  };

  const handleClearPrice = () => {
    setPriceSuggestionEditable(false); // Clear and make field non-editable
    setIsEdited(false);
  };

  return (
    <>
      <hr />
      <div style={{ overflowY: "auto" }}>
        <>
          <h3 className="card-title w-100">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <span>
                  Fuel Selling Price Suggestion For Chalfonts Way Sf Connect
                  {/* {formik?.values?.competitorname}{" "} */}
                </span>
                <span className="d-flex pt-1 align-items-center fs-12">
                  <span className="greenboxx me-2"></span>
                  <span className="text-muted">Current Price</span>
                </span>
              </div>
              <div>
                {!priceSuggestionEditable && (
                  <i
                    className="ph ph-pencil-simple pointer"
                    onClick={() => handleEditPrice()}
                  ></i>
                )}

                {priceSuggestionEditable && (
                  <i
                    className="ph ph-x pointer work-flow-danger-status"
                    onClick={handleClearPrice} // Call clear handler
                  ></i>
                )}
              </div>
            </div>
          </h3>
        </>
        <>
          <FormikProvider value={lsitingformik}>
            <Form onKeyDown={handleKeyDown}>
              <div className="table-container ">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="middy-table-head">Date</th>
                      <th className="middy-table-head">Time</th>
                      {formik.values?.head_array?.map((item) => (
                        <th key={item?.id} className="middy-table-head">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {formik?.values?.rows?.map((row, rowIndex) => (
                      <tr className="middayModal-tr" key={rowIndex}>
                        {formik?.values?.columns?.map((column, colIndex) => (
                          <React.Fragment key={colIndex}>
                            <td
                              className={`time-input-fuel-sell ${
                                column === "time"
                                  ? "middayModal-time-td "
                                  : "middayModal-td "
                              }`}
                              key={colIndex}
                            >
                              {column === "date" ? (
                                <input
                                  type="date"
                                  className={`table-input  ${
                                    row.currentprice ? "fuel-readonly" : ""
                                  } ${
                                    row?.readonly
                                      ? "readonly update-price-readonly"
                                      : ""
                                  }`}
                                  value={formik?.values?.pricedata?.currentDate}
                                  name={row?.[column]}
                                  onChange={(e) =>
                                    handleChange(e, rowIndex, column)
                                  }
                                  onClick={(e) =>
                                    handleShowDate(
                                      e,
                                      formik?.values?.pricedata?.currentDate
                                    )
                                  } // Passing currentDate to the onClick handler
                                  disabled={row?.readonly}
                                  placeholder="Enter price"
                                />
                              ) : column === "time" ? (
                                <>
                                  <InputTime
                                    label="Time"
                                    value={
                                      formik?.values?.pricedata?.currentTime
                                    }
                                    disabled={true} // Disable if not editable
                                    className={`time-input-fuel-sell ${
                                      !row?.[0]?.is_editable
                                        ? "fuel-readonly"
                                        : ""
                                    }`}
                                  />
                                </>
                              ) : (
                                <input
                                  type="number"
                                  className={`table-input ${
                                    row.currentprice ? "fuel-readonly" : ""
                                  } ${row?.readonly ? "readonly" : ""}`}
                                  name={`rows[${rowIndex}].${column}`}
                                  value={row[column]}
                                  onChange={(e) =>
                                    handleChange(e, rowIndex, column)
                                  }
                                  disabled={row?.readonly}
                                  placeholder="Enter price"
                                />
                              )}
                            </td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}

                    {lsitingformik?.values?.fuels?.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <tr>
                          <td className="middayModal-td">
                            <div className="">
                              <Field
                                name={`fuels[${rowIndex}][0].date`}
                                type="date"
                                // disabled={!row?.[0]?.is_editable}
                                disabled={!priceSuggestionEditable}
                                onClick={(e) =>
                                  handleShowDate(
                                    e,
                                    formik?.values?.pricedata?.currentDate
                                  )
                                } // Passing currentDate to the onClick handler
                                onChange={(e) =>
                                  handleFieldChange(e, rowIndex, 0)
                                }
                                className={`table-input ${
                                  !priceSuggestionEditable ? "readonly" : ""
                                }`}
                                placeholder="Enter Date"
                              />
                              <ErrorMessage
                                name={`fuels[${rowIndex}][0].date`}
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </td>

                          <td className="middayModal-td time-input-fuel-sell">
                            <>
                              <InputTime
                                label="Time"
                                value={
                                  lsitingformik?.values?.fuels?.[rowIndex]?.[0]
                                    ?.time
                                }
                                onChange={(newTime) => {
                                  if (priceSuggestionEditable) {
                                    lsitingformik.setFieldValue(
                                      `fuels[${rowIndex}][0].time`,
                                      newTime
                                    );
                                    setIsEdited(true); // Mark as edited when any input changes
                                  }
                                }}
                                disabled={!priceSuggestionEditable} // Disable if not editable
                                // disabled={!row?.[0]?.is_editable} // Disable if not editable
                                className={`time-input-fuel-sell ${
                                  !priceSuggestionEditable ? "readonly" : ""
                                }   ${
                                  priceSuggestionEditable
                                    ? "c-timeinput-default"
                                    : ""
                                } `}
                              />
                            </>
                          </td>

                          {row?.map((item, itemIndex) => (
                            <td key={item.id} className="middayModal-td">
                              <div className="">
                                <Field
                                  name={`fuels[${rowIndex}][${itemIndex}].price`}
                                  type="number"
                                  className={`table-input ${
                                    !priceSuggestionEditable ? "readonly" : ""
                                  }`}
                                  disabled={!priceSuggestionEditable}
                                  onChange={(e) =>
                                    handleFieldChange(e, rowIndex, itemIndex)
                                  }
                                  placeholder="Enter price"
                                  step="0.010"
                                />
                                <ErrorMessage
                                  name={`fuels[${rowIndex}][${itemIndex}].price`}
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <Card.Footer>
                <div className="text-end d-flex justify-content-end align-items-baseline gap-2">
                  {data?.btn_clickable && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={isEdited}
                    >
                      Approve
                    </button>
                  )}

                  {data?.btn_clickable && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={isEdited}
                    >
                      Reject
                    </button>
                  )}

                  {data?.btn_clickable && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={!isEdited}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </Card.Footer>
            </Form>
          </FormikProvider>
        </>
      </div>
    </>
  );
};

export default PublicCompetitorFuelPricesUpdate;
