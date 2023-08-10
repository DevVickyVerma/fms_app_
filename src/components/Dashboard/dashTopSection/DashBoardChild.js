import React from "react";
import { Breadcrumb, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import DashTopSection from "./DashTopSection";
import DashTopTableSection from "./DashTopTableSection";

const DashBoardChild = () => {
  const location = useLocation();
  // const {myvalueTest} = location.state;
  
  console.log("CHILD LOCATION DATA", location);
  // console.log("CHILD LOCATION DATA", myvalueTest);
  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">DashBoard Child</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              DashBoard Child
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

      </div>
      <Row>
        <DashTopSection />
      </Row>

      <Row>
        <DashTopTableSection />
      </Row>
    </>
  );
};

export default DashBoardChild;
