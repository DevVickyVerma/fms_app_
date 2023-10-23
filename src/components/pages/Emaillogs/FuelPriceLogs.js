import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  FormGroup,
  Pagination,
  Row,
} from "react-bootstrap";

import withApi from "../../../Utils/ApiHelper";

import Loaderimg from "../../../Utils/Loader";

import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";

const ManageSiteTank = (props) => {
  const { isLoading, getData } = props;
  const [data, setData] = useState();
  const [count, setCount] = useState(0);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [hasMorePage, setHasMorePages] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const maxPagesToShow = 5; // Adjust the number of pages to show in the center
  const pages = [];

  // Calculate the range of pages to display
  let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
  let endPage = Math.min(startPage + maxPagesToShow - 1, lastPage);

  // Handle cases where the range is near the beginning or end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  // Render the pagination items
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Add ellipsis if there are more pages before or after the displayed range
  if (startPage > 1) {
    pages.unshift(<Pagination.Ellipsis key="ellipsis-start" disabled />);
  }

  if (endPage < lastPage) {
    pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
  }
  const handleFetchListing = async () => {
    try {
      const response = await getData(`/site/fuel-price/logs?page=${currentPage}`);

      if (response && response.data && response.data.data) {
        const responseData = response.data.data;
        setData(responseData.priceLogs);
        setCount(responseData.count);
        setCurrentPage(responseData.currentPage);
        setHasMorePages(responseData.hasMorePages);
        setLastPage(responseData.lastPage);
        setPerPage(responseData.perPage);
        setTotal(responseData.total);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    handleFetchData();
    // handleFetchListing();
  }, []);
  const handleSubmit1 = async (values) => {
    try {
      const response = await getData(
        `/site/fuel-price/logs?site_id=${values.site_id}?drs_date=${values.start_date}?page=${currentPage}`
      );

      if (response && response.data && response.data.data) {
        setData(response?.data?.data?.priceLogs);
        setCount(response.data.data.count);
        setCurrentPage(response?.data?.data?.currentPage);
        setHasMorePages(response?.data?.data?.hasMorePages);

        setLastPage(response?.data?.data?.lastPage);
        setPerPage(response?.data?.data?.perPage);
        setTotal(response?.data?.data?.total);
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

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "5.5%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row.site],
      sortable: true,
      width: "12%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.site}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "User  Name",
      selector: (row) => [row.user],
      sortable: true,
      width: "12%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.user}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Name",
      selector: (row) => [row.name],
      sortable: true,
      width: "12%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },

    {
      name: " Action type",
      selector: (row) => [row.type],
      sortable: true,
      width: "12%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Prev Price",
      selector: (row) => [row.prev_price],
      sortable: true,
      width: "8%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.prev_price}</h6>
          </div>
        </div>
      ),
    },
    {
      name: " Price",
      selector: (row) => [row.price],
      sortable: true,
      width: "8%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.price}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Price Date",
      selector: (row) => [row.date],
      sortable: true,
      width: "16%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Log Date",
      selector: (row) => [row.created],
      sortable: true,
      width: "16%",
      cell: (row, index) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created}</h6>
          </div>
        </div>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };
  const hadndleShowDate = () => {
    const inputDateElement = document.querySelector('input[type="date"]');
    inputDateElement.showPicker();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const initialValues = {
    client_id: "",
    company_id: "",
    site_id: "",
    start_date: "",
  };
  const handleClearForm = (resetForm) => {
    resetForm(initialValues);
    setSelectedSiteList([]);
    setSelectedCompanyList([]);
    setSelectedClientId("");
  };

  useEffect(() => {
    handleFetchListing(currentPage);
    console.clear();
  }, [currentPage]);
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Fuel price logs</h1>
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
                Fuel price logs
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Body>
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values) => {
                    handleSubmit1(values);
                  }}
                >
                  {({
                    handleSubmit,
                    errors,
                    touched,
                    setFieldValue,
                    resetForm,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Card.Body>
                        <Row>
                          {localStorage.getItem("superiorRole") !==
                            "Client" && (
                              <Col lg={3} md={3}>
                                <FormGroup>
                                  <label
                                    htmlFor="client_id"
                                    className=" form-label mt-4"
                                  >
                                    Client
                                  </label>
                                  <Field
                                    as="select"
                                    className={`input101 ${errors.client_id && touched.client_id
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
                                      setSelectedSiteList([]);
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
                          <Col lg={3} md={3}>
                            <FormGroup>
                              <label
                                htmlFor="company_id"
                                className="form-label mt-4"
                              >
                                Company
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.company_id && touched.company_id
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
                          <Col lg={3} md={3}>
                            <FormGroup>
                              <label
                                htmlFor="site_id"
                                className="form-label mt-4"
                              >
                                Site
                              </label>
                              <Field
                                as="select"
                                className={`input101 ${errors.site_id && touched.site_id
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
                          <Col lg={3} md={6}>
                            <FormGroup>
                              <label
                                htmlFor="start_date"
                                className="form-label mt-4"
                              >
                                Date
                              </label>
                              <Field
                                type="date"
                                min={"2023-01-01"}
                                onClick={hadndleShowDate}
                                className={`input101 ${errors.start_date && touched.start_date
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                id="start_date"
                                name="start_date"
                              ></Field>
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
                        <button className="btn btn-primary me-2" type="submit">
                          Submit
                        </button>
                        <button
                          className="btn btn-danger me-2"
                          type="button" // Set the type to "button" to prevent form submission
                          onClick={() => handleClearForm(resetForm)} // Call a function to clear the form
                        >
                          Clear
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
                <h3 className="card-title">Fuel price logs </h3>
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
              {data?.length > 0 ? (
                <>
                  <Card.Footer>
                    <div style={{ float: "right" }}>
                      <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                        {pages}
                        <Pagination.Next
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === lastPage}
                        />
                        <Pagination.Last
                          onClick={() => handlePageChange(lastPage)}
                        />
                      </Pagination>
                    </div>
                  </Card.Footer>
                </>
              ) : (
                <></>
              )}
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageSiteTank);
