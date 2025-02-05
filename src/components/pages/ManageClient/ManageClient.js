import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";
import useCustomDelete from "../../../Utils/useCustomDelete";
import useToggleStatus from "../../../Utils/useToggleStatus";

const ManageClient = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "client/delete", formData, handleSuccess);
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id.toString());
    formData.append("status", (row.status === 1 ? 0 : 1).toString());
    toggleStatus(postData, "/client/update-status", formData, handleSuccess);
  };

  const handleSuccess = () => {
    handleFetchData();
  };

  useEffect(() => {
    handleFetchData();
  }, [currentPage, searchTerm]);

  const handleFetchData = async () => {
    try {
      let apiUrl = `/client/list?page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }

      const response = await getData(apiUrl);

      if (response && response.data && response.data.data) {
        setData(response.data.data?.clients);
        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const UserPermissions = useSelector((state) => state?.data?.data);

  const isEditPermissionAvailable =
    UserPermissions?.permissions?.includes("client-edit");
  const isLoginPermissionAvailable = UserPermissions?.permissions?.includes(
    "client-account-access"
  );
  const isAddonPermissionAvailable =
    UserPermissions?.permissions?.includes("addons-assign");
  const isAddPermissionAvailable =
    UserPermissions?.permissions?.includes("client-create");
  const isDeletePermissionAvailable =
    UserPermissions?.permissions?.includes("client-delete");
  const isReportsPermissionAvailable =
    UserPermissions?.permissions?.includes("report-assign");

  const anyPermissionAvailable =
    isEditPermissionAvailable ||
    isLoginPermissionAvailable ||
    isAddPermissionAvailable ||
    isAddonPermissionAvailable ||
    isDeletePermissionAvailable ||
    isReportsPermissionAvailable;

  let storedKeyName = "localFilterModalData";
  const handleClientLogin = async (row) => {
    try {
      const response = await getData(`/account-login/${row.id}`);

      if (response) {
        localStorage.removeItem(storedKeyName);
        localStorage.setItem("superiorId", response?.data?.data?.superiorId);
        localStorage.setItem("role", response?.data?.data?.role);
        localStorage.setItem("token", response.data.data.access_token);
        const firstName = response.data.data.first_name ?? "";
        const lastName = response.data.data.last_name ?? "";
        const phoneNumber = response.data.data.phone_number ?? "";
        const full_name = response.data.data.client_name ?? "";
        const superiorRole = response.data.data.superiorRole ?? "";
        localStorage.setItem("First_name", firstName);
        localStorage.setItem("full_name", full_name);
        localStorage.setItem("Last_name", lastName);
        localStorage.setItem("Phone_Number", phoneNumber);
        localStorage.setItem("superiorRole", superiorRole);
        setTimeout(() => {
          localStorage.setItem("tokenupdate", "true");
          localStorage.setItem("Client_login", "true");
        }, 1000); // 2000 milliseconds (2 seconds)
        navigate(UserPermissions?.route);
        window.location.reload();
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "7%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Client",
      selector: (row) => [row.full_name],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.full_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Sms Balance",
      selector: (row) => [row.sms_balance],
      sortable: false,
      width: "12%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.sms_balance}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Addons",
      selector: (row) => [row.addons],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.addons}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "14%",
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
      width: "12%",
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
          width: "15%",
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
                        <Link to={`/editclient/${row.id}`}>
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
                            <i className="ph ph-trash me-2" />
                            Delete
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isLoginPermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link to="#" onClick={() => handleClientLogin(row)}>
                          <div style={{ width: "100%" }}>
                            {/* <i className="setting-icon">
                            <VpnKeyIcon />
                          </i> */}
                            <i className="ph ph-sign-in me-2" />
                            Client Login
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isAddonPermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link to={`/assignclientaddon/${row.id}`}>
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-user-circle-plus me-2" />
                            Assign Addon
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {UserPermissions?.permissions?.includes("payroll-setup") ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link to={`/setup-payroll/${row.id}`}>
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-sliders me-2" />
                            Setup Payroll
                          </div>
                        </Link>
                      </Dropdown.Item>
                    ) : null}
                    {isReportsPermissionAvailable ? (
                      <Dropdown.Item className="dropdown-item">
                        <Link
                          className="settingicon"
                          to={`/assignreport/${row.id}`}
                        >
                          <div style={{ width: "100%" }}>
                            <i className="ph ph-files me-2" />
                            <span>Report Assign</span>
                          </div>
                        </Link>
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

  const dynamicClass = "dynamicClass"; /* your dynamic class */
  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">Manage Clients</h1>
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
                Manage Clients
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addclient"
                  className="btn btn-primary "
                  style={{ borderRadius: "4px" }}
                >
                  Add Client
                  <i className="ph ph-plus ms-1 ph-plus-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Manage Clients</h3>
                  <div className="mt-2 mt-sm-0">
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
                    <div className=" deleted-table site_deleted_table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        // pagination
                        highlightOnHover={true}
                        searchable={false}
                        className={dynamicClass}
                        // className="custom-datatable" // Add your custom class here
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

export default withApi(ManageClient);
