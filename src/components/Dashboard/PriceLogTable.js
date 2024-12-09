import React from 'react';

const PriceLogTable = ({ priceLogs }) => {
  return (
    <table className='table' style={{ width: "100%" }}>
      <thead>
        <tr>

          <th>Fuel</th>
          <th>Checked</th>
          <th>Old Price</th>
          <th>New Price</th>
          <th>Updated By</th>
          <th>Update Date</th>
        </tr>
      </thead>
      <tbody>
        {priceLogs?.map((log) => (
          <tr key={log.id}>

            <td>{log.name}</td>
            <td>{log.is_checked}</td>
            <td>£{log.prev_price}</td>
            <td>£{log.price}</td>
            <td>{log.user}</td>
            <td>02-12-2024</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceLogTable;
