import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { log } from "nvd3";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const DashboardCompetitorGraph = ({
  getCompetitorsPrice,
  setGetCompetitorsPrice,
}) => {
  // Now you can safely map over the data

  const [selectedFuelIndex, setSelectedFuelIndex] = useState(0);
  const selectedFuelType = getCompetitorsPrice?.fuelTypes[selectedFuelIndex];

  useEffect(() => {
    if (!getCompetitorsPrice) {
      // Handle the case when data is not yet available or has an issue.
      return;
    }
  });

  // Filter the data for the selected fuel type
  const filteredData = getCompetitorsPrice?.dates?.map((date) => ({
    date,
    price: getCompetitorsPrice?.dataArray?.[date]?.[selectedFuelType],
  }));

  if (!filteredData) {
    return "filter is not applied yet";
  }



  const colorArray = [
    [255, 99, 132], // Red
    [54, 162, 235], // Green
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    // [154, 62, 251], // Blue
    // [154, 62, 251], // Blue
    // [154, 62, 251], // Blue
    // [154, 62, 251], // Blue
    // [154, 62, 251], // Blue[154, 62, 251], // Blue
    // [154, 62, 251], // Blue
    // [154, 62, 251], // Blue
    // [154, 62, 251], // Blue
    // Add more colors as needed
  ];

  const transformData = (data) => {

    const transformedData = {};

    for (const item of data || []) {
      if (item) {
        for (const priceItem of item?.price || []) {
          const { name, price } = priceItem;

          if (!transformedData[name]) {
            transformedData[name] = [];
          }

          transformedData[name].push(price);
        }
      }
    }
    return transformedData;
  };

  const transformedData = transformData(filteredData);


  const datasets = Object?.keys(transformedData).map((name, index) => ({
    label: name ? name : "",
    data: transformedData[name] ? transformedData[name] : "",
    borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
    backgroundColor: `rgba(${colorArray[index % colorArray.length].join(
      ", "
    )}, 0.9)`,
    // borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255
    //   }, 1)`,
    // backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255
    //   }, 0.8)`,
    yAxisID: "y", // You can adjust the yAxisID as needed
    type: index === 0 ? "bar" : "line",
  }));

  const data = {
    labels: filteredData
      ? filteredData?.map((selectedDate) => selectedDate.date)
      : "",
    datasets: datasets ? datasets : "",
  };

  const options = {
    // responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0, // Set the minimum value to 0 for the left y-axis (y)
      },
      // y1: {
      //   type: "linear",
      //   display: true,
      //   position: "right",
      //   grid: {
      //     drawOnChartArea: false,
      //   },
      //   min: 0, // Set the minimum value to 0 for the left y-axis (y)
      // },
    },
  };

  const handleChange = (event) => {
    setSelectedFuelIndex(event.target.value); // Update the selected index
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ display: "flex", width: "200px", margin: "10px 0" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Fuel Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedFuelIndex} // Use selectedFuelIndex as the selected value
              label="Fuel Type"
              onChange={handleChange}
            >
              {getCompetitorsPrice?.fuelTypes?.map((fuelType, index) => (
                <MenuItem key={index} value={index}>
                  {fuelType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div>
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default DashboardCompetitorGraph;
