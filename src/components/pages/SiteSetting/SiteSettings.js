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

          const Assignbussiness = data?.data?.business_models
            ? data.data.business_models.map((item) => ({
                id: item.id,
                item_name: item.item_name,
                business_model_types: item.business_model_types.map(
                  (model) => ({
                    id: model.id,
                    model_name: model.model_name,
                    checked: model.checked,
                  })
                ),
                // Add other properties as needed
              }))
            : [];

          formik.setFieldValue("FormikDeductionData", data?.data?.deductions);
          formik.setFieldValue("Formiksite_items", data?.data?.site_items);
          formik.setFieldValue("FormikChargesData", data?.data?.charges);
          formik.setFieldValue("FormikFuelData", data?.data?.fuels);

          formik.setFieldValue("AssignFormikbussiness", Assignbussiness);
          formik.setFieldValue("AssignFormikCards", data?.data?.cards);
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

  const handleSubmit = async (values) => {
    try {
      // Create a new FormData object
      const formData = new FormData();
      console.log(values, "valuehandleSubmits");

      for (const obj of values.updatedAssignFormikbussiness) {
        const { rowId, modelId } = obj;
        const business_models_valueKey = `business_models[${rowId}]`;
        formData.append(business_models_valueKey, modelId);
      }

      const selectedFuelIds = [];
      const fuel_models_valueKey = "fuels[]";

      for (const obj of values.FormikFuelData) {
        const { id, fuel_name, checked } = obj;

        if (checked) {
          selectedFuelIds.push(id);
        }
      }

      formData.append(fuel_models_valueKey, JSON.stringify(selectedFuelIds));

      for (const obj of values.AssignFormikCards) {
        const { id, for_tenant, checked, card_name } = obj;
        const card_valueKey = `cards[${id}]`;
        if (checked) {
          formData.append(card_valueKey, for_tenant);
        }
      }

      for (const obj of values.FormikChargesData) {
        const { id, charge_name, charge_value, checked, admin, operator } = obj;
        const charge_admin_valueKey = `charge_admin[${id}]`;
        const charge_operator_valueKey = `charge_operator[${id}]`;
        const charge_amount_valueKey = `charge_amount[${id}]`;
        const charges = `charges[]`;

        if (checked) {
          formData.append(charges, id);
          formData.append(charge_amount_valueKey, charge_value);
          formData.append(charge_admin_valueKey, admin);
          formData.append(charge_operator_valueKey, operator);

        
        }
      }
      for (const obj of values.FormikDeductionData) {
        const {
          id,
          deduction_name,
          deduction_value,
          checked,
          admin,
          operator,
        } = obj;
        const deductions_admin_valueKey = `deduction_admin[${id}]`;
        const deductions_operator_valueKey = `deduction_operator[${id}]`;
        const deductions_amount_valueKey = `deduction_amount[${id}]`;
        const deductions = `deductions[]`;

        if (checked) {
          formData.append(deductions, id);
          formData.append(deductions_amount_valueKey, deduction_value);
          formData.append(deductions_admin_valueKey, admin);
          formData.append(deductions_operator_valueKey, operator);

      
        }
      }

      for (const obj of values.Formiksite_items) {
        const { id, dept_name, price, checked, is_admin } = obj;
        const deductions_admin_valueKey = `department_item_admin[${id}]`;

        const department_items = `department_items[${id}]`;

        if (checked) {
          formData.append(department_items, price);
          formData.append(deductions_admin_valueKey, is_admin);

       
        }
      }

      formData.append("id", id);

      const postDataUrl = "/site/update-setting";
      // const navigatePath = "/business";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const initialValues = {
    data: data,
    siteItems: SiteItems,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      handleSubmit(values);
    },
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
      formik.setFieldValue("updatedAssignFormikbussiness", updatecheckedItems);
      setcheckBussinesItem(updatecheckedItems);

      row.business_model_types.forEach((radio) => {
        radio.checked = false;
      });
    }
    console.log(checkBussinesItem, "updatecheckedItems");

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
          formik.setFieldValue("updatedAssignFormikbussiness", checkedItems);
          setcheckBussinesItem(checkedItems);
          console.log(checkedItems, "PushedItems");
        } else if (!isChecked) {
          // Remove the item from the checkedItems array

          const updatedItems = checkedItems.filter(
            (item) => item.modelId !== model.id || item.rowId !== row.id
          );
          setcheckBussinesItem(updatedItems);
          formik.setFieldValue("updatedAssignFormikbussiness", updatedItems);
        }
      });
    }
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
      selector: "item_name",
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
  ];

  // Add dynamic columns for business model types
  const businessModels = formik.values.AssignFormikbussiness || [];
  if (businessModels.length > 0) {
    const businessModelTypes = businessModels[0]?.business_model_types || [];
    businessModelTypes.forEach((model, index) => {
      const column = {
        name: model.model_name,
        selector: (row) => row.business_model_types[index]?.id,
        sortable: false,
        center: true,
        width: "20%",
        cell: (row) => (
          <div className="d-flex">
            <div className="ms-auto">
              <input
                type="radio"
                name={`radioButton_${row.id}_${index}`}
                checked={row.business_model_types[index]?.checked}
                onChange={() => handleRadioBussinessmodel(row, index)}
              />
            </div>
          </div>
        ),
      };
      BussinesModelColumn.push(column);
    });
  }

  const CardsModelColumn = [
    {
      name: "Select",
      selector: "checked",
      sortable: false,
      center: true,
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`AssignFormikCards[${index}].checked`}
            className="table-input"
            checked={
              formik.values?.AssignFormikCards?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
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

      selector: (row) => row.for_tenant,
      sortable: false,
      center: true,
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`for_tenant-${index}`}
            name={`AssignFormikCards[${index}].for_tenant`}
            className="table-input"
            checked={
              formik.values?.AssignFormikCards?.[index]?.for_tenant ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
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
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikChargesData[${index}].checked`}
            className="table-input"
            checked={
              formik.values?.FormikChargesData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "CHARGE GROUPS",
      width: "25%",
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
            name={`FormikChargesData[${index}].charge_value`}
            className="table-input"
            value={formik.values?.FormikChargesData?.[index]?.charge_value ?? 0}
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

      selector: (row) => row.admin,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikChargesData[${index}].admin`}
            className="table-input"
            checked={formik.values?.FormikChargesData?.[index]?.admin ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "Operator",

      selector: (row) => row.operator,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikChargesData[${index}].operator`}
            className="table-input"
            checked={
              formik.values?.FormikChargesData?.[index]?.operator ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
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
      width: "10%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikDeductionData[${index}].checked`}
            className="table-input"
            checked={
              formik.values?.FormikDeductionData?.[index]?.checked ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
    {
      name: "CHARGE GROUPS",
      width: "25%",
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
            name={`FormikDeductionData[${index}].deduction_value`}
            className="table-input"
            value={
              formik.values?.FormikDeductionData?.[index]?.deduction_value ?? 0
            }
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

      selector: (row) => row.admin,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikDeductionData[${index}].admin`}
            className="table-input"
            checked={formik.values?.FormikDeductionData?.[index]?.admin ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
      
    },
    {
      name: "Operator",

      selector: (row) => row.operator,
      sortable: false,
      center: true,
      width: "22.5%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikDeductionData[${index}].operator`}
            className="table-input"
            checked={formik.values?.FormikDeductionData?.[index]?.operator ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
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
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`Formiksite_items[${index}].checked`}
            className="table-input"
            checked={formik.values?.Formiksite_items?.[index]?.checked ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
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
            name={`Formiksite_items[${index}].price`}
            className="table-input"
            value={formik.values?.Formiksite_items?.[index]?.price ?? 0}
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
      name: "For Admin",
      selector: "checked",
      sortable: false,
      center: true,
      width: "20%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`Formiksite_items[${index}].is_admin`}
            className="table-input"
            checked={
              formik.values?.Formiksite_items?.[index]?.is_admin ?? false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
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
      selector: (row) => row.checked,
      sortable: false,
      center: true,
      width: "40%",
      cell: (row, index) => (
        <div>
          <input
            type="checkbox"
            id={`checked-${index}`}
            name={`FormikFuelData[${index}].checked`}
            className="table-input"
            checked={formik.values?.FormikFuelData?.[index]?.checked ?? false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Error handling code */}
        </div>
      ),
    },
  ];

  // Define an array to store the combined objects

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
