import { Line } from "react-chartjs-2";

const StackedLineBarChart = () => {
  const data = {
    labels: ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"],
    datasets: [
      {
        label: "Gross Margin ",
        data: [10, 20, 30, 40, 50],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        type: "bar",
        stack: "combined",
      },
      {
        label: "Fuel Volume",
        data: [100, 200, 150, 75, 85],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        stack: "combined",
      },
      {
        label: "fuel Sales",
        data: [0, 2, 13, 45, 55],
        borderColor: "rgba(154, 262, 35, 1)",
        backgroundColor: "rgba(154, 262, 35, 0.5)",
        stack: "combined",
      },
      // Add more datasets as needed
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top", // Adjust the legend position as needed
      },
    },
    elements: {
      bar: {
        order: "stacked", // Ensure proper stacking of bars
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default StackedLineBarChart;
