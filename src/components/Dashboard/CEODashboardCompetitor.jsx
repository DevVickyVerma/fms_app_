import React from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";

const CEODashboardCompetitor = ({ getCompetitorsPrice }) => {
  return (
    <>
      {getCompetitorsPrice && (
        <>
          {/* <Card.Body className="my-cardd card-body pb-0 overflow-auto"></Card.Body> */}
          <table className="w-100 mb-6 ">
            <tbody>
              <tr>
                <th className="font-500">
                  <span className="single-Competitor-heading cardd  d-flex justify-content-between w-99">
                    <span>
                      Competitors Name <AiFillCaretDown />
                    </span>
                    <span className="text-end">
                      Fuel <span className="hidden-in-small-screen"> Type</span>{" "}
                      <AiFillCaretRight />
                    </span>
                  </span>
                </th>
                {Object?.keys(getCompetitorsPrice?.competitorListing)?.map(
                  (fuelType) => (
                    <th key={fuelType} className="font-500">
                      <span className="single-Competitor-heading cardd block w-99 ">
                        <BsFuelPumpFill /> {fuelType}
                      </span>
                    </th>
                  )
                )}
              </tr>
              {getCompetitorsPrice?.competitors?.map(
                (competitorsName, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <div className="single-Competitor-heading d-flex w-99.9 cardd gap-0 px-1">
                        <p className=" m-0 d-flex align-items-center">
                          <span>
                            <img
                              src={competitorsName?.supplierImage}
                              // alt="supplierImage"
                              className=" mx-3"
                              style={{
                                width: "25px",
                                height: "25px",
                              }}
                            />
                          </span>
                        </p>

                        <p
                          className=" d-flex flex-column m-0 c-line-height-normal"
                          style={{ minWidth: "55px" }}
                        >
                          <span
                            className="single-Competitor-distance c-fs-10"
                            style={{ minWidth: "100px" }}
                          >
                            <AiOutlineArrowRight />{" "}
                            {competitorsName?.station
                              ? "My station"
                              : `${competitorsName?.dist_miles} miles away`}
                          </span>
                          <span
                          //  style={{ minWidth: "200px" }}
                          >
                            {competitorsName?.name}
                          </span>
                        </p>
                      </div>
                    </td>
                    {Object.keys(getCompetitorsPrice?.competitorListing).map(
                      (fuelType, colIndex) => (
                        <td key={colIndex}>
                          <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                            {getCompetitorsPrice?.competitorListing?.[
                              fuelType
                            ]?.[rowIndex]?.price === "-" ? (
                              <>
                                <div className="compidash-container">-</div>
                              </>
                            ) : (
                              <>
                                <span className="circle-info">
                                  {
                                    getCompetitorsPrice?.competitorListing?.[
                                      fuelType
                                    ]?.[rowIndex]?.last_updated
                                  }
                                  <span>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                            width: "300px", // Set your desired width here
                                          }}
                                        >
                                          {
                                            getCompetitorsPrice
                                              ?.competitorListing?.[fuelType]?.[
                                              rowIndex
                                            ]?.last_date
                                          }
                                        </Tooltip>
                                      }
                                    >
                                      <p
                                        className=" m-0 single-Competitor-distance"
                                        style={{ cursor: "pointer" }}
                                      >
                                        {" "}
                                        <i
                                          className="fa fa-info-circle ms-1"
                                          aria-hidden="true"
                                          style={{ fontSize: "15px" }}
                                        />{" "}
                                        <span />
                                      </p>
                                    </OverlayTrigger>
                                  </span>
                                </span>

                                <span className=" d-flex justify-content-between align-items-center">
                                  <span>
                                    {
                                      getCompetitorsPrice?.competitorListing?.[
                                        fuelType
                                      ]?.[rowIndex]?.price
                                    }
                                  </span>

                                  <span>
                                    {getCompetitorsPrice?.competitorListing?.[
                                      fuelType
                                    ]?.[rowIndex]?.station ? (
                                      ""
                                    ) : (
                                      <>
                                        <>
                                          <span
                                            className="PetrolPrices-img"
                                            style={{
                                              width: "25px",
                                              height: "25px",
                                              fontSize: "20px",
                                              cursor: "pointer",
                                              marginLeft: "10px",
                                              display: "flex",
                                            }}
                                          >
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={
                                                <Tooltip
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    justifyContent:
                                                      "flex-start",
                                                  }}
                                                >
                                                  <span>
                                                    {
                                                      getCompetitorsPrice
                                                        ?.competitorListing?.[
                                                        fuelType
                                                      ]?.[rowIndex]?.logo_tip
                                                    }
                                                  </span>
                                                </Tooltip>
                                              }
                                            >
                                              <img
                                                alt=""
                                                src={
                                                  getCompetitorsPrice
                                                    ?.competitorListing?.[
                                                    fuelType
                                                  ]?.[rowIndex]?.logo
                                                }
                                                className=""
                                                style={{
                                                  objectFit: "contain",
                                                }}
                                              />
                                            </OverlayTrigger>
                                          </span>
                                        </>
                                      </>
                                    )}
                                  </span>
                                </span>
                              </>
                            )}
                          </span>
                        </td>
                      )
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default CEODashboardCompetitor;
