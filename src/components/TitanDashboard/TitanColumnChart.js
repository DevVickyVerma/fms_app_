import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card } from "react-bootstrap";

const TitanColumnChart = ({ stockGraphData, tablebestvsWorst }) => {

    const options = {
        chart: {
            type: "bar",
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 5,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: stockGraphData?.month,
            title: {
                text: "Months",
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                }
            }
        },
        yaxis: {

            title: {
                text: "Value (£)",
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                }
            }
        },

        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "£" + " " + val;
                },
            },
        },
    };
    const [selectedFuelType, setSelectedFuelType] = useState(stockGraphData?.fuel_type[0]); // Default to the first fuel type
    const handleFuelTypeChange = (event) => {
        setSelectedFuelType(event.target.value);
    };
    const selectedFuelData = stockGraphData?.data[selectedFuelType];

    return (
        <Card>
            <Card.Header className="p-4">
                <div className="spacebetween" style={{ width: "100%" }}>
                    <h4 className="card-title all-center-flex">
                        {" "}
                        {!stockGraphData?.name && 'Site Performance'}
                        {" "}
                        {stockGraphData?.name &&


                            (<div className=" d-flex  ">
                                <div className="d-flex align-items-center justify-center h-100">
                                    <div>
                                        <img
                                            src={stockGraphData?.logo}
                                            alt={stockGraphData?.logo}
                                            className="mr-2"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                minWidth: "30px",
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="spacebetween"

                                    >
                                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                                            <h6 className="mb-0 fs-15 fw-semibold">{stockGraphData?.name}</h6>

                                        </div>
                                    </div>
                                </div>
                                <div className="site-performance">
                                    <h3 className="site-title ms-2 m-0" style={{ display: 'flex', alignItems: 'center' }}>
                                        {tablebestvsWorst == "1" ? (
                                            <span
                                                className="badge"
                                                style={{
                                                    padding: '14px',
                                                    fontSize: '16px',
                                                    borderRadius: '6px',

                                                    color: 'white',
                                                    backgroundColor: 'green',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                &#9733; Best Site
                                            </span>
                                        ) : (
                                            <span
                                                className="badge"
                                                style={{
                                                    padding: '14px',

                                                    borderRadius: '6px',
                                                    // fontWeight: 'bold',
                                                    color: 'white',
                                                    backgroundColor: 'red',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                &#128577; Worst Site
                                            </span>
                                        )}
                                    </h3>

                                </div>
                            </div>)

                        }
                        <br></br>
                    </h4>
                    <div className="flexspacebetween textend">
                        {stockGraphData?.fuel_type ? (
                            <div>
                                <select
                                    id="fuelType"
                                    name="fuelType"
                                    value={selectedFuelType}
                                    onChange={handleFuelTypeChange}
                                    className="selectedMonth"
                                >

                                    {stockGraphData?.fuel_type?.map((fuel) => (
                                        <option key={fuel} value={fuel}>
                                            {/* {console.log(fuel, "fuel")}
                                    {fuel} */}
                                            {fuel?.charAt(0).toUpperCase() + fuel.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                </div>
            </Card.Header>
            <Card.Body>


                <div id="chart">
                    <ReactApexChart options={options} series={selectedFuelData} type="bar" height={350} />
                </div>
                <div id="html-dist"></div>
            </Card.Body>
        </Card>
    );
};

export default TitanColumnChart;
