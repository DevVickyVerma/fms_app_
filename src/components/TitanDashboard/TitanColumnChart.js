import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card } from 'react-bootstrap';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TitanColumnChart = ({ title }) => {
    // Chart data and options
    const data = {
        labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
            {
                label: 'Site 1',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
                backgroundColor: '#5f8ac7',
                borderRadius: 0,
            },
            {
                label: 'Site 2',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
                backgroundColor: '#6d6e71',
                borderRadius: 0,
            },
            {
                label: 'Site 3',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
                backgroundColor: '#a6ce39',
                borderRadius: 0,
            },
        ],
    };

    // const options = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top',
    //         },
    //         tooltip: {
    //             callbacks: {
    //                 label: function (tooltipItem) {
    //                     return `$ ${tooltipItem.raw} thousands`;
    //                 },
    //             },
    //         },
    //         scales: {
    //             x: {
    //                 title: {
    //                     display: true,
    //                     text: 'Months', // X-axis label
    //                     font: {
    //                         size: 14,
    //                     },
    //                 },
    //             },
    //             y: {
    //                 title: {
    //                     display: true,
    //                     text: 'Values in Thousands', // Y-axis label
    //                     font: {
    //                         size: 14,
    //                     },
    //                 },
    //             },
    //         },



    //     }

    // };

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
                    display: true,
                    text: 'Months',
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
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '(£)',
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


        },
    };

    return (

        <Card >
            <Card.Header>
                <h4 className="card-title">{title}</h4>

            </Card.Header>
            <Card.Body>
                <div style={{ width: "100%", height: "350px" }}>
                    <Bar data={data} options={options} />
                </div>
            </Card.Body>



        </Card >


    );
};

export default TitanColumnChart;
