import React, { useEffect, useState } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const DepartmentShop = (props) => {
  const {
    apidata,
    error,
    company_id,
    client_id,
    site_id,
    start_date,
    sendDataToParent,
  } = props;

  const handleButtonClick = () => {
    const allPropsData = {
      company_id,
      client_id,
      site_id,
      start_date,
    };

    // Call the callback function with the object containing all the props
    sendDataToParent(allPropsData);
  };

  useEffect(() => {
    fetchDetails();
    fetchListing();
    console.clear();
  }, []);

  const [data, setData] = useState([]);
  const [DieselID, setDieselID] = useState([]);
  const [Listingdata, setListingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setis_editable] = useState();


  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9); // Generates a random string of length 9
  };


  const SALESdummyData = [
    {
      card: "",
      koisk: 0,
      optvalue: 0,
      accountvalue: 0,
      transactionsvalue: 0,
    },

    // Add more dummy data items as needed
  ];

  const dummyData = [
    {
      id: "", // You can initialize this with a value or leave it blank
      fuel_name: "",
      fuel_id: "",
      card_id: "",
      card_name: "",
      opening_stock: null,
      volume: "",
      value: "",
      adj_value: "",
      closing_stock: null,
      update_opening_stock: false,
      update_volume: false,
      update_value: false,
      update_closing_stock: false,
      // Manually adding the required fields with true
      edit_card_name: true,
      edit_volume: true,
      edit_value: true,
      edit_closing_stock: true,
      edit_adj_value: true
    },
    // Add more dummy data items as needed
  ];
  const DieselData = [
    {
      id: "", // You can initialize this with a value or leave it blank
      fuel_name: "",
      fuel_id: "",
      card_id: "",
      card_name: "",
      opening_stock: null,
      volume: "",
      value: "",
      adj_value: "",
      closing_stock: null,
      update_opening_stock: false,
      update_volume: false,
      update_value: false,
      update_closing_stock: false,
      // Manually adding the required fields with true
      edit_card_name: true,
      edit_volume: true,
      edit_value: true,
      edit_closing_stock: true,
      edit_adj_value: true
    },
  ];

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
        `/bunkered-sale/details/?site_id=${site_id}&drs_date=${start_date}`
      );

      const { data } = response;
      if (data) {
        setData(data?.data ? data.data : []);

        const filteredDieselIds = data?.data?.siteFuels
          .filter((fuel) => fuel.fuel_name === "Diesel")
          .map((fuel) => fuel.id);

        setDieselID(filteredDieselIds);
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
        `/bunkered-sale/list/?site_id=${site_id}&drs_date=${start_date}`
      );

      const { data } = response;
      if (data) {
        setListingData(data?.data?.listing ? data.data : []);
        if (data?.data?.listing) {
          setis_editable(response?.data?.data);


          // if (response?.data?.data?.listing?.bunkered_Sales) {
          //   formik.setFieldValue("bunkered_Sales", response?.data?.data?.listing?.bunkered_Sales?.length > 0 ? response?.data?.data?.listing?.bunkered_Sales : DieselData);
          // }

          // if (response?.data?.data?.listing?.non_bunkered_sales) {
          //   formik2.setFieldValue("non_bunkered_sales", response?.data?.data?.listing?.non_bunkered_sales?.length > 0 ? response?.data?.data?.listing?.non_bunkered_sales : dummyData);
          // }

          // if (response?.data?.data?.listing?.bunkered_creditcardsales) {
          //   formik3.setFieldValue("bunkered_creditcardsales", response?.data?.data?.listing?.bunkered_creditcardsales?.length > 0 ? response?.data?.data?.listing?.bunkered_creditcardsales : SALESdummyData);
          // }


          if (response?.data?.data?.listing?.bunkered_Sales) {
            // Set bunkered_Sales normally
            let salesData = response?.data?.data?.listing?.bunkered_Sales;

            // Check if is_addable is true and add DieselData if necessary
            if (response?.data?.data?.is_addable) {
              salesData = salesData.length > 0 ? salesData : DieselData;
            }

            formik.setFieldValue("bunkered_Sales", salesData);
          }

          // Handle non_bunkered_sales
          if (response?.data?.data?.listing?.non_bunkered_sales) {
            let nonBunkeredSalesData = response?.data?.data?.listing?.non_bunkered_sales;

            // Add dummyData only if is_addable is true
            if (response?.data?.data?.is_addable) {
              nonBunkeredSalesData = nonBunkeredSalesData.length > 0 ? nonBunkeredSalesData : dummyData;
            }

            formik2.setFieldValue("non_bunkered_sales", nonBunkeredSalesData);
          }

          // Handle bunkered_creditcardsales
          if (response?.data?.data?.listing?.bunkered_creditcardsales) {
            let bunkeredCreditCardSalesData = response?.data?.data?.listing?.bunkered_creditcardsales;

            // Add SALESdummyData only if is_addable is true
            if (response?.data?.data?.is_addable) {
              bunkeredCreditCardSalesData = bunkeredCreditCardSalesData.length > 0 ? bunkeredCreditCardSalesData : SALESdummyData;
            }

            formik3.setFieldValue("bunkered_creditcardsales", bunkeredCreditCardSalesData);
          }










          const bunkeredSalesValues = data?.data?.listing?.bunkered_Sales.map(
            (sale) => ({
              fuel_name: sale.fuel_name,
              volume: sale.volume || "",
              value: sale.value || "",
              card: sale.card_id,
              fuel_id: sale.fuel_id || "",
              id: sale.id || "",
              adj_value: sale.adj_value || "",
            })
          );

          const valuesToSetDieselData =
            bunkeredSalesValues.length > 0 ? bunkeredSalesValues : DieselData;

          // formik.setFieldValue("bunkered_Sales", valuesToSetDieselData);

          const nonbunkeredsalesValues =
            data?.data?.listing?.non_bunkered_sales?.map((sale) => ({
              fuel: sale.fuel_id,
              volume: sale.volume || "",
              value: sale.value || "",
              id: sale.id || "",
              card: sale.card_id,
              fuel_name: sale.fuel_name || "",
            }));

          // Check if nonbunkeredsalesValues has any values; otherwise, use dummyData
          const non_bunkered_values =
            nonbunkeredsalesValues.length > 0
              ? nonbunkeredsalesValues
              : dummyData;

          // formik2.setFieldValue("non_bunkered_sales", non_bunkered_values);

          const creditcardvalues =
            data?.data?.listing?.bunkered_creditcardsales?.map((sale) => ({
              card: sale.card_id,
              koisk: sale.koisk_value || "",
              optvalue: sale.opt_value || "",
              accountvalue: sale.account_value || "",
              transactionsvalue: sale.no_of_transactions || "",
              id: sale.id || "",
            }));

          // Check if creditcardvalues has any values; otherwise, use dummyData
          const valuesToSet =
            creditcardvalues.length > 0 ? creditcardvalues : SALESdummyData;

          // formik3.setFieldValue("bunkered_creditcardsales", valuesToSet);
        }
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    bunkered_Sales: [
      {
        volume: "",
        value: "",
        card: "",
        fuel_name: "Diesel",
      },
    ],
  };

  const nonbunkeredsales = {
    non_bunkered_sales: [
      {
        fuel: "",
        volume: "",
        value: "",
        card: "",
      },
    ],
  };
  const creditcard = {
    bunkered_creditcardsales: [
      {
        card: "",
        koisk: "",
        optvalue: "",
        accountvalue: "",
        transactionsvalue: "",
      },
    ],
  };



  const nonbunkeredsalesValidationSchema = Yup.object().shape({
    non_bunkered_sales: Yup.array().of(
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
    bunkered_creditcardsales: Yup.array().of(
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
    resetForm();
    // pushbunkeredSalesRow();
    SuccessAlert("Data submitted successfully!");
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
    initialValues: {},
    // validationSchema,
    onSubmit: onSubmit,
  });

  const formik2 = useFormik({
    initialValues: nonbunkeredsales,
    // validationSchema: nonbunkeredsalesValidationSchema,
    onSubmit: nonbunkeredsalesonSubmit,
  });
  const formik3 = useFormik({
    initialValues: creditcard,
    // validationSchema: creditcardValidationSchema,
    onSubmit: creditcardonSubmit,
  });

  const pushnonbunkeredSalesRow = () => {
    if (formik2.isValid) {
      formik2.values.non_bunkered_sales.push({
        fuel: null,
        volume: "",
        value: "",
      });
      formik2.setFieldValue(
        "non_bunkered_sales",
        formik2.values.non_bunkered_sales
      );
    } else {
      ErrorAlert(
        "Please fill all fields correctly before adding a new non-bunkered sales row."
      );
    }
  };


  const pushbunkeredSalesRow = () => {
    if (formik.isValid) {
      // Manually add a new row with the specific fields and default values
      const newRow = {
        id: "", // You can initialize this with a value or leave it blank
        fuel_name: "",
        fuel_id: "",
        card_id: "",
        card_name: "",
        opening_stock: null,
        volume: "",
        value: "",
        adj_value: "",
        closing_stock: null,
        update_opening_stock: false,
        update_volume: false,
        update_value: false,
        update_closing_stock: false,

        // Manually adding the required fields with true
        edit_card_name: true,
        edit_volume: true,
        edit_value: true,
        edit_closing_stock: true,
        edit_adj_value: true
      };

      // Push the new row into formik values
      formik.values.bunkered_Sales.push(newRow);

      // Update the formik state
      formik.setFieldValue("bunkered_Sales", formik.values.bunkered_Sales);
    } else {
      ErrorAlert(
        "Please fill all fields correctly before adding a new bunkered sales row."
      );
    }
  };





  const pushnoncreditcardRow = () => {
    if (formik3.isValid) {
      // Generate a random ID for the new row
      const generateRandomId = () => {
        return Math.random().toString(36).substr(2, 9); // Generates a random string of length 9
      };

      // Manually add a new row with the specific fields and default values
      const newRow = {
        id: generateRandomId(), // Use the random ID generator here
        card_id: "",
        card_name: "",
        koisk_value: "",
        opt_value: "",
        account_value: "",
        no_of_transactions: "",
        adj_value: "",

        // Update fields defaulting to false
        update_koisk_value: false,
        update_opt_value: false,
        update_account_value: false,
        update_no_of_transactions: false,

        // Editable fields manually set to true
        edit_koisk_value: true,
        edit_opt_value: true,
        edit_account_value: true,
        edit_no_of_transactions: true,
        edit_card_name: true,
        edit_adj_value: true
      };

      // Push the new row into formik3 values
      formik3.values?.bunkered_creditcardsales?.push(newRow);

      // Update the formik3 state
      formik3.setFieldValue("bunkered_creditcardsales", formik3.values.bunkered_creditcardsales);
    } else {
      ErrorAlert(
        "Please fill all fields correctly before adding a new bunkered sales row."
      );
    }
  };

  // const pushnoncreditcardRow = () => {
  //   if (formik3.isValid) {
  //     formik3.values.bunkered_creditcardsales.push({
  //       card: "",
  //       koisk: "",
  //       optvalue: "",
  //       accountvalue: "",
  //       transactionsvalue: "",
  //     });

  //     // Update the bunkered_creditcardsales array in the formik values
  //     formik3.setFieldValue("bunkered_creditcardsales", formik3.values.bunkered_creditcardsales);
  //   } else {
  //     ErrorAlert(
  //       "Please fill all fields correctly before adding a new credit card  sales row."
  //     );
  //   }
  // };

  const removecreditcardRow = (index) => {
    const updatedRows = [...formik3.values.bunkered_creditcardsales];
    updatedRows.splice(index, 1);
    formik3.setFieldValue("bunkered_creditcardsales", updatedRows);
  };

  const removebunkeredSalesRow = (index) => {
    const updatedRows = [...formik.values.bunkered_Sales];
    updatedRows.splice(index, 1);
    formik.setFieldValue("bunkered_Sales", updatedRows);
  };

  const removenonbunkeredSalesRow = (index) => {
    const updatedRows = [...formik2.values.non_bunkered_sales];
    updatedRows.splice(index, 1);
    formik2.setFieldValue("non_bunkered_sales", updatedRows);
  };

  const combinedOnSubmit = async () => {



    try {
      const token = localStorage.getItem("token");
      const baseURL = process.env.REACT_APP_BASE_URL; // Replace with your actual base URL

      const formData = new FormData();

      // Append data from formik.values.bunkered_Sales
      for (const obj of formik.values?.bunkered_Sales) {
        const { id, fuel_id, volume, value, card, card_id, adj_value } = obj;



        formData.append(`bunkered_sale_id[0]`, id ? id : 0);
        formData.append(`bunkered_sale_card_id[${id ? id : 0}]`, card_id);
        formData.append(`bunkered_sale_fuel_id[${id ? id : 0}]`, fuel_id);
        formData.append(`bunkered_sale_volume[${id ? id : 0}]`, volume);
        formData.append(`bunkered_sale_value[${id ? id : 0}]`, value);
        formData.append(`bunkered_sale_adj_value[${id ? id : 0}]`, adj_value);
      }



      // Append data from formik.values.bunkered_Sales
      for (const obj of formik2.values?.non_bunkered_sales) {
        const { id, fuel_id, volume, value, card, card_id, adj_value } = obj;

        formData.append(`nonbunkered_id[0]`, id ? id : 0);
        formData.append(`nonbunkered_card_id[${id ? id : 0}]`, card_id);
        formData.append(`nonbunkered_fuel_id[${id ? id : 0}]`, fuel_id);
        formData.append(`nonbunkered_volume[${id ? id : 0}]`, volume);
        formData.append(`nonbunkered_value[${id ? id : 0}]`, value);
        formData.append(`nonbunkered_adj_value[${id ? id : 0}]`, adj_value);
      }


      for (const obj of formik3.values?.bunkered_creditcardsales) {
        const { id, koisk_value, opt_value, account_value, card, card_id, adj_value, no_of_transactions } = obj;

        formData.append(`bunkered_credit_card_sales_id[0]`, id ? id : 0);
        formData.append(`bunkered_credit_card_sales_card_id[${id ? id : 0}]`, card_id);
        formData.append(`bunkered_credit_card_sales_koisk_value[${id ? id : 0}]`, koisk_value);
        formData.append(`bunkered_credit_card_sales_opt_value[${id ? id : 0}]`, opt_value);
        formData.append(`bunkered_credit_card_sales_account_value[${id ? id : 0}]`, account_value);
        formData.append(`bunkered_credit_card_sales_no_of_transactions[${id ? id : 0}]`, no_of_transactions);
        formData.append(`bunkered_credit_card_sales_adj_value[${id ? id : 0}]`, adj_value);
      }

      // Append data from formik3.values.bunkered_creditcardsales
      // for (const obj of formik3.values?.bunkered_creditcardsales) {
      //   const { id, card, koisk, optvalue, accountvalue, transactionsvalue } =
      //     obj;
      //   if (id !== null && id !== "") {
      //     formData.append(`bunkered_credit_card_sales_id[]`, id ? id : 0);
      //   }

      //   if (card !== null && card !== "") {
      //     formData.append(
      //       `bunkered_credit_card_sales_card_id[${id ? id : 0}]`,
      //       card
      //     );
      //   }

      //   if (koisk !== null && koisk !== "") {
      //     formData.append(
      //       `bunkered_credit_card_sales_koisk_value[${id ? id : 0}]`,
      //       koisk
      //     );
      //   }

      //   if (optvalue !== null && optvalue !== "") {
      //     formData.append(
      //       `bunkered_credit_card_sales_opt_value[${id ? id : 0}]`,
      //       optvalue
      //     );
      //   }

      //   if (accountvalue !== null && accountvalue !== "") {
      //     formData.append(
      //       `bunkered_credit_card_sales_account_value[${id ? id : 0}]`,
      //       accountvalue
      //     );
      //   }

      //   if (transactionsvalue !== null && transactionsvalue !== "") {
      //     formData.append(
      //       `bunkered_credit_card_sales_no_of_transactions[${id ? id : 0}]`,
      //       transactionsvalue
      //     );
      //   }
      // }

      // Append data from formik2.values.non_bunkered_sales
      // for (const obj of formik2.values?.non_bunkered_sales) {
      //   const { id, fuel, volume, value, card } = obj;

      //   // Assuming you have the variables id, fuel, volume, and value with their respective values

      //   if (id !== null && id !== "") {
      //     formData.append(`nonbunkered_id[0]`, id ? id : 0);
      //   }

      //   if (fuel !== null && fuel !== "") {
      //     formData.append(`nonbunkered_fuel_id[${id ? id : 0}]`, fuel);
      //   }
      //   if (card !== null && card !== "") {
      //     formData.append(`nonbunkered_card_id[${id ? id : 0}]`, card);
      //   }

      //   if (volume !== null && volume !== "") {
      //     formData.append(`nonbunkered_volume[${id ? id : 0}]`, volume);
      //   }

      //   if (value !== null && value !== "") {
      //     formData.append(`nonbunkered_value[${id ? id : 0}]`, value);
      //   }
      // }
      formData.append("site_id", site_id);
      formData.append("drs_date", start_date);

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
        handleButtonClick();
        // Call your success toast function here
        // Replace SuccessToast with your actual function that shows a success message
        SuccessAlert(responseData.message);
      } else {
        // Call your error toast function here
        // Replace ErrorAlert with your actual function that shows an error message
        ErrorAlert(responseData.message);
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

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
                  {formik?.values?.bunkered_Sales?.map((delivery, index) => (
                    <React.Fragment key={index}>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkered_Sales[${index}].fuel_id`}
                        >
                          <Form.Label>FUEL:</Form.Label>
                          <Form.Control
                            type="text"
                            className={`input101 ${formik.errors.bunkered_Sales?.[index]?.fuel_id &&
                              formik.touched[`bunkered_Sales[${index}].fuel_id`]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`bunkered_Sales[${index}].fuel_id`}
                            onChange={formik.handleChange}
                            value={formik?.values?.bunkered_Sales?.[index]?.fuel_name || "Diesel"}
                            readOnly
                          />
                          {formik.errors.bunkered_Sales?.[index]?.fuel_id &&
                            formik.touched[
                            `bunkered_Sales[${index}].fuel_id`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkered_Sales[index].fuel_id}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group controlId={`bunkered_Sales[${index}].card_id`}>
                          <Form.Label>CARD NAME:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik.errors.bunkered_Sales?.[index]?.card_id &&
                              formik.touched[`bunkered_Sales[${index}].card_id`]
                              ? "is-invalid"
                              : ""
                              }
                            
                              ${!delivery?.edit_card_name ? 'readonly' : ""}`
                            }
                            name={`bunkered_Sales[${index}].card_id`}
                            onChange={formik.handleChange}
                            value={delivery?.card_id || ""}
                            disabled={!delivery?.edit_card_name}
                          >
                            <option value="">Select a card</option>
                            {data?.cardsList?.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.card_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik.errors.bunkered_Sales?.[index]?.card_id &&
                            formik.touched[`bunkered_Sales[${index}].card_id`] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkered_Sales[index].card_id}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkered_Sales[${index}].volume`}
                        >
                          <Form.Label>VOLUME:</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik.errors.bunkered_Sales?.[index]?.volume &&
                              formik.touched[`bunkered_Sales[${index}].volume`]
                              ? "is-invalid"
                              : ""
                              }  ${!delivery?.edit_volume ? 'readonly' : ""}`}
                            name={`bunkered_Sales[${index}].volume`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkered_Sales?.[index]?.volume ||
                              ""
                            }
                            readOnly={!delivery?.edit_volume}



                          />
                          {formik.errors.bunkered_Sales?.[index]?.volume &&
                            formik.touched[
                            `bunkered_Sales[${index}].volume`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkered_Sales[index].volume}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group controlId={`bunkered_Sales[${index}].value`}>
                          <Form.Label>VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik.errors.bunkered_Sales?.[index]?.value &&
                              formik.touched[`bunkered_Sales[${index}].value`]
                              ? "is-invalid"
                              : ""
                              }  ${!delivery?.edit_value ? 'readonly' : ""}`}
                            name={`bunkered_Sales[${index}].value`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkered_Sales?.[index]?.value ||
                              ""
                            }
                            readOnly={!delivery?.edit_value}
                          />
                          {formik.errors.bunkered_Sales?.[index]?.value &&
                            formik.touched[`bunkered_Sales[${index}].value`] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkered_Sales[index].value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>


                      {editable?.is_adjustable && (<>
                        <Col lg={2} md={2}>
                          <Form.Group controlId={`bunkered_Sales[${index}].adj_value`}>
                            <Form.Label>ADJUSTMENT VALUE:</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="enter number"
                              className={`input101 ${formik.errors.bunkered_Sales?.[index]?.adj_value &&
                                formik.touched[`bunkered_Sales[${index}].adj_value`]
                                ? "is-invalid"
                                : ""
                                }  ${!delivery?.edit_adj_value ? 'readonly' : ""}`}
                              name={`bunkered_Sales[${index}].adj_value`}
                              onChange={formik.handleChange}
                              value={
                                formik?.values?.bunkered_Sales?.[index]?.adj_value ||
                                ""
                              }
                              readOnly={!delivery?.edit_adj_value}
                            />
                            {formik.errors.bunkered_Sales?.[index]?.adj_value &&
                              formik.touched[`bunkered_Sales[${index}].adj_value`] && (
                                <div className="invalid-feedback">
                                  {formik.errors.bunkered_Sales[index].adj_value}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      </>)}



                      <Col lg={2} md={2}>
                        {(editable?.is_editable && editable?.is_addable) ? (
                          <Form.Label>ACTION</Form.Label>
                        ) : (
                          ""
                        )}
                        {(editable?.is_editable && editable?.is_addable) ? (
                          <div className="bunkered-action">

                            {formik?.values?.bunkered_Sales?.length > 1 && (<>
                              <button
                                className="btn btn-primary me-2"
                                onClick={() => removebunkeredSalesRow(index)}
                              >
                                <RemoveCircleIcon />
                              </button>
                            </>)}

                            {index ===
                              formik.values.bunkered_Sales.length - 1 && (
                                <button
                                  className="btn btn-primary me-2"
                                  type="button"
                                  onClick={pushbunkeredSalesRow}
                                >
                                  <AddBoxIcon />
                                </button>
                              )}
                          </div>
                        ) : (
                          ""
                        )}
                      </Col>
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
                {formik2.values.non_bunkered_sales.map((item, index) => (
                  <Row>
                    <React.Fragment key={index}>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`non_bunkered_sales[${index}].fuel_id`}
                        >
                          <Form.Label>FUEL:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik2.errors.non_bunkered_sales?.[index]
                              ?.fuel_id &&
                              formik2.touched[
                              `non_bunkered_sales[${index}].fuel_id`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`non_bunkered_sales[${index}].fuel_id`}
                            onChange={formik2.handleChange}
                            value={item?.fuel_id || ""}
                            disabled={!editable?.is_editable}
                          >
                            <option value="">Select a Fuel</option>
                            {data?.siteFuels?.map((fuel) => (
                              <option key={fuel.id} value={fuel.id}>
                                {fuel.fuel_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.non_bunkered_sales?.[index]
                            ?.fuel_id &&
                            formik2.touched[
                            `non_bunkered_sales[${index}].fuel_id`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.non_bunkered_sales[index]
                                    .fuel_id
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`non_bunkered_sales[${index}].card_id`}
                        >
                          <Form.Label>CARD NAME:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik2.errors.non_bunkered_sales?.[index]
                              ?.card_id &&
                              formik2.touched[
                              `non_bunkered_sales[${index}].card_id`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`non_bunkered_sales[${index}].card_id`}
                            onChange={formik2.handleChange}
                            value={item?.card_id || ""}
                            disabled={!editable?.is_editable}
                          >
                            <option value="">Select a card</option>
                            {data?.cardsList?.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.card_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.non_bunkered_sales?.[index]
                            ?.card_id &&
                            formik2.touched[
                            `non_bunkered_sales[${index}].card_id`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.non_bunkered_sales[index]
                                    .card_id
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={1} md={1}>
                        <Form.Group
                          controlId={`non_bunkered_sales[${index}].volume`}
                        >
                          <Form.Label>VOLUME:</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik2.errors.non_bunkered_sales?.[index]
                              ?.volume &&
                              formik2.touched[
                              `non_bunkered_sales[${index}].volume`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`non_bunkered_sales[${index}].volume`}
                            onChange={formik2.handleChange}
                            value={item?.volume || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik2.errors.non_bunkered_sales?.[index]
                            ?.volume &&
                            formik2.touched[
                            `non_bunkered_sales[${index}].volume`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.non_bunkered_sales[index]
                                    .volume
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={1} md={1}>
                        <Form.Group
                          controlId={`non_bunkered_sales[${index}].value`}
                        >
                          <Form.Label>VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik2.errors.non_bunkered_sales?.[index]
                              ?.value &&
                              formik2.touched[
                              `non_bunkered_sales[${index}].value`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`non_bunkered_sales[${index}].value`}
                            onChange={formik2.handleChange}
                            value={item?.value || ""}
                            readOnly={editable?.is_editable ? false : true}
                          />
                          {formik2.errors.non_bunkered_sales?.[index]
                            ?.value &&
                            formik2.touched[
                            `non_bunkered_sales[${index}].value`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.non_bunkered_sales[index]
                                    .value
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      {editable?.is_adjustable && (<>
                        <Col lg={2} md={2}>
                          <Form.Group controlId={`non_bunkered_sales[${index}].adj_value`}>
                            <Form.Label>ADJUSTMENT VALUE:</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="enter number"
                              className={`input101 ${formik2.errors.non_bunkered_sales?.[index]?.adj_value &&
                                formik2.touched[`non_bunkered_sales[${index}].adj_value`]
                                ? "is-invalid"
                                : ""
                                }  ${!item?.edit_adj_value ? 'readonly' : ""}`}
                              name={`non_bunkered_sales[${index}].adj_value`}
                              onChange={formik2.handleChange}
                              value={
                                formik2?.values?.non_bunkered_sales?.[index]?.adj_value ||
                                ""
                              }
                              readOnly={!item?.edit_adj_value}
                            />
                            {formik2.errors.non_bunkered_sales?.[index]?.adj_value &&
                              formik2.touched[`non_bunkered_sales[${index}].adj_value`] && (
                                <div className="invalid-feedback">
                                  {formik2.errors.non_bunkered_sales[index].adj_value}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      </>)}

                      <Col lg={2} md={2}>
                        {(editable?.is_editable && editable?.is_addable) ? (
                          <Form.Label>ACTION</Form.Label>
                        ) : (
                          ""
                        )}
                        {(editable?.is_editable && editable?.is_addable) ? (
                          <div className="bunkered-action">

                            {formik2?.values?.non_bunkered_sales?.length > 1 && (<>
                              <button
                                className="btn btn-primary me-2"
                                onClick={() => removenonbunkeredSalesRow(index)}
                              >
                                <RemoveCircleIcon />
                              </button>
                            </>)}

                            {index ===
                              formik2.values.non_bunkered_sales.length -
                              1 && (
                                <button
                                  className="btn btn-primary me-2"
                                  type="button"
                                  onClick={pushnonbunkeredSalesRow}
                                >
                                  <AddBoxIcon />
                                </button>
                              )}
                          </div>
                        ) : (
                          ""
                        )}
                      </Col>
                    </React.Fragment>
                  </Row>
                ))}
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
                {formik3.values?.bunkered_creditcardsales?.map((item, index) => (
                  <Row>
                    <React.Fragment key={index}>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkered_creditcardsales[${index}].card_id`}
                        >
                          <Form.Label>CARD NAME:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik3.errors.bunkered_creditcardsales?.[index]?.card_id &&
                              formik3.touched[`bunkered_creditcardsales[${index}].card_id`]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`bunkered_creditcardsales[${index}].card_id`}
                            onChange={formik3.handleChange}
                            value={item?.card_id || ""}
                            disabled={!item?.edit_card_name}
                          >
                            <option value="">Select a card</option>
                            {data?.cardsList?.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.card_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik3.errors.bunkered_creditcardsales?.[index]?.card_id &&
                            formik3.touched[
                            `bunkered_creditcardsales[${index}].card_id`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.bunkered_creditcardsales[index].card_id}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={1} md={1}>
                        <Form.Group
                          controlId={`bunkered_creditcardsales[${index}].koisk_value`}
                        >
                          <Form.Label>KOISK </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik3.errors.bunkered_creditcardsales?.[index]?.koisk_value &&
                              formik3.touched[`bunkered_creditcardsales[${index}].koisk_value`]
                              ? "is-invalid"
                              : ""
                              } ${!item?.edit_koisk_value && 'readonly'}`}
                            name={`bunkered_creditcardsales[${index}].koisk_value`}
                            onChange={formik3.handleChange}
                            value={item?.koisk_value || ""}
                            readOnly={!item?.edit_koisk_value}
                          />
                          {formik3.errors.bunkered_creditcardsales?.[index]?.koisk_value &&
                            formik3.touched[
                            `bunkered_creditcardsales[${index}].koisk_value`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.bunkered_creditcardsales[index].koisk_value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={1} md={1}>
                        <Form.Group
                          controlId={`bunkered_creditcardsales[${index}].opt_value`}
                        >
                          <Form.Label>OPT </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik3.errors.bunkered_creditcardsales?.[index]
                              ?.opt_value &&
                              formik3.touched[
                              `bunkered_creditcardsales[${index}].opt_value`
                              ]
                              ? "is-invalid"
                              : ""
                              } ${!item?.edit_opt_value && 'readonly'}`}
                            name={`bunkered_creditcardsales[${index}].opt_value`}
                            onChange={formik3.handleChange}
                            value={item?.opt_value || ""}
                            readOnly={!item?.edit_opt_value}
                          />
                          {formik3.errors.bunkered_creditcardsales?.[index]?.opt_value &&
                            formik3.touched[
                            `bunkered_creditcardsales[${index}].opt_value`
                            ] && (
                              <div className="invalid-feedback">
                                {formik3.errors.bunkered_creditcardsales[index].opt_value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkered_creditcardsales[${index}].account_value`}
                        >
                          <Form.Label> ACCOUNT VALUE:</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik3.errors.bunkered_creditcardsales?.[index]
                              ?.account_value &&
                              formik3.touched[
                              `bunkered_creditcardsales[${index}].account_value`
                              ]
                              ? "is-invalid"
                              : ""
                              } ${!item?.edit_account_value && 'readonly'}`}
                            name={`bunkered_creditcardsales[${index}].account_value`}
                            onChange={formik3.handleChange}
                            value={item?.account_value || ""}
                            readOnly={!item?.edit_account_value}
                          />
                          {formik3.errors.bunkered_creditcardsales?.[index]
                            ?.account_value &&
                            formik3.touched[
                            `bunkered_creditcardsales[${index}].account_value`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik3.errors.bunkered_creditcardsales[index]
                                    .account_value
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkered_creditcardsales[${index}].no_of_transactions`}
                        >
                          <Form.Label> TRANSACTIONS :</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="enter number"
                            className={`input101 ${formik3.errors.bunkered_creditcardsales?.[index]
                              ?.no_of_transactions &&
                              formik3.touched[
                              `bunkered_creditcardsales[${index}].no_of_transactions`
                              ]
                              ? "is-invalid"
                              : ""
                              }  ${!item?.edit_no_of_transactions && 'readonly'}`}
                            name={`bunkered_creditcardsales[${index}].no_of_transactions`}
                            onChange={formik3.handleChange}
                            value={item?.no_of_transactions || ""}
                            readOnly={!item?.edit_no_of_transactions}
                          />
                          {formik3.errors.bunkered_creditcardsales?.[index]
                            ?.no_of_transactions &&
                            formik3.touched[
                            `bunkered_creditcardsales[${index}].no_of_transactions`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik3.errors.bunkered_creditcardsales[index]
                                    .no_of_transactions
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>


                      {editable?.is_adjustable && (<>
                        <Col lg={2} md={2}>
                          <Form.Group controlId={`bunkered_creditcardsales[${index}].adj_value`}>
                            <Form.Label>ADJUSTMENT VALUE:</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="enter number"
                              className={`input101 ${formik3.errors.bunkered_creditcardsales?.[index]?.adj_value &&
                                formik3.touched[`bunkered_creditcardsales[${index}].adj_value`]
                                ? "is-invalid"
                                : ""
                                }  ${!item?.edit_adj_value ? 'readonly' : ""}`}
                              name={`bunkered_creditcardsales[${index}].adj_value`}
                              onChange={formik3.handleChange}
                              value={
                                formik3?.values?.bunkered_creditcardsales?.[index]?.adj_value ||
                                ""
                              }
                              readOnly={!item?.edit_adj_value}
                            />
                            {formik3.errors.bunkered_creditcardsales?.[index]?.adj_value &&
                              formik3.touched[`bunkered_creditcardsales[${index}].adj_value`] && (
                                <div className="invalid-feedback">
                                  {formik3.errors.bunkered_creditcardsales[index].adj_value}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      </>)}


                      <Col lg={1} md={1}>
                        <>
                          {(editable?.is_editable && editable?.is_addable) ? (
                            <Form.Label>ACTION</Form.Label>
                          ) : (
                            ""
                          )}
                          {(editable?.is_editable && editable?.is_addable) ? (
                            <div className="bunkered-action d-flex ">

                              {formik3?.values?.bunkered_creditcardsales?.length > 1 && (<>
                                <button
                                  className="btn btn-primary me-2"
                                  onClick={() =>
                                    editable?.is_editable
                                      ? removecreditcardRow(index)
                                      : null
                                  }
                                  type="button"
                                >
                                  <RemoveCircleIcon />
                                </button>
                              </>)}


                              {index === formik3.values.bunkered_creditcardsales.length - 1 && (
                                <button
                                  className="btn btn-primary me-2"
                                  type="button"
                                  onClick={pushnoncreditcardRow}
                                >
                                  <AddBoxIcon />
                                </button>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </>
                      </Col>
                    </React.Fragment>
                  </Row>
                ))}
                {editable?.is_editable ? (
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
                ) : (
                  ""
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DepartmentShop;
