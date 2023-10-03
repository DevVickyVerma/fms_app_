import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const BarChart = ({ piechartValues }) => {
  if (!piechartValues) {
    // Data is not available yet, return a loading state or null
    return <p> Please Apply Filter To Visualize Chart.....</p>;
  }

  const shop_sales = parseFloat(piechartValues?.shop_sales);
  const fuel_sales = parseFloat(piechartValues?.fuel_sales);
  const bunkered_sales = parseFloat(piechartValues?.bunkered_sales);
  const totalSales = shop_sales + fuel_sales + bunkered_sales;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const labels = Object.keys(piechartValues).map((key) =>
    capitalizeFirstLetter(key.replace("_", " "))
  );

  const data = {
    labels: labels,
    datasets: [
      {
        data: [shop_sales, fuel_sales, bunkered_sales],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(154, 62, 251,1)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
    },
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
        <div style={{ width: "67%" }}>
          <Pie data={data} options={config} />
        </div>
      </div>
    </>
  );
};

export default BarChart;
