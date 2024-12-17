import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LinesDotGraphchart = ({ stockGraphData }) => {
    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: stockGraphData.labels,  // Use the dates as labels
            },
            y: {

                ticks: {
                    beginAtZero: true,
                },
            },
        },
    };

    return (
        <div>
            <Line data={{ labels: stockGraphData.labels, datasets: stockGraphData.datasets }} options={options} />
        </div>
    );
};

export default LinesDotGraphchart;
