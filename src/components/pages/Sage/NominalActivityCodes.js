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
const UploadCompetitor = (props) => {
  const { getData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [CompetitorData, setCompetitorData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [data, setData] = useState();

  const [isdataLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      client_id: "",

      image: null,
    },
    validationSchema: Yup.object({
      image: Yup.mixed()
        .required("File is required")
        .test("fileType", "Only XLSX and XLS files are allowed", (value) => {
          if (value) {
            const allowedFileTypes = [
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
              "application/vnd.ms-excel", // XLS
            ];
            const isValidFileType = allowedFileTypes.includes(value.type);
            return isValidFileType;
          }
          return false;
        }),
    }),

    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

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
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("client_id", selectedClientId);
    formData.append("file", values.image);

    // Set isLoading to true to display the loading indicator
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_UPLOAD_FILE_BASE_URL}/upload-compititor-price`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        SuccessToast(data.message);
        navigate("/competitor");
      } else {
        const errorData = await response.json();
        ErrorToast(errorData.message);
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      // Set isLoading back to false after the request is completed
      setIsLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
    formik.setFieldError("image", ""); // Clear any previous validation error
  };

  const handleDrop = (event) => {
    event.preventDefault();
  };
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
      name: "Site Name",
      selector: (row) => [row?.site_name],
      sortable: false,
      width: "85%",
      cell: (row, index) => (
        <Link
          to={`/sitecompetitor/${row.id}`}
          className="d-flex"
          style={{ cursor: "pointer" }}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-flex align-items-center">
            <span>
              <img
                src={row?.supplierImage}
                alt="supplierImage"
                className="w-5 h-5 "
              />
            </span>
            <h6 className="mb-0 fs-14 fw-semibold ms-2"> {row?.site_name}</h6>
          </div>
        </Link>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };
  return (
    <>
      {isdataLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Nominal Activity Codes</h1>
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
                Nominal Activity Codes
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* here I will start Body of competitor */}
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h3">Nominal Activity Codes</Card.Title>
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

                              // Reset the selected company and site
                              setSelectedCompanyList([]);
                              setSelectedSiteList([]);
                              const selectedClient = CompetitorData.data.find(
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
                    <Col lg={4} md={6}>
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
                          onChange={(e) => {
                            const selectedCompany = e.target.value;

                            formik.setFieldValue("company_id", selectedCompany);
                            setSelectedCompanyId(selectedCompany);
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
                    <Col lg={4} md={4}>
                      <div className="form-group">
                        <label htmlFor="image" className="form-label mt-4">
                          File
                          <span className="text-danger">*</span>
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
                  </Row>
                  <div className="text-end">
                    <Link type="submit" className="btn btn-danger me-2 ">
                      Show Logs
                    </Link>

                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
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
