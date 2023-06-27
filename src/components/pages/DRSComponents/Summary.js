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
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [bankingdata, setbankingData] = useState([]);
  const [summarydata, setsummarydata] = useState([]);
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
          `/drs/summary/?site_id=${SiteID}&drs_date=${ReportDate}`
        );

        const { data } = response;
        if (data) {
          setData(data.data.takings);
          setbankingData(data.data.banking);
          setsummarydata(data.data);
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

  const _renderFunction = () => {
    return Object.keys(data).map((item, index) => {
      return (
        <div className="Dps-data">
          <p>{item}</p>
          <p>{data[item]}</p>
        </div>
      );
    });
  };
  const _renderFunction1 = () => {
    return Object.keys(bankingdata).map((item, index) => {
      return (
        <div className="Dps-data">
          <p>{item}</p>
          <p>{bankingdata[item]}</p>
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
               <h3 className="card-title">SUMMARY OF TAKINGS</h3>
              </Card.Header>
              <Card.Body>
         
                {_renderFunction()}
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <h3 className="card-title">SUMMARY OF BAKING</h3>
              </Card.Header>
              <Card.Body>{_renderFunction1()}
             
              
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <h3 className="card-title">Cash Difference</h3>
              </Card.Header>
              <Card.Body>
              <div className="Dps-data">
              <p>Cash Difference</p>
          <p>{summarydata.cash_difference}</p>
      
        </div>
              
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default DepartmentShop;
