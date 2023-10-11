import React from "react";
import DashTopSubHeading from "./DashTopSubHeading";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

const DashBoardSubChild = ({
  getSiteStats,
  setGetSiteStats,
  getSiteDetails,
  setGetSiteDetails,
  getCompetitorsPrice,
  setGetCompetitorsPrice,
}) => {


  return (
    <>
      <div>
        <div className="page-header ">
          <div>
            <h1 className="page-title">
              {getSiteStats?.data?.site_name
                ? getSiteStats?.data?.site_name
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
                {getSiteStats?.data?.site_name
                  ? getSiteStats?.data?.site_name
                  : "DashBoard Site details"}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* dashboard Whole Page */}
        <DashTopSubHeading
          getSiteStats={getSiteStats}
          setGetSiteStats={setGetSiteStats}
          getSiteDetails={getSiteDetails}
          setGetSiteDetails={setGetSiteDetails}
          getCompetitorsPrice={getCompetitorsPrice}
          setGetCompetitorsPrice={setGetCompetitorsPrice}
        />
      </div>
    </>
  );
};

export default DashBoardSubChild;
