import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Apexcharts2 = ({ data }) => {
  const [series, setSeries] = useState([10, 15, 33, 43]);

  useEffect(() => {
    if (data && typeof data === "object") {
      console.log(Object.values(data), "Object.value");
    }
  }, []);

  let labels = [];
  let consolevalues = [];
  if (data && typeof data === "object") {
    consolevalues = Object.values(data).map((value) =>
      parseFloat(value.replace(/'/g, ""))
    );
    labels = Object.keys(data).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    );
    console.log(consolevalues, "consolevalues");
  }

  const options = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"], // Example colors for each series
  };

  const realColors = options.colors.map((color) => {
    return color.startsWith("#") ? color : "#" + color;
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={consolevalues}
        type="pie"
        width={380}
      />
   <div className="d-flex chart-items">
  {labels.map((label, index) => {
    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, ' ');
    return (
      <div className="label-color" key={index}>
        <h6 className="mx-2">{formattedLabel}</h6>
        <div 
          style={{
            backgroundColor: realColors[index],
            width: "20px",
            height: "20px",
          }}
        />
      </div>
    );
  })}
</div>

    </div>
  );
};

export default Apexcharts2;
