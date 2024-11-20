
import { useState } from "react";
import withApi from "../../Utils/ApiHelper";
import Loaderimg from "../../Utils/Loader";
import { Card, Col, Row } from "react-bootstrap";
import CeoDashboardStatsBox from "./DashboardStatsBox/CeoDashboardStatsBox";
import {
    Bardata,
    Baroptions,
    Doughnutdata,
    Doughnutoptions,
    DummyReports,
    priceLogData,
    StackedBarChartdata,
    StackedBarChartoptions,
    stockAgingDetails,
} from "../../Utils/commonFunctions/CommonData";
import CeoDashboardBarChart from "./CeoDashboardBarChart";
import { Doughnut } from "react-chartjs-2";
import { ButtonGroup, Dropdown } from 'react-bootstrap';

const CeoDashBoard = (props) => {
    const { isLoading, dashboardData } = props;

    const handleDownload = (url) => {
        // Simulating a download; in real cases, you can trigger a file download or fetch the file
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split("/").pop();
        link.click();
    };



    const dropdown = { color: 'primary' };
    const [dropdownOpen, setDropdownOpen] = useState(false);


    return (
        <>
            {isLoading ? <Loaderimg /> : null}


            <Card className="h-100">


                <Card.Header className="p-4">
                    <h4 className="card-title"> MOP BreakDown </h4>
                </Card.Header>
            </Card>
            <CeoDashboardStatsBox
                GrossVolume={dashboardData?.gross_volume}
                shopmargin={dashboardData?.shop_profit}
                GrossProfitValue={dashboardData?.gross_profit}
                GrossMarginValue={dashboardData?.gross_margin}
                FuelValue={dashboardData?.fuel_sales}
                shopsale={dashboardData?.shop_sales}
                shop_fees={dashboardData?.shop_fees}
                dashboardData={dashboardData}
                callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
            />




            <Row>
                <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
                    <CeoDashboardBarChart data={Bardata} options={Baroptions} title={"Current Month vs Previous Month"} />
                </Col>
                <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
                    <CeoDashboardBarChart data={Bardata} options={Baroptions} title={"Actual Sales vs Budgeted Sales"} />
                </Col>
                <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
                    <CeoDashboardBarChart data={Bardata} options={Baroptions} title={"Same Month Sales vs Previous Year’s Month"} />
                </Col>
            </Row>



            <Row className="d-flex align-items-stretch mt-5 ">
                <Col sm={12} md={8} key={Math.random()}>
                    <Card className="h-100">
                        <Card.Header className="p-4">
                            <div className="spacebetween" style={{ width: "100%" }}>
                                <h4 className="card-title"> Selling Price Logs </h4>
                                {/* <a
                    onClick={toggleDropdown}
                    style={{ alignItems: "end", textDecoration: "underline", cursor: "pointer" }}
                  >
                    ....
                  </a> */}

                                <Dropdown as={ButtonGroup} key={Math.random()}>

                                    <Dropdown.Toggle split variant={dropdown.color} />

                                    <Dropdown.Menu className="super-colors">

                                        <Dropdown.Item className="p-2" eventKey="1">Site 1</Dropdown.Item>
                                        <hr className="p-0 m-0"></hr>
                                        <Dropdown.Item className="p-2" eventKey="2">Site 2</Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Card.Header>
                        <Card.Body className="pt-0">
                            <div>
                                <table style={{ width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Selling</th>
                                            <th>Old Price</th>
                                            <th>New Price</th>
                                            <th>Updated By</th>
                                            <th>Update Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {priceLogData?.map((log) => (
                                            <tr key={log.id}>
                                                <td>{log.id}</td>
                                                <td>{log.productName}</td>
                                                <td>£{log.oldPrice.toFixed(2)}</td>
                                                <td>£{log.newPrice.toFixed(2)}</td>
                                                <td>{log.updatedBy}</td>
                                                <td>{log.updateDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </Card.Body>
                    </Card>



                </Col>
                <Col sm={12} md={4} key={Math.random()}>
                    <Card className="h-100">
                        <Card.Header className="p-4">
                            <h4 className="card-title"> Reports</h4>
                        </Card.Header>
                        <Card.Body className="pt-0">
                            <div >

                                <table style={{ width: "100%" }}>
                                    <thead>
                                        <tr>

                                            <th>Report Name</th>

                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {DummyReports?.map((report) => (
                                            <tr key={report.id} style={{ marginBottom: '10px' }}>

                                                <td>{report.name}</td>

                                                <td>
                                                    <button
                                                        onClick={() => handleDownload(report.reportUrl)}>
                                                        <i className="fa fa-download" style={{ fontSize: "18px", color: "#4663ac" }}></i>

                                                    </button>
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
            <Row className="mt-5 d-flex align-items-stretch" >
                <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
                    <Card className="h-100">
                        <Card.Header className="p-4">
                            <h4 className="card-title"> Stocks </h4>
                        </Card.Header>
                        <Card.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                            <div style={{ width: "300px", height: "300px" }}>
                                <Doughnut data={Doughnutdata} options={Doughnutoptions} height="100px" />
                            </div>

                        </Card.Body>
                    </Card>

                </Col>
                <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
                    <CeoDashboardBarChart data={StackedBarChartdata} options={StackedBarChartoptions} title={"Shrinkage"} width={"300px"} height={"200px"} />
                </Col>
                <Col sm={12} md={4} xl={4} key={Math.random()} className=''>
                    <Card className="h-100">
                        <Card.Header className="p-4">
                            <h4 className="card-title"> Stock Details </h4>
                        </Card.Header>
                        <Card.Body >
                            <div style={{ width: "400px", height: "200px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Stock</th>
                                            <th>Quantity</th>
                                            <th>Aging</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockAgingDetails.map((stock) => (
                                            <tr key={stock.id}>
                                                <td>{stock.id}</td>
                                                <td>{stock.itemName}</td>
                                                <td>{stock.quantity}</td>
                                                <td>{stock.stockAge}</td>



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
    );
};

export default withApi(CeoDashBoard);
