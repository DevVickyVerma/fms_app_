import { Row, Col } from "react-bootstrap";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import SmallLoader from "../../Utils/SmallLoader";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import LoaderImg from "../../Utils/Loader";

const CeoDashboardCharts = ({
  Salesstatsloading,
  BarGraphSalesStats,
  Baroptions,
  selectedOption,
  formik,
  getData,
  isLoading,
}) => {
  const [data, setData] = useState();
  console.log(formik?.values, "forasdasdasdmik");

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
      <CeoDashboardBarChart
        data={data}
        options={Baroptions}
        title={title}
        selectedOption={selectedOption}
      />
    );
  };

  return (
    <>
      {isLoading ? <LoaderImg /> : null}
      <Row className="mb-4">
        <Col sm={12} md={6} xl={6} key="chart-1">
          {renderChartOrLoader(
            data?.sales_mom,
            "Current Month vs Previous Month"
          )}
        </Col>
        <Col sm={12} md={6} xl={6} key="chart-2">
          {renderChartOrLoader(
            data?.sales_actual_budgeted,
            "Actual Sales vs Budgeted Sales"
          )}
        </Col>
        <Col sm={12} md={6} xl={6} key="chart-3" className="mt-4">
          {renderChartOrLoader(
            data?.sales_yoy,
            "Same Month Sales vs Previous Year’s Month Sales"
          )}
        </Col>
      </Row>
    </>
  );
};

export default withApi(CeoDashboardCharts);
