import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import {
  Breadcrumb,
  Card,
  Col,
  Dropdown,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import UploadSageSales from "./UploadSageSales";
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import useCustomDelete from "../../../Utils/useCustomDelete";

const ManageCompany = (props) => {
  const { apidata, isLoading, getData, postData } = props;
  const { handleError } = useErrorHandler();
  const [showUploadSageSalesModal, setShowUploadSageSalesModal] =
    useState(false);
  const [UploadModalTitle, setUploadModalTitle] = useState();
  const [UploadModalURLPath, setUploadModalURLPath] = useState();
  const [companyId, setCompanyId] = useState("");
  const [data, setData] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  const { customDelete } = useCustomDelete();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "company/delete", formData, FetchTableData);
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id);

    const newStatus = row.status === 1 ? 0 : 1;
    formData.append("status", newStatus);

    ToggleStatus(formData);
  };

  const ToggleStatus = async (formData) => {
    try {
      await postData("/company/update-status", formData);
      // Console log the response
      if (apidata.api_response === "success") {
        FetchTableData();
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    FetchTableData();
  }, [currentPage, searchTerm]);

  const FetchTableData = async () => {
    try {
      let apiUrl = `/company/list?page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }
      const response = await getData(apiUrl);

      if (response && response.data && response.data.data.companies) {
        setData(response.data.data.companies);
        setCurrentPage(response?.data?.data?.currentPage || 1);
        setLastPage(response?.data?.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleEdit = (row) => {
    localStorage.setItem("Company_id", row.id);
    localStorage.setItem("Company_Client_id", row.client_id);
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("company-edit");
  const isAddPermissionAvailable = permissionsArray?.includes("company-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("company-delete");
  const isSagePermissionAvailable = permissionsArray?.includes(
    "company-sage-config"
  );

  const isUploadSagePermissionAvailable =
    permissionsArray?.includes("upload-sale");
  const isUploadBankReferencePermissionAvailable = permissionsArray?.includes(
    "company-upload-bank-ref"
  );
  const isCompanyUploadBankReimbursementPermissionAvailable =
    permissionsArray?.includes("company-upload-bank-reimbursement");

  const anyPermissionAvailable =
    isEditPermissionAvailable ||
    isSagePermissionAvailable ||
    isUploadSagePermissionAvailable ||
    isCompanyUploadBankReimbursementPermissionAvailable ||
    isUploadBankReferencePermissionAvailable ||
    isDeletePermissionAvailable ||
    isSagePermissionAvailable;

  const columns = [
    {
      name: "Company",
      selector: (row) => [row.company_name],
      sortable: false,
      //  width: "25%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.company_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Client Name",
      selector: (row) => [row.client],
      sortable: false,
      //  width: "20%",
      cell: (row) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.client && row.client ? (
                  <h6 className="mb-0 fs-14 fw-semibold">
                    {row.client.full_name}
                  </h6>
                ) : (
                  <h6 className="mb-0 fs-14 fw-semibold">No Client</h6>
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
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      //  width: "16%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row.status],
      sortable: false,
      center: true,
      //  width: "12%",
      center: true,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.status === 0 ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Inactive
              </button>
            ) : (
              <button
                className="badge"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Unknown
              </button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },
    anyPermissionAvailable
      ? {
          name: "Action",
          selector: (row) => [row.action],
          sortable: false,
          // width: "20%",
          center: true,
          cell: (row) => (
            <span className="text-center">
              {anyPermissionAvailable ? (
                <Dropdown className="dropdown btn-group">
                  <Dropdown.Toggle
                    variant="Primary"
                    type="button"
                    className="btn btn-primary dropdown-toggle"
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu">
                    {isEditPermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link to="/editcompany" onClick={() => handleEdit(row)}>
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-pencil me-2" />
                            Edit
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isDeletePermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link to="#" onClick={() => handleDelete(row.id)}>
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-trash me-2 " />
                            Delete
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}

                    {permissionsArray?.includes("company-auto-report-list") ? (
                      <Dropdown.Item
                        className=" p-0 m-0"
                        // className="dropdown-item"
                      >
                        <Link to={`/companyautoreport/${row.id}`}>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-files me-2" />
                            Company Auto Report
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isSagePermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link
                          className="settingicon"
                          to={`/company/sage-fuels/${row.id}`}
                        >
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-gas-pump me-2" />
                            <span>Manage Sage Fuel</span>
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isSagePermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link
                          className="settingicon"
                          to={`/company/sage-items/${row.id}`}
                        >
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-coda-logo me-2" />
                            <span>Manage Sage Items</span>
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isSagePermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link
                          className="settingicon"
                          to={`/company/sage-other-codes/${row.id}`}
                        >
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-code me-2" />
                            <span>Sage Other Code</span>
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isUploadSagePermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link
                          className="settingicon"
                          onClick={() => handleUploadSageSale(row.id)}
                        >
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-upload me-2" />
                            <span>Upload Sage Sales</span>
                          </div>
                        </Link>
                        <UploadSageSales />
                      </Dropdown.Item>
                    ) : null}
                    {isUploadBankReferencePermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link
                          className="settingicon"
                          onClick={() => handleUploadBankReferenceSale(row.id)}
                        >
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-vault me-2" />
                            <span>Upload Bank Reference</span>
                          </div>
                        </Link>
                        <UploadSageSales />
                      </Dropdown.Item>
                    ) : null}
                    {isCompanyUploadBankReimbursementPermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link
                          className="settingicon"
                          onClick={() =>
                            handleUploadBankReimbursementsSale(row.id)
                          }
                        >
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-hand-coins me-2" />
                            <span>Upload Bank Reimbursements</span>
                          </div>
                        </Link>
                        <UploadSageSales />
                      </Dropdown.Item>
                    ) : null}
                  </Dropdown.Menu>
                </Dropdown>
              ) : null}
            </span>
          ),
        }
      : "",
  ];

  const handleUploadSageSale = (rowId) => {
    setShowUploadSageSalesModal(true);
    setUploadModalTitle("Upload Sage Sales");
    setUploadModalURLPath("upload-sale");
    setCompanyId(rowId);
  };
  const handleUploadBankReferenceSale = (rowId) => {
    setShowUploadSageSalesModal(true);
    setUploadModalTitle("Upload Bank Reference");
    setUploadModalURLPath("upload-bank-ref");
    setCompanyId(rowId);
  };
  const handleUploadBankReimbursementsSale = (rowId) => {
    setShowUploadSageSalesModal(true);
    setUploadModalTitle("Upload Bank Reimbursements");
    setUploadModalURLPath("upload-bank-reimbursement");
    setCompanyId(rowId);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <UploadSageSales
          showUploadSageSalesModal={showUploadSageSalesModal}
          setShowUploadSageSalesModal={setShowUploadSageSalesModal}
          companyId={companyId}
          title={UploadModalTitle}
          shortUrl={UploadModalURLPath}
        />

        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">Manage Companies</h1>
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
                Manage Companies
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addcompany"
                  className="btn btn-primary "
                  style={{ borderRadius: "4px" }}
                >
                  Add
                  <i className="ph ph-plus ms-1 ph-plus-icon ph-sm-icon ph-sm-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row className=" row-sm ">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Manage Companies</h3>
                  <div className="mobile-head-container mt-2 mt-sm-0">
                    <SearchBar
                      onSearch={handleSearch}
                      onReset={handleReset}
                      hideReset={searchTerm}
                    />
                  </div>
                </div>
              </Card.Header>

              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table mobile-first-table mobile-first-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                      />
                    </div>
                  </>
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
              {data?.length > 0 && lastPage > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  handlePageChange={handlePageChange}
                />
              )}
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageCompany);
