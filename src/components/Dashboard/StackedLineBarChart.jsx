/* eslint-disable no-unused-vars */
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // its very impotent to import this auto chart
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const StackedLineBarChart = ({ stackedLineBarLabels, stackedLineBarData }) => {
  if (!stackedLineBarLabels || !stackedLineBarData) {
    // Data is not available yet, return a loading state or null

    return <p> Please Apply Filter To Visualize Charttt.....</p>;
  }

  const datasets = stackedLineBarData?.map((dataset, index) => ({
    label: dataset?.label,
    data: dataset?.data,
    borderColor: dataset?.borderColor,
    backgroundColor: dataset?.backgroundColor,
    yAxisID: dataset?.yAxisID,
    type: index === 1 ? "line" : "bar", // import Chart from "chart.js/auto";
    key: index,
  }));

  const data = {
    labels: stackedLineBarLabels ? stackedLineBarLabels : [],
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to take dynamic height/width
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0,
        ticks: {
          font: {
            size: 14,
            weight: "light",
          },
          color: "#6c757d",
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        ticks: {
          font: {
            size: 14,
            weight: "light",
          },
          color: "#6c757d",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16,
            weight: "normal",
          },
          color: "#333",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            let label = context?.dataset?.label || "";
            if (label) {
              label += ": ";
            }
            if (context?.parsed?.y !== null) {
              label += formatNumber(context?.parsed?.y);
            }
            return label;
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 0,
        borderWidth: 2,
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(255, 99, 132, 0.8)");
          gradient.addColorStop(1, "rgba(54, 162, 235, 0.8)");
          return gradient;
        },
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutBounce",
    },
    responsiveAnimationDuration: 500,
  };

  const chartStyle = {
    height: "500px", // General height
    width: "100%",
    "@media (maxWidth: 768px)": {
      height: "400px", // Adjust height for smaller tablets and phones
    },
    "@media (maxWidth: 500px)": {
      height: "350px", // Further reduce height on small mobile screens
    },
  };

  return (
    <div>
      <Line data={data} options={options} style={chartStyle} />
    </div>
  );
};

export default StackedLineBarChart;

/* eslint-disable no-unused-vars */
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS } from "chart.js/auto"; // Important import for chart

// const StackedLineBarChart = ({ stackedLineBarLabels }) => {
//   // If data labels are not available, show a message
//   if (!stackedLineBarLabels) {
//     return <p>Please Apply Filter To Visualize Chart...</p>;
//   }

//   // Simplified dataset hardcoded for bar and line charts
//   const data = {
//     labels: stackedLineBarLabels,
//     datasets: [
//       {
//         label: "Fuel Volume (ℓ)", // Bar 1
//         data: [5723.17, 4816.96, 4633.21, 6896.3, 6345.85, 6368.66, 6351.85],
//         borderColor: "rgba(126, 149, 228, 1)",
//         backgroundColor: "rgba(126, 149, 228, 0.5)",
//         yAxisID: "y1",
//         type: "bar",
//       },
//       {
//         label: "Fuel Sales (£)", // Bar 2 (New Bar)
//         data: [4321.21, 4098.34, 3967.45, 4532.67, 4812.56, 4981.45, 4329.67],
//         borderColor: "rgba(255, 99, 132, 1)",
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//         yAxisID: "y1",
//         type: "bar",
//       },
//       {
//         label: "Gross Margin (ppl) (Trend Line)", // Trend Line
//         data: [5.22, 5.16, 5.2, 4.9, 5.15, 5.21, 5.15],
//         borderColor: "rgba(59, 96, 172, 1)",
//         backgroundColor: "rgba(59, 96, 172, 0.5)",
//         yAxisID: "y",
//         type: "line",
//         borderDash: [5, 5], // Dotted line for trendline
//         tension: 0.3, // Smoother line
//         borderWidth: 2,
//       },
//       {
//         label: "Shop Sales Ex Vat (£)", // Normal Line
//         data: [1584.88, 1321.87, 1199.7, 1318.34, 1254.88, 1224.28, 1492.16],
//         borderColor: "rgba(147, 141, 223, 1)",
//         backgroundColor: "rgba(147, 141, 223, 0.5)",
//         yAxisID: "y1",
//         type: "line",
//         tension: 0.3, // Smoother line
//         borderWidth: 2,
//       },
//       {
//         label: "Additional Sales (£)", // Extra Normal Line
//         data: [1650.25, 1440.58, 1300.54, 1400.92, 1305.44, 1400.58, 1450.65],
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.5)",
//         yAxisID: "y1",
//         type: "line",
//         tension: 0.3, // Smoother line
//         borderWidth: 2,
//       },
//     ],
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
//       },
//       y1: {
//         type: "linear",
//         display: true,
//         position: "right",
//         grid: {
//           drawOnChartArea: false,
//         },
//         min: 0,
//       },
//     },
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             return `${context?.dataset?.label || ""}: ${context?.parsed?.y}`;
//           },
//         },
//       },
//     },
//     elements: {
//       bar: {
//         borderRadius: 0,
//       },
//       line: {
//         tension: 0.3,
//         borderWidth: 2, // Common setting for all lines
//       },
//     },
//   };

//   return (
//     <div>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default StackedLineBarChart;
