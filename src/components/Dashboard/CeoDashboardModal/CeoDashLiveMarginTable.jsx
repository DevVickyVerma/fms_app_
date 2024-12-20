import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { BsFillFuelPumpFill } from "react-icons/bs";

const CeoDashLiveMarginTable = ({ getData, fuel_stats }) => {
  const [gridIndex, setGridIndex] = useState(0);

  const handleGradsClick = (index) => {
    setGridIndex(index);
  };

  return (
    <>
      {/* Grads with bootstrap */}
      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between flex-wrap">
              <h3 className="card-title">Grades Analysis</h3>
            </Card.Header>

            <Card.Body>
              {fuel_stats?.length > 0 ? (
                <>
                  <Row>
                    <Col lg={6} md={12} xl={6} sm={12}>
                      <Card.Header>
                        <h3 className="card-title">Grades</h3>
                      </Card.Header>
                      <Card.Body>
                        <Row className=" d-flex flex-column">
                          {fuel_stats?.map((fuelState, index) => (
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                              onClick={() => handleGradsClick(index)}
                              style={{
                                border:
                                  gridIndex === index
                                    ? "1px dashed #b3b3b3"
                                    : "",
                                cursor: "pointer",
                                fontWeight: gridIndex === index ? 700 : "",
                                background:
                                  gridIndex === index
                                    ? "rgba(182, 185, 198, 0.5098039216)"
                                    : "",
                              }}
                            >
                              <span className=" d-flex align-items-center gap-2 mb-2">
                                <BsFillFuelPumpFill />
                                {fuelState?.name}
                              </span>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Col>

                    <>
                      <Col lg={6} md={12} xl={6} sm={12}>
                        <Card.Header>
                          <h3 className="card-title">Key Matrices</h3>
                        </Card.Header>
                        <Card.Body>
                          <Row className="d-flex flex-column">
                            {/* 2nd Total fuel Volume */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span className=" d-flex align-items-center gap-2 mb-2">
                                <strong>
                                  {" "}
                                  Total Fuel Volume :{" "}
                                  <span className="l-sign fw-normal">
                                    {fuel_stats?.[gridIndex]?.fuel_volume}
                                  </span>
                                </strong>
                              </span>
                            </Col>
                            {/* Total Fuel Sales */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span className=" d-flex align-items-center gap-2">
                                <strong> Total Fuel Sales :</strong>
                                {fuel_stats?.[gridIndex]?.fuel_value}
                              </span>
                            </Col>

                            {/* Gross Margin */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span className=" d-flex align-items-center gap-2">
                                <strong> Gross Margin :</strong>
                                {fuel_stats?.[gridIndex]?.gross_margin}
                              </span>
                            </Col>

                            {/* Gross Profit */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span className=" d-flex align-items-center gap-2 ">
                                <strong> Gross Profit :</strong>
                                {fuel_stats?.[gridIndex]?.gross_profit}
                              </span>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Col>
                    </>
                  </Row>
                </>
              ) : (
                <>
                  <img
                    src={require("../../../assets/images/commonimages/no_data.png")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default withApi(CeoDashLiveMarginTable);
