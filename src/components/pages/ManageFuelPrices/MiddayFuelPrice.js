import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from "formik";
import { Card, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import InputTime from "../Competitor/InputTime";
import ConfirmModal from "./ConfirmModal";
import FormikCheckOneBox from "../../Formik/FormikCheckOneBox";
import FormikCheckBooleanBox from "../../Formik/FormikCheckBooleanBox";
import FormikRadioBox from "../../Formik/FormikRadioBox";

const MiddayFuelPrice = ({ data, postData, handleFormSubmit }) => {
  const { notify_operator, update_tlm_price } = data || {};
  const [filterData, setFilterData] = useState();
  const [formValues, setFormValues] = useState(null); // State to hold form values

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
    listing: Yup.array().of(
      Yup.array().of(
        Yup.object({
          date: Yup.string().required("Date is required"),
          time: Yup.string().required("Time is required"),
          price: Yup.number().required("Price is required"),
        })
      )
    ),
  });

  const listing = [];
  const lsitingformik = useFormik({
    initialValues: { listing },
    validationSchema,
    onSubmit: (values) => {
      setFormValues(values); // Store form values
      setIsModalOpen(true); // Open the modal
    },
  });

  const { id: prarmSiteID } = useParams();

  useEffect(() => {
    if (data) {
      // Standardize column names
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
        listing: data?.listing,
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

      formData.append("site_id", prarmSiteID);
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

      const flattenedData = values?.listing?.flat();
      const editableItems = flattenedData.filter((item) => item?.is_editable);

      formData.append(`drs_date`, editableItems[0]?.date);
      formData.append(`time`, editableItems[0]?.time);

      values?.listing.flat().forEach((item) => {
        if (item?.is_editable) {
          formData.append(`fuels[${item.id}]`, item.price);
        }
      });

      const postDataUrl = "/site/fuel-price/update-sitepriceeeee";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

      handleFormSubmit();
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


  return (
    <>
      <Row className="row-sm">
        <Col lg={12}>
          <Card style={{ overflowY: "auto" }}>
            <Card.Header>
              <h3 className="card-title w-100">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <span>
                      Fuel Selling Price - {filterData?.site_name} (
                      {`${data?.currentDate}`}){" "}
                    </span>
                    <span
                      className="d-flex pt-1 align-items-center"
                      style={{ fontSize: "12px" }}
                    >
                      <span className="greenboxx me-2" />
                      <span className="text-muted">Current Price</span>
                    </span>
                  </div>
                </div>
              </h3>
              <ConfirmModal
                isOpen={isModalOpen}
                message="Are you sure you want to submit the form?"
                onConfirm={handleConfirm}
                formValues={formik.values}
                LatsRowvalues={lsitingformik.values}
                onCancel={handleCancel}
                SiteName={filterData?.site_name}
                update_tlm_price={formik?.values?.update_tlm_price}
                notify_operator={formik?.values?.notify_operator}
              />
            </Card.Header>
            <Card.Body>
              <FormikProvider value={lsitingformik}>
                <Form onKeyDown={handleKeyDown}>
                  <div className="table-container table-responsive">
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
                            {formik?.values?.columns?.map(
                              (column, colIndex) => (
                                <React.Fragment key={colIndex}>
                                  <td
                                    className={`time-input-fuel-sell ${column === "time"
                                        ? "middayModal-time-td "
                                        : "middayModal-td "
                                      }`}
                                    key={colIndex}
                                  >
                                    {column === "date" ? (
                                      <input
                                        type="date"
                                        className={`table-input  ${row.currentprice
                                            ? "fuel-readonly"
                                            : ""
                                          } ${row?.readonly
                                            ? "readonly update-price-readonly"
                                            : ""
                                          }`}
                                        value={
                                          formik?.values?.pricedata?.currentDate
                                        }
                                        name={row?.[column]}
                                        onChange={(e) =>
                                          handleChange(e, rowIndex, column)
                                        }
                                        onClick={(e) =>
                                          handleShowDate(
                                            e,
                                            formik?.values?.pricedata
                                              ?.currentDate
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
                                            formik?.values?.pricedata
                                              ?.currentTime
                                          }
                                          disabled={true} // Disable if not editable
                                          className={`time-input-fuel-sell ${!row?.[0]?.is_editable
                                              ? "fuel-readonly"
                                              : ""
                                            }`}
                                        />
                                      </>
                                    ) : (
                                      <input
                                        type="number"
                                        className={`table-input ${row.currentprice
                                            ? "fuel-readonly"
                                            : ""
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
                              )
                            )}
                          </tr>
                        ))}

                        {lsitingformik?.values?.listing?.map(
                          (row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                              <tr>
                                <td className="middayModal-td">
                                  <div className="">
                                    <Field
                                      name={`listing[${rowIndex}][0].date`}
                                      type="date"
                                      disabled={!row?.[0]?.is_editable}
                                      onClick={(e) =>
                                        handleShowDate(
                                          e,
                                          formik?.values?.pricedata?.currentDate
                                        )
                                      } // Passing currentDate to the onClick handler
                                      className={`table-input ${!row?.[0]?.is_editable ? "readonly" : ""
                                        }`}
                                      placeholder="Enter Date"
                                    />
                                    <ErrorMessage
                                      name={`listing[${rowIndex}][0].date`}
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
                                        lsitingformik?.values?.listing?.[
                                          rowIndex
                                        ]?.[0]?.time
                                      }
                                      onChange={(newTime) => {
                                        if (row?.[0]?.is_editable) {
                                          lsitingformik.setFieldValue(
                                            `listing[${rowIndex}][0].time`,
                                            newTime
                                          );
                                        }
                                      }}
                                      disabled={!row?.[0]?.is_editable} // Disable if not editable
                                      className={`time-input-fuel-sell ${!row?.[0]?.is_editable ? "readonly" : ""
                                        }   ${row?.[0]?.is_editable
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
                                        name={`listing[${rowIndex}][${itemIndex}].price`}
                                        type="number"
                                        className={`table-input ${!item?.is_editable ? "readonly" : ""
                                          }`}
                                        disabled={!item?.is_editable}
                                        placeholder="Enter price"
                                        step="0.010"
                                      />
                                      <ErrorMessage
                                        name={`listing[${rowIndex}][${itemIndex}].price`}
                                        component="div"
                                        className="text-danger"
                                      />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            </React.Fragment>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Card.Footer>
                    <div className="text-end d-flex justify-content-end align-items-baseline gap-4 align-items-center flex-wrap">
                      {update_tlm_price !== 1 && notify_operator ? (
                        <>
                          {/* <div className=" position-relative pointer">
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
                          </div> */}

                          <FormikCheckBooleanBox
                            label="Notify Operator"
                            name="notify_operator"
                            formik={formik}
                            disabled={false} // Set to true if you want to disable it
                          />
                        </>
                      ) : null}

                      {update_tlm_price == 1 ? (
                        <>
                          <>
                            {formik.values.update_tlm_price === 1 && (
                              <>
                                <div className="radio-section d-flex gap-4 flex-wrap">
                                  {/* <div className="position-relative pointer">
                                    <input
                                      type="radio"
                                      id="confirmation_required"
                                      name="confirmation_required"
                                      value={1} // Set value as 1 for confirmation
                                      checked={
                                        formik.values.confirmation_required ===
                                        1
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
                                        formik.values.confirmation_required ===
                                        0
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
                                  </div> */}

                                  <FormikRadioBox
                                    label="Update with Confirmation"
                                    name="confirmation_required"
                                    formik={formik}
                                    value={1} // Value for the first radio button
                                  />

                                  <FormikRadioBox
                                    label="Update Forcefully"
                                    name="confirmation_required"
                                    formik={formik}
                                    value={0} // Value for the second radio button
                                  />
                                </div>
                              </>
                            )}
                          </>

                          <FormikCheckOneBox
                            label="Update TLM Price"
                            name="update_tlm_price"
                            formik={formik}
                          // disabled={true} // You can toggle this between true/false to enable/disable the checkbox
                          />

                          {/* <div className=" position-relative pointer  ms-4">
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
                          </div> */}
                        </>
                      ) : null}

                      {data?.btn_clickable && (
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      )}
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
                            Selecting "Update Forcefully" will automatically
                            update prices on the POS, till, and pole sign, if
                            the POS and pole are connected.
                          </span>
                        </p>
                      </>
                    )}
                  </Card.Footer>
                </Form>
              </FormikProvider>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default MiddayFuelPrice;
