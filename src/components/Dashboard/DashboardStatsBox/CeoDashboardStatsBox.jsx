import { Row } from "react-bootstrap";
import CEODashCommonCard from "../CEODashCommonCard";

const CeoDashboardStatsBox = ({
  dashboardData,
  parentComponent = true,
  Mopstatsloading,
}) => {
  const CeohandleNavigateClick = () => {
    console.log("CeohandleNavigateClick");
  };

  const cardConfigs = [
    {
      dataKey: "cash_fuel_sales",
      title: "Cash Fuel Sales",
      icon: "£",
      containerStyle: "dash-plates-1",
    },
    {
      dataKey: "cash_shop_sales",
      title: "Cash Shop Sales",
      icon: "£",
      containerStyle: "dash-plates-3",
    },
    {
      dataKey: "card_fuel_sales",
      title: "Card Fuel Sales",
      icon: "£",
      containerStyle: "dash-plates-5",
      // tooltip:
      //   "Gross Profit = Total Sales - Opening Stock - Purchases(Deliveries) + Closing Stock",
    },
    {
      dataKey: "card_shop_sales",
      title: "Card Shop Sales",
      containerStyle: "dash-plates-2",
      icon: "£",
    },
    {
      dataKey: "bunkered_card_fuel_sales",
      title: "Keyfuel Card Fuel Sales",
      icon: "£",
      containerStyle: "dash-plates-4",
    },
    {
      dataKey: "bunkered_card_shop_sales",
      title: "Keyfuel Card Shop Sales",
      icon: "£",
      containerStyle: "dash-plates-6",
    },
  ];

  return (
    <div>
      {dashboardData ? (
        <Row>
          {cardConfigs.map(
            ({ dataKey, title, icon, containerStyle, tooltip }) => {
              const cardData = dashboardData[dataKey];

              return (
                <CEODashCommonCard
                  key={dataKey}
                  isParentComponent={parentComponent}
                  showRightSide={false}
                  leftSideData={cardData?.total_sales}
                  leftSideTitle={title}
                  statusValue={cardData?.status}
                  percentageValue={cardData?.percentage}
                  handleNavigateClick={CeohandleNavigateClick}
                  icon={icon}
                  containerStyle={containerStyle}
                  tooltipContent={tooltip}
                />
              );
            }
          )}
        </Row>
      ) : null}
    </div>
  );
};

export default CeoDashboardStatsBox;
