import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "react-bootstrap";
import { Comparisongraphfilter } from "../../Utils/commonFunctions/commonFunction";

// Register the required chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CeoDashboardBarChart = ({ data, options, height, width, title }) => {
  const selectedLabel = Comparisongraphfilter?.find(
    (option) => option?.value == title
  )?.label;

  return (
    <>
      <Card className="h-100">
        <Card.Header className="p-4 w-100  ">
          <h4 className="card-title">{title}</h4>
        </Card.Header>
        <Card.Body>
          <Bar data={data} options={options} height={height} width={width} />
        </Card.Body>
      </Card>
    </>
  );
};

export default CeoDashboardBarChart;
