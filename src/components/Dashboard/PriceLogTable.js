import React from "react";

const PriceLogTable = ({ priceLogs, PriceLogsvalue }) => {

  console.log(PriceLogsvalue, "PriceLogTable");


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
                <th scope="col">Competitor</th>
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
        ) : PriceLogsvalue == 2 ? (
          <table
            className="table table-modern tracking-in-expand"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th scope="col">OV</th>
                <th scope="col">Img2</th>
                <th scope="col">Site </th>
                <th scope="col">Compitior </th>
                <th scope="col">Date</th>
                <th scope="col">Detail</th>

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

        ) : PriceLogsvalue == 0 ? (

          <table
            className="table table-modern tracking-in-expand"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th scope="col">FMS</th>
                <th scope="col">Img1</th>
                <th scope="col">Site </th>
                <th scope="col">Date</th>
                <th scope="col">Detail</th>

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
        ) : (
          "Default Value"
        )
      }


    </>





  );
};

export default PriceLogTable;
