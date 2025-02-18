import React from "react";
import InputTime from "../../components/pages/Competitor/InputTime";

const CurrentDateTable = ({ data }) => {
  return (
    <div>
      <div className="table-container overflow-auto">
        <table className="table">
          <thead>
            <tr>
              {data?.head_array?.map((item) => (
                <th key={item?.id} className="middy-table-head">
                  {item?.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="middayModal-tr">
              <td className={`time-input-fuel-sell middayModal-td `}>
                <input
                  type="date"
                  className={`table-input fuel-readonly  `}
                  value={data?.currentDate}
                  name={"current_date"}
                  disabled={true}
                  placeholder="Enter price"
                />
              </td>

              <td className={`time-input-fuel-sell middayModal-td`}>
                <InputTime
                  label="Time"
                  value={data?.currentTime}
                  disabled={true} // Disable if not editable
                  className={`time-input-fuel-sell fuel-readonly`}
                />
              </td>

              {data?.current?.map((column, colIndex) => (
                <React.Fragment key={colIndex}>
                  <td
                    className={`time-input-fuel-sell ${
                      column === "time"
                        ? "middayModal-time-td "
                        : "middayModal-td "
                    }`}
                    key={colIndex}
                  >
                    <input
                      type="number"
                      className={`table-input  fuel-readonly readonly  `}
                      name={`rows[${colIndex}]`}
                      value={column?.price}
                      disabled={true}
                      placeholder="Enter price"
                    />
                  </td>
                </React.Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentDateTable;
