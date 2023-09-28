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

import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
} from "@material-ui/core";

import { Button } from "bootstrap";

import withApi from "../../../Utils/ApiHelper";

import { useSelector } from "react-redux";

import * as Yup from "yup";
import { Dropdown } from "react-bootstrap";

import { useFormik } from "formik";
const ManageDsr = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const UserPermissions = useSelector((state) => state?.data?.data);

  const [AddSiteData1, setAddSiteData1] = useState([]);

  const [selectedClientId1, setSelectedClientId1] = useState("");
  const [selectedFuelName, setselectedFuelName] = useState("");
  const [selectedCompanyList1, setSelectedCompanyList1] = useState([]);
  const [selectedSiteList1, setSelectedSiteList1] = useState([]);

  const [editable, setis_editable] = useState(true);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );

  const [selectedItems1, setSelectedItems1] = useState([]);

  const handleItemClick1 = (event) => {
    setSelectedItems1(event.target.value);

    const selectedSiteNames = event.target.value;
    const filteredSites = selectedSiteList1.filter((item) =>
      selectedSiteNames.includes(item.site_name)
    );

    formik2.setFieldValue("sites", filteredSites);
  };

  const [SumTotal, setTotal] = useState();
  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));

    handleFetchData();
    handleFetchName();
  }, [UserPermissions]);

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData1(response.data);
        if (
          response?.data &&
          localStorage.getItem("superiorRole") === "Client"
        ) {
          const clientId = localStorage.getItem("superiorId");
          if (clientId) {
            setSelectedClientId1(clientId);

            setSelectedCompanyList1([]);

            if (response?.data) {
              const selectedClient = response?.data?.data?.find(
                (client) => client.id === clientId
              );
              if (selectedClient) {
                setSelectedCompanyList1(selectedClient?.companies);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleFetchName = async () => {
    try {
      const response = await getData("/business/subcategory");

      const { data } = response;
      if (data) {
        setselectedFuelName(data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const secondValidationSchema = Yup.object({
    company_id1: Yup.string().required("Company is required"),
    start_date1: Yup.date()
      .required("Start Date is required")
      .min(
        new Date("2023-01-01"),
        "Start Date cannot be before January 1, 2023"
      ),
    platts: Yup.string().required("Platts is required"),
    developmentfuels: Yup.string().required("Development Fuels is required"),
    dutty: Yup.string().required("Dutty  is required"),

    vat: Yup.string().required("Vat % is required"),

    premium: Yup.string().required("Premium is required"),
    fuel_name: Yup.string().required("Fuel is required"),
  });

  const formik2 = useFormik({
    initialValues: {
      client_id1: "",
      company_id1: "",
      site_id1: "",
      start_date1: "",
      platts: "",
      developmentfuels: "",
      dutty: "",
      exvat: "",
      vat: "",
      total: "",
      premium: "",
      fuel_name: "",
    },
    validationSchema: secondValidationSchema,
    onSubmit: (values) => {
      handleSubmit2(values);
    },
  });

  const handleSubmit2 = async (values) => {
    try {
      const formData = new FormData();

      formData.append("platts_price", values.platts);
      formData.append("premium_price", values.premium);
      formData.append("development_fuels_price", values.developmentfuels);
      formData.append("duty_price", values.dutty);
      formData.append("vat_percentage_rate", values.vat);
      formData.append("ex_vat_price", values.exvat);
      formData.append("total", values.total);
      formData.append("date", values.start_date1);
      formData.append("fuel_id", values.fuel_name);
      values.sites.forEach((site, index) => {
        formData.append(`site_id[${index}]`, site.id);
      });

      const postDataUrl = "/site/fuel/purchase-price/add";

      const navigatePath = `/fuel-purchase-prices`;
      await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  // Calculate the total whenever the input values change

  const sendEventWithName = (event, name) => {
    formik2.setFieldValue("total", 0);
    formik2.setFieldValue("vat", "");
    const plattsValue = parseFloat(formik2.values.platts) || 0;
    const premiumValue = parseFloat(formik2.values.premium) || 0;
    const dutty = parseFloat(formik2.values.dutty) || 0;
    const developmentfuels = parseFloat(formik2.values.developmentfuels) || 0;
    const sum = (plattsValue + premiumValue + developmentfuels + dutty) / 100;
    setTotal(sum);
    const roundedSum = sum.toFixed(2);

    formik2.setFieldValue(`exvat`, roundedSum);
  };

  const sendEventWithName1 = (event, name) => {
    const plattsValue = parseFloat(formik2.values.vat) || 0;

    const sum = (SumTotal * plattsValue) / 100 + SumTotal;
    const roundedSum = Math.round(sum * 100) / 100; // Round to two decimal places
    const formattedSum = roundedSum.toFixed(2).padEnd(5, "0");
    formik2.setFieldValue("total", formattedSum);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate() - 1).padStart(2, "0"); // Subtract one day from the current date
    return `${year}-${month}-${day}`;
  };
  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };
  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Add Site Fuel Purchase price</h1>
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
                Add Site Fuel Purchase price
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Add Site Fuel Purchase price</h3>
              </Card.Header>
              <form onSubmit={(event) => formik2.handleSubmit(event)}>
                <Card.Body>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={3} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id1"
                            className="form-label mt-4"
                          >
                            Client
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            as="select"
                            className={`input101 ${
                              formik2.errors.client_id1 &&
                              formik2.touched.client_id1
                                ? "is-invalid"
                                : ""
                            }`}
                            id="client_id1"
                            name="client_id1"
                            onChange={(e) => {
                              const selectedType1 = e.target.value;

                              formik2.setFieldValue(
                                "client_id1",
                                selectedType1
                              );
                              setSelectedClientId1(selectedType1);
                              setSelectedItems1([]);
                              // Reset the selected company and site
                              setSelectedCompanyList1([]);
                              formik2.setFieldValue("company_id1", "");
                              formik2.setFieldValue("site_id1", "");

                              const selectedClient1 = AddSiteData1.data.find(
                                (client) => client.id === selectedType1
                              );

                              if (selectedClient1) {
                                setSelectedCompanyList1(
                                  selectedClient1.companies
                                );
                              }
                            }}
                          >
                            <option value="">Select a Client</option>
                            {AddSiteData1.data &&
                            AddSiteData1.data.length > 0 ? (
                              AddSiteData1.data.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.client_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>No Client</option>
                            )}
                          </select>

                          {formik2.errors.client_id1 &&
                            formik2.touched.client_id1 && (
                              <div className="invalid-feedback">
                                {formik2.errors.client_id1}
                              </div>
                            )}
                        </div>
                      </Col>
                    )}
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="company_id1"
                          className="form-label mt-4"
                        >
                          Company
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${
                            formik2.errors.company_id1 &&
                            formik2.touched.company_id1
                              ? "is-invalid"
                              : ""
                          }`}
                          id="company_id1"
                          name="company_id1"
                          onChange={(e) => {
                            const selectedCompany1 = e.target.value;
                            formik2.setFieldValue(
                              "company_id1",
                              selectedCompany1
                            );
                            setSelectedItems1([]);
                            setSelectedSiteList1([]);
                            const selectedCompanyData1 =
                              selectedCompanyList1.find(
                                (company) => company.id === selectedCompany1
                              );
                            if (selectedCompanyData1) {
                              setSelectedSiteList1(selectedCompanyData1.sites);
                            }
                          }}
                        >
                          <option value="">Select a Company</option>
                          {selectedCompanyList1.length > 0 ? (
                            selectedCompanyList1.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.company_name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No Company</option>
                          )}
                        </select>
                        {formik2.errors.company_id1 &&
                          formik2.touched.company_id1 && (
                            <div className="invalid-feedback">
                              {formik2.errors.company_id1}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <FormControl className="width mt-4">
                          <InputLabel>Select Sites</InputLabel>
                          <Select
                            multiple
                            value={selectedItems1}
                            onChange={handleItemClick1}
                            renderValue={(selected) => selected.join(", ")}
                          >
                            {selectedSiteList1.map((item) => (
                              <MenuItem
                                key={item.site_name}
                                value={item.site_name}
                              >
                                <Checkbox
                                  checked={selectedItems1.includes(
                                    item.site_name
                                  )}
                                />
                                <ListItemText primary={item.site_name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="start_date1"
                          className="form-label mt-4"
                        >
                          Date
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          min={"2023-01-01"}
                          max={getCurrentDate()}
                          onClick={hadndleShowDate}
                          className={`input101 ${
                            formik2.errors.start_date1 &&
                            formik2.touched.start_date1
                              ? "is-invalid"
                              : ""
                          }`}
                          id="start_date1"
                          name="start_date1"
                          onChange={formik2.handleChange}
                        />
                        {formik2.errors.start_date1 &&
                          formik2.touched.start_date1 && (
                            <div className="invalid-feedback">
                              {formik2.errors.start_date1}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={3} md={12}>
                      <div classname="form-group">
                        <label htmlFor="fuel_name" className="form-label mt-4">
                          Fuel Name
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${
                            formik2.errors.fuel_name &&
                            formik2.touched.fuel_name
                              ? "is-invalid"
                              : ""
                          }`}
                          id="fuel_name"
                          name="fuel_name"
                          onChange={formik2.handleChange}
                          value={formik2.values.fuel_name}
                        >
                          <option value="">Select Fuel Name</option>

                          {selectedFuelName ? (
                            selectedFuelName?.data.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.sub_category_name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No Client</option>
                          )}
                        </select>
                        {formik2.errors.fuel_name &&
                          formik2.touched.fuel_name && (
                            <div className="invalid-feedback">
                              {formik2.errors.fuel_name}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label className=" form-label mt-4" htmlFor="platts">
                          Platts<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${
                            formik2.errors.platts && formik2.touched.platts
                              ? "is-invalid"
                              : ""
                          }`}
                          id="platts"
                          name="platts"
                          placeholder="Platts"
                          onChange={formik2.handleChange}
                          value={formik2.values.platts}
                          onBlur={(event) => {
                            formik2.handleBlur(event);
                            sendEventWithName(event, "platts");
                          }}
                        />
                        {formik2.errors.platts && formik2.touched.platts && (
                          <div className="invalid-feedback">
                            {formik2.errors.platts}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label className=" form-label mt-4" htmlFor="premium">
                          Premium <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${
                            formik2.errors.premium && formik2.touched.premium
                              ? "is-invalid"
                              : ""
                          }`}
                          id="premium"
                          name="premium"
                          placeholder="Premium"
                          onChange={formik2.handleChange}
                          value={formik2.values.premium}
                          onBlur={(event) => {
                            formik2.handleBlur(event);
                            sendEventWithName(event, "premium");
                          }}
                        />
                        {formik2.errors.premium && formik2.touched.premium && (
                          <div className="invalid-feedback">
                            {formik2.errors.premium}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label
                          className=" form-label mt-4"
                          htmlFor="developmentfuels"
                        >
                          Development Fuels
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${
                            formik2.errors.developmentfuels &&
                            formik2.touched.developmentfuels
                              ? "is-invalid"
                              : ""
                          }`}
                          id="developmentfuels"
                          name="developmentfuels"
                          placeholder=" Development Fuels"
                          onChange={formik2.handleChange}
                          value={formik2.values.developmentfuels}
                          onBlur={(event) => {
                            formik2.handleBlur(event);
                            sendEventWithName(event, "developmentfuels");
                          }}
                        />
                        {formik2.errors.developmentfuels &&
                          formik2.touched.developmentfuels && (
                            <div className="invalid-feedback">
                              {formik2.errors.developmentfuels}
                            </div>
                          )}
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label className=" form-label mt-4" htmlFor="dutty">
                          Dutty <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${
                            formik2.errors.dutty && formik2.touched.dutty
                              ? "is-invalid"
                              : ""
                          }`}
                          id="dutty"
                          name="dutty"
                          placeholder="Dutty"
                          onChange={formik2.handleChange}
                          value={formik2.values.dutty}
                          onBlur={(event) => {
                            formik2.handleBlur(event);
                            sendEventWithName(event, "dutty");
                          }}
                        />
                        {formik2.errors.dutty && formik2.touched.dutty && (
                          <div className="invalid-feedback">
                            {formik2.errors.dutty}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label className=" form-label mt-4" htmlFor="exvat">
                          Ex Vat<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className="table-input readonly"
                          id="exvat"
                          name="exvat"
                          placeholder="Ex Vat"
                          onChange={formik2.handleChange}
                          value={formik2.values.exvat}
                          readOnly
                        />
                        {formik2.errors.exvat && formik2.touched.exvat && (
                          <div className="invalid-feedback">
                            {formik2.errors.exvat}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label className=" form-label mt-4" htmlFor="vat">
                          Vat % <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className={`input101 ${
                            formik2.errors.vat && formik2.touched.vat
                              ? "is-invalid"
                              : ""
                          }`}
                          id="vat"
                          name="vat"
                          placeholder="Vat%"
                          onChange={formik2.handleChange}
                          value={formik2.values.vat}
                          onBlur={(event) => {
                            formik2.handleBlur(event);
                            sendEventWithName1(event, "dutty");
                          }}
                        />
                        {formik2.errors.vat && formik2.touched.vat && (
                          <div className="invalid-feedback">
                            {formik2.errors.vat}
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label className=" form-label mt-4" htmlFor="total">
                          Total <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          autoComplete="off"
                          className="table-input readonly"
                          id="total"
                          name="total"
                          placeholder="Total"
                          onChange={formik2.handleChange}
                          value={formik2.values.total}
                          readOnly
                        />
                        {formik2.errors.total && formik2.touched.total && (
                          <div className="invalid-feedback">
                            {formik2.errors.total}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="text-end">
                  <Link
                    className="btn btn-danger me-2"
                    to={`/fuel-purchase-prices/`}
                  >
                    Cancel
                  </Link>
                  <button className="btn btn-primary me-2" type="submit">
                    Submit
                  </button>
                </Card.Footer>
              </form>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageDsr);
