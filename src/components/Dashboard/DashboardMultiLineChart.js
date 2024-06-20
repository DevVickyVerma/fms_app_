
// import React, { useEffect } from "react";
// import ReactApexChart from "react-apexcharts";
// import { Line } from "react-chartjs-2";

// const DashboardMultiLineChart = ({ LinechartValues, LinechartOption }) => {

//   useEffect(() => {

//     console.log(LinechartValues, "LinechartValues");
//     console.log(LinechartOption, "LinechartOption");

//   }, [])
//   if (!LinechartValues || !LinechartOption) {
//     // Data is not available yet, return a loading state or null




//     return (
//       <>
//         <img
//           src={require("../../assets/images/no-chart-img.png")}
//           alt="MyChartImage"
//           className="all-center-flex disable-chart"
//         />

//         <p
//           style={{
//             fontWeight: 500,
//             fontSize: "0.785rem",
//             textAlign: "center",
//             color: "#d63031",
//           }}
//         >
//           Please Apply Filter To Visualizesss Chart.....
//         </p>
//       </>
//     );
//   }

//   const labels = LinechartOption?.map((label) => label);


//   const colorArray = [
//     [255, 99, 132], // Red
//     [54, 162, 235], // Green
//     [154, 62, 251], // Blue
//     // Add more colors as needed
//   ];

//   const datasets = LinechartValues?.map((dataset, index) => ({
//     label: dataset?.name,
//     data: dataset?.data,
//     borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
//     backgroundColor: `rgba(${colorArray[index % colorArray.length].join(
//       ", "
//     )}, 0.2)`,

//     yAxisID: index === 1 ? "y1" : "y",
//     key: index,
//   }));

//   const data = {
//     labels: labels,
//     datasets: datasets,
//   };

//   const options = {
//     interaction: {
//       mode: "index",
//       intersect: false,
//     },
//     stacked: false,
//     scales: {
//       y: {
//         type: "linear",
//         display: true,
//         position: "left",
//         min: 0, // Set the minimum value to 0 for the left y-axis (y)
//       },
//       y1: {
//         type: "linear",
//         display: true,
//         position: "right",
//         grid: {
//           drawOnChartArea: false,
//         },
//         min: 0, // Set the minimum value to 0 for the left y-axis (y)
//       },
//     },
//   };



//   const revenueChart = {
//     series: LinechartValues,
//     // series: [
//     //   {
//     //     name: 'Fuel Volume',
//     //     data: [12000, 13000, 12500, 14000, 13500, 14500, 15000, 15500, 16000, 16500, 17000, 17500], // Dummy data
//     //   },
//     //   {
//     //     name: 'Gross Margin',
//     //     data: [8000, 8500, 8200, 8700, 8300, 8900, 9000, 9200, 9500, 9800, 10000, 10200], // Dummy data
//     //   },
//     //   {
//     //     name: 'Shop Sale',
//     //     data: [5000, 5500, 5200, 5700, 5300, 5900, 6000, 6200, 6500, 6800, 7000, 7200], // Dummy data
//     //   },
//     // ],
//     options: {
//       chart: {
//         height: 325,
//         type: 'area',
//         fontFamily: 'Nunito, sans-serif',
//         zoom: {
//           enabled: false,
//         },
//         toolbar: {
//           show: false,
//         },
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       stroke: {
//         show: true,
//         curve: 'smooth',
//         width: 2,
//         lineCap: 'square',
//       },
//       dropShadow: {
//         enabled: true,
//         opacity: 0.2,
//         blur: 10,
//         left: -7,
//         top: 22,
//       },
//       colors: ['#1B55E2', '#E7515A', '#FF9800'],
//       markers: {
//         discrete: [
//           {
//             seriesIndex: 0,
//             dataPointIndex: 6,
//             fillColor: '#1B55E2',
//             strokeColor: 'transparent',
//             size: 7,
//           },
//           {
//             seriesIndex: 1,
//             dataPointIndex: 5,
//             fillColor: '#E7515A',
//             strokeColor: 'transparent',
//             size: 7,
//           },
//         ],
//       },
//       labels: LinechartOption,
//       // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//       xaxis: {
//         axisBorder: {
//           show: false,
//         },
//         axisTicks: {
//           show: false,
//         },
//         crosshairs: {
//           show: true,
//         },
//         labels: {
//           // offsetX: isRtl ? 2 : 0,
//           offsetY: 5,
//           style: {
//             fontSize: '12px',
//             cssClass: 'apexcharts-xaxis-title',
//           },
//         },
//       },
//       yaxis: {
//         tickAmount: 7,
//         labels: {
//           formatter: (value) => {
//             return value / 1000 + 'K';
//           },
//           // offsetX: isRtl ? -30 : -10,
//           offsetY: 0,
//           style: {
//             fontSize: '12px',
//             cssClass: 'apexcharts-yaxis-title',
//           },
//         },
//         // opposite: isRtl ? true : false,
//       },
//       grid: {
//         borderColor: '#E0E6ED',
//         strokeDashArray: 5,
//         xaxis: {
//           lines: {
//             show: true,
//           },
//         },
//         yaxis: {
//           lines: {
//             show: false,
//           },
//         },
//         padding: {
//           top: 0,
//           right: 0,
//           bottom: 0,
//           left: 0,
//         },
//       },
//       legend: {
//         position: 'top',
//         horizontalAlign: 'right',
//         fontSize: '16px',
//         markers: {
//           width: 10,
//           height: 10,
//           offsetX: -2,
//         },
//         itemMargin: {
//           horizontal: 10,
//           vertical: 5,
//         },
//       },
//       tooltip: {
//         marker: {
//           show: true,
//         },
//         x: {
//           show: false,
//         },
//       },
//       fill: {
//         type: 'gradient',
//         gradient: {
//           shadeIntensity: 1,
//           inverseColors: false,
//           opacityFrom: 0.28,
//           opacityTo: 0.05,
//           stops: [45, 100],
//         },
//       },
//     },
//   };

//   return (
//     <div
//     //  className="d-flex chart-items"
//     >
//       {/* <Line data={data} options={options} /> */}
//       <ReactApexChart series={revenueChart?.series} options={revenueChart?.options} type="area" />
//     </div>
//   );
// };

// export default DashboardMultiLineChart;

import React from "react";
import ReactApexChart from "react-apexcharts";

const DashboardMultiLineChart = ({ LinechartValues, LinechartOption }) => {
  if (!LinechartValues || !LinechartOption) {
    return (
      <>
        <img
          src={require("../../assets/images/no-chart-img.png")}
          alt="MyChartImage"
          className="all-center-flex disable-chart"
        />
        <p
          style={{
            fontWeight: 500,
            fontSize: "0.785rem",
            textAlign: "center",
            color: "#d63031",
          }}
        >
          Please Apply Filter To Visualize Chart.....
        </p>
      </>
    );
  }

  const labels = LinechartOption;

  const colorArray = [
    '#1B55E2', // Blue
    '#E7515A', // Red
    '#FF9800', // Orange
    // Add more colors if needed
  ];

  const series = LinechartValues.map((dataset, index) => ({
    name: dataset.name,
    type: dataset.type,
    data: dataset.data.map(Number),
    // Ensure series have the correct background color defined
    // fillColor: {
    //   colors: [{
    //     opacity: 0.2,
    //   }, {
    //     opacity: 0.5,
    //   }]
    // }
    fillColor: {
      type: 'solid', // Use solid fills
      opacity: 1, // Ensure full opacity for solid fill
      gradient: {
        shade: '#1B55E2',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 1,
        stops: [0, 50, 100],
      },
    },
  }));




  const chartOption = {
    chart: {
      height: 325,
      type: "line",
      fontFamily: "Nunito, sans-serif",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      curve: "smooth",
      width: 2,
      lineCap: "square",
    },
    colors: colorArray,
    markers: {
      size: 5,
      colors: colorArray,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    labels: labels,
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        offsetY: 5,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(2),
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    grid: {
      borderColor: "#E0E6ED",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '16px',
      markers: {
        width: 10,
        height: 10,
        offsetX: -2,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    tooltip: {
      marker: {
        show: true,
      },
      x: {
        show: false,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 1,
        stops: [0, 50, 100],
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        series={series}
        options={chartOption}
        type="line"
        height={325}
      />
    </div>
  );
};

export default DashboardMultiLineChart;
