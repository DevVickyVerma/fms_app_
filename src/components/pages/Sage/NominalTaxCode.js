import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import { Breadcrumb, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import Loaderimg from "../../../Utils/Loader";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { UploadFile } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
const UploadCompetitor = (props) => {
  const { getData, isLoading, postData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [CompetitorData, setCompetitorData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [data, setData] = useState();

  const [isdataLoading, setIsLoading] = useState(false);

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isImportPermissionAvailable = permissionsArray?.includes(
    "nominal-taxcode-import"
  );

  const formik = useFormik({
    initialValues: {
      client_id: "",
      company_id: "",

      image: null,
    },
    validationSchema: Yup.object({
      company_id: Yup.string().required("Company is required"),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    try {
      const response = await getData(
        `/sage/nominal-tax-code/list?client_id=${selectedClientId}&company_id=${values.company_id}`
      );

      const { data } = response;
      if (data) {
        console.log(data?.data, "company_id");
        setData(data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const fetchCommonListData = async () => {
    try {
      const response = await getData("/client/commonlist");

      const { data } = response;
      if (data) {
        setCompetitorData(response.data);

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
          // }
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    fetchCommonListData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
    formik.setFieldError("image", "");
  };

  const handleDrop = (event) => {
    event.preventDefault();
  };
  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "8%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Code",
      selector: (row) => [row?.code],
      sortable: false,
      width: "23%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.code}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => [row.name],
      sortable: true,
      width: "23%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created By",
      selector: (row) => [row.created_by],
      sortable: true,
      width: "23%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_by}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: true,
      width: "23%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };
  const isButtonDisabled = formik.values.client_id && formik.values.company_id;
  const isShowButtonDisabled =
    formik.values.client_id &&
    formik.values.company_id &&
    formik.values.image !== null &&
    formik.values.image;

  const ShowLogs = async (values) => {
    try {
      const response = await getData(
        `/sage/nominal-tax-code/list?client_id=${selectedClientId}&company_id=${values.company_id}`
      );

      const { data } = response;
      if (data) {
        console.log(data?.data, "company_id");
        setData(data?.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
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

  const Onupload = async () => {
    try {
      const formData = new FormData();

      formData.append("company_id", formik.values.company_id);
      formData.append("codes", formik.values.image);
      formData.append("client_id", selectedClientId);
      const postDataUrl = "sage/nominal-tax-code/import";

      const postResponse = await postData(postDataUrl, formData);
      console.log(postResponse?.status_code, "postResponse");
      if (postResponse?.status_code == 200) {
        ShowLogs(formik.values);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {isdataLoading || isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Nominal Tax Code</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item className="breadcrumb-item">
                Sage
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Nominal Tax Code
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* here I will start Body of competitor */}
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Nominal Tax Code</Card.Title>
              </Card.Header>
              {/* here my body will start */}
              <Card.Body>
                <form onSubmit={formik.handleSubmit}>
                  <Row>
                    {localStorage.getItem("superiorRole") !== "Client" && (
                      <Col lg={4} md={4}>
                        <div className="form-group">
                          <label
                            htmlFor="client_id"
                            className="form-label mt-4"
                          >
                            Client
                            <span className="text-danger">*</span>
                          </label>
                          <select
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
                              formik.handleChange(e);
                              setSelectedCompanyList([]);
                              setSelectedSiteList([]);
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("site_id", "");

                              const selectedClient = CompetitorData.data.find(
                                (client) => client.id === e.target.value
                              );

                              if (selectedClient) {
                                setSelectedCompanyList(
                                  selectedClient.companies
                                );
                              }
                            }}
                          >
                            <option value="">Select a Client</option>
                            {CompetitorData.data &&
                            CompetitorData.data.length > 0 ? (
                              CompetitorData.data.map((item) => (
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
                          className={`input101 ${
                            formik.errors.company_id &&
                            formik.touched.company_id
                              ? "is-invalid"
                              : ""
                          }`}
                          id="company_id"
                          name="company_id"
                          value={formik.values.company_id}
                          onChange={(e) => {
                            const selectedCompany = e.target.value;
                            formik.setFieldValue("company_id", selectedCompany);
                            setSelectedSiteList([]);
                            const selectedCompanyData =
                              selectedCompanyList.find(
                                (company) => company.id === selectedCompany
                              );
                            if (selectedCompanyData) {
                              setSelectedSiteList(selectedCompanyData.sites);
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
                    {isImportPermissionAvailable ? (
                      <Col lg={4} md={4}>
                        <div className="form-group">
                          <label htmlFor="image" className="form-label mt-4">
                            File
                          </label>
                          <div
                            className={`dropzone ${
                              formik.errors.image && formik.touched.image
                                ? "is-invalid"
                                : ""
                            }`}
                            onDrop={(event) => handleDrop(event)}
                            onDragOver={(event) => event.preventDefault()}
                          >
                            <input
                              type="file"
                              id="image"
                              name="image"
                              accept=".xlsx, .xls"
                              onChange={(event) => handleImageChange(event)}
                              className="form-control"
                            />

                            <p>
                              Drag and drop your File here, or click to browse
                            </p>
                          </div>
                          {formik.errors.image && formik.touched.image && (
                            <div className="invalid-feedback">
                              {formik.errors.image}
                            </div>
                          )}
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                  <div className="text-end">
                    <button
                      type="button" // Change the type to "button" to prevent form submission
                      className="btn btn-danger me-2"
                      disabled={!isButtonDisabled}
                      onClick={() => {
                        handleSubmit(formik.values); // Call handleSubmit when the button is clicked
                      }}
                    >
                      Show Logs
                    </button>

                    {isImportPermissionAvailable ? (
                      <button
                        type="button" // Change the type to "button" to prevent form submission
                        className="btn btn-primary me-2"
                        disabled={!isShowButtonDisabled}
                        onClick={() => {
                          Onupload();
                        }}
                      >
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Card>
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
                      persistTableHead
                      pagination
                      paginationPerPage={20}
                      highlightOnHover
                      searchable={true}
                      //   onChangePage={(newPage) => setCurrentPage(newPage)}
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
      </>
    </>
  );
};

export default withApi(UploadCompetitor);
