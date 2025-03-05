import { Col, Row } from "react-bootstrap";
import CEODashCommonCard from "../CEODashCommonCard";
import CEODashCommonVerticalCard from "../CEODashCommonVerticalCard";
import { getCurrentAndPreviousMonth } from "../../../Utils/commonFunctions/commonFunction";
import { useMyContext } from "../../../Utils/MyContext";
import CardSwiper from "../../../Utils/MobileCommonComponents/CardSwiper";

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

  const handleNavigateClick = () => { };
  const { isMobile } = useMyContext();
  const DashboardcardsData = (singleSiteParsedData) => [
    {
      id: 1,
      title: 'Gross Volume',
      value: singleSiteParsedData?.fuel_volume?.gross_volume || "0.0",
      subValue: singleSiteParsedData?.fuel_volume?.bunkered_volume || "0.0",
      subTitle: 'Bunkered Volume',
      percentage: `${singleSiteParsedData?.fuel_volume?.percentage || "0"}%`,
      status: singleSiteParsedData?.fuel_volume?.status || "down",
      icon: "ℓ"
    },
    {
      id: 2,
      title: 'Fuel Sales (Ex. Vat)',
      value: singleSiteParsedData?.fuel_sales?.gross_value || "0.0",
      subValue: singleSiteParsedData?.fuel_sales?.bunkered_value || "0.0",
      subTitle: 'Bunkered Sales',
      percentage: `${singleSiteParsedData?.fuel_sales?.percentage || "0"}%`,
      status: singleSiteParsedData?.fuel_sales?.status || "down",
      icon: "£"
    },
    {
      id: 3,
      title: 'Gross Profit',
      value: singleSiteParsedData?.gross_profit?.gross_profit || "0.0",
      subValue: singleSiteParsedData?.gross_margin?.gross_margin || "0.0",
      subTitle: 'Gross Margin (Fuel)',
      percentage: `${singleSiteParsedData?.gross_margin?.percentage || "0"}%`,
      status: singleSiteParsedData?.gross_margin?.status || "down",
      icon: "£"
    },
    {
      id: 4,
      title: 'Gross (Bunkered)',
      value: `${singleSiteParsedData?.gross_margin_bunkered?.gross_margin_bunkered || "0"} ppl`,
      subValue: "",
      subTitle: '',
      percentage: `${singleSiteParsedData?.gross_margin_bunkered?.percentage || "0"}%`,
      status: singleSiteParsedData?.gross_margin_bunkered?.status || "down"
    },
    {
      id: 5,
      title: 'Shop Sales (Ex. Vat)',
      value: singleSiteParsedData?.shop_sales?.shop_sales || "0.0",
      subValue: singleSiteParsedData?.shop_sales?.bunkered_value || "0.0",
      subTitle: 'Bunkered Sales',
      percentage: `${singleSiteParsedData?.shop_sales?.percentage || "0"}%`,
      status: singleSiteParsedData?.shop_sales?.status || "down",
      icon: "£"
    },
    {
      id: 6,
      title: 'Shop Profit',
      value: singleSiteParsedData?.shop_profit?.shop_profit || "0.0",
      subValue: singleSiteParsedData?.shop_profit?.bunkered_value || "0.0",
      subTitle: 'Bunkered Sales',
      percentage: `${singleSiteParsedData?.shop_profit?.percentage || "0"}%`,
      status: singleSiteParsedData?.shop_profit?.status || "down",
      icon: "£"
    },
    {
      id: 7,
      title: 'Shop Margin',
      value: singleSiteParsedData?.valet_sales?.valet_sales || "0.0",
      subValue: singleSiteParsedData?.valet_sales?.bunkered_value || "0.0",
      subTitle: 'Bunkered Sales',
      percentage: `${singleSiteParsedData?.valet_sales?.percentage || "0"}%`,
      status: singleSiteParsedData?.valet_sales?.status || "down",
      icon: "%"
    }
  ];
  return (
    <div>
      {isMobile ? <CardSwiper
        singleSiteParsedData={singleSiteParsedData}
        // callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
        parentComponent={false}
        cardsData={DashboardcardsData(singleSiteParsedData)}  // ✅ Call the function
      /> :
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
        </Row>}
    </div>
  );
};

export default CeoDashSubStatsBox;
