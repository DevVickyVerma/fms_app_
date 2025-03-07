import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Form,
  FormGroup,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import * as Yup from "yup";
import withApi from "../../../Utils/ApiHelper";
import { useParams } from "react-router-dom";
import { BsFillFuelPumpFill } from "react-icons/bs";
import Loaderimg from "../../../Utils/Loader";
import { MdOutlineCalendarMonth } from "react-icons/md";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { subMonths, startOfMonth } from "date-fns";
import SortIcon from "@mui/icons-material/Sort";
import { ErrorMessage, Field, Formik } from "formik";
import { useMyContext } from "../../../Utils/MyContext";
import { SuccessAlert } from "../../../Utils/ToastUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import MOPStackedBarChart from "../CeoDashboardModal/MOPStackedBarChart";
import NoDataComponent from "../../../Utils/commonFunctions/NoDataComponent";

const DashSubChildGrads = ({ getData, getSiteStats }) => {
  const { getGradsSiteDetails, setGradsGetSiteDetails, DashboardGradsLoading } =
    useMyContext();
  const [gradsLoading, setGradsLoading] = useState(false);
  const [gridIndex, setGridIndex] = useState(0);
  const { id } = useParams();
  const [showDate, setShowDate] = useState(false);
  const [startDatePath, setStartDatePath] = useState("");
  const [endDatePath, setEndDatePath] = useState("");
  const [ModalButtonName, setModalButtonName] = useState(false);
  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };

  const handleShowDate1 = () => {
    const inputDateElement = document.querySelector("#end_date");
    inputDateElement.showPicker();
  };

  const handleGradsClick = (index) => {
    setGridIndex(index);
  };

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const [state, setState] = useState([
    {
      startDate: getSiteStats?.data?.last_dayend
        ? new Date(getSiteStats.data.last_dayend)
        : new Date(), // 1st day of the current month
      // startDate: startOfMonth(new Date()), // 1st day of the current month
      endDate: getSiteStats?.data?.last_dayend
        ? new Date(getSiteStats.data.last_dayend)
        : new Date(), // Today's date
      key: "selection",
    },
  ]);

  const minDate = startOfMonth(subMonths(new Date(), 1)); // 1st day of the previous month
  // const maxDate = new Date(); // Today's date
  const maxDate = getSiteStats?.data?.last_dayend
    ? new Date(getSiteStats.data.last_dayend)
    : new Date();
  const handleSelect = (ranges) => {
    // Ensure that the selected range is within the allowed bounds
    if (
      ranges.selection.startDate >= minDate &&
      ranges.selection.endDate <= maxDate
    ) {
      setState([ranges.selection]);
    }
  };
  var startDate = format(state[0].startDate, "yyyy-MM-dd"); // Format start date
  var endDate = format(state[0].endDate, "yyyy-MM-dd"); // Format end date

  const isButtonDisabled = !startDate || !endDate;

  const fetchData = async () => {
    if (!userPermissions?.includes("ceodashboard-site-stats")) {
      return; // Exit early if the user doesn't have permission
    }

    setGradsLoading(true);

    if (userPermissions?.includes("ceodashboard-site-stats")) {
    }
    try {
      if (localStorage.getItem("Dashboardsitestats") === "true") {
        try {
          // Attempt to parse JSON data from local storage

          // Use async/await to fetch data
          const response3 = await getData(
            localStorage.getItem("superiorRole") !== "Client"
              ? `/ceo-dashboard/get-site-fuel-performance?site_id=${id}&end_date=${endDate}&start_date=${startDate}`
              : `/ceo-dashboard/get-site-fuel-performance?site_id=${id}&end_date=${endDate}&start_date=${startDate}`
          );
          setStartDatePath(startDate);
          setEndDatePath(endDate);
          if (response3 && response3.data) {
            setGradsGetSiteDetails(response3?.data?.data);
            SuccessAlert(response3?.data?.message);
            setShowModal(false);
            setModalButtonName(false);
            setShowDate(true);
          } else {
            throw new Error("No data available in the response");
          }
          setGradsLoading(false);
        } catch (error) {
          // Handle errors that occur during the asynchronous operations
          setGradsLoading(false);
        }
      }
    } catch (error) {
      setGradsLoading(false);
    }
    setGradsLoading(false);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update windowWidth when the window is resized
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
    return `${year}-${month}-${day}`;
  };

  function getFirstDayOfPreviousMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const year = lastMonth.getFullYear();
    const month = (lastMonth.getMonth() + 1).toString().padStart(2, "0");
    const day = "01";
    return `${year}-${month}-${day}`;
  }

  const ResetForm = async () => {
    if (!userPermissions?.includes("ceodashboard-site-stats")) {
      return; // Exit early if the user doesn't have permission
    }

    setGradsLoading(true);
    try {
      if (localStorage.getItem("Dashboardsitestats") === "true") {
        try {
          // Use async/await to fetch data
          const response3 = await getData(
            localStorage.getItem("superiorRole") !== "Client"
              ? `/ceo-dashboard/get-site-fuel-performance?site_id=${id}`
              : `/ceo-dashboard/get-site-fuel-performance?site_id=${id}`
          );
          setStartDatePath(startDate);
          setEndDatePath(endDate);
          if (response3 && response3.data) {
            setGradsGetSiteDetails(response3?.data?.data);
            SuccessAlert(response3?.data?.message);
            setShowModal(false);
            setModalButtonName(true);

            setShowDate(true);
          } else {
            throw new Error("No data available in the response");
          }
          setGradsLoading(false);
        } catch (error) {
          // Handle errors that occur during the asynchronous operations
          setGradsLoading(false);
        }
      }
    } catch (error) {
      setGradsLoading(false);
    }
    setGradsLoading(false);
  };

  return (
    <>
      {gradsLoading ? <Loaderimg /> : ""}

      {/* Grads with bootstrap */}
      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between flex-wrap">
              <h3 className="card-title">Grades Analysis</h3>

              {getSiteStats?.data ? (
                <div className=" mt-2 mt-sm-0">
                  <button className="btn btn-primary" onClick={handleOpenModal}>
                    {" "}
                    <MdOutlineCalendarMonth />{" "}
                    {showDate && getSiteStats?.data && !ModalButtonName
                      ? `${moment(startDatePath).format("Do MMM")} - ${moment(
                          endDatePath
                        ).format("Do MMM")}`
                      : moment(getSiteStats?.data?.last_dayend).format(
                          "MMM Do"
                        )}
                    <SortIcon />{" "}
                  </button>
                  {showDate && getSiteStats?.data && !ModalButtonName ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Reset Filter</Tooltip>}
                    >
                      <button
                        className="btn btn-danger  ms-2"
                        onClick={() => {
                          ResetForm();
                        }}
                      >
                        <i className="ph ph-arrow-clockwise"></i>
                      </button>
                    </OverlayTrigger>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
                // <span className="Smallloader"></span>
              )}
            </Card.Header>

            {/* <span className="Smallloader"></span> */}

            {DashboardGradsLoading ? (
              <>
                <p className="all-center-flex" style={{ height: "150px" }}>
                  <span className="primary-loader"></span>
                </p>
              </>
            ) : (
              <>
                <Card.Body>
                  <Row>
                    <Col lg={4} md={4} xl={4} sm={4}>
                      <Card.Header>
                        <h3 className="card-title">Grades</h3>
                      </Card.Header>
                      <Card.Body>
                        <Row
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {getGradsSiteDetails?.map((fuelState, index) => (
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                              onClick={() => handleGradsClick(index)}
                              style={{
                                border:
                                  gridIndex === index
                                    ? "1px dashed #b3b3b3"
                                    : "",
                                cursor: "pointer",
                                fontWeight: gridIndex === index ? 700 : "",
                                background:
                                  gridIndex === index
                                    ? "rgba(182, 185, 198, 0.5098039216)"
                                    : "",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                }}
                              >
                                <BsFillFuelPumpFill />
                                {fuelState?.fuel}
                              </span>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Col>

                    <>
                      <Col lg={4} md={4} xl={4} sm={4}>
                        <Card.Header>
                          <h3 className="card-title">Key Metrics (Inc VAT)</h3>
                        </Card.Header>
                        <Card.Body>
                          <Row
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* total Transaction */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                }}
                              >
                                <strong style={{ fontWeight: 700 }}>
                                  {" "}
                                  Total Transaction :
                                </strong>
                                {
                                  getGradsSiteDetails?.[gridIndex]
                                    ?.total_transaction
                                }
                              </span>
                            </Col>

                            {/* 2nd Total fuel value */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                }}
                              >
                                <strong style={{ fontWeight: 700 }}>
                                  {" "}
                                  Total Fuel Volume :{" "}
                                  <span className="l-sign fw-normal">
                                    {
                                      getGradsSiteDetails?.[gridIndex]
                                        ?.fuel_volume
                                    }
                                  </span>
                                </strong>
                              </span>
                            </Col>
                            {/* Total Fuel Sales */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                }}
                              >
                                <strong style={{ fontWeight: 700 }}>
                                  {" "}
                                  Total Fuel Sales :
                                </strong>
                                {getGradsSiteDetails?.[gridIndex]?.fuel_value}
                              </span>
                            </Col>

                            {/* Gross Margin */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                }}
                              >
                                <strong style={{ fontWeight: 700 }}>
                                  {" "}
                                  Gross Margin :
                                </strong>
                                {getGradsSiteDetails?.[gridIndex]?.gross_margin}
                              </span>
                            </Col>

                            {/* Gross Profit */}
                            <Col
                              lg={12}
                              md={12}
                              className="dashboardSubChildCard my-4"
                              borderRadius={"5px"}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                }}
                              >
                                <strong style={{ fontWeight: 700 }}>
                                  {" "}
                                  Gross Profit :
                                </strong>
                                {getGradsSiteDetails?.[gridIndex]?.gross_profit}
                              </span>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Col>

                      {/* 3rd column */}
                      <Col lg={4} md={4} xl={4} sm={4}>
                        <Card.Header>
                          <h3 className="card-title">Payments</h3>
                        </Card.Header>

                        <Card.Body
                          style={{ maxHeight: "467px", overflowY: "auto" }}
                        >
                          <Row
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {getGradsSiteDetails?.[gridIndex]?.cards?.map(
                              (cardDetail) => (
                                <Col
                                  lg={12}
                                  md={12}
                                  className=" my-4"
                                  borderRadius={"5px"}
                                  style={{
                                    background: "#f2f2f8",
                                    padding: "6px 20px",
                                    color: "black",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <p
                                    style={{
                                      display: "flex",
                                      gap: "5px",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <span
                                      style={{
                                        display: "flex",
                                        flex: 1,
                                        gap: "5px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      {cardDetail?.image && (
                                        <img
                                          src={cardDetail.image}
                                          alt={
                                            cardDetail.card_name ||
                                            "Card Image Alt Text"
                                          }
                                          style={{
                                            width: "60px",
                                            height: "40px",
                                            background: "#FFF",
                                            padding: "5px",
                                            borderRadius: "8px",
                                          }}
                                        />
                                      )}
                                    </span>
                                    <span style={{ flex: 1, display: "flex" }}>
                                      {" "}
                                      {cardDetail?.card_name || "Unknown"}
                                    </span>
                                    <span style={{ flex: 1, display: "flex" }}>
                                      {cardDetail?.total_fuel_sale_value}
                                    </span>

                                    <span style={{ display: "flex" }}>
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
                                            {" "}
                                            Total Transactions :{" "}
                                            {cardDetail?.total_transactions}
                                            <br />
                                            Total Fuel Sale :{" "}
                                            {cardDetail?.total_fuel_sale_value}
                                            <br />
                                            Total Fuel Volume :{" "}
                                            <span className="l-sign fw-normal">
                                              {" "}
                                              {
                                                cardDetail?.total_fuel_sale_volume
                                              }
                                            </span>
                                          </Tooltip>
                                        }
                                      >
                                        <i
                                          className="fa fa-info-circle"
                                          aria-hidden="true"
                                          style={{ fontSize: "20px" }}
                                        ></i>
                                      </OverlayTrigger>
                                    </span>
                                  </p>
                                </Col>
                              )
                            )}
                          </Row>
                        </Card.Body>
                      </Col>
                    </>

                    {/* <>
                      {getSiteStats ? (
                        <Card className="h-100">
                          <Card.Header className="p-4">
                            <h4 className="card-title">Fuel Card Stats</h4>
                          </Card.Header>
                          <Card.Body
                          //  className=" d-flex justify-content-center align-items-center w-100"
                          >
                            <MOPStackedBarChart
                            // dashboardData={apiData?.data}
                            // Mopstatsloading={loading}
                            />
                          </Card.Body>
                        </Card>
                      ) : (
                        <>
                          <Col lg={12}>
                            <NoDataComponent title={"Fuel Card Stats"} />
                          </Col>
                        </>
                      )}
                    </> */}
                  </Row>
                </Card.Body>
              </>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="custom-modal-width custom-modal-height big-modal "
      >
        <div className="modal-header">
          <span className="ModalTitle d-flex justify-content-between w-100 p-0  fw-normal">
            <span>Grades Date wise Reports</span>
            <span onClick={handleCloseModal}>
              <button className="close-button">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </span>
          </span>
        </div>

        <Modal.Body className="Disable2FA-modal">
          <Row>
            <Col lg={12} xl={12} md={12} sm={12}>
              <Card style={{ marginBottom: "0px" }}>
                {windowWidth < 900 ? (
                  <>
                    <Card.Body
                      className={
                        windowWidth > 700
                          ? "dashboard-grads-show-cal"
                          : "dashboard-grads-hide-cal"
                      }
                    >
                      <Formik
                        initialValues={{
                          start_date: "",
                          end_date: "",
                        }}
                        validationSchema={Yup.object().shape({
                          start_date: Yup.date().required(
                            "Start Date is required"
                          ),
                          end_date: Yup.date()
                            .required("End Date is required")
                            .test(
                              "start_date",
                              "Start Date must be before End Date",

                              function (value) {
                                const { start_date } = this.parent;
                                return start_date <= value;
                              }
                            ),
                        })}
                        onSubmit={(values) => {
                          // handleSubmit1(values);
                          startDate = values.start_date;
                          endDate = values.end_date;
                          fetchData(values);
                        }}
                      >
                        {({ handleSubmit, errors, touched, setFieldValue }) => (
                          <Form onSubmit={handleSubmit}>
                            <Row>
                              <>
                                <Col lg={4} md={6}>
                                  <FormGroup>
                                    <label
                                      htmlFor="start_date"
                                      className="form-label mt-4"
                                    >
                                      Start Date
                                    </label>
                                    <Field
                                      type="date"
                                      min={getFirstDayOfPreviousMonth()}
                                      max={getCurrentDate()}
                                      onClick={handleShowDate}
                                      className={`input101 ${
                                        errors.start_date && touched.start_date
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="start_date"
                                      name="start_date"
                                      onChange={(e) => {
                                        const selectedstart_date =
                                          e.target.value;
                                        setFieldValue(
                                          "start_date",
                                          selectedstart_date
                                        );
                                      }}
                                    ></Field>
                                    <ErrorMessage
                                      component="div"
                                      className="invalid-feedback"
                                      name="start_date"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg={4} md={6}>
                                  <FormGroup>
                                    <label
                                      htmlFor="end_date"
                                      className="form-label mt-4"
                                    >
                                      End Date
                                    </label>
                                    <Field
                                      type="date"
                                      min={state.startDate}
                                      max={getCurrentDate()}
                                      onClick={handleShowDate1}
                                      className={`input101 ${
                                        errors.end_date && touched.end_date
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      id="end_date"
                                      name="end_date"
                                      onChange={(e) => {
                                        const selectedend_date_date =
                                          e.target.value;

                                        setFieldValue(
                                          "end_date",
                                          selectedend_date_date
                                        );
                                      }}
                                    ></Field>
                                    <ErrorMessage
                                      component="div"
                                      className="invalid-feedback"
                                      name="end_date"
                                    />
                                  </FormGroup>
                                </Col>
                              </>
                            </Row>

                            <div className="text-end mt-4 ">
                              <button
                                type="submit"
                                className="btn btn-primary mx-2"
                              >
                                Submit
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </Card.Body>
                  </>
                ) : (
                  <>
                    <Card.Body>
                      <div>
                        <DateRangePicker
                          onChange={handleSelect}
                          showSelectionPreview={true}
                          moveRangeOnFirstSelection={false}
                          months={2}
                          ranges={state}
                          direction="horizontal"
                          minDate={minDate}
                          maxDate={maxDate}
                        />
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <div className="text-end">
                        <button
                          type="submit"
                          className="btn btn-primary f-size-5"
                          onClick={fetchData}
                          disabled={isButtonDisabled}
                        >
                          Submit
                        </button>
                      </div>
                    </Card.Footer>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default withApi(DashSubChildGrads);
