import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";

const CEODashboardCompetitor = ({ getCompetitorsPrice }) => {
  console.log(
    Object.keys(getCompetitorsPrice?.competitorListing),
    "Object.keys(getCompetitorsPrice?.competitorListing)",
    getCompetitorsPrice?.competitorListing
  );

  return (
    <>
      {getCompetitorsPrice && (
        <table className="table table-modern tracking-in-expand">
          <thead>
            <tr>
              <th className="font-500" scope="col">
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    Competitors
                    {/* <AiFillCaretDown /> */}
                  </span>
                  {/* <span className="text-end">
                    Fuel <span className="hidden-in-small-screen">Type</span>{" "}
                    <AiFillCaretRight />
                  </span> */}
                </div>
              </th>
              {Object.keys(getCompetitorsPrice?.competitorListing)?.map(
                (fuelType) => (
                  <th key={fuelType} scope="col">
                    {/* <div className="d-flex align-items-center">
                      <BsFuelPumpFill className="me-2" />
                    </div> */}
                    {fuelType}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {getCompetitorsPrice?.competitors?.map((competitor, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  <div className="d-flex align-items-center ">
                    <div className="flex-grow-1">
                      <img
                        src={competitor?.supplierImage}
                        // alt="supplier"
                        style={{
                          width: "25px",
                          height: "25px",
                          marginRight: "10px",
                        }}
                      />{" "}
                      <span className="small text-muted">
                        {" "}
                        {competitor?.station
                          ? "My station"
                          : `${competitor?.dist_miles} miles away`}
                      </span>
                      <>
                        <div className="">{competitor.name}</div>
                      </>
                    </div>
                  </div>
                </td>
                {Object.keys(getCompetitorsPrice?.competitorListing).map(
                  (fuelType, colIndex) => (
                    <td key={colIndex}>
                      {getCompetitorsPrice?.competitorListing?.[fuelType]?.[
                        rowIndex
                      ]?.price === "-" ? (
                        <div className="text-center">-</div>
                      ) : (
                        <>
                          <div className="d-flex  align-items-center">
                            <span>
                              {
                                getCompetitorsPrice?.competitorListing?.[
                                  fuelType
                                ]?.[rowIndex]?.price
                              }
                            </span>
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip>
                                  {
                                    getCompetitorsPrice?.competitorListing?.[
                                      fuelType
                                    ]?.[rowIndex]?.last_date
                                  }
                                </Tooltip>
                              }
                            >
                              <span style={{ cursor: "pointer" }}>
                                <i
                                  className="fa fa-info-circle ms-1"
                                  aria-hidden="true"
                                />
                              </span>
                            </OverlayTrigger>
                            {!getCompetitorsPrice?.competitorListing?.[
                              fuelType
                            ]?.[rowIndex]?.station && (
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>
                                    {
                                      getCompetitorsPrice?.competitorListing?.[
                                        fuelType
                                      ]?.[rowIndex]?.logo_tip
                                    }
                                  </Tooltip>
                                }
                              >
                                <img
                                  src={
                                    getCompetitorsPrice?.competitorListing?.[
                                      fuelType
                                    ]?.[rowIndex]?.logo
                                  }
                                  // alt="logo"
                                  style={{
                                    width: "17px",
                                    height: "17px",
                                    marginLeft: "4px",
                                  }}
                                />
                              </OverlayTrigger>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default CEODashboardCompetitor;
