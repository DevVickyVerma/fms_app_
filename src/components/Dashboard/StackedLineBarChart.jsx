import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";  // its very impotent to import this auto chart

const StackedLineBarChart = ({ stackedLineBarLabels, stackedLineBarData }) => {
  if (!stackedLineBarLabels || !stackedLineBarData) {
    // Data is not available yet, return a loading state or null
    return <p> Please Apply Filter To Visualize Charttt.....</p>;
  }

  const datasets = stackedLineBarData?.map((dataset, index) => {
    return {
      label: dataset?.label,
      data: dataset?.data,
      borderColor: dataset?.borderColor,
      backgroundColor: dataset?.backgroundColor,
      yAxisID: dataset?.yAxisID,
      type: index === 1 ? "line" : "bar", // import Chart from "chart.js/auto";
      key: index,
    };
  });


  const data = {
    labels: stackedLineBarLabels ? stackedLineBarLabels : [],
    datasets: datasets,
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0, // Set the minimum value to 0 for the left y-axis (y)
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0, // Set the minimum value to 0 for the left y-axis (y)
      },
    },
    plugins: {
      legend: {
        position: "top", // Adjust the legend position as needed
      },
    },
    elements: {
      bar: {
        order: "stacked", // Ensure proper stacking of bars
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default StackedLineBarChart;


// import React from "react";
// import Chart from "react-apexcharts";

// const StackedLineBarChart = ({ stackedLineBarLabels, stackedLineBarData }) => {
//   if (!stackedLineBarLabels || !stackedLineBarData) {
//     return <p> Please Apply Filter To Visualize Chart.....</p>;
//   }

//   const series = stackedLineBarData.map((dataset, index) => {
//     return {
//       name: dataset.label,
//       type: index === 1 ? "line" : "bar",
//       data: dataset.data,
//     };
//   });

//   const options = {
//     chart: {
//       height: 350,
//       type: "line",
//       stacked: false,
//     },
//     stroke: {
//       width: [0, 2, 5],
//       curve: 'smooth'
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "50%",
//         endingShape: "rounded",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     colors: stackedLineBarData.map(dataset => dataset.backgroundColor),
//     xaxis: {
//       categories: stackedLineBarLabels,
//       labels: {
//         style: {
//           colors: "#4e4e4e",
//           fontSize: "14px",
//         },
//       },
//     },
//     yaxis: [
//       {
//         title: {
//           text: "Bar Data",
//         },
//         labels: {
//           style: {
//             colors: "#4e4e4e",
//             fontSize: "14px",
//           },
//         },
//       },
//       {
//         opposite: true,
//         title: {
//           text: "Line Data",
//         },
//         labels: {
//           style: {
//             colors: "#4e4e4e",
//             fontSize: "14px",
//           },
//         },
//       },
//     ],
//     tooltip: {
//       shared: true,
//       intersect: false,
//     },
//     legend: {
//       position: "top",
//       labels: {
//         colors: "#4e4e4e",
//         useSeriesColors: true,
//       },
//       fontSize: "14px",
//     },
//     // title: {
//     //   text: 'Stacked Line and Bar Chart',
//     //   align: 'left',
//     //   style: {
//     //     fontSize: "18px",
//     //     color: "#4e4e4e",
//     //   },
//     // },
//     grid: {
//       borderColor: "rgba(200, 200, 200, 0.2)",
//     },
//   };

//   return (
//     <div
//     // style={{ maxWidth: "800px", margin: "0 auto" }}
//     >
//       <Chart options={options} series={series} type="line" height={350} />
//     </div>
//   );
// };

// export default StackedLineBarChart;




// ! chart js
// import { Line } from "react-chartjs-2";
// import ChartJS from "chart.js/auto";

// const StackedLineBarChart = ({ stackedLineBarLabels, stackedLineBarData }) => {
//   if (!stackedLineBarLabels || !stackedLineBarData) {
//     return <p> Please Apply Filter To Visualize Chart.....</p>;
//   }

//   const datasets = stackedLineBarData.map((dataset, index) => {
//     return {
//       label: dataset.label,
//       data: dataset.data,
//       borderColor: dataset.borderColor,
//       backgroundColor: dataset.backgroundColor,
//       yAxisID: dataset.yAxisID,
//       type: index === 1 ? "line" : "bar",
//       borderWidth: 2,
//       hoverBackgroundColor: `rgba(0,0,0,0.1)`,
//     };
//   });

//   const data = {
//     labels: stackedLineBarLabels,
//     datasets: datasets,
//   };

//   const options = {
//     responsive: true,
//     interaction: {
//       mode: "index",
//       intersect: false,
//     },
//     scales: {
//       y: {
//         type: "linear",
//         display: true,
//         position: "left",
//         min: 0,
//         grid: {
//           color: "rgba(200, 200, 200, 0.2)",
//         },
//         ticks: {
//           color: "#4e4e4e",
//           font: {
//             size: 14,
//           },
//         },
//       },
//       y1: {
//         type: "linear",
//         display: true,
//         position: "right",
//         grid: {
//           drawOnChartArea: false,
//         },
//         min: 0,
//         ticks: {
//           color: "#4e4e4e",
//           font: {
//             size: 14,
//           },
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           font: {
//             size: 14,
//           },
//           color: "#4e4e4e",
//         },
//       },
//       tooltip: {
//         backgroundColor: "rgba(0, 0, 0, 0.7)",
//         titleFont: {
//           size: 16,
//         },
//         bodyFont: {
//           size: 14,
//         },
//         footerFont: {
//           size: 12,
//         },
//       },
//       title: {
//         display: true,
//         text: 'Stacked Line and Bar Chart',
//         font: {
//           size: 18,
//         },
//         color: "#4e4e4e",
//       },
//     },
//     elements: {
//       bar: {
//         borderWidth: 2,
//         borderRadius: 5,
//       },
//       line: {
//         tension: 0.4,
//       },
//     },
//   };

//   return (
//     <div >
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default StackedLineBarChart;
