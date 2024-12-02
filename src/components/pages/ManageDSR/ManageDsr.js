import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
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
import { useMyContext } from "../../../Utils/MyContext";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import { getCurrentDate, handleFilterData } from "../../../Utils/commonFunctions/commonFunction";
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const ManageDsr = (props) => {
  const { isLoading, getData, postData } = props;
  const { handleError } = useErrorHandler();

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(localStorage.getItem("superiorId"));
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
  const [DRSDate,] = useState();
  const [showModal, setShowModal] = useState(false); // State variable to control modal visibility
  const [selectedClientId,] = useState("");
  const { timeLeft, setTimeLeft, isTimerRunning, setIsTimerRunning } =
    useMyContext();
  const [selectedItem, setSelectedItem] = useState(null);



  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isDeletePermissionAvailable =
    permissionsArray?.includes("drs-delete-data");

  const isAssignPermissionAvailable = permissionsArray?.includes("drs-hit-api");

  const clearTimerDataFromLocalStorage = () => {
    localStorage.removeItem("isTimerRunning");
    localStorage.removeItem("timeLeft");
  };

  const getDRSData = async () => {
    try {
      let parshedData = JSON.parse(storedData);


      const formData = new FormData();
      formData.append("site_id", parshedData?.site_id);
      formData.append("drs_date", parshedData?.start_date);

      // formData.append("site_id", SiteId);
      // formData.append("drs_date", DRSDate);

      const postDataUrl = "/drs/get-data";

      const postResponse = await postData(postDataUrl, formData);
      if (postResponse.api_response === "success") {
        setIsTimerRunning(true);
        setTimeLeft(80);
        localStorage.setItem("isTimerRunning", true);
        localStorage.setItem("timeLeft", 80);
      } // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
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

  const GetDataHttech = () => {
    if (localStorage.getItem("localFilterModalData")) {
      let parsedDataFromLocal = JSON.parse(
        localStorage.getItem("localFilterModalData")
      )
        ? JSON.parse(localStorage.getItem("localFilterModalData"))
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
      formData.append("company_id", values?.company_id);
      formData.append("site_id", values?.site_id);

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

  const handleShowModal = () => {
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
      let parshedData = JSON.parse(storedData);
      GetDataWithClient(parshedData);
    }
    
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const handleButtonClick = () => {
    if (!isTimerRunning) {
      getDRSData(); // Assuming you have a function to fetch data called getDRSData()
    }
  };
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



  const handleSuccess = () => {
    GetDataHttech();
    // Do any additional processing with the success message if needed
  };



  const handleSendEmail = async () => {
    // event.preventDefault();

    try {
      const formData = new FormData();

      let parshedData = JSON.parse(storedData);

      formData.append("site_id", parshedData?.site_id);
      formData.append("drs_date", parshedData?.start_date);


      const postDataUrl = "/send-report/email";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.error(error); // Set the submission state to false if an error occurs
    }
  };


  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  const ReduxFullData = useSelector((state) => state?.data?.data);
  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
  }, []);

  const handleApplyFilters = (values) => {

    if (values?.start_date) {
      GetDataWithClient(values)
    }

  }





  const handleClearForm = async () => {
    setUploadList();
    setDataEnteryList();
    setUploadTabname();
    setgetDataBtn();
    setUploadtitle();
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
            <Card.Header>
            <h3 className="card-title">Filter</h3>
            </Card.Header>
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
                parentMaxDate={getCurrentDate()}
              />
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
