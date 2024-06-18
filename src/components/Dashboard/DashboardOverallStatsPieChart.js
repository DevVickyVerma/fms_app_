import React from "react";
import ReactApexChart from "react-apexcharts";

const DashboardOverallStatsPieChart = ({ data }) => {
  let labels = [];
  let formattedLabels = [];
  let consoleValues = [];

  if (data && typeof data === "object") {
    consoleValues = Object.values(data).map((value) =>
      parseFloat(value.replace(/'/g, ""))
    );

    labels = Object.keys(data).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    );

    formattedLabels = Object.keys(data).map((key) =>
      key
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }

  const options = {
    chart: {
      width: 100,
      type: "pie",
    },
    labels: formattedLabels,
    colors: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(154, 62, 251)"],
  };


  const optionss = {
    chart: {
      type: 'donut',
      width: 450, // Adjust width for larger chart
      height: 450, // Adjust height for larger chart
    },
    labels: formattedLabels, // Replace with your formattedLabels
    colors: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(154, 62, 251)"],
    responsive: [{
      breakpoint: 180,
      options: {
        chart: {
          width: 300, // Adjust width for responsive design
          height: 300, // Adjust height for responsive design
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const series = [44, 55, 41, 17, 15]; // Data series for the donut chart


  return (
    <div id="charttt"

      className=" d-flex justify-content-around align-items-center flex-column h-100"
    // style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
    >

      {/* <ReactApexChart options={options} series={consoleValues} type="pie"
        width={"100%"}
      // height={"100%"}
      /> */}
      <ReactApexChart options={optionss} series={consoleValues} type="donut"
        width={"100%"}
      // height={"100%"}
      />
      <div className="d-flex chart-items mt-7">
        {labels.map((label, index) => {
          const formattedLabel = label
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <div style={{ margin: 0 }} className="label-color" key={index}>
              <div
                className="chart-color-radius"
                style={{
                  backgroundColor: options.colors[index], // Use the specified color
                }}
              />
              <h6 className="mx-1">{formattedLabel}</h6>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardOverallStatsPieChart;
