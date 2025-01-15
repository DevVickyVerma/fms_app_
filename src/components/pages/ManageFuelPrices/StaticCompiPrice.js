import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
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
import { Collapse } from "antd";
import Swal from "sweetalert2";
const { Panel } = Collapse;

const StaticCompiPrice = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
  accordionSiteID,
  getData,
  postData,
  apidata,
  isLoading,
}) => {
  const { handleError } = useErrorHandler();

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const [data, setData] = useState(); // Initialize data as null

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [selectedItem, selectedDrsDate]);

  const fetchData = async () => {
    if (selectedItem && selectedDrsDate) {
      try {
        const response = await getData(
          `/site/competitor-suggestion/listing?site_id=${accordionSiteID}&drs_date=${selectedDrsDate}`
        );

        if (response && response.data && response.data.data) {
          setData(response.data.data);
          formik.setValues(response?.data?.data);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
      }
    }
  };

  const formik = useFormik({
    initialValues: staticCompiPriceCommon,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
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
        navigate("/competitor-fuel-price-v2");
        onClose();
      } else {
        // Handle other cases or errors here
      }
    } catch (error) {
      handleError(error);
    } finally {
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

  const handleSelectedPrice = async (competitor, index, key_name) => {
    // here i will pass onclick submit btn
    // 1.  selected
    // 2. index which is selected
    // 3. key_name which is selected
    // console.log(competitor, "competitor", index, "fuel", key_name);

    let messageKey = key_name;

    if (messageKey === "gov") {
      messageKey = "Gov.uk";
    } else if (messageKey === "pp") {
      messageKey = "Petrol Price";
    } else if (messageKey === "ov") {
      messageKey = "Operator Verified";
    }

    Swal.fire({
      title: "Are you sure?",
      html: `You are about to update the price for the competitor <strong>"${competitor?.competitor_name}"</strong> in the service category <strong>"${messageKey}"</strong>.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Observe it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result?.isConfirmed) {
        try {
          const formData = new FormData();

          formData.append("site_id", accordionSiteID);
          formData.append("competitor_id", competitor?.id);
          formData.append("drs_date", selectedDrsDate);
          formData.append("updated_from", key_name);

          competitor?.fuels?.[key_name].forEach((fuel) => {
            if (fuel?.price == "-") {
              formData.append(`fuels[${fuel?.id}]`, 0);
            } else {
              formData.append(`fuels[${fuel?.id}]`, fuel?.price);
            }
          });

          const postDataUrl = "/site/competitor-suggestion/accept";

          await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

          if (apidata?.api_response == 200) {
            fetchData();
          } else {
            handleError(error);
            fetchData();
          }
        } catch (error) {
        } finally {
          fetchData();
        }
      }
    });
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="100px"
      >
        <span className="ModalTitle d-flex w-100 justify-content-between">
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
          <>
            {formik?.values?.listing?.competitors?.length > 0 ? (
              <>
                {formik?.values?.listing?.competitors?.map(
                  (competitor, competitorIndex) => (
                    <div key={competitorIndex} className="mt-2">
                      <Collapse accordion key={competitor?.competitor_name}>
                        <Panel
                          header={
                            <div className="d-flex align-items-center">
                              <img
                                src={competitor?.supplier}
                                alt="Competitor"
                                width="30"
                                className="me-2 object-fit-contain"
                              />
                              <span className=" fw-600">
                                {" "}
                                {competitor?.competitor_name}
                              </span>
                              <span className=" fw-600">
                                {" "}
                                {competitor?.canUpdate ? (
                                  <>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip
                                          style={{ zIndex: "111111111" }}
                                        >
                                          This competitor still requires
                                          updates.
                                        </Tooltip>
                                      }
                                    >
                                      <span style={{ zIndex: "111111111" }}>
                                        <i className="ph ph-hourglass-medium c-top-3 mx-1"></i>
                                      </span>
                                    </OverlayTrigger>
                                  </>
                                ) : (
                                  <>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip
                                          style={{ zIndex: "111111111" }}
                                        >
                                          This competitor has been successfully
                                          updated.
                                        </Tooltip>
                                      }
                                    >
                                      <span style={{ zIndex: "111111111" }}>
                                        <i className="ph ph-seal-check work-flow-sucess-status c-top-3 mx-1"></i>
                                      </span>
                                    </OverlayTrigger>
                                  </>
                                )}
                              </span>
                              <span className=" fw-600">
                                {" "}
                                {competitor?.isMain == 1 ? (
                                  <>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>Main Competitor</Tooltip>
                                      }
                                    >
                                      <span className="  p-1">
                                        <i className="ph ph-target c-top-3  work-flow-sucess-status"></i>
                                      </span>
                                    </OverlayTrigger>
                                  </>
                                ) : null}
                              </span>
                            </div>
                          }
                        >
                          <table className="table">
                            <thead className="">
                              <tr>
                                <th scope="col" style={{ maxWidth: "85px" }}>
                                  Competitor
                                </th>

                                {data?.head_array?.map(
                                  (header, columnIndex) => (
                                    <th scope="col" key={columnIndex}>
                                      {header}
                                    </th>
                                  )
                                )}
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <>
                                <tr
                                  key={`competitor-name-self`}
                                  className="operator-tr"
                                >
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
                                            <div className="pointer">
                                              Gov.uk
                                            </div>
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
                                  {competitor?.fuels?.gov?.map(
                                    (fuel, fuelIndex) => (
                                      <>
                                        <td
                                          key={fuel?.id}
                                          className="middayModal-td"
                                        >
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
                                              <>
                                                Last Updated -{" "}
                                                {fuel?.last_updated}{" "}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </td>
                                      </>
                                    )
                                  )}

                                  <td className="middayModal-td">
                                    {competitor?.canUpdate ? (
                                      <>
                                        <button
                                          className="btn btn-primary me-2"
                                          type="submit"
                                          onClick={() =>
                                            handleSelectedPrice(
                                              competitor,
                                              competitorIndex,
                                              "gov"
                                            )
                                          }
                                        >
                                          Observe{" "}
                                          <i className="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {competitor?.acceptedBy === "gov" ? (
                                          <>
                                            <i className="ph ph-seal-check work-flow-sucess-status c-top-3"></i>
                                          </>
                                        ) : (
                                          <>
                                            <i className="ph ph-x work-flow-danger-status "></i>
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
                                  {competitor?.fuels?.pp?.map(
                                    (fuel, fuelIndex) => (
                                      <>
                                        <td
                                          key={fuel?.id}
                                          className="middayModal-td"
                                        >
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
                                              <>
                                                Last Updated -{" "}
                                                {fuel?.last_updated}{" "}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </td>
                                      </>
                                    )
                                  )}

                                  <td className="middayModal-td">
                                    {competitor?.canUpdate ? (
                                      <>
                                        <button
                                          className="btn btn-primary me-2"
                                          type="submit"
                                          onClick={() =>
                                            handleSelectedPrice(
                                              competitor,
                                              competitorIndex,
                                              "pp"
                                            )
                                          }
                                        >
                                          Observe{" "}
                                          <i className="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {competitor?.acceptedBy === "pp" ? (
                                          <>
                                            <i className="ph ph-seal-check work-flow-sucess-status c-top-3"></i>
                                          </>
                                        ) : (
                                          <>
                                            <i className="ph ph-x work-flow-danger-status "></i>
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
                                              width="30"
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
                                  {competitor?.fuels?.ov?.map(
                                    (fuel, fuelIndex) => (
                                      <>
                                        <td
                                          key={fuel?.id}
                                          className="middayModal-td"
                                        >
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
                                              <>
                                                Last Updated -{" "}
                                                {fuel?.last_updated}{" "}
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </td>
                                      </>
                                    )
                                  )}

                                  <td className="middayModal-td">
                                    {competitor?.canUpdate ? (
                                      <>
                                        <button
                                          className="btn btn-primary me-2"
                                          type="submit"
                                          onClick={() =>
                                            handleSelectedPrice(
                                              competitor,
                                              competitorIndex,
                                              "ov"
                                            )
                                          }
                                        >
                                          Observe{" "}
                                          <i className="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {competitor?.acceptedBy === "ov" ? (
                                          <>
                                            <i className="ph ph-seal-check work-flow-sucess-status c-top-3"></i>
                                          </>
                                        ) : (
                                          <>
                                            <i className="ph ph-x work-flow-danger-status "></i>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </td>
                                </tr>
                              </>
                            </tbody>
                          </table>
                        </Panel>
                      </Collapse>
                    </div>
                  )
                )}
              </>
            ) : (
              <>
                <>
                  <img
                    src={require("../../../assets/images/commonimages/no_data.png")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </>
              </>
            )}
          </>
        </DialogContent>

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
