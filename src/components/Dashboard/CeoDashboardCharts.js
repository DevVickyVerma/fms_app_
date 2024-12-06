import { Row, Col } from "react-bootstrap";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import SmallLoader from "../../Utils/SmallLoader";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";

const CeoDashboardCharts = ({ Salesstatsloading, BarGraphSalesStats, Baroptions }) => {

    const renderChartOrLoader = (data, title) => {
        if (Salesstatsloading) {
            return <SmallLoader />;
        }

        if (!data || data.length === 0) {
            return <NoDataComponent title={title} />; // Display a message or fallback when data is empty
        }

        return <CeoDashboardBarChart data={data} options={Baroptions} title={title} />;
    };


    return (
        <Row className="mb-4">
            <Col sm={12} md={4} xl={4} key="chart-1">
                {renderChartOrLoader(BarGraphSalesStats?.sales_mom, "Current Month vs Previous Month")}
            </Col>
            <Col sm={12} md={4} xl={4} key="chart-2">
                {renderChartOrLoader(BarGraphSalesStats?.sales_actual_budgeted, "Actual Sales vs Budgeted Sales")}
            </Col>
            <Col sm={12} md={4} xl={4} key="chart-3">
                {renderChartOrLoader(BarGraphSalesStats?.sales_yoy, "Same Month Sales vs Previous Year’s Month Sales")}
            </Col>
        </Row>
    );
};

export default CeoDashboardCharts;
