import React, { useEffect, useState } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import Loaderimg from "../../../Utils/Loader";
import Select from "react-select";
import { useFormik } from "formik";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";

const DepartmentShop = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  const [data, setData] = useState([]);
  const [Listingdata, setListingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setis_editable] = useState();

  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored",
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored",
    });
  };

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorToast(errorMessage);
    }
  }

  const fetchDetails = async () => {
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.get(
        `/bunkered-sale/details/?site_id=${SiteID}&drs_date=${ReportDate}`
      );

      const { data } = response;
      if (data) {
        setData(data?.data ? data.data : []);
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchListing = async () => {
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.get(
        `/bunkered-sale/list/?site_id=${SiteID}&drs_date=${ReportDate}`
      );

      const { data } = response;
      if (data) {
        console.log(data?.data?.listing ? data.data.listing : [], "api");
        setListingData(data?.data?.listing ? data.data : []);
        if (data?.data?.listing) {
          setis_editable(response?.data?.data);
          const bunkeredSalesValues = data?.data?.listing?.bunkered_Sales.map(
            (sale) => ({
              diesel: sale.fuel_name,
              volume: sale.volume || "",
              value: sale.value || "",
              opening: sale.opening_stock || "",
              closing: sale.closing_stock || "",
              fuel_id: sale.fuel_id || "",
              opening: sale.opening_stock || "",
              closing: sale.closing_stock || "",
              id: sale.id || "",
            })
          );

          formik.setFieldValue("bunkeredSales", bunkeredSalesValues);
          console.log(bunkeredSalesValues, "bunkeredSalesValues");

          const nonbunkeredsalesValues =
            data?.data?.listing?.non_bunkered_sales.map((sale) => ({
              fuel: sale.fuel_id,
              volume: sale.volume || "",
              value: sale.value || "",
              id: sale.id || "",
              fuel_name: sale.fuel_name || "",
            }));
          formik2.setFieldValue(
            "nonbunkeredsalesvalue",
            nonbunkeredsalesValues
          );
          console.log(nonbunkeredsalesValues, "nonbunkeredsalesValues");
          const creditcardvalues =
            data?.data?.listing?.bunkered_creditcardsales.map((sale) => ({
              card: sale.card_id,
              koisk: sale.koisk_value || "",
              optvalue: sale.opt_value || "",
              accountvalue: sale.account_value || "",
              transactionsvalue: sale.no_of_transactions || "",
              id: sale.id || "",
            }));
          formik3.setFieldValue("creditcardvalue", creditcardvalues);
          console.log(creditcardvalues, "creditcardvalues");
        }
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchListing();
  }, [SiteID, ReportDate]);

  const initialValues = {
    bunkeredSales: [
      {
        volume: "",
        value: "",
        opening: "",
        closing: "",
        diesel: "Diesel",
      },
    ],
  };

  const nonbunkeredsales = {
    nonbunkeredsalesvalue: [
      {
        fuel: "",
        volume: "",
        value: "",
      },
    ],
  };
  const creditcard = {
    creditcardvalue: [
      {
        card: "",
        koisk: "",
        optvalue: "",
        accountvalue: "",
        transactionsvalue: "",
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    bunkeredSales: Yup.array().of(
      Yup.object().shape({
        fuel: Yup.string().required("Please select a fuel"),
        supplier: Yup.string().required("Please select a supplier"),
        tank: Yup.string().required("Please select a tank"),
        volume: Yup.number()
          .typeError("Volume must be a number")
          .positive("Volume must be a positive number")
          .required("Volume is required"),
        value: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
      })
    ),
  });

  const nonbunkeredsalesValidationSchema = Yup.object().shape({
    nonbunkeredsalesvalue: Yup.array().of(
      Yup.object().shape({
        fuel: Yup.string().required("Please select a fuel"),
        volume: Yup.number()
          .typeError("Volume must be a number")
          .positive("Volume must be a positive number")
          .required("Volume is required"),
        value: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
      })
    ),
  });
  const creditcardValidationSchema = Yup.object().shape({
    creditcardvalue: Yup.array().of(
      Yup.object().shape({
        card: Yup.string().required("Please select a fuel"),
        koisk: Yup.number()
          .typeError("Volume must be a number")
          .positive("Volume must be a positive number")
          .required("Volume is required"),
        optvalue: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
        accountvalue: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
        transactionsvalue: Yup.number()
          .typeError("Value must be a number")
          .positive("Value must be a positive number")
          .required("Value is required"),
      })
    ),
  });

  const onSubmit = (values, { resetForm }) => {
    console.log("Bunkered Sales Form Values:", values);
    // Handle form submission here, e.g., API call or other operations
    // After successful submission, reset the form and add a new row
    resetForm();
    // pushbunkeredSalesRow();
    SuccessToast("Data submitted successfully!");
  };

  const nonbunkeredsalesonSubmit = (values, { resetForm }) => {
    resetForm();
    pushnonbunkeredSalesRow();
  };
  const creditcardonSubmit = (values, { resetForm }) => {
    resetForm();
    pushnoncreditcardRow();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: onSubmit,
  });

  const formik2 = useFormik({
    initialValues: nonbunkeredsales,
    validationSchema: nonbunkeredsalesValidationSchema,
    onSubmit: nonbunkeredsalesonSubmit,
  });
  const formik3 = useFormik({
    initialValues: creditcard,
    validationSchema: creditcardValidationSchema,
    onSubmit: creditcardonSubmit,
  });

  const pushbunkeredSalesRow = () => {
    console.log(formik.values, "pushbunkeredSalesRow");
    if (formik.isValid) {
      formik.values.bunkeredSales.push({
        volume: "",
        value: "",
        opening: "",
        closing: "",
        diesel: "",
      });
      formik.setFieldValue("bunkeredSales", formik.values.bunkeredSales);
    } else {
      ErrorToast("Please fill all fields correctly before adding a new row.");
    }
  };

  const pushnonbunkeredSalesRow = () => {
    console.log(formik2.values, "pushnonbunkeredSalesRow");
    console.log(
      formik2.values.nonbunkeredsalesvalue,
      "valueformik2.values.nonbunkeredsalesvalue"
    );
    if (formik2.isValid) {
      formik2.values.nonbunkeredsalesvalue.push({
        fuel: null,
        volume: "",
        value: "",
      });
      formik2.setFieldValue(
        "nonbunkeredsalesvalue",
        formik2.values.nonbunkeredsalesvalue
      );
    } else {
      ErrorToast(
        "Please fill all fields correctly before adding a new non-bunkered sales row."
      );
    }
  };
  const pushnoncreditcardRow = () => {
    console.log(formik3.values, "pushnoncreditcardRow");
    console.log(
      formik3.values.creditcardvalue,
      "valueformik2.values.creditcardvalue"
    );
    if (formik3.isValid) {
      formik3.values.creditcardvalue.push({
        card: "",
        koisk: "",
        optvalue: "",
        accountvalue: "",
        transactionsvalue: "",
      });

      // Update the creditcardvalue array in the formik values
      formik3.setFieldValue("creditcardvalue", formik3.values.creditcardvalue);
    } else {
      ErrorToast(
        "Please fill all fields correctly before adding a new credit card  sales row."
      );
    }
  };

  const removecreditcardRow = (index) => {
    const updatedRows = [...formik3.values.creditcardvalue];
    updatedRows.splice(index, 1);
    formik3.setFieldValue("creditcardvalue", updatedRows);
  };

  const removebunkeredSalesRow = (index) => {
    const updatedRows = [...formik.values.bunkeredSales];
    updatedRows.splice(index, 1);
    formik.setFieldValue("bunkeredSales", updatedRows);
  };

  const removenonbunkeredSalesRow = (index) => {
    const updatedRows = [...formik2.values.nonbunkeredsalesvalue];
    updatedRows.splice(index, 1);
    formik2.setFieldValue("nonbunkeredsalesvalue", updatedRows);
  };

  const combinedOnSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseURL = process.env.REACT_APP_BASE_URL; // Replace with your actual base URL

      const formData = new FormData();

      // Append data from formik.values.bunkeredSales
      for (const obj of formik.values?.bunkeredSales) {
        const { id, fuel_id, volume, value, opening, closing } = obj;

        formData.append(`bunkered_sale_id[0]`, id ? id : 0);
        formData.append(`bunkered_sale_fuel_id[${id ? id : 0}]`, fuel_id);
        formData.append(`bunkered_sale_volume[${id ? id : 0}]`, volume);
        formData.append(`bunkered_sale_value[${id ? id : 0}]`, value);
        formData.append(`bunkered_sale_opening_stock[${id ? id : 0}]`, opening);
        formData.append(`bunkered_sale_closing_stock[${id ? id : 0}]`, closing);
      }

      // Append data from formik3.values.creditcardvalue
      for (const obj of formik3.values?.creditcardvalue) {
        const { id, card, koisk, optvalue, accountvalue, transactionsvalue } =
          obj;
        if (id !== null && id !== "") {
          formData.append(`bunkered_credit_card_sales_id[]`, id ? id : 0);
        }

        if (card !== null && card !== "") {
          formData.append(
            `bunkered_credit_card_sales_card_id[${id ? id : 0}]`,
            card
          );
        }

        if (koisk !== null && koisk !== "") {
          formData.append(
            `bunkered_credit_card_sales_koisk_value[${id ? id : 0}]`,
            koisk
          );
        }

        if (optvalue !== null && optvalue !== "") {
          formData.append(
            `bunkered_credit_card_sales_opt_value[${id ? id : 0}]`,
            optvalue
          );
        }

        if (accountvalue !== null && accountvalue !== "") {
          formData.append(
            `bunkered_credit_card_sales_account_value[${id ? id : 0}]`,
            accountvalue
          );
        }

        if (transactionsvalue !== null && transactionsvalue !== "") {
          formData.append(
            `bunkered_credit_card_sales_no_of_transactions[${id ? id : 0}]`,
            transactionsvalue
          );
        }
      }

      // Append data from formik2.values.nonbunkeredsalesvalue
      for (const obj of formik2.values?.nonbunkeredsalesvalue) {
        const { id, fuel, volume, value } = obj;

        // Assuming you have the variables id, fuel, volume, and value with their respective values

        if (id !== null && id !== "") {
          formData.append(`nonbunkered_id[0]`, id ? id : 0);
        }

        if (fuel !== null && fuel !== "") {
          formData.append(`nonbunkered_fuel_id[${id ? id : 0}]`, fuel);
        }

        if (volume !== null && volume !== "") {
          formData.append(`nonbunkered_volume[${id ? id : 0}]`, volume);
        }

        if (value !== null && value !== "") {
          formData.append(`nonbunkered_value[${id ? id : 0}]`, value);
        }
      }
      formData.append("site_id", SiteID);
      formData.append("drs_date", ReportDate);
      console.log("Combined Form Data:", formData);

      setIsLoading(true);
      const response = await fetch(`${baseURL}/bunkered-sale/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Done");
        // Call your success toast function here
        // Replace SuccessToast with your actual function that shows a success message
        SuccessToast(responseData.message);
      } else {
        // Call your error toast function here
        // Replace ErrorToast with your actual function that shows an error message
        ErrorToast(responseData.message);
        console.log("API Error:", responseData);
        // Handle specific error cases if needed
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const data111 = {
      tenderLines: [
        {
          lineItemSequenceNumber: 2,
          voidedFlag: false,
          startTime: null,
          endTime: null,
          fiscalReceipt: true,
          methodOfPayment: {
            id: "0165",
            type: "OTHER",
            description: "Coupon",
            currencyID: 16,
            currencySymbol: "£",
            currencyIsoAlpha: "GBP",
            currencyIsoNumeric: "826",

            unitCountRequired: false,
            currencyAvailableForChange: false,

            companyID: 1220,
          },
          tenderAmount: 5,
          foreignCurrencyAmount: 0,
        },
        {
          lineItemSequenceNumber: 3,
          voidedFlag: false,
          startTime: null,
          endTime: null,
          fiscalReceipt: true,
          methodOfPayment: {
            id: "0107",
            type: "PAYMENTTERMINAL",
            description: "Mastercard",
            currencyID: 16,
            currencySymbol: "£",

            maximumAmount: 50000,
            openCashDrawer: false,

            currencyAvailableForChange: false,
            printReceiptWithAddress: false,
            tenderUsageType: "STANDARD",
            roundToDenominationType: "UNNECESSARY",
            denormalisedDescription: "AS_TND.DE_TND.0107:1220",
            isApplicable: true,
            accountNominal: null,
            companyID: 1220,
          },
          tenderAmount: 20.01,
          foreignCurrencyAmount: 0,
        },
      ],
      tenderLines: [
        {
          lineItemSequenceNumber: 2,
          voidedFlag: false,
          startTime: null,
          endTime: null,
          fiscalReceipt: true,
          methodOfPayment: {
            id: "0165",
            type: "OTHER",
            description: "Coupon",
            currencyID: 16,
            currencySymbol: "£",
            currencyIsoAlpha: "GBP",

            prohibitPartialPayment: false,
            paymentAmountVerificationRequired: true,
            maximumChange: 0,

            tenderUsageType: "STANDARD",
            roundToDenominationType: "UNNECESSARY",
            denormalisedDescription: "AS_TND.DE_TND.0165:1220",
            isApplicable: true,
            accountNominal: "",
            companyID: 1220,
          },
          tenderAmount: 5,
          foreignCurrencyAmount: 0,

          donationBaseTenderId: null,
        },
        {
          lineItemSequenceNumber: 3,
          voidedFlag: false,
          startTime: null,
          endTime: null,
          fiscalReceipt: true,
          methodOfPayment: {
            id: "0107",
            type: "PAYMENTTERMINAL",
            description: "Couponssssssssssssssssssssss",
            currencyID: 1888888,
            currencySymbol: "£",
            currencyIsoAlpha: "GBP",
            checkSettlementDiscrepancy: true,
            denominationMaskAvailable: true,
            amountEntryRequired: false,
            prohibitPartialPayment: false,
            paymentAmountVerificationRequired: false,
            maximumChange: 0,
            pickupAllowed: false,
            fiscalTenderCode: null,
            paymentTerminalRequired: true,
            cashTender: false,
            volumetricTender: false,
            unitCountRequired: false,
            currencyAvailableForChange: false,
            printReceiptWithAddress: false,
            tenderUsageType: "STANDARD",
            roundToDenominationType: "UNNECESSARY",
            denormalisedDescription: "AS_TND.DE_TND.0107:1220",
            isApplicable: true,
            accountNominal: null,
            companyID: 1220,
          },
          tenderAmount: 20.01,
          foreignCurrencyAmount: 0,
          cardDetails: null,
          changeLine: false,
          voucherBarcode: null,
          donation: false,
          donationBaseTenderId: null,
        },
        // Add more tenderLine objects here if needed
      ],
    };
    console.log("TenderLines with different data111:", data111);

    // Function to check if all "description" values in the array are the same
    function areDescriptionsSame(tenderLines) {
      const firstDescription = tenderLines[0].methodOfPayment.description;
      return tenderLines.every(
        (line) => line.methodOfPayment.description === firstDescription
      );
    }

    // Checking if "description" values are not the same and logging the items
    if (!areDescriptionsSame(data111.tenderLines)) {
      console.log("TenderLines with different data111:", areDescriptionsSame);
      const differentDescriptions = data111.tenderLines.filter((line) => {
        return (
          line.methodOfPayment.description !==
          data111.tenderLines[0].methodOfPayment.description
        );
      });

      console.log(
        "TenderLines with different descriptions:",
        differentDescriptions
      );
    }
  }, []);

  // Call the submitData function when the combinedOnSubmit function is invoked

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> BUNKERED SALES:</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {/* All columns wrapped inside a single Row */}
                <Row>
                  {formik.values.bunkeredSales.map((delivery, index) => (
                    <React.Fragment key={index}>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredSales[${index}].diesel`}
                        >
                          <Form.Label>FUEL:</Form.Label>
                          <Form.Control
                            type="text"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.diesel &&
                              formik.touched[`bunkeredSales[${index}].diesel`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].diesel`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.diesel ||
                              "diesel"
                            }
                            readOnly
                          />
                          {formik.errors.bunkeredSales?.[index]?.diesel &&
                            formik.touched[
                              `bunkeredSales[${index}].diesel`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].diesel}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredSales[${index}].volume`}
                        >
                          <Form.Label>VOLUME:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.volume &&
                              formik.touched[`bunkeredSales[${index}].volume`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].volume`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.volume ||
                              ""
                            }
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik.errors.bunkeredSales?.[index]?.volume &&
                            formik.touched[
                              `bunkeredSales[${index}].volume`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].volume}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group controlId={`bunkeredSales[${index}].value`}>
                          <Form.Label>VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.value &&
                              formik.touched[`bunkeredSales[${index}].value`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].value`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.value ||
                              ""
                            }
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik.errors.bunkeredSales?.[index]?.value &&
                            formik.touched[`bunkeredSales[${index}].value`] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredSales[${index}].opening`}
                        >
                          <Form.Label> OPENING STOCK:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.opening &&
                              formik.touched[`bunkeredSales[${index}].opening`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].opening`}
                            onChange={formik.handleChange}
                            readOnly={editable?.is_editable ? false : true}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.opening ||
                              ""
                            }
                          />
                          {formik.errors.bunkeredSales?.[index]?.opening &&
                            formik.touched[
                              `bunkeredSales[${index}].opening`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].opening}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredSales[${index}].closing`}
                        >
                          <Form.Label>CLOSING STOCK:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredSales?.[index]?.closing &&
                              formik.touched[`bunkeredSales[${index}].closing`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredSales[${index}].closing`}
                            onChange={formik.handleChange}
                            readOnly={editable?.is_editable ? false : true}
                            value={
                              formik?.values?.bunkeredSales?.[index]?.closing ||
                              ""
                            }
                          />
                          {formik.errors.bunkeredSales?.[index]?.closing &&
                            formik.touched[
                              `bunkeredSales[${index}].closing`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredSales[index].closing}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      {/* <Col lg={2} md={2}>
                        <div className="bunkered-action">
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => removebunkeredSalesRow(index)}
                          >
                            <RemoveCircleIcon />
                          </button>
                          <button
                            className="btn btn-primary me-2"
                            type="button"
                            onClick={pushbunkeredSalesRow}
                          >
                            <AddBoxIcon />
                          </button>
                        </div>
                      </Col> */}
                    </React.Fragment>
                  ))}
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> NON BUNKERED SALES:</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik2.handleSubmit}>
                {/* All columns wrapped inside a single Row */}
                <Row>
                  {formik2.values.nonbunkeredsalesvalue.map((item, index) => (
                    <React.Fragment key={index}>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].fuel`}
                        >
                          <Form.Label>FUEL:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik2.errors.nonbunkeredsalesvalue?.[index]
                                ?.fuel &&
                              formik2.touched[
                                `nonbunkeredsalesvalue[${index}].fuel`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`nonbunkeredsalesvalue[${index}].fuel`}
                            onChange={formik2.handleChange}
                            value={item?.fuel || ""}
                          >
                            <option value="">Select a Fuel</option>
                            {data?.siteFuels?.map((fuel) => (
                              <option key={fuel.id} value={fuel.id}>
                                {fuel.fuel_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.nonbunkeredsalesvalue?.[index]
                            ?.fuel &&
                            formik2.touched[
                              `nonbunkeredsalesvalue[${index}].fuel`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.nonbunkeredsalesvalue[index]
                                    .fuel
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].volume`}
                        >
                          <Form.Label>VOLUME:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik2.errors.nonbunkeredsalesvalue?.[index]
                                ?.volume &&
                              formik2.touched[
                                `nonbunkeredsalesvalue[${index}].volume`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`nonbunkeredsalesvalue[${index}].volume`}
                            onChange={formik2.handleChange}
                            value={item?.volume || ""}
                          />
                          {formik2.errors.nonbunkeredsalesvalue?.[index]
                            ?.volume &&
                            formik2.touched[
                              `nonbunkeredsalesvalue[${index}].volume`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.nonbunkeredsalesvalue[index]
                                    .volume
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].value`}
                        >
                          <Form.Label>VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik2.errors.nonbunkeredsalesvalue?.[index]
                                ?.value &&
                              formik2.touched[
                                `nonbunkeredsalesvalue[${index}].value`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`nonbunkeredsalesvalue[${index}].value`}
                            onChange={formik2.handleChange}
                            value={item?.value || ""}
                          />
                          {formik2.errors.nonbunkeredsalesvalue?.[index]
                            ?.value &&
                            formik2.touched[
                              `nonbunkeredsalesvalue[${index}].value`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.nonbunkeredsalesvalue[index]
                                    .value
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={3}>
                        <Form.Label>ACTION</Form.Label>

                        <div className="bunkered-action">
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => removenonbunkeredSalesRow(index)}
                          >
                            <RemoveCircleIcon />
                          </button>
                          {index ===
                            formik2.values.nonbunkeredsalesvalue.length - 1 && (
                            <button
                              className="btn btn-primary me-2"
                              type="button"
                              onClick={pushnonbunkeredSalesRow}
                            >
                              <AddBoxIcon />
                            </button>
                          )}
                        </div>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
                {/* <div className="bunkered-action">
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={combinedOnSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div> */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> BUNKERED CREDIT CARD SALES:</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik3.handleSubmit}>
                {/* All columns wrapped inside a single Row */}
                <Row>
                  {formik3.values.creditcardvalue.map((item, index) => (
                    <React.Fragment key={index}>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].card`}
                        >
                          <Form.Label>CARD NAME:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]?.card &&
                              formik3.touched[`creditcardvalue[${index}].card`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].card`}
                            onChange={formik3.handleChange}
                            value={item?.card || ""}
                          >
                            <option value="">Select a card</option>
                            {data?.cardsList?.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.card_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik3.errors.creditcardvalue?.[index]?.card &&
                            formik3.touched[
                              `creditcardvalue[${index}].card`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.creditcardvalue[index].card}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].koisk`}
                        >
                          <Form.Label>KOISK VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]?.koisk &&
                              formik3.touched[`creditcardvalue[${index}].koisk`]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].koisk`}
                            onChange={formik3.handleChange}
                            value={item?.koisk || ""}
                          />
                          {formik3.errors.creditcardvalue?.[index]?.koisk &&
                            formik3.touched[
                              `creditcardvalue[${index}].koisk`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.creditcardvalue[index].koisk}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].optvalue`}
                        >
                          <Form.Label>OPT VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]
                                ?.optvalue &&
                              formik3.touched[
                                `creditcardvalue[${index}].optvalue`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].optvalue`}
                            onChange={formik3.handleChange}
                            value={item?.optvalue || ""}
                          />
                          {formik3.errors.creditcardvalue?.[index]?.optvalue &&
                            formik3.touched[
                              `creditcardvalue[${index}].optvalue`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.creditcardvalue[index].optvalue}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].accountvalue`}
                        >
                          <Form.Label> ACCOUNT VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]
                                ?.accountvalue &&
                              formik3.touched[
                                `creditcardvalue[${index}].accountvalue`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].accountvalue`}
                            onChange={formik3.handleChange}
                            value={item?.accountvalue || ""}
                          />
                          {formik3.errors.creditcardvalue?.[index]
                            ?.accountvalue &&
                            formik3.touched[
                              `creditcardvalue[${index}].accountvalue`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik3.errors.creditcardvalue[index]
                                    .accountvalue
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`creditcardvalue[${index}].transactionsvalue`}
                        >
                          <Form.Label> NO. OF TRANSACTIONS :</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik3.errors.creditcardvalue?.[index]
                                ?.transactionsvalue &&
                              formik3.touched[
                                `creditcardvalue[${index}].transactionsvalue`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`creditcardvalue[${index}].transactionsvalue`}
                            onChange={formik3.handleChange}
                            value={item?.transactionsvalue || ""}
                          />
                          {formik3.errors.creditcardvalue?.[index]
                            ?.transactionsvalue &&
                            formik3.touched[
                              `creditcardvalue[${index}].transactionsvalue`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik3.errors.creditcardvalue[index]
                                    .transactionsvalue
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col lg={2} md={2}>
                        <Form.Label>ACTION</Form.Label>
                        <div className="bunkered-action">
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => removecreditcardRow(index)}
                            type="button"
                          >
                            <RemoveCircleIcon />
                          </button>

                          {index ===
                            formik3.values.creditcardvalue.length - 1 && (
                            <button
                              className="btn btn-primary me-2"
                              type="button"
                              onClick={pushnoncreditcardRow}
                            >
                              <AddBoxIcon />
                            </button>
                          )}
                        </div>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
                <div className="bunkered-action">
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={combinedOnSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DepartmentShop;
