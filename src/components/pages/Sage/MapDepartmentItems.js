import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Breadcrumb, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import Loaderimg from "../../../Utils/Loader";

import { useSelector } from "react-redux";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Swal from "sweetalert2";
const DepartmentItems = (props) => {
  const { getData, isLoading, postData, apidata } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [DepartmentList, setDepartmentList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(true);


  const [data, setData] = useState();

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const navigate = useNavigate();
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
  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      department_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      department_id: Yup.string().required("Department is required"),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const dummyData = [
    {
      id: "",
      sage_export_type: "",
      account_code: "",
      nominal_code: "",
      positive_nominal_type_id: "",
      negative_nominal_type_id: "",
      nominal_tax_code_id: "",
    },

    // Add more dummy data items as needed
  ];
  const handleSubmit = async (values) => {
    if (formik.values.company_id === "" && formik.values.department_id === "") {
      // Show alert or perform any other action
      ErrorAlert("Both company_id and department_id are empty!");
    } else {
      try {
        const response = await getData(
          `sage/item/heads?company_id=${values.company_id}&item_id=${values.department_id}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data);
          const headsvalue = data?.data?.heads?.map((sale) => ({
            id: sale.id || "",
            sage_export_type: sale.sage_export_type || "",
            account_code: sale.account_code || "",
            nominal_code: sale.nominal_code || "",
            positive_nominal_type_id: sale.positive_nominal_type_id || "",
            negative_nominal_type_id: sale.negative_nominal_type_id || "",
            nominal_tax_code_id: sale.nominal_tax_code_id || "",
          }));

          // Check if headsvalue has any values; otherwise, use dummyData
          const head_formik_values =
            headsvalue.length > 0 ? headsvalue : dummyData;

          formik2.setFieldValue("headsvalue", head_formik_values);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/common/client-list");

      const { data } = response;
      if (data) {
        setClientList(response.data);

        const clientId = localStorage.getItem("superiorId");
        if (clientId) {
          setSelectedClientId(clientId);
          setSelectedCompanyList([]);

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
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
    } else {
      formik.setFieldValue("client_id", clientId);
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
    }
  }, []);

  const isUpdatePermissionAvailable =
    permissionsArray?.includes("itemhead-update");

  const isButtonDisabled = formik.values.client_id && formik.values.company_id;

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {
          setCompanyList(response?.data?.data);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const GetDepartmentList = async (values) => {
    try {
      if (values) {
        const response = await getData(`sage/item/list?company_id=${values}`);

        if (response) {
          setDepartmentList(response?.data?.data?.items);
        } else {
          throw new Error("No data available in the response");
        }
      } else {
        console.error("No site_id found ");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const headsvalueinitialValues = {
    headsvalue: [
      {
        sage_export_type: "",
        account_code: "",
        nominal_code: "",
        positive_nominal_type_id: "",
        negative_nominal_type_id: "",
        nominal_tax_code_id: "",
      },
    ],
  };
  const headsvalueonsubmit = () => {
    console.log(formik2.values);
  };
  const formik2 = useFormik({
    initialValues: headsvalueinitialValues,

    onSubmit: headsvalueonsubmit,
  });


  const setFieldValuesFromHeads = (head) => {
    formik2.setFieldValue("sage_export_type", head?.sage_export_type || "");
    formik2.setFieldValue(
      "positive_nominal_type_id",
      head?.positive_nominal_type_id || ""
    );
    formik2.setFieldValue(
      "negative_nominal_type_id",
      head?.negative_nominal_type_id || ""
    );
    formik2.setFieldValue(
      "nominal_tax_code_id",
      head?.nominal_tax_code_id || ""
    );
    formik2.setFieldValue("account_code", head?.account_code || "");
    formik2.setFieldValue("nominal_code", head?.nominal_code || "");
  };

  useEffect(() => {
    if (data?.heads?.length > 0) {
      // Loop through each head and set field values
      data.heads.forEach((head, index) => {
        setFieldValuesFromHeads(head);
      });
    }
  }, [data]);
  // formik2.setFieldValue("headsvalue", head_formik_values);
  const pushnonbunkeredSalesRow = () => {
    if (formik2.isValid) {
      formik2.values.headsvalue.push({
        id: "",
        sage_export_type: "",
        account_code: "",
        nominal_code: "",
        positive_nominal_type_id: "",
        negative_nominal_type_id: "",
        nominal_tax_code_id: "",
      });
      formik2.setFieldValue("headsvalue", formik2.values.headsvalue);
    } else {
      ErrorAlert(
        "Please fill all fields correctly before adding a new non-bunkered sales row."
      );
    }
  };
  const handleRemoveClick = (index) => {
    // Assuming your data structure has some property like 'id'
    const clickedId = formik2.values.headsvalue[index].id;
    removenonbunkeredSalesRow(index, clickedId);
  };
  const removenonbunkeredSalesRow = (index, clickedId) => {

    if (!clickedId) {
      const updatedRows = [...formik2.values.headsvalue];
      updatedRows.splice(index, 1);
      formik2.setFieldValue("headsvalue", updatedRows);
    }

    clickedId && handleDelete(clickedId, index)

  };
  const handleDelete = (id, index) => {
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
        const formData = new FormData();
        formData.append("id", id);
        DeleteClient(formData, index);
      }
    });
  };
  const DeleteClient = async (formData, index) => {
    try {
      const response = await postData("sage/item/head-delete", formData);
      // Console log the response
      if (apidata.api_response === "success") {
        const updatedRows = [...formik2.values.headsvalue];
        console.log(updatedRows, "updatedRows");
        updatedRows.splice(index, 1);
        formik2.setFieldValue("headsvalue", updatedRows);
        handleSubmit(formik?.values)
      }
    } catch (error) {
      handleError(error);
    }
  };


  const combinedOnSubmit = async () => {
    try {
      const formData = new FormData();



      for (const obj of formik2.values?.headsvalue) {
        const {
          id,
          sage_export_type,
          nominal_code,
          positive_nominal_type_id,
          negative_nominal_type_id,
          nominal_tax_code_id,
          account_code,

        } = obj;

        const index = formik2.values.headsvalue.indexOf(obj);



        // Assuming you have the variables id, fuel, volume, and value with their respective values

        if (nominal_code !== null && nominal_code !== "") {
          formData.append(`nominal_code[${id ? id : index}]`, nominal_code);
        }
        if (sage_export_type !== null && sage_export_type !== "") {
          formData.append(`sage_export_type[${id ? id : index}]`, sage_export_type);
        }

        if (account_code !== null && account_code !== "") {
          formData.append(`account_code[${id ? id : index}]`, account_code);
        }
        if (nominal_tax_code_id !== null && nominal_tax_code_id !== "") {
          formData.append(
            `nominal_tax_code_id[${id ? id : index}]`,
            nominal_tax_code_id
          );
        }

        if (
          negative_nominal_type_id !== null &&
          negative_nominal_type_id !== ""
        ) {
          formData.append(
            `negative_nominal_type_id[${id ? id : index}]`,
            negative_nominal_type_id
          );
        }

        if (
          positive_nominal_type_id !== null &&
          positive_nominal_type_id !== ""
        ) {
          formData.append(
            `positive_nominal_type_id[${id ? id : index}]`,
            positive_nominal_type_id
          );
        }
      }
      formData.append("company_id", formik.values.company_id);

      formData.append("item_id", formik.values.department_id);

      const postDataUrl = "/sage/item/head-update";
      const navigatePath = `/clients`;

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed

      if (apidata.api_response === "success") {
        handleSubmit(formik?.values)
      }
    } catch (error) { }
  };

  console.log(formik2.values.headsvalue.length, "formik2");
  console.log(isUpdatePermissionAvailable, "isUpdatePermissionAvailable");
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Items</h1>
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
                Manage Items
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header className="d-flex justify-content-space-between">
                <h3 className="card-title">Manage Items</h3>
              </Card.Header>
              {/* here my body will start */}
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={4} md={6}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className="form-label mt-4"
                          >
                            Client
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`input101 ${formik.errors.client_id &&
                              formik.touched.client_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id="client_id"
                            name="client_id"
                            value={formik.values.client_id}
                            onChange={(e) => {
                              const selectedType = e.target.value;

                              if (selectedType) {
                                GetCompanyList(selectedType);
                                formik.setFieldValue("client_id", selectedType);
                                setSelectedClientId(selectedType);
                                setSiteList([]);
                                setDepartmentList([]);
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("department_id", "");
                              } else {
                                formik.setFieldValue("client_id", "");
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("department_id", "");

                                setDepartmentList([]);
                                setSiteList([]);
                                setCompanyList([]);
                              }
                            }}
                          >
                            <option value="">Select a Client</option>
                            {ClientList.data && ClientList.data.length > 0 ? (
                              ClientList.data.map((item) => (
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
                    <Col Col lg={4} md={6}>
                      <div className="form-group">
                        <label htmlFor="company_id" className="form-label mt-4">
                          Company
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.company_id &&
                            formik.touched.company_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="company_id"
                          name="company_id"
                          value={formik.values.company_id}
                          onChange={(e) => {
                            const selectcompany = e.target.value;

                            if (selectcompany) {
                              GetDepartmentList(selectcompany);
                              formik.setFieldValue("department_id", "");
                              formik.setFieldValue("company_id", selectcompany);
                            } else {
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("department_id", "");

                              setDepartmentList([]);
                              setSiteList([]);
                            }
                          }}
                        >
                          <option value="">Select a Company</option>
                          {selectedClientId && CompanyList.length > 0 ? (
                            <>
                              setSelectedCompanyId([])
                              {CompanyList.map((company) => (
                                <option key={company.id} value={company.id}>
                                  {company.company_name}
                                </option>
                              ))}
                            </>
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
                    <Col Col lg={4} md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="department_id"
                          className="form-label mt-4"
                        >
                          Department Item
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.department_id &&
                            formik.touched.department_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="department_id"
                          name="department_id"
                          value={formik.values.department_id}
                          onChange={(e) => {
                            const selectedType = e.target.value;

                            if (selectedType) {
                              formik.setFieldValue(
                                "department_id",
                                selectedType
                              );

                              setSiteList([]);

                              formik.setFieldValue("site_id", "");
                            } else {
                              formik.setFieldValue("client_id", "");
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("department_id", "");

                              setSiteList([]);
                              setCompanyList([]);
                              setDepartmentList([]);
                            }
                          }}
                        >
                          <option value="">Select a Item</option>
                          {DepartmentList && DepartmentList.length > 0 ? (
                            <>
                              setSelectedCompanyId([])
                              {DepartmentList.map((departmentid) => (
                                <option
                                  key={departmentid.id}
                                  value={departmentid.id}
                                >
                                  {departmentid.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option disabled>No Department</option>
                          )}
                        </select>
                        {formik.errors.department_id &&
                          formik.touched.department_id && (
                            <div className="invalid-feedback">
                              {formik.errors.department_id}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <div className="text-end">
                    <button
                      type="button" // Change the type to "button" to prevent form submission
                      className="btn btn-primary me-2"
                      onClick={() => {
                        handleSubmit(formik.values); // Call handleSubmit when the button is clicked
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <div>
              <h3 className="card-title">Map to Sage Account </h3>
            </div>
            <span className="text-end">
              {data?.sageExport.length > 0 ? (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={pushnonbunkeredSalesRow}
                >
                  <AddBoxIcon />
                </button>
              ) : null}
            </span>
          </Card.Header>
          <Card.Body>
            {data?.sageExport.length > 0 ? (
              <Row>
                {formik2.values.headsvalue.map((item, index) => (
                  <>
                    <React.Fragment key={index}>
                      <Col lg={4} md={4}>
                        <Form.Group
                          controlId={`headsvalue[${index}].sage_export_type`}
                        >
                          <Form.Label> Sage Export Types:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik2.errors.headsvalue?.[index]
                              ?.sage_export_type &&
                              formik2.touched[
                              `headsvalue[${index}].sage_export_type`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].sage_export_type`}
                            onChange={formik2.handleChange}
                            value={item?.sage_export_type || ""}
                          >
                            <option value="">Select a Export Types</option>
                            {data?.sageExport?.map((sage_export_type) => (
                              <option
                                key={sage_export_type.id}
                                value={sage_export_type.id}
                              >
                                {sage_export_type.name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.headsvalue?.[index]
                            ?.sage_export_type &&
                            formik2.touched[
                            `headsvalue[${index}].sage_export_type`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.headsvalue[index]
                                    .sage_export_type
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={4}>
                        <Form.Group
                          controlId={`headsvalue[${index}].account_code`}
                        >
                          <Form.Label> Sage Account Code:</Form.Label>
                          <Form.Control
                            type="text"
                            className={`input101 ${formik2.errors.headsvalue?.[index]
                              ?.account_code &&
                              formik2.touched[
                              `headsvalue[${index}].account_code`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].account_code`}
                            onChange={formik2.handleChange}
                            placeholder="Account Code"
                            value={item?.account_code || ""}
                          />
                          {formik2.errors.headsvalue?.[index]?.account_code &&
                            formik2.touched[
                            `headsvalue[${index}].account_code`
                            ] && (
                              <div className="invalid-feedback">
                                {formik2.errors.headsvalue[index].account_code}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={4}>
                        <Form.Group
                          controlId={`headsvalue[${index}].nominal_code`}
                        >
                          <Form.Label> Sage Nominal Code:</Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${formik2.errors.headsvalue?.[index]
                              ?.nominal_code &&
                              formik2.touched[
                              `headsvalue[${index}].nominal_code`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].nominal_code`}
                            onChange={formik2.handleChange}
                            placeholder="Nominal Code"
                            value={item?.nominal_code || ""}
                          />
                          {formik2.errors.headsvalue?.[index]?.nominal_code &&
                            formik2.touched[
                            `headsvalue[${index}].nominal_code`
                            ] && (
                              <div className="invalid-feedback">
                                {formik2.errors.headsvalue[index].nominal_code}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={4}>
                        <Form.Group
                          controlId={`headsvalue[${index}].positive_nominal_type_id`}
                        >
                          <Form.Label> Sage Positive Types:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik2.errors.headsvalue?.[index]
                              ?.positive_nominal_type_id &&
                              formik2.touched[
                              `headsvalue[${index}].positive_nominal_type_id`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].positive_nominal_type_id`}
                            onChange={formik2.handleChange}
                            value={item?.positive_nominal_type_id || ""}
                          >
                            <option value="">Select a Positive Types</option>
                            {data?.types?.map((sage_export_type) => (
                              <option
                                key={sage_export_type.id}
                                value={sage_export_type.id}
                              >
                                {sage_export_type.name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.headsvalue?.[index]
                            ?.positive_nominal_type_id &&
                            formik2.touched[
                            `headsvalue[${index}].positive_nominal_type_id`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.headsvalue[index]
                                    .positive_nominal_type_id
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={4}>
                        <Form.Group
                          controlId={`headsvalue[${index}].negative_nominal_type_id`}
                        >
                          <Form.Label> Sage Negative Types:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik2.errors.headsvalue?.[index]
                              ?.negative_nominal_type_id &&
                              formik2.touched[
                              `headsvalue[${index}].negative_nominal_type_id`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].negative_nominal_type_id`}
                            onChange={formik2.handleChange}
                            value={item?.negative_nominal_type_id || ""}
                          >
                            <option value="">Select a Negative Types</option>
                            {data?.types?.map((sage_export_type) => (
                              <option
                                key={sage_export_type.id}
                                value={sage_export_type.id}
                              >
                                {sage_export_type.name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.headsvalue?.[index]
                            ?.negative_nominal_type_id &&
                            formik2.touched[
                            `headsvalue[${index}].negative_nominal_type_id`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.headsvalue[index]
                                    .negative_nominal_type_id
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`headsvalue[${index}].nominal_tax_code_id`}
                        >
                          <Form.Label> Sage Tax Code:</Form.Label>
                          <Form.Control
                            as="select"
                            className={`input101 ${formik2.errors.headsvalue?.[index]
                              ?.nominal_tax_code_id &&
                              formik2.touched[
                              `headsvalue[${index}].nominal_tax_code_id`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].nominal_tax_code_id`}
                            onChange={formik2.handleChange}
                            value={item?.nominal_tax_code_id || ""}
                          >
                            <option value="">Select a Tax Code</option>
                            {data?.taxCodes?.map((sage_export_type) => (
                              <option
                                key={sage_export_type.id}
                                value={sage_export_type.id}
                              >
                                {sage_export_type.name}
                              </option>
                            ))}
                          </Form.Control>
                          {formik2.errors.headsvalue?.[index]
                            ?.nominal_tax_code_id &&
                            formik2.touched[
                            `headsvalue[${index}].nominal_tax_code_id`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.headsvalue[index]
                                    .nominal_tax_code_id
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col lg={1} md={1} className="text-end">
                        <div
                          className="text-end"
                          style={{ marginTop: "36px" }}
                        >
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveClick(index)}
                          >
                            <RemoveCircleIcon />
                          </button>
                        </div>
                      </Col>

                    </React.Fragment>
                    {index !== formik2.values.headsvalue.length - 1 &&
                      data?.sageExport.length > 0 ? (
                      <hr className="mt-4"></hr>
                    ) : null}
                  </>
                ))}
              </Row>
            ) : (
              <>
                <img
                  src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                  alt="MyChartImage"
                  className="all-center-flex nodata-image"
                />
              </>
            )}
          </Card.Body>
          <Card.Footer>
            {isUpdatePermissionAvailable && formik2.values.headsvalue.length > 0 ? (
              <div className="bunkered-action">
                <div className="text-end mt-3">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={combinedOnSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </Card.Footer>
        </Card>
      </>
    </>
  );
};

export default withApi(DepartmentItems);
