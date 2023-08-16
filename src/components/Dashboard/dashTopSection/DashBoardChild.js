import React from "react";
import { Breadcrumb, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import DashTopSection from "./DashTopSection";
import DashTopTableSection from "./DashTopTableSection";
import { useMyContext } from "../../../Utils/MyContext";

const DashBoardChild = () => {
  const location = useLocation();
  // const {
  //   GrossVolume,
  //   shopmargin,
  //   GrossProfitValue,
  //   GrossMarginValue,
  //   FuelValue,
  //   shopsale,
  //   } = location?.state;

  const { testIsWorking, settestIsWorking } = useMyContext();

  settestIsWorking(true);

  const GrossVolume = location.state ? location?.state?.GrossVolume : null;
  const shopmargin = location.state ? location?.state?.shopmargin : null;
  const GrossProfitValue = location.state
    ? location?.state?.GrossProfitValue
    : null;
  const GrossMarginValue = location.state
    ? location?.state?.GrossMarginValue
    : null;
  const FuelValue = location.state ? location?.state?.FuelValue : null;
  const shopsale = location.state ? location.state.shopsale : null;
  const searchdata = location.state ? location.state.searchdata : null;

  const passDataString = localStorage.getItem("passData");

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
        <DashTopSection
          GrossVolume={GrossVolume}
          shopmargin={shopmargin}
          GrossProfitValue={GrossProfitValue}
          GrossMarginValue={GrossMarginValue}
          FuelValue={FuelValue}
          shopsale={shopsale}
        />
      </Row>

      <Row>
        <DashTopTableSection searchdata={searchdata} />
      </Row>
    </>
  );
};

export default DashBoardChild;
