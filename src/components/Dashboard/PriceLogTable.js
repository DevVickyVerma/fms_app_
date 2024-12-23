import React from "react";

const PriceLogTable = ({ priceLogs, PriceLogsvalue }) => {


  return (
    <>

      {
        PriceLogsvalue == 1 ? (
          <table
            className="table table-modern tracking-in-expand"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>

                <th scope="col">Img</th>
                <th scope="col">Site </th>
                <th scope="col">Compitior </th>
                <th scope="col">Date</th>


              </tr>
            </thead>
            <tbody>
              {priceLogs?.map((log) => (
                <tr key={log.id}>
                  <td className="py-2">{log.name}</td>
                  <td>{log.site}</td>
                  <td>{log.name}</td>

                  <td>{log.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : PriceLogsvalue == 2 ? (
          <table
            className="table table-modern tracking-in-expand"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>

                <th scope="col">Img</th>
                <th scope="col">Site </th>
                <th scope="col">Compitior </th>
                <th scope="col">Date</th>


              </tr>
            </thead>
            <tbody>
              {priceLogs?.map((log) => (
                <tr key={log.id}>
                  <td className="py-2">{log.name}</td>
                  <td>{log.site}</td>
                  <td>{log.name}</td>

                  <td>{log.created}</td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : PriceLogsvalue == 0 ? (

          <table
            className="table table-modern tracking-in-expand"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>

                <th scope="col">Logo</th>
                <th scope="col">Site </th>
                <th scope="col">Date</th>
                <th scope="col">Details</th>

              </tr>
            </thead>
            <tbody>
              {priceLogs?.map((log) => (
                <tr key={log.id}>
                  <td className="py-2">{log.name}</td>
                  <td>{log.site}</td>
                  <td>{log.created}</td>
                  <td>{log.type}</td>


                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          "Default Value"
        )
      }


    </>





  );
};

export default PriceLogTable;
