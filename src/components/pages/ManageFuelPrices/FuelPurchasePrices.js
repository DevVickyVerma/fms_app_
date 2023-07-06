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
  const [AddSiteData, setAddSiteData] = useState([]);


  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);


  const [editable, setis_editable] = useState(true);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );

  // const [selectedValues, setSelectedValues] = useState([]);

  // const handleChange = (event) => {
  //   setSelectedValues(event.target.value);
  //   console.log(event.target.value);
  // };

  const [selectedItems, setSelectedItems] = useState([]);
  
  const handleItemClick = (event) => {
    setSelectedItems(event.target.value);
    console.log(event.target.value);

    const selectedSiteNames = event.target.value;
    const filteredSites = selectedSiteList.filter((item) =>
      selectedSiteNames.includes(item.site_name)
    );
    console.log(filteredSites, "filteredSites");
    formik.setFieldValue("sites", filteredSites);
 
  };

  //   const [data, setData] = useState([
  //     {
  //       id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
  //       fuel_name: "Unleaded",
  //       platts_price: "0.000",
  //       premium_price: "0.000",
  //       development_fuels_price: "0.000",
  //       duty_price: "0.000",
  //       vat_percentage_rate: "0.000",
  //       ex_vat_price: "0.000",
  //       total: "0.000",
  //     },
  //     {
  //       id: "VEttejdBRlRMWDRnUTdlRkdLK1hrZz09",
  //       fuel_name: "Supreme Unleaded",
  //       platts_price: 56.12,
  //       premium_price: 0.9,
  //       development_fuels_price: 52.95,
  //       duty_price: "0.000",
  //       vat_percentage_rate: 20,
  //       ex_vat_price: 1.27,
  //       total: 1.27,
  //     },
  //     {
  //       id: "U2wrWHB3T0FOSXRvV2lDUXg3cktUdz09",
  //       fuel_name: "Diesel",
  //       platts_price: "0.000",
  //       premium_price: "0.000",
  //       development_fuels_price: "0.000",
  //       duty_price: "0.000",
  //       vat_percentage_rate: "0.000",
  //       ex_vat_price: "0.000",
  //       total: "0.000",
  //     },
  //     {
  //       id: "Q0hXRGNkeTllN1JSVWg1NFdDNjJodz09",
  //       fuel_name: "Supreme Diesel",
  //       platts_price: "0.000",
  //       premium_price: "0.000",
  //       development_fuels_price: "0.000",
  //       duty_price: "0.000",
  //       vat_percentage_rate: "0.000",
  //       ex_vat_price: "0.000",
  //       total: "0.000",
  //     },
  //     {
  //       id: "WmFLUWpCN2YrYnNpYVh3SkI0cDJ0UT09",
  //       fuel_name: "Adblue",
  //       platts_price: "0.000",
  //       premium_price: "0.000",
  //       development_fuels_price: "0.000",
  //       duty_price: "0.000",
  //       vat_percentage_rate: "0.000",
  //       ex_vat_price: "0.000",
  //       total: "0.000",
  //     },
  //   ]);
  const [data, setData] = useState();
  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));

    handleFetchData();

  }, [UserPermissions]);

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


  const handleSubmit = async (values) => {
    let clientIDCondition = "";
    if (localStorage.getItem("superiorRole") !== "Client") {
      clientIDCondition = `client_id=${values.client_id}&`;
    } else {
      clientIDCondition = `client_id=${clientIDLocalStorage}&`;
    }

    try {
      const response = await getData(
        `site/fuel/purchase-price?client_id=${values.client_id}=&company_id=${values.company_id}&date=${values.start_date}&site_id${values.site_id}`
      );
      const { data } = response;
      if (data) {
        console.log(data.data);

        setData(data?.data);
        const formValues = data?.data.map((item) => {
          return {
            id: item.id,
            fuel_name: item.fuel_name,
            platts_price: item.platts_price,
            premium_price: item.premium_price,
            development_fuels_price: item.development_fuels_price,
            duty_price: item.duty_price,
            vat_percentage_rate: item.vat_percentage_rate,
            ex_vat_price: item.ex_vat_price,
            total: item.total,
          };
        });

        formik.setFieldValue("data", formValues);

        console.log(formik.values.data, "valuesss");
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle error if the API call fails
    }
  };
  const calculateExVatPrice = (index) => {
    const plattsPrice = parseFloat(formik.values.data[index].platts_price) || 0;
    const premiumPrice =
      parseFloat(formik.values.data[index].premium_price) || 0;
    const developmentFuelsPrice =
      parseFloat(formik.values.data[index].development_fuels_price) || 0;
    const dutyPrice = parseFloat(formik.values.data[index].duty_price) || 0;

    const sum = plattsPrice + premiumPrice + developmentFuelsPrice + dutyPrice;
    console.log(sum, "sum");
    const exVatPrice = (sum * 1.2).toFixed(2);

    formik.setFieldValue(`data[${index}].ex_vat_price`, exVatPrice);
  };
  const calculateExVatPrice1 = (index) => {
    const data = formik.values.data[index];

    // Perform the calculations
    const plattsPrice = parseFloat(data.platts_price) || 0;
    const premiumPrice = parseFloat(data.premium_price) || 0;
    const developmentFuelsPrice = parseFloat(data.development_fuels_price) || 0;
    const dutyPrice = parseFloat(data.duty_price) || 0;
    const vatPercentageRate = parseFloat(data.vat_percentage_rate) || 0;

    const sum = plattsPrice + premiumPrice + developmentFuelsPrice + dutyPrice;

    console.log("Sum:", sum); // Log the value of sum to the console

    let exVatPrice = 0;
    if (vatPercentageRate !== 0) {
      exVatPrice = sum / 100 / vatPercentageRate;
    }

    // Update the formik values with the calculated result
    formik.setFieldValue(`data[${index}].total`, exVatPrice);
  };


  // const [SumTotal, setTotal] = useState();
  // const sendEventWithName = (event, name) => {
  //   const plattsValue = parseFloat(formik.values.platts_price) || 0;
  //   const premiumValue = parseFloat(formik.values.premium_price) || 0;
  //   const dutty = parseFloat(formik.values.dutty) || 0;
  //   const developmentfuels = parseFloat(formik.values.development_fuels_price) || 0;
  //   const sum = (plattsValue + premiumValue + developmentfuels + dutty) / 100;
  //   setTotal(sum)
  //   formik.setFieldValue(`ex_vat_price`, sum);
  //   console.log(`Value of ${name}:`, event.target.value);
  //   console.log(`Sum of platts and premium (divided by 100):`, sum);
  //   console.log(`Value of ${name}:`, event.target.value);
  // }
  // const sendEventWithName1 = (event, name) => {
  //   console.log(SumTotal,"SumTotal")
  
  //   const plattsValue = parseFloat(formik.values.vat_percentage_rate) || 0;
  //   const sum = (SumTotal*plattsValue) / 100+ SumTotal ;
  //   formik.setFieldValue(`total`, sum);
  //   console.log(sum,"SumTotal")

  // };









  const columns = [
    {
      name: "FUEL NAME",
      selector: (row) => row.fuel_name,
      sortable: false,
      width: "12.5%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row.fuel_name !== undefined ? `${row.fuel_name}` : ""}
        </span>
      ),
    },
    {
      name: "PLATTS",
      selector: (row) => row.platts_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.platts_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`platts_price-${index}`}
              name={`data[${index}].platts_price`}
              className="table-input"
              //   className={
              //     row.update_platts_price
              //       ? "UpdateValueInput"
              //       : editable?.is_editable
              //       ? "table-input"
              //       : "table-input readonly"
              //   }
              value={
                formik?.values?.data && formik.values.data[index]?.platts_price
              }
              onChange={(event) => {
                formik.handleChange(event);
                calculateExVatPrice(index);
              }}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "PREMIUM",

      selector: (row) => row.premium_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.premium_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`premium_price-${index}`}
              name={`data[${index}].premium_price`}
              className="table-input"
              //   className={
              //     row.update_premium_price
              //       ? "UpdateValueInput"
              //       : editable?.is_editable
              //       ? "table-input"
              //       : "table-input readonly"
              //   }
              value={
                formik?.values?.data && formik.values.data[index]?.premium_price
              }
              onChange={(event) => {
                formik.handleChange(event);
                calculateExVatPrice(index);
              }}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "	DEVELOPMENT FUELS ",
      selector: (row) => row.development_fuels_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.development_fuels_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`development_fuels_price-${index}`}
              name={`data[${index}].development_fuels_price`}
              className="table-input"
              //   className={
              //     row.update_development_fuels_price
              //       ? "UpdateValueInput"
              //       : editable?.is_editable
              //       ? "table-input"
              //       : "table-input readonly"
              //   }
              value={
                formik?.values?.data &&
                formik.values.data[index]?.development_fuels_price
              }
              onChange={(event) => {
                formik.handleChange(event);
                calculateExVatPrice(index);
              }}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "DUTY ",
      selector: (row) => row.duty_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.duty_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`duty_price-${index}`}
              name={`data[${index}].duty_price`}
              className="table-input"
              //   className={
              //     row.update_duty_price
              //       ? "UpdateValueInput"
              //       : editable?.is_editable
              //       ? "table-input"
              //       : "table-input readonly"
              //   }
              value={
                formik?.values?.data && formik.values.data[index]?.duty_price
              }
              onChange={(event) => {
                formik.handleChange(event);
                calculateExVatPrice(index);
              }}
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },

    {
      name: "EX VAT",
      selector: (row) => row.ex_vat_price,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.ex_vat_price}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`ex_vat_price-${index}`}
              name={`data[${index}].ex_vat_price`}
              className="table-input readonly"
              //   className={
              //     row.ex_vat_price
              //       ? "UpdateValueInput"
              //       : editable?.is_editable
              //       ? "table-input"
              //       : "table-input readonly"
              //   }
              value={
                formik?.values?.data && formik.values.data[index]?.ex_vat_price
              }
              onChange={formik.handleChange}
              readOnly
              onBlur={formik.handleBlur}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "VAT %",
      selector: (row) => row.vat_percentage_rate,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.vat_percentage_rate}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`vat_percentage_rate-${index}`}
              name={`data[${index}].vat_percentage_rate`}
              className="table-input readonly"
              //   className={
              //     row.vat_percentage_rate
              //       ? "UpdateValueInput"
              //       : editable?.is_editable
              //       ? "table-input"
              //       : "table-input readonly"
              //   }
              value={
                formik?.values?.data &&
                formik.values.data[index]?.vat_percentage_rate
              }
              //   onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onChange={(event) => {
                formik.handleChange(event);
                calculateExVatPrice1(index);
              }}
            />
            {/* Error handling code */}
          </div>
        ),
    },
    {
      name: "TOTAL",
      selector: (row) => row.total,
      sortable: false,
      width: "12.5%",
      center: true,

      cell: (row, index) =>
        row.fuel_name === "Total" ? (
          <h4 className="bottom-toal">{row.total}</h4>
        ) : (
          <div>
            <input
              type="number"
              id={`total-${index}`}
              name={`data[${index}].total`}
              className="table-input readonly"
              //   className={
              //     row.total
              //       ? "UpdateValueInput"
              //       : editable?.is_editable
              //       ? "table-input"
              //       : "table-input readonly"
              //   }
              value={formik?.values?.data && formik.values.data[index]?.total}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              readOnly
            />
            {/* Error handling code */}
          </div>
        ),
    },

    // ... remaining columns
  ];

  const tableDatas = {
    columns,
    data,
  };
  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      start_date: "",
    },
    validationSchema: Yup.object({
      client_id: Yup.string().required("Client is required"),
      company_id: Yup.string().required("Company is required"),

      start_date: Yup.date().required("Start Date is required"),
    }),

    onSubmit: handleSubmit,
  });
 






  const handleSubmitForm1 = async (event) => {
    event.preventDefault();
    console.log(formik.values, "ok");

    try {
      const formData = new FormData();
      formik.values.data.forEach((obj) => {
        const id = obj.id;
        const platts_price = `platts_price[${id}]`;
        const premium_price = `premium_price[${id}]`;
        const development_fuels_price = `development_fuels_price[${id}]`;
        const duty_price = `duty_price[${id}]`;
        const vat_percentage_rate = `vat_percentage_rate[${id}]`;
        const total = `total[${id}]`;
        const ex_vat_price = `ex_vat_price[${id}]`;

        const platts_price_Value = obj.platts_price;
        const premium_price_discount = obj.premium_price;
        const development_fuels_price_nettValue = obj.development_fuels_price;
        const ex_vat_price_price = obj.ex_vat_price;
        const vat_percentage_rate_price = obj.vat_percentage_rate;

        const total_values = obj.total;
        const duty_price_salesValue = obj.duty_price;
        // const action = obj.action;

        formData.append(platts_price, platts_price_Value);
        formData.append(premium_price, premium_price_discount);
        formData.append(
          development_fuels_price,
          development_fuels_price_nettValue
        );
        formData.append(duty_price, duty_price_salesValue);
        formData.append(vat_percentage_rate, vat_percentage_rate_price);
        formData.append(ex_vat_price, ex_vat_price_price);
        formData.append(total, total_values);
      });

   

      formik.values.sites.forEach((site, index) => {
        formData.append(`site_id[${index}]`, site.id);
      });

      // formData.append("site_id", formik.values.sites);
      formData.append("date", formik.values.start_date);

      const postDataUrl = "/site/fuel/purchase-price/update";
      const navigatePath = "/business";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Purchase Cost Prices</h1>
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
                Purchase Cost Prices
              </Breadcrumb.Item>
            </Breadcrumb>
          
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
             
                <Link
                  to="/Add-purchase-prices"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Fuel Purchase
                </Link>
           
            </div>
          </div>
        </div>

     
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
          
            <Card.Header>
                <h3 className="card-title">Fuel Price calculator</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Card.Body>
                    <Row>
                      {localStorage.getItem("superiorRole") !== "Client" && (
                        <Col lg={3} md={6}>
                          <div clasName="form-group">
                            <label
                              htmlFor="client_id"
                              className=" form-label mt-4"
                            >
                              Client
                              <span className="text-danger">*</span>
                            </label>
                            <select
                              as="select"
                              className={`input101 ${
                                formik.errors.client_id &&
                                formik.touched.client_id
                                  ? "is-invalid"
                                  : ""
                              }`}
                              id="client_id"
                              name="client_id"
                              onChange={(e) => {
                                const selectedType = e.target.value;
                                formik.setFieldValue("client_id", selectedType);
                                setSelectedClientId(selectedType);

                                // Reset the selected company and site
                                setSelectedCompanyList([]);
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("site_id", "");
                                setSelectedItems([])
                                const selectedClient = AddSiteData.data.find(
                                  (client) => client.id === selectedType
                                );

                                if (selectedClient) {
                                  setSelectedCompanyList(
                                    selectedClient.companies
                                  );
                                  console.log(selectedClient, "selectedClient");
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
                      <Col lg={3} md={6}>
                        <div clasName="form-group">
                          <label
                            htmlFor="company_id"
                            className="form-label mt-4"
                          >
                            Company
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            as="select"
                            className={`input101 ${
                              formik.errors.company_id &&
                              formik.touched.company_id
                                ? "is-invalid"
                                : ""
                            }`}
                            id="company_id"
                            name="company_id"
                            onChange={(e) => {
                              const selectedCompany = e.target.value;
                              formik.setFieldValue(
                                "company_id",
                                selectedCompany
                              );
                              setSelectedItems([])
                              setSelectedSiteList([]);
                              const selectedCompanyData =
                                selectedCompanyList.find(
                                  (company) => company.id === selectedCompany
                                );
                              if (selectedCompanyData) {
                                setSelectedSiteList(selectedCompanyData.sites);
                                console.log(selectedCompanyData, "company_id");
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
                          </select>
                          {formik.errors.company_id &&
                            formik.touched.company_id && (
                              <div className="invalid-feedback">
                                {formik.errors.company_id}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col lg={3} md={6}>
                        <div classname="form-group">
                          <label htmlFor="site_id" className="form-label mt-4">
                            Site
                          </label>
                          <select
                            as="select"
                            className={`input101 ${
                              formik.errors.site_id && formik.touched.site_id
                                ? "is-invalid"
                                : ""
                            }`}
                            id="site_id"
                            name="site_id"
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
                          </select>
                          {formik.errors.site_id && formik.touched.site_id && (
                            <div className="invalid-feedback">
                              {formik.errors.site_id}
                            </div>
                          )}
                        </div>
                      </Col>

                      <Col lg={3} md={6}>
                        <div classname="form-group">
                          <label
                            htmlFor="start_date"
                            className="form-label mt-4"
                          >
                            Date
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className={`input101 ${
                              formik.errors.start_date &&
                              formik.touched.start_date
                                ? "is-invalid"
                                : ""
                            }`}
                            id="start_date"
                            name="start_date"
                            onChange={formik.handleChange}
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
                  </Card.Body>
                  <Card.Footer className="text-end">
                   
                    <button className="btn btn-primary me-2" type="submit">
                      Submit
                    </button>
                  </Card.Footer>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
          
              <Card.Body>
                <Col lg={6} md={6}>
                  {data ? (
                    <FormControl className="width">
                      <InputLabel>Select Sites</InputLabel>
                      <Select
                        multiple
                        value={selectedItems}
                        onChange={handleItemClick}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        <MenuItem disabled value="">
                          <em>Select items</em>
                        </MenuItem>
                        {selectedSiteList.map((item) => (
                          <MenuItem key={item.site_name} value={item.site_name}>
                            <Checkbox
                              checked={selectedItems.includes(item.site_name)}
                            />
                            <ListItemText primary={item.site_name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    ""
                  )}
                </Col>

                <form onSubmit={handleSubmitForm1}>
                  <div className="table-responsive deleted-table">
                    <DataTableExtensions {...tableDatas}>
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead
                        highlightOnHover
                        searchable={false}
                      />
                    </DataTableExtensions>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    {data ? <button className="btn btn-primary" type="submit">
                        Submit
                      </button>:""}
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
export default withApi(ManageDsr);
