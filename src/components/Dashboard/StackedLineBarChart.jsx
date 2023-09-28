import { Line } from "react-chartjs-2";

const StackedLineBarChart = ({ stackedLineBarLabels, stackedLineBarData }) => {
  if (!stackedLineBarLabels || !stackedLineBarData) {
    // Data is not available yet, return a loading state or null
    return <p> Please Apply Filter To Visualize Chart.....</p>;
  }

  const datasets = stackedLineBarData?.map((dataset, index) => {
    return {
      label: dataset?.label,
      data: dataset?.data,
      borderColor: dataset?.borderColor,
      backgroundColor: dataset?.backgroundColor,
      yAxisID: dataset?.yAxisID,
      // yAxisID: index === 2 ? "y" : "y1",
      // type: dataset?.type,
      type: index === 1 ? "line" : "bar",
      key: index,
      // borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      //   Math.random() * 255
      // }, 1)`,
      // backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
      //   Math.random() * 255
      // }, 0.2)`,
      // yAxisID: index === 1 ? "y" : "y1",
    };
  });

  const data = {
    labels: stackedLineBarLabels ? stackedLineBarLabels : [],
    datasets: datasets,
    // labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"],
    // datasets: [
    //   {
    //     label: "Fuel Volume",
    //     data: [100, 200, 150, 75, 85],
    //     borderColor: "rgba(255, 99, 132, 1)",
    //     backgroundColor: "rgba(255, 99, 132, 0.5)",
    //     // stack: "combined",
    //     type: "line",
    //     yAxisID: "y1",
    //   },
    //   {
    //     label: "Gross Margin ",
    //     data: [10, 20, 30, 40, 50],
    //     borderColor: "rgba(54, 162, 235, 1)",
    //     backgroundColor: "rgba(54, 162, 235, 0.5)",
    //     type: "bar",
    //     // stack: "combined",
    //     yAxisID: "y",
    //   },

    //   {
    //     label: "fuel Sales",
    //     data: [0, 2, 13, 45, 55],
    //     borderColor: "rgba(154, 62, 251, 1)",
    //     backgroundColor: "rgba(154, 62, 251, 0.5)",
    //     // stack: "combined",
    //     type: "line",
    //     yAxisID: "y1",
    //   },
    //   // Add more datasets as needed
    // ],
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
