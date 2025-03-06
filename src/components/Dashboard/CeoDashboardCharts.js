import { Row, Col } from "react-bootstrap";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import SmallLoader from "../../Utils/SmallLoader";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import LoaderImg from "../../Utils/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useMyContext } from "../../Utils/MyContext";

const CeoDashboardCharts = ({
  Salesstatsloading,
  BarGraphSalesStats,
  Baroptions,
  formik,
  getData,
  isLoading,
}) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (formik?.values?.selectedSite && formik?.values?.comparison_value) {
      // fetchComparisonData();
    }
  }, [formik?.values]);

  const fetchComparisonData = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("site_id", formik?.values?.selectedSite);

      const queryString = queryParams.toString();
      const response = await getData(
        `ceo-dashboard/sales-stats?${queryString}`
      );
      if (response && response.data && response.data.data) {
        setData(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const renderChartOrLoader = (data, title) => {
    if (Salesstatsloading) {
      return <SmallLoader />;
    }

    if (!data || data.length === 0) {
      return <NoDataComponent title={title} />; // Display a message or fallback when data is empty
    }

    return (
      <CeoDashboardBarChart data={data} options={Baroptions} title={title} />
    );
  };
  const { isMobile } = useMyContext();
  return (
    <>
      {isLoading ? <LoaderImg /> : null}
      {isMobile ?
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
          <SwiperSlide >
            {renderChartOrLoader(
              BarGraphSalesStats?.fuel_sales,
              `Fuel (${formik?.values?.comparison_label})`
            )}
          </SwiperSlide>
          <SwiperSlide >
            {renderChartOrLoader(
              BarGraphSalesStats?.shop_sales,
              `Shop (${formik?.values?.comparison_label})`
            )}
          </SwiperSlide>
        </Swiper> : <Row className="mb-4">
          <Col sm={12} md={6} xl={6} key="chart-1">
            {renderChartOrLoader(
              BarGraphSalesStats?.fuel_sales,
              `Fuel (${formik?.values?.comparison_label})`
            )}
          </Col>
          <Col sm={12} md={6} xl={6} key="chart-2">
            {renderChartOrLoader(
              BarGraphSalesStats?.shop_sales,
              `Shop (${formik?.values?.comparison_label})`
            )}
          </Col>

        </Row>}
    </>
  );
};

export default withApi(CeoDashboardCharts);
