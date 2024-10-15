import React from "react";
import { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { handleError } from "../../../Utils/ToastUtils";

const DepartmentShop = (props) => {
  const {
    site_id,
    start_date,
  } = props;



  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);


  document.addEventListener("keydown", (event) => {
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
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [site_id, start_date]);

  const _renderFunction = () => Object?.keys(data)?.map((item, index) => {
    const displayName = item
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return (
      <div className="Dps-data" key={index}>
        <p>{displayName}</p>
        <p>{data[item]}</p>
      </div>
    );
  });

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
