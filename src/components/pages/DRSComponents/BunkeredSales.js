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
          const bunkeredSalesValues = data?.data?.listing?.bunkered_Sales.map(
            (sale) => ({
              diesel: sale.fuel_name,
              volume: sale.volume || "",
              value: sale.value || "",
              opening: sale.opening_stock || "",
              closing: sale.closing_stock || "",
            })
          );

          formik.setFieldValue("bunkeredSales", bunkeredSalesValues);
          console.log(bunkeredSalesValues, "bunkeredSalesValues");

          const nonbunkeredsalesValues =
            data?.data?.listing?.non_bunkered_sales.map((sale) => ({
              fuel: sale.fuel_id,
              volume: sale.volume || "",
              value: sale.value || "",
            }));
          formik2.setFieldValue(
            "nonbunkeredsalesvalue",
            nonbunkeredsalesValues
          );
          console.log(nonbunkeredsalesValues, "nonbunkeredsalesValues");
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

  const onSubmit = (values, { resetForm }) => {
    console.log("Bunkered Sales Form Values:", values);
    // Handle form submission here, e.g., API call or other operations
    // After successful submission, reset the form and add a new row
    resetForm();
    // pushbunkeredSalesRow();
    SuccessToast("Data submitted successfully!");
  };

  const nonbunkeredsalesonSubmit = (values, { resetForm }) => {
    console.log("Non Bunkered Sales Form Values:", values);
    // Handle form submission here, e.g., API call or other operations
    // After successful submission, reset the form and add a new row
    resetForm();
    pushnonbunkeredSalesRow();
    SuccessToast("Data submitted successfully!");
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
  const combinedOnSubmit = () => {
    // Combine both form data here
    const formData = {
      bunkeredSales: formik.values.bunkeredSales,
      nonbunkeredsalesvalue: formik2.values.nonbunkeredsalesvalue,
    };

    console.log("Combined Form Data:", formData);
  };

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
                          <Form.Label>Fuel:</Form.Label>
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
                          <Form.Label>volume:</Form.Label>
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
                          <Form.Label>Value:</Form.Label>
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
                          <Form.Label>opening:</Form.Label>
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
                          <Form.Label>closing:</Form.Label>
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
                      <Col lg={2} md={2}>
                        <div className="text-end">
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
                <Row>
                  {formik2.values.nonbunkeredsalesvalue.map((item, index) => (
                    <React.Fragment key={index}>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`nonbunkeredsalesvalue[${index}].fuel`}
                        >
                          <Form.Label>Select a Fuel:</Form.Label>
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
                          <Form.Label>volume:</Form.Label>
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
                          <Form.Label>Value:</Form.Label>
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
                        <div className="text-end">
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => removenonbunkeredSalesRow(index)}
                          >
                            <RemoveCircleIcon />
                          </button>
                          <button
                            className="btn btn-primary me-2"
                            type="button"
                            onClick={pushnonbunkeredSalesRow}
                          >
                            <AddBoxIcon />
                          </button>
                        </div>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
                <div className="text-end">
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
