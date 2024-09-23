
import { useEffect } from "react";
import { Line } from "react-chartjs-2";

const DashboardMultiLineChart = ({ LinechartValues, LinechartOption }) => {

  useEffect(() => {
  }, [])
  if (!LinechartValues || !LinechartOption) {
    // Data is not available yet, return a loading state or null

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
          Please Apply Filter To Visualizesss Chart.....
        </p>
      </>
    );
  }

  const labels = LinechartOption?.map((label) => label);


  const colorArray = [
    [255, 99, 132], // Red
    [54, 162, 235], // Green
    [154, 62, 251], // Blue
    // Add more colors as needed
  ];

  const datasets = LinechartValues?.map((dataset, index) => ({
    label: dataset?.name,
    data: dataset?.data,
    borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
    backgroundColor: `rgba(${colorArray[index % colorArray.length].join(
      ", "
    )}, 0.2)`,

    yAxisID: index === 1 ? "y1" : "y",
    key: index,
  }));

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const formatNumber = (num) => {
    if (Math.abs(num) > 999999) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (Math.abs(num) > 999) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num;
    }
  };


  const options = {
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
        min: 0,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context?.dataset?.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatNumber(context?.parsed?.y);
            }
            return label;
          },
        },
      },
    },
  };





  return (
    <div
    //  className="d-flex chart-items"
    >
      <Line data={data} options={options} />
      {/* <ReactApexChart series={revenueChart?.series} options={revenueChart?.options} type="area" /> */}
    </div>
  );
};

export default DashboardMultiLineChart;
