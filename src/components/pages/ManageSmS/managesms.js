import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Breadcrumb, Card, Col, Modal, Pagination, Row } from "react-bootstrap";
import * as Yup from "yup";
import withApi from "../../../Utils/ApiHelper";

import Loaderimg from "../../../Utils/Loader";

import { useFormik } from "formik";

import { ErrorAlert, SuccessAlert } from "../../../Utils/ToastUtils";
const ManageSiteTank = (props) => {
  const { apidata, error, getData, postData, SiteID, ReportDate, isLoading } =
    props;
  const [data, setData] = useState();
  const [mybalance, setbalance] = useState();
  const [BuyMoree, setBuyMore] = useState();
  const [count, setCount] = useState(0);
  const [AddSiteData, setAddSiteData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);
  const [selectedSiteList, setSelectedSiteList] = useState([]);
  const [hasMorePage, setHasMorePages] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const [selectedClientId, setSelectedClientId] = useState("");

  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);

  const maxPagesToShow = 5;
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
  const handleSubmit1 = async (values) => {
    console.log(values, "handleSubmit1");
    const { client_id } = values;
    try {
      const response = await getData(`/sms/list?client_id=${client_id}`);

      if (response && response.data && response.data.data) {
        setData(response?.data?.data?.history);
        setbalance(response?.data?.data?.balance);
        setBuyMore(response?.data?.data?.buy_more);
        
        setCount(response.data.data.count);
        setCurrentPage(
          response?.data?.data?.currentPage
            ? response?.data?.data?.currentPage
            : 1
        );
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
        width: "16%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.site}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Credit",
      selector: (row) => [row.credit],
      sortable: true,
        width: "16%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.credit}</h6>
          </div>
        </div>
      ),
    },
    {
      name: " Debit",
      selector: (row) => [row.type],
      sortable: true,
        width: "16%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.debit}</h6>
          </div>
        </div>
      ),
    },
    {
      name: " Balance",
      selector: (row) => [row.balance],
      sortable: true,
        width: "16%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.balance}</h6>
          </div>
        </div>
      ),
    },
  

    {
      name: "Creator By",
      selector: (row) => [row.creator],
      sortable: true,
        width: "16%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.creator}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: true,
        width: "16%",
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

  const formik = useFormik({
    initialValues: {
      client_id: "",
    },
    onSubmit: (values) => {
      if (values.client_id) {
        handleSubmit1(values);
      } else {
        ErrorAlert("please Select a client");
      }
    },
  });

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

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const clientId = localStorage.getItem("superiorId");

    if (localStorage.getItem("superiorRole") !== "Client") {
      fetchCommonListData();
    } else {
      const userclient = {
        client_id: clientId,
      };
      handleSubmit1(userclient);
      setSelectedClientId(clientId);
    }
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClearForm = async (resetForm) => {
    formik.setFieldValue("site_id", "");
    formik.setFieldValue("start_date", "");
    formik.setFieldValue("client_id", "");
    formik.setFieldValue("company_id", "");
    setData();
    setbalance();
    setSelectedSiteList([]);
    setSelectedCompanyList([]);
    setSelectedClientId("");
  };

  const BuyMore = () => {
    setShowModal(true);
    formik.setFieldValue("smsamount", "");
  };
  const Smsvalidation = Yup.object().shape({
    smsamount: Yup.string().required("Amount is required"),
  });

  const Smsformik = useFormik({
    initialValues: {
      smsamount: "", // Initial value for the authentication code
    },
    validationSchema: Smsvalidation,
    onSubmit: (values) => {
      BuySmS(values);
      console.log(values);
    },
  });
  const BuySmS = async (values) => {
    try {
      const formData = new FormData();

      formData.append("credit", values.smsamount);
      formData.append("client_id", selectedClientId);

      const postDataUrl = "sms/update-credit";
  



      const response = await postData(postDataUrl, formData);

      if (apidata.api_response === "success") {
        setShowModal(false);
   
        const userclient = {
          client_id: selectedClientId,
        };
        formik.setFieldValue("smsamount", ""); // Assuming "smsamount" is the field name you want to clear


        handleSubmit1(userclient);
       
      }
    } catch (error) {
      console.log(error); // Set the submission state to false if an error occurs
    }
  };
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Manage Sms</h1>
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
                Manage Sms
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        {localStorage.getItem("superiorRole") !== "Client" && (
          <Row>
            <Col md={12} xl={12}>
              <Card>
                <Card.Body>
                  <form onSubmit={formik.handleSubmit}>
                    <Card.Body>
                      <Row>
                        <Col lg={6} md={6}>
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
                              value={formik.values.client_id}
                              onChange={(e) => {
                                const selectedType = e.target.value;
                                console.log(selectedType, "selectedType");

                                if (selectedType) {
                                  formik.setFieldValue(
                                    "client_id",
                                    selectedType
                                  );
                                  setSelectedClientId(selectedType);
                                  setSiteList([]);
                                  formik.setFieldValue("company_id", "");
                                  formik.setFieldValue("site_id", "");
                                } else {
                                  console.log(
                                    selectedType,
                                    "selectedType no values"
                                  );
                                  formik.setFieldValue("client_id", "");
                                  formik.setFieldValue("company_id", "");
                                  formik.setFieldValue("site_id", "");

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
                      </Row>
                    </Card.Body>
                    <Card.Footer className="text-end">
                      <button className="btn btn-primary me-2" type="submit">
                        Submit
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        type="button" // Set the type to "button" to prevent form submission
                        onClick={() => handleClearForm()} // Call a function to clear the form
                      >
                        Clear
                      </button>
                    </Card.Footer>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header className="d-flex justify-content-space-between">
                <h3 className="card-title">Manage Sms </h3>
                <span>
                  <button
                    className="btn btn-success me-2"
                    type="button" // Set the type to "button" to prevent form submission
                    style={{ cursor: "pointer" }}
                  >
                    Balance:{mybalance ? mybalance : "0"}
                  </button>
               
                  {BuyMoree ? (
                    <button
                      className="btn btn-danger me-2"
                      type="button" // Set the type to "button" to prevent form submission
                      onClick={BuyMore}
                    >
                      Buy More
                    </button>
                  ) : (
                    ""
                  )}{" "}
                </span>
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
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              centered
              style={{ paddingBottom: "0px" }}
              className="custom-modal-width custom-modal-height"
            >
              <Modal.Header
                style={{
                  color: "#fff",
                  background: "#6259ca",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ paddingBottom: "0px" }}>
                  <Modal.Title style={{ margin: "0px" }}>Buy Sms</Modal.Title>
                </div>
                <div>
                  <span
                    className="modal-icon close-button"
                    onClick={handleCloseModal}
                    style={{ cursor: "pointer" }}
                  ></span>
                </div>
              </Modal.Header>
              <Modal.Body
                className="Disable2FA-modalsss "
                style={{ paddingBottom: "0px" }}
              >
                <div className="modal-contentDisable2FAsss">
                  <div className="card">
                    <div className="card-body" style={{ padding: "10px" }}>
                      <form onSubmit={Smsformik.handleSubmit}>
                        <label htmlFor="start_date" className="form-label mt-4">
                          Amount
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="input101 authentication-code-input mb-2"
                          id="smsamount"
                          name="smsamount"
                          placeholder="Amount"
                       
                          onChange={Smsformik.handleChange}
                          onBlur={Smsformik.handleBlur}
                        />
                        {Smsformik.touched.smsamount &&
                          Smsformik.errors.smsamount && (
                            <div className="error-message">
                              {Smsformik.errors.smsamount}
                            </div>
                          )}
                        <span className="mt-4 ">
                          <strong>Final Amount:</strong>{" "}
                          {Smsformik.values.smsamount * 0.008}
                        </span>

                        <div className="text-end mt-4">
                          <button
                            type="button"
                            className="btn btn-danger mx-4"
                            onClick={handleCloseModal}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary ml-4 verify-button"
                            type="submit"
                            disabled={!formik.isValid}
                          >
                            Buy Now
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageSiteTank);
