import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const TitanColumnChart = ({ stockGraphData }) => {


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
    console.log(selectedFuelData, "selectedFuelData");



    return (
        <div>

            <div className="flexspacebetween textend pb-4 pt-0">
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
            <div id="chart">
                <ReactApexChart options={options} series={selectedFuelData} type="bar" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default TitanColumnChart;
