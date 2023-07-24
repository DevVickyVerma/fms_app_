import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useFormik } from "formik";
import Select from "react-select";
import Loaderimg from "../../../Utils/Loader";

const DepartmentShop = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  const [data, setData] = useState([]);
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
          setData(data?.data ? data.data : []);  formik.setFieldValue("Bunkered", data?.data);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
      try {
        const response = await axiosInstance.get(
          `/bunkered-sale/list/?site_id=${SiteID}&drs_date=${ReportDate}`
        );

        const { data } = response;
        if (data) {

          formik.setFieldValue("bunkeredSales", data?.data?.listing?.bunkered_Sales);        }
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

    bunkeredDeliveries: [
      {
        card: "",
        fuel: "",
        supplier: "",
        volume: "",
        value: "",
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    card: Yup.string().required("Please select a card"),
    bunkeredDeliveries: Yup.array().of(
      Yup.object().shape({
        fuel: Yup.string().required("Please select a fuel"),
        supplier: Yup.string().required("Please select a supplier"),
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
    pushNewRow();
    SuccessToast("Data submitted successfully!");
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const pushNewRow = () => {
    // Check if the form is valid before adding a new row
    if (formik.isValid) {
      formik.values.bunkeredDeliveries.push({
        fuel: "",
        supplier: "",
        volume: "",
        value: "",
      });
      formik.setFieldValue("bunkeredDeliveries", formik.values.bunkeredDeliveries);
    } else {
      ErrorToast("Please fill all fields correctly before adding a new row.");
    }
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
              <Row>
                <Col lg={12} md={12}>
                  <form onSubmit={formik.handleSubmit}>
                    <div>
                      <label htmlFor="card">Select a Card:</label>
                      <Select
                        id="card"
                        name="card"
                        options={data?.cardsList?.map((card) => ({
                          value: card.id,
                          label: card.card_name,
                        }))}
                        value={data?.cardsList?.find((card) => card.id === formik.values.card)}
                        onChange={(selectedOption) => formik.setFieldValue("card", selectedOption.value)}
                      />
                      {formik.errors.card && <div className="error">{formik.errors.card}</div>}
                    </div>

                    {/* Rest of the form fields */}
                    
                    <div>
                      <button type="button" onClick={pushNewRow}>
                        Add Another
                      </button>
                    </div>

                    <button type="submit">Submit</button>
                  </form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DepartmentShop;
