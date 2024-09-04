import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
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
import Swal from "sweetalert2";
import { fetchData } from "../../../Redux/dataSlice";
import { useMyContext } from "../../../Utils/MyContext";
import CustomClient from "../../../Utils/CustomClient";
import CustomCompany from "../../../Utils/CustomCompany";
import CustomSite from "../../../Utils/CustomSite";
import { handleError } from "../../../Utils/ToastUtils";
import NewFilterTab from "../Filtermodal/NewFilterTab";





// Function to get the date two months back from the current date


const ManageDsr = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;


  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
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
  const [PropsType, setPropsType] = useState();
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
  const [successMessage, setSuccessMessage] = useState("");
  const [minDate, setMinDate] = useState();
  const getMinDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() - 2);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const isAdmin = UserPermissions?.role == "Administrator"; // Change this to true if the user is an admin

  useEffect(() => {
    if (!isAdmin) {
      setMinDate(getMinDate());
    }
  }, [isAdmin]);



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
      fetchCommonListData();
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
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


        let parshedData = JSON.parse(storedData);


        const formData = new FormData();
        formData.append("site_id", parshedData?.site_id);
        formData.append("drs_date", parshedData?.start_date);

        const DeleteRole = async () => {
          try {
            const postDataUrlForDelete = "/drs/delete-data";
            const responseForDelete = await postData(
              postDataUrlForDelete,
              formData
            );
            if (responseForDelete?.api_response == "success") {
              // const current = {
              //   client_id: PropsClientId,
              //   company_id: PropsCompanyId,
              //   site_id: SiteId,
              //   start_date: DRSDate,
              // };

              GetDataWithClient(parshedData);
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

  const GetDataHttech = (data) => {
    if (localStorage.getItem("dailyWorkFlowInput")) {
      let parsedDataFromLocal = JSON.parse(
        localStorage.getItem("dailyWorkFlowInput")
      )
        ? JSON.parse(localStorage.getItem("dailyWorkFlowInput"))
        : "null";

      formik.setFieldValue("client_id", parsedDataFromLocal?.client_id || "");
      formik.setFieldValue("company_id", parsedDataFromLocal?.company_id || "");
      formik.setFieldValue("site_id", parsedDataFromLocal?.site_id || "");
      formik.setFieldValue("start_date", parsedDataFromLocal?.start_date || "");

      GetDataWithClient(parsedDataFromLocal);
    }
  };

  const GetDataWithClient = async (values) => {
    // localStorage.setItem("dailyWorkFlowInput", JSON.stringify(values));

    if (!values?.site_id) return;
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
          `/drs/modules/?site_id=${values?.site_id}&drs_date=${values?.start_date}`
        );

        const { data } = response1;
        if (data) {
          setUploadList(response1?.data?.data.list);
          setDataEnteryList(response1?.data?.data?.cards);
          setUploadTabname();
          setgetDataBtn(response1?.data?.data);
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

  const handleShowModal = (item) => {
    setShowModal(true);
  };

  const handleCardClick = (item) => {
    setPropsFile(item.code);
    setPropsType(Uploadtitle?.b_mdl);
    setUploadTabname(item);
    setModalTitle(item.name); // Set the modalTitle state to the itemName
    setShowModal(true); // Toggle the value of showModal

    handleShowModal();
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

  // const validationSchema = Yup.object({
  //   company_id: Yup.string().required("Company is required"),
  //   site_id: Yup.string().required("Site is required"),
  //   start_date: Yup.date()
  //     .required("Start Date is required")
  //     .min(
  //       new Date("2023-01-01"),
  //       "Start Date cannot be before January 1, 2023"
  //     )
  //     .max(new Date(), "Start Date cannot be after the current date"),
  // });



  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
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
    validationSchemaForCustomInput,
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


  const handleSuccess = (message) => {
    setSuccessMessage(message);
    GetDataHttech();
    // Do any additional processing with the success message if needed
  };
  const handleSendEmail = async (event, values) => {
    // event.preventDefault();

    try {
      const formData = new FormData();

      let parshedData = JSON.parse(storedData);

      formData.append("site_id", parshedData?.site_id);
      formData.append("drs_date", parshedData?.start_date);


      const postDataUrl = "/send-report/email";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };


  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);


  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        parsedData.start_date = currentDate;

        // Update the stored data with the new start_date
        localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        GetDataWithClient(parsedData)
      } else {
        GetDataWithClient(parsedData)
      }

      // Call the API with the updated or original data
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
          start_date: new Date().toISOString().split('T')[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName]); // Add any other dependencies needed here



  const handleApplyFilters = (values) => {
    console.log(values, "submitted values");

    if (values?.start_date) {
      GetDataWithClient(values)
    }

  }

  const handleClearForm = async (resetForm) => {

    console.log("celared callled");


    setUploadList();
    setDataEnteryList();
    setUploadTabname();
    setgetDataBtn();
    setUploadtitle();


    // setData(null)
    // formik.resetForm()
    // formik.setFieldValue("site_id", "")
    // formik.setFieldValue("start_date", "")
    // formik.setFieldValue("client_id", "")
    // formik.setFieldValue("company_id", "")
    // formik.setFieldValue("endDate", "")
    // formik.setFieldValue("startDate", "")
    // formik.resetForm()
    // setSelectedCompanyList([]);
    // setSelectedClientId("");
    // setCompanyList([])
    // setData(null)
    // localStorage.removeItem("fuelSellingPrice")
    // const clientId = localStorage.getItem("superiorId");

    // Check if the role is Client, then set the client_id and client_name from local storage

    // if (localStorage.getItem("superiorRole") !== "Client") {
    //   fetchCommonListData();
    //   formik.setFieldValue("client_id", "")
    //   setCompanyList([])
    // } else {
    //   setSelectedClientId(clientId);
    //   GetCompanyList(clientId);
    //   formik.setFieldValue("client_id", clientId)
    // }
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



              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                handleSendEmail={handleSendEmail}
                handleDeleteDRS={handleDelete}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                lg="3"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={true}
                showStationInput={true}
                showSendEmail={getDataBtn?.sendReportEmail && DataEnteryList}
                showDRSDelete={isDeletePermissionAvailable && DataEnteryList}
                ClearForm={handleClearForm}
              />


              {/* <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>

                    <CustomClient
                      formik={formik}
                      lg={3}
                      md={4}
                      ClientList={ClientList}
                      setSelectedClientId={setSelectedClientId}
                      setSiteList={setSiteList}
                      setCompanyList={setCompanyList}
                      GetCompanyList={GetCompanyList}
                    />

                    <CustomCompany
                      formik={formik}
                      lg={3}
                      md={4}
                      CompanyList={CompanyList}
                      setSelectedCompanyId={setSelectedCompanyId}
                      setSiteList={setSiteList}
                      selectedClientId={selectedClientId}
                      GetSiteList={GetSiteList}
                    />

                    <CustomSite
                      formik={formik}
                      lg={3}
                      md={3}
                      SiteList={SiteList}
                      setSelectedSiteId={setSelectedSiteId}
                      CompanyList={CompanyList}
                      setSiteId={setSiteId}
                    />

                    <Col lg={3} md={3}>
                      <div className="form-group">
                        <label htmlFor="start_date" className="form-label mt-4">
                          Date
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          // min={"2023-01-01"}
                          min={!isAdmin ? minDate : undefined}
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


                    {getDataBtn?.sendReportEmail && DataEnteryList ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Send Email</Tooltip>}
                      >
                        <button
                          to="#"
                          className="btn btn-info me-2 rounded-11"
                          onClick={() => handleSendEmail()}
                        >
                          Send Email
                        </button>
                      </OverlayTrigger>
                    ) : (
                      ""
                    )}


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
              </Card.Body> */}
            </Card>
          </Col>
        </Row>

        {Uploadtitle?.b_mdl === "PRISM" ||
          Uploadtitle?.b_mdl === "HTECH" ||
          Uploadtitle?.b_mdl === "EDGEPoS" ? (
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
                    {Uploadtitle?.b_mdl === "PRISM" ||
                      Uploadtitle?.b_mdl === "HTECH" ||
                      Uploadtitle?.b_mdl === "EDGEPoS" ? (
                      UploadList && UploadList.length > 0 ? (
                        UploadList.map((item) => (
                          <Col md={12} xl={3} key={item.id}>
                            <Card
                              className={`text-white ${item.bgColor === "blue"
                                ? "bg-primary"
                                : item.bgColor === "green"
                                  ? "bg-card-green"
                                  : item.bgColor === "red"
                                    ? "bg-card-red"
                                    : "bg-primary"
                                }`}
                            >
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
                            src={require("../../../assets/images/commonimages/no_data.png")}
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
                        setShowModal={setShowModal}
                        showModal={showModal}
                        open={showModal}
                        PropsSiteId={PropsSiteId}
                        PropsCompanyId={PropsCompanyId}
                        selectedClientId={selectedClientId}
                        PropsFile={PropsFile}
                        PropsType={PropsType}
                        DRSDate={DRSDate}
                        onClose={() => setShowModal(false)}
                        modalTitle={modalTitle} // Use the modalTitle variable
                        modalCancelButtonLabel="Cancel"
                        modalSaveButtonLabel="Save"
                        onSuccess={handleSuccess}
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
                {getDataBtn?.showBtn === true &&
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
                        src={require("../../../assets/images/commonimages/no_data.png")}
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
