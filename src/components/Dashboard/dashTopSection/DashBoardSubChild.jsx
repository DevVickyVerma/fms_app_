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

  const GrossVolume = parsedData ? parsedData?.GrossVolume : null;
  const shopmargin = parsedData ? parsedData?.shopmargin : null;
  const GrossProfitValue = parsedData ? parsedData?.GrossProfitValue : null;
  const GrossMarginValue = parsedData ? parsedData?.GrossMarginValue : null;
  const FuelValue = parsedData ? parsedData?.FuelValue : null;
  const shopsale = parsedData ? parsedData?.shopsale : null;
  const searchdata = parsedData ? parsedData?.searchdata : null;
  return (
    <>
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

      <DashTopSection
        GrossVolume={GrossVolume}
        shopmargin={shopmargin}
        GrossProfitValue={GrossProfitValue}
        GrossMarginValue={GrossMarginValue}
        FuelValue={FuelValue}
        shopsale={shopsale}
        searchdata={searchdata}
      />

      {/* dashboard sub page data */}
      <DashTopSubHeading
        getSiteStats={getSiteStats}
        setGetSiteStats={setGetSiteStats}
        getSiteDetails={getSiteDetails}
        setGetSiteDetails={setGetSiteDetails}
      />
    </>
  );
};

export default DashBoardSubChild;
