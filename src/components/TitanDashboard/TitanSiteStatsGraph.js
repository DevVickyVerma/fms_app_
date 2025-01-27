import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const calculateTrendLine = (data) => {
    const xValues = data.map((_, index) => index); // Sequential x-axis values
    const yValues = data;
    const n = yValues.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    // Calculate slope (m) and intercept (b)
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // Generate trend line points
    return xValues.map((x) => m * x + b);
};
const TitanSiteStatsGraph = ({ stockGraphData }) => {
    const [selectedFuelType, setSelectedFuelType] = useState(stockGraphData?.fuel_type[0]); // Default to the first fuel type

    // Handler for dropdown change
    const handleFuelTypeChange = (event) => {
        setSelectedFuelType(event.target.value);
    };

    const originalData = stockGraphData?.datasets[selectedFuelType]?.[0]?.data || [];
    const trendLineData = calculateTrendLine(originalData);

    console.log(trendLineData, "trendLineData");
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                position: 'top',
                labels: {
                    font: {
                        weight: 'bold',
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: false,
                },
                ticks: {
                    font: {
                        weight: 'bold',
                    },
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '( £)',
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                },
                ticks: {
                    font: {
                        weight: 'bold',
                    },
                },
            },
            y1: {
                beginAtZero: false,
                position: 'right', // Right-side axis
                min: Math.min(...trendLineData) - 1, // Slightly larger padding for visibility
                max: Math.max(...trendLineData) + 1, // Slightly larger padding for visibility
                ticks: {
                    stepSize: (Math.max(...trendLineData) - Math.min(...trendLineData)) / 5, // Dynamically adjust step size
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    drawOnChartArea: false, // Avoid overlapping gridlines
                },
                title: {
                    display: false,
                    text: '(Secondary Axis - Trend)',
                    font: {
                        size: 14,
                    },
                },
            },

        },
    };

    // Get the datasets for the selected fuel type
    const datasets = stockGraphData?.datasets[selectedFuelType]?.map((dataset) => {
        // For the trend line dataset, ensure it's styled as a dashed line
        if (dataset.label.includes("Trend")) {
            return {
                ...dataset,
                yAxisID: dataset.yAxis || 'y1', // Assign yAxis ID ('y' or 'y1')
                borderDash: [5, 5], // Add dashed line style
                pointRadius: 0, // Hide points on the trend line
                fill: false, // Don't fill the area under the trend line
            };
        }
        return {
            ...dataset,
            yAxisID: dataset.yAxis || 'y', // Assign yAxis ID ('y' or 'y1')
        };
    });
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

                            {stockGraphData.fuel_type?.map((fuel) => (
                                <option key={fuel} value={fuel}>
                                    {fuel}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    ""
                )}
            </div>
            {/* Line Chart */}
            <Line
                data={{
                    labels: stockGraphData.labels,
                    datasets: datasets,
                }}
                options={options}
            />
        </div>
    );
};

export default TitanSiteStatsGraph;
