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
import { AiFillEye } from "react-icons/ai";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loaderimg from "../../../../Utils/Loader";
import { MdOutlineCalendarMonth } from "react-icons/md";
import SortIcon from "@mui/icons-material/Sort";
import moment from "moment";
import { format } from "date-fns";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { DateRangePicker } from "react-date-range";
import withApi from "../../../../Utils/ApiHelper";
import { useMyContext } from "../../../../Utils/MyContext";
import { SuccessAlert } from "../../../../Utils/ToastUtils";
import { useSelector } from "react-redux";
import useErrorHandler from "../../../CommonComponent/useErrorHandler";
import CeoDashSubChildShopSaleCenterModal from "./CeoDashSubChildShopSaleCenterModal";

const DashSubChildShopSale = ({ getData, getSiteStats }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCalenderModal, setShowCalenderModal] = useState(false);
  const [shopPerformanceData, setShopPerformanceData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [gradsLoading, setGradsLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [ModalButtonName, setModalButtonName] = useState(false);
  const [startDatePath, setStartDatePath] = useState("");
  const [endDatePath, setEndDatePath] = useState("");
  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const { handleError } = useErrorHandler();
  const {
    dashboardShopSaleData,
    setDashboardShopSaleData,
    dashSubChildShopSaleLoading,
  } = useMyContext();

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

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleOpenModal = async (item) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.get(
        showDate
          ? `ceo-dashboard/get-site-shop-performance?site_id=${id}&category_id=${item.id}&start_date=${startDate}&end_date=${endDate}`
          : `ceo-dashboard/get-site-shop-performance?site_id=${id}&category_id=${item.id}`
      );
      if (response.data) {
        setShopPerformanceData(response?.data?.data);
        setShowModal(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError(error);
    }
    setIsLoading(false);
  };
  const handleDateOpenModal = () => {
    // setShowModal(true);
    setShowCalenderModal(true);
  };

  const renderTableHeader = () => (
    <tr className="fuelprice-tr" style={{ padding: "0px" }}>
      <th
        className="dashboard-shopSale-table-width dashboard-shopSale-table-th"
        style={{ width: "25%" }}
      >
        Name
      </th>
      <th
        className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center"
        style={{ width: "15%" }}
      >
        Gross Sales
      </th>
      <th
        className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center"
        style={{ width: "15%" }}
      >
        Net Sales
      </th>
      <th
        className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center"
        style={{ width: "15%" }}
      >
        Profit
      </th>
      <th
        className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center"
        style={{ width: "15%" }}
      >
        Transactions{" "}
      </th>
      <th
        className="dashboard-shopSale-table-width dashboard-shopSale-table-th d-flex justify-content-center"
        style={{ width: "15%" }}
      >
        Details
      </th>
    </tr>
  );

  const renderTableData = () =>
    dashboardShopSaleData?.shop_sales?.map((item) => (
      <tr className="fuelprice-tr " key={item.id} style={{ padding: "0px" }}>
        <td
          className="dashboard-shopSale-table-width dashboard-shopSale-table-td "
          style={{ minWidth: "25%" }}
        >
          <div className="d-flex align-items-center justify-center h-100">
            <div className="d-flex">
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <h6 className="mb-0 fs-15 fw-semibold ">{item?.name}</h6>
              </div>
            </div>
          </div>
        </td>

        <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
          <div className="d-flex align-items-center h-100 ">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold ">{item?.gross_sales}</h6>
            </div>
          </div>
        </td>

        <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
          <div className="d-flex">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold">{item?.nett_sales}</h6>
            </div>
          </div>
        </td>

        <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
          <div className="d-flex">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold">{item?.profit}</h6>
            </div>
          </div>
        </td>
        <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
          <div className="d-flex">
            <div className="ms-2 mt-0 mt-sm-2 d-block">
              <h6 className="mb-0 fs-14 fw-semibold">
                {item?.total_transactions}
              </h6>
            </div>
          </div>
        </td>
        {item?.total_transactions > 0 ? (
          <>
            <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
              <div className="d-flex justify-content-center">
                <div className="ms-2 mt-0 mt-sm-2 d-block">
                  {userPermissions?.includes("dashboard-site-stats") && (
                    <>
                      <h6
                        className="mb-0 fs-14 fw-semibold"
                        onClick={() => handleOpenModal(item)}
                      >
                        <span
                          className="dashboard-shop-sale-icon all-center-flex "
                          style={{ cursor: "pointer" }}
                        >
                          <AiFillEye size={15} className=" all-center-flex" />
                        </span>
                      </h6>
                    </>
                  )}
                </div>
              </div>
            </td>
          </>
        ) : (
          <td className="dashboard-shopSale-table-width dashboard-shopSale-table-td d-flex justify-content-center">
            <div className="d-flex justify-content-center">
              <div className="ms-2 mt-0 mt-sm-2 d-block"></div>
            </div>
          </td>
        )}
      </tr>
    ));
  const handleCloseModal = () => {
    setShowModal(false);
    setShowCalenderModal(false);
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
  // const minDate = startOfMonth(subMonths(new Date(), 1)); // 1st day of the previous month
  const minDate = new Date("2023-09-30");
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
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
    return `${year} -${month} -${day} `;
  };

  function getFirstDayOfPreviousMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const year = lastMonth.getFullYear();
    const month = (lastMonth.getMonth() + 1).toString().padStart(2, "0");
    const day = "01";
    return `${year} -${month} -${day} `;
  }
  const handleShowDate = () => {
    const inputDateElement = document.querySelector("#start_date");
    inputDateElement.showPicker();
  };

  const handleShowDate1 = () => {
    const inputDateElement = document.querySelector("#end_date");
    inputDateElement.showPicker();
  };

  const fetchData = async () => {
    if (!userPermissions?.includes("ceodashboard-site-stats")) {
      return; // Exit early if the user doesn't have permission
    }
    setGradsLoading(true);

    const storedData = localStorage.getItem("localFilterModalData");
    const parshedData = JSON.parse(storedData);

    let { client_id, company_id } = parshedData;

    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
    }

    try {
      if (parshedData) {
        try {
          // Use async/await to fetch data
          const response3 = await getData(
            localStorage.getItem("superiorRole") !== "Client"
              ? `/ceo-dashboard/get-site-shop-details?client_id=${client_id}&company_id=${company_id}&site_id=${id}&end_date=${endDate}&start_date=${startDate}`
              : `/ceo-dashboard/get-site-shop-details?client_id=${client_id}&company_id=${company_id}&site_id=${id}&end_date=${endDate}&start_date=${startDate}`
          );
          setStartDatePath(startDate);
          setEndDatePath(endDate);
          if (response3 && response3.data) {
            setDashboardShopSaleData(response3?.data?.data);
            // setGradsGetSiteDetails(response3?.data?.data);
            SuccessAlert(response3?.data?.message);
            setModalButtonName(false);
            setShowCalenderModal(false);
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

  const ResetForm = async () => {
    if (!userPermissions?.includes("ceodashboard-site-stats")) {
      return; // Exit early if the user doesn't have permission
    }
    setGradsLoading(true);

    const storedData = localStorage.getItem("localFilterModalData");
    const parshedData = JSON.parse(storedData);

    let { client_id, company_id } = parshedData;

    // Check if the role is Client, then set the client_id and client_name from local storage
    if (localStorage.getItem("superiorRole") === "Client") {
      client_id = localStorage.getItem("superiorId");
    }
    try {
      if (parshedData) {
        try {
          // Use async/await to fetch data
          const response3 = await getData(
            localStorage.getItem("superiorRole") !== "Client"
              ? `/ceo-dashboard/get-site-shop-details?client_id=${client_id}&company_id=${company_id}&site_id=${id}`
              : `/ceo-dashboard/get-site-shop-details?client_id=${client_id}&company_id=${company_id}&site_id=${id}`
          );
          setStartDatePath(startDate);
          setEndDatePath(endDate);
          if (response3 && response3.data) {
            setDashboardShopSaleData(response3?.data?.data);
            // setGradsGetSiteDetails(response3?.data?.data);
            SuccessAlert(response3?.data?.message);
            setShowCalenderModal(false);
            setShowDate(true);
            setModalButtonName(true);
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
      {isLoading || gradsLoading ? <Loaderimg /> : ""}

      <CeoDashSubChildShopSaleCenterModal
        showModal={showModal}
        setShowModal={setShowModal}
        shopPerformanceData={shopPerformanceData}
      />
      <Row>
        <Col lg={12} xl={12} md={12} sm={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between flex-wrap">
              <h3 className="card-title">Shop Sales </h3>

              {dashboardShopSaleData?.shop_sales ? (
                <div className=" mt-2 mt-sm-0">
                  <button
                    className="btn btn-primary"
                    onClick={handleDateOpenModal}
                  >
                    {" "}
                    <MdOutlineCalendarMonth />{" "}
                    {showDate && getSiteStats?.data && !ModalButtonName
                      ? `${moment(startDatePath).format("Do MMM")} - ${moment(
                          endDatePath
                        ).format("Do MMM")} `
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
            <Card.Body>
              {!setDashboardShopSaleData ? (
                <span className="Smallloader"></span>
              ) : dashboardShopSaleData?.shop_sales?.length > 0 ? (
                <div
                  className="table-container table-responsive"
                  style={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 376px)",
                    minHeight: "300px",
                  }}
                >
                  <table className="table">
                    <thead
                      style={{ position: "sticky", top: "0", width: "100%" }}
                    >
                      <tr className="fuelprice-tr">{renderTableHeader()}</tr>
                    </thead>
                    <tbody>{renderTableData()}</tbody>
                  </table>
                </div>
              ) : (
                <p className="all-center-flex" style={{ height: "150px" }}>
                  {/* <span className="primary-loader"></span> */}

                  {dashSubChildShopSaleLoading ? (
                    <>
                      <span className="primary-loader"></span>
                    </>
                  ) : (
                    <>
                      <span> No data Found....</span>
                    </>
                  )}
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showCalenderModal}
        onHide={handleCloseModal}
        centered
        className="custom-modal-width custom-modal-height big-modal"
        // style={{ overflow: "auto" }}
      >
        <div className="modal-header">
          <span className="ModalTitle d-flex justify-content-between w-100 p-0 fw-normal">
            <span>Shop Sales</span>
            <span onClick={handleCloseModal}>
              <button className="close-button">
                <i className="ph ph-x"></i>
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
                                      } `}
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
                                      } `}
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

export default withApi(DashSubChildShopSale);
