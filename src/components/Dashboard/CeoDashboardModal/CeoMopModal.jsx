import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import CeoDashboardStatsBox from "../DashboardStatsBox/CeoDashboardStatsBox";
import CeoDashboardCharts from "../CeoDashboardCharts";
import {
  Baroptions,
  cardConfigs,
  DashboardData,
  MopData,
  PerformanceData,
  ReportList,
  salesGraphData,
  Shrinkage,
  StockData,
  StockDetail,
} from "../../../Utils/commonFunctions/CommonData";
import CEODashCommonCard from "../CEODashCommonCard";
import { Card, Col, Row } from "react-bootstrap";
import CeoDashSitetable from "../CeoDashSitetable";
import ReportTable from "../ReportTable";
import { Doughnut } from "react-chartjs-2";
import CeoDashboardBarChart from "../CeoDashboardBarChart";
import DashboardMultiLineChart from "../DashboardMultiLineChart";

const CeoMopModal = (props) => {
  const { title, sidebarContent, visible, onClose } = props;
  const CeohandleNavigateClick = () => {
    console.log("CeohandleNavigateClick");
  };
  const handleDownload = () => {
    console.log("CeohandleNavigateClick");
  };
  console.log(title, "title");
  return (
    <div
      className={`common-sidebar    ${
        visible ? "visible slide-in-right " : "slide-out-right"
      }`}
      style={{
        width:
          title == "MOP Breakdown"
            ? "50%"
            : title == "Comparison"
            ? "70%"
            : "70%",
      }}
    >
      <div className="card">
        <div className="card-header text-center SidebarSearchheader">
          <h3 className="SidebarSearch-title m-0">{title}</h3>
          <button className="close-button" onClick={onClose}>
            {/* <FontAwesomeIcon icon={faTimes} /> */}
            <i className="ph ph-x-circle c-fs-25"></i>
          </button>
        </div>
        <div className="card-body scrollview" style={{ background: "#f2f3f9" }}>
          {title == "MOP Breakdown" && (
            <>
              <Row>
                {cardConfigs.map(
                  ({ dataKey, title, icon, containerStyle, tooltip }) => {
                    const cardData = MopData[dataKey];

                    return (
                      <CEODashCommonCard
                        key={dataKey}
                        isParentComponent={true}
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
            </>
          )}
          {title == "Comparison" && (
            <>
              <CeoDashboardCharts
                Salesstatsloading={false}
                BarGraphSalesStats={salesGraphData}
                Baroptions={Baroptions}
              />
            </>
          )}
          {title == "Performance" && (
            <>
              <CeoDashSitetable
                data={PerformanceData?.top}
                tootiptitle={"Profit"}
                title={"Sites "}
              />
            </>
          )}
          {title == "Reports" && (
            <>
              <Col sm={12} md={12} key={Math.random()}>
                <Card className="">
                  <Card.Header className="p-4 w-100  ">
                    <div className="w-100">
                      <div className="spacebetweenend">
                        <h4 className="card-title">Reports </h4>

                        <span className="textend">View All</span>
                      </div>
                      <div className="spacebetweenend"></div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div>
                      <ReportTable
                        reports={ReportList}
                        pdfisLoading={false}
                        handleDownload={handleDownload}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </>
          )}
          {title == "Daily Wise Sales" && (
            <>
              <Col sm={12} md={12} key={Math.random()}>
                <Card className="">
                  <Card.Header className="p-4 w-100  ">
                    <div className="w-100">
                      <div className="spacebetweenend">
                        <h4 className="card-title">Daily Wise Sales </h4>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div>
                      <DashboardMultiLineChart
                        LinechartValues={
                          DashboardData?.d_line_graph?.series || []
                        }
                        LinechartOption={
                          DashboardData?.d_line_graph?.option?.labels || []
                        }
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </>
          )}
          {(title === "Stock" ||
            title === "Shrinkage" ||
            title === "Stock Details") && (
            <>
              <Row className=" d-flex align-items-stretch">
                <Col sm={12} md={6} xl={6} key={Math.random()} className="mb-6">
                  <Card className="h-100">
                    <Card.Header className="p-4">
                      <h4 className="card-title">Stocks</h4>
                    </Card.Header>
                    <Card.Body
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ width: "300px", height: "300px" }}>
                        <Doughnut
                          data={StockData?.stock_graph_data}
                          options={StockData?.stock_graph_options}
                          height="100px"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} md={6} xl={6} key={Math.random()} className="mb-6">
                  <CeoDashboardBarChart
                    data={Shrinkage?.shrinkage_graph_data}
                    options={Shrinkage?.shrinkage_graph_options}
                    title="Shrinkage"
                    width="300px"
                    height="200px"
                  />
                </Col>
                <Col sm={12} md={12} xl={12} key={Math.random()} className="">
                  <Card className="h-100">
                    <Card.Header className="p-4 w-100 flexspacebetween">
                      <h4 className="card-title">
                        {" "}
                        <div className="lableWithsmall">Stock Details</div>
                      </h4>
                      <span style={{ color: "#4663ac", cursor: "pointer" }}>
                        View Details
                      </span>
                    </Card.Header>
                    <Card.Body style={{ maxHeight: "350px" }}>
                      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <table
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <thead
                            style={{
                              position: "sticky",
                              top: 0,
                              backgroundColor: "#fff",
                              zIndex: 1,
                            }}
                          >
                            <tr>
                              <th style={{ textAlign: "left", padding: "8px" }}>
                                Name
                              </th>
                              <th style={{ textAlign: "left", padding: "8px" }}>
                                Gross Sales
                              </th>
                              <th style={{ textAlign: "left", padding: "8px" }}>
                                Nett Sales
                              </th>
                              <th style={{ textAlign: "left", padding: "8px" }}>
                                Profit
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {StockDetail?.map((stock) => (
                              <tr key={stock?.id}>
                                <td style={{ padding: "8px" }}>
                                  {stock?.name}
                                </td>
                                <td style={{ padding: "8px" }}>
                                  {stock?.gross_sales}
                                </td>
                                <td style={{ padding: "8px" }}>
                                  {stock?.nett_sales}
                                </td>
                                <td style={{ padding: "8px" }}>
                                  {stock?.profit}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CeoMopModal.propTypes = {
  title: PropTypes.string.isRequired,
  sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CeoMopModal;
