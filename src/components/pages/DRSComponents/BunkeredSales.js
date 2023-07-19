import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Field } from "formik";
const DepartmentShop = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [SelectedcardsList, setSelectedcardsList] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [formValues1, setFormValues1] = useState([]);

  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
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
        const response = await axiosInstance.get(
          `/bunkered-sale/details/?site_id=${SiteID}&drs_date=${ReportDate}`
        );

        const { data } = response;
        if (data) {
          setDataList(data);
          setData(data?.data ? data.data : []);
          setSelectedcardsList(data?.data ? data?.data : []);
          formik.setFieldValue("Bunkered", data?.data);
          formik.setValues(data.data);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [SiteID, ReportDate]);
  const initialValues = {
    data: data,
  };

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const [rows1, setRows1] = useState([{}]);
  const [rows2, setRows2] = useState([{}]);
  const [rows3, setRows3] = useState([{}]);

  const [rows, setRows] = useState([{}]);

  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };
  const handleAddRow1 = () => {
    setRows1([...rows1, {}]);
    setFormValues1([...formValues1, {}]);
  };

  const handleAddRow2 = () => {
    setRows2([...rows2, {}]);
  };
  const handleAddRow3 = () => {
    setRows3([...rows3, {}]);
  };

  const handleRemoveRow1 = (index) => {
    const updatedRows1 = [...rows1];
    updatedRows1.splice(index, 1);
    setRows1(updatedRows1);
  };
  const handleRemoveRow2 = (index) => {
    const updatedRows2 = [...rows1];
    updatedRows2.splice(index, 1);
    setRows2(updatedRows2);
  };
  const handleRemoveRow3 = (index) => {
    const updatedRows3 = [...rows3];
    updatedRows3.splice(index, 1);
    setRows3(updatedRows3);
  };
  const validationSchema = Yup.object().shape({
    selectcardID: Yup.string().required("Select a Card"),
    selectFuelID: Yup.string().required("Select a Fuel"),
    selectSupplierID: Yup.string().required("Select a Supplier"),
    volume: Yup.string().required("Enter a Volume"),
    value: Yup.string().required("Enter a Value"),
  });

  const formik = useFormik({
    initialValues: {
      selectcardID: "",
      selectFuelID: "",
      selectSupplierID: "",
      volume: "",
      value: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values); // Log the formik values to the console
      handleSubmit(values);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    formik.validateForm().then(() => {
      if (Object.keys(formik.errors).length === 0) {
        // No validation errors, proceed with form submission
        formik.handleSubmit();
        console.log(formik.values); // Log the formik values to the console

        // Additional logic after successful form submission
        setRows([...rows, {}]);
        setFormValues([...formValues, {}]);
      } else {
        // There are validation errors, handle them accordingly
        // You can update the UI to display the error messages or take any other appropriate action
        console.log(formik.errors, "erros"); // Log the validation errors to the console
      }
    });
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> FUEL DELIVERIES:</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={12} md={12}>
                    <form onSubmit={handleSubmit}>
                      <div>
                        {rows.map((row, index) => (
                          <div key={index} className="row-container">
                            <Row>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    htmlFor="selectcardID"
                                    className="form-label mt-4"
                                  >
                                    Cards
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className={`input101 ${
                                      formik.errors.selectcardID &&
                                      formik.touched.selectcardID
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="selectcardID"
                                    name="selectcardID"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues = [...formValues];
                                      updatedFormValues[index] = {
                                        ...updatedFormValues[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues(updatedFormValues);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formValues[index]?.selectcardID || ""
                                    }
                                  >
                                    <option value="">Select a Cards </option>

                                    {SelectedcardsList &&
                                    SelectedcardsList.cardsList ? (
                                      SelectedcardsList.cardsList.map(
                                        (item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.card_name}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option disabled>No Card</option>
                                    )}
                                  </select>
                                  {formik.errors.selectcardID && (
                                    <div className="invalid-feedback">
                                      {formik.errors.selectcardID}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    htmlFor="selectFuelID"
                                    className="form-label mt-4"
                                  >
                                    FUEL
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className={`input101 ${
                                      formik.errors.selectFuelID &&
                                      formik.touched.selectFuelID
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="selectFuelID"
                                    name="selectFuelID"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues = [...formValues];
                                      updatedFormValues[index] = {
                                        ...updatedFormValues[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues(updatedFormValues);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formValues[index]?.selectFuelID || ""
                                    }
                                  >
                                    <option value="">Select a FUEL</option>
                                    {SelectedcardsList &&
                                    SelectedcardsList?.siteFuels ? (
                                      SelectedcardsList?.siteFuels.map(
                                        (item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.fuel_name}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option disabled>No FUEL</option>
                                    )}
                                  </select>
                                  {formik.errors.selectFuelID &&
                                    formik.touched.selectFuelID && (
                                      <div className="invalid-feedback">
                                        {formik.errors.selectFuelID}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    htmlFor="selectSupplierID"
                                    className="form-label mt-4"
                                  >
                                    SUPPLIER
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className={`input101 ${
                                      formik.errors.selectSupplierID &&
                                      formik.touched.selectSupplierID
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="selectSupplierID"
                                    name="selectSupplierID"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues = [...formValues];
                                      updatedFormValues[index] = {
                                        ...updatedFormValues[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues(updatedFormValues);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formValues[index]?.selectSupplierID}
                                  >
                                    <option value="">Select a SUPPLIER</option>
                                    {SelectedcardsList &&
                                    SelectedcardsList?.fuelSuppliers ? (
                                      SelectedcardsList?.fuelSuppliers.map(
                                        (item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.supplier_name}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option disabled>No SUPPLIER </option>
                                    )}
                                  </select>
                                  {formik.errors.selectSupplierID &&
                                    formik.touched.selectSupplierID && (
                                      <div className="invalid-feedback">
                                        {formik.errors.selectSupplierID}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="volume"
                                  >
                                    VOLUME
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.volume &&
                                      formik.touched.volume
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="volume"
                                    name="volume"
                                    placeholder="VOLUME"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues = [...formValues];
                                      updatedFormValues[index] = {
                                        ...updatedFormValues[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues(updatedFormValues);
                                    }}
                                    value={formValues[index]?.volume}
                                    onBlur={formik.handleBlur}
                                  />
                                  {formik.errors.volume &&
                                    formik.touched.volume && (
                                      <div className="invalid-feedback">
                                        {formik.errors.volume}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className="form-label mt-4"
                                    htmlFor="value"
                                  >
                                    VALUE
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.value &&
                                      formik.touched.value
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="value"
                                    name="value"
                                    placeholder="VALUE"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formValues[index]?.value}
                                  />
                                  {formik.errors.value &&
                                    formik.touched.value && (
                                      <div className="invalid-feedback">
                                        {formik.errors.value}
                                      </div>
                                    )}
                                </div>
                              </Col>

                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    ACTION
                                    <span className="text-danger">*</span>
                                  </label>
                                  <button
                                    className="btn btn-primary me-2"
                                    type="submit"
                                  >
                                    <AddIcon />
                                  </button>
                                  {index > 0 && (
                                    <button
                                      onClick={() => handleRemoveRow(index)}
                                      className="btn btn-danger me-2"
                                      type="button"
                                    >
                                      <RemoveIcon />
                                    </button>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </div>
                    </form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">BUNKERED SALES::</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={12} md={12}>
                    <form onSubmit={formik.handleSubmit}>
                      <div>
                        {rows1.map((row, index) => (
                          <div key={index} className="row-container">
                            <Row>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    htmlFor="selectFuelID"
                                    className="form-label mt-4"
                                  >
                                    FUEL
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className={`input101 ${
                                      formik.errors.selectFuelID &&
                                      formik.touched.selectFuelID
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="selectFuelID"
                                    name="selectFuelID"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues1 = [
                                        ...formValues1,
                                      ];
                                      updatedFormValues1[index] = {
                                        ...updatedFormValues1[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues1(updatedFormValues1);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formValues1[index]?.selectFuelID1 || ""
                                    }
                                  >
                                    <option value="">Select a FUEL</option>
                                    {SelectedcardsList &&
                                    SelectedcardsList?.siteFuels ? (
                                      SelectedcardsList?.siteFuels.map(
                                        (item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.fuel_name}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option disabled>No FUEL</option>
                                    )}
                                  </select>
                                  {formik.errors.selectFuelID &&
                                    formik.touched.selectFuelID && (
                                      <div className="invalid-feedback">
                                        {formik.errors.selectFuelID}
                                      </div>
                                    )}
                                </div>
                              </Col>

                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="openstock"
                                  >
                                    OPENING STOCK
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name &&
                                      formik.touched.openstock
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="openstock"
                                    name="openstock"
                                    placeholder="OPENING STOCK"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues1 = [
                                        ...formValues1,
                                      ];
                                      updatedFormValues1[index] = {
                                        ...updatedFormValues1[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues1(updatedFormValues1);
                                    }}
                                    value={formValues1[index]?.openstock || ""}
                                  />
                                  {formik.errors.openstock &&
                                    formik.touched.openstock && (
                                      <div className="invalid-feedback">
                                        {formik.errors.openstock}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="eftvolume"
                                  >
                                    EFT VOLUME
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name &&
                                      formik.touched.eftvolume
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="eftvolume"
                                    name="eftvolume"
                                    placeholder="EFT VOLUME"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues1 = [
                                        ...formValues1,
                                      ];
                                      updatedFormValues1[index] = {
                                        ...updatedFormValues1[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues1(updatedFormValues1);
                                    }}
                                    value={formValues1[index]?.eftvolume || ""}
                                  />
                                  {formik.errors.eftvolume &&
                                    formik.touched.eftvolume && (
                                      <div className="invalid-feedback">
                                        {formik.errors.eftvolume}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="manualvolume"
                                  >
                                    MANUAL VOLUME
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name &&
                                      formik.touched.manualvolume
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="manualvolume"
                                    name="manualvolume"
                                    placeholder="MANUAL VOLUME"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues1 = [
                                        ...formValues1,
                                      ];
                                      updatedFormValues1[index] = {
                                        ...updatedFormValues1[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues1(updatedFormValues1);
                                    }}
                                    value={
                                      formValues1[index]?.manualvolume || ""
                                    }
                                  />
                                  {formik.errors.manualvolume &&
                                    formik.touched.manualvolume && (
                                      <div className="invalid-feedback">
                                        {formik.errors.manualvolume}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={1} md={1}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="salesvalue"
                                  >
                                    SALES VALUE
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name &&
                                      formik.touched.salesvalue
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="salesvalue"
                                    name="salesvalue"
                                    placeholder="SALES VALUE"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues1 = [
                                        ...formValues1,
                                      ];
                                      updatedFormValues1[index] = {
                                        ...updatedFormValues1[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues1(updatedFormValues1);
                                    }}
                                    value={formValues1[index]?.salesvalue || ""}
                                  />
                                  {formik.errors.salesvalue &&
                                    formik.touched.salesvalue && (
                                      <div className="invalid-feedback">
                                        {formik.errors.salesvalue}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={1} md={1}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="closingstock"
                                  >
                                    CLOSING STOCK
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.closingstock &&
                                      formik.touched.closingstock
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="closingstock"
                                    name="closingstock"
                                    placeholder="CLOSING STOCK"
                                    onChange={(e) => {
                                      formik.handleChange(e);
                                      const updatedFormValues1 = [
                                        ...formValues1,
                                      ];
                                      updatedFormValues1[index] = {
                                        ...updatedFormValues1[index],
                                        [e.target.name]: e.target.value,
                                      };
                                      setFormValues1(updatedFormValues1);
                                    }}
                                    value={
                                      formValues1[index]?.closingstock || ""
                                    }
                                  />
                                  {formik.errors.closingstock &&
                                    formik.touched.closingstock && (
                                      <div className="invalid-feedback">
                                        {formik.errors.closingstock}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    ACTION
                                    <span className="text-danger">*</span>
                                  </label>
                                  <button
                                    className="btn btn-primary me-2"
                                    onClick={handleAddRow1}
                                  >
                                    <AddIcon />
                                  </button>
                                  {index > 0 && (
                                    <button
                                      onClick={() => handleRemoveRow1(index)}
                                      className="btn btn-danger me-2"
                                    >
                                      <RemoveIcon />
                                    </button>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        {/* <button onClick={handleAddRow}>+</button> */}
                      </div>
                      {/* <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/manageitems/`}
                      >
                        Cancel
                      </button>

                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div> */}
                    </form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">NON BUNKERED SALES:</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={12} md={12}>
                    <form onSubmit={formik.handleSubmit}>
                      <div>
                        {rows2.map((row, index) => (
                          <div key={index} className="row-container">
                            <Row>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    htmlFor="selectFuelID"
                                    className="form-label mt-4"
                                  >
                                    FUEL
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className={`input101 ${
                                      formik.errors.selectFuelID &&
                                      formik.touched.selectFuelID
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="selectFuelID"
                                    name="selectFuelID"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.selectFuelID}
                                  >
                                    <option value="">Select a FUEL</option>
                                    {SelectedcardsList &&
                                    SelectedcardsList?.siteFuels ? (
                                      SelectedcardsList?.siteFuels.map(
                                        (item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.fuel_name}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option disabled>No FUEL</option>
                                    )}
                                  </select>
                                  {formik.errors.selectFuelID &&
                                    formik.touched.selectFuelID && (
                                      <div className="invalid-feedback">
                                        {formik.errors.selectFuelID}
                                      </div>
                                    )}
                                </div>
                              </Col>

                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    QUANTITY
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name && formik.touched.name
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="name"
                                    name="name"
                                    placeholder="QUANTITY"
                                    onChange={formik.handleChange}
                                    value={formik.values.name || ""}
                                  />
                                  {formik.errors.name &&
                                    formik.touched.name && (
                                      <div className="invalid-feedback">
                                        {formik.errors.name}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    VALUE
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name && formik.touched.name
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="name"
                                    name="name"
                                    placeholder="VALUE"
                                    onChange={formik.handleChange}
                                    value={formik.values.name || ""}
                                  />
                                  {formik.errors.name &&
                                    formik.touched.name && (
                                      <div className="invalid-feedback">
                                        {formik.errors.name}
                                      </div>
                                    )}
                                </div>
                              </Col>

                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    ACTION
                                    <span className="text-danger">*</span>
                                  </label>
                                  <button
                                    className="btn btn-primary me-2"
                                    onClick={handleAddRow2}
                                  >
                                    <AddIcon />
                                  </button>
                                  {index > 0 && (
                                    <button
                                      onClick={() => handleRemoveRow2(index)}
                                      className="btn btn-danger me-2"
                                    >
                                      <RemoveIcon />
                                    </button>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        {/* <button onClick={handleAddRow}>+</button> */}
                      </div>
                    </form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">BUNKERED CREDIT CARD SALES:</h3>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={12} md={12}>
                    <form onSubmit={formik.handleSubmit}>
                      <div>
                        {rows3.map((row, index) => (
                          <div key={index} className="row-container">
                            <Row>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    htmlFor="selectFuelID"
                                    className="form-label mt-4"
                                  >
                                    CARD NAME
                                    <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className={`input101 ${
                                      formik.errors.selectFuelID &&
                                      formik.touched.selectFuelID
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="selectFuelID"
                                    name="selectFuelID"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.selectFuelID}
                                  >
                                    <option value="">
                                      Select a CARD NAME{" "}
                                    </option>
                                    {SelectedcardsList &&
                                    SelectedcardsList?.cardsList ? (
                                      SelectedcardsList?.cardsList.map(
                                        (item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.card_name}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option disabled>No CARD NAME </option>
                                    )}
                                  </select>
                                  {formik.errors.selectFuelID &&
                                    formik.touched.selectFuelID && (
                                      <div className="invalid-feedback">
                                        {formik.errors.selectFuelID}
                                      </div>
                                    )}
                                </div>
                              </Col>

                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    KOISK VALUE
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name && formik.touched.name
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="name"
                                    name="name"
                                    placeholder="KOISK VALUE"
                                    onChange={formik.handleChange}
                                    value={formik.values.name || ""}
                                  />
                                  {formik.errors.name &&
                                    formik.touched.name && (
                                      <div className="invalid-feedback">
                                        {formik.errors.name}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    OPT VALUE
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name && formik.touched.name
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="name"
                                    name="name"
                                    placeholder="OPT VALUE"
                                    onChange={formik.handleChange}
                                    value={formik.values.name || ""}
                                  />
                                  {formik.errors.name &&
                                    formik.touched.name && (
                                      <div className="invalid-feedback">
                                        {formik.errors.name}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    ACCOUNT VALUE
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name && formik.touched.name
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="name"
                                    name="name"
                                    placeholder="ACCOUNT VALUE"
                                    onChange={formik.handleChange}
                                    value={formik.values.name || ""}
                                  />
                                  {formik.errors.name &&
                                    formik.touched.name && (
                                      <div className="invalid-feedback">
                                        {formik.errors.name}
                                      </div>
                                    )}
                                </div>
                              </Col>
                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    NO. OF TRANSACTIONS
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className={`input101 ${
                                      formik.errors.name && formik.touched.name
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    id="name"
                                    name="name"
                                    placeholder="NO. OF TRANSACTIONS"
                                    onChange={formik.handleChange}
                                    value={formik.values.name || ""}
                                  />
                                  {formik.errors.name &&
                                    formik.touched.name && (
                                      <div className="invalid-feedback">
                                        {formik.errors.name}
                                      </div>
                                    )}
                                </div>
                              </Col>

                              <Col lg={2} md={2}>
                                <div className="form-group">
                                  <label
                                    className=" form-label mt-4"
                                    htmlFor="name"
                                  >
                                    ACTION
                                    <span className="text-danger">*</span>
                                  </label>
                                  <button
                                    className="btn btn-primary me-2"
                                    onClick={handleAddRow3}
                                  >
                                    <AddIcon />
                                  </button>
                                  {index > 0 && (
                                    <button
                                      onClick={() => handleRemoveRow3(index)}
                                      className="btn btn-danger me-2"
                                    >
                                      <RemoveIcon />
                                    </button>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                        {/* <button onClick={handleAddRow}>+</button> */}
                      </div>
                      {/* <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-danger me-2 "
                        to={`/manageitems/`}
                      >
                        Cancel
                      </button>

                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div> */}
                    </form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default DepartmentShop;
