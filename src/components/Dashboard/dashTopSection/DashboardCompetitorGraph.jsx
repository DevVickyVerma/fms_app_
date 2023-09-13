import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react'
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
  })

  // Filter the data for the selected fuel type
  const filteredData = getCompetitorsPrice?.dates?.map(date => ({
    date,
    price: getCompetitorsPrice?.dataArray?.[date]?.[selectedFuelType]
  }));


  if (!filteredData) {
    return "filter is not applied yet"
  }

  console.log(filteredData, "filteredData");

  const colorArray = [
    [255, 99, 132], // Red
    [54, 162, 235], // Green
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue[154, 62, 251], // Blue
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    [154, 62, 251], // Blue
    // Add more colors as needed
  ];


  const transformData = async (data) => {
    const transformedData = [];

    console.log(data, "asdasdasdsa");

    await data?.forEach((item) => {
      if (item) {
        item?.price?.forEach((priceItem) => {
          const { name, price } = priceItem;

          if (!transformedData[name]) {
            transformedData[name] = [];
          }

          transformedData[name].push(price);
        });
      }
    });

    return transformedData;
  };

  // const transformData = async (data) => {
  //   const transformedData = new Map();

  //   await data?.forEach((item) => {
  //     if (item) {
  //       item?.price?.forEach((priceItem) => {
  //         const { name, price } = priceItem;

  //         // Check if the name exists in the Map and initialize the array if not
  //         if (!transformedData.has(name)) {
  //           transformedData.set(name, []);
  //         }

  //         // Push the price to the corresponding array
  //         transformedData.get(name).push(price);
  //       });
  //     }
  //   });

  //   // Convert the Map to an object
  //   const result = Object.fromEntries(transformedData);

  //   return result;
  // };


  const transformedData = transformData(filteredData);

  console.log(transformedData, "transformedData");

  // Define the datasets using transformedData
  const datasets = Object?.keys(transformedData).map((name, index) => ({
    label: name ? name : "",
    data: transformedData[name] ? transformedData[name] : "",
    borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
    backgroundColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 0.9)`,
    yAxisID: 'y', // You can adjust the yAxisID as needed
    type: index === 0 ? "bar" : "line",
  }));

  const data = {
    labels: filteredData ? filteredData?.map(selectedDate => selectedDate.date) : "",
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
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0, // Set the minimum value to 0 for the left y-axis (y)
      },
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
        <Line
          data={data}
          options={options}
        />
      </div>
    </>
  )
}

export default DashboardCompetitorGraph

