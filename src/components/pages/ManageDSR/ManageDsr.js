import React, { useEffect, useState } from "react";

import { Link, Navigate, useLocation } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";

import Loaderimg from "../../../Utils/Loader";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";

import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormModal } from "../../../data/Modal/UploadFile";
import FuelDelivery from "../DRSComponents/FuelDelivery";
import ShopSales from "../DRSComponents/ShopSales";
import FuelSales from "../DRSComponents/FuelSales";
import FuelInventry from "../DRSComponents/Fuelinventry";
import CoffeeValet from "../DRSComponents/Coffee&Valet";
import ChargesDeduction from "../DRSComponents/ChargesDeduction";
import Departmentshopsale from "../DRSComponents/Departmentshopsale";
import CashBanking from "../DRSComponents/CashBanking";
import BankDeposit from "../DRSComponents/BankDeposit";
import DepartmentShop from "../DRSComponents/DepartmentShop";
import CreditCardBanking from "../DRSComponents/CreditCardBanking";
import Summary from "../DRSComponents/Summary";
import BunkeredSales from "../DRSComponents/BunkeredSales";
import { Slide, toast } from "react-toastify";
import Swal from "sweetalert2";
import { fetchData } from "../../../Redux/dataSlice";
import { useMyContext } from "../../../Utils/MyContext";

const ManageDsr = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  // const receivedData = props?.location?.state;
  const location = useLocation();
  const navigate = useNavigate();

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [UploadTabname, setUploadTabname] = useState();
  const [modalTitle, setModalTitle] = useState("");
  const [Uploadtitle, setUploadtitle] = useState();
  const [UploadList, setUploadList] = useState();
  const [DataEnteryList, setDataEnteryList] = useState();
  const [PropsSiteId, setPropsSiteId] = useState();
  const [PropsCompanyId, setPropsCompanyId] = useState();
  const [PropsClientId, setPropsClientId] = useState();
  const [PropsFile, setPropsFile] = useState();
  const [PropsDate, setPropsDate] = useState();
  const [getDataBtn, setgetDataBtn] = useState();
  const [SiteId, setSiteId] = useState();
  const [DRSDate, setDRSDate] = useState();
  const [showModal, setShowModal] = useState(false); // State variable to control modal visibility
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const { timeLeft, setTimeLeft, isTimerRunning, setIsTimerRunning } =
    useMyContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const storedToken = localStorage.getItem("token");
  useEffect(() => {
    if (storedToken) {
      dispatch(fetchData());
    }
    console.clear();
  }, [storedToken]);

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isDeletePermissionAvailable =
    permissionsArray?.includes("drs-delete-data");

  const isAssignPermissionAvailable = permissionsArray?.includes("drs-hit-api");

  const ErrorAlert = (message) => {
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
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }



  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setClientList(response.data);

        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          setSelectedClientId(clientId);
          setSelectedCompanyList([]);

          if (response?.data) {
            const selectedClient = response?.data?.data?.find(
              (client) => client.id === clientId
            );
            if (selectedClient) {
              setSelectedCompanyList(selectedClient?.companies);
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {
          console.log(response, "company");
          setCompanyList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const GetSiteList = async (values) => {
    try {
      if (values) {
        const response = await getData(`common/site-list?company_id=${values}`);

        if (response) {
          console.log(response, "company");
          setSiteList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData()
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId)
    }
  }, []);

  const clearTimerDataFromLocalStorage = () => {
    localStorage.removeItem("isTimerRunning");
    localStorage.removeItem("timeLeft");
  };

  const getDRSData = async () => {
    try {
      const formData = new FormData();
      formData.append("site_id", SiteId);
      formData.append("drs_date", DRSDate);

      const postDataUrl = "/drs/get-data";

      const postResponse = await postData(postDataUrl, formData);
      if (postResponse.api_response === "success") {
        setIsTimerRunning(true);
        setTimeLeft(80);
        localStorage.setItem("isTimerRunning", true);
        localStorage.setItem("timeLeft", 80);

        // setTimeout(clearTimerDataFromLocalStorage, 80000);
      } // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("site_id", SiteId);
        formData.append("drs_date", DRSDate);

        const DeleteRole = async () => {
          try {
            const postDataUrlForDelete = "/drs/delete-data";
            const responseForDelete = await postData(
              postDataUrlForDelete,
              formData
            );
            if (responseForDelete?.api_response == "success") {
              const current = {
                client_id: PropsClientId,
                company_id: PropsCompanyId,
                site_id: SiteId,
                start_date: DRSDate,
              };

              GetDataWithClient(current);
              Swal.fire({
                title: "Deleted!",
                text: "Your item has been deleted.",
                icon: "success",
                confirmButtonText: "OK",
              });
            }
          } catch (error) {
            handleError(error);
          } finally {
          }
          // setIsLoading(false);
        };

        DeleteRole();
      }
    });
  };

  const handleDataFromBunkeredSales = (data) => {
    GetDataWithClient(data);

    if (data?.checkStateForBankDeposit) {
      setUploadTabname("Bank Deposit");
    } else if (data?.checkState) {
      data?.checkState ? setUploadTabname("Cash Banking") : setUploadTabname();
    } else {
      setUploadTabname();
    }
  };

  const GetDataWithClient = async (values) => {
    localStorage.setItem("dailyWorkFlowInput", JSON.stringify(values));
    try {
      const formData = new FormData();

      formData.append("start_date", values.start_date);
      if (localStorage.getItem("superiorRole") !== "Client") {
        formData.append("client_id", values.client_id);
        setPropsClientId(values.client_id);
      } else {
        formData.append("client_id", clientIDLocalStorage);
        setPropsClientId(clientIDLocalStorage);
      }
      formData.append("company_id", values.company_id);
      formData.append("site_id", values.site_id);

      try {
        setPropsSiteId(values.site_id);
        setPropsDate(values.start_date);
        setPropsCompanyId(values.company_id);

        const response1 = await getData(
          `/drs/modules/?site_id=${values.site_id}&drs_date=${values.start_date}`
        );

        const { data } = response1;
        if (data) {
          setUploadList(response1?.data?.data.list);
          setDataEnteryList(response1?.data?.data?.cards);
          setUploadTabname();
          setgetDataBtn(response1?.data?.data.showBtn);
          setUploadtitle(response1?.data?.data);
          // setUploadTabname();
        }
      } catch (error) {
        console.error("API error:", error);
        setDataEnteryList();
        setUploadTabname();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCardClick = (item) => {
    setPropsFile(item.code);
    setUploadTabname(item);
    setModalTitle(item.name); // Set the modalTitle state to the itemName
    setShowModal(true); // Toggle the value of showModal

    // Show or hide the modal based on the new value of showModal
  };

  const handleEnteryClick = (item) => {
    setSelectedItem(item);
    setUploadTabname(item.name);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth", // You can use 'auto' instead of 'smooth' for instant scrolling
    });
    // Show the modal
  };

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setIsTimerRunning(false);
      localStorage.setItem("isTimerRunning", false);
      localStorage.removeItem("timeLeft");
      clearTimerDataFromLocalStorage();
    }

    if (timeLeft === 1) {
      const current = {
        client_id: PropsClientId,
        company_id: PropsCompanyId,
        site_id: SiteId,
        start_date: DRSDate,
      };

      GetDataWithClient(current);
    }

    return () => clearInterval(timer);

    console.clear();
  }, [isTimerRunning, timeLeft]);

  const handleButtonClick = () => {
    if (!isTimerRunning) {
      getDRSData(); // Assuming you have a function to fetch data called getDRSData()
    }
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0"); // Subtract one day from the current date
    return `${year}-${month}-${day}`;
  };
  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };

  const validationSchema = Yup.object({
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
    start_date: Yup.date()
      .required("Start Date is required")
      .min(
        new Date("2023-01-01"),
        "Start Date cannot be before January 1, 2023"
      )
      .max(new Date(), "Start Date cannot be after the current date"),
  });

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      start_date: "",
    },
    validationSchema,
    onSubmit: (values) => {
      GetDataWithClient(values);
    },
  });
  const handleFormReset = () => {
    formik.resetForm(); // This will reset the form to its initial values
    setSelectedSiteList([]);
    setSelectedCompanyList([]);
    setSelectedClientId("");
    localStorage.removeItem("dailyWorkFlowInput");
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Daily Workflow</h1>
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
                Daily Workflow
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={3} md={3}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className="form-label mt-4"
                          >
                            Client
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.client_id &&
                              formik.touched.client_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="client_id"
                            name="client_id"
                            value={formik.values.client_id}
                            onChange={(e) => {
                              const selectedType = e.target.value;
                              console.log(selectedType, "selectedType");

                              if (selectedType) {
                                GetCompanyList(selectedType);
                                formik.setFieldValue("client_id", selectedType);
                                setSelectedClientId(selectedType);
                                setSiteList([]);
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");
                              } else {
                                console.log(
                                  selectedType,
                                  "selectedType no values"
                                );
                                formik.setFieldValue("client_id", "");
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");

                                setSiteList([]);
                                setCompanyList([]);
                              }
                            }}
                          >
                            <option value="">Select a Client</option>
                            {ClientList.data && ClientList.data.length > 0 ? (
                              ClientList.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.client_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Client</option>
                            )}
                          </select>

                          {formik.errors.client_id &&
                            formik.touched.client_id && (
                              <div className="invalid-feedback">
                                {formik.errors.client_id}
                              </div>
                            )}
                        </div>
                      </Col>
                    )}

                    <Col Col lg={3} md={3}>
                      <div className="form-group">
                        <label htmlFor="company_id" className="form-label mt-4">
                          Company
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.company_id &&
                            formik.touched.company_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="company_id"
                          name="company_id"
                          value={formik.values.company_id}
                          onChange={(e) => {
                            const selectcompany = e.target.value;

                            if (selectcompany) {
                              GetSiteList(selectcompany);
                              formik.setFieldValue("company_id", selectcompany);
                              formik.setFieldValue("site_id", "");
                              setSelectedCompanyId(selectcompany);
                            } else {
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("site_id", "");

                              setSiteList([]);
                            }
                          }}
                        >
                          <option value="">Select a Company</option>
                          {selectedClientId && CompanyList.length > 0 ? (
                            <>
                              setSelectedCompanyId([])
                              {CompanyList.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.company_name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option disabled>No Company</option>
                          )}
                        </select>
                        {formik.errors.company_id &&
                          formik.touched.company_id && (
                            <div className="invalid-feedback">
                              {formik.errors.company_id}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col lg={3} md={3}>
                      <div className="form-group">
                        <label htmlFor="site_id" className="form-label mt-4">
                          Site Name
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.site_id && formik.touched.site_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="site_id"
                          name="site_id"
                          value={formik.values.site_id}
                          onChange={(e) => {
                            const selectedsite_id = e.target.value;

                            formik.setFieldValue("site_id", selectedsite_id);
                            setSelectedSiteId(selectedsite_id);
                          }}
                        >
                          <option value="">Select a Site</option>
                          {CompanyList && SiteList.length > 0 ? (
                            SiteList.map((site) => (
                              <option key={site.id} value={site.id}>
                                {site.site_name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No Site</option>
                          )}
                        </select>
                        {formik.errors.site_id && formik.touched.site_id && (
                          <div className="invalid-feedback">
                            {formik.errors.site_id}
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col lg={3} md={3}>
                      <div classname="form-group">
                        <label htmlFor="start_date" className="form-label mt-4">
                          Date
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          min={"2023-01-01"}
                          max={getCurrentDate()}
                          onClick={hadndleShowDate}
                          className={`input101 ${formik.errors.start_date &&
                            formik.touched.start_date
                            ? "is-invalid"
                            : ""
                            }`}
                          value={formik.values.start_date}
                          id="start_date"
                          name="start_date"
                          onChange={(e) => {
                            const selectedCompany = e.target.value;
                            formik.setFieldValue("start_date", selectedCompany);
                            setDRSDate(selectedCompany);
                          }}
                        ></input>
                        {formik.errors.start_date &&
                          formik.touched.start_date && (
                            <div className="invalid-feedback">
                              {formik.errors.start_date}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end">
                    {isDeletePermissionAvailable && DataEnteryList ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <Link
                          to="#"
                          className="btn btn-danger me-2 rounded-11"
                          onClick={() => handleDelete()}
                        >
                          <i>
                            <svg
                              className="table-delete"
                              xmlns="http://www.w3.org/2000/svg"
                              height="20"
                              viewBox="0 0 24 24"
                              width="16"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                            </svg>
                          </i>
                        </Link>
                      </OverlayTrigger>
                    ) : (
                      ""
                    )}
                    <Link
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={handleFormReset}
                    >
                      Reset
                    </Link>
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {Uploadtitle?.b_mdl === "PRISM" ? (
          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title">
                    Upload Files {Uploadtitle ? `(${Uploadtitle.b_mdl})` : ""}
                  </h3>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {Uploadtitle?.b_mdl === "PRISM" ? (
                      UploadList && UploadList.length > 0 ? (
                        UploadList.map((item) => (
                          <Col md={12} xl={3} key={item.id}>
                            <Card className="text-white bg-primary">
                              <Card.Body
                                className="card-Div"
                                onClick={() => handleCardClick(item)} // Pass item.name as an argument
                              >
                                <h4 className="card-title">{item.name}</h4>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))
                      ) : (
                        <>
                          <p>Please select site first......</p>
                          <img
                            src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                            alt="MyChartImage"
                            className="all-center-flex nodata-image"
                          />
                        </>
                      )
                    ) : null}
                  </Row>
                </Card.Body>
                {showModal ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "10vh",
                    }}
                  >
                    <Col md={3} xl={3}>
                      <FormModal
                        open={showModal}
                        PropsSiteId={PropsSiteId}
                        PropsCompanyId={PropsCompanyId}
                        selectedClientId={selectedClientId}
                        PropsFile={PropsFile}
                        onClose={() => setShowModal(false)}
                        modalTitle={modalTitle} // Use the modalTitle variable
                        modalCancelButtonLabel="Cancel"
                        modalSaveButtonLabel="Save"
                      />
                    </Col>
                  </div>
                ) : (
                  ""
                )}
              </Card>
            </Col>
          </Row>
        ) : (
          ""
        )}

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header className="d-flex justify-content-space-between">
                <h3 className="card-title">Daily Workflow</h3>
                {getDataBtn === true &&
                  isAssignPermissionAvailable &&
                  DataEnteryList &&
                  DataEnteryList.length > 0 ? (
                  <>
                    <Link
                      onClick={handleButtonClick}
                      className="btn btn-warning me-2"
                      disabled={isTimerRunning}
                    >
                      {isTimerRunning
                        ? `Wait (${timeLeft} sec)`
                        : "Get Data from EVOBOS"}
                    </Link>
                  </>
                ) : (
                  ""
                )}
              </Card.Header>
              <Card.Body>
                <Row>
                  {DataEnteryList && DataEnteryList.length > 0 ? (
                    DataEnteryList.map((item) => (
                      <Col md={12} xl={3} key={item.id}>
                        <Card
                          className={`text-white ${item.bgColor === "amber"
                            ? "bg-card-amber"
                            : item.bgColor === "green"
                              ? "bg-card-green"
                              : item.bgColor === "red"
                                ? "bg-card-red"
                                : "bg-primary"
                            }`}
                        >
                          <Card.Body
                            className={`card-Div ${selectedItem === item ? "dsr-selected" : ""
                              }`}
                            onClick={() => handleEnteryClick(item)} // Pass item.name as an argument
                          >
                            <h4 className="card-title">{item.name}</h4>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <>
                      <p>Please select site first......</p>
                      <img
                        src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                        alt="MyChartImage"
                        className="all-center-flex nodata-image"
                      />
                    </>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {UploadTabname === "Fuel Delivery" ? (
          <FuelDelivery
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Fuel Sales" ? (
          <FuelSales
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Charges & Deductions" ? (
          <ChargesDeduction
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Valet & Coffee Sales" ? (
          <CoffeeValet
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Fuel-Inventory" ? (
          <FuelInventry
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Shop Sales" ? (
          <ShopSales
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Department Shop Sales" ? (
          <Departmentshopsale
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Cash Banking" ? (
          <CashBanking
            SiteID={PropsSiteId}
            ReportDate={PropsDate}
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Bank Deposit" ? (
          <BankDeposit
            SiteID={PropsSiteId}
            ReportDate={PropsDate}
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Department Shop Summary" ? (
          <DepartmentShop
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Credit Card Banking" ? (
          <CreditCardBanking
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Summary" ? (
          <Summary
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : UploadTabname === "Bunkered Sales" ? (
          <BunkeredSales
            client_id={PropsClientId}
            company_id={PropsCompanyId}
            site_id={PropsSiteId}
            start_date={PropsDate}
            sendDataToParent={handleDataFromBunkeredSales}
          />
        ) : null}
      </>
    </>
  );
};
export default withApi(ManageDsr);
