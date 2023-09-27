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

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [editable, setis_editable] = useState();

  const [isLoading, setIsLoading] = useState(true);

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
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
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
          `/drs/summary/shop?site_id=${site_id}&drs_date=${start_date}`
        );

        const { data } = response;
        if (data) {
          setData(data.data.takings);

          console.log(data.data.takings, "formVdddalues");
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [site_id, client_id]);

  //   const handleSubmit = async (values) => {
  //     const token = localStorage.getItem("token");

  //     console.log(values.data);

  //     // Create a new FormData object
  //     const formData = new FormData();

  //     for (const obj of values.data) {
  //       const { id, charge_value } = obj;
  //       const charge_valueKey = `charge_value[${id}]`;

  //       formData.append(charge_valueKey, charge_value);
  //     }

  //     formData.append("site_id", site_id);
  //     formData.append("drs_date", client_id);

  //     try {
  //       setIsLoading(true);
  //       const response = await fetch(
  //         `${process.env.REACT_APP_BASE_URL}/valet-coffee/update`,
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: formData,
  //         }
  //       );

  //       const responseData = await response.json(); // Read the response once

  //       if (response.ok) {
  //         console.log("Done");
  //         SuccessToast(responseData.message);
  //       } else {
  //         ErrorToast(responseData.message);

  //         console.log("API Error:", responseData);
  //         // Handle specific error cases if needed
  //       }
  //     } catch (error) {
  //       console.log("Request Error:", error);
  //       // Handle request error
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const _renderFunction = () => {
    return Object.keys(data).map((item, index) => {
      const displayName = item
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return (
        <div className="Dps-data">
          <p>{displayName}</p>
          <p>{data[item]}</p>
        </div>
      );
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
                <h3 className="card-title">Department Shop Summary</h3>
              </Card.Header>
              <Card.Body>
                <h4 style={{ marginLeft: "6px" }}>SUMMARY OF TAKINGS</h4>
                {_renderFunction()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default DepartmentShop;
