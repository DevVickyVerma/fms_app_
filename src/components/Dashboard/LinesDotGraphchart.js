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
                labels: {
                    font: {
                        weight: 'bold', // Make legend text bold
                    },
                },
            },
        },
        scales: {
            x: { // X-axis configuration
                type: 'category',
                title: {
                    display: false,
                    text: 'Dates',
                    font: {
                        size: 14,
                        weight: 'bold', // Make X-axis title bold
                    },
                },
                ticks: {
                    font: {
                        weight: 'bold', // Make X-axis tick labels bold
                    },
                },
            },
            y: { // Left Y-axis
                beginAtZero: true,
                title: {
                    display: true,
                    text: '(€)',
                    font: {
                        size: 20,
                        weight: 'bold', // Make right Y-axis title bold
                    },
                },
                ticks: {
                    font: {
                        weight: 'bold', // Make Y-axis tick labels bold
                    },
                },
            },
            y1: { // Right Y-axis
                beginAtZero: false,
                position: 'right',
                title: {
                    display: false,
                    text: '(€)',
                    font: {
                        size: 20,
                        weight: 'bold', // Make right Y-axis title bold
                    },
                },
                ticks: {
                    display: false, // Hide ticks but you can still style if needed
                },
                grid: {
                    drawOnChartArea: false,
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
