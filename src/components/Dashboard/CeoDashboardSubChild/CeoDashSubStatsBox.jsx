import { Col, Row } from "react-bootstrap";
import CEODashCommonCard from "../CEODashCommonCard";
import CEODashCommonVerticalCard from "../CEODashCommonVerticalCard";
import { getCurrentAndPreviousMonth } from "../../../Utils/commonFunctions/commonFunction";

const CeoDashSubStatsBox = ({ Ceo, parentComponent = false }) => {
  const singleSiteStoredData = localStorage.getItem("ceo-singleSiteData");

  let dateOnToolTip = getCurrentAndPreviousMonth();
  const singleSiteParsedData = JSON.parse(singleSiteStoredData);

  const singleSiteFuelSales = singleSiteParsedData
    ? singleSiteParsedData?.fuel_sales
    : null;
  const singleSiteFuelVolume = singleSiteParsedData
    ? singleSiteParsedData?.fuel_volume
    : null;
  const singleSiteGrossMargin = singleSiteParsedData
    ? singleSiteParsedData?.gross_margin
    : null;
  const singleSiteGrossProfit = singleSiteParsedData
    ? singleSiteParsedData?.gross_profit
    : null;
  const singleSiteShopMargin = singleSiteParsedData
    ? singleSiteParsedData?.shop_profit
    : null;
  const singleSiteShopSale = singleSiteParsedData
    ? singleSiteParsedData?.shop_sales
    : null;
  const singleSiteShopFee = singleSiteParsedData
    ? singleSiteParsedData?.shop_fees
    : null;

  const gross_volume = singleSiteParsedData
    ? singleSiteParsedData?.gross_volume
    : null;
  const valet_sales = singleSiteParsedData
    ? singleSiteParsedData?.valet_sales
    : null;
  const gross_profit = singleSiteParsedData
    ? singleSiteParsedData?.gross_profit
    : null;
  const gross_margin = singleSiteParsedData
    ? singleSiteParsedData?.gross_margin
    : null;
  const fuel_sales = singleSiteParsedData
    ? singleSiteParsedData?.fuel_sales
    : null;
  const fuel_commission = singleSiteParsedData
    ? singleSiteParsedData?.fuel_commission
    : null;
  const gross_margin_bunkered = singleSiteParsedData
    ? singleSiteParsedData?.gross_margin_bunkered
    : null;
  const shop_sales = singleSiteParsedData
    ? singleSiteParsedData?.shop_sales
    : null;
  const shop_fees = singleSiteParsedData
    ? singleSiteParsedData?.shop_fees
    : null;
  const shop_profit = singleSiteParsedData
    ? singleSiteParsedData?.shop_profit
    : null;

  const handleNavigateClick = () => {};

  return (
    <div>
      <Row>
        <Col lg={2}>
          <CEODashCommonVerticalCard
            isParentComponent={parentComponent}
            showRightSide={true}
            leftSideData={singleSiteFuelVolume?.gross_volume}
            leftSideTitle={"Gross Volume"}
            RightSideData={singleSiteFuelVolume?.bunkered_volume}
            RightSideTitle={"Bunkered Volume"}
            statusValue={singleSiteFuelVolume?.status}
            percentageValue={singleSiteFuelVolume?.percentage}
            handleNavigateClick={handleNavigateClick}
            icon={"ℓ"}
            containerStyle={"dash-plates-1"}
            xl={12}
            upperTooltipContent={`Till volume + other bunkering categories volume`}
            lastMonthTooltipContent={dateOnToolTip}
          />
        </Col>
        <Col lg={2}>
          <CEODashCommonVerticalCard
            isParentComponent={parentComponent}
            showRightSide={true}
            leftSideData={singleSiteFuelSales?.gross_value}
            leftSideTitle={"Fuel Sales (Ex. Vat)"}
            RightSideData={singleSiteFuelSales?.bunkered_value}
            RightSideTitle={"Bunkered Sales"}
            statusValue={singleSiteFuelSales?.status}
            percentageValue={singleSiteFuelSales?.percentage}
            handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={"dash-plates-3 "}
            xl={12}
            upperTooltipContent={`Till fuel sales + other bunkering categories sales`}
            lastMonthTooltipContent={dateOnToolTip}
          />
        </Col>
        <Col lg={2}>
          <CEODashCommonVerticalCard
            isParentComponent={parentComponent}
            showRightSide={true}
            leftSideData={gross_margin?.gross_margin}
            leftSideTitle={"Gross Margin (Fuel)"}
            RightSideTitle={"Gross Profit"}
            RightSideData={gross_profit?.gross_profit}
            statusValue={gross_margin?.status}
            percentageValue={gross_margin?.percentage}
            handleNavigateClick={handleNavigateClick}
            icon={"ppl"}
            secondIcon={"£"}
            // icon={"£"}
            containerStyle={"dash-plates-3 "}
            xl={12}
            ppl_msg={gross_margin?.is_ppl == 1 ? gross_margin?.ppl_msg : ""}
            upperTooltipContent={`Gross Margin = (Gross Profit / Sales Volume) * 100`}
            lowerTooltipContent={
              "Gross Profit = (Selling Price - Purchase Price) * Sales Volume"
            }
            // lastMonthTooltipContent={`Jan 24 vs Feb 25`}
            lastMonthTooltipContent={dateOnToolTip}
          />
        </Col>

        <Col lg={6}>
          <Row>
            <CEODashCommonCard
              isParentComponent={parentComponent}
              showRightSide={false}
              leftSideData={gross_margin_bunkered?.gross_margin_bunkered}
              leftSideTitle={"Gross (Bunkered)"}
              statusValue={gross_margin_bunkered?.status}
              percentageValue={gross_margin_bunkered?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"£"}
              containerStyle={"dash-plates-5 "}
              xl={6}
              lastMonthTooltipContent={dateOnToolTip}
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
              lastMonthTooltipContent={dateOnToolTip}
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
              upperTooltipContent={`The data is accurately sourced from back-office system`}
              xl={6}
              lastMonthTooltipContent={dateOnToolTip}
            />

            <CEODashCommonCard
              isParentComponent={parentComponent}
              showRightSide={false}
              leftSideData={valet_sales?.valet_sales}
              leftSideTitle={"Shop  Margin"}
              RightSideData={valet_sales?.bunkered_value}
              statusValue={valet_sales?.status}
              percentageValue={valet_sales?.percentage}
              handleNavigateClick={handleNavigateClick}
              icon={"%"}
              containerStyle={"dash-plates-5"}
              xl={6}
              upperTooltipContent={`Shop Margin = (Shop Profit / Shop Sales) *100`}
              lastMonthTooltipContent={dateOnToolTip}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default CeoDashSubStatsBox;
