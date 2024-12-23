import React from "react";

const PriceLogTable = ({ PriceLogsvalue, PriceLogs }) => {
  console.log(PriceLogs, "PriceLogTable");

  return (
    <>

      {
        PriceLogsvalue == "competitor" ? (
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
              {PriceLogs?.priceLogs?.map((log) => (
                <tr key={log.id}>
                  <td className="py-2">    <img
                    src={log?.supplier}
                    // alt="supplier"
                    style={{
                      width: "25px",
                      height: "25px",
                      marginRight: "10px",
                    }}
                  />{" "}</td>
                  <td>{log.site}</td>
                  <td>{log.competitor}</td>

                  <td>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : PriceLogsvalue == "ov" ? (
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
              {PriceLogs?.priceLogs?.map((log) => (
                <tr key={log.id}>
                  <td className="py-2">    <img
                    src={log?.supplier}
                    // alt="supplier"
                    style={{
                      width: "25px",
                      height: "25px",
                      marginRight: "10px",
                    }}
                  />{" "}</td>
                  <td>{log.site}</td>
                  <td>{log.competitor}</td>

                  <td>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : PriceLogsvalue == "fms" ? (

          <table
            className="table table-modern tracking-in-expand"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>

                <th scope="col">Img</th>
                <th scope="col">Site </th>
                <th scope="col">Date</th>
                <th scope="col">Details</th>

              </tr>
            </thead>
            <tbody>
              {PriceLogs?.priceLogs?.map((log) => (
                <tr key={log.id}>
                  <td className="py-2">    <img
                    src={log.supplier}
                    alt="supplier"
                    style={{
                      width: "25px",
                      height: "25px",
                      marginRight: "10px",
                    }}
                  />{" "}</td>
                  <td>{log.site}</td>
                  <td>{log.date}</td>
                  <td>{log.detail}</td>


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
