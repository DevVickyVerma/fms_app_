import React from "react";
import ApexCharts from "react-apexcharts";

const thirdcategories = [
  "GBP",
  "Visa Delta",
  "Mastercard",
  "Amex",
  "Unknown",
  "Arval",
  "Electron",
  "UK Fuels Bunkering",
]; // Card types on the x-axis
const thirdSeries = [
  {
    name: "Unleaded",
    data: [285.25, 336.16, 601.68, 290.65, 15.0, 121.54, 19.99, 5.12],
    color: "#004c6d", // GBP
  },
  {
    name: "Diesel",
    data: [98.16, 257.71, 411.29, 297.56, 125.0, 82.68, 0, 252.3],
    color: "#a2c8e4", // Visa Delta
  },
];

const mopcategories = ["Card", "Cash", "Fuel Card"];

const mopSeries = [
  {
    name: "Fuel",
    data: [3, 4, 2],
    backgroundColor: "#004c6d", // Dynamic color for 'Fuel'
  },
  {
    name: "Shop",
    data: [4, 5, 2],
    backgroundColor: "#a2c8e4", // Dynamic color for 'Shop'
  },
];

const MOPStackedBarChart = ({ dashboardData }) => {
  // Dummy data based on your provided structure
  const state = {
    options: {
      chart: {
        id: "stacked-bar-chart",
        type: "bar",
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#000"],
          fontSize: "12px",
          fontWeight: "bold",
        },
        formatter: function (val) {
          return val;
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 4,
          opacity: 0.3,
        },
        offsetY: 0,
      },
      xaxis: {
        categories: dashboardData ? mopcategories : thirdcategories,
      },
      yaxis: {
        title: {
          text: "Fuel Sale Value (£)",
        },
        stacked: true,
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
    },
    series: dashboardData ? mopSeries : thirdSeries,
  };

  return (
    <div className="w-100">
      <ApexCharts
        options={state.options}
        series={state.series}
        type="bar"
        height={450}
      />
    </div>
  );
};

export default MOPStackedBarChart;
