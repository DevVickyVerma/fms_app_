import React from "react";
import { Card } from "react-bootstrap";

const NoDataComponent = ({ title, showCard = true }) => {
  return (
    <div className={` ${showCard ? "card" : ""}`}>
      {title && (
        <Card.Header>
          <h4 className="card-title"> {title} </h4>
        </Card.Header>
      )}

      <Card.Body>
        <img
          src={require("../../assets/images/commonimages/no_data.png")}
          alt="MyChartImage"
          className=" all-center-flex  smallNoDataimg "
        />
      </Card.Body>
    </div>
  );
};

export default NoDataComponent;
