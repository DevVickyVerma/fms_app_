import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Breadcrumb, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import Loaderimg from "../../../Utils/Loader";

import { useSelector } from "react-redux";
import { ErrorAlert, handleError } from "../../../Utils/ToastUtils";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Swal from "sweetalert2";



const SageDeduction = (props) => {
  const { getData, isLoading, postData, apidata } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState("");

  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [DepartmentList, setDepartmentList] = useState([]);
  const [SiteList, setSiteList] = useState([]);

  const [data, setData] = useState();

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);


  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

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


  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",
      site_id: "",
      department_item_id: "",
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
      department_item_id: Yup.string().required("Department is required"),
    }),

    onSubmit: (values) => {
      localStorage.setItem('localShopRevenueCommission', JSON.stringify(values));
      handleSubmit(values);
    },
  });
  useEffect(() => {
    const localShopRevenueCommission = JSON.parse(localStorage.getItem('localShopRevenueCommission'));
    if (localShopRevenueCommission) {
      formik.setFieldValue('client_id', localShopRevenueCommission?.client_id);
      formik.setFieldValue('company_id', localShopRevenueCommission?.company_id);
      formik.setFieldValue('site_id', localShopRevenueCommission?.site_id);
      formik.setFieldValue('start_date', localShopRevenueCommission?.start_date);
      formik.setFieldValue('department_item_id', localShopRevenueCommission?.department_item_id);

      let showError = false;
      GetCompanyList(localShopRevenueCommission?.client_id);
      GetDepartmentList();
      GetSiteList(localShopRevenueCommission?.company_id)
      handleSubmit(localShopRevenueCommission, showError);
    }
  }, []);

  const handleClearForm = async (resetForm) => {
    formik.setFieldValue("site_id", "")
    formik.setFieldValue("start_date", "")
    formik.setFieldValue("client_id", "")
    formik.setFieldValue("company_id", "")
    formik.setFieldValue("endDate", "")
    formik.setFieldValue("startDate", "")
    formik.resetForm()
    setSelectedCompanyList([]);
    setSelectedClientId("");
    setCompanyList([])
    setData(null)
    localStorage.removeItem("localShopRevenueCommission")
    const clientId = localStorage.getItem("superiorId");
    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
      formik.setFieldValue("client_id", "")
      setCompanyList([])
    } else {
      setSelectedClientId(clientId);
      GetCompanyList(clientId);
      formik.setFieldValue("client_id", clientId)
    }
  };






  const dummyData = [
    {
      id: "",
      commission_type: "",
      commission: "",
      end_value: "",
      start_value: "",
    },

    // Add more dummy data items as needed
  ];
  const handleSubmit = async (values, showError = true) => {
    if (
      formik.values.company_id === "" &&
      formik.values.department_item_id === "" &&
      showError
    ) {
      // Show alert or perform any other action
      ErrorAlert("Both Comapny and Site ID are empty!");
    } else {
      try {
        const response = await getData(
          `shop-revenue-commission/list?client_id=${values.client_id}&company_id=${values.company_id}&site_id=${values.site_id}&department_item_id=${values.department_item_id}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data);
          const headsvalue = data?.data.map((sale) => ({
            id: sale.id || "",
            commission_type: sale.commission_type || "",
            commission: sale.commission || "",
            end_value: sale.end_value || "",
            start_value: sale.start_value || "",
          }));

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



  const isUpdatePermissionAvailable = permissionsArray?.includes(
    "revenuecommission-update"
  );


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
  const GetSiteList = async (values) => {
    try {
      if (values) {
        const response = await getData(`common/site-list?company_id=${values}`);

        if (response) {
          setSiteList(response?.data?.data);
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
  const GetDepartmentList = async () => {
    try {
      const response = await getData(`shop-revenue-commission/itemlist`);

      if (response) {
        setDepartmentList(response?.data?.data?.items);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const headsvalueinitialValues = {
    headsvalue: [
      {
        commission_type: "",
        commission: "",
        end_value: "",
        start_value: "",
      },
    ],
  };
  const headsvalueonsubmit = () => {
  };
  const formik2 = useFormik({
    initialValues: headsvalueinitialValues,

    onSubmit: headsvalueonsubmit,
  });



  const pushnonbunkeredSalesRow = () => {
    if (formik2.isValid) {
      formik2.values.headsvalue.push({
        commission_type: "",
        commission: "",
        end_value: "",
        start_value: "",
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

    clickedId && handleDelete(clickedId, index);
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
      const response = await postData(
        "shop-revenue-commission/delete",
        formData
      );
      // Console log the response
      if (apidata.api_response === "success") {
        const updatedRows = [...formik2.values.headsvalue];
        updatedRows.splice(index, 1);
        formik2.setFieldValue("headsvalue", updatedRows);
        handleSubmit(formik?.values);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const combinedOnSubmit = async () => {
    try {
      const formData = new FormData();

      for (const obj of formik2.values?.headsvalue) {
        const { commission_type, end_value, start_value, commission } = obj;

        const index = formik2.values.headsvalue.indexOf(obj);

        // Validate start_value
        if (
          start_value === null ||
          start_value === "" ||
          isNaN(start_value) ||
          start_value < 0 ||
          start_value > 9999999
        ) {
          ErrorAlert(
            `Invalid start_value for item at index ${index}. Please enter a valid integer between 0 and 9999999.`
          );
          return; // Stop processing further items
        }

        // Validate end_value
        if (
          end_value === null ||
          end_value === "" ||
          isNaN(end_value) ||
          end_value < 1 ||
          end_value > 9999999
        ) {
          ErrorAlert(
            `Invalid end_value for item at index ${index}. Please enter a valid integer between 1 and 9999999.`
          );
          return; // Stop processing further items
        }

        // Validate commission
        if (
          commission === null ||
          commission === "" ||
          isNaN(commission) ||
          commission < 0 ||
          commission > 100
        ) {
          ErrorAlert(
            `Invalid commission for item at index ${index}. Please enter a valid integer between 0 and 100.`
          );
          return; // Stop processing further items
        }

        // Validate commission_type
        if (
          commission_type === null ||
          commission_type === "" ||
          isNaN(commission_type) ||
          ![0, 1].includes(Number(commission_type))
        ) {
          ErrorAlert(
            `Invalid commission_type for item at index ${index}. Please enter 0 or 1.`
          );
          return; // Stop processing further items
        }

        // If all validations pass, append the values to formData
        if (end_value !== null && end_value !== "") {
          formData.append(`end_value[${index}]`, end_value);
        }
        if (start_value !== null && start_value !== "") {
          formData.append(`start_value[${index}]`, start_value);
        }
        if (commission_type !== null && commission_type !== "") {
          formData.append(`commission_type[${index}]`, commission_type);
        }
        if (commission !== null && commission !== "") {
          formData.append(`commission[${index}]`, commission);
        }
      }

      formData.append("company_id", formik.values.company_id);

      formData.append("client_id", formik.values.client_id);
      formData.append("site_id", formik.values.site_id);
      formData.append("department_item_id", formik.values.department_item_id);

      const postDataUrl = "/shop-revenue-commission/update";

      await postData(postDataUrl, formData); // Set the submission state to false after the API call is completed
    } catch (error) { }
  };



  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Shop Revenue Commission</h1>
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
                Shop Revenue Commission
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header className="d-flex justify-content-space-between">
                <h3 className="card-title">Shop Revenue Commission</h3>
              </Card.Header>
              {/* here my body will start */}
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
                                formik.setFieldValue("department_item_id", "");
                                formik2.resetForm();
                              } else {
                                formik.setFieldValue("client_id", "");
                                formik.setFieldValue("company_id", "");
                                formik.setFieldValue("department_item_id", "");

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
                    <Col lg={3} md={3}>
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
                              //   GetDepartmentList(selectcompany);
                              GetSiteList(selectcompany);
                              formik.setFieldValue("department_item_id", "");
                              formik.setFieldValue("company_id", selectcompany);
                            } else {
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("department_item_id", "");

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

                    <Col lg={3} md={3}>
                      <div className="form-group">
                        <label htmlFor="site_id" className="form-label mt-4">
                          Site Name
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`input101 ${formik.errors.site_id && formik.touched.site_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="site_id"
                          name="site_id"
                          value={formik.values.site_id}
                          onChange={(e) => {
                            const selectedsite_id = e.target.value;

                            if (selectedsite_id) {
                              GetDepartmentList();
                              formik.setFieldValue("site_id", selectedsite_id);
                            }
                          }}
                        >
                          <option value="">Select a Site</option>
                          {CompanyList && SiteList.length > 0 ? (
                            SiteList.map((site) => (
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
                    <Col lg={3} md={3}>
                      <div className="form-group">
                        <label
                          htmlFor="department_item_id"
                          className="form-label mt-4"
                        >
                          Department
                        </label>
                        <select
                          className={`input101 ${formik.errors.department_item_id &&
                            formik.touched.department_item_id
                            ? "is-invalid"
                            : ""
                            }`}
                          id="department_item_id"
                          name="department_item_id"
                          value={formik.values.department_item_id}
                          onChange={(e) => {
                            const selectedType = e.target.value;

                            if (selectedType) {
                              formik.setFieldValue(
                                "department_item_id",
                                selectedType
                              );
                            } else {
                              formik.setFieldValue("department_item_id", "");
                            }
                          }}
                        >
                          <option value="">Select a Department</option>
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
                            <option disabled>No Deduction</option>
                          )}
                        </select>
                        {formik.errors.department_item_id &&
                          formik.touched.department_item_id && (
                            <div className="invalid-feedback">
                              {formik.errors.department_item_id}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <div className="text-end">

                    <button
                      className="btn btn-danger me-2"
                      type="button" // Set the type to "button" to prevent form submission
                      onClick={() => handleClearForm()} // Call a function to clear the form
                    >
                      Clear
                    </button>
                    <button
                      type="submit" // Change the type to "button" to prevent form submission
                      className="btn btn-primary me-2"
                    // onClick={() => {
                    //   handleSubmit(formik.values); // Call handleSubmit when the button is clicked
                    // }}
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
              <h3 className="card-title">Shop Revenue Commission </h3>
            </div>
            <span className="text-end">
              {data && formik2.values.headsvalue?.length > 0 && (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={pushnonbunkeredSalesRow}
                >
                  <AddBoxIcon />
                </button>
              )}
            </span>
          </Card.Header>

          <Card.Body>
            {data && formik2.values.headsvalue?.length > 0 ? (
              <Row>
                {formik2.values.headsvalue.map((item, index) => (
                  <>
                    <React.Fragment key={index}>
                      <Col lg={3} md={3}>
                        <div
                          className="form-group"
                          controlId={`headsvalue[${index}].commission_type`}
                        >
                          <Form.Label>
                            {" "}
                            Commission Type:
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <select
                            className={`input101 ${formik.errors.company_id &&
                              formik.touched.company_id
                              ? "is-invalid"
                              : ""
                              }`}
                            id={`headsvalue[${index}].commission_type`}
                            name={`headsvalue[${index}].commission_type`}
                            onChange={formik2.handleChange}
                            value={item?.commission_type || ""}
                          >
                            <option value="">Commission Type</option>
                            <option value="0">Daily</option>
                            <option value="1">weekly</option>
                          </select>
                          {formik2.errors.headsvalue?.[index]
                            ?.commission_type &&
                            formik2.touched[
                            `headsvalue[${index}].commission_type`
                            ] && (
                              <div className="invalid-feedback">
                                {
                                  formik2.errors.headsvalue[index]
                                    .commission_type
                                }
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col lg={2} md={2}>
                        <Form.Group
                          controlId={`headsvalue[${index}].commission`}
                        >
                          <Form.Label>
                            {" "}
                            Commission:<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${formik2.errors.headsvalue?.[index]?.commission &&
                              formik2.touched[`headsvalue[${index}].commission`]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].commission`}
                            onChange={formik2.handleChange}
                            placeholder="Commission"
                            value={
                              item?.commission !== undefined
                                ? item.commission
                                : ""
                            }
                          />
                          {formik2.errors.headsvalue?.[index]?.commission &&
                            formik2.touched[
                            `headsvalue[${index}].commission`
                            ] && (
                              <div className="invalid-feedback">
                                {formik2.errors.headsvalue[index].commission}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`headsvalue[${index}].start_value`}
                        >
                          <Form.Label>
                            {" "}
                            Start Value:<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${formik2.errors.headsvalue?.[index]?.start_value &&
                              formik2.touched[
                              `headsvalue[${index}].start_value`
                              ]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].start_value`}
                            onChange={formik2.handleChange}
                            placeholder="Start Value"
                            value={
                              item?.start_value !== undefined
                                ? item.start_value
                                : ""
                            }
                          />
                          {formik2.errors.headsvalue?.[index]?.start_value &&
                            formik2.touched[
                            `headsvalue[${index}].start_value`
                            ] && (
                              <div className="invalid-feedback">
                                {formik2.errors.headsvalue[index].start_value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col lg={3} md={3}>
                        <Form.Group
                          controlId={`headsvalue[${index}].end_value`}
                        >
                          <Form.Label>
                            {" "}
                            End Value:<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            className={`input101 ${formik2.errors.headsvalue?.[index]?.end_value &&
                              formik2.touched[`headsvalue[${index}].end_value`]
                              ? "is-invalid"
                              : ""
                              }`}
                            name={`headsvalue[${index}].end_value`}
                            onChange={formik2.handleChange}
                            placeholder="End Value"
                            value={
                              item?.end_value !== undefined
                                ? item.end_value
                                : ""
                            }
                          />
                          {formik2.errors.headsvalue?.[index]?.end_value &&
                            formik2.touched[
                            `headsvalue[${index}].end_value`
                            ] && (
                              <div className="invalid-feedback">
                                {formik2.errors.headsvalue[index].end_value}
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col lg={1} md={1} className="text-end">
                        <div className="text-end" style={{ marginTop: "36px" }}>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRemoveClick(index)}
                          >
                            <RemoveCircleIcon />
                          </button>
                        </div>
                      </Col>
                    </React.Fragment>
                    {/* {index !== formik2.values.headsvalue.length - 1 &&
                    data?.data.length > 0 ? (
                      <hr className="mt-4"></hr>
                    ) : null} */}
                  </>
                ))}
              </Row>
            ) : (
              <>
                <img
                  src={require("../../../assets/images/commonimages/no_data.png")}
                  alt="MyChartImage"
                  className="all-center-flex nodata-image"
                />
              </>
            )}
          </Card.Body>
          <Card.Footer>
            {isUpdatePermissionAvailable &&
              data &&
              formik2.values.headsvalue?.length > 0 && (
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
              )}
          </Card.Footer>
        </Card>
      </>
    </>
  );
};

export default withApi(SageDeduction);
