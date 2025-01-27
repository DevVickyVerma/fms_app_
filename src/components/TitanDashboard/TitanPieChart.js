import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Card } from 'react-bootstrap';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TitanPieChart = ({ title }) => {
    // Pie chart data
    const data = {
        labels: ['Site 1', 'Site 2', 'Site 3'],
        datasets: [
            {
                data: [44, 76, 35], // Values corresponding to the labels
                backgroundColor: ['#5f8ac7', '#6d6e71', '#a6ce39'], // Colors for each slice
                borderColor: '#fff', // Border color for each slice
                borderWidth: 2, // Border width to make the slices look thicker
            },
        ],
    };

    // Pie chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Legend position
                labels: {
                    font: {
                        size: 14, // Adjust font size for legend
                    },
                },
            },
            title: {
                position: 'bottom',
                display: true,
                text: 'Distribution of Values Across Sites', // Chart title
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `Site ${tooltipItem.label}: $ ${tooltipItem.raw} thousands`; // Custom label for tooltip
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 2, // Controls the border width of each slice
            },
        },
    };



    return (
        <Card className="h-100 ">
            <Card.Header>
                <h4 className="card-title">{title}</h4>
            </Card.Header>
            <Card.Body className='hcenter'>
                <div style={{ width: "100%", height: "350px", display: "flex", justifyContent: "center" }}>
                    <Pie data={data} options={options} />

                </div>
            </Card.Body>
        </Card>
    );
};

export default TitanPieChart;
