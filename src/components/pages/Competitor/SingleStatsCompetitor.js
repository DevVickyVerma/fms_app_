import { useEffect, useState } from 'react';
import { Breadcrumb, Card, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import axios from "axios";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { handleError } from "../../../Utils/ToastUtils";
import CompetitorSingleGraph from "./CompetitorSingleGraph";
import { Box, Typography } from "@mui/material";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik";
import moment from "moment";
import CompiMiddayModal from "./CompiMiddayModal";

const SingleStatsCompetitor = ({ getData }) => {
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const [Compititorloading, setCompititorloading] = useState(false);
  const { id } = useParams();
  const [selected, setSelected] = useState();
  const [mySelectedDate, setMySelectedDate] = useState(new Date()?.toISOString()?.split('T')[0]);
  const [showDate, setShowDate] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem,] = useState(null);
  const [selectedDrsDate, setSelectedDrsDate] = useState("");

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically set the initial date
    const initialDate = getInitialDate();
    setSelectedDrsDate(initialDate);
  }, []);

  // Function to get the initial date
  const getInitialDate = () => {
    // Calculate or fetch the initial date dynamically
    const today = new Date();
    return today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  };


  const FetchCompititorData = async (selectedValues) => {
    setCompititorloading(true);
    if (localStorage.getItem("Dashboardsitestats") === "true") {

      try {
        setShowDate(selectedValues?.start_date ? selectedValues?.start_date : mySelectedDate)
        // Use async/await to fetch data
        const response3 = await axiosInstance.get(
          selectedValues?.start_date
            ? `/site/competitor-price/stats?site_id=${id}&drs_date=${selectedValues?.start_date}`
            : `/site/competitor-price/stats?site_id=${id}&drs_date=${mySelectedDate}`
        );

        if (response3 && response3.data) {
          setGetCompetitorsPrice(response3?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        // Handle errors that occur during the asynchronous operations
        handleError(error);
      } finally {
        // Set Compititorloading to false when the request is complete (whether successful or not)
        setCompititorloading(false);
      }
    }
  };

  const handleClientStats = async () => {
    try {
      const response = await getData(`/client/sites`);

      const { data } = response;
      if (data) {
        setSelected(data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    } // Set the submission state to false after the API call is completed
  };
  useEffect(() => {
    FetchCompititorData();
    handleClientStats();
  }, [id]);
  if (Compititorloading) {
    return <Loaderimg />;
  }

  if (!getCompetitorsPrice) {
    return (
      <Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <Col lg={12} md={12}>
          <Card>
            <Card.Header className="card-header">
              <h4 className="card-title"> Local Competitor Stats</h4>
            </Card.Header>
            <Card.Body className="card-body pb-0 overflow-auto">
              {" "}
              <img
                src={require("../../../assets/images/commonimages/no_data.png")}
                alt="MyChartImage"
                className="all-center-flex nodata-image"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  const data = getCompetitorsPrice?.competitorListing;
  const animatedComponents = makeAnimated();
  const Optionssingle = selected?.map((item) => ({
    value: item?.id,
    label: item?.site_name,
  }));

  const handleSitePathChange = (values) => {
    navigate(`/sitecompetitor/${values.value}`);
  };

  const byDefaultSelectValue = {
    value: id,
    label: getCompetitorsPrice?.siteName,
  };

  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };

  const today = new Date(); // Current date
  const maxDate = new Date(today); // Set max date as current date
  maxDate.setDate(today.getDate()); // Set max date to yesterday
  const formattedMaxDate = maxDate.toISOString().split("T")[0]; // Format max date

  const minDate = new Date(today); // Set min date as current date
  minDate.setMonth(minDate.getMonth() - 2); // Set min date to 2 months ago
  const formattedMinDate = minDate.toISOString().split("T")[0]; // Format min date




  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleDataFromChild = async () => {
    try {
      // Assuming you have the 'values' object constructed from 'dataFromChild'


      // await handleSubmit1(values);
    } catch (error) {
      console.error("Error handling data from child:", error);
    }
  };







  return (
    <>
      {Compititorloading ? <Loaderimg /> : null}

      {modalOpen && (<>
        <CompiMiddayModal
          open={modalOpen}
          onClose={handleModalClose}
          selectedItem={selectedItem}
          selectedDrsDate={selectedDrsDate}
          setSelectedDrsDate={setSelectedDrsDate}
          onDataFromChild={handleDataFromChild}
          getCompetitorsPrice={getCompetitorsPrice}
        />
      </>)}



      <div className="page-header d-flex flex-wrap">
        <div>
          <h1 className="page-title ">
            {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
            Competitors{" "}
          </h1>
          <Breadcrumb className="breadcrumb breadcrumb-subheader">
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
              linkProps={{ to: "/competitorstats" }}
            >
              Competitor Stats
            </Breadcrumb.Item>

            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
              Competitors
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="ms-auto d-flex  gap-2 flex-wrap">
          <div>
            <label>Filter By Site:</label>
            <div style={{ width: "200px" }}>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={Optionssingle}
                onChange={(value) => handleSitePathChange(value)}
                className="test"
                value={byDefaultSelectValue}
              />
            </div>
          </div>

          <div>
            <Formik
              initialValues={{
                start_date: mySelectedDate || "",
              }}
              validationSchema={Yup.object().shape({
                start_date: Yup.date().required("Start Date is required"),
              })}
              onSubmit={(values) => {
                FetchCompititorData(values);
              }}
            >
              {({ handleSubmit, errors, touched, setFieldValue }) => (
                <Form
                  onSubmit={handleSubmit}
                  style={{
                    marginTop: "-11px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label htmlFor="start_date" className="form-label ">
                      Date
                    </label>
                    <Field
                      type="date"
                      min={formattedMinDate} // Use formattedMinDate for the min attribute
                      max={formattedMaxDate} // Use formattedMaxDate for the max attribute
                      onClick={handleShowDate}
                      className={`input101 compi-calender ${errors.start_date && touched.start_date
                        ? "is-invalid"
                        : ""
                        }`}
                      id="start_date"
                      name="start_date"
                      value={mySelectedDate}
                      onChange={(e) => {
                        const selectedstart_date = e.target.value;
                        setMySelectedDate(selectedstart_date);
                        setFieldValue("start_date", selectedstart_date);
                      }}
                    />
                    <ErrorMessage
                      component="div"
                      className="invalid-feedback"
                      name="start_date"
                    />
                  </div>
                  <div style={{ marginTop: "38px", alignSelf: "baseline" }}>
                    <button type="submit" className="btn btn-primary mx-2">
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <>
        <Box
          display={"flex"}
          gap={"5px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
          bgcolor={"#ffffff"}
          color={"black"}
          mb={"38px"}
          py={"20px"}
          px={"20px"}
          boxShadow="0px 10px 10px -5px rgba(0,0,0,0.5)"
        >
          <Box display={"flex"} alignItems={"center"}>
            <Box>
              {" "}
              {getCompetitorsPrice?.site_image ? (
                <img
                  src={getCompetitorsPrice?.site_image}
                  alt={getCompetitorsPrice?.site_image}
                  style={{ width: "50px", height: "50px" }}
                />
              ) : (
                <span className="Smallloader" />
              )}
            </Box>
            <Box>
              <Typography
                fontSize={"19px"}
                fontWeight={500}
                ml={"7px"}
                variant="body1"
              >
                {getCompetitorsPrice?.siteName
                  ? getCompetitorsPrice?.siteName
                  : ""}
              </Typography>
            </Box>
          </Box>

          {/* RIGHT side heading title */}
          <Box gap={"20px"} display={["contents", "flex"]}>
            {/* last day end competitor */}
            <Box display={"flex"} flexDirection={"column"} bgcolor={"#ecf0f1"}>
              <Box
                my={"4px"}
                color={"#2d3436"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                px={"13px"}
              >
                <Typography fontSize={"14px"}>
                  Last Day End : { }
                  {getCompetitorsPrice?.last_dayend ? (
                    moment(getCompetitorsPrice?.last_dayend).format("Do MMM")
                  ) : (
                    <span className="Smallloader" />
                  )}
                </Typography>
              </Box>

              <Box display={"flex"}>
                {/* Calendar Date With Updated OPening Time*/}
                <Box>
                  <Typography
                    height={"48px"}
                    width={"140px"}
                    position={"relative"}
                    bgcolor={"rgb(25 122 66)"}
                    textAlign={"center"}
                    py={"2px"}
                    color={"#dfe6e9"}
                    fontSize={"14px"}
                  >
                    {" "}
                    Opening Time
                    <Typography
                      height={"27px"}
                      width={"100%"}
                      bgcolor={"rgb(25 122 66)"}
                      position={"absolute"}
                      bottom={0}
                      color={"#dfe6e9"}
                      textAlign={"center"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"14px"}
                    >
                      {getCompetitorsPrice?.opening ? (
                        moment(getCompetitorsPrice?.opening).format(
                          "Do MMM, HH:mm"
                        )
                      ) : (
                        <span className="Smallloader" />
                      )}
                    </Typography>
                  </Typography>
                </Box>
                {/* Calendar Date With Updated Closing Time */}
                <Box>
                  <Typography
                    height={"48px"}
                    width={"140px"}
                    position={"relative"}
                    bgcolor={"#b52d2d"}
                    textAlign={"center"}
                    py={"2px"}
                    color={"#dfe6e9"}
                    fontSize={"14px"}
                  >
                    {" "}
                    Closing Time
                    <Typography
                      height={"27px"}
                      width={"100%"}
                      bgcolor={"#b52d2d"}
                      position={"absolute"}
                      bottom={0}
                      color={"#dfe6e9"}
                      textAlign={"center"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      fontSize={"14px"}
                    >
                      {getCompetitorsPrice?.closing ? (
                        moment(getCompetitorsPrice?.closing).format(
                          "Do MMM, HH:mm"
                        )
                      ) : (
                        <span className="Smallloader" />
                      )}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </>

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
                  {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
                  Competitors Stats   ({showDate})
                </h4>

                {/* {isFuelPriceUpdatePermissionAvailable && (<>
                  <Button className="btn btn-primary btn-icon text-white me-3"
                    onClick={() => handleFuelPriceLinkClick()}
                  // onClick={() => handleModalOpen()}
                  >
                    Update Fuel Price
                  </Button>
                </>)} */}
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
                          <span className="hidden-in-small-screen"> Type</span>{" "}
                          <AiFillCaretRight />
                        </span>
                      </span>
                    </th>
                    {Object?.keys(data)?.map((fuelType) => (
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
                          <div className="single-Competitor-heading d-flex w-99.9 cardd">
                            <p className=" m-0 d-flex align-items-center">
                              <span>
                                <img
                                  src={competitorsName?.supplierImage}
                                  alt="supplierImage"
                                  className=" mx-3"
                                  style={{ width: "36px", height: "36px" }}
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
                              </span>
                            </p>
                          </div>
                        </td>
                        {Object.keys(data).map((fuelType, colIndex) => (
                          <td key={colIndex}>
                            <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">


                              {data[fuelType]?.[rowIndex]?.price === '-' ? <>
                                <div className='compidash-container'>-</div>
                              </> : <>
                                <span className="circle-info">
                                  {data[fuelType]?.[rowIndex]?.last_updated}
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
                                          {data[fuelType]?.[rowIndex]?.last_date}
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
                                  <span>{data[fuelType]?.[rowIndex]?.price}</span>

                                  <span>

                                    {data[fuelType]?.[rowIndex]?.station ? (
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
                                              display: "flex"
                                            }}
                                          >
                                            <OverlayTrigger
                                              placement="top"
                                              overlay={
                                                <Tooltip
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    justifyContent: "flex-start",
                                                  }}
                                                >
                                                  <span>{data?.[fuelType]?.[rowIndex]?.logo_tip}</span>
                                                </Tooltip>
                                              }
                                            >
                                              <img
                                                alt=""
                                                src={data?.[fuelType]?.[rowIndex]?.logo}
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
                              </>}

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

      <Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}
      >
        <Col lg={12} md={12}>
          <Card>
            <Card.Header className="card-header">
              <h4 className="card-title"> Local Competitor Stats</h4>


            </Card.Header>
            <Card.Body className="card-body pb-0">
              <div id="chart">
                <CompetitorSingleGraph
                  getCompetitorsPrice={getCompetitorsPrice}
                  setGetCompetitorsPrice={setGetCompetitorsPrice}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SingleStatsCompetitor;
