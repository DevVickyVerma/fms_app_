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

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import TimefuelpIcker from "../../Components/TimepIcker/TimefuelpIcker";

const FuelPrices = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate, isLoading } =
    props;

  const [DeductionData, setDeductionData] = useState([]);
  const [editable, setis_editable] = useState();

  const [AddSiteData, setAddSiteData] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [headingData, setheadingData] = useState([]);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );
  const [isChecked, setIsChecked] = useState(true);

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
  const handleSubmit1 = async (values) => {
    setSelectedCompanyId(values.company_id);
    setSelectedDrsDate(values.start_date);
    // console.log(values, "values.start_date");
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
        `site/fuel-price/mid-day?${clientIDCondition}company_id=${values.company_id}&drs_date=${values.start_date}`
      );

      const { data } = response1;
      if (data) {
        // console.log(data.data.listing, "Drsdata");
        setheadingData(data?.data?.head_array);
        setData(data?.data);

        // const responseData = data.data;

        // console.log(responseData, "data.data");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const [data, setData] = useState();
  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleAccordion = (rowId) => {
    if (expandedRow === rowId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowId);
    }
  };

  const handleTimeChange = (itemId, newTime) => {
    // Find the item in the listing
    const targetItem = data?.listing.find((item) => item.id === itemId);

    if (targetItem) {
      // Update the time of the first fuel in the item's fuels array
      if (targetItem.fuels[0] && targetItem.fuels[0][0]) {
        targetItem.fuels[0][0].time = newTime;
        // You might want to perform any additional logic or state updates here
      }
    }
    console.log(itemId, newTime, "handleTimeChange");
    console.log(targetItem, newTime, "handleTimeChange");

    // Update the component's state or data as needed
    // You can use setState or any other method based on your implementation
  };

  const renderTableHeader = () => {
    return (
      <tr>
        {data?.head_array.map((item, index) => (
          <th key={index}>{item}</th>
        ))}
      </tr>
    );
  };

  const renderTableData = () => {
    const rows = [];

    data?.listing.forEach((item) => {
      const fuelSets = item.fuels;
      const columnCount = data.head_array.length - 1;
      console.log(item?.fuels[0], "fuels");

      const fuelColumns = [];
      for (let columnIndex = 0; columnIndex < columnCount - 1; columnIndex++) {
        const fuelIndex = columnIndex;
        const fuelSet = fuelSets[fuelIndex] || [];
        console.log(fuelColumns, "fuelColumns");
        fuelColumns.push(
          <td key={`${item.id}-${fuelIndex}`}>
            {fuelSet.map((fuel, setIndex) => (
              <div key={`${item.id}-${fuelIndex}-${setIndex}`}>
                {fuel.id ? (
                  <input
                    type="number"
                    step="0.001"
                    className={`table-input ${
                      fuel.status === "UP"
                        ? "table-inputGreen"
                        : fuel.status === "DOWN"
                        ? "table-inputRed"
                        : ""
                    }`}
                    value={fuel.price}
                    id={fuel.id}
                    onChange={(e) =>
                      handleInputChange(e.target.id, e.target.value)
                    }
                  />
                ) : (
                  <input
                    type="text"
                    className="table-input readonly"
                    readOnly
                  />
                )}
              </div>
            ))}
          </td>
        );
      }

      const timeCell = (
        <td key={`time-${item.id}`}>
          <input
            type="time"
            value={fuelSets[0][0]?.time || ""}
            onChange={(e) => handleTimeChange(item.id, e.target.value)}
          />
        </td>
      );

      rows.push(
        <tr key={`${item.id}`}>
          <td rowSpan={columnCount}>
            <span className="text-muted fs-15 fw-semibold text-center">
              {item.site_name}
            </span>
          </td>
          {timeCell}
          {fuelColumns}
        </tr>
      );
    });

    return <tbody>{rows}</tbody>;
  };

  // console.log("data listing check",data?.listing);

  const handleInputChange = (id, value) => {
    const updatedData = {
      ...data,
      listing: data?.listing?.map((item) => ({
        ...item,
        fuels: item.fuels.map((fuelSet) =>
          fuelSet.map((fuel) =>
            fuel.id === id ? { ...fuel, price: parseFloat(value) } : fuel
          )
        ),
      })),
    };

    setData(updatedData);
  };

  const handleSubmit = async (values) => {
    console.log(data, "formikvales");
    // try {
    //   const formData = new FormData();

    //   data?.listing?.forEach((item) => {
    //     const siteId = item.id;

    //     item.fuels.forEach((fuel) => {
    //       if (!Array.isArray(fuel) && fuel.price !== undefined) {
    //         const priceId = fuel.id;
    //         const fieldKey = `fuels[${siteId}][${priceId}]`;
    //         const fieldValue = fuel.price.toString();
    //         formData.append(fieldKey, fieldValue);
    //       }
    //     });
    //   });

    //   for (const [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    //   }
    //   formData.append("notify_operator", isChecked);
    //   formData.append("drs_date", selectedDrsDate);
    //   formData.append("client_id", selectedClientId);
    //   formData.append("company_id", selectedCompanyId);

    //   const postDataUrl = "/site/fuel-price/update";
    //   // const navigatePath = "/business";

    //   await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    // } catch (error) {
    //   console.log(error); // Set the submission state to false if an error occurs
    // }
  };

  const SendNotification = (event) => {
    setIsChecked(event.target.checked);
  };
  const validationSchema = Yup.object({
    company_id: Yup.string().required("Company is required"),

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

      start_date: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit1(values);
    },
  });

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
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
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={3} md={3}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className="form-label mt-4"
                          >
                            Client <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${
                              formik.errors.client_id &&
                              formik.touched.client_id
                                ? "is-invalid"
                                : ""
                            }`}
                            id="client_id"
                            name="client_id"
                            onChange={(e) => {
                              formik.handleChange(e);
                              setSelectedCompanyList([]);
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("site_id", "");

                              const selectedClient = AddSiteData.data.find(
                                (client) => client.id === e.target.value
                              );

                              if (selectedClient) {
                                setSelectedCompanyList(
                                  selectedClient.companies
                                );
                              }
                            }}
                            value={formik.values.client_id}
                          >
                            <option value="">Select a Client</option>
                            {AddSiteData.data && AddSiteData.data.length > 0 ? (
                              AddSiteData.data.map((item) => (
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
                    <Col lg={3} md={3}>
                      <div className="form-group">
                        <label htmlFor="company_id" className="form-label mt-4">
                          Company
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${
                            formik.errors.company_id &&
                            formik.touched.company_id
                              ? "is-invalid"
                              : ""
                          }`}
                          id="company_id"
                          name="company_id"
                          value={formik.values.company_id}
                          onChange={(e) => {
                            const selectedCompany = e.target.value;
                            formik.setFieldValue("company_id", selectedCompany);
                            setSelectedSiteList([]);
                            const selectedCompanyData =
                              selectedCompanyList.find(
                                (company) => company.id === selectedCompany
                              );
                            if (selectedCompanyData) {
                              setSelectedSiteList(selectedCompanyData.sites);
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
                      <div classname="form-group">
                        <label htmlFor="start_date" className="form-label mt-4">
                          Date
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          min={"2023-01-01"}
                          onClick={hadndleShowDate}
                          className={`input101 ${
                            formik.errors.start_date &&
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
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Price</h3>
              </Card.Header>
              <Card.Body>
                {data ? (
                  <div className="table-container table-responsive">
                    <table className="table">
                      <colgroup>
                        {data?.head_array.map((_, index) => (
                          <col key={index} />
                        ))}
                      </colgroup>
                      <thead>
                        <tr>{renderTableHeader()}</tr>
                      </thead>
                      <tbody>{renderTableData()}</tbody>
                    </table>
                  </div>
                ) : (
                  ""
                )}
              </Card.Body>
              <Card.Footer>
                {data ? (
                  <div className="text-end notification-class">
                    <div className="Notification">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={SendNotification}
                      />
                      <label htmlFor="email" className="form-label ms-2 ">
                        Send Notification
                      </label>
                    </div>
                    <button
                      className="btn btn-primary me-2"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(FuelPrices);
