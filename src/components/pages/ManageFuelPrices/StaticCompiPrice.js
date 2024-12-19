import React from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, TableContainer } from "@mui/material";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../../components/CommonComponent/useErrorHandler";
import CompetitorfuelpricesUpdate from "../../../components/pages/ManageFuelPrices/competitorfuelpricesUpdate";
import { useSelector } from "react-redux";
import withApi from "../../../Utils/ApiHelper";
import { staticCompiPriceCommon } from "../../../Utils/commonFunctions/commonFunction";

const StaticCompiPrice = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
  accordionSiteID,
  getData,
  postData,
}) => {
  const { handleError } = useErrorHandler();

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const [data, setData] = useState(); // Initialize data as null
  const [isLoading, setIsLoading] = useState(false);
  const [hasListing, setHasListing] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (selectedItem && selectedDrsDate) {
        try {
          setIsLoading(true);

          const response = await getData(
            `/site/competitor-suggestion/listing?site_id=${accordionSiteID}&drs_date=${selectedDrsDate}`
          );

          if (response && response.data && response.data.data) {
            setData(response.data.data);
            formik.setValues(response?.data?.data);
          }

          const responseData = response?.data?.data;

          if (responseData?.listing) {
            setHasListing(true);
          } else {
            setHasListing(false);
          }
          // if (responseData?.listing) {
          //   const initialValues = {
          //     siteId: accordionSiteID,
          //     siteName: selectedItem.competitorname,
          //     listing: responseData.listing[0]?.competitors || [],
          //   };
          //   formik.setValues(initialValues);
          // } else {
          //   // Set initialValues to an empty object or your preferred default values
          //   const initialValues = {
          //     siteId: "",
          //     siteName: "",
          //     listing: [],
          //   };
          //   formik.setValues(initialValues);
          // }

          // Initialize the form with default values
        } catch (error) {
          console.error("API error:", error);
          handleError(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedItem, selectedDrsDate]);

  const formik = useFormik({
    initialValues: staticCompiPriceCommon,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    values?.listing?.forEach((listingItem) => {
      listingItem.fuels.forEach((fuel) => {
        const priceId = fuel?.id;

        const fieldKey = `fuels[${priceId}]`;
        const fieldValue = fuel?.price.toString();
        const fieldTime = fuel?.time || "00:00";

        if (
          fieldValue !== "" &&
          fieldValue !== null &&
          fieldValue !== undefined &&
          fieldTime !== "" &&
          fieldTime !== null &&
          fieldTime !== undefined
        ) {
          formData.append(fieldKey, fieldValue);
          // formData.append(timeKey, fieldTime);
        }
      });
    });

    formData.append("drs_date", selectedDrsDate);
    formData.append("site_id", accordionSiteID);
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      const response = await axiosInstance.post(
        "/site/competitor-price/update",
        formData
      );

      if (response.status === 200 && response.data.api_response === "success") {
        sendDataToParent();
        SuccessAlert(response.data.message);
        navigate("/competitor-fuel-price");
        onClose();
      } else {
        // Handle other cases or errors here
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendDataToParent = () => {
    const dataToSend = "Data from child 123";
    onDataFromChild(dataToSend);
  };
  const handleFormSubmit = (values) => {
    console.log(values, "submited");

    // const dataToSend = "Data from child 123";
    // onDataFromChild(dataToSend);
  };

  console.log(formik?.values, "formik values");

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="100px"
      >
        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
          className="ModalTitle"
        >
          <div className="ModalTitle-date">
            <span> {selectedItem?.competitorname}</span>
            <span> ({selectedDrsDate})</span>
          </div>
          <span onClick={onClose}>
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>

        <DialogContent>
          {isLoading ? <Loaderimg /> : null}
          {hasListing ? (
            <TableContainer>
              <div className="table-container table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ maxWidth: "85px" }}>Competitor</th>

                      {data?.head_array?.map((header, columnIndex) => (
                        <th key={columnIndex}>{header}</th>
                      ))}
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr key={`competitor-name-self`} className="operator-tr">
                      <td
                        // colSpan={data?.head_array?.length + 2} // +1 for the competitor name column
                        className="middayModal-td text-muted fs-15 fw-semibold p-4"
                        style={{ maxWidth: "50px" }}
                        // colSpan={data?.head_array?.length + 2} // +1 for the competitor name column
                      >
                        <img
                          src={formik?.values?.supplier}
                          alt="Competitor"
                          width="30"
                          className="me-2"
                        />
                        {formik?.values?.site_name}
                      </td>

                      {formik?.values?.fuels?.[0]?.map(
                        (competitor, competitorIndex) => (
                          <>
                            <td
                              key={competitor?.id}
                              className="middayModal-td vertical-align-middle align-middle"
                            >
                              <input
                                className={`table-input fuel-readonly`}
                                type="number"
                                readOnly={true}
                                step="0.010"
                                name={`listing.competitors.[${competitorIndex}].price`}
                                value={competitor?.price}
                                // onChange={formik.handleChange}
                              />
                            </td>
                          </>
                        )
                      )}

                      <td></td>
                    </tr>
                    {formik?.values?.listing?.competitors?.map(
                      (competitor, competitorIndex) => (
                        <>
                          {/* Full-row for competitor name */}
                          <tr key={`competitor-name-${competitorIndex}`}>
                            <td
                              colSpan={data?.head_array?.length + 2} // +1 for the competitor name column
                              className="middayModal-td text-muted fs-15 fw-semibold p-4"
                            >
                              <img
                                src={competitor?.supplier}
                                alt="Competitor"
                                width="30"
                                className="me-2"
                              />
                              {competitor?.competitor_name}
                            </td>
                          </tr>

                          <tr className="middayModal-tr">
                            <td className="middayModal-td">
                              <div className=" d-flex align-items-center mt-3">
                                <OverlayTrigger
                                  placement="top"
                                  className="Tank-Detailss"
                                  overlay={
                                    <Tooltip
                                      style={{
                                        // width: "200px",
                                        zIndex: "111111111",
                                      }}
                                    >
                                      <div className="pointer">Gov.uk</div>
                                    </Tooltip>
                                  }
                                >
                                  <div style={{ maxWidth: "30px" }}>
                                    <img
                                      src={require("../../../assets/images/SingleStatsCompetitor/gov-Uk.png")}
                                      alt="Competitor"
                                      width="20"
                                      className="mx-2"
                                    />
                                  </div>
                                </OverlayTrigger>
                              </div>
                            </td>
                            {/* // ** here i am iterating the GOV prices */}
                            {competitor?.fuels?.gov?.map((fuel, fuelIndex) => (
                              <>
                                <td key={fuel?.id} className="middayModal-td">
                                  <input
                                    className={`table-input ${
                                      fuel?.canUpdate ? "" : "readonly"
                                    }`}
                                    type="number"
                                    readOnly={!fuel?.canUpdate}
                                    step="0.010"
                                    name={`listing.competitors.[${competitorIndex}].fuels.gov.[${fuelIndex}].price`}
                                    value={
                                      formik.values.listing.competitors[
                                        competitorIndex
                                      ].fuels.gov[fuelIndex].price
                                    }
                                    onChange={formik.handleChange}
                                  />

                                  <div className="small text-muted text-end">
                                    {fuel?.last_updated !== "-" ? (
                                      <>Last Updated - {fuel?.last_updated} </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </>
                            ))}

                            <td className="middayModal-td">
                              {competitor?.canUpdate ? (
                                <>
                                  <button
                                    className="btn btn-primary me-2"
                                    type="submit"
                                    // onClick={formik.handleSubmit}
                                  >
                                    Accept{" "}
                                    <i class="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                  </button>
                                </>
                              ) : (
                                <>
                                  {competitor?.acceptedBy === "gov" ? (
                                    <>
                                      <button
                                        className="btn btn-primary me-2"
                                        type="submit"
                                        // onClick={formik.handleSubmit}
                                      >
                                        Accept{" "}
                                        <i class="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <i class="ph ph-x work-flow-danger-status "></i>
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>

                          <tr className="middayModal-tr">
                            <td
                              className="middayModal-td"
                              style={{ maxWidth: "30px" }}
                            >
                              <div className=" d-flex align-items-center mt-3">
                                <OverlayTrigger
                                  placement="top"
                                  className="Tank-Detailss"
                                  overlay={
                                    <Tooltip
                                      style={{
                                        // width: "200px",
                                        zIndex: "111111111",
                                      }}
                                    >
                                      <div className="pointer">
                                        Petrol Price
                                      </div>
                                    </Tooltip>
                                  }
                                >
                                  <div style={{ maxWidth: "30px" }}>
                                    <img
                                      src={require("../../../assets/images/SingleStatsCompetitor/PetrolPrices-Icon-512px (2).png")}
                                      alt="Competitor"
                                      width="20"
                                      className="mx-2"
                                    />
                                  </div>
                                </OverlayTrigger>
                              </div>
                            </td>

                            {/* // ** here i am iterating the Petrol Price prices */}
                            {competitor?.fuels?.pp?.map((fuel, fuelIndex) => (
                              <>
                                <td key={fuel?.id} className="middayModal-td">
                                  <input
                                    className={`table-input ${
                                      fuel?.canUpdate ? "" : "readonly"
                                    }`}
                                    type="number"
                                    readOnly={!fuel?.canUpdate}
                                    step="0.010"
                                    name={`listing.competitors.[${competitorIndex}].fuels.pp.[${fuelIndex}].price`}
                                    // listing.competitors[0].fuels.pp[0].category_name
                                    // value={fuel?.price ? fuel?.price : 0}
                                    value={
                                      formik.values.listing.competitors[
                                        competitorIndex
                                      ].fuels.pp[fuelIndex].price
                                    }
                                    onChange={formik.handleChange}
                                  />
                                  <div className="small text-muted text-end">
                                    {fuel?.last_updated !== "-" ? (
                                      <>Last Updated - {fuel?.last_updated} </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </>
                            ))}

                            <td className="middayModal-td">
                              {competitor?.canUpdate ? (
                                <>
                                  <button
                                    className="btn btn-primary me-2"
                                    type="submit"
                                    // onClick={formik.handleSubmit}
                                  >
                                    Accept{" "}
                                    <i class="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                  </button>
                                </>
                              ) : (
                                <>
                                  {competitor?.acceptedBy === "pp" ? (
                                    <>
                                      <button
                                        className="btn btn-primary me-2"
                                        type="submit"
                                        // onClick={formik.handleSubmit}
                                      >
                                        Accept{" "}
                                        <i class="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <i class="ph ph-x work-flow-danger-status "></i>
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>

                          <tr className="middayModal-tr operator-tr">
                            <td
                              className="middayModal-td"
                              style={{ maxWidth: "30px" }}
                            >
                              <div className=" d-flex align-items-center mt-3">
                                <OverlayTrigger
                                  placement="top"
                                  className="Tank-Detailss"
                                  overlay={
                                    <Tooltip
                                      style={{
                                        // width: "200px",
                                        zIndex: "111111111",
                                      }}
                                    >
                                      <div className="pointer">
                                        Operator Verified
                                      </div>
                                    </Tooltip>
                                  }
                                >
                                  <div>
                                    <span>
                                      <img
                                        src={require("../../../assets/images/SingleStatsCompetitor/wanna1.png")}
                                        alt="Competitor"
                                        width="20"
                                        className="mx-2"
                                        style={{ borderRadius: "50%" }}
                                      />
                                      {/* <i className="ph ph-user mx-2"></i> */}
                                    </span>
                                  </div>
                                </OverlayTrigger>
                              </div>
                            </td>

                            {/* // ** here i am iterating the Operator Verified prices */}
                            {competitor?.fuels?.ov?.map((fuel, fuelIndex) => (
                              <>
                                <td key={fuel?.id} className="middayModal-td">
                                  <input
                                    className={`table-input ${
                                      fuel?.canUpdate ? "" : "readonly"
                                    }`}
                                    type="number"
                                    readOnly={!fuel?.canUpdate}
                                    step="0.010"
                                    name={`listing.competitors.[${competitorIndex}].fuels.ov.[${fuelIndex}].price`}
                                    // listing.competitors[0].fuels.ov[0].category_name
                                    // value={fuel?.price ? fuel?.price : 0}
                                    value={
                                      formik.values.listing.competitors[
                                        competitorIndex
                                      ].fuels.ov[fuelIndex].price
                                    }
                                    onChange={formik.handleChange}
                                  />
                                  <div className="small text-muted text-end">
                                    {fuel?.last_updated !== "-" ? (
                                      <>Last Updated - {fuel?.last_updated} </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </td>
                              </>
                            ))}

                            <td className="middayModal-td">
                              {competitor?.canUpdate ? (
                                <>
                                  <button
                                    className="btn btn-primary me-2"
                                    type="submit"
                                    // onClick={formik.handleSubmit}
                                  >
                                    Submit{" "}
                                    <i class="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                  </button>
                                </>
                              ) : (
                                <>
                                  {competitor?.acceptedBy === "ov" ? (
                                    <>
                                      <button
                                        className="btn btn-primary me-2"
                                        type="submit"
                                        // onClick={formik.handleSubmit}
                                      >
                                        Submit{" "}
                                        <i class="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <i class="ph ph-x work-flow-danger-status "></i>
                                    </>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        </>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </TableContainer>
          ) : (
            <p>No Data...........</p>
          )}
        </DialogContent>
        {/* <Card.Footer>
          <div className="text-end notification-class">
            <button
              className="btn btn-danger me-2"
              type="submit"
              onClick={onClose}
            >
              Close
            </button>
            {hasListing ? (
              <button
                className="btn btn-primary me-2"
                type="submit"
                onClick={formik.handleSubmit}
              >
                Verify
              </button>
            ) : (
              ""
            )}
          </div>
        </Card.Footer> */}

        {userPermissions?.includes("fuel-suggestion-create") && data ? (
          <>
            <Card.Body>
              <CompetitorfuelpricesUpdate
                data={data}
                postData={postData}
                handleFormSubmit={handleFormSubmit}
                accordionSiteID={accordionSiteID}
              />
            </Card.Body>
          </>
        ) : (
          <div></div> // Optionally provide a fallback UI
        )}
      </Dialog>
    </>
  );
};

export default withApi(StaticCompiPrice);
