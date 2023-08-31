import React from "react";
import DashTopSubHeading from "./DashTopSubHeading";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import DashTopSection from "./DashTopSection";

const DashBoardSubChild = ({
  getSiteStats,
  setGetSiteStats,
  getSiteDetails,
  setGetSiteDetails,
}) => {
  const storedData = localStorage.getItem("savedDataOfDashboard");
  const parsedData = JSON.parse(storedData);

  return (
    <>
      <div
      // style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
      >
        <div className="page-header ">
          <div>
            <h1 className="page-title">
              {getSiteDetails?.site_name
                ? getSiteDetails?.site_name
                : "DashBoard Site details"}
            </h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard-details" }}
              >
                Details
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                {getSiteDetails?.site_name
                  ? getSiteDetails?.site_name
                  : "DashBoard Site details"}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* dashboard sub page data */}
        <DashTopSubHeading
          getSiteStats={getSiteStats}
          setGetSiteStats={setGetSiteStats}
          getSiteDetails={getSiteDetails}
          setGetSiteDetails={setGetSiteDetails}
        />
      </div>
    </>
  );
};

export default DashBoardSubChild;
