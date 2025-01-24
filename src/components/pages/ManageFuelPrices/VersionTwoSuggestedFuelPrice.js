import React, { useEffect, useState } from "react";
import { Form, FormikProvider } from "formik";
import { Card, Row, Col } from "react-bootstrap";
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
                      <th className="middy-table-head">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data?.fuelSuggestions?.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <tr className="">
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
                            className={`time-input-fuel-sell middayModal-td  `}
                          >
                            <i
                              className="ph ph-eye me-2 pointer"
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
