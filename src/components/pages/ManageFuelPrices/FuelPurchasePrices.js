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
  const [AddSiteData1, setAddSiteData1] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [selectedClientId1, setSelectedClientId1] = useState("");
  const [selectedFuelName, setselectedFuelName] = useState("");
  const [selectedCompanyList1, setSelectedCompanyList1] = useState([]);
  const [selectedSiteList1, setSelectedSiteList1] = useState([]);

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
  const [selectedItems1, setSelectedItems1] = useState([]);

  const handleItemClick = (event) => {
    setSelectedItems(event.target.value);
    console.log(event.target.value);
    formik.setFieldValue("sites", event.target.value);
  };
  const handleItemClick1 = (event) => {
    setSelectedItems1(event.target.value);
    console.log(event.target.value);
    formik2.setFieldValue("sites", event.target.value);
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
    handleFetchName();
  }, [UserPermissions]);

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData(response.data);
        setAddSiteData1(response.data);

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
  const handleFetchName = async () => {
    try {
      const response = await getData("/business/subcategory");

      const { data } = response;
      if (data) {
        console.log(data);
        setselectedFuelName(data)
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
  const secondValidationSchema = Yup.object({
    client_id1: Yup.string().required("Client is required"),
    company_id1: Yup.string().required("Company is required"),
    start_date1: Yup.date().required("Start Date is required"),
    platts: Yup.string().required("Platts is required"),
    developmentfuels: Yup.string().required("Development Fuels is required"),
    dutty: Yup.string().required("Dutty  is required"),

    vat: Yup.string().required("Vat % is required"),

    premium: Yup.string().required("Premium is required"),
    // fuel_name: Yup.string().required("Fuel is required"),
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
      exvat: "20",
      vat: "",
      total: "20",
      premium: "",
      fuel_name: "",
    },
    validationSchema: secondValidationSchema,
    onSubmit: (values) => {
      handleSubmit2(values);
    },
  });

  // const handleSubmit2 = async (event) => {
  //   event.preventDefault();

  //   console.log(formik.values, "ok");
  // };

  const handleSubmit2 = async (values) => {
    console.log(values)
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
      values.sites.forEach((siteId, index) => {
        formData.append(`site_id[${index}]`, siteId);
      });
   

      const postDataUrl = "/site/fuel/purchase-price/add";
      const navigatePath = "/business";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

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

      formik.values.sites.forEach((siteId, index) => {
        formData.append(`site_id[${index}]`, siteId);
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
                    <Col lg={3} md={6}>
                      <div className="form-group">
                        <label htmlFor="client_id1" className="form-label mt-4">
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
                            console.log(selectedType1);
                            formik2.setFieldValue("client_id1", selectedType1);
                            setSelectedClientId1(selectedType1);

                            // Reset the selected company and site
                            setSelectedCompanyList1([]);
                            formik2.setFieldValue("company_id1", "");
                            formik2.setFieldValue("site_id1", "");
                            console.log(AddSiteData1, "AddSiteData1");
                            const selectedClient1 = AddSiteData1.data.find(
                              (client) => client.id === selectedType1
                            );
                            console.log(selectedClient1, "selectedClient1");
                            if (selectedClient1) {
                              setSelectedCompanyList1(
                                selectedClient1.companies
                              );
                              console.log(selectedClient1, "selectedClient");
                              console.log(
                                selectedClient1.companies,
                                "selectedClient"
                              );
                            }
                          }}
                        >
                          <option value="">Select a Client</option>
                          {AddSiteData1.data && AddSiteData1.data.length > 0 ? (
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

                            setSelectedSiteList1([]);
                            const selectedCompanyData1 =
                              selectedCompanyList1.find(
                                (company) => company.id === selectedCompany1
                              );
                            if (selectedCompanyData1) {
                              setSelectedSiteList1(selectedCompanyData1.sites);
                              console.log(selectedCompanyData1, "company_id");
                              console.log(
                                selectedCompanyData1.sites,
                                "company_id"
                              );
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
                              <MenuItem key={item.id} value={item.id}>
                                <Checkbox
                                  checked={selectedItems1.includes(item.id)}
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
                        <label htmlFor="fuel_id" className="form-label mt-4">
                          Fuel Name
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          as="select"
                          className={`input101 ${
                            formik.errors.fuel_name && formik.touched.fuel_name
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
                        {formik.errors.fuel_name &&
                          formik.touched.fuel_name && (
                            <div className="invalid-feedback">
                              {formik.errors.fuel_name}
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
                          value={formik2.values.developmentfuels || ""}
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
                          value={formik2.values.dutty || ""}
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
                  <Link className="btn btn-danger me-2" to={`/dashboard/`}>
                    Reset
                  </Link>
                  <button className="btn btn-primary me-2" type="submit">
                    Submit
                  </button>
                </Card.Footer>
              </form>
            </Card>
          </Col>
        </Row>
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
                </form>
              </Card.Body>
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
                          <MenuItem key={item.id} value={item.id}>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
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
                    {editable ? (
                      <button className="btn btn-primary" type="submit">
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
export default withApi(ManageDsr);
