import React from "react";
import ApexCharts from "react-apexcharts";

const thirdcategories = ["Unleaded", "Diesel"];
const thirdSeries = [
  {
    name: "GBP",
    data: [7385.25, 9468.16],
    color: "#004c6d",
  },
  {
    name: "Visa Delta",
    data: [7236.16, 6537.71],
    color: "#a2c8e4",
  },
  {
    name: "Mastercard",
    data: [6051.68, 4141.29],
    color: "#f39c12",
  },
  {
    name: "Amex",
    data: [290.65, 297.56],
    color: "#e74c3c",
  },
  {
    name: "Unknown",
    data: [15.0, 125.0],
    color: "#2ecc71",
  },
  {
    name: "Arval",
    data: [121.54, 82.68],
    color: "#9b59b6",
  },
  {
    name: "Electron",
    data: [19.99, 0],
    color: "#f1c40f",
  },
  {
    name: "UK Fuels Bunkering",
    data: [5.12, 252.3],
    color: "#34495e",
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
