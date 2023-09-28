import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

const DashboardSiteBarChart = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dataForSelectedDate, setDataForSelectedDate] = useState([]);
  // const data = {
  //   labels: [
  //     "tank id 1",
  //     "tank id 2",
  //     "tank id 3",
  //     "tank id 4",
  //     "tank id 5",
  //     "tank id 6",
  //     "tank id 7",
  //     "tank id 8",
  //     "tank id 9",
  //     "tank id 10",
  //   ],
  //   datasets: [
  //     {
  //       label: "fuel price tank",
  //       data: [10, 15, 7, 12, 17, 18, 2, 14, 25, 10],
  //       // data: dataForSelectedDate || [], // Use empty array if no data available
  //       // backgroundColor: calculateColors(dataForSelectedDate || []),
  //       backgroundColor: (context) => {
  //         const value = context.dataset.data[context.dataIndex];
  //         if (value < 7) {
  //           return "#e74c3c";
  //         } else if (value < 12) {
  //           return "#f1c40f";
  //         } else {
  //           return "#2ecc71";
  //         }
  //       },
  //     },
  //   ],
  // };

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
      // {
      //   label: "Value 4",
      //   backgroundColor: "rgba(255, 99, 132, 0.5)",
      //   data: [10, 15, 20],
      // },
      // {
      //   label: "Value 5",
      //   backgroundColor: "rgba(54, 162, 235, 0.5)",
      //   data: [22, 28, 12],
      // },
      // {
      //   label: "Value 6",
      //   backgroundColor: "rgba(75, 192, 192, 0.5)",
      //   data: [4, 222, 12],
      // },
      // {
      //   label: "Value 7",
      //   backgroundColor: "rgba(255, 99, 132, 0.5)",
      //   data: [10, 15, 20],
      // },
      // {
      //   label: "Value 8",
      //   backgroundColor: "rgba(54, 162, 235, 0.5)",
      //   data: [22, 28, 12],
      // },
      // {
      //   label: "Value 9",
      //   backgroundColor: "rgba(75, 192, 192, 0.5)",
      //   data: [4, 222, 12],
      // },
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
