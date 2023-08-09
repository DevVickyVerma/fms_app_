import React, { Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import * as loderdata from "../../../data/Component/loderdata/loderdata";
import axios from "axios";
import Swal from "sweetalert2";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";

const ManageSite = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [data, setData] = useState();
  // console.log("my props data", props);

  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const navigate = useNavigate();
  const [AddSiteData, setAddSiteData] = useState([]);
  // const [selectedBusinessType, setSelectedBusinessType] = useState("");
  // const [subTypes, setSubTypes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);

  const [sidebardataobject, setSideDataobject] = useState();
  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  const [clientIDLocalStorage, setclientIDLocalStorage] = useState(
    localStorage.getItem("superiorId")
  );

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setAddSiteData(response?.data);
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

  const handleSubmit1 = async (values) => {
    try {
      try {
        let clientIDCondition = "";
        if (localStorage.getItem("superiorRole") !== "Client") {
          clientIDCondition = `client_id=${values.client_id}&`;
        } else {
          clientIDCondition = `client_id=${clientIDLocalStorage}&`;
        }

        const response = await getData(
          `/workflow/?${clientIDCondition}company_id=${values.company_id}`
        );

        const { data } = response;
        if (data) {
          setData(data?.data);
        }
      } catch (error) {
        console.error("API error:", error);
      } // Set the submission state to false after the API call is completed
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    setclientIDLocalStorage(localStorage.getItem("superiorId"));
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("site-edit");
  const isAddPermissionAvailable = permissionsArray?.includes("site-create");
  const isDeletePermissionAvailable = permissionsArray?.includes("site-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("site-detail");
  const isAssignPermissionAvailable = permissionsArray?.includes("site-assign");

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "15%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "40%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.site_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: " WorkFlow",
      selector: (row) => [row.work_flow],
      sortable: false,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            {row.work_flow === "Not Done" ? (
              <h6 className="mb-0 fs-14 fw-semibold work-flow-danger-status ">
                {row.work_flow}
              </h6>
            ) : row.work_flow === "Done" ? (
              <h6 className="mb-0 fs-14 fw-semibold work-flow-sucess-status ">
                {row.work_flow}
              </h6>
            ) : (
              ""
            )}
          </div>
        </div>
      ),
    },
    {
      name: " Approval Required",
      selector: (row) => [row.approval],
      sortable: false,
      width: "20%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
          {row.approval === "No" ? (
              <h6 className="mb-0 fs-14 fw-semibold badge bg-success  ">
                {row.approval}
              </h6>
            ) : row.approval === "Yes" ? (
              <h6 className="mb-0 fs-14 fw-semibold badge bg-danger  ">
                {row.approval}
              </h6>
            ) : (
              ""
            )}
          </div>
        </div>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };

  useEffect(() => {
    handleFetchData();

    // console.clear();
  console.clear()  }, []);

  return (
    <>
    {isLoading ? <Loaderimg /> : null}
  
        <>
          <div className="page-header ">
            <div>
              <h1 className="page-title">WorkFlows</h1>

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
                  Others
                </Breadcrumb.Item>
                <Breadcrumb.Item
                  className="breadcrumb-item active breadcrumds"
                  aria-current="page"
                >
                  WorkFlows
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>

          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title"> Filter Data</h3>
                </Card.Header>
                <Card.Body>
                  <Formik
                    initialValues={{
                      client_id: "",
                      company_id: "",
                    }}
                    validationSchema={Yup.object({
                      company_id: Yup.string().required("Company is required"),
                    })}
                    onSubmit={(values) => {
                      handleSubmit1(values);
                    }}
                  >
                    {({ handleSubmit, errors, touched, setFieldValue }) => (
                      <Form onSubmit={handleSubmit}>
                        <Card.Body>
                          <Row>
                            {localStorage.getItem("superiorRole") !==
                              "Client" && (
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

                                      const selectedClient =
                                        AddSiteData.data.find(
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
                            )}
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

                                    setFieldValue(
                                      "company_id",
                                      selectedCompany
                                    );
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
                                      <option
                                        key={company.id}
                                        value={company.id}
                                      >
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
                          </Row>
                        </Card.Body>
                        <Card.Footer className="text-end">
                          <button
                            className="btn btn-primary me-2"
                            type="submit"
                          >
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

          <Row className=" row-sm">
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <h3 className="card-title"> WorkFlows</h3>
                </Card.Header>

                <Card.Body>
                  <div className="table-responsive deleted-table">
                    <DataTableExtensions {...tableDatas}>
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        // center={true}
                        persistTableHead
                        pagination
                        highlightOnHover
                        searchable={false}
                        responsive={true}
                      />
                    </DataTableExtensions>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
  
    </>
  );
};

export default withApi(ManageSite);
