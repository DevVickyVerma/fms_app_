import React from "react";
import { Breadcrumb, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DashTopSection from "./DashTopSection";
import DashTopTableSection from "./DashTopTableSection";

const DashBoardChild = () => {
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

        <div className="ms-auto pageheader-btn">
          <div className="input-group">
            {/* {isAddPermissionAvailable ? (
                <Link
                  to="/addusers"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Users
                  <AddCircleOutlineIcon />
                </Link>
              ) : null} */}
            For Future Update
          </div>
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
