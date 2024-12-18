import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LinesDotGraphchart = ({ stockGraphData }) => {
    const [selectedFuelType, setSelectedFuelType] = useState(stockGraphData?.fuel_type[0]); // Default to the first fuel type

    // Handler for dropdown change
    const handleFuelTypeChange = (event) => {
        setSelectedFuelType(event.target.value);
    };

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
                    text: '(€)',
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
                position: 'right',
                title: {
                    display: false,
                    text: '(€) ',
                    font: {
                        size: 20,
                        weight: 'bold',
                    },
                },
                ticks: {
                    min: 2, // Set the minimum value for the y1 axis
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    drawOnChartArea: false, // Avoid gridlines from overlapping
                },
            },
        },
    };

    // Get the datasets for the selected fuel type
    const datasets = stockGraphData?.datasets[selectedFuelType]?.map((dataset) => ({
        ...dataset,
        yAxisID: dataset.yAxis || 'y', // Assign yAxis ID ('y' or 'y1')
    }));
    return (
        <div>

            <div className="flexspacebetween">
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

export default LinesDotGraphchart;
