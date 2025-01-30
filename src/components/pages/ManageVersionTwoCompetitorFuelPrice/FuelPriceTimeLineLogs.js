import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
            <tr className="middayModal-tr fuel-readonly fill-reset-color fs-15">
              <td className={`time-input-fuel-sell py-2 middayModal-td `}>
                <span className="text-black">{data?.currentDate}</span>
              </td>
              <td className={`time-input-fuel-sell py-2 middayModal-td`}>
                {data?.currentTime}
              </td>
              {data?.current?.[0]?.map((item, rowIndex) => (
                <>
                  <td className={`time-input-fuel-sell py-2 middayModal-td`}>
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
          <>
            <div
              key={item?.logs?.name}
              className={`timeline-wrapper timeline-inverted ${
                item?.logs?.status === 0
                  ? "timeline-wrapper-warning"
                  : item?.logs?.status === 1
                    ? "timeline-wrapper-primary"
                    : item?.logs?.status === 2
                      ? "timeline-wrapper-danger"
                      : item?.logs?.status === 3
                        ? "timeline-wrapper-success"
                        : item?.logs?.status === 4
                          ? "timeline-wrapper-info"
                          : item?.logs?.status === 5
                            ? "timeline-wrapper-primary"
                            : item?.logs?.status === 7
                              ? "timeline-wrapper-danger"
                              : "timeline-wrapper-no-case"
              }`}
            >
              <div className="timeline-badge"></div>
              <div
                className={`timeline-panel ${item?.logs?.status === 7 ? "blur-timeline" : ""}`}
              >
                <div className="timeline-heading">
                  <span className=" fw-600 d-flex  align-items-center text-capitalize">
                    <span className="me-2">{item?.logs?.creator}</span>
                    <span className="badge p-2"> {item?.name}</span>
                  </span>
                  <h6 className=" fw-600 d-flex justify-content-between align-items-center">
                    <div>
                      Fuel Suggested For ({item?.logs?.date}, {item?.logs?.time}
                      )
                      <span className=" ms-1">
                        {item?.logs?.is_approved == 1 ? (
                          <>
                            <span className="ms-1">
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip style={{ zIndex: "111111111" }}>
                                    <span>
                                      {item?.logs?.approvedFrom == 0 ? (
                                        <>Actioned From FMS</>
                                      ) : (
                                        <>Actioned From Email</>
                                      )}
                                    </span>
                                  </Tooltip>
                                }
                              >
                                <span>
                                  {item?.logs?.approvedFrom == 0 ? (
                                    <>
                                      <i className="pointer ph ph-desktop"></i>
                                    </>
                                  ) : (
                                    <>
                                      <i className="pointer ph ph-envelope-simple-open"></i>
                                    </>
                                  )}
                                </span>
                              </OverlayTrigger>
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </span>
                    </div>

                    <span>
                      {item?.logs?.status === 0 ? (
                        <span className="btn btn-warning btn-sm ms-2 cursor-default">
                          <i className="ph ph-hourglass-low  c-fs-12 me-1"></i>
                          <span>Pending</span>
                        </span>
                      ) : item?.logs?.status === 1 ? (
                        <span className="btn btn-primary btn-sm ms-2 cursor-default">
                          <i className="ph ph-hourglass-low  c-fs-12 me-1"></i>
                          <span>Suggested</span>
                        </span>
                      ) : item?.logs?.status === 2 ? (
                        <span className="btn btn-danger btn-sm ms-2 cursor-default">
                          <i className="ph ph-x  c-fs-12 me-1"></i>
                          <span>Rejected</span>
                        </span>
                      ) : item?.logs?.status === 3 ? (
                        <span className="btn btn-success btn-sm ms-2 cursor-default">
                          <i className="ph ph-check  c-fs-12 me-1"></i>
                          <span>Approved</span>
                        </span>
                      ) : item?.logs?.status === 4 ? (
                        <span className="btn btn-info btn-sm ms-2 cursor-default">
                          <i className="ph ph-checks  c-fs-12 me-1"></i>
                          <span>Modified</span>
                        </span>
                      ) : item?.logs?.status === 5 ? (
                        <span className="btn btn-primary btn-sm ms-2 cursor-default">
                          <i className="ph ph-checks  c-fs-12 me-1"></i>
                          <span>Suggested</span>
                        </span>
                      ) : item?.logs?.status === 7 ? (
                        <span className="btn btn-danger btn-sm ms-2 cursor-default">
                          <i className="ph ph-road-horizon  c-fs-12 me-1"></i>
                          <span>ByPass</span>
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
                    Actioned At -{" "}
                    <span className=" fw-500">{item?.logs?.created_at}</span>
                  </div>
                  <div></div>
                </div>
                <div className="timeline-body">
                  <p>{item?.logs?.description}</p>
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
                          {item?.logs?.prices?.map((subItem, itemIndex) => (
                            <td key={subItem.id} className="middayModal-td">
                              <div className="py-1">
                                <div className=" d-flex align-items-center  w-100 h-100 ">
                                  <div
                                    className=" fs-14 "
                                    style={{
                                      color: subItem?.price_color,
                                    }}
                                  >
                                    <span className=" text-decoration-line-through">
                                      {subItem?.prev_price}
                                    </span>

                                    <span
                                      className={`ms-2 ${
                                        subItem?.status === "UP"
                                          ? "text-success"
                                          : subItem?.status === "DOWN"
                                            ? "text-danger"
                                            : ""
                                      }`}
                                    >
                                      {subItem.price}
                                    </span>
                                    <span>
                                      {subItem?.status === "UP" && (
                                        <>
                                          <ArrowUpwardIcon
                                            fontSize="10"
                                            className="text-success ms-1 position-relative c-top-minus-1"
                                          />
                                        </>
                                      )}
                                    </span>
                                    <span>
                                      {subItem?.status === "DOWN" && (
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
                <div className="timeline-footer d-flex align-items-center flex-wrap mt-2 ">
                  <div className=" d-flex flex-column">
                    {/* <span>
                    {item?.modifier ? (
                      <>Modifier - {item?.modifier},</>
                    ) : (
                      ""
                    )}{" "}
                    {item?.modified_at ? (
                      <>Modified At - {item?.modified_at}</>
                    ) : (
                      ""
                    )}{" "}
                  </span> */}
                    {item?.logs?.notes && (
                      <>
                        <span className=" text-danger">
                          Rejected Reason - {item?.logs?.notes}{" "}
                        </span>
                      </>
                    )}

                    <div className=" d-flex justify-content-end ">
                      <span className=" text-gray d-flex align-items-center">
                        Approvers -
                      </span>
                      {item?.approvers?.map((item) => (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip style={{ zIndex: "1111111" }}>
                              <span>{item} </span>
                            </Tooltip>
                          }
                          key={item}
                        >
                          <span className="pointer">
                            <span
                              className=" text-capitalize first-cap-container"
                              style={{ marginLeft: "5px" }}
                            >
                              {item?.charAt(0)}
                            </span>
                          </span>
                        </OverlayTrigger>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default FuelPriceTimeLineLogs;
