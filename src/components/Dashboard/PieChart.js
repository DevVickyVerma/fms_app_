import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = () => {
  const [chartData] = useState({
    series: [21, 65, 33, 43, 59, 63],

    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 380,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="pie"
        width={380}
      />
    </div>
  );
};

export default PieChart;
