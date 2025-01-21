import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from "formik";
import { Card, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import InputTime from "../Competitor/InputTime";
import ConfirmModal from "./ConfirmModal";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VersionTwoSuggestedFuelPriceModal from "./VersionTwoSuggestedFuelPriceModal";

const VersionTwoSuggestedFuelPrice = ({ data, postData, handleFormSubmit }) => {
  const { notify_operator, update_tlm_price } = data || {};
  const [filterData, setFilterData] = useState();
  const [formValues, setFormValues] = useState(null); // State to hold form values
  const [isEdited, setIsEdited] = useState(false); // Track if user has edited any input
  const [suggestedFuelPriceModal, setSuggestedFuelPriceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [accordionSiteID, setAccordionSiteID] = useState();

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

      const postDataUrl = "/site/fuel-price/update-sitepricsadasdasde";

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

  const handleModalClose = () => {
    setSuggestedFuelPriceModal(false);
  };

  const handleModalLogs = (site) => {
    setSuggestedFuelPriceModal(true);
    // setSelectedItem(site);
  };

  console.log(lsitingformik?.values, "lsitingformik");

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
                      Suggested Fuel Price Update - {filterData?.site_name} (
                      {`${data?.currentDate}`}){" "}
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
                    <table className="table table-modern tracking-in-expand">
                      <thead>
                        <tr>
                          {formik.values?.head_array?.map((item) => (
                            <th key={item?.id} className="middy-table-head">
                              {item?.name}
                            </th>
                          ))}
                          <th className="middy-table-head">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {lsitingformik?.values?.listing?.map(
                          (row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                              <tr>
                                <td className="middayModal-td">
                                  <div className="">
                                    <span>
                                      {formik?.values?.pricedata?.currentDate}
                                    </span>
                                    {/* <Field
                                      name={`listing[${rowIndex}][0].date`}
                                      type="date"
                                      disabled={!row?.[0]?.is_editable}
                                      onClick={(e) =>
                                        handleShowDate(
                                          e,
                                          formik?.values?.pricedata?.currentDate
                                        )
                                      } // Passing currentDate to the onClick handler
                                      className={`table-input ${
                                        !row?.[0]?.is_editable ? "readonly" : ""
                                      }`}
                                      placeholder="Enter Date"
                                    />
                                    <ErrorMessage
                                      name={`listing[${rowIndex}][0].date`}
                                      component="div"
                                      className="text-danger"
                                    /> */}
                                  </div>
                                </td>

                                <td className="middayModal-td time-input-fuel-sell">
                                  <>
                                    <span>
                                      {
                                        lsitingformik?.values?.listing?.[
                                          rowIndex
                                        ]?.[0]?.time
                                      }
                                    </span>
                                    {/* <InputTime
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
                                      className={`time-input-fuel-sell 
                                        ${
                                          !row?.[0]?.is_editable
                                            ? "readonly"
                                            : ""
                                        }   ${
                                        row?.[0]?.is_editable
                                          ? "c-timeinput-default"
                                          : ""
                                      } `}
                                    /> */}
                                  </>
                                </td>

                                {row?.map((item, itemIndex) => (
                                  <td key={item.id} className="middayModal-td">
                                    <div className="">
                                      {/* <span>{item?.price}</span> */}

                                      <div className="ms-2 mt-0 d-flex align-items-center  w-100 h-100 ">
                                        <h6
                                          className="mb-0 fs-14 fw-semibold"
                                          style={{ color: item?.price_color }}
                                        >
                                          <span
                                            className={`ms-2 ${
                                              item?.status === "UP"
                                                ? "text-success"
                                                : item?.status === "DOWN"
                                                ? "text-danger"
                                                : ""
                                            }`}
                                          >
                                            {item.price}
                                          </span>
                                          <span>
                                            {item?.status === "UP" && (
                                              <>
                                                <ArrowUpwardIcon
                                                  fontSize="10"
                                                  className="text-success ms-1 position-relative c-top-minus-1"
                                                />
                                              </>
                                            )}
                                          </span>
                                          <span>
                                            {item?.status === "DOWN" && (
                                              <>
                                                <ArrowDownwardIcon
                                                  fontSize="10"
                                                  className="text-danger ms-1 position-relative c-top-minus-1"
                                                />
                                              </>
                                            )}
                                          </span>
                                        </h6>
                                      </div>
                                      {/* <Field
                                        name={`listing[${rowIndex}][${itemIndex}].price`}
                                        type="number"
                                        className={`table-input ${
                                          !item?.is_editable ? "readonly" : ""
                                        }`}
                                        disabled={!item?.is_editable}
                                        placeholder="Enter price"
                                        step="0.010"
                                      />
                                      <ErrorMessage
                                        name={`listing[${rowIndex}][${itemIndex}].price`}
                                        component="div"
                                        className="text-danger"
                                      /> */}
                                    </div>
                                  </td>
                                ))}
                                <td
                                  className={`time-input-fuel-sell middayModal-td  `}
                                >
                                  <i
                                    className="ph ph-eye me-2 pointer"
                                    onClick={() => handleModalLogs()}
                                  />
                                </td>
                              </tr>
                            </React.Fragment>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </Form>
              </FormikProvider>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {suggestedFuelPriceModal && (
        <>
          <VersionTwoSuggestedFuelPriceModal
            open={suggestedFuelPriceModal}
            onClose={handleModalClose}
            selectedItem={selectedItem}
            accordionSiteID={accordionSiteID}
            // selectedDrsDate={selectedDrsDate}
            // onDataFromChild={handleDataFromChild}
            postData={postData}
          />
        </>
      )}
    </>
  );
};

export default VersionTwoSuggestedFuelPrice;
