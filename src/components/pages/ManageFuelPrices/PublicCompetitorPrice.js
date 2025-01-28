import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { SuccessAlert } from "../../../Utils/ToastUtils";
import useErrorHandler from "../../../components/CommonComponent/useErrorHandler";
import { useSelector } from "react-redux";
import { Collapse } from "antd";
import Swal from "sweetalert2";
import PublicCompetitorFuelPricesUpdate from "./PublicCompetitorFuelPricesUpdate";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FuelPriceTimeLineLogs from "../ManageVersionTwoCompetitorFuelPrice/FuelPriceTimeLineLogs";

const { Panel } = Collapse;

const PublicCompetitorPrice = ({
  open = true,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
  accordionSiteID,
}) => {
  const { handleError } = useErrorHandler();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const [data, setData] = useState(); // Initialize data as null

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [selectedItem, selectedDrsDate]);

  const formik = useFormik({
    initialValues: {},
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
      setIsLinkExpired(true);
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

  const fetchData = async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${baseUrl}/site/fuel-price/psuggestion/detail/${id}`
      );
      if (response && response.data && response.data.data) {
        setData(response.data.data);
        formik.setValues(response.data.data);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLinkExpired(true);
      setIsLoading(false);
      console.log(
        err.response ? err.response.data.message : "Error fetching clients"
      );
    }
  };

  const CallListingApi = async () => {
    fetchData();
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

          // await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

          // if (apidata?.api_response == 200) {
          //   fetchData();
          // } else {
          //   fetchData();
          // }
        } catch (error) {
          handleError(error);
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
        aria-labelledby="responsive-dialog-title  public-competitor-price-modal"
        className="public-competitor-price-modal dashboard-center-modal"
        maxWidth="900px"
      >
        {isSubmitted ? (
          <DialogContent>
            <div className="d-flex justify-content-center align-items-center my-3  gap-2">
              <div className="">
                <div className=" d-flex flex-column align-items-center">
                  <img
                    src={require("../../../assets/images/brand/logo.png")}
                    className="header-brand-img d-flex "
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className=" d-flex align-items-center justify-content-center flex-column h-80">
              <img
                src={require("../../../assets/images/thank-you.png")}
                className="all-center-flex nodata-image"
                alt="Success"
              />
              <h1 className=" d-flex mt-4 public-competitor-desc">
                Thanks For Your Authorization!
              </h1>
            </div>
          </DialogContent>
        ) : isLinkExpired ? (
          <DialogContent>
            <div className="d-flex justify-content-center align-items-center my-3  gap-2">
              <div className="">
                <div className=" d-flex flex-column align-items-center">
                  <img
                    src={require("../../../assets/images/brand/logo.png")}
                    className="header-brand-img d-flex "
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className=" d-flex align-items-center justify-content-center flex-column h-80">
              <img
                src={require("../../../assets/images/expire.png")}
                className="all-center-flex nodata-image"
                alt="Success"
              />
              <h1 className=" d-flex mt-4 public-competitor-desc">
                Uh-oh! It seems the link has expired. Please request a new one
                to continue.
              </h1>
            </div>
          </DialogContent>
        ) : (
          <>
            <DialogContent>
              {isLoading ? <Loaderimg /> : null}
              <>
                <div className="d-flex justify-content-between align-items-center mb-3 ms-sm-0   flex-column flex-sm-row">
                  <div>
                    <span className="ModalTitle-date"></span>
                  </div>
                  <div className="">
                    <div className=" d-flex flex-column align-items-center">
                      <img
                        src={require("../../../assets/images/brand/logo.png")}
                        className="header-brand-img d-flex "
                        alt=""
                      />
                      <div className="ModalTitle ModalTitle-date  mt-2 public-competitor-name-title">
                        {formik?.values?.site_name}
                      </div>
                    </div>
                  </div>
                  <div className=" text-end">
                    {/* Welcome, Mr. Jhon XYZX  */}
                  </div>
                </div>

                <Card.Header>
                  <h3 className="card-title">
                    {" "}
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <div>
                        <span>
                          Competitors - {data?.site_name}{" "}
                          {data?.currentDate ? (
                            <>( {`${data?.currentDate}`}) </>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    </div>
                  </h3>
                </Card.Header>

                {formik?.values?.listing?.competitors?.length > 0 ? (
                  <>
                    {formik?.values?.listing?.competitors?.map(
                      (competitor, competitorIndex) => (
                        <div key={competitorIndex} className="mt-2">
                          <Collapse
                            accordion
                            key={competitor?.competitor_name}
                            className={`${
                              competitor?.isMain == 1
                                ? "main-competitor-effect"
                                : ""
                            }`}
                          >
                            <Panel
                              header={
                                <div className="d-flex align-items-center">
                                  <img
                                    src={competitor?.supplier}
                                    alt="i"
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
                                              This competitor has been
                                              successfully updated.
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
                                            <Tooltip className="c-zindex-100000">
                                              Main Competitor
                                            </Tooltip>
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
                                    <th
                                      scope="col"
                                      style={{ maxWidth: "85px" }}
                                    >
                                      Competitor
                                    </th>

                                    {data?.fuel_head_array?.map(
                                      (header, columnIndex) => (
                                        <th scope="col" key={columnIndex}>
                                          {header?.name}
                                        </th>
                                      )
                                    )}
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
                                          alt="i"
                                          width="30"
                                          className="me-2"
                                        />
                                        {formik?.values?.site_name}
                                      </td>

                                      {formik?.values?.current?.[0]?.map(
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
                                              />
                                            </td>
                                          </>
                                        )
                                      )}
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
                                                alt="i"
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
                                                  fuel?.canUpdate
                                                    ? ""
                                                    : "readonly"
                                                }`}
                                                type="number"
                                                readOnly={!fuel?.canUpdate}
                                                step="0.010"
                                                name={`listing.competitors.[${competitorIndex}].fuels.gov.[${fuelIndex}].price`}
                                                value={
                                                  formik.values.listing
                                                    .competitors[
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
                                                alt="i"
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
                                                  fuel?.canUpdate
                                                    ? ""
                                                    : "readonly"
                                                }`}
                                                type="number"
                                                readOnly={!fuel?.canUpdate}
                                                step="0.010"
                                                name={`listing.competitors.[${competitorIndex}].fuels.pp.[${fuelIndex}].price`}
                                                value={
                                                  formik.values.listing
                                                    .competitors[
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
                                                  alt="i"
                                                  width="30"
                                                  className="mx-2"
                                                  style={{
                                                    borderRadius: "50%",
                                                  }}
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
                                                  fuel?.canUpdate
                                                    ? ""
                                                    : "readonly"
                                                }`}
                                                type="number"
                                                readOnly={!fuel?.canUpdate}
                                                step="0.010"
                                                name={`listing.competitors.[${competitorIndex}].fuels.ov.[${fuelIndex}].price`}
                                                value={
                                                  formik.values.listing
                                                    .competitors[
                                                    competitorIndex
                                                  ].fuels.ov[fuelIndex].price
                                                }
                                                onChange={formik.handleChange}
                                              />
                                              <div className="small text-muted text-end">
                                                {/* {fuel?.last_updated !==
                                                  "-" ? (
                                                    <>
                                                      Last Updated -{" "}
                                                      {fuel?.last_updated}{" "}
                                                    </>
                                                  ) : (
                                                    ""
                                                  )} */}
                                              </div>
                                            </td>
                                          </>
                                        )
                                      )}
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

                {data?.accept_suggestion?.length > 0 ? (
                  <div className="mt-7">
                    <>
                      <PublicCompetitorFuelPricesUpdate
                        data={data}
                        postData={""}
                        // handleFormSubmit={handleFormSubmit}
                        accordionSiteID={id}
                        setIsLinkExpired={setIsLinkExpired}
                        CallListingApi={CallListingApi}
                        setIsSubmitted={setIsSubmitted}
                      />
                    </>
                  </div>
                ) : (
                  <div></div> // Optionally provide a fallback UI
                )}

                <>
                  <Card.Header className="px-0">
                    <h3 className="card-title ">
                      {" "}
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <span>
                            Fuel Selling Price Suggestion For {data?.site_name}{" "}
                            ({data?.date}){" "}
                            <span className="d-flex pt-1 align-items-center c-fs-12">
                              <span className="greenboxx me-2"></span>
                              <span className="text-muted">Current Price</span>
                            </span>
                          </span>
                        </div>
                      </div>
                    </h3>
                  </Card.Header>

                  <FuelPriceTimeLineLogs data={data} />
                </>
              </>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PublicCompetitorPrice;
