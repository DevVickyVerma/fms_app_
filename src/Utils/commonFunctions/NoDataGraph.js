import React from 'react';
import { Card } from 'react-bootstrap';

const NoDataGraph = ({ title }) => {
    return (
        <Card>
            <Card.Header><h4 className="card-title"> {title} </h4></Card.Header>
            <Card.Body>
                <img
                    src={require("../../assets/images/no-chart-img.png")}
                    alt="MyChartImage"
                    className=" all-center-flex disable-chart  smallNoDataimg "
                />
            </Card.Body>
        </Card>
    );
};

export default NoDataGraph;
