import React, { useEffect, useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import { Card } from "react-bootstrap";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import InputTime from "../Competitor/InputTime";

const PublicCompetitorFuelPricesUpdate = ({
  data,
  postData,
  handleFormSubmit,
  accordionSiteID,
  CallListingApi,
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
    accept_suggestion: Yup.array().of(
      Yup.array().of(
        Yup.object({
          date: Yup.string().required("Date is required"),
          time: Yup.string().required("Time is required"),
          price: Yup.number().required("Price is required"),
        })
      )
    ),
  });

  const accept_suggestion = [];
  const lsitingformik = useFormik({
    initialValues: { accept_suggestion },
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
      const columns = data?.head_array?.map((item) =>
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
        confirmation_required: data?.update_tlm_price ? 1 : 0,
        notify_operator: data?.notify_operator,
        head_array: data?.head_array,
        pricedata: data,
      });
      lsitingformik.setValues({
        accept_suggestion: data?.accept_suggestion,
      });
    }
  }, [data]);

  const handleChange = (e, rowIndex, column) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
    formik.setFieldValue(`rows[${rowIndex}].${column}`, value);
  };

  const handleSubmit = async (status) => {
    try {
      const formData = new FormData();

      formData.append("id", accordionSiteID);
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

      formData.append(
        `drs_date`,
        lsitingformik?.values?.accept_suggestion?.[0]?.date
      );
      formData.append(`status`, status);
      formData.append(
        `time`,
        lsitingformik?.values?.accept_suggestion?.[0]?.time
      );

      lsitingformik?.values?.accept_suggestion.flat().forEach((item) => {
        formData.append(`fuels[${item.id}]`, item.price);
      });

      const postDataUrl = "/site/fuel-price/suggestion/update";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

      CallListingApi();
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

  const handleEditPrice = () => {
    setPriceSuggestionEditable(true); // Close the modal without submitting
  };

  const handleClearPrice = () => {
    setPriceSuggestionEditable(false); // Clear and make field non-editable
    setIsEdited(false);
    CallListingApi();
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
                  Fuel Selling Price Suggestion For {data?.site_name} (
                  {data?.date})
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
              <div className="table-container overflow-auto">
                <table className="table">
                  <thead>
                    <tr>
                      {formik.values?.head_array?.map((item) => (
                        <th key={item?.id} className="middy-table-head">
                          {item?.name}
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

                    <tr>
                      <td className="middayModal-td">
                        <input
                          type="date"
                          name={`accept_suggestion[${0}].date`} // Dynamic name
                          value={
                            lsitingformik.values.accept_suggestion?.[0]?.date
                          }
                          className={`table-input ${
                            !priceSuggestionEditable ? "readonly" : ""
                          }`}
                          readOnly={!priceSuggestionEditable}
                          onChange={(e) => {
                            if (priceSuggestionEditable) {
                              // Update Formik field value
                              lsitingformik.setFieldValue(
                                `accept_suggestion[0].date`,
                                e.target.value
                              );

                              // Update the state as needed (e.g., to mark the form as edited)
                              setIsEdited(true);
                            }
                          }}
                        />
                      </td>

                      <td className="middayModal-td time-input-fuel-sell">
                        <>
                          <InputTime
                            label="Time"
                            value={
                              lsitingformik?.values?.accept_suggestion?.[0]
                                ?.time
                            }
                            onChange={(newTime) => {
                              if (priceSuggestionEditable) {
                                lsitingformik.setFieldValue(
                                  `accept_suggestion[0].time`,
                                  newTime
                                );
                                setIsEdited(true); // Mark as edited when any input changes
                              }
                            }}
                            disabled={!priceSuggestionEditable} // Disable if not editable
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

                      {/* Remaining Columns: Price */}
                      {lsitingformik?.values?.accept_suggestion?.map(
                        (item, index) => (
                          <td key={item.id} className="middayModal-td ">
                            <input
                              type="number"
                              className={`table-input ${
                                !priceSuggestionEditable ? "readonly" : ""
                              }`}
                              disabled={!priceSuggestionEditable}
                              name={`accept_suggestion[${index}].price`}
                              value={item?.price}
                              step={"0.001"}
                              onChange={(e) => {
                                if (priceSuggestionEditable) {
                                  // Update Formik field value
                                  lsitingformik.setFieldValue(
                                    `accept_suggestion[${index}].price`,
                                    e.target.value
                                  );

                                  // Update the state (e.g., to mark the form as edited)
                                  setIsEdited(true);
                                }
                              }}
                            />
                          </td>
                        )
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>

              <Card.Footer>
                <div className=" d-flex justify-content-end align-items-center gap-3 flex-wrap">
                  {update_tlm_price !== 1 && notify_operator ? (
                    <div className=" position-relative pointer">
                      <input
                        type="checkbox"
                        id="notify_operator"
                        name="notify_operator"
                        checked={formik?.values?.notify_operator}
                        onChange={formik.handleChange}
                        className="mx-1 form-check-input form-check-input-updated pointer"
                      />
                      <label
                        htmlFor="notify_operator"
                        className="me-3 m-0 pointer"
                      >
                        Notify Operator
                      </label>
                    </div>
                  ) : null}

                  {update_tlm_price == 1 ? (
                    <>
                      <>
                        {formik.values.update_tlm_price === 1 && (
                          <div className="radio-section d-flex gap-lg-5 ">
                            <div className="position-relative pointer">
                              <input
                                type="radio"
                                id="confirmation_required"
                                name="confirmation_required"
                                value={1} // Set value as 1 for confirmation
                                checked={
                                  formik.values.confirmation_required === 1
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    "confirmation_required",
                                    1
                                  )
                                }
                                className="mx-1 form-check-input form-check-input-updated pointer"
                              />
                              <label
                                htmlFor="confirmation_required"
                                className="p-0 m-0 pointer"
                              >
                                Update with Confirmation
                              </label>
                            </div>

                            <div className="position-relative pointer">
                              <input
                                type="radio"
                                id="update_forcefully"
                                name="confirmation_required"
                                value={0} // Set value as 0 for direct update
                                checked={
                                  formik.values.confirmation_required === 0
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    "confirmation_required",
                                    0
                                  )
                                }
                                className="mx-1 form-check-input form-check-input-updated pointer"
                              />
                              <label
                                htmlFor="update_forcefully"
                                className="p-0 m-0 pointer"
                              >
                                Update Forcefully
                              </label>
                            </div>
                          </div>
                        )}
                      </>

                      <div className=" position-relative pointer  ms-4">
                        <input
                          type="checkbox"
                          id="update_tlm_price"
                          name="update_tlm_price"
                          checked={formik?.values?.update_tlm_price === 1}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "update_tlm_price",
                              e.target.checked ? 1 : 0
                            );
                          }}
                          className="mx-1 form-check-input form-check-input-updated pointer"
                        />
                        <label
                          htmlFor="update_tlm_price"
                          className="p-0 m-0 pointer"
                        >
                          {" "}
                          Update TLM Price
                        </label>
                      </div>
                    </>
                  ) : null}

                  {/* {data?.btn_clickable && ( */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isEdited}
                    onClick={() => handleSubmit(3)}
                  >
                    Approve
                  </button>
                  {/* )} */}

                  {/* {data?.btn_clickable && ( */}
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={isEdited}
                    onClick={() => handleSubmit(2)}
                  >
                    Reject
                  </button>
                  {/* )} */}

                  {/* {data?.btn_clickable && ( */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!isEdited}
                    onClick={() => handleSubmit(4)}
                  >
                    Submit
                  </button>
                  {/* )} */}
                </div>

                {update_tlm_price == 1 && (
                  <>
                    <hr />

                    <p>
                      <span className=" fw-bold">
                        *Update with Confirmation -
                      </span>
                      <span className="ms-2">
                        Selecting "Update with Confirmation" will prompt a
                        pop-up on the POS system, where the operator must
                        confirm the price change to proceed.
                      </span>
                    </p>
                    <p>
                      <span className=" fw-bold">*Update Forcefully -</span>
                      <span className="ms-2">
                        Selecting "Update Forcefully" will automatically update
                        prices on the POS, till, and pole sign, if the POS and
                        pole are connected.
                      </span>
                    </p>
                  </>
                )}
              </Card.Footer>
            </Form>
          </FormikProvider>
        </>
      </div>
    </>
  );
};

export default PublicCompetitorFuelPricesUpdate;
