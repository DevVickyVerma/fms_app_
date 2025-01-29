import React from "react";
import { Card } from "react-bootstrap";

const NoDataComponent = ({ title, showCard = true }) => {
  return (
    <Card className={` ${showCard ? "card h-100" : "h-100"}`}>
      {title && (
        <Card.Header>
          <h4 className="card-title"> {title} </h4>
        </Card.Header>
      )}

      <Card.Body className="hcenter" style={{ margin: "auto" }}>
        <img
          src={require("../../assets/images/commonimages/no_data.png")}
          alt="MyChartImage"
          className=" NoDatasmallimg "
        />
      </Card.Body>
    </Card>
  );
};

export default NoDataComponent;
