import React, { useEffect, useState } from "react";
import { Form, FormikProvider } from "formik";
import {
  Card,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VersionTwoSuggestedFuelPriceModal from "./VersionTwoSuggestedFuelPriceModal";

const VersionTwoSuggestedFuelPrice = ({
  data,
  postData,
  filterData,
  accordionSiteID,
}) => {
  const [suggestedFuelPriceModal, setSuggestedFuelPriceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [SuggestedModalId, setSuggestedModalId] = useState();

  const handleModalClose = () => {
    setSuggestedFuelPriceModal(false);
  };

  const handleModalLogs = (site) => {
    setSuggestedModalId(site?.id);
    setSuggestedFuelPriceModal(true);
  };

  return (
    <>
      <Row className="row-sm">
        <Col lg={12}>
          <Card style={{ overflowY: "auto" }}>
            <Card.Header>
              <h3 className="card-title w-100">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <span>
                      Suggested Fuel Price Update - {filterData?.site_name} (
                      {`${filterData?.start_date}`}){" "}
                    </span>
                  </div>
                </div>
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="table-container table-responsive">
                <table className="table table-modern tracking-in-expand">
                  <thead>
                    <tr>
                      {data?.fuel_head_array?.map((item) => (
                        <th key={item?.id} className="middy-table-head">
                          {item?.name}
                        </th>
                      ))}
                      <th className="middy-table-head">Status</th>
                      <th className="middy-table-head">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data?.fuelSuggestions?.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <tr
                          className="pointer"
                          onClick={() => handleModalLogs(row)}
                        >
                          <td className="middayModal-td">
                            <div className="py-1">
                              <span>{row?.date}</span>
                            </div>
                          </td>

                          <td className="middayModal-td">
                            <div className="py-1">
                              <span>{row?.time}</span>
                            </div>
                          </td>

                          {row?.prices?.map((item, itemIndex) => (
                            <td key={item.id} className="middayModal-td">
                              <div className="py-1">
                                <div className=" d-flex align-items-center  w-100 h-100 ">
                                  <div
                                    className=" fs-14 "
                                    style={{ color: item?.price_color }}
                                  >
                                    <span className=" text-decoration-line-through">
                                      {item.prev_price}
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

                          <td
                            className={`time-input-fuel-sell middayModal-td`}
                            onClick={() => handleModalLogs(row)}
                          >
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip>
                                  <span>
                                    {row.status === 1 ? (
                                      <span>Pending</span>
                                    ) : row.status === 2 ? (
                                      <span>Rejected</span>
                                    ) : row.status === 3 ? (
                                      <span>Approved</span>
                                    ) : row.status === 4 ? (
                                      <span>Modified</span>
                                    ) : (
                                      "-"
                                    )}{" "}
                                  </span>
                                  <span>by - Name Will Come</span>
                                </Tooltip>
                              }
                            >
                              <span style={{ cursor: "pointer" }}>
                                {row.status === 1 ? (
                                  <span className="btn btn-warning btn-sm">
                                    <i className="ph ph-hourglass-low  c-fs-12 mx-1"></i>
                                    <span>Pending</span>
                                  </span>
                                ) : row.status === 2 ? (
                                  <span className="btn btn-danger btn-sm">
                                    <i className="ph ph-x  c-fs-12 mx-1"></i>
                                    <span>Rejected</span>
                                  </span>
                                ) : row.status === 3 ? (
                                  <span className="btn btn-success btn-sm">
                                    <i className="ph ph-check  c-fs-12 mx-1"></i>
                                    <span>Approved</span>
                                  </span>
                                ) : row.status === 4 ? (
                                  <span className="btn btn-info btn-sm">
                                    <i className="ph ph-checks  c-fs-12 mx-1"></i>
                                    <span>Modified</span>
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </span>
                            </OverlayTrigger>
                          </td>

                          <td
                            className={`time-input-fuel-sell middayModal-td  `}
                          >
                            <i
                              className="ph ph-file-text me-2 pointer"
                              onClick={() => handleModalLogs(row)}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {suggestedFuelPriceModal && (
        <>
          <VersionTwoSuggestedFuelPriceModal
            open={suggestedFuelPriceModal}
            onClose={handleModalClose}
            selectedItem={selectedItem}
            accordionSiteID={SuggestedModalId}
            // selectedDrsDate={selectedDrsDate}
            // onDataFromChild={handleDataFromChild}
            postData={postData}
          />
        </>
      )}
    </>
  );
};

export default VersionTwoSuggestedFuelPrice;
