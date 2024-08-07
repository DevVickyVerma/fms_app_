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


  const formatNumber = (num) => {
    if (Math.abs(num) > 999999) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (Math.abs(num) > 999) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num;
    }
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
        min: 0,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context?.dataset?.label || '';
            if (label) {
              label += ': ';
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
        order: "stacked",
      },
    },
  };
  // const options = {
  //   responsive: true,
  //   interaction: {
  //     mode: "index",
  //     intersect: false,
  //   },
  //   scales: {
  //     y: {
  //       type: "linear",
  //       display: true,
  //       position: "left",
  //       min: 0, // Set the minimum value to 0 for the left y-axis (y)
  //     },
  //     y1: {
  //       type: "linear",
  //       display: true,
  //       position: "right",
  //       grid: {
  //         drawOnChartArea: false,
  //       },
  //       min: 0, // Set the minimum value to 0 for the left y-axis (y)
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       position: "top", // Adjust the legend position as needed
  //     },
  //   },
  //   elements: {
  //     bar: {
  //       order: "stacked", // Ensure proper stacking of bars
  //     },
  //   },
  // };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default StackedLineBarChart;
