import React, { useEffect, useState } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useFormik } from "formik";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";

const DepartmentShop = (props) => {
  const {
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
  const [isLoading, setIsLoading] = useState(true);
  const [editable, setis_editable] = useState();


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
        if (data?.data?.listing) {
          setis_editable(response?.data?.data);

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
        }
      }
    } catch (error) {
      console.error("API error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
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
    // validationSchema: validationSchema,
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

      // Push the new row into formik2 values
      formik2.values?.non_bunkered_sales?.push(newRow);

      // Update the formik2 state
      formik2.setFieldValue("non_bunkered_sales", formik2?.values?.non_bunkered_sales);
    } else {
      ErrorAlert(
        "Please fill all fields correctly before adding a new bunkered sales row."
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
        edit_adj_value: true,
        edit_fuel_name: true,
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

      // Manually add a new row with the specific fields and default values
      const newRow = {
        id: "", // Use the random ID generator here
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

  const removecreditcardRow = (index) => {
    const updatedRows = formik3?.values?.bunkered_creditcardsales?.filter(
      (item, i) => i !== index
    );
    formik3.setFieldValue("bunkered_creditcardsales", updatedRows);
  };

  const removebunkeredSalesRow = (index) => {
    try {
      const updatedRows = formik?.values?.bunkered_Sales?.filter(
        (item, i) => i !== index
      );
      if (updatedRows) {
        formik.setFieldValue("bunkered_Sales", updatedRows);
      }
    } catch (error) {
      console.error("Error removing bunkered sales row:", error);
    }
  };

  const removenonbunkeredSalesRow = (index) => {
    try {
      const updatedRows = formik2?.values?.non_bunkered_sales?.filter(
        (item, i) => i !== index
      );
      if (updatedRows) {
        formik2.setFieldValue("non_bunkered_sales", updatedRows);
      }
    } catch (error) {
      console.error("Error removing non-bunkered sales row:", error);
    }
  };


  const combinedOnSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseURL = process.env.REACT_APP_BASE_URL; // Replace with your actual base URL

      const formData = new FormData();


      // Append data from formik.values.bunkered_Sales
      formik.values?.bunkered_Sales?.forEach((obj, index) => {
        const { id, fuel_id, volume, value, card_id, adj_value } = obj;

        // If id exists, use it; otherwise, fall back to index
        const key = id || index;

        formData.append(`bunkered_sale_id[${key}]`, key);
        formData.append(`bunkered_sale_card_id[${key}]`, card_id);
        formData.append(`bunkered_sale_fuel_id[${key}]`, fuel_id);
        formData.append(`bunkered_sale_volume[${key}]`, volume);
        formData.append(`bunkered_sale_value[${key}]`, value);
        formData.append(`bunkered_sale_adj_value[${key}]`, adj_value);
      });



      // Append data from formik.values.bunkered_Sales
      formik2.values?.non_bunkered_sales?.forEach((obj, index) => {
        const { id, fuel_id, volume, value, card_id, adj_value } = obj;

        // If id exists, use it; otherwise, fall back to index
        const key = id || index;

        formData.append(`nonbunkered_id[${key}]`, key);
        formData.append(`nonbunkered_card_id[${key}]`, card_id);
        formData.append(`nonbunkered_fuel_id[${key}]`, fuel_id);
        formData.append(`nonbunkered_volume[${key}]`, volume);
        formData.append(`nonbunkered_value[${key}]`, value);
        formData.append(`nonbunkered_adj_value[${key}]`, adj_value);
      });

      // Append data from formik3.values.bunkered_creditcardsales
      formik3.values?.bunkered_creditcardsales?.forEach((obj, index) => {
        const { id, koisk_value, opt_value, account_value, card_id, adj_value, no_of_transactions } = obj;

        // If id exists, use it; otherwise, fall back to index
        const key = id || index;

        formData.append(`bunkered_credit_card_sales_id[${key}]`, key);
        formData.append(`bunkered_credit_card_sales_card_id[${key}]`, card_id);
        formData.append(`bunkered_credit_card_sales_koisk_value[${key}]`, koisk_value);
        formData.append(`bunkered_credit_card_sales_opt_value[${key}]`, opt_value);
        formData.append(`bunkered_credit_card_sales_account_value[${key}]`, account_value);
        formData.append(`bunkered_credit_card_sales_no_of_transactions[${key}]`, no_of_transactions);
        formData.append(`bunkered_credit_card_sales_adj_value[${key}]`, adj_value);
      });



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


            <Card.Header className=' w-100 d-flex justify-content-between'>
              <h3 className="card-title">BUNKERED SALES </h3>

              <span className="text-end">

                {(editable?.is_editable && editable?.is_addable) ? (
                  <>
                    {formik?.values?.bunkered_Sales?.length > 0 && formik?.values?.bunkered_Sales?.length < 5 && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={pushbunkeredSalesRow}
                      >
                        <i className="ph ph-plus"></i>
                      </button>
                    )}
                  </>
                ) : (
                  ""
                )}
              </span>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {/* All columns wrapped inside a single Row */}

                {formik?.values?.bunkered_Sales?.length > 0 ? <>
                  {formik?.values?.bunkered_Sales?.map((delivery, index) => (
                    <Row>
                      <React.Fragment key={index}>
                        <Col lg={editable?.is_adjustable ? 2 : 4} md={2}>
                          <Form.Group
                            controlId={`bunkered_Sales[${index}].fuel_id`}
                          >
                            <Form.Label>FUEL</Form.Label>

                            <Form.Control
                              as="select"
                              className={`input101 ${formik.errors.bunkered_Sales?.[index]
                                ?.fuel_id &&
                                formik.touched[
                                `bunkered_Sales[${index}].fuel_id`
                                ]
                                ? "is-invalid"
                                : ""
                                } ${!delivery?.edit_fuel_name ? 'readonly' : ""} `}
                              name={`bunkered_Sales[${index}].fuel_id`}
                              onChange={formik.handleChange}
                              value={delivery?.fuel_id || ""}
                              disabled={!delivery?.edit_fuel_name}
                            >
                              <option value="">Select a Fuel</option>
                              {data?.siteFuels?.map((fuel) => (
                                <option key={fuel?.id} value={fuel?.id}>
                                  {fuel?.fuel_name}
                                </option>
                              ))}
                            </Form.Control>
                            {formik.errors.bunkered_Sales?.[index]
                              ?.fuel_id &&
                              formik.touched[
                              `bunkered_Sales[${index}].fuel_id`
                              ] && (
                                <div className="invalid-feedback">
                                  {
                                    formik.errors.bunkered_Sales[index]
                                      .fuel_id
                                  }
                                </div>
                              )}


                          </Form.Group>
                        </Col>
                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                          <Form.Group controlId={`bunkered_Sales[${index}].card_id`}>
                            <Form.Label>CARD NAME</Form.Label>
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
                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                          <Form.Group
                            controlId={`bunkered_Sales[${index}].volume`}
                          >
                            <Form.Label>VOLUME</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                          <Form.Group controlId={`bunkered_Sales[${index}].value`}>
                            <Form.Label>VALUE</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                          <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                            <Form.Group controlId={`bunkered_Sales[${index}].adj_value`}>
                              <Form.Label>ADJUSTMENT VALUE</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Value"
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

                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2} className="text-end">
                          {(editable?.is_editable && editable?.is_addable) ? (
                            <div className="bunkered-action">

                              {formik?.values?.bunkered_Sales?.length > 1 && (<>
                                <div
                                  className="text-end"
                                  style={{ marginTop: "35px" }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removebunkeredSalesRow(index)}
                                  >
                                    <i className="ph ph-minus"></i>
                                  </button>
                                </div>
                              </>)}
                            </div>
                          ) : (
                            ""
                          )}
                        </Col>


                      </React.Fragment>
                    </Row>
                  ))}
                </> : <>
                  <>
                    <img
                      src={require("../../../assets/images/commonimages/no_data.png")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                </>}

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="row-sm">
        <Col lg={12}>
          <Card>

            <Card.Header className=' w-100 d-flex justify-content-between'>
              <h3 className="card-title">NON BUNKERED SALES </h3>

              <span className="text-end">
                {(editable?.is_editable && editable?.is_addable) ? (
                  <>
                    {formik2?.values?.non_bunkered_sales?.length < 5 && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={pushnonbunkeredSalesRow}
                      >
                        <i className="ph ph-plus"></i>
                      </button>
                    )}
                  </>
                ) : (
                  ""
                )}
              </span>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={formik2.handleSubmit}>
                {/* All columns wrapped inside a single Row */}


                {formik2.values.non_bunkered_sales?.length > 0 ? <>
                  {formik2.values.non_bunkered_sales.map((item, index) => (
                    <Row>
                      <React.Fragment key={index}>
                        <Col lg={editable?.is_adjustable ? 2 : 4} md={2}>
                          <Form.Group
                            controlId={`non_bunkered_sales[${index}].fuel_id`}
                          >
                            <Form.Label>FUEL</Form.Label>
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
                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                          <Form.Group
                            controlId={`non_bunkered_sales[${index}].card_id`}
                          >
                            <Form.Label>CARD NAME</Form.Label>
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
                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                          <Form.Group
                            controlId={`non_bunkered_sales[${index}].volume`}
                          >
                            <Form.Label>VOLUME</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                          <Form.Group
                            controlId={`non_bunkered_sales[${index}].value`}
                          >
                            <Form.Label>VALUE</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                          <Col lg={editable?.is_adjustable ? 2 : 2} md={2}>
                            <Form.Group controlId={`non_bunkered_sales[${index}].adj_value`}>
                              <Form.Label>ADJUSTMENT VALUE</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Value"
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

                        <Col lg={editable?.is_adjustable ? 2 : 2} md={2} className="text-end">
                          {(editable?.is_editable && editable?.is_addable) ? (
                            <div className="bunkered-action">

                              {formik2?.values?.non_bunkered_sales?.length > 1 && (<>
                                <div
                                  className="text-end"
                                  style={{ marginTop: "35px" }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removenonbunkeredSalesRow(index)}
                                  >
                                    <i className="ph ph-minus"></i>
                                  </button>
                                </div>
                              </>)}
                            </div>

                          ) : (
                            ""
                          )}
                        </Col>
                      </React.Fragment>
                    </Row>
                  ))}

                </> : <>
                  <>
                    <img
                      src={require("../../../assets/images/commonimages/no_data.png")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                </>}

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header className=' w-100 d-flex justify-content-between'>
              <h3 className="card-title">BUNKERED CREDIT CARD SALES </h3>
              <span className="text-end">
                {(editable?.is_editable && editable?.is_addable) ? (
                  <>
                    {formik3?.values?.bunkered_creditcardsales?.length < 5 && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={pushnoncreditcardRow}
                      >
                        <i className="ph ph-plus"></i>
                      </button>
                    )}
                  </>
                ) : (
                  ""
                )}
              </span>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik3.handleSubmit}>
                {/* All columns wrapped inside a single Row */}


                {formik3.values?.bunkered_creditcardsales?.length > 0 ? <>

                  {formik3.values?.bunkered_creditcardsales?.map((item, index) => (
                    <Row>
                      <React.Fragment key={index}>
                        <Col lg={2} md={2}>
                          <Form.Group
                            controlId={`bunkered_creditcardsales[${index}].card_id`}
                          >
                            <Form.Label>CARD NAME</Form.Label>
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
                        <Col lg={editable?.is_adjustable ? 1 : 2} md={1}>
                          <Form.Group
                            controlId={`bunkered_creditcardsales[${index}].koisk_value`}
                          >
                            <Form.Label>KOISK </Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                        <Col lg={editable?.is_adjustable ? 1 : 2} md={1}>
                          <Form.Group
                            controlId={`bunkered_creditcardsales[${index}].opt_value`}
                          >
                            <Form.Label>OPT </Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                            <Form.Label> ACCOUNT VALUE</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                            <Form.Label> TRANSACTIONS </Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Value"
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
                              <Form.Label>ADJUSTMENT VALUE</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Value"
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
                        <Col lg={2} md={2} className="text-end">
                          {(editable?.is_editable && editable?.is_addable) ? (
                            <div className="bunkered-action">

                              {formik3?.values?.bunkered_creditcardsales?.length > 1 && (<>
                                <div
                                  className="text-end"
                                  style={{ marginTop: "35px" }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removecreditcardRow(index)}
                                  >
                                    <i className="ph ph-minus"></i>
                                  </button>
                                </div>
                              </>)}
                            </div>

                          ) : (
                            ""
                          )}
                        </Col>
                      </React.Fragment>
                    </Row>
                  ))}

                </> : <>
                  <>
                    <img
                      src={require("../../../assets/images/commonimages/no_data.png")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                </>}

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
