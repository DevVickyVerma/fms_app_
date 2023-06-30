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
        const response = await axiosInstance.get(
          `/site/get-setting-list/${id}`
        );

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
            CheckedcardItem: [],
            CheckedFuelItem: [],
            ChargeCheckbox: [],
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
    console.log(values, "values");

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

    // try {
    //   setIsLoading(true);
    //   const response = await fetch(
    //     `${process.env.REACT_APP_BASE_URL}/shop-sale/update`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: formData,
    //     }
    //   );

    //   const responseData = await response.json(); // Read the response once

    //   if (response.ok) {
    //     SuccessToast(responseData.message);
    //   } else {
    //     ErrorToast(responseData.message);

    //     // Handle specific error cases if needed
    //   }
    // } catch (error) {
    //   console.log("Request Error:", error);
    //   // Handle request error
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const initialValues = {
    data: data,
  };

  const formik = useFormik({
    initialValues,

    onSubmit: handleSubmit,
    // ... Add other Formik configuration options as needed
  });

  const handleRadioBussinessmodel = (row, index) => {
    const clickedModel = row.business_model_types[index];
    console.log("Business Model Name:", row.item_name);
    console.log("Clicked Value:", clickedModel);

    const updatedModels = BussinesModelData.map((item) => {
      if (item.id === row.id) {
        const updatedModelTypes = item.business_model_types.map((model, i) => ({
          ...model,
          checked: i === index,
        }));

        return {
          ...item,
          business_model_types: updatedModelTypes,
        };
      }
      return item;
    });
    console.log("Business Model Name:", updatedModels);
    setBussinesModelData(updatedModels);
  };

  const [checkBussinesItem, setcheckBussinesItem] = useState([]);

  const handleBussinesCheckChange = (event, row) => {
    const isChecked = event.target.checked;
    const checkedItems = [...checkBussinesItem];
    const valuesArray = [];

    // Check if any radio button is already selected
    const isAnyRadioSelected = row.business_model_types.some(
      (model) => model.checked
    );

    // If no radio button is selected, check the "Charge Rent" radio button

    if (isChecked) {
      if (!isAnyRadioSelected) {
        row.business_model_types[0].checked = true;
      }
    } else {
      const updatecheckedItems = checkedItems.filter(
        (item) => item.itemName !== row.item_name
      );

      setcheckBussinesItem(updatecheckedItems);
      console.log(updatecheckedItems, "updatecheckedItems");

      row.business_model_types.forEach((radio) => {
        radio.checked = false;
      });
    }

    if (isChecked) {
      row.business_model_types.forEach((model) => {
        if (model.checked) {
          // Add the item to the checkedItems array
          checkedItems.push({
            modelId: model.id,
            modelmodel_name: model.model_name,
            checked: model.checked,
            rowId: row.id,
            itemName: row.item_name,
            itemcheckedName: "cheked",
          });
          setcheckBussinesItem(checkedItems);
          console.log(checkedItems, "PushedItems");
        } else if (!isChecked) {
          // Remove the item from the checkedItems array

          const updatedItems = checkedItems.filter(
            (item) => item.modelId !== model.id || item.rowId !== row.id
          );
          setcheckBussinesItem(updatedItems);
        }
      });
    }

    formik.setFieldValue("valuesArray", valuesArray);
  };

  // Handle radio button change

  const BussinesModelColumn = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "5%",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(event) => handleBussinesCheckChange(event, row)}
        />
      ),
    },

    {
      name: "Business Models",
      selector: (row) => row.item_name,
      sortable: true,

      width: "35%",
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
      name: "Select",
      selector: "checked",
      sortable: false,
      selector: (row) => row.id,
      center: true,
      width: "10%",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(event) => SelectcardCheckboxChange(event, row)}
        />
      ),
    },
    {
      name: "Card Model",
      selector: (row) => row.card_name,
      sortable: true,
      width: "70%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.card_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "For Tenant",
      selector: "checked",
      sortable: false,
      selector: (row) => row,
      center: true,
      width: "20%",
      cell: (row) => (
        <div>
          <input
            type="checkbox"
            onChange={(event) => FortalentcardCheckboxChange(event, row)}
          />
        </div>
      ),
    },
  ];

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
      width: "35%",
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
              type="checkbox"
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
              type="checkbox"
              onChange={() => handleRadiochargesmodel(row, 0)}
            />
          </div>
        </div>
      ),
    },
  ];

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
      width: "10%",
      cell: (row) => (
        <input type="checkbox" onChange={() => handleSiItemChange(row)} />
      ),
    },
    {
      name: "Department Name",
      selector: (row) => row.dept_name,
      sortable: true,
      width: "40%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.dept_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Meter Reading",
      selector: (row) => row.price,
      sortable: false,
      width: "25%",
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
    {
      name: " For Admin",
      selector: "checked",
      sortable: false,
      center: true,
      width: "20%",
      cell: (row) => (
        <input type="checkbox" onChange={() => handleSiItemChange(row)} />
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

  const handleRadiochargesmodel = (row, value) => {
    const updatedData = formik.values.data.map((item) => {
      if (item.id === row.id) {
        const updatedItem = {
          ...item,
          admin: value === 0 ? "true" : "false",
          operator: value === 1 ? "true" : "false",
        };
        formik.setFieldValue("ChargeCheckbox", updatedItem);
        console.log(updatedItem); // Log the clicked item value
        return updatedItem;
      }
      return item;
    });
  };
  const handleSiItemChange = (row) => {
    const updatedRow = {
      ...row,
      checked: !row.checked, // Toggle the value of row.checked
    };

    console.log(updatedRow, "handle");

    console.log(formik.values.SiteItemsFormik, "handle");
  };

  // Define an array to store the combined objects

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

  const [ChargeCheckbox, setChargeCheckbox] = useState([]);

  const handleChargeCheckboxChange = (row) => {
    const updatedChargeCheckbox = [...ChargeCheckbox];

    // Toggle the checked property of the row
    row.checked = !row.checked;

    if (row.checked) {
      console.log("row.checked");
      // Add the row to the array if it doesn't exist
      if (!updatedChargeCheckbox.includes(row)) {
        updatedChargeCheckbox.push(row);
        console.log(updatedChargeCheckbox, "updatedChargeCheckbox");
      }
    } else {
      // Remove the row from the array if it exists
      console.log("row.checddddked");
      const rowIndex = updatedChargeCheckbox.findIndex((item) => item === row);
      if (rowIndex !== -1) {
        updatedChargeCheckbox.splice(rowIndex, 1);
        console.log(updatedChargeCheckbox, "splice");
      }
    }

    setChargeCheckbox(updatedChargeCheckbox);
    formik.setFieldValue("ChargeCheckbox", updatedChargeCheckbox);
  };

  const [checkFuelItem, setCheckFuelItem] = useState([]);
  const handlefuelCheckboxChange = (event, row) => {
    const isChecked = event.target.checked;
    let checkedfuelItems = [...checkFuelItem];

    if (isChecked) {
      // Item is checked, add fuel_name to the array if it doesn't exist
      if (!checkedfuelItems.includes(row.fuel_name)) {
        checkedfuelItems.push(row.fuel_name);
        setCheckFuelItem(checkedfuelItems);
      } else {
        // Item is unchecked, remove fuel_name from the array if it exists
        const itemIndex = checkedfuelItems.indexOf(row.fuel_name);
        if (itemIndex !== -1) {
          checkedfuelItems.splice(itemIndex, 1);
          setCheckFuelItem(checkedfuelItems);
        }
      }
      formik.setFieldValue("CheckedFuelItem", checkedfuelItems);

      // Update the formik values using setFieldValue

      console.log(checkedfuelItems, "checkedfuelItems");
    }
  };

  let modifiedselectcard = [];

  const SelectcardCheckboxChange = (event, row) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      row.checked = true;

      if (modifiedCardforcardtalent.some((card) => card.id === row.id)) {
        row.for_tenant = 1;
      } else {
        row.for_tenant = 0;
      }

      modifiedselectcard.push(row);
      console.log(modifiedselectcard, "modifiedselectcard");
      console.log(modifiedCardforcardtalent, "modifiedCardforcardtalent");
    } else {
      modifiedselectcard = modifiedselectcard.filter(
        (prevRow) => prevRow.card_name !== row.card_name
      );
      console.log(modifiedselectcard, "modifiedselectcard");
      console.log(modifiedCardforcardtalent, "modifiedCardforcardtalent");
    }
  };

  let modifiedCardforcardtalent = [];

  const FortalentcardCheckboxChange = (event, row) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      row.for_tenant = 1;
      modifiedCardforcardtalent.push(row); // Add the modified row to the array
      console.log(modifiedCardforcardtalent, " mo ");
    } else {
      modifiedCardforcardtalent = modifiedCardforcardtalent.filter(
        (prevRow) => prevRow.card_name !== row.card_name
      );
      console.log(modifiedCardforcardtalent, " modifiedRows ");
    }

    console.log(modifiedCardforcardtalent, "bahro");
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
          <form onSubmit={formik.handleSubmit}>
            <div className=" m-4">
              <Card>
                <Card.Body>
                  <Row>
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Business</h3>
                      </Card.Header>
                      <div className="module-height">
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
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row>
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Card</h3>
                      </Card.Header>
                      <div className="module-height">
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
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row className="mt-4">
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Charges</h3>
                      </Card.Header>
                      <div className="module-height">
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
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row className="mt-4">
                    <Col lg={12} md={12}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Deductions</h3>
                      </Card.Header>
                      <div className="module-height">
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
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Row className="mt-4">
                    <Col lg={8} md={8}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Department Items</h3>
                      </Card.Header>
                      <div className="module-height">
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
                      </div>
                    </Col>
                    <Col lg={4} md={4}>
                      <Card.Header className="cardheader-table">
                        <h3 className="card-title">Assign Fuels</h3>
                      </Card.Header>
                      <div className="module-height">
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
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </Row>
      </>
    </>
  );
};

export default withApi(SiteSettings);
