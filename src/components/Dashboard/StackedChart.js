// StackedBarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";

const StackedBarChart = () => {
  const data = {
    labels: ["Label 1", "Label 2", "Label 3"],
    datasets: [
      {
        label: "Dataset 1",
        data: [1222222, 2222222, 4222230],
        backgroundColor: "#fe7579",
      },
      {
        label: "Dataset 2",
        data: [4222215, 2222222, 422235],
        backgroundColor: "#0abe40",
      },
      {
        label: "Dataset 3",
        data: [422235, 422425, 422255],
        backgroundColor: "#3f97f6",
      },
      // Add more datasets as needed
    ],
  };

  const options = {
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;
