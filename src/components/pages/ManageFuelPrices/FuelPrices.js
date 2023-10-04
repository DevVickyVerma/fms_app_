import React, { useEffect, useState } from "react";
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
import DataTable from "react-data-table-component";
import { Link, Navigate } from "react-router-dom";
import DataTableExtensions from "react-data-table-component-extensions";

import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import { ErrorMessage, Field, Formik, useFormik } from "formik";
import MiddayModal from "../../../data/Modal/MiddayModal";
import CustomModal from "../../../data/Modal/MiddayModal";

const FuelPrices = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate, isLoading } =
    props;

  // const [data, setData] = useState()
  //   const [data, setData] = useState([]);
  const [DeductionData, setDeductionData] = useState([]);
  const [editable, setis_editable] = useState();

  const [AddSiteData, setAddSiteData] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [headingData, setheadingData] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    handleFetchData();
    console.clear();
  }, []);
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
  const handleSubmit1 = async (values) => {
    setSelectedCompanyId(values.company_id);
    setSelectedDrsDate(values.start_date);

    try {
      const formData = new FormData();
      formData.append("start_date", values.start_date);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);

      // ...

      let clientIDCondition = "";
      if (localStorage.getItem("superiorRole") !== "Client") {
        clientIDCondition = `client_id=${values.client_id}&`;
      } else {
        clientIDCondition = `client_id=${clientIDLocalStorage}&`;
      }
      const response1 = await getData(
        `site/fuel-price?${clientIDCondition}company_id=${values.company_id}&drs_date=${values.start_date}`
      );

      const { data } = response1;
      if (data) {
        setheadingData(data?.data?.head_array);
        setData(data?.data);
        setis_editable(data?.data?.btn_clickable);
        setIsChecked(data?.data?.notify_operator);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const [data, setData] = useState();
  const renderTableHeader = () => {
    return (
      <tr className="fuelprice-tr" style={{ padding: "0px" }}>
        {data?.head_array.map((item, index) => (
          <th key={index}>{item}</th>
        ))}
      </tr>
    );
  };

  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemDate, setSelectedItemDate] = useState();
  const handleModalOpen = (item) => {
    setSelectedItem(item); // Set the selected item
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const renderTableData = () => {
    return data?.listing.map((item) => (
      <tr className="fuelprice-tr" key={item.id} style={{ padding: "0px" }}>
        <td>
          <span
            className={
              item?.link_clickable
                ? "text-muted fs-15 fw-semibold text-center fuel-site-name"
                : "text-muted fs-15 fw-semibold text-center"
            }
            onClick={item?.link_clickable ? () => handleModalOpen(item) : ""}
          >
            {item?.site_name} <span className="itemcount">{item?.count}</span>
          </span>
        </td>
        <td>
          <span class="text-muted fs-15 fw-semibold text-center">
            {item.time}
          </span>
        </td>

        {item?.fuels.map((fuel, index) => (
          <td key={index}>
            {Array.isArray(fuel) ? (
              <input type="text" className="table-input readonly" readOnly />
            ) : (
              <input
                type="number"
                step="0.010"
                // className="table-input"
                className={`table-input ${
                  fuel?.status === "UP"
                    ? "table-inputGreen"
                    : fuel?.status === "DOWN"
                    ? "table-inputRed"
                    : ""
                } ${!fuel?.is_editable ? "readonly" : ""}`}
                value={fuel.price}
                readOnly={!fuel?.is_editable}
                id={fuel.id}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            )}
          </td>
        ))}
      </tr>
    ));
  };

  const handleInputChange = (id, value) => {
    const updatedData = {
      ...data,
      listing: data?.listing?.map((item) => ({
        ...item,
        fuels: item.fuels.map((fuel) =>
          fuel.id === id ? { ...fuel, price: value } : fuel
        ),
      })),
    };

    setData(updatedData);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      data?.listing?.forEach((item) => {
        const siteId = item.id;

        item.fuels.forEach((fuel) => {
          if (!Array.isArray(fuel) && fuel.price !== undefined) {
            const priceId = fuel.id;
            const fieldKey = `fuels[${siteId}][${priceId}]`;
            const timeKey = `time[${siteId}][${priceId}]`;
            const fieldValue = fuel.price.toString();
            const fieldtime = fuel.time;
            formData.append(fieldKey, fieldValue);
            formData.append(timeKey, fieldtime);
          }
        });
      });

      setSelectedItemDate(selectedDrsDate);
      formData.append("notify_operator", isChecked);
      formData.append("drs_date", selectedDrsDate);
      formData.append("client_id", selectedClientId);
      formData.append("company_id", selectedCompanyId);

      const response = await postData(
        "/site/fuel-price/update-midday",
        formData
      );

      if (apidata.status_code === "200") {
        const values = {
          start_date: selectedDrsDate,
          client_id: selectedClientId,
          company_id: selectedCompanyId,
        };
        handleSubmit1(values);
      }
      // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const SendNotification = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleDataFromChild = async (dataFromChild) => {
    try {
      // Assuming you have the 'values' object constructed from 'dataFromChild'
      const values = {
        start_date: selectedDrsDate,
        client_id: selectedClientId,
        company_id: selectedCompanyId,
      };

      await handleSubmit1(values);
    } catch (error) {
      console.error("Error handling data from child:", error);
    }
  };

  const headerHeight = 135;

  const containerStyles = {
    overflowY: "scroll", // or 'auto'
    overflowX: "hidden", // or 'auto'
    // maxHeight: "100vh", // Set a maximum height for the container
    maxHeight: `calc(100vh - ${headerHeight}px)`,
    // border: "1px solid #ccc",
    // backgroundColor: "#f5f5f5",
    // padding: "10px",
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="overflow-container" style={containerStyles}>
        <CustomModal
          open={modalOpen}
          onClose={handleModalClose}
          selectedItem={selectedItem}
          selectedDrsDate={selectedDrsDate}
          onDataFromChild={handleDataFromChild}
        />
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Fuel Price</h1>
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
                Fuel Price
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
                                    setSelectedSiteList([]);
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
                                onChange={(e) => {
                                  const selectedCompany = e.target.value;
                                }}
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
                                type="date"
                                min={"2023-01-01"}
                                onClick={hadndleShowDate}
                                className={`input101 ${
                                  errors.start_date && touched.start_date
                                    ? "is-invalid"
                                    : ""
                                }`}
                                id="start_date"
                                name="start_date"
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
        <Row className="row-sm">
          <Col lg={12}>
            <Card style={{ height: "calc(100vh - 203px)", overflowY: "auto" }}>
              <Card.Header>
                <h3 className="card-title">Fuel Price</h3>
              </Card.Header>
              <Card.Body>
                {data ? (
                  <div
                    className="table-container table-responsive"
                    // style={{ height: "700px", overflowY: "auto" }}
                    style={{
                      overflowY: "auto",
                      maxHeight: "calc(100vh - 376px )",
                    }}
                    // height:"245"
                  >
                    <table className="table">
                      <colgroup>
                        {data?.head_array.map((_, index) => (
                          <col key={index} />
                        ))}
                      </colgroup>
                      <thead
                        style={{
                          position: "sticky",
                          top: "0",
                          width: "100%",
                        }}
                      >
                        <tr className="fuelprice-tr">{renderTableHeader()}</tr>
                      </thead>
                      <tbody>{renderTableData()}</tbody>
                    </table>
                  </div>
                ) : (
                  <img
                    src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                )}
              </Card.Body>
              <Card.Footer>
                {data ? (
                  <div className="text-end notification-class">
                    <div className="Notification">
                      <label
                        htmlFor="notificationCheckbox"
                        className="form-label Notification ml-2"
                      >
                        <input
                          type="checkbox"
                          id="notificationCheckbox"
                          checked={isChecked}
                          onChange={SendNotification}
                        />
                        Send Notification
                      </label>
                    </div>

                    {data?.btn_clickable ? (
                      <button
                        className="btn btn-primary me-2"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(FuelPrices);
