import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

const DashboardSiteBarChart = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dataForSelectedDate, setDataForSelectedDate] = useState([]);
  const data = {
    labels: [
      "tank id 1",
      "tank id 2",
      "tank id 3",
      "tank id 4",
      "tank id 5",
      "tank id 6",
      "tank id 7",
      "tank id 8",
      "tank id 9",
      "tank id 10",
    ],
    datasets: [
      {
        label: "fuel price tank",
        data: [10, 15, 7, 12, 17, 18, 2, 14, 25, 10],
        // data: dataForSelectedDate || [], // Use empty array if no data available
        // backgroundColor: calculateColors(dataForSelectedDate || []),
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          if (value < 7) {
            return "#e74c3c";
          } else if (value < 12) {
            return "#f1c40f";
          } else {
            return "#2ecc71";
          }
        },
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

    console.log("my selcted indexx and date", dateIndex, date);
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
