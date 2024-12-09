import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CEODashboardCompetitorChart = (props) => {
  const { sitename } = props;

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

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
          {
            name: "Volume",
            price: [
              127652, 126727, 127281, 127500, 127600, 127550, 127450, 127430,
              127400, 127370,
            ],
            type: "bar",
          },
          {
            name: "Yourself",
            price: [120, 125, 130, 132, 134, 136, 138, 137, 139, 140],
            type: "line",
          },
          {
            name: "Chalfonts Way Sf Connect",
            price: [100, 102, 105, 107, 108, 110, 111, 112, 114, 115],
            type: "line",
          },
          {
            name: "Tesco Amersham",
            price: [170, 142, 145, 148, 150, 152, 155, 157, 158, 160],
            type: "line",
          },
          {
            name: "Mfg Chesham",
            price: [110, 112, 115, 117, 119, 120, 121, 122, 123, 125],
            type: "line",
          },
          {
            name: "Fitchs Service Station",
            price: [145, 127, 181, 185, 190, 192, 195, 200, 205, 210],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Diesel",
        competitors: [
          {
            name: "Volume",
            price: [
              15430, 13330, 13385, 13450, 13500, 13520, 13530, 13540, 13550,
              13560,
            ],
            type: "bar",
          },
          {
            name: "Yourself",
            price: [130, 135, 140, 142, 144, 146, 147, 148, 149, 150],
            type: "line",
          },
          {
            name: "Chalfonts Way Sf Connect",
            price: [110, 115, 120, 122, 125, 127, 128, 130, 132, 134],
            type: "line",
          },
          {
            name: "Tesco Amersham",
            price: [180, 150, 155, 158, 160, 162, 164, 165, 167, 168],
            type: "line",
          },
          {
            name: "Mfg Chesham",
            price: [120, 125, 130, 132, 134, 135, 136, 137, 138, 140],
            type: "line",
          },
          {
            name: "Fitchs Service Station",
            price: [150, 130, 185, 190, 195, 197, 200, 202, 205, 210],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Super Diesel",
        competitors: [
          {
            name: "Volume",
            price: [
              16110, 14110, 11190, 11300, 11500, 11700, 11900, 12000, 12100,
              12200,
            ],
            type: "bar",
          },
          {
            name: "Yourself",
            price: [140, 145, 150, 152, 155, 158, 160, 162, 165, 168],
            type: "line",
          },
          {
            name: "Chalfonts Way Sf Connect",
            price: [120, 125, 130, 132, 135, 137, 139, 140, 142, 145],
            type: "line",
          },
          {
            name: "Tesco Amersham",
            price: [190, 160, 165, 168, 170, 172, 174, 176, 178, 180],
            type: "line",
          },
          {
            name: "Mfg Chesham",
            price: [130, 135, 140, 142, 144, 145, 147, 149, 150, 152],
            type: "line",
          },
          {
            name: "Fitchs Service Station",
            price: [160, 140, 190, 195, 200, 202, 204, 206, 208, 210],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Super Unleaded",
        competitors: [
          {
            name: "Volume",
            price: [1710, 1510, 1915, 1930, 1940, 1950, 1960, 1970, 1980, 1990],
            type: "bar",
          },
          {
            name: "Yourself",
            price: [150, 155, 160, 162, 164, 166, 167, 168, 169, 170],
            type: "line",
          },
          {
            name: "Chalfonts Way Sf Connect",
            price: [130, 135, 140, 142, 144, 146, 147, 148, 149, 150],
            type: "line",
          },
          {
            name: "Tesco Amersham",
            price: [200, 170, 175, 178, 180, 182, 183, 184, 185, 186],
            type: "line",
          },
          {
            name: "Mfg Chesham",
            price: [140, 145, 150, 152, 154, 156, 158, 160, 162, 165],
            type: "line",
          },
          {
            name: "Fitchs Service Station",
            price: [170, 150, 195, 198, 200, 202, 204, 206, 208, 210],
            type: "line",
          },
        ],
      },
      {
        fuelType: "Unleaded",
        competitors: [
          {
            name: "Volume",
            price: [
              18220, 16022, 20022, 20100, 20200, 20300, 20400, 20500, 20600,
              20700,
            ],
            type: "bar",
          },
          {
            name: "Yourself",
            price: [160, 165, 170, 172, 174, 176, 177, 178, 179, 180],
            type: "line",
          },
          {
            name: "Chalfonts Way Sf Connect",
            price: [140, 145, 150, 152, 154, 156, 158, 160, 162, 165],
            type: "line",
          },
          {
            name: "Tesco Amersham",
            price: [210, 180, 185, 188, 190, 192, 193, 194, 195, 196],
            type: "line",
          },
          {
            name: "Mfg Chesham",
            price: [150, 155, 160, 162, 164, 166, 167, 168, 169, 170],
            type: "line",
          },
          {
            name: "Fitchs Service Station",
            price: [180, 160, 200, 205, 210, 212, 215, 217, 220, 222],
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
          <div className=" d-flex flex-column">
            <h4 className="card-title">
              Competitors Chart
              {sitename && ` (${sitename})`}
            </h4>
            {userPermissions?.includes("report-type-list") ? (
              <span className="text-muted hyper-link">
                <Link to="/competitor-view">View All</Link>
              </span>
            ) : (
              ""
            )}
          </div>
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
