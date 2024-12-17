import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CEODashCommonCard from "../CEODashCommonCard";
import CEODashCommonVerticalCard from "../CEODashCommonVerticalCard";

const UpercardsCeoDashboardStatsBox = (props) => {
  const {
    GrossVolume,
    shopmargin,
    valet_sales,
    shop_fees,
    GrossProfitValue,
    GrossMarginValue,
    FuelValue,
    gross_margin,
    fuel_commission,
    gross_margin_bunkered,
    shopsale,
    dashboardData,
    callStatsBoxParentFunc,
    parentComponent = true,
  } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  // ceodashboard-details for card navigate
  const isDetailPermissionAvailable = permissionsArray?.includes(
    "ceodashboard-details"
  );
  const navigate = useNavigate();

  const handleNavigateClick = () => {
    let ApplyFilterrequired = UserPermissions?.applyFilter;

    if (dashboardData && Object?.keys(dashboardData)?.length > 0) {
      // Set ApplyFilterrequired to false if searchdata has keys
      ApplyFilterrequired = false;
    }

    if (ApplyFilterrequired && isDetailPermissionAvailable) {
    } else if (!ApplyFilterrequired && isDetailPermissionAvailable) {
      let storedKeyName = "localFilterModalData";
      const storedData = localStorage.getItem(storedKeyName);
      if (storedData) {
        let parsedData = JSON.parse(storedData);

        if (parsedData?.company_id && parsedData?.client_id) {
          // navigate(`/ceodashboard-details`);

          navigate(`/ceodashboard-details`, {
            state: { isCeoDashboard: true }, // Pass the key-value pair in the state
          });
        } else {
          callStatsBoxParentFunc();
        }
      }
    } else if (!ApplyFilterrequired && !isDetailPermissionAvailable) {
    }
  };

  return (
    <div>
      {/* {GrossVolume ? ( */}

      <div className={` ${dashboardData ? "" : "relative pb-4"}`}>
        {!dashboardData && (
          <>
            <h4 className="no-blue-text">
              <span className="p-2 badge bg-danger p-3">
                Please apply filters to see data
              </span>
            </h4>
          </>
        )}

        <Row
          className={`scale-in-center ${
            dashboardData ? "" : "ceo-stats-blur "
          }`}
        >
          <Col lg={2}>
            <CEODashCommonVerticalCard
              isParentComponent={parentComponent}
              showRightSide={true}
              leftSideData={GrossVolume?.gross_volume}
              leftSideTitle={"Gross Volume"}
              RightSideData={GrossVolume?.bunkered_volume}
              RightSideTitle={"Bunkered Volume"}
              statusValue={GrossVolume?.status}
              percentageValue={GrossVolume?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"ℓ"}
              containerStyle={"dash-plates-1"}
              // tooltipContent={'dash-plates-1'}
              // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
              xl={12}
            />
          </Col>
          <Col lg={2}>
            <CEODashCommonVerticalCard
              isParentComponent={parentComponent}
              showRightSide={true}
              leftSideData={FuelValue?.gross_value}
              leftSideTitle={"Fuel Sales (Ex. Vat)"}
              RightSideData={FuelValue?.bunkered_value}
              RightSideTitle={"Bunkered Sales"}
              statusValue={FuelValue?.status}
              percentageValue={FuelValue?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"£"}
              containerStyle={"dash-plates-3 "}
              xl={12}
              // tooltipContent={'dash-plates-1'}
              // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
            />
          </Col>

          <Col lg={2}>
            <CEODashCommonVerticalCard
              isParentComponent={parentComponent}
              showRightSide={true}
              leftSideData={FuelValue?.gross_value}
              leftSideTitle={"Shop Fees"}
              RightSideData={fuel_commission?.fuel_commission}
              RightSideTitle={"Fuel Commission"}
              // statusValue={fuel_commission?.status}
              percentageValue={fuel_commission?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"£"}
              containerStyle={"dash-plates-3 "}
              xl={12}

              // tooltipContent={'dash-plates-1'}
              // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
            />
          </Col>

          <Col lg={2}>
            <CEODashCommonVerticalCard
              isParentComponent={parentComponent}
              showRightSide={true}
              leftSideData={GrossMarginValue?.gross_margin}
              // leftSideData={FuelValue?.gross_value}
              leftSideTitle={"Gross Margin (Fuel)"}
              // RightSideData={FuelValue?.bunkered_value}
              RightSideData={gross_margin_bunkered?.gross_margin_bunkered}
              RightSideTitle={"Gross (Bunkered)"}
              statusValue={GrossMarginValue?.status}
              percentageValue={GrossMarginValue?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"ppl"}
              containerStyle={"dash-plates-3 "}
              xl={12}
              ppl_msg={
                GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""
              }
              tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
              // tooltipContent={'dash-plates-1'}
              // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
            />
          </Col>

          <Col lg={4}>
            <Row>
              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={GrossProfitValue?.gross_profit}
                leftSideTitle={"Gross Profit"}
                RightSideData={GrossProfitValue?.bunkered_value}
                RightSideTitle={"Bunkered Sales"}
                statusValue={GrossProfitValue?.status}
                percentageValue={GrossProfitValue?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-5 "}
                tooltipContent={
                  // "Gross Profit = Total Sales - Opening Stock- Purchases(Deliveries) + Closing Stock"
                  "Gross Profit = Sales Fuel Value - (Fuel Volume × Cost Price)"
                }
                xl={6}
                // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
              />

              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={shopsale?.shop_sales}
                leftSideTitle={"Shop Sales (Ex. Vat)"}
                RightSideData={shopsale?.bunkered_value}
                RightSideTitle={"Bunkered Sales"}
                statusValue={shopsale?.status}
                percentageValue={shopsale?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-4"}
                // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
                // ppl_msg={shopsale?.is_ppl == 1 ? shopsale?.ppl_msg : ""}
                // showPPL={true}
                xl={6}
              />

              {/* <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={GrossMarginValue?.gross_margin}
                leftSideTitle={"Gross Margin"}
                RightSideData={GrossMarginValue?.bunkered_value}
                RightSideTitle={"Bunkered Sales"}
                statusValue={GrossMarginValue?.status}
                percentageValue={GrossMarginValue?.percentage}
                handleNavigateClick={handleNavigateClick}
                // icon={"£"}
                containerStyle={"dash-plates-2"}
                tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
                ppl_msg={
                  GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""
                }
                showPPL={true}
                xl={6}
              /> */}

              {/* <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={shop_fees?.shop_fee}
                leftSideTitle={"Shop Fee"}
                RightSideData={shop_fees?.bunkered_value}
                RightSideTitle={"Bunkered Sales"}
                statusValue={shop_fees?.status}
                percentageValue={shop_fees?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-6"}
                // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
                // ppl_msg={shopsale?.is_ppl == 1 ? shopsale?.ppl_msg : ""}
                // showPPL={true}
                xl={6}
              /> */}

              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={shopmargin?.shop_profit}
                leftSideTitle={"Shop Profit"}
                RightSideData={shopmargin?.bunkered_value}
                RightSideTitle={"Bunkered Sales"}
                statusValue={shopmargin?.status}
                percentageValue={shopmargin?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-5"}
                tooltipContent={`The data is accurately sourced from back-office system`}
                // ppl_msg={shopsale?.is_ppl == 1 ? shopsale?.ppl_msg : ""}
                // showPPL={true}
                xl={6}
              />
              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={valet_sales?.valet_sales}
                leftSideTitle={"Valet Sales"}
                RightSideData={valet_sales?.bunkered_value}
                // RightSideTitle={"Bunkered Sales"}
                statusValue={valet_sales?.status}
                percentageValue={valet_sales?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-5"}
                // tooltipContent={`The data is accurately sourced from back-office system`}
                // ppl_msg={shopsale?.is_ppl == 1 ? shopsale?.ppl_msg : ""}
                // showPPL={true}
                xl={6}
              />
            </Row>
          </Col>
        </Row>
      </div>
      {/* ) : (
        <></>
      )} */}
    </div>
  );
};

export default UpercardsCeoDashboardStatsBox;
