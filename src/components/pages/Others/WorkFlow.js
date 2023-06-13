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
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }

  // const Loaderimg = () => {
  //   return (
  //     <div id="global-loader">
  //       <loderdata.Loadersbigsizes1 />
  //     </div>
  //   );
  // };

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

  const FetchTableData = async () => {
    try {
      const response = await getData("/site/list");
      console.log(response.data.data, "ddd");

      if (response && response.data && response.data.data.sites) {
        setData(response.data.data.sites);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const permissionsToCheck = [
    "site-list",
    "site-create",
    "site-status-update",
    "site-edit",
    "site-delete",
  ];
  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
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
      width: "10%",
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
      width: "50%",
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
      selector: (row) => [row.site_name],
      sortable: false,
      width: "20%",
      cell: (row, index) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.site_owner && row.site_owner ? (
                  <h6 className="mb-0 fs-14 fw-semibold">----</h6>
                ) : (
                  <h6 className="mb-0 fs-14 fw-semibold"> ---</h6>
                )}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error:", error);
          return <h6 className="mb-0 fs-14 fw-semibold">Error</h6>;
        }
      },
    },
    {
      name: " Approval Required",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "20%",
      cell: (row, index) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.site_owner && row.site_owner ? (
                  <h6 className="mb-0 fs-14 fw-semibold">----</h6>
                ) : (
                  <h6 className="mb-0 fs-14 fw-semibold"> ---</h6>
                )}
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error:", error);
          return <h6 className="mb-0 fs-14 fw-semibold">Error</h6>;
        }
      },
    },
  ];

  const tableDatas = {
    columns,
    data,
  };

  useEffect(() => {
    FetchTableData();
    handleFetchData();

    // console.clear();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
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
                  <h3 className="card-title"> FIlter Data</h3>
                </Card.Header>
                <Card.Body>
                  <Formik
                    initialValues={{
                      report: "1",
                      client_id: "",
                      company_id: "",
                      site_id: "",
                      start_date: "",
                      end_date: "",
                    }}
                    validationSchema={Yup.object({
                      report: Yup.string().required(" report is required"),

                      client_id: Yup.string().required("Client is required"),
                      company_id: Yup.string().required("Company is required"),
                      site_id: Yup.string().required("Site is required"),
                      start_date: Yup.date().required("Start Date is required"),
                      end_date: Yup.date().required("End Date is required"),
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
                            Generate Report
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
                        // pagination
                        highlightOnHover
                        searchable={false}
                      />
                    </DataTableExtensions>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default withApi(ManageSite);
