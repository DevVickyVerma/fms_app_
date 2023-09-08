import { log } from "nvd3";
import React from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
// import { Utils } from "chart.js";

const LineChart = ({ LinechartValues, LinechartOption }) => {
  if (!LinechartValues || !LinechartOption) {
    // Data is not available yet, return a loading state or null
    return <p>Please Apply Filter To Load Chart...</p>;
  }

  let firstData = LinechartValues?.[0]?.data;
  let secondData = LinechartValues?.[1]?.data;
  let thirdData = LinechartValues?.[2]?.data;

  let firstLabel = LinechartValues?.[0]?.name;
  let secondLabel = LinechartValues?.[1]?.name;
  let thirdLabel = LinechartValues?.[2]?.name;

  const DATA_COUNT = 17;

  const labels = LinechartOption?.map((label) => label);



  let myLabels = LinechartValues;

  const colorArray = [
    [255, 99, 132], // Red
    [54, 162, 235], // Green
    [154, 62, 251], // Blue
    // Add more colors as needed
  ];

  const datasets = LinechartValues?.map((dataset, index) => ({
    label: dataset?.name,
    data: dataset?.data,
    borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
    backgroundColor: `rgba(${colorArray[index % colorArray.length].join(
      ", "
    )}, 0.2)`,

    yAxisID: index === 1 ? "y1" : "y",
    key: index,
  }));

  const data = {
    labels: labels,
    datasets: datasets,

  };

  const options = {
    // responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    // animations: {
    //   tension: {
    //     duration: 4000,
    //     easing: "linear",
    //     from: 1,
    //     to: 0,
    //     loop: true,
    //   },
    // },
    stacked: false,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };



  return (
    <div className="d-flex chart-items">
      <Line
        data={data}
        options={options}
      />
    </div>
  );
};

export default LineChart;
