import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const TitanSiteStatsGraph = ({ stockGraphData }) => {
    const [selectedFuelType, setSelectedFuelType] = useState(
        stockGraphData?.fuel_type[0]
    ); // Default to the first fuel type

    // Handler for dropdown change
    const handleFuelTypeChange = (event) => {
        setSelectedFuelType(event.target.value);
    };


    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: "index",
                intersect: false,
            },
            legend: {
                position: "top",
                labels: {
                    font: {
                        weight: "bold",
                    },
                },
            },
        },
        scales: {
            x: {
                type: "category",
                title: {
                    display: false,
                },
                ticks: {
                    font: {
                        weight: "bold",
                    },
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "( £)",
                    font: {
                        size: 20,
                        weight: "bold",
                    },
                },
                ticks: {
                    font: {
                        weight: "bold",
                    },
                },
            },
        },
    };

    // Get the datasets for the selected fuel type
    const datasets = stockGraphData?.datasets[selectedFuelType]?.map((dataset) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || "rgba(75, 192, 192, 0.5)", // Default bar color
        borderColor: dataset.borderColor || "rgba(75, 192, 192, 1)", // Default bar border color
        borderWidth: 1, // Bar border width
    }));

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
                                    {fuel} {fuel}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    ""
                )}
            </div>
            {/* Bar Chart */}
            <Bar
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
