import React from "react";
import Chart from "react-google-charts";

const PieChartOfDashboard = ({ piechartValues }) => {
  if (!piechartValues || !piechartValues || !piechartValues) {
    // Data is not available yet, return a loading state or null
    return <p> Please Apply Filter To Visualize Chart.....</p>;
  }

  // Extract the data from the prop
  const { shop_sales, fuel_sales, bunkered_sales } = piechartValues;
  const data = [["Category", "Sales"]];

  // Check and include Shop Sales value
  if (parseFloat(shop_sales) >= 0) {
    data.push(["Shop Sales", parseFloat(shop_sales)]);
  }

  // Check and include Fuel Sales value
  if (parseFloat(fuel_sales) >= 0) {
    data.push(["Fuel Sales", parseFloat(fuel_sales)]);
  }

  // Check and include Bunkered Sales value
  if (parseFloat(bunkered_sales) >= 0) {
    data.push(["Bunkered Sales", parseFloat(bunkered_sales)]);
  }

  return (
    <div>
      <Chart
        height={"100%"}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={data}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
};

export default PieChartOfDashboard;
