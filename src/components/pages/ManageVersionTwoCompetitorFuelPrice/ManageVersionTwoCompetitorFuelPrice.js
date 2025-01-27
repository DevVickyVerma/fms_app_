import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { useFormik } from "formik";
import { Collapse } from "antd";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import { useSelector } from "react-redux";
import CompetitorfuelpricesUpdate from "../../../components/pages/ManageFuelPrices/competitorfuelpricesUpdate";
import VersionTwoSuggestedFuelPrice from "./VersionTwoSuggestedFuelPrice";
import Swal from "sweetalert2";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const { Panel } = Collapse;

const ManageVersionTwoCompetitorFuelPrice = (props) => {
  const { getData, isLoading, postData, apidata } = props;
  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const [filterData, setFilterData] = useState(null);
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [accordionSiteID, setAccordionSiteID] = useState();

  const { handleError } = useErrorHandler();

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      // handleSubmit(values);
    },
  });

  const [data, setData] = useState(null);

  const handleSubmit1 = async (values) => {
    setSelectedDrsDate(values.start_date);
    setFilterData(values);
    try {
      let { client_id, company_id, site_id, start_date } = values;
      if (localStorage.getItem("superiorRole") === "Client") {
        client_id = localStorage.getItem("superiorId");
      }

      const queryParams = new URLSearchParams();
      if (client_id) queryParams.append("client_id", client_id);
      if (company_id) queryParams.append("company_id", company_id);
      if (site_id) queryParams.append("site_id", site_id);
      if (start_date) queryParams.append("drs_date", start_date);

      const queryString = queryParams.toString();

      // here setting the site_id
      setAccordionSiteID(site_id);
      // !NOTE it was previous URL
      // const response1 = await getData(`site/competitor-price?${queryString}`);

      const response = await getData(
        `site/competitor-suggestion/listing?${queryString}`
      );

      if (response && response.data && response.data.data) {
        setData(response.data.data);
        formik.setValues(response?.data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleDataFromChild = async (dataFromChild) => {
    try {
      if (storedData) {
        let updatedStoredData = JSON.parse(storedData);
        handleSubmit1(updatedStoredData);
      }
    } catch (error) {
      console.error("Error handling data from child:", error);
    }
  };

  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
    start_date: Yup.date()
      .required("Start Date is required")
      .min(
        new Date("2023-01-01"),
        "Start Date cannot be before January 1, 2023"
      ),
  });

  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        parsedData.start_date = currentDate;

        // Update the stored data with the new start_date
        localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        handleApplyFilters(parsedData);
      } else {
        handleApplyFilters(parsedData);
      }

      // Call the API with the updated or original data
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
          start_date: new Date().toISOString().split("T")[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName]); // Add any other dependencies needed here

  const handleApplyFilters = (values) => {
    if (values?.company_id && values?.start_date && values?.site_id) {
      handleSubmit1(values);
    }
  };

  const handleClearForm = async (resetForm) => {
    setData(null);
  };

  const handleSelectedPrice = async (competitor, index, key_name) => {
    // here i will pass onclick submit btn
    // 1.  selected row
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
            handleDataFromChild();
          } else {
            handleDataFromChild();
          }
        } catch (error) {
          handleError(error);
        } finally {
          // fetchData();
        }
      }
    });
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Competitor Fuel Price</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Competitor Fuel Price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Filter Data</h3>
              </Card.Header>

              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                lg="3"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={true}
                showDateValidation={true}
                showStationInput={true}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>

        <>
          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title">
                    {" "}
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <div>
                        <span>
                          Competitors - {filterData?.site_name} (
                          {`${filterData?.start_date}`}){" "}
                        </span>
                      </div>
                    </div>
                  </h3>
                </Card.Header>
                <Card.Body>
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
                                            <span
                                              style={{ zIndex: "111111111" }}
                                            >
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
                                            <span
                                              style={{ zIndex: "111111111" }}
                                            >
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
                                            alt="i"
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
                                                  {fuel?.last_updated !==
                                                  "-" ? (
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
                                              {competitor?.acceptedBy ===
                                              "gov" ? (
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
                                                  {fuel?.last_updated !==
                                                  "-" ? (
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
                                              {competitor?.acceptedBy ===
                                              "pp" ? (
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
                                                Submit{" "}
                                                <i className="ph ph-seal-check work-flow-gry-status c-top-3"></i>
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              {competitor?.acceptedBy ===
                                              "ov" ? (
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
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {userPermissions?.includes("fuel-suggestion-create") && data ? (
            <>
              <Row>
                <Col md={12} xl={12}>
                  <Card>
                    <Card.Header>
                      <h3 className="card-title">
                        {" "}
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div>
                            <span>
                              Fuel Selling Price Suggestion -{" "}
                              {filterData?.site_name} (
                              {`${filterData?.start_date}`}){" "}
                            </span>
                            <span
                              className="d-flex pt-1 align-items-center"
                              style={{ fontSize: "12px" }}
                            >
                              <span className="greenboxx me-2" />
                              <span className="text-muted">Current Price</span>
                            </span>
                          </div>
                        </div>
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      <CompetitorfuelpricesUpdate
                        data={data}
                        postData={postData}
                        handleFormSubmit={handleDataFromChild}
                        accordionSiteID={accordionSiteID}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div></div> // Optionally provide a fallback UI
          )}

          {data?.fuelSuggestions?.length > 0 ? (
            <>
              <VersionTwoSuggestedFuelPrice
                data={data}
                postData={postData}
                filterData={filterData}
                accordionSiteID={accordionSiteID}
              />
            </>
          ) : (
            <></>
          )}
        </>
      </>
    </>
  );
};

export default withApi(ManageVersionTwoCompetitorFuelPrice);
