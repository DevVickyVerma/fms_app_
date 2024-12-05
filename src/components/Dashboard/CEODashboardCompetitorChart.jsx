import ReactApexChart from "react-apexcharts";
import React from "react";

const CEODashboardCompetitorChart = () => {
  // Dummy data for competitors
  const competitors = [
    {
      name: "Amersham",
      supplierImage: "https://apis-l.credentiauk.com/splr/shell-logo.png",
      dist_miles: 0,
      station: true,
      growth: [120, 130, 125, 140], // Example growth values over time
    },
    {
      name: "Chalfonts Way Sf Connect",
      supplierImage: "https://apis-l.credentiauk.com/splr/bp-logo.png",
      dist_miles: "1.5",
      station: false,
      growth: [100, 105, 110, 115], // Example growth values over time
    },
    {
      name: "Tesco Amersham",
      supplierImage: "https://apis-l.credentiauk.com/splr/tesco-logo.png",
      dist_miles: "1.5",
      station: false,
      growth: [80, 85, 90, 95], // Example growth values over time
    },
    {
      name: "Mfg Chesham",
      supplierImage: "https://apis-l.credentiauk.com/splr/esso-logo.png",
      dist_miles: "2.6",
      station: false,
      growth: [110, 115, 120, 125], // Example growth values over time
    },
    {
      name: "Fitchs Service Station",
      supplierImage: "https://apis-l.credentiauk.com/splr/bp-logo.png",
      dist_miles: "2.6",
      station: false,
      growth: [90, 92, 95, 100], // Example growth values over time
    },
    {
      name: "Shell Chesham",
      supplierImage: "https://apis-l.credentiauk.com/splr/shell-logo.png",
      dist_miles: "4.3",
      station: false,
      growth: [115, 118, 122, 130], // Example growth values over time
    },
  ];

  // Prepare the chart data
  const chartData = {
    series: competitors.map((competitor) => ({
      name: competitor.name,
      data: competitor.growth,
      type: "line", // All competitors are represented as lines
    })),
    colors: ["#3E4A76", "#b0b0b0", "#ee1c2a", "#ffbb00", "#00bbff", "#22cc44"], // Unique colors for each line
    categories: ["Jan", "Feb", "Mar", "Apr"], // Time periods for x-axis (can be adjusted)
  };

  const lineChart = {
    series: chartData?.series || [],
    options: {
      chart: {
        height: 300,
        type: "line",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: chartData?.colors || [],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2, // Line thickness for each series
      },
      xaxis: {
        categories: chartData?.categories || [], // Time periods like months
        axisBorder: {
          color: "#e0e6ed",
        },
      },
      yaxis: {
        labels: {
          offsetX: 0,
        },
        min: 0,
        title: {
          text: "Growth/Loss", // Label for Y-axis
        },
      },
      grid: {
        borderColor: "#e0e6ed",
      },
      tooltip: {
        shared: true, // Show tooltips for all series
        intersect: false,
        theme: "light",
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      legend: {
        position: "top", // Show legend on top
        horizontalAlign: "center",
      },
    },
  };

  return (
    <>
      <ReactApexChart
        series={lineChart?.series}
        options={lineChart?.options}
        className="rounded-lg bg-white dark:bg-black overflow-hidden"
        type="line"
        height={300}
      />
    </>
  );
};

export default CEODashboardCompetitorChart;
