import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import DashboardCompetitorGraph from "../../Dashboard/dashTopSection/DashboardCompetitorGraph";
import axios from "axios";
import { AiFillCaretDown, AiFillCaretRight, AiOutlineArrowRight } from "react-icons/ai";
import { BsFuelPumpFill } from "react-icons/bs";
import { Slide, toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const SingleStatsCompetitor = ({ isLoading, getData }) => {
  const [getCompetitorsPrice, setGetCompetitorsPrice] = useState(null);
  const [Compititorloading, setCompititorloading] = useState(false);
  const [ClientID, setClientID] = useState(localStorage.getItem("superiorId"));
  const { id } = useParams();
  // const [selected, setSelected] = useState([]);
  const [selected, setSelected] = useState();

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 500,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const Errornotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message.join(" ")
        : error.response?.data?.message;
      Errornotify(errorMessage);
    }
  }

  const FetchCompititorData = async () => {
    setCompititorloading(true);
    if (localStorage.getItem("Dashboardsitestats") === "true") {
      try {
        const searchdata = await JSON.parse(
          localStorage.getItem("mySearchData")
        );
        const superiorRole = localStorage.getItem("superiorRole");
        const role = localStorage.getItem("role");
        const localStoragecompanyId = localStorage.getItem("PresetCompanyID");
        let companyId = ""; // Define companyId outside the conditionals

        if (superiorRole === "Client" && role !== "Client") {
          // Set companyId based on conditions
          companyId =
            searchdata?.company_id !== undefined
              ? searchdata.company_id
              : localStoragecompanyId;
        } else {
          companyId =
            searchdata?.company_id !== undefined ? searchdata.company_id : "";
        }

        // Use async/await to fetch data
        const response3 = await axiosInstance.get(
          localStorage.getItem("superiorRole") !== "Client"
            ? `/dashboard/get-competitors-price?client_id=${searchdata?.client_id}&company_id=${companyId}&site_id=${id}`
            : `/dashboard/get-competitors-price?client_id=${ClientID}&company_id=${companyId}&site_id=${id}`
        );

        if (response3 && response3.data) {
          setGetCompetitorsPrice(response3?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } catch (error) {
        // Handle errors that occur during the asynchronous operations
        console.error("API error:", error);
        handleError(error);
      } finally {
        // Set Compititorloading to false when the request is complete (whether successful or not)
        setCompititorloading(false);
      }
    }
  };

  const handleClientStats = async () => {
    try {
      const response = await getData(
        `/client/sites`
      );


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
    return (<Row
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
          <Card.Body className="card-body pb-0 overflow-auto"> <img
            src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
            alt="MyChartImage"
            className="all-center-flex nodata-image"
          />
          </Card.Body>
        </Card>
      </Col>
    </Row>
    );
  }


  // const { dates, dataArray, fuelTypes, competitors } = getCompetitorsPrice;

  const data = getCompetitorsPrice?.competitorListing;
  const animatedComponents = makeAnimated();
  const Optionssingle = selected?.map(item => ({
    value: item?.id,
    label: item?.site_name
  }))
  const handleSitePathChange = (values) => {
    navigate(`/sitecompetitor/${values.value}`)
  }

  return (
    <>
      {Compititorloading ? <Loaderimg /> : null}
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


        <div className="ms-auto ">

          <label>
            Sort By Site:
          </label>
          <div style={{ width: "200px" }}>

            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              options={Optionssingle}
              onChange={(value) => handleSitePathChange(value)}
              // style={{ width: "400px" }}
              className="test"
            />
          </div>

        </div>


      </div>

      <Row
        style={{
          marginBottom: "10px",
          marginTop: "20px",
        }}

      >

        <Col lg={12} md={12} className="">
          <Card className="">
            <Card.Header className=" my-cardd card-header ">
              <h4 className="card-title">  {getCompetitorsPrice ? getCompetitorsPrice?.siteName : ""}{" "}
                Competitors Stats</h4>
            </Card.Header>
            <Card.Body className="my-cardd card-body pb-0 overflow-auto">
              <table className="w-100 my-6">
                <tbody>
                  <tr>
                    <th>
                      <span className="single-Competitor-heading cardd  d-flex justify-content-between w-99">
                        <span>
                          Competitors Name <AiFillCaretDown />
                        </span>
                        <span className="text-end">
                          Fuel <span className="hidden-in-small-screen"> Type
                          </span> <AiFillCaretRight />
                        </span>
                      </span>
                    </th>
                    {Object.keys(data).map((fuelType) => (
                      <th key={fuelType}>
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
                                <img src={competitorsName?.supplierImage} alt="supplierImage" className=" mx-3" style={{ width: "36px", height: "36px" }} />
                              </span>
                            </p>

                            <p className=" d-flex flex-column m-0" style={{ minWidth: "55px" }}>
                              <span className="single-Competitor-distance">
                                <AiOutlineArrowRight /> {competitorsName?.station ? "My station" : `${competitorsName?.dist_miles} miles away`}
                              </span>
                              <span>
                                {competitorsName?.name}
                              </span>
                            </p>
                          </div>
                        </td>
                        {Object.keys(data).map((fuelType, colIndex) => (
                          <td key={colIndex}>
                            <span className="single-Competitor-body single-Competitor-heading cardd block w-99.9 ">
                              <span>
                                <p className=" m-0 single-Competitor-distance"> {data[fuelType]?.[rowIndex]?.last_updated}</p>
                              </span>
                              <span className=" d-flex justify-content-between align-items-center">
                                <span >
                                  {data[fuelType]?.[rowIndex]?.price}
                                </span>

                                {data[fuelType]?.[rowIndex]?.station ? "" : <>
                                  <span className="" style={{ width: "25px", height: "25px", border: "1px solid black", borderRadius: "50%", background: "white", cursor: "pointer", marginLeft: "10px" }} >


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
                                          Experian Email

                                        </Tooltip>
                                      }
                                    >
                                      <img
                                        alt=""
                                        src={require("../../../assets/images/SingleStatsCompetitor/xpiera-logo.png")}
                                        className="" style={{
                                          // width: "px"
                                          objectFit: "contain"
                                        }}


                                      />
                                    </OverlayTrigger>

                                  </span>
                                </>}


                              </span>
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
      </Row >





      <Row
        Row
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
                <DashboardCompetitorGraph
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
