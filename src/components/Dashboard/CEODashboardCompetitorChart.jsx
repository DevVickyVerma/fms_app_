// import ReactApexChart from "react-apexcharts";
// import { useEffect, useState } from "react";

// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import { Card } from "react-bootstrap";

// const CEODashboardCompetitorChart = ({ getCompetitorsPrice }) => {
//   const [selectedFuelIndex, setSelectedFuelIndex] = useState(0);

//   useEffect(() => {
//     // This effect will run when getCompetitorsPrice or selectedFuelIndex changes
//     // You can handle any additional logic here if needed
//   }, [getCompetitorsPrice, selectedFuelIndex]);

//   // Extract the selected fuel type based on the selected index
//   const selectedFuelType = getCompetitorsPrice?.fuelTypes[selectedFuelIndex];

//   // Filter the data for the selected fuel type
//   const filteredData = getCompetitorsPrice?.dates?.map((date) => ({
//     date,
//     price: getCompetitorsPrice?.dataArray?.[date]?.[selectedFuelType],
//   }));

//   const colorArray = [
//     [255, 99, 132], // Red
//     [54, 162, 235], // Green
//     [154, 62, 251], // Blue
//     [255, 206, 86], // Yellow
//     [75, 192, 192], // Teal
//     [153, 102, 255], // Purple
//     [255, 159, 64], // Orange
//     [255, 77, 166], // Pink
//     [24, 220, 255], // Aqua
//     [255, 51, 51], // Crimson
//     [0, 204, 102], // Green
//   ];

//   const transformData = (data) => {
//     const transformedData = {};

//     for (const item of data || []) {
//       if (item) {
//         for (const priceItem of item?.price || []) {
//           const { name, price } = priceItem;

//           if (!transformedData[name]) {
//             transformedData[name] = [];
//           }

//           transformedData[name].push(price);
//         }
//       }
//     }
//     return transformedData;
//   };

//   const transformedData = transformData(filteredData);

//   const datasets = Object.keys(transformedData).map((name, index) => ({
//     label: name || "",
//     data: transformedData[name] || "",
//     borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
//     backgroundColor: `rgba(${colorArray[index % colorArray.length].join(
//       ", "
//     )}, 0.9)`,
//     yAxisID: "y",
//     type: "bar",
//   }));

//   const chartData = {
//     series: [
//       {
//         name: "Volume",
//         data: filteredData ? filteredData.map((item) => item.price || 0) : [],
//         type: "bar",
//       },
//     ],
//     colors: [
//       "#3E4A76",
//       "#b0b0b0",
//       "#ee1c2a",
//       "#ffbb00",
//       "#00bbff",
//       "#22cc44",
//       "#fa8072",
//     ],
//     categories: getCompetitorsPrice?.dates || [], // Use the dates from the response
//   };

//   const lineChart = {
//     series: chartData.series || [],
//     options: {
//       chart: {
//         height: 300,
//         type: "line",
//         zoom: { enabled: false },
//         toolbar: { show: false },
//       },
//       colors: chartData.colors || [],
//       dataLabels: { enabled: false },
//       stroke: { curve: "smooth", width: 2 },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: "45%",
//           endingShape: "rounded",
//         },
//       },
//       xaxis: {
//         categories: chartData.categories || [],
//         title: { text: "Days of the Month" },
//         axisBorder: { color: "#e0e6ed" },
//       },
//       yaxis: [
//         { title: { text: "Volume" }, min: 0, max: 130 },
//         { opposite: true, title: { text: "Growth" }, min: 70, max: 180 },
//       ],
//       grid: { borderColor: "#e0e6ed" },
//       tooltip: {
//         shared: true,
//         intersect: false,
//         theme: "light",
//         y: { formatter: (val) => val },
//       },
//       legend: {
//         position: "top",
//         horizontalAlign: "center",
//       },
//     },
//   };

//   const handleChange = (event) => {
//     setSelectedFuelIndex(event.target.value); // Update selected fuel type index
//   };

//   return (
//     <div>
//       <Card.Header className="d-flex w-100 justify-content-between align-items-center card-title w-100">
//         <h4 className="card-title">Competitors Chart</h4>

//         <div style={{ display: "flex", justifyContent: "flex-end" }}>
//           <div style={{ display: "flex", width: "200px" }}>
//             <FormControl fullWidth>
//               <InputLabel id="fuel-select-label">Fuel Type</InputLabel>
//               <Select
//                 labelId="fuel-select-label"
//                 id="fuel-select"
//                 value={selectedFuelIndex} // Use selectedFuelIndex as the selected value
//                 label="Fuel Type"
//                 onChange={handleChange}
//               >
//                 {getCompetitorsPrice?.fuelTypes?.map((fuelType, index) => (
//                   <MenuItem key={index} value={index}>
//                     {fuelType}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </div>
//         </div>
//       </Card.Header>

//       <ReactApexChart
//         series={lineChart?.series}
//         options={lineChart?.options}
//         className="rounded-lg bg-white dark:bg-black overflow-hidden"
//         type="line"
//         height={500}
//       />
//     </div>
//   );
// };

// export default CEODashboardCompetitorChart;

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const CEODashboardCompetitorChart = ({ getCompetitorsPrice }) => {
  const [selectedFuelIndex, setSelectedFuelIndex] = useState(0);
  const selectedFuelType = getCompetitorsPrice?.fuelTypes[selectedFuelIndex];

  useEffect(() => {
    if (!getCompetitorsPrice) {
    }
  }, [getCompetitorsPrice]);

  console.log(getCompetitorsPrice, "getCompetitorsPrice");

  const filteredData = getCompetitorsPrice?.dates?.map((date) => ({
    date,
    price: getCompetitorsPrice?.dataArray?.[date]?.[selectedFuelType],
  }));

  const colorArray = [
    [255, 99, 132], // Red
    [54, 162, 235], // Green
    [154, 62, 251], // Blue
    [255, 206, 86], // Yellow
    [75, 192, 192], // Teal
    [153, 102, 255], // Purple
    [255, 159, 64], // Orange
    [255, 77, 166], // Pink
    [24, 220, 255], // Aqua
    [255, 51, 51], // Crimson
    [0, 204, 102], // Green
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
    yAxisID: name === getCompetitorsPrice?.siteName ? "y" : "y1", // Bars on left axis, lines on right axis
    type: name === getCompetitorsPrice?.siteName ? "bar" : "line",
  }));

  const data = {
    labels: filteredData
      ? filteredData?.map((selectedDate) => selectedDate.date)
      : "",
    datasets: datasets ? datasets : "",
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left", // Left side Y-axis for bar
        min: 0,
        // max: 3,
        ticks: {
          stepSize: 0.1,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right", // Right side Y-axis for line charts
        min: 0,
        // max: 3,
        ticks: {
          stepSize: 0.1,
        },
        grid: {
          drawOnChartArea: false, // Prevent grid lines from overlapping with the left Y-axis
        },
      },
    },
  };

  const handleChange = (event) => {
    setSelectedFuelIndex(event.target.value);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!filteredData ? <span className="primary-loader"></span> : null}
      </div>

      <>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", width: "200px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Fuel Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFuelIndex}
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
          <Line data={data} options={options} height={500} />
        </div>
      </>
    </>
  );
};

export default CEODashboardCompetitorChart;
