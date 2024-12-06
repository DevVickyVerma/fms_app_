import ReactApexChart from "react-apexcharts";
import React from "react";

const CEODashboardCompetitorChart = () => {
  // Dummy data for competitors across a month (30 days)
  const competitors = [
    {
      name: "Yourself",
      supplierImage: "https://apis-l.credentiauk.com/splr/shell-logo.png",
      dist_miles: 0,
      station: true,
      growth: [
        120, 125, 130, 125, 140, 135, 128, 132, 136, 140, 142, 145, 150, 152,
        148, 140, 138, 136, 142, 145, 150, 152, 155, 158, 160, 162, 160, 158,
        155, 152,
      ],
    },
    {
      name: "Chalfonts Way Sf Connect",
      supplierImage: "https://apis-l.credentiauk.com/splr/bp-logo.png",
      dist_miles: "1.5",
      station: false,
      growth: [
        100, 102, 105, 107, 110, 108, 107, 109, 112, 115, 118, 120, 122, 125,
        128, 130, 133, 135, 137, 140, 142, 145, 148, 150, 153, 155, 158, 160,
        162, 165,
      ],
    },
    {
      name: "Tesco Amersham",
      supplierImage: "https://apis-l.credentiauk.com/splr/tesco-logo.png",
      dist_miles: "1.5",
      station: false,
      growth: [
        80, 82, 85, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112,
        114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140,
      ],
    },
    {
      name: "Mfg Chesham",
      supplierImage: "https://apis-l.credentiauk.com/splr/esso-logo.png",
      dist_miles: "2.6",
      station: false,
      growth: [
        110, 112, 115, 117, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138,
        140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166,
        168, 170,
      ],
    },
    {
      name: "Fitchs Service Station",
      supplierImage: "https://apis-l.credentiauk.com/splr/bp-logo.png",
      dist_miles: "2.6",
      station: false,
      growth: [
        90, 91, 92, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
        107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
      ],
    },
    {
      name: "Shell Chesham",
      supplierImage: "https://apis-l.credentiauk.com/splr/shell-logo.png",
      dist_miles: "4.3",
      station: false,
      growth: [
        115, 117, 118, 120, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131,
        132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145,
        146, 147,
      ],
    },
  ];

  // Complete 30-day bar chart data for your own volume
  const volumeData = [
    50, 52, 55, 58, 50, 52, 55, 58, 50, 52, 55, 58, 50, 52, 55, 58, 50, 52, 55,
    58, 50, 52, 55, 58, 50, 52, 55, 58, 50, 52,
  ];

  // Prepare the chart data
  const chartData = {
    series: [
      {
        name: "Volume",
        data: volumeData,
        type: "bar", // This is the bar series
      },
      ...competitors.map((competitor) => ({
        name: competitor.name,
        data: competitor.growth,
        type: "line", // Competitors are represented as lines
      })),
    ],
    colors: [
      "#3E4A76", // Bar color
      "#b0b0b0",
      "#ee1c2a",
      "#ffbb00",
      "#00bbff",
      "#22cc44",
      "#fa8072",
    ],
    categories: Array.from({ length: 30 }, (_, i) => i + 1), // Days of the month from 1 to 30
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
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "45%", // Width of the bar column
          endingShape: "rounded", // Bar shape
        },
      },
      xaxis: {
        categories: chartData?.categories || [], // Days of the month
        title: {
          text: "Days of the Month",
        },
        axisBorder: {
          color: "#e0e6ed",
        },
      },
      yaxis: [
        {
          // Left side for the bar chart (primary y-axis)
          title: {
            text: "Volume",
          },
          min: 0,
          max: 130,
        },
        {
          // Right side for the line chart (secondary y-axis)
          opposite: true,
          title: {
            text: "Growth",
          },
          min: 70,
          max: 180,
        },
      ],
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
    <div>
      <ReactApexChart
        series={lineChart?.series}
        options={lineChart?.options}
        className="rounded-lg bg-white dark:bg-black overflow-hidden"
        type="line"
        height={500}
      />
    </div>
  );
};

export default CEODashboardCompetitorChart;
