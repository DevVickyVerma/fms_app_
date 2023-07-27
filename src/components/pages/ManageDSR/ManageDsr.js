import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Loaderimg from "../../../Utils/Loader";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Button } from "bootstrap";

import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { ErrorMessage, Field, Formik } from "formik";
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
import axios from "axios";

const ManageDsr = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const [AddSiteData, setAddSiteData] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  useEffect(() => {
    handleFetchData();
  }, []);

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "supplier-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("supplier-edit");
  const isAddPermissionAvailable =
    permissionsArray?.includes("supplier-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("drs-delete-data");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("supplier-details");
  const isAssignPermissionAvailable = permissionsArray?.includes("drs-hit-api");

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
  const [initialDate, setInitialDate] = useState("2023-01-01");

  const navigate = useNavigate();
  const notify = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
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

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData(response.data);

        if (
          response?.data &&
          localStorage.getItem("superiorRole") === "Client"
        ) {
          const clientId = localStorage.getItem("superiorId");
          if (clientId) {
            setSelectedClientId(clientId);

            setSelectedCompanyList([]);

            // setShowButton(false);
            console.log(clientId, "clientId");
            console.log(AddSiteData, "AddSiteData");

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
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const getDRSData = async () => {
    console.log(SiteId, DRSDate, "API getData");
    try {
      const formData = new FormData();
      formData.append("site_id", SiteId);
      formData.append("drs_date", DRSDate);

      const postDataUrl = "/drs/get-data";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
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

        const axiosInstance = axios.create({
          baseURL: process.env.REACT_APP_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const DeleteRole = async () => {
          try {
            const response = await axiosInstance.post(
              "/drs/delete-data",
              formData
            );

            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } catch (error) {
            handleError(error);
          } finally {
          }
          // setIsLoading(false);
        };
        // const DRSDeleteData = async () => {

        //   try {
        //     const formData = new FormData();
        //     formData.append("site_id", SiteId);
        //     formData.append("drs_date", DRSDate);

        //     const postDataUrl = "/drs/delete-data";

        //     await postData(postDataUrl, formData);
        //     if (apidata.api_response === "success") {
        //  console.log(postDataUrl,"postDataUrl")
        //     } // Set the submission state to false after the API call is completed
        //   } catch (error) {
        //     console.log(error); // Set the submission state to false if an error occurs
        //   }
        // };
        DeleteRole();
      }
    });
  };

  const handleDataFromBunkeredSales = (data) => {
    // Do something with the data received from BunkeredSales
    console.log("Data received from BunkeredSales:", data);
    handleSubmit1(data);
  };

  const handleSubmit1 = async (values) => {
    console.log(values, "handleSubmit1handleSubmit1");
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
          setDataEnteryList(response1?.data?.data.cards);
          console.log(response1?.data?.data, "edwdwdw");
          setgetDataBtn(response1?.data?.data.showBtn);
          setUploadtitle(response1?.data?.data);
          setUploadTabname();
          // console.log(UploadTabname,"setUploadTabname")
        }
      } catch (error) {
        console.error("API error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [showModal, setShowModal] = useState(false); // State variable to control modal visibility

  const handleCardClick = (item) => {
    console.log(item.code, "upload");
    setPropsFile(item.code);
    setUploadTabname(item);
    setModalTitle(item.name); // Set the modalTitle state to the itemName
    setShowModal(true); // Toggle the value of showModal

    // Show or hide the modal based on the new value of showModal
  };
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEnteryClick = (item) => {
    setSelectedItem(item);
    setUploadTabname(item.name);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth", // You can use 'auto' instead of 'smooth' for instant scrolling
    });
    // Show the modal
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Data Entry</h1>
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
                Data Entry
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <Formik
                  initialValues={{
                    client_id: "",
                    company_id: "",
                    site_id: "",
                    start_date: "",
                  }}
                  validationSchema={Yup.object({
                    company_id: Yup.string().required("Company is required"),
                    site_id: Yup.string().required("Site is required"),
                    start_date: Yup.date()
                      .required("Start Date is required")
                      .min(
                        new Date("2023-01-01"),
                        "Start Date cannot be before January 1, 2023"
                      ),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
                            <Col lg={3} md={6}>
                              <FormGroup>
                                <label
                                  htmlFor="client_id"
                                  className=" form-label mt-4"
                                >
                                  Client
                                  <span className="text-danger">*</span>
                                </label>
                                <Field
                                  as="select"
                                  className={`input101 ${
                                    errors.client_id && touched.client_id
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  id="client_id"
                                  name="client_id"
                                  onChange={(e) => {
                                    const selectedType = e.target.value;
                                    setFieldValue("client_id", selectedType);
                                    setSelectedClientId(selectedType);

                                    // Reset the selected company and site
                                    setSelectedCompanyList([]);
                                    setFieldValue("company_id", "");
                                    setFieldValue("site_id", "");

                                    const selectedClient =
                                      AddSiteData.data.find(
                                        (client) => client.id === selectedType
                                      );

                                    if (selectedClient) {
                                      setSelectedCompanyList(
                                        selectedClient.companies
                                      );
                                      console.log(
                                        selectedClient,
                                        "selectedClient"
                                      );
                                      console.log(
                                        selectedClient.companies,
                                        "selectedClient"
                                      );
                                    }
                                  }}
                                >
                                  <option value="">Select a Client</option>
                                  {AddSiteData.data &&
                                  AddSiteData.data.length > 0 ? (
                                    AddSiteData.data.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.client_name}
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>No Client</option>
                                  )}
                                </Field>

                                <ErrorMessage
                                  component="div"
                                  className="invalid-feedback"
                                  name="client_id"
                                />
                              </FormGroup>
                            </Col>
                          )}
                          <Col lg={3} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="company_id"
                                className="form-label mt-4"
                              >
                                Company
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.company_id && touched.company_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="company_id"
                                name="company_id"
                                onChange={(e) => {
                                  const selectedCompany = e.target.value;
                                  setFieldValue("company_id", selectedCompany);
                                  setSelectedSiteList([]);
                                  const selectedCompanyData =
                                    selectedCompanyList.find(
                                      (company) =>
                                        company.id === selectedCompany
                                    );
                                  if (selectedCompanyData) {
                                    setSelectedSiteList(
                                      selectedCompanyData.sites
                                    );
                                    console.log(
                                      selectedCompanyData,
                                      "company_id"
                                    );
                                    console.log(
                                      selectedCompanyData.sites,
                                      "company_id"
                                    );
                                  }
                                }}
                              >
                                <option value="">Select a Company</option>
                                {selectedCompanyList.length > 0 ? (
                                  selectedCompanyList.map((company) => (
                                    <option key={company.id} value={company.id}>
                                      {company.company_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Company</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="company_id"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={3} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="site_id"
                                className="form-label mt-4"
                              >
                                Site
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${
                                  errors.site_id && touched.site_id
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="site_id"
                                name="site_id"
                                onChange={(e) => {
                                  const selectedsite_id = e.target.value;
                                  setFieldValue("site_id", selectedsite_id);
                                  setSiteId(selectedsite_id);
                                }}
                              >
                                <option value="">Select a Site</option>
                                {selectedSiteList.length > 0 ? (
                                  selectedSiteList.map((site) => (
                                    <option key={site.id} value={site.id}>
                                      {site.site_name}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>No Site</option>
                                )}
                              </Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="site_id"
                              />
                            </FormGroup>
                          </Col>
                          <Col lg={3} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="start_date"
                                className="form-label mt-4"
                              >
                                Date
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                  type="date"   min={"2023-01-01"}
                                className={`input101 ${
                                  errors.start_date && touched.start_date
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="start_date"
                                name="start_date"
                               // Set the minimum date value here
                                onChange={(e) => {
                                  const selectedCompany = e.target.value;
                                  setFieldValue("start_date", selectedCompany);
                                  setDRSDate(selectedCompany);
                                }}
                              ></Field>
                              <ErrorMessage
                                component="div"
                                className="invalid-feedback"
                                name="start_date"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
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
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/dashboard/`}
                        >
                          Reset
                        </Link>
                        <button className="btn btn-primary me-2" type="submit">
                          Submit
                        </button>
                      </Card.Footer>
                    </Form>
                  )}
                </Formik>
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
                        <p>Please select site first......</p>
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
                <h3 className="card-title">Data Entry</h3>
                {getDataBtn === true && isAssignPermissionAvailable ? (
                  <Link
                    onClick={() => getDRSData()}
                    className="btn btn-warning me-2"
                  >
                    Get Data from EVOBOS
                  </Link>
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
                          className={`text-white ${
                            item.bgColor === "amber"
                              ? "bg-card-amber"
                              : item.bgColor === "green"
                              ? "bg-card-green"
                              : item.bgColor === "red"
                              ? "bg-card-red"
                              : "bg-primary"
                          }`}
                        >
                          <Card.Body
                            className={`card-Div ${
                              selectedItem === item ? "selected" : ""
                            }`}
                            onClick={() => handleEnteryClick(item)} // Pass item.name as an argument
                          >
                            <h4 className="card-title">{item.name}</h4>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <p>Please select site first......</p>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* <FuelDelivery SiteID={PropsSiteId} ReportDate={PropsDate} */}
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
          <CashBanking SiteID={PropsSiteId} ReportDate={PropsDate} />
        ) : UploadTabname === "Bank Deposit" ? (
          <BankDeposit SiteID={PropsSiteId} ReportDate={PropsDate} />
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
        {/* <BunkeredSales SiteID={PropsSiteId} ReportDate={PropsDate} /> */}
      </>
    </>
  );
};
export default withApi(ManageDsr);
