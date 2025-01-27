import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Card } from "react-bootstrap";

const FuelPriceTimeLineLogs = ({ data }) => {
  return (
    <>
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
            <tr className="middayModal-tr fuel-readonly">
              <td className={`time-input-fuel-sell middayModal-td `}>
                {data?.currentDate}
              </td>
              <td className={`time-input-fuel-sell middayModal-td`}>
                {data?.currentTime}
              </td>
              {data?.current?.[0]?.map((item, rowIndex) => (
                <>
                  <td className={`time-input-fuel-sell middayModal-td`}>
                    {item?.price}
                  </td>
                </>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="vtimeline mt-4">
        {data?.logs?.map((item) => (
          <div
            key={item.id}
            className={`timeline-wrapper timeline-inverted ${
              item.status === 1
                ? "timeline-wrapper-warning"
                : item.status === 2
                  ? "timeline-wrapper-danger"
                  : item.status === 3
                    ? "timeline-wrapper-success"
                    : item.status === 4
                      ? "timeline-wrapper-modified"
                      : "timeline-wrapper-no-case"
            }`}
          >
            <div className="timeline-badge"></div>
            <div className="timeline-panel">
              <div className="timeline-heading">
                <span className=" fw-600 d-flex  align-items-center text-capitalize">
                  <span className="me-2">{item?.creator}</span>
                  <span className="badge p-2">Level 1 </span>
                </span>
                <h6 className=" fw-600 d-flex justify-content-between align-items-center">
                  Fuel Suggested For ({item?.date}, {item?.time})
                  <span>
                    {item?.status === 1 ? (
                      <span className="btn btn-warning btn-sm ms-2">
                        <i className="ph ph-hourglass-low  c-fs-12 me-1"></i>
                        <span>Pending</span>
                      </span>
                    ) : item?.status === 2 ? (
                      <span className="btn btn-danger btn-sm ms-2">
                        <i className="ph ph-x  c-fs-12 me-1"></i>
                        <span>Rejected</span>
                      </span>
                    ) : item?.status === 3 ? (
                      <span className="btn btn-success btn-sm ms-2">
                        <i className="ph ph-check  c-fs-12 me-1"></i>
                        <span>Approved</span>
                      </span>
                    ) : item?.status === 4 ? (
                      <span className="btn btn-info btn-sm ms-2">
                        <i className="ph ph-checks  c-fs-12 me-1"></i>
                        <span>Modified</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </span>
                </h6>
                {/* <div className=" c-fs-13 ">
                  Creator - <span className=" fw-500">{item?.creator} </span>{" "}
                </div> */}
                <div className=" c-fs-13 ">
                  Created At -{" "}
                  <span className=" fw-500">{item?.created_at}</span>
                </div>
                <div></div>
              </div>
              <div className="timeline-body">
                <p>{item?.description}</p>
              </div>
              <div className="table-container table-responsive">
                <table className="table table-modern tracking-in-expand">
                  <thead>
                    <tr>
                      {data?.fuel_head_array?.map((item) => (
                        <th key={item?.id} className="middy-table-head">
                          {item?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <React.Fragment>
                      <tr className="">
                        {item?.prices?.map((item, itemIndex) => (
                          <td key={item.id} className="middayModal-td">
                            <div className="py-1">
                              <div className=" d-flex align-items-center  w-100 h-100 ">
                                <div
                                  className=" fs-14 "
                                  style={{
                                    color: item?.price_color,
                                  }}
                                >
                                  <span className=" text-decoration-line-through">
                                    {item?.prev_price}
                                  </span>

                                  <span
                                    className={`ms-2 ${
                                      item?.status === "UP"
                                        ? "text-success"
                                        : item?.status === "DOWN"
                                          ? "text-danger"
                                          : ""
                                    }`}
                                  >
                                    {item.price}
                                  </span>
                                  <span>
                                    {item?.status === "UP" && (
                                      <>
                                        <ArrowUpwardIcon
                                          fontSize="10"
                                          className="text-success ms-1 position-relative c-top-minus-1"
                                        />
                                      </>
                                    )}
                                  </span>
                                  <span>
                                    {item?.status === "DOWN" && (
                                      <>
                                        <ArrowDownwardIcon
                                          fontSize="10"
                                          className="text-danger ms-1 position-relative c-top-minus-1"
                                        />
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  </tbody>
                </table>
              </div>
              <div className="timeline-footer d-flex align-items-center flex-wrap mt-2">
                <span>
                  {item?.modifier ? <>Modifier - {item?.modifier},</> : ""}{" "}
                  {item?.modified_at ? (
                    <>Modified At - {item?.modified_at}</>
                  ) : (
                    ""
                  )}{" "}
                </span>
                &nbsp;
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FuelPriceTimeLineLogs;
