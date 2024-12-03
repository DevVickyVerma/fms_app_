import React from 'react';
import { Card, Col } from 'react-bootstrap';

const ChartCard = ({
    title,
    chartType,
    chartData,
    noChartMessage,
    CeoDashBoard,
    children
}) => (
    <Col lg={chartType === 'full' ? 12 : (chartType === 'stats' ? 4 : 8)}>
        <Card className={chartType === 'stats' ? 'pie-card-default-height' : ''}>
            <Card.Header className="card-header">
                <h4 className="card-title">{title}</h4>
            </Card.Header>
            <Card.Body className="card-body pb-0">
                <div id="chart" className="h-100">
                    {chartData ? (
                        children
                    ) : (
                        <>
                            <img

                                src={
                                    CeoDashBoard
                                        ? require("../../assets/images/commonimages/no_data.png")
                                        : require("../../assets/images/no-chart-img.png")
                                }
                                alt="MyChartImage"
                                className={`all-center-flex ${CeoDashBoard ? "smallNoDataimg" : "disable-chart"
                                    }`}
                            // className="all-center-flex smallNoDataimg"
                            />
                            <p
                                style={{
                                    fontWeight: 500,
                                    fontSize: '0.785rem',
                                    textAlign: 'center',
                                    color: '#d63031',
                                }}
                            >
                                {noChartMessage}
                            </p>
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    </Col>
);

export default ChartCard;
