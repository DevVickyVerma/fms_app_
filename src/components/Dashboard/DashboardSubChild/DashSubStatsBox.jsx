import { Row } from "react-bootstrap";
import DashCommonCard from "../DashCommonCard";
import CEODashCommonCard from "../CEODashCommonCard";

const DashSubStatsBox = ({ Ceo }) => {


  const singleSiteStoredData = localStorage.getItem("singleSiteData");
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



  return (
    <div>
      {
        Ceo ? <Row>
          <CEODashCommonCard
            isParentComponent={false}
            showRightSide={true}
            leftSideData={singleSiteFuelVolume?.gross_volume}
            leftSideTitle={'Fuel Volume'}
            RightSideData={singleSiteFuelVolume?.bunkered_volume}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteFuelVolume?.status}
            percentageValue={singleSiteFuelVolume?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"ℓ"}
            containerStyle={'dash-plates-1'}
          // tooltipContent={'dash-plates-1'}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />


          <CEODashCommonCard
            isParentComponent={false}
            showRightSide={true}
            leftSideData={singleSiteFuelSales?.gross_value}
            leftSideTitle={'Fuel Sales'}
            RightSideData={singleSiteFuelSales?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={singleSiteFuelSales?.status}
            percentageValue={singleSiteFuelSales?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-3'}
          // tooltipContent={'dash-plates-1'}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />


          <CEODashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteGrossProfit?.gross_profit}
            leftSideTitle={'Gross Profit'}
            RightSideData={singleSiteGrossProfit?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteGrossProfit?.status}
            percentageValue={singleSiteGrossProfit?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-5'}
            tooltipContent={`Gross Profit = Total Sales - Opening Stock- Purchases(Deliveries) + Closing Stock`}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />


          <CEODashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteGrossMargin?.gross_margin}
            leftSideTitle={'Gross Profit'}
            RightSideData={singleSiteGrossMargin?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteGrossMargin?.status}
            percentageValue={singleSiteGrossMargin?.percentage}
            // handleNavigateClick={handleNavigateClick}
            // icon={"£"}
            containerStyle={'dash-plates-2'}
            tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
            ppl_msg={singleSiteGrossMargin?.is_ppl == 1 ? singleSiteGrossMargin?.ppl_msg : ""}
            showPPL={true}
          />


          <CEODashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteShopSale?.shop_sales}
            leftSideTitle={'Shop Sales'}
            RightSideData={singleSiteShopSale?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteShopSale?.status}
            percentageValue={singleSiteShopSale?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-4'}
          // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
          // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
          // showPPL={true}
          />


          <CEODashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteShopFee?.shop_fee}
            leftSideTitle={'Shop Fee'}
            RightSideData={singleSiteShopFee?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteShopFee?.status}
            percentageValue={singleSiteShopFee?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-6'}
          // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
          // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
          // showPPL={true}
          />


          <CEODashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteShopMargin?.shop_profit}
            leftSideTitle={'Shop Profit'}
            RightSideData={singleSiteShopMargin?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteShopMargin?.status}
            percentageValue={singleSiteShopMargin?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-5'}
            tooltipContent={`The data is accurately sourced from back-office system`}
          // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
          // showPPL={true}
          />

        </Row> : <Row>
          <DashCommonCard
            isParentComponent={false}
            showRightSide={true}
            leftSideData={singleSiteFuelVolume?.gross_volume}
            leftSideTitle={'Fuel Volume'}
            RightSideData={singleSiteFuelVolume?.bunkered_volume}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteFuelVolume?.status}
            percentageValue={singleSiteFuelVolume?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"ℓ"}
            containerStyle={'dash-plates-1'}
          // tooltipContent={'dash-plates-1'}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />


          <DashCommonCard
            isParentComponent={false}
            showRightSide={true}
            leftSideData={singleSiteFuelSales?.gross_value}
            leftSideTitle={'Fuel Sales'}
            RightSideData={singleSiteFuelSales?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={singleSiteFuelSales?.status}
            percentageValue={singleSiteFuelSales?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-3'}
          // tooltipContent={'dash-plates-1'}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />


          <DashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteGrossProfit?.gross_profit}
            leftSideTitle={'Gross Profit'}
            RightSideData={singleSiteGrossProfit?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteGrossProfit?.status}
            percentageValue={singleSiteGrossProfit?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-5'}
            tooltipContent={`Gross Profit = Total Sales - Opening Stock- Purchases(Deliveries) + Closing Stock`}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />


          <DashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteGrossMargin?.gross_margin}
            leftSideTitle={'Gross Profit'}
            RightSideData={singleSiteGrossMargin?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteGrossMargin?.status}
            percentageValue={singleSiteGrossMargin?.percentage}
            // handleNavigateClick={handleNavigateClick}
            // icon={"£"}
            containerStyle={'dash-plates-2'}
            tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
            ppl_msg={singleSiteGrossMargin?.is_ppl == 1 ? singleSiteGrossMargin?.ppl_msg : ""}
            showPPL={true}
          />


          <DashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteShopSale?.shop_sales}
            leftSideTitle={'Shop Sales'}
            RightSideData={singleSiteShopSale?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteShopSale?.status}
            percentageValue={singleSiteShopSale?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-4'}
          // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
          // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
          // showPPL={true}
          />


          <DashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteShopFee?.shop_fee}
            leftSideTitle={'Shop Fee'}
            RightSideData={singleSiteShopFee?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteShopFee?.status}
            percentageValue={singleSiteShopFee?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-6'}
          // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
          // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
          // showPPL={true}
          />


          <DashCommonCard
            isParentComponent={false}
            showRightSide={false}
            leftSideData={singleSiteShopMargin?.shop_profit}
            leftSideTitle={'Shop Profit'}
            RightSideData={singleSiteShopMargin?.bunkered_value}
            RightSideTitle={'Bunkered Volume'}
            statusValue={singleSiteShopMargin?.status}
            percentageValue={singleSiteShopMargin?.percentage}
            // handleNavigateClick={handleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-5'}
            tooltipContent={`The data is accurately sourced from back-office system`}
          // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
          // showPPL={true}
          />

        </Row>
      }




    </div >
  );
};

export default DashSubStatsBox;
