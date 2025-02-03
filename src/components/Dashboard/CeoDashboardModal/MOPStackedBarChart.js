import React from "react";
import ApexCharts from "react-apexcharts";

const MOPStackedBarChart = () => {
  // Data for the chart
  const state = {
    options: {
      chart: {
        id: "stacked-bar-chart",
        type: "bar",
        stacked: true, // Enable stacking
      },
      plotOptions: {
        bar: {
          horizontal: false, // Vertical bars
          columnWidth: "40%", // Adjust column width
        },
      },
      dataLabels: {
        enabled: true, // Enable data labels
        style: {
          colors: ["#000"], // Label color
          fontSize: "12px", // Font size
          fontWeight: "bold", // Font weight
        },
        formatter: function (val) {
          return val; // Display the value as the label
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 4,
          opacity: 0.3,
        },
        offsetY: 0, // Ensure labels are centered in the middle
      },
      xaxis: {
        categories: ["Card", "Cash", "Fuel Card"], // X-axis labels
      },
      yaxis: {
        title: {
          text: "Value",
        },
        stacked: true, // Stack bars on the y-axis
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
    },
    series: [
      {
        label: "Fuel",
        data: [3, 4, 2],
        backgroundColor: "#004c6d", // Dynamic color for 'Fuel'
      },
      {
        label: "Shop",
        data: [4, 5, 2],
        backgroundColor: "#a2c8e4", // Dynamic color for 'Shop'
      },
    ],
  };

  return (
    <div className="w-100">
      <ApexCharts
        options={state.options}
        series={state.series}
        type="bar"
        // height={200}
      />
    </div>
  );
};

export default MOPStackedBarChart;
