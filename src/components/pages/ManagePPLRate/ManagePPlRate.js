import React, { useEffect, useState } from "react";

import { Link, Navigate, useParams } from "react-router-dom";
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
import axios from "axios";
import Swal from "sweetalert2";
import { FormModal } from "../../../data/Modal/Modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import withApi from "../../../Utils/ApiHelper";
import SearchIcon from "@mui/icons-material/Search";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";

const ManageSiteTank = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const [AddSiteData, setAddSiteData] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [submitSiteID, setsubmitSiteID] = useState();
  const [localStorageSiteName, setlocalStorageSiteName] = useState();
  const [localStorageSiteID, setlocalStorageSiteID] = useState();

  const handleDelete = (id) => {
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
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("id", id);

        const axiosInstance = axios.create({
          baseURL: process.env.REACT_APP_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const DeleteRole = async () => {
          try {
            const response = await axiosInstance.post(
              "/site-ppl/delete",
              formData
            );
            setData(response.data.data);
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            FetchDatawithlocalstorage();
          } catch (error) {
            handleError(error);
          } finally {
          }
          // setIsLoading(false);
        };
        DeleteRole();
      }
    });
  };
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

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleSubmit1 = async (values) => {
    try {
      setsubmitSiteID(values.site_id);
      const response = await getData(
        `/site-ppl/list?site_id=${values.site_id}`
      );
      // site-tank/list?site_id=Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09
      console.log(response.data.data, "pump");

      if (response && response.data && response.data.data) {
        setData(response.data.data);
        const tank = {
          site_id: values?.site_id,
          client_id: values?.client_id,
          company_id: values?.company_id,
          sitename: response?.data?.data[0].site,
        };

        localStorage.setItem("SitePump", JSON.stringify(tank));
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

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
  const FetchDatawithlocalstorage = async (values) => {
    try {
      setsubmitSiteID(values?.site_id);
      const response = await getData(
        `/site-ppl/list?site_id=${localStorageSiteID}`
      );

      if (response && response.data && response.data.data) {
        setData(response.data.data);
        setlocalStorageSiteName(response?.data?.data[0].site);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    const localStorageData = localStorage.getItem("SitePump");

    // Parse the data as JSON
    const parsedData = JSON.parse(localStorageData);

    // Get the value of site_id
    const siteId = parsedData?.site_id;

    const siteName = parsedData?.sitename;

    setlocalStorageSiteID(siteId);
    setlocalStorageSiteName(siteName);

    handleFetchData();
    if (localStorageSiteID) {
      FetchDatawithlocalstorage();
    }
  }, [localStorageSiteID]);

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("ppl-edit");
  const isAddPermissionAvailable = permissionsArray?.includes("ppl-create");
  const isDeletePermissionAvailable = permissionsArray?.includes("ppl-delete");

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "6%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site Name",
      selector: (row) => [row.site],
      sortable: true,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.site}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Client  Name",
      selector: (row) => [row.client],
      sortable: true,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.client}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Company Name",
      selector: (row) => [row.company],
      sortable: true,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.company}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: true,
      width: "8.2%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Pence Per Liter",
      selector: (row) => [row.pence_per_liter],
      sortable: true,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.pence_per_liter}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Sales Volume",
      selector: (row) => [row.sales_volume],
      sortable: true,
      width: "14.2%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.sales_volume}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "14.2%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editppl/${row.id}`} // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 me-2"
              >
                <i>
                  <svg
                    className="table-edit"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11"
                onClick={() => handleDelete(row.id)}
              >
                <i>
                  <svg
                    className="table-delete"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
        </span>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Site PPL Rate</h1>
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
                Site PPL Rate
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addppl"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Site PPL Rate
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <Formik
                  initialValues={{
                    client_id: "",
                    company_id: "",
                    site_id: "",
                    start_date: "",
                  }}
                  validationSchema={Yup.object({
                    company_id: Yup.string().required("Company is required"),
                    site_id: Yup.string().required("Site is required"),
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
                            <Col lg={4} md={6}>
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
                          <Col lg={4} md={6}>
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
                                      (company) =>
                                        company.id === selectedCompany
                                    );
                                  if (selectedCompanyData) {
                                    setSelectedSiteList(
                                      selectedCompanyData.sites
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
                          <Col lg={4} md={6}>
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
                                onChange={(event) => {
                                  const site = event.target.value;
                                  setFieldValue("site_id", site);
                                }}
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
                        </Row>
                      </Card.Body>
                      <Card.Footer className="text-end">
                        {/* <Link
                          type="submit"
                          className="btn btn-danger me-2 "
                          to={`/managesitepump/`}
                        >
                          Reset
                        </Link> */}
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

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">
                  Site PPL Rate{" "}
                  {localStorageSiteName ? `(${localStorageSiteName})` : ""}{" "}
                </h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
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
                          paginationPerPage={20}
                          highlightOnHover
                          searchable={true}
                        />
                      </DataTableExtensions>
                    </div>
                  </>
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
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageSiteTank);
