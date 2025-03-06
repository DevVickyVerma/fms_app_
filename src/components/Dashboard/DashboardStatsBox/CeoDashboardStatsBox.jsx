import { Card, Col, Row } from "react-bootstrap";
import CEODashCommonCard from "../CEODashCommonCard";
import { formatNumber } from "../../../Utils/commonFunctions/commonFunction";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
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
      dataKey: "card_fuel_sales",
      title: "Card Fuel Sales",
      icon: "£",
      containerStyle: "dash-plates-5",
      // tooltip:
      //   "Gross Profit = Total Sales - Opening Stock - Purchases(Deliveries) + Closing Stock",
    },
    {
      dataKey: "bunkered_card_fuel_sales",
      title: "Keyfuel Card Fuel Sales",
      icon: "£",
      containerStyle: "dash-plates-4",
    },
    {
      dataKey: "cash_shop_sales",
      title: "Cash Shop Sales",
      icon: "£",
      containerStyle: "dash-plates-3",
    },

    {
      dataKey: "card_shop_sales",
      title: "Card Shop Sales",
      containerStyle: "dash-plates-2",
      icon: "£",
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
        <>
          <Row>
            {/* className=" m-2 fw-600 slide-in-left" */}
            <Col lg={6} className=" d-flex ">
              <Card className="slide-in-left mop-total-sale-card">
                {" "}
                <Card.Body className="  fs-15   fw-500  py-3">
                  Total Fuel Sale (Inc. Vat){" "}
                  <i className="ph ph-gas-pump heartbeat c-top-3 me-1"> </i> -{" "}
                  <span className=" fw-600">
                    £
                    {formatNumber(
                      Number(dashboardData?.card_fuel_sales?.total_sales) +
                      Number(dashboardData?.cash_fuel_sales?.total_sales) +
                      Number(
                        dashboardData?.bunkered_card_fuel_sales.total_sales
                      )
                    )}
                  </span>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className=" d-flex">
              <Card className="slide-in-right mop-total-sale-card">
                <Card.Body className="  fs-15   fw-500  py-3">
                  <span className=" ">
                    Total Shop Sale (Inc. Vat){" "}
                    <i className="ph ph-shopping-cart heartbeat c-top-3 me-1"></i>
                    -{" "}
                    <span className=" fw-600">
                      £
                      {formatNumber(
                        Number(dashboardData?.card_shop_sales?.total_sales) +
                        Number(dashboardData?.cash_shop_sales?.total_sales) +
                        Number(
                          dashboardData?.bunkered_card_shop_sales?.total_sales
                        )
                      )}
                    </span>
                  </span>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="flip-in-ver-right">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1} // Default: Show 1 card per slide
              pagination={{ clickable: true }}
              navigation
              breakpoints={{
                768: { slidesPerView: 2 }, // Show 2 cards per slide on tablets
                1024: { slidesPerView: 3, navigation: false }, // Show 3+ cards in normal layout
              }}
            >
              {cardConfigs.map(({ dataKey, title, icon, containerStyle, tooltip }) => {
                const cardData = dashboardData[dataKey];

                return (
                  <SwiperSlide key={dataKey}>
                    <CEODashCommonCard
                      isParentComponent={parentComponent}
                      showRightSide={false}
                      leftSideData={cardData?.total_sales}
                      leftSideTitle={title}
                      statusValue={cardData?.status}
                      percentageValue={cardData?.percentage}
                      handleNavigateClick={CeohandleNavigateClick}
                      icon={icon}
                      containerStyle={containerStyle}
                      upperTooltipContent={tooltip}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Row>
        </>
      ) : null}
    </div>
  );
};

export default CeoDashboardStatsBox;
