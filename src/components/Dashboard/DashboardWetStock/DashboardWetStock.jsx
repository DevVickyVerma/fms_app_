

import WetStockStatsBox from './WetStockStatsBox'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import SortIcon from "@mui/icons-material/Sort";
import StackedLineBarChart from '../StackedLineBarChart';
import DashboardOverallStatsPieChart from '../DashboardOverallStatsPieChart';

const DashboardWetStock = () => {


    const dummyData = {
        "gross_volume": {
            "gross_volume": "1,710,264.65",
            "bunkered_volume": "127,599.66",
            "total_volume": "1,837,864.31",
            "status": "down",
            "percentage": "-0.52"
        },
        "fuel_sales": {
            "gross_value": "2,026,900.13",
            "bunkered_value": "189,907.13",
            "total_value": "2,216,807.26",
            "status": "up",
            "percentage": "6.41"
        },
        "gross_profit": {
            "gross_profit": 1548729.4,
            "gross_margin": 84.27,
            "status": "up",
            "percentage": "9.41"
        },
        "gross_margin": [],
        "shop_sales": {
            "shop_sales": "211931.9",
            "shop_margin": "69370.93",
            "status": "up",
            "percentage": "4.63",
            "p_status": "up",
            "p_percentage": "4.96"
        },
        "line_graph": {
            "labels": [
                "Jan 2024",
                "Feb 2024"
            ],
            "datasets": [
                {
                    "label": "Fuel Volume (ℓ)",
                    "data": [
                        "1974024.1",
                        "1710264.65"
                    ],
                    "borderColor": "rgba(255, 99, 132, 1)",
                    "backgroundColor": "rgba(255, 99, 132, 0.5)",
                    "type": "line",
                    "yAxisID": "y1"
                },
                {
                    "label": "Gross Margin (ppl)",
                    "data": [
                        "74.21",
                        "84.27"
                    ],
                    "borderColor": "rgba(54, 162, 235, 1)",
                    "backgroundColor": "rgba(54, 162, 235, 0.5)",
                    "type": "bar",
                    "yAxisID": "y"
                },
                {
                    "label": "Shop Sales (£)",
                    "data": [
                        "232034.0",
                        "211931.9"
                    ],
                    "borderColor": "rgba(154, 62, 251, 1)",
                    "backgroundColor": "rgba(154, 62, 251, 0.5)",
                    "type": "line",
                    "yAxisID": "y1"
                }
            ]
        },
        "pi_graph": {
            "shop_sales": "211931.9",
            "fuel_sales": "2026900.13",
            "bunkered_sales": "189907.13"
        },
        "dateString": "01 Feb - 27 Feb",
        "gross_margin_": {
            "gross_margin": 84.27,
            "is_ppl": 1,
            "ppl_msg": "The tank stock is incorrect",
            "status": "up",
            "percentage": "14.76"
        },
        "d_line_graph": {
            "series": [
                {
                    "name": "Fuel Volume (ℓ)",
                    "type": "line",
                    "data": [
                        "69160.86",
                        "73027.42",
                        "63531.68",
                        "58333.19",
                        "65904.9",
                        "63249.96",
                        "65818.93",
                        "58587.1",
                        "73852.16",
                        "56220.87",
                        "62403.72",
                        "66748.39",
                        "59433.57",
                        "58457.4",
                        "67259.29",
                        "69785.42",
                        "60034.42",
                        "56669.05",
                        "63118.14",
                        "61152.02",
                        "61274.62",
                        "62138.6",
                        "71506.54",
                        "62331.6",
                        "55208.73",
                        "63210.35",
                        "61845.72"
                    ]
                },
                {
                    "name": "Gross Margin (ppl)",
                    "type": "line",
                    "data": [
                        "72.29",
                        "121.11",
                        "18.33",
                        "82.92",
                        "133.93",
                        "81.01",
                        "79.1",
                        "87.93",
                        "71.93",
                        "81.61",
                        "87.74",
                        "125.87",
                        "42.15",
                        "84.63",
                        "81.5",
                        "77.93",
                        "89.15",
                        "87.41",
                        "85.97",
                        "82.46",
                        "136.42",
                        "84.97",
                        "25.05",
                        "25.0",
                        "166.44",
                        "82.97",
                        "88.22"
                    ]
                },
                {
                    "name": "Shop Sales (£)",
                    "type": "line",
                    "data": [
                        "8298.98",
                        "8533.41",
                        "8073.83",
                        "7682.93",
                        "7470.18",
                        "7576.99",
                        "8048.17",
                        "8657.86",
                        "9402.71",
                        "6082.52",
                        "7803.81",
                        "7577.81",
                        "7306.85",
                        "7454.76",
                        "7983.44",
                        "9203.01",
                        "7207.8",
                        "7272.49",
                        "7617.4",
                        "7385.1",
                        "7691.36",
                        "7852.03",
                        "8613.09",
                        "8185.36",
                        "6901.89",
                        "8234.85",
                        "7813.27"
                    ]
                }
            ],
            "option": {
                "chart": {
                    "height": 350,
                    "type": "line"
                },
                "title": {
                    "text": ""
                },
                "dataLabels": {
                    "enabled": true,
                    "enabledOnSeries": []
                },
                "labels": [
                    "01 Feb 2024",
                    "02 Feb 2024",
                    "03 Feb 2024",
                    "04 Feb 2024",
                    "05 Feb 2024",
                    "06 Feb 2024",
                    "07 Feb 2024",
                    "08 Feb 2024",
                    "09 Feb 2024",
                    "10 Feb 2024",
                    "11 Feb 2024",
                    "12 Feb 2024",
                    "13 Feb 2024",
                    "14 Feb 2024",
                    "15 Feb 2024",
                    "16 Feb 2024",
                    "17 Feb 2024",
                    "18 Feb 2024",
                    "19 Feb 2024",
                    "20 Feb 2024",
                    "21 Feb 2024",
                    "22 Feb 2024",
                    "23 Feb 2024",
                    "24 Feb 2024",
                    "25 Feb 2024",
                    "26 Feb 2024",
                    "27 Feb 2024"
                ],
                "xaxis": {
                    "type": "datetime"
                },
                "yaxis": [
                    {
                        "title": {
                            "text": "Fuel Volume"
                        }
                    },
                    {
                        "opposite": true,
                        "title": {
                            "text": "Shop Sales"
                        }
                    }
                ]
            }
        },
        "shop_profit": {
            "shop_profit": "69370.93",
            "status": "up",
            "percentage": "4.96"
        }
    }



    // Dummy data for testing
    const stacked_line_bar_label = ["January", "February", "March", "April", "May", "June"];
    const stacked_line_bar_data = [
        {
            label: "Dataset 1",
            data: [65, 59, 80, 81, 56, 55],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            yAxisID: "y",
        },
        {
            label: "Dataset 2",
            data: [28, 48, 40, 19, 86, 27],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            yAxisID: "y1",
        }
    ];


    // Dummy data for testing
    const pie_chart_values = {
        "label": [
            "Shop Sales",
            "Fuel Sales",
            "Bunkered Sales"
        ],
        "colors": [
            "rgba(126, 149, 228, 1)",
            "rgba(59, 96, 172, 1)",
            "rgba(147, 141, 223, 1)"
        ],
        "series": [
            "854277.99",
            "4683321.28",
            "426913.58"
        ]
    }



    return (
        <>

            <div className=' d-flex justify-content-between align-items-center my-5'>
                <div>
                    <h4 className=' fw-bold'>WetStock Stats</h4>
                </div>
                <div>
                    <Link
                        className="btn btn-primary btn-sm"
                        // onClick={() => {
                        //     handleToggleSidebar1();
                        // }}
                        title="filter"
                    // visible={sidebarVisible1}
                    // onClose={handleToggleSidebar1}
                    // onSubmit={handleFormSubmit}
                    // searchListstatus={SearchList}
                    >
                        Filter
                        <span className="ms-2">
                            <SortIcon />
                        </span>
                    </Link>
                </div>
            </div>



            <WetStockStatsBox
                GrossVolume={dummyData?.gross_volume}
                shopmargin={dummyData?.shop_margin}
                GrossProfitValue={dummyData?.gross_profit_value}
                GrossMarginValue={dummyData?.gross_margin_value}
                FuelValue={dummyData?.fuel_value}
                shopsale={dummyData?.shop_sale}
                searchdata={dummyData?.searchdata}
                shouldNavigateToDetailsPage={dummyData?.shouldNavigateToDetailsPage}
                setShouldNavigateToDetailsPage={dummyData?.setShouldNavigateToDetailsPage}
            />


            <Row style={{ marginBottom: "10px", marginTop: "20px" }}>
                <Col style={{ width: "60%" }}>
                    <Card>
                        <Card.Header className="card-header">
                            <h4 className="card-title" style={{ minHeight: "32px" }}>
                                Total Transactions
                            </h4>
                        </Card.Header>
                        <Card.Body className="card-body pb-0 dashboard-chart-height">
                            <div id="chart">
                                {stacked_line_bar_data && stacked_line_bar_label ? (
                                    <>
                                        <StackedLineBarChart
                                            stackedLineBarData={stacked_line_bar_data}
                                            stackedLineBarLabels={stacked_line_bar_label}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                fontSize: "0.785rem",
                                                textAlign: "center",
                                                color: "#d63031",
                                            }}
                                        >
                                            Please Apply Filter To Visualize Chart.....
                                        </p>
                                        <img
                                            src={require("../../../assets/images/dashboard/noChartFound.png")}
                                            alt="MyChartImage"
                                            className="all-center-flex disable-chart"
                                        />
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card className='height-25'>
                        <Card.Header className="card-header">
                            <h4 className="card-title" style={{ minHeight: "32px" }}>
                                Overall Stats
                            </h4>
                        </Card.Header>
                        <Card.Body className="card-body pb-0 dashboard-chart-height">
                            <div id="chart">
                                {pie_chart_values ? (
                                    <>
                                        <DashboardOverallStatsPieChart data={pie_chart_values} />
                                    </>
                                ) : (
                                    <>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                fontSize: "0.785rem",
                                                textAlign: "center",
                                                color: "#d63031",
                                            }}
                                        >
                                            Please Apply Filter To Visualize Chart.....
                                        </p>
                                        <img
                                            src={require("../../../assets/images/dashboard/noChartFound.png")}
                                            alt="MyChartImage"
                                            className="all-center-flex disable-chart"
                                        />
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default DashboardWetStock;