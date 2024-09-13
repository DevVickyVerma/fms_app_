import { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip, Dropdown } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import CommonSidebar from "../../../data/Modal/CommonSidebar";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import GradeIcon from '@mui/icons-material/Grade';
import { Box } from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { handleError } from "../../../Utils/ToastUtils";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";


const ManageSite = (props) => {
  const { apidata, isLoading, getData, postData } = props;

  const [data, setData] = useState();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [sidebardata, setSideData] = useState();
  const [searchdata, setSearchdata] = useState({});
  const [sidebardataobject, setSideDataobject] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');




  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
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

  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
  };

  const handleCloseSidebar = () => {
    setSidebarVisible(true);
  };

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
            const response = await axiosInstance.post("/site/delete", formData);
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            FetchTableData();
          } catch (error) {
            handleError(error);
          } finally {
          }

        };
        DeleteRole();
      }
    });
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id);

    const newStatus = row.site_status === 1 ? 0 : 1;
    formData.append("site_status", newStatus);

    ToggleStatus(formData);
  };

  const ToggleStatus = async (formData) => {
    try {
      const response = await postData("/site/update-status", formData);
      // Console log the response
      if (apidata.api_response === "success") {
        FetchTableData();
      }
    } catch (error) {
      handleError(error);
    }
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


  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
    console.clear();
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("site-edit");
  const isBankManagerPermissionAvailable =
    permissionsArray?.includes("bankmanager-list");
  const isOpeningBalancePermissionAvailable =
    permissionsArray?.includes("opening-list");
  const isBunkeringBalancePermissionAvailable =
    permissionsArray?.includes("bunkering-list");
  const isManagerPermissionAvailable = permissionsArray?.includes(
    "site-assign-manager"
  );
  const issitesettingPermissionAvailable =
    permissionsArray?.includes("site-setting");
  const isAssignbusinessPermissionAvailable =
    permissionsArray?.includes("assign-business-sub-category-list");
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
    isEditPermissionAvailable ||
    isDeletePermissionAvailable ||
    isManagerPermissionAvailable ||
    issitesettingPermissionAvailable;

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "7%",
      center: true,
      cell: (row, index) => (
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
      cell: (row, index) => (
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
      cell: (row, index) => {
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
      cell: (row, index) => {
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
      cell: (row, index) => (
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
                <Dropdown.Menu className="dropdown-menu" style={{ margin: "0px", padding: "0px", position: "absolute", right: "0" }}>
                  {isEditPermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/editsite/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <ModeEditIcon />
                          </i>
                          Edit
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}

                  {isDeletePermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to="#" onClick={() => handleDelete(row.id)}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <DeleteIcon />
                          </i>
                          Delete
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {permissionsArray?.includes("site-card-opening-list") ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/site-card-opening/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <AddBusinessIcon />
                          </i>
                          Card Opening
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {permissionsArray?.includes("site-fuel-grade-list") ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/set-fuel-grades/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <GradeIcon />
                          </i>
                          Set Fuel Grades
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}

                  {issitesettingPermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    >
                      <Link to={`/site-setting/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <SettingsIcon />
                          </i>
                          Settings
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {permissionsArray?.includes("auto-report-list") ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/autodayend/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }} >
                          <i className="setting-icon">
                            <AssignmentTurnedInIcon />
                          </i>
                          Site Auto Report
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isManagerPermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    // className="dropdown-item"
                    >
                      <Link to={`/assignmanger/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }} >
                          <i className="setting-icon">
                            <AssignmentTurnedInIcon />
                          </i>
                          Assign Manager
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isSkipDatePermissionAvailable ? (
                    <Dropdown.Item
                      className=" p-0 m-0"
                    >
                      <Link to={`/skipdates/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <DateRangeIcon />
                          </i>
                          Skip Date
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isBankManagerPermissionAvailable ? (
                    <Dropdown.Item className=" p-0 m-0"
                    //  className="dropdown-item"
                    >
                      <Link to={`/managebank/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <AccountBalanceIcon />
                          </i>
                          Bank Manager
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isOpeningBalancePermissionAvailable ? (
                    <Dropdown.Item className=" p-0 m-0"
                    //  className="dropdown-item"
                    >
                      <Link to={`/opening-balance/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <AccountBalanceWalletIcon />
                          </i>
                          Opening Balance
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isBunkeringBalancePermissionAvailable ? (
                    <Dropdown.Item className=" p-0 m-0"
                    //  className="dropdown-item"
                    >
                      <Link to={`/bunkering-balance/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <AccountBalanceWalletIcon />
                          </i>
                          Bunkering Balance
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isAssignbusinessPermissionAvailable ? (
                    <Dropdown.Item
                      //  className="dropdown-item"
                      className=" p-0 m-0"
                    >
                      <Link to={`/assign-business-sub-categories/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <SettingsIcon />
                          </i>
                          Assign Business Sub Categories
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isDailyDuePermissionAvailable ? (
                    <Dropdown.Item
                      //  className="dropdown-item"
                      className=" p-0 m-0"
                    >
                      <Link to={`/daily-due/${row?.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <SettingsIcon />
                          </i>
                          Daily Dues
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isHidebusinessPermissionAvailable ? (
                    <Dropdown.Item
                      //  className="dropdown-item"
                      className=" p-0 m-0"
                    >
                      <Link to={`/hide-business-categories/${row.id}`}>
                        <div className="manage-site-dropdown-item" style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <SettingsIcon />
                          </i>
                          Hide Business Categories
                        </div>
                      </Link>
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
    console.clear();
  }, [currentPage, searchTerm]);



  const handleSubmit = (formData) => {
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );

    if (Object.values(filteredFormData).length > 0) {
      setSearchdata(filteredFormData);

      const SearchList = async (row) => {
        try {

          let apiUrl = `/site/list?page=${currentPage}`;
          if (searchTerm) {
            apiUrl += `&keyword=${searchTerm}`;
          }


          const response = await getData(apiUrl);

          if (response && response.data && response.data.data) {
            setCurrentPage(response?.data?.data?.currentPage || 1);
            setLastPage(response?.data?.data?.lastPage || 1);
            setData(response.data.data.sites);
          } else {
            throw new Error("No data available in the response");
          }
        } catch (error) {
          console.error("API error:", error);
          // Handle the error here, such as displaying an error message or performing other actions
        }
      };

      SearchList();
    }

    handleToggleSidebar1();
  };




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
                  <i className="ph ph-plus ms-1 ph-plus-icon"></i>
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
        <Row className=" row-sm" >
          <Col lg={12}>
            <Card>
              <Card.Header>

                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Manage Site</h3>
                  <div className="mt-2 mt-sm-0">
                    <SearchBar onSearch={handleSearch} onReset={handleReset} hideReset={searchTerm} />
                  </div>
                </div>
              </Card.Header>
              <Card.Body  >
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive site_deleted_table" style={{ minHeight: "700px !important" }}>
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        center={true}
                        persistTableHead
                        highlightOnHover
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
