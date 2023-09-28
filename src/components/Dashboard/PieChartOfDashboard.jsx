import React from "react";
import Chart from "react-google-charts";

const PieChartOfDashboard = ({ piechartValues }) => {
  if (!piechartValues || !piechartValues || !piechartValues) {
    // Data is not available yet, return a loading state or null
    return <p> Please Apply Filter To Visualize Chart.....</p>;
  }
  console.log("piechartValues", piechartValues);

  // Initialize the data state with default values

  // Extract the data from the prop
  const { shop_sales, fuel_sales, bunkered_sales } = piechartValues;

  // Create a data array with the extracted values
  // const data = [['Category', 'Sales'], ['Shop Sales', parseFloat(shop_sales)], ['Fuel Sales', parseFloat(fuel_sales)], ['Bunkered Sales', parseFloat(bunkered_sales)]];

  // Create a data array with the extracted values
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
        // width={'900px'}
        height={"100%"}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={data}
        // options={{
        //     title: 'Sales Breakdown',
        // }}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
};

export default PieChartOfDashboard;
