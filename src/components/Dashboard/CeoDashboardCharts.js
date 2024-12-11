import { Row, Col } from "react-bootstrap";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import SmallLoader from "../../Utils/SmallLoader";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";

const CeoDashboardCharts = ({ Salesstatsloading, BarGraphSalesStats, Baroptions, selectedOption }) => {

    const renderChartOrLoader = (data, title) => {
        if (Salesstatsloading) {
            return <SmallLoader />;
        }

        if (!data || data.length === 0) {
            return <NoDataComponent title={title} />; // Display a message or fallback when data is empty
        }

        return <CeoDashboardBarChart data={data} options={Baroptions} title={title} selectedOption={selectedOption} />;
    };


    return (
        <Row className="mb-4">
            <Col sm={12} md={6} xl={6} key="chart-1">
                {renderChartOrLoader(BarGraphSalesStats?.sales_mom, "Current Month vs Previous Month")}
            </Col>
            <Col sm={12} md={6} xl={6} key="chart-2">
                {renderChartOrLoader(BarGraphSalesStats?.sales_actual_budgeted, "Actual Sales vs Budgeted Sales")}
            </Col>
            <Col sm={12} md={6} xl={6} key="chart-3" className="mt-4">
                {renderChartOrLoader(BarGraphSalesStats?.sales_yoy, "Same Month Sales vs Previous Year’s Month Sales")}
            </Col>

        </Row>
    );
};

export default CeoDashboardCharts;
