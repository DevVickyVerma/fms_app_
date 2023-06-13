import React, { useEffect, useState } from "react";

import { Link, Navigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
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
import { Button } from "bootstrap";

import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";

const ManageDsr = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);
  const [AddSiteData, setAddSiteData] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
    handleFetchData()
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "supplier-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("supplier-edit");
  const isAddPermissionAvailable =
    permissionsArray?.includes("supplier-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("supplier-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("supplier-details");
  const isAssignPermissionAvailable =
    permissionsArray?.includes("supplier-assign");

  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();


  const names = [
    "Fuel Sales",
    "Bunkered Sales",
    "Fuel-Inventory",
    "Fuel Delivery",
    "Valet &  Coffee Sales",
    "Shop Sales",
    "Department Shop Sales",
    "Charges & Deduction",
    "Credit Card Banking",
    "Cash Banking",
    "Bank Deposits",
    "Department Shop Summary",
    "Summary",
  ]; // Array of names
  const names1 = [
    { id: 1, name: "Upload Bank Statement" },
    { id: 2, name: "Upload Fuel Purchases" },
    { id: 3, name: "Upload BP NCTT Statement" },
    { id: 4, name: "Upload Fairbank Statement" },
    { id: 5, name: "Upload BP Commission Statement" },
    { id: 6, name: "Upload Lottery & Phonecard Invoice data" },
    { id: 7, name: "Upload Coffee/Carwash Invoice data" },
    { id: 8, name: "Upload Sage Ledger (Sales)" },
    { id: 9, name: "Upload Safe Ledger (Budget)" },
    { id: 10, name: "Upload Vat Ledger" },
  ];



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

      formData.append("report", values.report);
      formData.append("client_id", values.client_id);
      formData.append("company_id", values.company_id);
      formData.append("site_id", values.site_id);

      // const postDataUrl = "shop/add";
      // const navigatePath = "/ManageShops";

      // await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };
  const handleClick = (item) => {
    console.log("Clicked card:", item.name);
    console.log("Clicked card:", item.id);
  };

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Data Entry</h1>
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
              Data Entry
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
                  report: "1",
                  client_id: "",
                  company_id: "",
                  site_id: "",
                  start_date: "",
                 
                
                }}
                validationSchema={Yup.object({
                  report: Yup.string().required(" report is required"),

                  client_id: Yup.string().required("Client is required"),
                  company_id: Yup.string().required("Company is required"),
                  site_id: Yup.string().required("Site is required"),
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
                     
                        <Col lg={6} md={12}>
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
                            </Field>

                            <ErrorMessage
                              component="div"
                              className="invalid-feedback"
                              name="client_id"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6} md={12}>
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
                                    (company) => company.id === selectedCompany
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
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6} md={12}>
                          <FormGroup>
                            <label
                              htmlFor="site_id"
                              className="form-label mt-4"
                            >
                              Site
                              <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              className={`input101 ${
                                errors.site_id && touched.site_id
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
                            </Field>
                            <ErrorMessage
                              component="div"
                              className="invalid-feedback"
                              name="site_id"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6} md={12}>
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
                            >
                          
                            </Field>
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

      <Row>
        <Col md={12} xl={12}>
          <Card>
            {/* <Card.Header>
              <h3 className="card-title">Upload Files</h3>
              <Col lg={8} md={8}>
                <div className="form-group d-flex">
                <label
                              className=" form-label mt-4"
                              htmlFor="report"
                            >
                            File Upload
                              <span className="text-danger">*</span>
                            </label>
                  <Field
                              as="select"
                    className={`input101 ${
                  formik.errors.upload_id &&  touched.upload_id
                        ? "is-invalid"
                        : ""
                    }`}
                    id="upload_id"
                    name="upload_id"
                    onChange={  formik.handleChange}
                    value={values.upload_id}
                  >
                    <option value=""> Select File Upload Type</option>
                    <option value="1">Active</option>
                                <option value="0">InActive</option>
                  </Field>
                  {errors.upload_id && touched.upload_id && (
                    <div className="invalid-feedback">
                      {errors.upload_id}
                    </div>
                  )}
                </div>
              </Col>
            </Card.Header> */}
            <Card.Body>
              <Row>
                {names1.map((item) => (
                  <Col md={12} xl={3} key={item.id}>
                    <Card className="text-white bg-primary">
                      <Card.Body
                        className="card-Div"
                        onClick={() => handleClick(item)}
                      >
                        <h4 className="card-title">{item.name}</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12} xl={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Data Entry</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                {names.map((name, index) => (
                  <Col md={12} xl={3} sm={4} key={index}>
                    <Card className="text-white bg-primary">
                      <Card.Body className="card-Div">
                        <h4 className="card-title">{name}</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default withApi(ManageDsr);
