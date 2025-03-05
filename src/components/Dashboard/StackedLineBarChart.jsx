import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const StackedLineBarChart = ({ stackedLineBarLabels, stackedLineBarData }) => {
  if (!stackedLineBarLabels || !stackedLineBarData) {
    return <p> Please Apply Filter To Visualize Charttt.....</p>;
  }
  const shortenLabel = (label) => {
    if (window.innerWidth < 768) {
      // Shorten the label for mobile view
      return label.length > 10 ? label.substring(0, 7) + "..." : label;
    }
    return label;
  };
  const datasets = stackedLineBarData?.map((dataset, index) => ({
    label: dataset?.label,
    data: dataset?.data,
    borderColor: dataset?.borderColor,
    backgroundColor: dataset?.backgroundColor,
    yAxisID: dataset?.yAxisID,
    type: index === 1 ? "line" : "bar",
    key: index,
  }));

  const data = {
    labels: stackedLineBarLabels ? stackedLineBarLabels : [],
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to adjust the height dynamically
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
        display: false,
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

        barThickness: 10,
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
    <div className="chart-container">
      <Line data={data} options={options} style={chartStyle} />
    </div>
  );
};

export default StackedLineBarChart;
