import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";
import MiddayFuelPrice from "./MiddayFuelPrice";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const UpdateFuelPrices = (props) => {
  const { handleError } = useErrorHandler();
  const { getData, isLoading, postData } = props;
  const [showError, setShowError] = useState();
  const [showDate, setSetDate] = useState();
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const navigate = useNavigate();
  const reduxData = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const iscompititorStatsPermissionAvailable =
    reduxData?.includes("competitor-stats");
  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const { id: paramSite_id } = useParams();
  const [MiddayFuelPriceData, setMiddayFuelPriceData] = useState();

  const GetCompititor = async (filters) => {
    let { client_id, start_date } = filters;

    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
    }

    if (client_id) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("site_id", paramSite_id);
        if (start_date) queryParams.append("drs_date", start_date);

        const queryString = queryParams.toString();
        const response = await getData(
          `site/competitor-price/stats?${queryString}`
        );
        if (response && response.data && response.data.data) {
          setGetCompetitorsPrice(response?.data?.data);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const SiteFilterSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("start_date", values.start_date);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);

      let { start_date, site_id } = values;

      const queryParams = new URLSearchParams();
      if (site_id) queryParams.append("site_id", site_id);
      if (start_date) queryParams.append("drs_date", start_date);
      const queryString = queryParams.toString();
      const response1 = await getData(`site/fuel-price/mid-day?${queryString}`);

      const { data } = response1;

      if (data?.data) {
        setMiddayFuelPriceData(data);
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    }
  };

  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    start_date: Yup.date()
      .required("Date is required")
      .min(new Date("2023-01-01"), "Date cannot be before January 1, 2023"),
  });

  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let updatedStoredData = JSON.parse(storedData);
      updatedStoredData.site_id = paramSite_id; // Update the site_id here
      localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));
      handleApplyFilters(updatedStoredData);
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
        };
        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName, paramSite_id]);

  const handleApplyFilters = (values) => {
    navigate(`/update-fuel-price/${values?.site_id}`);
    if (values?.start_date) {
      setSetDate(values?.start_date);
      SiteFilterSubmit(values);
      if (iscompititorStatsPermissionAvailable) {
        GetCompititor(values);
      }
    }
  };

  const handleFormSubmit = () => {
    if (storedData) {
      let updatedStoredData = JSON.parse(storedData);
      updatedStoredData.site_id = paramSite_id; // Update the site_id here
      localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));
      handleApplyFilters(updatedStoredData);
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
        };
        handleApplyFilters(futurepriceLog);
      }
    }
  };

  const myRef = useRef(); // This is valid inside functional components

  useEffect(() => {
    if (showError && myRef?.current) {
      myRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showError]);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <div className="overflow-container">
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Fuel Selling Price</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>

              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/fuelprice" }}
              >
                Fuel Price
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Fuel Selling Price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Filter </h3>
              </Card.Header>
              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                lg="4"
                showClientInput={false}
                showEntityInput={false}
                showDateInput={true}
                showStationValidation={true}
                showMonthInput={false}
                showStationInput={true}
                showResetBtn={false}
              />
            </Card>
          </Col>
        </Row>

        {showError && (
          <>
            <div className=" " ref={myRef}>
              <div
                className="p-2 my-2 d-flex justify-content-between w-100 px-3"
                style={{ background: "#e74c3c", color: "#fff" }}
              >
                <span>{showError}</span>
                <span onClick={() => setShowError(null)}>
                  <i className="fa fa-times fs-4 pointer" aria-hidden="true" />
                </span>
              </div>
            </div>
          </>
        )}

        {MiddayFuelPriceData?.data ? (
          <MiddayFuelPrice
            data={MiddayFuelPriceData?.data}
            postData={postData}
            handleFormSubmit={handleFormSubmit}
            showError={showError}
            setShowError={setShowError}
          />
        ) : (
          <div>Loading...</div> // Optionally provide a fallback UI
        )}

        {getCompetitorsPrice && (
          <>
            <Row
              style={{
                marginBottom: "10px",
                marginTop: "20px",
              }}
            >
              <Col lg={12} md={12} className="">
                <Card className="">
                  <Card.Header className=" my-cardd card-header ">
                    <div className=" d-flex w-100 justify-content-between align-items-center  card-title w-100 ">
                      <h4 className="card-title">
                        {" "}
                        {getCompetitorsPrice
                          ? getCompetitorsPrice?.siteName
                          : ""}{" "}
                        Competitors Stats ({showDate})
                      </h4>
                    </div>
                  </Card.Header>
                  <Card.Body className="my-cardd card-body pb-0 overflow-auto">
                    <table className="w-100 mb-6">
                      <tbody>
                        <tr>
                          <th className="font-500">
                            <span className="single-Competitor-heading cardd  d-flex justify-content-between w-99">
                              <span>
                                Competitors Name <AiFillCaretDown />
                              </span>
                              <span className="text-end">
                                Fuel{" "}
                                <span className="hidden-in-small-screen">
                                  {" "}
                                  Type
                                </span>{" "}
                                <AiFillCaretRight />
                              </span>
                            </span>
                          </th>
                          {Object?.keys(
                            getCompetitorsPrice?.competitorListing
                          )?.map((fuelType) => (
                            <th key={fuelType} className="font-500">
                              <span className="single-Competitor-heading cardd block w-99 ">
                                <BsFuelPumpFill /> {fuelType}
                              </span>
                            </th>
                          ))}
                        </tr>
                        {getCompetitorsPrice?.competitors?.map(
                          (competitorsName, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>
                                <div
                                  className={`single-Competitor-heading d-flex w-99.9 cardd  ${
                                    competitorsName?.isMain == 1
                                      ? "main-competitor-effect"
                                      : ""
                                  }`}
                                >
                                  <p className=" m-0 d-flex align-items-center">
                                    <span>
                                      <img
                                        src={competitorsName?.supplierImage}
                                        alt="supplierImage"
                                        className=" mx-3"
                                        style={{
                                          width: "36px",
                                          height: "36px",
                                        }}
                                      />
                                    </span>
                                  </p>

                                  <p
                                    className=" d-flex flex-column m-0"
                                    style={{ minWidth: "55px" }}
                                  >
                                    <span className="single-Competitor-distance">
                                      <AiOutlineArrowRight />{" "}
                                      {competitorsName?.station
                                        ? "My station"
                                        : `${competitorsName?.dist_miles} miles away`}
                                    </span>
                                    <span style={{ minWidth: "200px" }}>
                                      {competitorsName?.name}
                                      <span className=" fw-600">
                                        {" "}
                                        {competitorsName?.isMain == 1 ? (
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
                                    </span>
                                  </p>
                                </div>
                              </td>
                              {Object.keys(
                                getCompetitorsPrice?.competitorListing
                              ).map((fuelType, colIndex) => (
                                <td key={colIndex}>
                                  <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                                    {getCompetitorsPrice?.competitorListing?.[
                                      fuelType
                                    ]?.[rowIndex]?.price === "-" ? (
                                      <>
                                        <div className="compidash-container">
                                          -
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <span className="circle-info">
                                          {
                                            getCompetitorsPrice
                                              ?.competitorListing?.[fuelType]?.[
                                              rowIndex
                                            ]?.last_updated
                                          }
                                          <span>
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={
                                                <Tooltip
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    justifyContent:
                                                      "flex-start",
                                                    width: "300px", // Set your desired width here
                                                  }}
                                                >
                                                  {
                                                    getCompetitorsPrice
                                                      ?.competitorListing?.[
                                                      fuelType
                                                    ]?.[rowIndex]?.last_date
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
                                              getCompetitorsPrice
                                                ?.competitorListing?.[
                                                fuelType
                                              ]?.[rowIndex]?.price
                                            }
                                          </span>

                                          <span>
                                            {getCompetitorsPrice
                                              ?.competitorListing?.[fuelType]?.[
                                              rowIndex
                                            ]?.station ? (
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
                                                            alignItems:
                                                              "flex-start",
                                                            justifyContent:
                                                              "flex-start",
                                                          }}
                                                        >
                                                          <span>
                                                            {
                                                              getCompetitorsPrice
                                                                ?.competitorListing?.[
                                                                fuelType
                                                              ]?.[rowIndex]
                                                                ?.logo_tip
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
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default withApi(UpdateFuelPrices);
