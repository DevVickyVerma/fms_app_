import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CEODashCommonCard from "../CEODashCommonCard";
import CEODashCommonVerticalCard from "../CEODashCommonVerticalCard";

const UpercardsCeoDashboardStatsBox = (props) => {
  const {
    gross_volume,
    shopmargin,
    valet_sales,
    shop_profit,
    shop_fees,
    gross_profit,
    gross_margin,
    fuel_sales,
    fuel_commission,
    gross_margin_bunkered,
    shop_sales,
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
      {/* {gross_volume ? ( */}

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
              leftSideData={gross_volume?.gross_volume}
              leftSideTitle={"Gross Volume"}
              RightSideData={gross_volume?.bunkered_volume}
              RightSideTitle={"Bunkered Volume"}
              statusValue={gross_volume?.status}
              percentageValue={gross_volume?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"ℓ"}
              containerStyle={"dash-plates-1"}
              xl={12}
            />
          </Col>
          <Col lg={2}>
            <CEODashCommonVerticalCard
              isParentComponent={parentComponent}
              showRightSide={true}
              leftSideData={fuel_sales?.gross_value}
              leftSideTitle={"Fuel Sales (Ex. Vat)"}
              RightSideData={fuel_sales?.bunkered_value}
              RightSideTitle={"Bunkered Sales"}
              statusValue={fuel_sales?.status}
              percentageValue={fuel_sales?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"£"}
              containerStyle={"dash-plates-3 "}
              xl={12}
            />
          </Col>
          <Col lg={2}>
            {/*  // !  here  "Shop Earnings" is  Coming from "shop_fees Data" */}
            <CEODashCommonVerticalCard
              isParentComponent={parentComponent}
              showRightSide={true}
              leftSideData={shop_fees?.shop_fee}
              leftSideTitle={"Shop Earnings"}
              RightSideData={fuel_commission?.fuel_commission}
              RightSideTitle={"Fuel Commission"}
              percentageValue={shop_fees?.percentage}
              statusValue={shop_fees?.status}
              handleNavigateClick={handleNavigateClick}
              icon={"£"}
              containerStyle={"dash-plates-3 "}
              xl={12}
            />
          </Col>

          {/* // ! Right Side Data Will come From "gross_margin_bunkered" that is
          different Key */}
          <Col lg={2}>
            <CEODashCommonVerticalCard
              isParentComponent={parentComponent}
              showRightSide={true}
              leftSideData={gross_margin?.gross_margin}
              leftSideTitle={"Gross Margin (Fuel)"}
              RightSideData={gross_margin_bunkered?.gross_margin_bunkered}
              RightSideTitle={"Gross (Bunkered)"}
              statusValue={gross_margin?.status}
              percentageValue={gross_margin?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"ppl"}
              containerStyle={"dash-plates-3 "}
              xl={12}
              ppl_msg={gross_margin?.is_ppl == 1 ? gross_margin?.ppl_msg : ""}
              tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
            />
          </Col>
          <Col lg={4}>
            <Row>
              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={gross_profit?.gross_profit}
                leftSideTitle={"Gross Profit"}
                statusValue={gross_profit?.status}
                percentageValue={gross_profit?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-5 "}
                tooltipContent={
                  "Gross Profit = Sales Fuel Value - (Fuel Volume × Cost Price)"
                }
                xl={6}
              />

              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={shop_sales?.shop_sales}
                leftSideTitle={"Shop Sales (Ex. Vat)"}
                statusValue={shop_sales?.status}
                percentageValue={shop_sales?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-4"}
                xl={6}
              />

              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={shop_profit?.shop_profit}
                leftSideTitle={"Shop Profit"}
                statusValue={shop_profit?.status}
                percentageValue={shop_profit?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-5"}
                tooltipContent={`The data is accurately sourced from back-office system`}
                xl={6}
              />

              <CEODashCommonCard
                isParentComponent={parentComponent}
                showRightSide={false}
                leftSideData={valet_sales?.valet_sales}
                leftSideTitle={"Valet Sales"}
                RightSideData={valet_sales?.bunkered_value}
                statusValue={valet_sales?.status}
                percentageValue={valet_sales?.percentage}
                handleNavigateClick={handleNavigateClick}
                icon={"£"}
                containerStyle={"dash-plates-5"}
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
