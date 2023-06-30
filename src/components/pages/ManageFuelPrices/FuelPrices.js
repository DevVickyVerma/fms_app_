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
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [headingData, setheadingData] = useState([]);

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
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      SuccessToast("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorToast(errorMessage);
    }
  }
  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData(response.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleSubmit1 = async (values) => {
    try {
      const formData = new FormData();
      formData.append("start_date", values.start_date);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);
  
      // ...
  
      const response1 = await getData(
        `site/fuel-price?client_id=${values.client_id}&company_id=${values.company_id}&drs_date=${values.start_date}`
      );
  
      const { data } = response1;
      if (data) {
        console.log(data.data.listing, "Drsdata");
        setheadingData(data.data.head_array);
  
        const responseData = data.data;
        
        const processedData = responseData.listing.map((item) => {
          const rowData = [
            item.site_name,
            ...item.fuels.map((fuel) => {
              const fuelPrice = fuel.price;
              setFuelPrice(fuelPrice);
              console.log(fuelPrice,"fuelPrice") // Set the fuel price in the state
              return fuelPrice;
            }),
          ];
          return Object.fromEntries(
            responseData.head_array.map((key, index) => [key, rowData[index]])
          );
        });
  
        const processedColumns = responseData.head_array.map((head) => ({
          name: head,
          selector: head,
        }));
  
        setData(processedData);
        setColumns(processedColumns);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  

  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      fuelPrice: "",
    },
    onSubmit: handleSubmit1, // Use handleSubmit1 instead of handleSubmit
  });
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fuelPrice, setFuelPrice] = useState("");

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
                <Formik
                  initialValues={{
                    client_id: "",
                    company_id: "",
                    site_id: "",
                    start_date: "",
                  }}
                  validationSchema={Yup.object({
                    client_id: Yup.string().required("Client is required"),
                    company_id: Yup.string().required("Company is required"),

                    start_date: Yup.date().required("Start Date is required"),
                  })}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({ handleSubmit, errors, touched, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
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

                                  const selectedClient = AddSiteData.data.find(
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
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Price</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <div className="table-responsive deleted-table">
                    <Row>
                      <Col lg={12} md={12}>
                        <div>
                         
                          <DataTable
                            columns={columns}
                            data={data}
                            striped
                            highlightOnHover
                            pagination
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    {editable ? (
                      <button
                        className="btn btn-primary"
                        type="submit"
                        disabled
                      >
                        Submit
                      </button>
                    ) : (
                      <button className="btn btn-primary" type="submit">
                        Submit
                      </button>
                    )}
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(FuelPrices);
