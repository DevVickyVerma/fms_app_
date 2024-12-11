import React, { useState } from "react";
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
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CeoDashboardBarChart = ({ data, options, height, width, title }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    console.log(e.target.value); // You can replace this with any logic for each option
  };
  return (
    <>
      <Card className="h-100">

        <Card.Header className="p-4 w-100  ">
          <div className="w-100">

            <div className="spacebetweenend">
              <h4 className="card-title">
                {title}
              </h4>

              <select
                id="filterDropdown"
                name="filterDropdown"
                value={selectedOption}
                onChange={handleDropdownChange}
                className="selectedMonth"
              >

                {Comparisongraphfilter?.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Bar data={data} options={options} height={height} width={width} />
        </Card.Body>
      </Card>
    </>
  )
};

export default CeoDashboardBarChart;
