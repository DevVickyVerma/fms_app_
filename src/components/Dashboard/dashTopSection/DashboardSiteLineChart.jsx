import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";

const DashboardSiteLineChart = ({
  getSiteDetails,
}) => {

  const [showLine1, setShowLine1] = useState(true);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

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

  const chartOptions = {
    // Customize your chart options here
  };
  return (
    <div>
      <Box display={"flex"} gap={"25px"} my={"10px"} ml={"1px"} mr={"1px"}>
        {/* button 1 */}
        <Box
          borderRadius={"5px"}
          bgcolor={showLine1 ? "purple" : "#5444c1"}
          mx={0}
          // bgcolor={"#5444c1"}
          // bgcolor={gridIndex === index ? "purple" : "#5444c1"}
          px={"20px"}
          py={"15px"}
          color={"white"}
          minWidth={"150px"}
          onClick={() => setShowLine1(!showLine1)}
          // key={index}
          sx={{
            ":hover": {
              backgroundColor: "purple", // Change background color on hover
              cursor: "pointer", // Change cursor to pointer on hover
            },
          }}
        >
          <Typography
            display={"flex"}
            gap={"5px"}
            alignItems={"center"}
            mb={"5px"}
          >
            Volume
          </Typography>
        </Box>
        {/* button 2 */}
        <Box
          borderRadius={"5px"}
          bgcolor={showLine2 ? "purple" : "#5444c1"}
          px={"20px"}
          py={"15px"}
          color={"white"}
          minWidth={"150px"}
          onClick={() => setShowLine2(!showLine2)}
          sx={{
            ":hover": {
              backgroundColor: "purple", // Change background color on hover
              cursor: "pointer", // Change cursor to pointer on hover
            },
          }}
        >
          <Typography
            display={"flex"}
            gap={"5px"}
            alignItems={"center"}
            mb={"5px"}
          >
            Margin
          </Typography>
        </Box>
        {/* button 3 */}
        <Box
          borderRadius={"5px"}
          bgcolor={showLine3 ? "purple" : "#5444c1"}
          px={"20px"}
          py={"15px"}
          color={"white"}
          minWidth={"150px"}
          onClick={() => setShowLine3(!showLine3)}
          sx={{
            ":hover": {
              backgroundColor: "purple", // Change background color on hover
              cursor: "pointer", // Change cursor to pointer on hover
            },
          }}
        >
          <Typography
            display={"flex"}
            gap={"5px"}
            alignItems={"center"}
            mb={"5px"}
          >
            Profit
          </Typography>
        </Box>
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
