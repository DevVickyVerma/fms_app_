import React, { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
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
import MapDepartmentItems from "./mapSageitem";
const UploadCompetitor = (props) => {
  const { getData, isLoading, postData } = props;
  const [selectedCompanyList, setSelectedCompanyList] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [ClientList, setClientList] = useState([]);
  const [CompanyList, setCompanyList] = useState([]);
  const [SiteList, setSiteList] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [companyid, setcompanyid] = useState('');
  const [itemid, setitemid] = useState('');
  const [data, setData] = useState();

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

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
        `/sage/item/list?company_id=${values.company_id}`
      );

      const { data } = response;
      if (data) {
        setcompanyid(values.company_id)
        setData(data?.data?.items);
      }
    } catch (error) {
      console.error("API error:", error);
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
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (row) => {
    console.log(row, "handleOpenModal");
    // Add any additional logic here if needed
    setModalTitle(row.name);
    setitemid(row.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Add any additional logic here if needed
    setShowModal(false);
  };
  const isEditPermissionAvailable = permissionsArray?.includes("itemhead-list");
  const columns = [
    {
      name: "Sr. No.",
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
      name: "Name",
      selector: (row) => [row.name],
      sortable: true,
      width: "72%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: true,
      width: "20%",
      cell: (row) => (
        <span className="text-center d-flex justify-content-center gap-1 flex-wrap">
          {isEditPermissionAvailable ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Map Sage Item</Tooltip>}
            >
              <Button
                className="btn btn-primary btn-sm rounded-11 me-2 responsive-btn"
                onClick={() => {
                  handleOpenModal(row);
                }}
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
                    <path d="M3 11.25V12.75H21V11.25H3zM12 3.75V21.75H13.5V3.75H12z" />
                  </svg>
                </i>
              </Button>
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
  const isButtonDisabled = formik.values.client_id && formik.values.company_id;

  const GetCompanyList = async (values) => {
    try {
      if (values) {
        const response = await getData(
          `common/company-list?client_id=${values}`
        );

        if (response) {
          console.log(response, "company");
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

        <MapDepartmentItems
          showModal={showModal}
          handleClose={handleCloseModal}
          modalTitle={modalTitle}
          companyid={companyid}
          itemid={itemid}
        />
        {/* here I will start Body of competitor */}
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
                                GetCompanyList(selectedType);
                                formik.setFieldValue("client_id", selectedType);
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
                    )}
                    <Col Col lg={4} md={6}>
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
                            const selectcompany = e.target.value;

                            if (selectcompany) {
                              formik.setFieldValue("site_id", "");
                              formik.setFieldValue("company_id", selectcompany);
                            } else {
                              formik.setFieldValue("company_id", "");
                              formik.setFieldValue("site_id", "");

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
                  </Row>
                  <div className="text-end">
                    <button
                      type="button" // Change the type to "button" to prevent form submission
                      className="btn btn-primary me-2"
                      disabled={!isButtonDisabled}
                      onClick={() => {
                        handleSubmit(formik.values); // Call handleSubmit when the button is clicked
                      }}
                    >
                      Submit
                    </button>

                    {/* {isImportPermissionAvailable ? (
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
                    )} */}
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
