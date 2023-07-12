import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Apexcharts2 = () => {
  const [series, setSeries] = useState([21, 65, 33, 43]);

  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Team sssss", "Team B", "Team C", "Team D", "Team E"],
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
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="pie"
        width={380}
      />
    </div>
  );
};

export default Apexcharts2;
