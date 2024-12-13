import React from "react";

const PriceLogTable = ({ priceLogs }) => {
  return (
    <table
      className="table table-modern tracking-in-expand"
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th scope="col">Fuel</th>
          <th scope="col">Checked</th>
          <th scope="col">Old Price</th>
          <th scope="col">New Price</th>
          <th scope="col">Updated By</th>
          <th scope="col">Update Date</th>
        </tr>
      </thead>
      <tbody>
        {priceLogs?.map((log) => (
          <tr key={log.id}>
            <td className="py-2">{log.name}</td>
            <td>{log.is_checked}</td>
            <td>£{log.prev_price}</td>
            <td
              className={
                log?.status === "UP"
                  ? "text-success"
                  : log?.status === "DOWN"
                  ? "text-danger"
                  : undefined
              }
            >
              £{log.price}
            </td>
            <td>{log.user}</td>
            <td>02-12-2024</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceLogTable;
