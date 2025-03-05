import React from "react";
import ReactApexChart from "react-apexcharts";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const DashboardOverallStatsPieChart = ({ data }) => {
  // Convert series strings to numbers
  const numericSeries = data?.series?.map((value) => parseFloat(value)) || [];

  const optionss = {
    chart: {
      type: 'donut',
      width: 450,
      height: 450,
    },
    labels: data?.label || [],
    colors: data?.colors || [],
    responsive: [
      {
        breakpoint: 1800,
        options: {
          chart: {
            width: 400, // Slightly smaller size for larger tablets or desktops
            height: 400,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 768, // For tablets or mobile landscape
        options: {
          chart: {
            width: 300,  // Reduce size on smaller screens
            height: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576, // For mobile portrait view
        options: {
          chart: {
            // width: 250,  // Further reduce size for smaller screens
            // height: 250,
          },
          legend: {
            position: 'bottom',
            // show: false,
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (value) => formatNumber(value),
      },
    },
  };



  return (
    <div id="charttt"

      className=" d-flex justify-content-around align-items-center flex-column h-100">
      <ReactApexChart options={optionss} series={numericSeries} type="donut"
        width={"100%"} />

    </div>
  );
};

export default DashboardOverallStatsPieChart;
