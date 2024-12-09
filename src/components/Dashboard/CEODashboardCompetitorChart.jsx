import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import { Card } from "react-bootstrap";

const CEODashboardCompetitorChart = (props) => {
  const { sitename } = props;

  // Dummy getCompetitorsPrice response with different statistics for each fuel type
  const getCompetitorsPrice = {
    fuelTypes: [
      "Adblue",
      "Diesel",
      "Super Diesel",
      "Super Unleaded",
      "Unleaded",
    ],
    fuelStats: [
      {
        fuelType: "Adblue",
        competitors: [
          { name: "Volume", price: [127652, 126727, 127281], type: "bar" },
          { name: "Yourself", price: [120, 125, 130], type: "line" },
          {
            name: "Chalfonts Way Sf Connect",
            price: [100, 102, 105],
            type: "line",
          },
          { name: "Tesco Amersham", price: [170, 142, 145], type: "line" },
          { name: "Mfg Chesham", price: [110, 112, 115], type: "line" },
          {
            name: "Fitchs Service Station",
            price: [145, 127, 181],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Diesel",

        competitors: [
          { name: "Volume", price: [15430, 13330, 13385], type: "bar" },
          { name: "Yourself", price: [130, 135, 140], type: "line" },
          {
            name: "Chalfonts Way Sf Connect",
            price: [110, 115, 120],
            type: "line",
          },
          { name: "Tesco Amersham", price: [180, 150, 155], type: "line" },
          { name: "Mfg Chesham", price: [120, 125, 130], type: "line" },
          {
            name: "Fitchs Service Station",
            price: [150, 130, 185],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Super Diesel",

        competitors: [
          { name: "Volume", price: [16110, 14110, 11190], type: "bar" },
          { name: "Yourself", price: [140, 145, 150], type: "line" },
          {
            name: "Chalfonts Way Sf Connect",
            price: [120, 125, 130],
            type: "line",
          },
          { name: "Tesco Amersham", price: [190, 160, 165], type: "line" },
          { name: "Mfg Chesham", price: [130, 135, 140], type: "line" },
          {
            name: "Fitchs Service Station",
            price: [160, 140, 190],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Super Unleaded",

        competitors: [
          { name: "Volume", price: [1710, 1510, 1915], type: "bar" },
          { name: "Yourself", price: [150, 155, 160], type: "line" },
          {
            name: "Chalfonts Way Sf Connect",
            price: [130, 135, 140],
            type: "line",
          },
          { name: "Tesco Amersham", price: [200, 170, 175], type: "line" },
          { name: "Mfg Chesham", price: [140, 145, 150], type: "line" },
          {
            name: "Fitchs Service Station",
            price: [170, 150, 195],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Unleaded",

        competitors: [
          { name: "Volume", price: [18220, 16022, 20022], type: "bar" },
          { name: "Yourself", price: [160, 165, 170], type: "line" },
          {
            name: "Chalfonts Way Sf Connect",
            price: [140, 145, 150],
            type: "line",
          },
          { name: "Tesco Amersham", price: [210, 180, 185], type: "line" },
          { name: "Mfg Chesham", price: [150, 155, 160], type: "line" },
          {
            name: "Fitchs Service Station",
            price: [180, 160, 200],
            type: "line",
          },
        ],
      },
    ],
  };

  // Prepare the chart data
  const [selectedFuelIndex, setSelectedFuelIndex] = useState(0);
  const selectedFuelType = getCompetitorsPrice?.fuelStats[selectedFuelIndex];

  const chartData = {
    series: [
      ...selectedFuelType?.competitors.map((competitor) => ({
        name: competitor.name,
        data: competitor.price,
        type: competitor.type,
        yAxisIndex: (competitor.type = "line" ? 1 : 0), // Competitors are represented as lines
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
    categories: ["06-12-2024", "07-12-2024", "08-12-2024"], // Days of the month from 1 to 30
  };

  const lineChart = {
    series: chartData?.series || [],
    options: {
      chart: {
        height: 300,
        type: "line", // Line chart type for competitors
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
          columnWidth: "45%", // Bar width
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
          // max: 130,
        },
        {
          // Right side for the line chart (secondary y-axis)
          opposite: true,
          title: {
            text: "Growth",
          },
          min: 70,
          // max: 180,
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
    <Card className="dash-card-default-height ">
      <Card.Header className="  ">
        <div className=" d-flex w-100 justify-content-between align-items-center  card-title w-100 ">
          <h4 className="card-title">
            Competitors Chart
            {sitename && ` (${sitename})`}
          </h4>
          <select
            id="demo-simple-select"
            name="demo-simple-select"
            value={selectedFuelIndex}
            onChange={(e) => setSelectedFuelIndex(e.target.value)}
            className="selectedMonth"
          >
            {getCompetitorsPrice?.fuelTypes?.map((fuelType, index) => (
              <option key={index} value={index}>
                {fuelType}
              </option>
            ))}
          </select>
        </div>
      </Card.Header>
      <Card.Body className="px-0">
        <ReactApexChart
          series={lineChart?.series}
          options={lineChart?.options}
          className="rounded-lg bg-white dark:bg-black overflow-hidden"
          type="line"
          height={500}
        />
      </Card.Body>
    </Card>
  );
};

export default CEODashboardCompetitorChart;
