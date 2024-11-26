import React from 'react';

const PriceLogTable = ({ PriceLogs}) => {

console.log(PriceLogs, "PriceLogTable");

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: false,
      width: "10%",
    },
    {
      name: "Selling",
      selector: (row) => row.productName,
      sortable: false,
      width: "20%",
    },
    {
      name: "Old Price",
      selector: (row) => row.oldPrice,
      sortable: false,
      width: "15%",
      cell: (row) => `£${row.oldPrice.toFixed(2)}`,
    },
    {
      name: "New Price",
      selector: (row) => row.newPrice,
      sortable: false,
      width: "15%",
      cell: (row) => `£${row.newPrice.toFixed(2)}`,
    },
    {
      name: "Updated By",
      selector: (row) => row.updatedBy,
      sortable: false,
      width: "20%",
    },
    {
      name: "Update Date",
      selector: (row) => row.updateDate,
      sortable: false,
      width: "20%",
    }
  ];

  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.name} style={{ width: col.width }}>
              {col.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PriceLogs?.map((log) => (
          <tr key={log.id}>
            {columns.map((col) => (
              <td key={col.name}>
                {col.cell ? col.cell(log) : log[col.selector(log)]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceLogTable;
