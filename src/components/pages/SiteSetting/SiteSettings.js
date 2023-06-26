import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  FormControl,
  ListGroup,
  Breadcrumb,
} from "react-bootstrap";

import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import withApi from "../../../Utils/ApiHelper";
import { Field } from "formik";

const SiteSettings = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate } = props;

  // const [data, setData] = useState()
  const [data, setData] = useState([]);
  const [DeductionData, setDeductionData] = useState([]);
  const [BussinesModelData, setBussinesModelData] = useState([]);
  const [CardsModelData, setCardsModelData] = useState([]);
  const [editable, setis_editable] = useState();
  const [fuelData, setFuelData] = useState([]);
  const [SiteItems, setSiteItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

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

  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
  
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      try {
        const response = await axiosInstance.get(`/site/get-setting-list/${id}`);
  
        const { data } = response;
        if (data) {
          setData(data?.data ? data.data.charges : []);
          setDeductionData(data?.data ? data.data.deductions : []);
          setFuelData(data?.data ? data.data.fuels : []);
          setSiteItems(data?.data ? data.data.site_items : []);
          setBussinesModelData(data?.data ? data.data.business_models : []);
          setCardsModelData(data?.data ? data.data.cards : []);
          setis_editable(data?.data ? data.data : {});
  
          const BussinesModelValues = data?.data?.business_models
            ? data.data.business_models.map((item) => ({
                id: item.id,
                BussinesModelName_name: item.item_name,
                // value_per: item.value_per,
                // Add other properties as needed
              }))
            : [];
          formik.setFieldValue("business_models", BussinesModelValues);
  
          const ChargesModelValues = data?.data?.charges
            ? data.data.charges.map((item) => ({
                id: item.id,
                charge_name: item.charge_name,
                charge_value: item.charge_value,
                admin: item.admin,
                operator: item.operator,
                checked: item.checked, // Use item.checked directly instead of a function
              }))
            : [];
  
          formik.setFieldValue("data", ChargesModelValues);
  
          const deductionFormValues = DeductionData.map((item) => ({
            id: item.id,
            deduction_value: item.deduction_value,
            deduction_name: item.deduction_name,
            admin: item.admin,
            operator: item.operator,
            checked: item.checked, // Use item.checked directly instead of a function
            // Add other properties as needed
          }));
  
          formik.setFieldValue("deductions", deductionFormValues);
  
          const FuelDataFormValues = fuelData.map((item) => ({
            id: item.id,
            fuel_name: item.fuel_name,
            checked: item.checked, // Use item.checked directly instead of a function
          }));
  
          formik.setFieldValue("FuelFormik", FuelDataFormValues);
  
          const SiteItemsFormValues = SiteItems.map((item, index) => ({
            id: item.id,
            dept_name: item.dept_name,
            price: item.price,
            checked: index === 0, // Set checked to true for the first item (index 0) and false for the rest
          }));
  
          formik.setFieldValue("SiteItemsFormik", SiteItemsFormValues);
  
          const CardsModelValues = data?.data?.cards
            ? data.data.cards.map((item) => ({
                id: item.id,
                card_name: item.card_name,
                // value_per: item.value_per,
                // Add other properties as needed
              }))
            : [];
  
          const initialValues = {
            data: ChargesModelValues,
            deductions: deductionFormValues,
            FuelFormik: FuelDataFormValues,
            SiteItemsFormik: SiteItemsFormValues,
            cardList: CardsModelValues,
            FuelList: [],
            FuessslList: [],
            vicky: [],
            // Add other initial values if needed
          };
          formik.setValues(initialValues);
        }
      } catch (error) {
        console.error("API error:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [id]); // Removed 'SiteID' and 'ReportDate' dependencies as they are not defined in the code snippet
  
  const handleSubmit = async (values, deductionFormValues) => {
    const token = localStorage.getItem("token");

    // Create a new FormData object
    const formData = new FormData();
    console.log(values,"values")

    for (const obj of values.data) {
      const { id, charge_value } = obj;
      const charge_valueKey = `charge[${id}]`;

      formData.append(charge_valueKey, charge_value);
    }

    for (const deductionObj of values.deductions) {
      const { id, deduction_value } = deductionObj;
      const deductionValueKey = `deduction[${id}]`;

      formData.append(deductionValueKey, deduction_value);
    }

    formData.append("fuels", SiteID);
    formData.append("site_id", SiteID);
    formData.append("drs_date", ReportDate);

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/shop-sale/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json(); // Read the response once

      if (response.ok) {
        SuccessToast(responseData.message);
      } else {
        ErrorToast(responseData.message);

        // Handle specific error cases if needed
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    data: data,
  
  };

  const formik = useFormik({
    initialValues,

    onSubmit: handleSubmit,
    // ... Add other Formik configuration options as needed
  });

  const chargesColumns = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "5%",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={() => handleChargeCheckboxChange(row)}
        />
      ),
    },
    {
      name: "CHARGE GROUPS",
      width: "40%",
      selector: (row) => row.charge_name,
      sortable: true,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.charge_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => row.charge_value,
      sortable: false,
      width: "20%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`charge_value-${index}`}
            name={`data[${index}].charge_value`}
            className={"table-input"}
            value={formik.values?.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Admin",
      selector: (row) => row.admin,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input
              type="radio"
              name={`radioButton_${index}`}
              onChange={() => handleRadiochargesmodel(row, 0)}
            />
          </div>
        </div>
      ),
    },
    {
      name: "Operator",
      selector: (row) => row.operator,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input
              type="radio"
              name={`radioButton_${index}`}
              onChange={() => handleRadiochargesmodel(row, 1)}
            />
          </div>
        </div>
      ),
    },
  ];
  const handleRadiochargesmodel = (row, value) => {
    const updatedData = formik.values.data.map((item) => {
      if (item.id === row.id) {
        const updatedItem = {
          ...item,
          admin: value === 0 ? "true" : "false",
          operator: value === 1 ? "true" : "false",
        };
        console.log(updatedItem); // Log the clicked item value
        return updatedItem;
      }
      return item;
    });

    formik.setFieldValue("data", updatedData);
  };

  // Rest of your code

  const deductionsColumns = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "5%",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={() => handleChargeCheckboxChange(row)}
        />
      ),
    },
    {
      name: "DEDUCTION GROUPS",
      selector: (row) => row.deduction_name,
      sortable: true,
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row) => row.deduction_value,
      sortable: false,
      width: "20%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`deduction_value-${index}`}
            name={`deductions[${index}].deduction_value`}
            className="table-input"
            value={formik.values?.deductions?.[index]?.deduction_value ?? 0}
            // value={formik.values?.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },

    {
      name: "Admin",
      selector: (row) => row.business_model_types?.[0]?.id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input
              type="radio"
              name={`radioButton_${index}`}
              checked={row.business_model_types?.[0]?.checked}
              onChange={() => handleRadioDeductionsModel(row, 0)}
            />
          </div>
        </div>
      ),
    },
    {
      name: "Operator",
      selector: (row) => row.business_model_types?.[1]?.id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input
              type="radio"
              name={`radioButton_${index}`}
              checked={row.business_model_types?.[1]?.checked}
              onChange={() => handleRadioDeductionsModel(row, 1)}
            />
          </div>
        </div>
      ),
    },
  ];
  const SiteItemsColumn = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "15%",
      cell: (row) => (
        <input type="checkbox" onChange={() => handleCheckboxChange(row)} />
      ),
    },
    {
      name: "Department Name",
      selector: (row) => row.dept_name,
      sortable: true,
      width: "55%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.dept_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: false,
      width: "30%",
      center: true,
      cell: (row, index) => (
        <div>
          <input
            type="number"
            id={`price-${index}`}
            name={`SiteItemsFormik[${index}].price`}
            className="table-input"
            value={formik.values?.SiteItemsFormik?.[index]?.price ?? 0}
            // value={formik.values?.data[index]?.charge_value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            // readOnly={editable?.is_editable ? false : true}
          />
          {/* Error handling code */}
        </div>
      ),
    },
  
  ];

  const BussinesModelColumn = [
    {
      name: "Business Models",
      selector: (row) => row.item_name,
      sortable: true,
      
      width: "40%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.item_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Charge Rent",
      selector: (row) => row.business_model_types[0].id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input
              type="radio"
              name={`radioButton_${row.id}_${index}`}
              checked={
                row.business_model_types &&
                row.business_model_types[0] &&
                row.business_model_types[0].checked
              }
              onChange={() => handleRadioBussinessmodel(row, 0)}
            />
          </div>
        </div>
      ),
    },
    {
      name: "Pay Commission",
      selector: (row) => row.business_model_types[1].id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input
              type="radio"
              name={`radioButton_${row.id}_${index}`}
              checked={
                row.business_model_types &&
                row.business_model_types[1] &&
                row.business_model_types[1].checked
              }
              onChange={() => handleRadioBussinessmodel(row, 1)}
            />
          </div>
        </div>
      ),
    },
    {
      name: "Direct Managed",
      selector: (row) => row.business_model_types[2].id,
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-auto">
            <input
              type="radio"
              name={`radioButton_${row.id}_${index}`}
              checked={
                row.business_model_types &&
                row.business_model_types[2] &&
                row.business_model_types[2].checked
              }
              onChange={() => handleRadioBussinessmodel(row, 2)}
            />
          </div>
        </div>
      ),
    },
  ];

  const CardsModelColumn = [

    {
      name: "Card Model",
      selector: (row) => row.card_name,
      sortable: true,
      width: "80%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.card_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      selector: (row) => row.id,
      center: true,
      width: "20%",
      cell: (row) => (
        <div>
          <input
            type="checkbox"
            onChange={(event) => handlecardCheckboxChange(event, row)}
          />
        </div>
      ),
    },

   
   
  ];
  const FuelsModelColumn = [
    {
      name: "Fuel Name",
      selector: (row) => row.fuel_name,
      sortable: true,
      width: "60%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.fuel_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Select",
     
      sortable: false,
      selector: (row) => row.id,
      center: true,
      width: "40%",
      cell: (row) => (
        <div>
          <input
            type="checkbox"
            onChange={(event) => handlefuelCheckboxChange(event, row)}
          />
        </div>
      ),
    },
  
  
  ];

  // Define an array to store the combined objects
  let combinedObjects = [];

  const handleRadioBussinessmodel = (row, index) => {
    const updatedData = BussinesModelData.map((item) => {
      if (item.id === row.id) {
        const updatedTypes = item.business_model_types.map((model, i) => {
          const isChecked = i === index;
          if (isChecked !== model.checked) {
            // Toggle the checked property if it's different from isChecked
            return {
              ...model,
              checked: isChecked,
            };
          }
          return model;
        });

        // Filter and push the checked types to the array
        const checkedTypes = updatedTypes
          .filter((model) => model.checked)
          .map((model) => ({
            item_name: row.item_name,
            id: row.id,
            model_name: model.model_name, // Add the model_name property
            model_id: model.id, // Add the model_id property
          }));

        // Combine the checkedTypes array with the existing combinedObjects array
        combinedObjects = [...combinedObjects, ...checkedTypes];

        console.log("Combined Objects:", combinedObjects);
        console.log(typeof combinedObjects);

        return {
          ...item,
          business_model_types: updatedTypes,
        };
      }

      return item;
    });
    formik.setFieldValue("data", updatedData);
    setBussinesModelData(updatedData);

    // ... rest of your code ...
  };

  const handleRadiocardButtonChange = (row, index) => {
    console.log(`Card ID: ${row.id}, Card Name: ${row.card_name}`);

    const updatedData = CardsModelData.map((item, i) => {
      const isChecked = i === index;

      return {
        ...item,
        checked: isChecked,
      };
    });

    formik.setFieldValue("card_models", updatedData);
  };
  const handleRadioDeductionsModel = (row, value) => {
    const deductions = formik.values?.deductions;

    if (deductions && Array.isArray(deductions)) {
      const updatedDeductions = deductions.map((item) => {
        if (item.id === row.id) {
          return {
            ...item,
            admin: value === 0 ? "true" : "false",
            operator: value === 1 ? "true" : "false",
            deduction_value:
              item.deduction_value === null ? 0 : item.deduction_value,
          };
        }
        return item;
      });
      console.log(updatedDeductions, "updatedDeductions");
      formik.setFieldValue("deductions", updatedDeductions);
    }

    // Rest of the code...
  };

  const checkedCardModels = [];

  const handleCheckboxChange = (row) => {
    const checkedCardModels = [...formik.values.cardList]; // Create a copy of the cardList array
    const updatedRow = { ...row, checked: !row.checked };
    const updatedData = CardsModelData.map((item) =>
      item.id === updatedRow.id ? updatedRow : item
    );
  
    formik.setFieldValue("cardList", checkedCardModels);
  
    if (updatedRow.checked) {
      console.log("Card Name (Checked):", updatedRow.card_name);
      console.log("Card ID (Checked):", updatedRow.id);
      // Push the item to the array
      checkedCardModels.push(updatedRow);
    } else {
      console.log("Card Name (Unchecked):", updatedRow.card_name);
      console.log("Card ID (Unchecked):", updatedRow.id);
      // Remove the item from the array
      const index = checkedCardModels.findIndex((item) => item.id === updatedRow.id);
      if (index !== -1) {
        checkedCardModels.splice(index, 1);
      }
    }
    
    formik.setFieldValue("cardList", checkedCardModels);
  };
  
  

  const handleChargeCheckboxChange = (row) => {
    const newData = formik.values.data.map((item) =>
      item.id === row.id ? { ...item, checked: !item.checked } : item
    );
    formik.setFieldValue("data", newData);
  };

// Define the array to store checked items outside the function scope
let checkedcardItems = [];

const handlecardCheckboxChange = (event, row) => {
  const isChecked = event.target.checked;

  if (isChecked) {
    // Item is checked, add card_name to the array if it doesn't exist
    if (!checkedcardItems.includes(row.card_name)) {
      checkedcardItems.push(row.card_name);
      console.log(`Added: Card ID: ${row.id}, Card Name: ${row.card_name}`);
      console.log(checkedcardItems, "checkedcardItems");
    }
  } else {
    // Item is unchecked, remove card_name from the array if it exists
    const itemIndex = checkedcardItems.indexOf(row.card_name);
    if (itemIndex !== -1) {
      checkedcardItems.splice(itemIndex, 1);
      console.log(checkedcardItems, "checkedcardItems");
      console.log(`Removed: Card ID: ${row.id}, Card Name: ${row.card_name}`);
    }
  }
  
  const combinedValue = checkedcardItems.join(', '); // Combine items with a delimiter
  formik.setFieldValue('vicky', combinedValue);
};




// Log all checked items after changes
// formik.setFieldValue('vicky', checkedcardItems);



let checkedfuelItems = [];



const handlefuelCheckboxChange = (event, row) => {
  const isChecked = event.target.checked;

  if (isChecked) {
    // Item is checked, add fuel_name to the array if it doesn't exist
    if (!checkedfuelItems.includes(row.fuel_name)) {
      checkedfuelItems.push(row.fuel_name);
    }
  } else {
    // Item is unchecked, remove fuel_name from the array if it exists
    const itemIndex = checkedfuelItems.indexOf(row.fuel_name);
    if (itemIndex !== -1) {
      checkedfuelItems.splice(itemIndex, 1);
    }
  }

  // Update the formik values using setFieldValue


  console.log(checkedfuelItems, "checkedfuelItems");
};






  
  

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Site Settings</h1>

            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item  breadcrumds"
                aria-current="page"
                linkAs={Link}
                linkProps={{ to: "/sites" }}
              >
                Manage Sites
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Site Settings
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row className="row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Site Settings</h3>
              </Card.Header>
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <div className=" m-4">
                    <Row>
                      <Col lg={6} md={6}>
                        <DataTable
                          columns={BussinesModelColumn}
                          data={BussinesModelData}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </Col>
                      <Col lg={6} md={6} className="module-height">
                        <DataTable
                          columns={CardsModelColumn}
                          data={CardsModelData}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg={6} md={6} className="module-height">
                        <DataTable
                          columns={chargesColumns}
                          data={data}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </Col>
                      <Col lg={6} md={6} className="module-height">
                        <DataTable
                          columns={deductionsColumns}
                          data={DeductionData}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </Col>{" "}
                    </Row>
                    <Row className="mt-4">
                      <Col lg={8} md={8} className="module-height">
                        <DataTable
                          columns={SiteItemsColumn}
                          data={SiteItems}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </Col>
                      <Col lg={4} md={4} className="module-height">
                        <DataTable
                          columns={FuelsModelColumn}
                          data={fuelData}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          striped={true}
                          persistTableHead
                          highlightOnHover
                          searchable={false}
                          responsive
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
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

export default withApi(SiteSettings);
