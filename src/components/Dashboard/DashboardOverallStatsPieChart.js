import React from "react";
import ReactApexChart from "react-apexcharts";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const DashboardOverallStatsPieChart = ({ data }) => {
  // Convert series strings to numbers
  const numericSeries = data?.series?.map((value) => parseFloat(value)) || [];

  const optionss = {
    chart: {
      type: 'donut',
      width: 450,
      height: 450,
    },
    labels: data?.label || [],
    colors: data?.colors || [],
    responsive: [{
      breakpoint: 180,
      options: {
        chart: {
          width: 300,
          height: 300,
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: (value) => formatNumber(value),
      }
    }
  };


  return (
    <div id="charttt"

      className=" d-flex justify-content-around align-items-center flex-column h-100">
      <ReactApexChart options={optionss} series={numericSeries} type="donut"
        width={"100%"} />
      <div className="d-flex chart-items mt-7">
        {data?.label?.map((label, index) =>
        (
          <div style={{ margin: 0 }} className="label-color" key={index}>
            <div
              className="chart-color-radius"
              style={{
                backgroundColor: data?.colors?.[index], // Use the specified color
              }}
            />
            <h6 className="mx-1">{label}</h6>
          </div>
        )
        )}
      </div>
    </div>
  );
};

export default DashboardOverallStatsPieChart;
