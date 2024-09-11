
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

const DashboardStatCard = ({ getData, isLoading, filters }) => {
  const [data, setData] = useState();

  const FetchmannegerList = async (filters) => {
    try {
      const response = await getData(`/dashboard/get-live-margin?client_id=${filters?.client_id}&company_id=${filters.company_id}&site_id=${filters.site_id}`);
      if (response && response.data) {
        setData(response?.data?.data)
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    if (filters?.site_id && filters?.client_id && filters.company_id) {
      FetchmannegerList(filters);
    }

  }, [filters]);

  const request = [
    {
      id: 1,
      data: "ℓ 23,536",
      data1: "Gross Volume",
      color: "primary",
      icon: "fa-bar-chart",
    },
    {
      id: 2,
      data: "£ 45,789",
      data1: "Fuel Sales",
      color: "secondary",
      icon: "fa-bar-chart",
    },
    {
      id: 3,
      data: "£ 89,786",
      data1: "Gross profit",
      color: "success",
      icon: "fa-bar-chart",
    },
    {
      id: 4,
      data: "PPl 43,336",
      data1: "Gross Margin",
      color: "info",
      icon: "fa-bar-chart",
    },
    {
      id: 5,
      data: "£ 23,536",
      data1: "Shop Sales",
      color: "primary",
      icon: "fa-bar-chart",
    },
    {
      id: 6, // Fixed duplicate id for the last item
      data: " £ 23,536",
      data1: " Shop Profit",
      color: "primary",
      icon: "fa-bar-chart",
    },
  ];
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString();
  return (
    <Card>
      <Card.Header className="card-header">
        <h4 className="card-title">
          {/* Live Data{" "} */}
          <img
            src={require("../../assets/images/commonimages/LiveIMg.gif")}
            alt="Live Img"
            className="Liveimage"
          />{" "}{" "} Last Updated On : ({data?.last_updated_at})
          {/* ({formattedDateTime}) */}
        </h4>
      </Card.Header>
      <Card.Body className="card-body pb-0">
        <Row>
          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[0].color} img-card box-${request[0].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">L {data?.gross_volume}</h2>
                    <p className="text-white mb-0">Gross Volume</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[0].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[1].color} img-card box-${request[1].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font"> £  {data?.fuel_sales}</h2>
                    <p className="text-white mb-0">Fuel Sales</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[1].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[2].color} img-card box-${request[2].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">£  {data?.gross_profit}</h2>
                    <p className="text-white mb-0">Gross Profit</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[2].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[3].color} img-card box-${request[3].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">   {data?.gross_margin} ppl</h2>
                    <p className="text-white mb-0">Gross Margin</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[3].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[4].color} img-card box-${request[4].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">£  {data?.shop_sales}</h2>
                    <p className="text-white mb-0">Shop Sales</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[4].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={12} md={6} lg={6} xl={4}>
            <Card
              className={`card bg-${request[5].color} img-card box-${request[5].color}-shadow`}
            >
              <Card.Body>
                <div className="d-flex">
                  <div className="text-white">
                    <h2 className="mb-0 number-font">£  {data?.shop_profit}</h2>
                    <p className="text-white mb-0">Shop Profit</p>
                  </div>
                  <div className="ms-auto">
                    <i
                      className={`fa ${request[5].icon} text-white fs-30 me-2 mt-2`}
                    ></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DashboardStatCard;
