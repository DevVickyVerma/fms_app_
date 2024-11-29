import React from 'react';

const PriceLogTable = ({ priceLogs }) => {
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Site</th>
          <th>Selling</th>
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
            <td>{log.site}</td>
            <td>{log.name}</td>
            <td>{log.is_checked}</td>
            <td>£{log.prev_price}</td>
            <td>£{log.price}</td>
            <td>{log.user}</td>
            <td>{log.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceLogTable;
