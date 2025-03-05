import { Row } from "react-bootstrap";
import DashCommonCard from "../DashCommonCard";
import CEODashCommonCard from "../CEODashCommonCard";
import CardSwiper from "../../../Utils/MobileCommonComponents/CardSwiper";
import { useMyContext } from "../../../Utils/MyContext";
import { useState } from "react";

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
  const { isMobile } = useMyContext();
  const DashboardcardsData = () => [
    {
      id: 1,
      title: 'Fuel Volume',
      value: singleSiteParsedData?.gross_volume?.gross_volume || "0.0",
      subValue: singleSiteParsedData?.gross_volume?.bunkered_volume || "0.0",
      subTitle: 'Bunkered Volume',
      percentage: singleSiteParsedData?.gross_volume?.percentage || "0%",
      status: singleSiteParsedData?.gross_volume?.status || "down",
      icon: "ℓ"
    },
    {
      id: 2,
      title: 'Fuel Sales ',
      value: singleSiteParsedData?.fuel_sales?.gross_value || "0.0",
      subValue: singleSiteParsedData?.fuel_sales?.bunkered_value || "0.0",
      subTitle: 'Bunkered Sales',
      percentage: singleSiteParsedData?.fuel_sales?.percentage || "0%",
      status: singleSiteParsedData?.fuel_sales?.status || "down",
      icon: "£"
    },
    {
      id: 3,
      title: 'Gross Profit',
      value: singleSiteParsedData?.gross_profit?.gross_profit || "0.0",
      subValue: "",
      subTitle: '',
      percentage: singleSiteParsedData?.gross_profit?.percentage || "0%",
      status: singleSiteParsedData?.gross_profit?.status || "down",
      icon: "£"
    },
    {
      id: 4,
      title: 'Gross Margin',
      value: `${singleSiteParsedData?.gross_margin?.gross_margin || "0"} ppl`,
      subValue: "",
      subTitle: '',
      percentage: singleSiteParsedData?.gross_margin?.percentage || "0%",
      status: singleSiteParsedData?.gross_margin?.status || "down"
    },
    {
      id: 5,
      title: 'Shop Sales',
      value: singleSiteParsedData?.shop_sales?.shop_sales || "0%",
      subValue: singleSiteParsedData?.shop_sales?.bunkered_value,
      subTitle: 'Bunkered Sales',
      percentage: singleSiteParsedData?.shop_sales?.percentage || "0%",
      status: singleSiteParsedData?.shop_sales?.status || "down",
      icon: "£"
    },
    {
      id: 6,
      title: 'Shop Fee',
      value: singleSiteParsedData?.shop_fees?.shop_fee || "0%",
      subValue: singleSiteParsedData?.shop_fees?.bunkered_value,
      subTitle: 'Bunkered Sales',
      percentage: singleSiteParsedData?.shop_fees?.percentage || "0%",
      status: singleSiteParsedData?.shop_fees?.status || "down",
      icon: "£"
    },
    {
      id: 7,
      title: 'Shop Profit',
      value: singleSiteParsedData?.shop_profit?.shop_profit || "0%",
      subValue: singleSiteParsedData?.shop_profit?.bunkered_value,
      subTitle: 'Bunkered Sales',
      percentage: singleSiteParsedData?.shop_profit?.percentage || "0%",
      status: singleSiteParsedData?.shop_profit?.status || "down",
      icon: "£"
    }
  ];
  return (
    <div>

      {isMobile ? <CardSwiper
        dashboardData={singleSiteParsedData}
        // callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
        parentComponent={false}
        cardsData={DashboardcardsData(singleSiteParsedData)}  // ✅ Call the function
      /> : <Row>
        <DashCommonCard
          isParentComponent={false}
          showRightSide={true}
          leftSideData={singleSiteFuelVolume?.gross_volume}
          leftSideTitle={"Fuel Volume"}
          RightSideData={singleSiteFuelVolume?.bunkered_volume}
          RightSideTitle={"Bunkered Volume"}
          statusValue={singleSiteFuelVolume?.status}
          percentageValue={singleSiteFuelVolume?.percentage}
          // handleNavigateClick={handleNavigateClick}
          icon={"ℓ"}
          containerStyle={"dash-plates-1"}
        // upperTooltipContent={'dash-plates-1'}
        // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
        />

        <DashCommonCard
          isParentComponent={false}
          showRightSide={true}
          leftSideData={singleSiteFuelSales?.gross_value}
          leftSideTitle={"Fuel Sales"}
          RightSideData={singleSiteFuelSales?.bunkered_value}
          RightSideTitle={"Bunkered Sales"}
          statusValue={singleSiteFuelSales?.status}
          percentageValue={singleSiteFuelSales?.percentage}
          // handleNavigateClick={handleNavigateClick}
          icon={"£"}
          containerStyle={"dash-plates-3"}
        // upperTooltipContent={'dash-plates-1'}
        // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
        />

        <DashCommonCard
          isParentComponent={false}
          showRightSide={false}
          leftSideData={singleSiteGrossProfit?.gross_profit}
          leftSideTitle={"Gross Profit"}
          RightSideData={singleSiteGrossProfit?.bunkered_value}
          RightSideTitle={"Bunkered Volume"}
          statusValue={singleSiteGrossProfit?.status}
          percentageValue={singleSiteGrossProfit?.percentage}
          // handleNavigateClick={handleNavigateClick}
          icon={"£"}
          containerStyle={"dash-plates-5"}
          upperTooltipContent={`Gross Profit = Total Sales - Opening Stock- Purchases(Deliveries) + Closing Stock`}
        // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
        />

        <DashCommonCard
          isParentComponent={false}
          showRightSide={false}
          leftSideData={singleSiteGrossMargin?.gross_margin}
          leftSideTitle={"Gross Profit"}
          RightSideData={singleSiteGrossMargin?.bunkered_value}
          RightSideTitle={"Bunkered Volume"}
          statusValue={singleSiteGrossMargin?.status}
          percentageValue={singleSiteGrossMargin?.percentage}
          // handleNavigateClick={handleNavigateClick}
          // icon={"£"}
          containerStyle={"dash-plates-2"}
          upperTooltipContent={`Gross Margin = (Gross Profit / Sales Volume) * 100`}
          ppl_msg={
            singleSiteGrossMargin?.is_ppl == 1
              ? singleSiteGrossMargin?.ppl_msg
              : ""
          }
          showPPL={true}
        />

        <DashCommonCard
          isParentComponent={false}
          showRightSide={false}
          leftSideData={singleSiteShopSale?.shop_sales}
          leftSideTitle={"Shop Sales"}
          RightSideData={singleSiteShopSale?.bunkered_value}
          RightSideTitle={"Bunkered Volume"}
          statusValue={singleSiteShopSale?.status}
          percentageValue={singleSiteShopSale?.percentage}
          // handleNavigateClick={handleNavigateClick}
          icon={"£"}
          containerStyle={"dash-plates-4"}
        // upperTooltipContent={`Gross Margin = (Gross Profit / Sales Volume) * 100`}
        // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
        // showPPL={true}
        />

        <DashCommonCard
          isParentComponent={false}
          showRightSide={false}
          leftSideData={singleSiteShopFee?.shop_fee}
          leftSideTitle={"Shop Fee"}
          RightSideData={singleSiteShopFee?.bunkered_value}
          RightSideTitle={"Bunkered Volume"}
          statusValue={singleSiteShopFee?.status}
          percentageValue={singleSiteShopFee?.percentage}
          // handleNavigateClick={handleNavigateClick}
          icon={"£"}
          containerStyle={"dash-plates-6"}
        // upperTooltipContent={`Gross Margin = (Gross Profit / Sales Volume) * 100`}
        // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
        // showPPL={true}
        />

        <DashCommonCard
          isParentComponent={false}
          showRightSide={false}
          leftSideData={singleSiteShopMargin?.shop_profit}
          leftSideTitle={"Shop Profit"}
          RightSideData={singleSiteShopMargin?.bunkered_value}
          RightSideTitle={"Bunkered Volume"}
          statusValue={singleSiteShopMargin?.status}
          percentageValue={singleSiteShopMargin?.percentage}
          // handleNavigateClick={handleNavigateClick}
          icon={"£"}
          containerStyle={"dash-plates-5"}
          upperTooltipContent={`The data is accurately sourced from back-office system`}
        // ppl_msg={singleSiteShopSale?.is_ppl == 1 ? singleSiteShopSale?.ppl_msg : ""}
        // showPPL={true}
        />
      </Row>}




    </div>
  );
};

export default DashSubStatsBox;
