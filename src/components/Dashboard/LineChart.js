import { log } from "nvd3";
import React from "react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
// import { Utils } from "chart.js";

const LineChart = ({ LinechartValues, LinechartOption }) => {
  let firstData = LinechartValues?.[0]?.data;
  let secondData = LinechartValues?.[1]?.data;
  let thirdData = LinechartValues?.[2]?.data;

  let firstLabel = LinechartValues?.[0]?.name;
  let secondLabel = LinechartValues?.[1]?.name;
  let thirdLabel = LinechartValues?.[2]?.name;

  const DATA_COUNT = 17;

  const labels = LinechartOption?.map((label) => label);

  let myLabels = LinechartValues;

  const data = {
    labels: labels,
    // labels:"",
    datasets: [
      {
        label: firstLabel,

        data: firstData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y",
      },
      {
        label: secondLabel,

        data: secondData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y1",
      },
      {
        // label: {LinechartValues.[1].name},
        label: thirdLabel,
        // data: Array.from({ length: DATA_COUNT }, () =>
        //   Math.floor(Math.random() * 201 - 100)
        // ),
        data: thirdData,
        borderColor: "rgba(154, 62, 251, 1)",
        backgroundColor: "rgba(541, 152, 235, 0.2)",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    // plugins: {
    //   // title: {
    //   //   display: true,
    //   //   // text: "Chart.js Line Chart - Multi Axis",
    //   // },
    // },
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

  const actions = [
    {
      name: "Randomize",
      handler(chart) {
        chart.data.datasets.forEach((dataset) => {
          dataset.data = Array.from({ length: DATA_COUNT }, () =>
            Math.floor(Math.random() * 201 - 100)
          );
        });
        chart.update();
      },
    },
  ];

  return (
    <div>
      <Line
        data={data}
        options={options}
        // actions={actions}
      /> 
    </div>
  );
};

export default LineChart;
