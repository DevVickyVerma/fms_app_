
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { formatNumber } from "../../Utils/commonFunctions/commonFunction";

const DashboardMultiLineChart = ({ LinechartValues, LinechartOption }) => {

  useEffect(() => {
    console.clear()
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

  // Api data fatching and showing
  const datasets = LinechartValues?.map((dataset, index) => ({
    label: dataset?.name,
    data: dataset?.data,
    borderColor: dataset?.borderColor,
    backgroundColor: dataset?.backgroundColor,
    yAxisID: index === 1 ? "y1" : "y",
    key: index,
  }));

  const data = {
    labels: labels,
    datasets: datasets,
  };


  const options = {
    interaction: {
      mode: "index",
      intersect: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    stacked: false,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0,
        ticks: {
          font: {
            size: 14,
          },
          color: '#6c757d', // Add color to scale labels
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        ticks: {
          font: {
            size: 14,
          },
          color: '#6c757d', // Add color to right scale labels
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background for tooltips
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          // eslint-disable-next-line func-names
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
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
    },
    animation: {
      duration: 1000, // Smooth animation on update
      easing: 'easeOutBounce',
    },
    elements: {
      line: {
        tension: 0.4, // Makes lines curvier
        borderWidth: 3,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.3)', // Add background color to lines
      },
      point: {
        radius: 5,
        backgroundColor: '#007bff',
        hoverRadius: 7, // Slight hover effect on points
        hoverBorderWidth: 3,
      },
    },
  };




  return (
    <div
      style={{ height: '60vh', width: '100%' }}
    //  className="d-flex chart-items"
    >
      <Line data={data} options={options} />
      {/* <ReactApexChart series={revenueChart?.series} options={revenueChart?.options} type="area" /> */}
    </div>
  );
};

export default DashboardMultiLineChart;
