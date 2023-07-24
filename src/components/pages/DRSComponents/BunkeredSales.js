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
        console.log(data?.data?.listing ? data.data.listing : []);
        setListingData(data?.data?.listing ? data.data : []);
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
    bunkeredDeliveries: [
      {
        fuel: null,
        tank: "",
        supplier: "",
        volume: "",
        value: "",
      },
    ],

    bunkeredSales: [
      {
        fuel: null,
        tank: "",
        supplier: "",
        volume: "",
        value: "",
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    bunkeredDeliveries: Yup.array().of(
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

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    // Handle form submission here, e.g., API call or other operations
    // After successful submission, reset the form and add a new row
    resetForm();
    pushbunkeredDeliveriesRow();
    SuccessToast("Data submitted successfully!");
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleFuelChange = (index, selectedOption) => {
    formik.setFieldValue(
      `bunkeredDeliveries[${index}].fuel`,
      selectedOption ? selectedOption.value : null
    );
  };

  const pushbunkeredDeliveriesRow = () => {
    // Check if the form is valid before adding a new row
    console.log(formik.values);
    if (formik.isValid) {
      formik.values.bunkeredDeliveries.push({
        fuel: "",
        supplier: "",
        volume: "",
        value: "",
      });
      formik.setFieldValue(
        "bunkeredDeliveries",
        formik.values.bunkeredDeliveries
      );
    } else {
      ErrorToast("Please fill all fields correctly before adding a new row.");
    }
  };

  const removebunkeredDeliveriesRow = (index) => {
    const updatedRows = [...formik.values.bunkeredDeliveries];
    updatedRows.splice(index, 1);
    formik.setFieldValue("bunkeredDeliveries", updatedRows);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title"> FUEL DELIVERIES:</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {/* All columns wrapped inside a single Row */}
                <Row>
                  {formik.values.bunkeredDeliveries.map((delivery, index) => (
                    <React.Fragment key={index}>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredDeliveries[${index}].supplier`}
                        >
                          <Form.Label>Select a Supplier:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik.errors.bunkeredDeliveries?.[index]
                                ?.supplier &&
                              formik.touched[
                                `bunkeredDeliveries[${index}].supplier`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredDeliveries[${index}].supplier`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredDeliveries?.[index]
                                ?.supplier || ""
                            }
                          >
                            <option value="">Select a Supplier</option>
                            {data?.fuelSuppliers?.map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {supplier.supplier_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik.errors.bunkeredDeliveries?.[index]
                            ?.supplier &&
                            formik.touched[
                              `bunkeredDeliveries[${index}].supplier`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik.errors.bunkeredDeliveries[index]
                                    .supplier
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredDeliveries[${index}].tank`}
                        >
                          <Form.Label>Select a tank:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik.errors.bunkeredDeliveries?.[index]?.tank &&
                              formik.touched[
                                `bunkeredDeliveries[${index}].tank`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredDeliveries[${index}].tank`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredDeliveries?.[index]
                                ?.tank || ""
                            }
                          >
                            <option value="">Select a tank</option>
                            {data?.siteTanks?.map((tank) => (
                              <option key={tank.id} value={tank.id}>
                                {tank.tank_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik.errors.bunkeredDeliveries?.[index]?.tank &&
                            formik.touched[
                              `bunkeredDeliveries[${index}].tank`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredDeliveries[index].tank}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredDeliveries[${index}].fuel`}
                        >
                          <Form.Label>Select a Fuel:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${
                              formik.errors.bunkeredDeliveries?.[index]?.fuel &&
                              formik.touched[
                                `bunkeredDeliveries[${index}].fuel`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredDeliveries[${index}].fuel`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredDeliveries?.[index]
                                ?.fuel || ""
                            }
                          >
                            <option value="">Select a Fuel</option>
                            {data?.siteFuels?.map((fuel) => (
                              <option key={fuel.id} value={fuel.id}>
                                {fuel.fuel_name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik.errors.bunkeredDeliveries?.[index]?.fuel &&
                            formik.touched[
                              `bunkeredDeliveries[${index}].fuel`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredDeliveries[index].fuel}
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredDeliveries[${index}].volume`}
                        >
                          <Form.Label>Quantity:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredDeliveries?.[index]
                                ?.volume &&
                              formik.touched[
                                `bunkeredDeliveries[${index}].volume`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredDeliveries[${index}].volume`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredDeliveries?.[index]
                                ?.volume || ""
                            }
                          />
                          {formik.errors.bunkeredDeliveries?.[index]?.volume &&
                            formik.touched[
                              `bunkeredDeliveries[${index}].volume`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredDeliveries[index].volume}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`bunkeredDeliveries[${index}].value`}
                        >
                          <Form.Label>Value:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${
                              formik.errors.bunkeredDeliveries?.[index]
                                ?.value &&
                              formik.touched[
                                `bunkeredDeliveries[${index}].value`
                              ]
                                ? "is-invalid"
                                : ""
                            }`}
                            name={`bunkeredDeliveries[${index}].value`}
                            onChange={formik.handleChange}
                            value={
                              formik?.values?.bunkeredDeliveries?.[index]
                                ?.value || ""
                            }
                          />
                          {formik.errors.bunkeredDeliveries?.[index]?.value &&
                            formik.touched[
                              `bunkeredDeliveries[${index}].value`
                            ] && (
                              <div className="invalid-feedback">
                                {formik.errors.bunkeredDeliveries[index].value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={2} md={2}>
                        <div className="text-end">
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => removebunkeredDeliveriesRow(index)}
                          >
                            <RemoveCircleIcon />
                          </button>
                          <button
                            className="btn btn-primary me-2"
                            type="button"
                            onClick={pushbunkeredDeliveriesRow}
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

      <div className="text-end">
        <button className="btn btn-primary me-2" type="submit">
          Submit
        </button>
      </div>
    </>
  );
};

export default DepartmentShop;
