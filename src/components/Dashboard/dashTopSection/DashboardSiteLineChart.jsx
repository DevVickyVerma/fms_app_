import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";

const DashboardSiteLineChart = ({
  getSiteStats,
  setGetSiteStats,
  getSiteDetails,
  setGetSiteDetails,
}) => {
  const data1 = [10, 20, 15, 25, 30, 18, 22]; // Example data for Line 1
  const data2 = [5, 12, 8, 17, 22, 10, 15]; // Example data for Line 2
  const data3 = [30, 25, 28, 35, 40, 32, 38]; // Example data for Line 3

  const [showLine1, setShowLine1] = useState(true);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

  // const labels = [
  //   "Day 1",
  //   "Day 2",
  //   "Day 3",
  //   "Day 4",
  //   "Day 5",
  //   "Day 6",
  //   "Day 7",
  // ];

  const labels = getSiteDetails?.performance_reporting?.labels
    ? getSiteDetails?.performance_reporting?.labels
    : [];

  const labelDataArray = getSiteDetails?.performance_reporting?.datasets
    ? getSiteDetails?.performance_reporting?.datasets
    : [];

  const label1 = labelDataArray?.[0]?.label;
  const label2 = labelDataArray?.[1]?.label;
  const label3 = labelDataArray?.[2]?.label;

  const label1Data = labelDataArray?.[0]?.data;
  const label2Data = labelDataArray?.[1]?.data;
  const label3Data = labelDataArray?.[2]?.data;

  // console.log(label1, "label data array");

  const chartOptions = {
    // Customize your chart options here
  };
  return (
    <div>
      <Box display={"flex"} gap={"25px"} my={"10px"}>
        <Button onClick={() => setShowLine1(!showLine1)}>Volume</Button>
        <Button onClick={() => setShowLine2(!showLine2)}>Margin</Button>
        <Button onClick={() => setShowLine3(!showLine3)}>Profit</Button>
      </Box>

      <div>
        <Line
          data={{
            labels: labels,
            datasets: [
              {
                label: label1,
                data: showLine1 ? label1Data : [],
                borderColor: "red",
                fill: false,
              },
              {
                label: label2,
                data: showLine2 ? label2Data : [],
                borderColor: "blue",
                fill: false,
              },
              {
                label: label3,
                data: showLine3 ? label3Data : [],
                borderColor: "green",
                fill: false,
              },
            ],
          }}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default DashboardSiteLineChart;
