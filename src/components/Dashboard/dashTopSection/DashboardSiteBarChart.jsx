import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

const DashboardSiteBarChart = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const data = {
    labels: [
      "Tank id 1",
      "Tank id 2",
      "Tank id 3",
      "Tank id 4",
      "Tank id 5",
      "Tank id 6",
      "Tank id 7",
      "Tank id 8",
      "Tank id 9",
    ],
    datasets: [
      {
        label: "Capacity",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: [10, 15, 20, 10, 15, 20, 10, 15, 20, 10, 15, 20],
      },
      {
        label: "Ullaage",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        data: [22, 28, 12, 10, 15, 20, 10, 15, 20, 10, 15, 20, 10, 15, 20],
      },
      {
        label: "days remaining",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        data: [
          4, 222, 12, 22, 28, 12, 10, 15, 20, 10, 15, 20, 10, 15, 20, 10, 15,
          20,
        ],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const updateChartData = (dateIndex, date) => {
    // Fetch or calculate data for the selected dateIndex and update dataForSelectedDate state
    // For example: setDataForSelectedDate(newData);

    setSelectedDate(dateIndex);
  };

  const dates = [
    "18 august",
    "19 august",
    "20 august",
    "21 august",
    "22 august",
    "23 august",
    "24 august",
  ];

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        mb={"25px"}
      >
        {dates.map((date, index) => (
          <Button key={index} onClick={() => updateChartData(index, date)}>
            {date}
          </Button>
        ))}
      </Box>
      <Bar data={data} options={options} />;
    </>
  );
};

export default DashboardSiteBarChart;
