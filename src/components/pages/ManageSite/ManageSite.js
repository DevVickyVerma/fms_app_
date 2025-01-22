import { Suspense, useEffect, useState } from "react";
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
import CommonSidebar from "../../../data/Modal/CommonSidebar";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";
import useCustomDelete from "../../../Utils/useCustomDelete";
import useToggleStatus from "../../../Utils/useToggleStatus";

const ManageSite = (props) => {
  const { isLoading, getData, postData } = props;

  const [data, setData] = useState();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebardata, setSideData] = useState();
  const [sidebardataobject, setSideDataobject] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();
  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "site/delete", formData, handleSuccess);
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id.toString());
    formData.append("site_status", (row.site_status === 1 ? 0 : 1).toString());
    toggleStatus(postData, "/site/update-status", formData, handleSuccess);
  };

  const handleSuccess = () => {
    FetchTableData();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  const handleToggleSidebar = async (row) => {
    await getSiteDetails(row);
    setSideData(row.site_name);
    setSidebarVisible(!sidebarVisible);
  };

  const getSiteDetails = async (row) => {
    try {
      const response = await getData("/site/detail/?id=" + row.id);

      if (response.data && response.data.data) {
        setSideDataobject(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
      // Handle the error here, such as displaying an error message or performing other actions
    }
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(true);
  };

  const FetchTableData = async () => {
    try {
      let apiUrl = `/site/list?page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }
      const response = await getData(apiUrl);

      if (response && response.data && response.data.data.sites) {
        setData(response.data.data.sites);

        setCurrentPage(response?.data?.data?.currentPage || 1);
        setLastPage(response?.data?.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const navigate = useNavigate();
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("site-edit");
  const isBankManagerPermissionAvailable =
    permissionsArray?.includes("bankmanager-list");
  const isFuelAutomationPermissionAvailable = permissionsArray?.includes(
    "fuel-automation-list"
  );
  const isOpeningBalancePermissionAvailable =
    permissionsArray?.includes("opening-list");
  const isBunkeringBalancePermissionAvailable =
    permissionsArray?.includes("bunkering-list");
  const isManagerPermissionAvailable = permissionsArray?.includes(
    "site-assign-manager"
  );
  const issitesettingPermissionAvailable =
    permissionsArray?.includes("site-setting");
  const isAssignbusinessPermissionAvailable = permissionsArray?.includes(
    "assign-business-sub-category-list"
  );
  const isAddPermissionAvailable = permissionsArray?.includes("site-create");
  const isDeletePermissionAvailable = permissionsArray?.includes("site-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("site-detail");
  const isSkipDatePermissionAvailable =
    permissionsArray?.includes("skipdate-list");
  const isHidebusinessPermissionAvailable =
    permissionsArray?.includes("hide-category-list");
  const isDailyDuePermissionAvailable =
    permissionsArray?.includes("dailydue-list");

  const anyPermissionAvailable =
    permissionsArray?.includes("site-edit") ||
    permissionsArray?.includes("site-delete") ||
    permissionsArray?.includes("site-assign-manager") ||
    permissionsArray?.includes("site-setting") ||
    permissionsArray?.includes("bankmanager-list") ||
    permissionsArray?.includes("opening-list") ||
    permissionsArray?.includes("bunkering-list") ||
    permissionsArray?.includes("assign-business-sub-category-list") ||
    permissionsArray?.includes("site-create") ||
    permissionsArray?.includes("site-detail") ||
    permissionsArray?.includes("skipdate-list") ||
    permissionsArray?.includes("hide-category-list") ||
    permissionsArray?.includes("dailydue-list");

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "7%",
      center: false,
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {row?.sr_no}
        </span>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "18%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "pointer" }}
          onClick={
            isDetailsPermissionAvailable ? () => handleToggleSidebar(row) : null
          }
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold Tablename" variant="primary">
              {row.site_name}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: " Client",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "15%",
      cell: (row) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.site_owner && row.site_owner ? (
                  <h6 className="mb-0 fs-14 fw-semibold">
                    {row.site_owner.client_name}
                  </h6>
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
      name: "Company",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "19%",
      cell: (row) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.site_owner && row.site_owner ? (
                  <h6 className="mb-0 fs-14 fw-semibold">
                    {row.site_owner.company_name}
                  </h6>
                ) : (
                  <h6 className="mb-0 fs-14 fw-semibold">----</h6>
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
      width: "12%",
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
            {row.site_status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.site_status === 0 ? (
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
          width: "17%",
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
                  <Dropdown.Menu
                    className="dropdown-menu"
                    style={{
                      margin: "0px",
                      padding: "0px",
                      position: "absolute",
                      right: "0",
                    }}
                  >
                    {isEditPermissionAvailable ? (
                      <Dropdown.Item
                        className=" p-0 m-0"
                        onClick={() => navigate(`/editsite/${row.id}`)}
                      >
                        <div>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-pencil me-2" />
                            Edit
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}

                    {isDeletePermissionAvailable ? (
                      <Dropdown.Item
                        className=" p-0 m-0"
                        // className="dropdown-item"
                      >
                        <div to="#" onClick={() => handleDelete(row.id)}>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-trash me-2" />
                            Delete
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {permissionsArray?.includes("budget-list") ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div onClick={() => navigate(`/site-budget/${row.id}`)}>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-money me-2 c-top-3" />
                            Budget
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {permissionsArray?.includes("site-card-opening-list") ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() =>
                            navigate(`/site-card-opening/${row.id}`)
                          }
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-folder-open me-2" />
                            Card Opening
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {permissionsArray?.includes("site-card-adjustment-list") ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() =>
                            navigate(`/site-card-adjustment/${row.id}`)
                          }
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-folder-open me-2" />
                            Card Adjustment
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {permissionsArray?.includes("site-fuel-grade-list") ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() => navigate(`/set-fuel-grades/${row.id}`)}
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-gas-pump me-2" />
                            Set Fuel Grades
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}

                    {issitesettingPermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() => navigate(`/site-setting/${row.id}`)}
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-gear me-2" />
                            Settings
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {permissionsArray?.includes("auto-report-list") ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div onClick={() => navigate(`/autodayend/${row.id}`)}>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-files me-2" />
                            Site Auto Report
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isManagerPermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() => navigate(`/assignmanger/${row.id}`)}
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-user-plus me-2" />
                            Assign Manager
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isSkipDatePermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div onClick={() => navigate(`/skipdates/${row.id}`)}>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-calendar-check me-2" />
                            Skip Date
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isFuelAutomationPermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() =>
                            navigate(`/manage-fuel-automation/${row.id}`)
                          }
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-person me-2" />
                            Fuel Automation
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isBankManagerPermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div onClick={() => navigate(`/managebank/${row.id}`)}>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-person me-2" />
                            Bank Manager
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isOpeningBalancePermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() => navigate(`/opening-balance/${row.id}`)}
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-wallet me-2" />
                            Opening Balance
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isBunkeringBalancePermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() =>
                            navigate(`/bunkering-balance/${row.id}`)
                          }
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-wallet me-2" />
                            Bunkering Balance
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isAssignbusinessPermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() =>
                            navigate(
                              `/assign-business-sub-categories/${row.id}`
                            )
                          }
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-hourglass-high me-2" />
                            Assign Business Sub Categories
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isDailyDuePermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div onClick={() => navigate(`/daily-due/${row.id}`)}>
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-computer-tower me-2" />
                            Daily Dues
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                    {isHidebusinessPermissionAvailable ? (
                      <Dropdown.Item className=" p-0 m-0">
                        <div
                          onClick={() =>
                            navigate(`/hide-business-categories/${row.id}`)
                          }
                        >
                          <div
                            className="manage-site-dropdown-item"
                            style={{ width: "100%" }}
                          >
                            <i className="ph ph-eye-closed me-2" />
                            Hide Business Categories
                          </div>
                        </div>
                      </Dropdown.Item>
                    ) : null}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                ""
              )}
            </span>
          ),
        }
      : "",
  ];

  useEffect(() => {
    FetchTableData();
  }, [currentPage, searchTerm]);

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">Manage Sites</h1>
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
                Manage Sites
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addsite"
                  className="btn btn-primary "
                  style={{ borderRadius: "4px" }}
                >
                  Add Site
                  <i className="ph ph-plus ms-1 ph-plus-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Suspense fallback={<img src={Loaderimg} alt="Loading" />}>
          <CommonSidebar
            title={sidebardata}
            sidebarContent={sidebardataobject}
            visible={sidebarVisible}
            onClose={handleCloseSidebar}
          />
        </Suspense>
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Manage Sites</h3>
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
                    <div
                      className="table-responsive site_deleted_table"
                      style={{ minHeight: "700px !important" }}
                    >
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        center={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                        searchable={false}
                        subHeader={false}
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
              <Card.Footer>
                {data?.length > 0 && lastPage > 1 && (
                  <CustomPagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    handlePageChange={handlePageChange}
                  />
                )}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default withApi(ManageSite);
