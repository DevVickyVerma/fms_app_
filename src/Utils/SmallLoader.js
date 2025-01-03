import { margin } from "@mui/system";
import React from "react";
import { Card } from "react-bootstrap";

const SmallLoader = ({ title = "", showBody = true }) => {
  const loaderStyle = {
    border: "3px solid #f3f3f3", // Light grey
    borderTop: "3px solid #3498db", // Blue
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 0.8s linear infinite",
    margin: "auto",
  };

  const spinnerKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <Card className="h-100">
        {title && (
          <Card.Header className="p-4">
            <h4 className="card-title">{title || "Loading..."}</h4>
          </Card.Header>
        )}

        <Card.Body>
          <style>{spinnerKeyframes}</style>
          <div style={loaderStyle}></div>
        </Card.Body>
      </Card>
    </>
  );
};

export default SmallLoader;
