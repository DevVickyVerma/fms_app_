import React, { Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import axios from "axios";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import SiteDetails from "../../../data/Modal/SiteDetails";
import CommonSidebar from "../../../data/Modal/CommonSidebar";
import SideSearchbar from "../../../data/Modal/SideSearchbar";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";

const ManageSite = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;

  const [data, setData] = useState();

  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [sidebardata, setSideData] = useState();
  const [SiteId, setSiteId] = useState();
  const [searchdata, setSearchdata] = useState({});

  const [SearchList, setSearchList] = useState(false);

  const [sidebardataobject, setSideDataobject] = useState();
  const notify = (message) => toast.success(message);
  const Errornotify = (message) => toast.error(message);
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      Errornotify("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      Errornotify(errorMessage);
    }
  }

  // const Loaderimg = () => {
  //   return (
  //     <div id="global-loader">
  //       <loderdata.Loadersbigsizes1 />
  //     </div>
  //   );
  // };

  const handleToggleSidebar = async (row) => {
    await getSiteDetails(row);
    setSideData(row.site_name);
    setSidebarVisible(!sidebarVisible);
  };

  const getSiteDetails = async (row) => {
    try {
      const response = await getData("/site/detail/?id=" + row.id);
      console.log(response.data.data, "ddd");

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

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };
  const handleCloseSidebar = () => {
    setSidebarVisible(true);
  };

  const handleDetailsClick = (row) => {
    localStorage.setItem("AssignSiteId", row.id);
    setShowModal(true);
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
            setData(response.data.data);
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
          // setIsLoading(false);
        };
        DeleteRole();
      }
    });
  };
  const handleEdit = (id) => {
    localStorage.setItem("Edit_Site", id);
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
      console.log(response, "response"); // Console log the response
      if (apidata.api_response === "success") {
        FetchTableData();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const FetchTableData = async () => {
    try {
      const response = await getData("/site/list");
      console.log(response.data.data, "ddd");

      if (response && response.data && response.data.data.sites) {
        setData(response.data.data.sites);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const permissionsToCheck = [
    "site-list",
    "site-create",
    "site-status-update",
    "site-edit",
    "site-delete",
  ];
  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("site-edit");
  const isAddPermissionAvailable = permissionsArray?.includes("site-create");
  const isDeletePermissionAvailable = permissionsArray?.includes("site-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("site-detail");
  const isAssignPermissionAvailable = permissionsArray?.includes("site-assign");

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "10%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "15%",
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
      width: "20%",
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
      width: "15%",
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
      width: "15%",
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
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.site_status === 1 ? (
              <button
                className="badge bg-success"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.site_status === 0 ? (
              <button
                className="badge bg-danger"
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

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Settings</Tooltip>}
            >
              <Link
                to={`/site-setting/${row.id}`}
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
                    <path d="M20.71 12.04l-1.85-.14c-.26-.84-.71-1.62-1.34-2.26l1.12-1.69c.28-.42.21-1-.18-1.36l-1.57-1.57c-.36-.36-.94-.45-1.36-.18l-1.69 1.12c-.63-.63-1.42-1.08-2.26-1.34l-.14-1.85C12.07 2.09 11.52 2 11 2s-1.07.09-1.57.29l-.14 1.85c-.84.26-1.62.71-2.26 1.34L5.12 4.82c-.42-.28-1-.21-1.36.18L2.19 6.57c-.36.36-.45.94-.18 1.36l1.12 1.69c-.63.63-1.08 1.42-1.34 2.26l-1.85.14C.09 11.93 0 12.48 0 13s.09 1.07.29 1.57l1.85.14c.26.84.71 1.62 1.34 2.26l-1.12 1.69c-.28.42-.21 1 .18 1.36l1.57 1.57c.36.36.94.45 1.36.18l1.69-1.12c.63.63 1.42 1.08 2.26 1.34l.14 1.85C10.93 21.91 11.48 22 12 22s1.07-.09 1.57-.29l.14-1.85c.84-.26 1.62-.71 2.26-1.34l1.69 1.12c.42.28 1 .21 1.36-.18l1.57-1.57c.36-.36.45-.94.18-1.36l-1.12-1.69c.63-.63 1.08-1.42 1.34-2.26l1.85-.14c.2-.5.29-1.05.29-1.57s-.09-1.07-.29-1.57zm-9.71 3.96c-1.55 0-2.96-.63-3.96-1.65-.98-1.02-1.55-2.4-1.55-3.86s.57-2.84 1.55-3.86C7.25 4.63 8.66 4 10.21 4c1.55 0 2.96.63 3.96 1.65.98 1.02 1.55 2.4 1.55 3.86s-.57 2.84-1.55 3.86c-1 .99-2.41 1.65-3.96 1.65z" />
                  </svg>
                </i>
              </Link>
            </OverlayTrigger>
          ) : null}
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editsite/${row.id}`}
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

  useEffect(() => {
    FetchTableData();

    // console.clear();
  }, []);

  const handleSearchReset = () => {
    FetchTableData();
    setSearchdata({});
    setSearchList(true);
  };

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
          const params = new URLSearchParams(formData).toString();
          const response = await getData(`/client-list?${params}`);
          console.log(response.data.data, "ddd");

          if (response && response.data && response.data.data) {
            setData(response.data.data.clients);
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

    // Clear the form input values
    // Resetting the formData to an empty object

    handleToggleSidebar1();
  };

  return (
    <>
      {isLoading ? (
        <Loaderimg />
      ) : (
        <>
          <div className="page-header ">
            <div>
              <h1 className="page-title">Manage Site</h1>

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
                  Manage Site
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="ms-auto pageheader-btn ">
              <span className="Search-data">
                {Object.entries(searchdata).map(([key, value]) => (
                  <div key={key} className="badge">
                    <span className="badge-key">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>
                    <span className="badge-value">{value}</span>
                  </div>
                ))}
              </span>

              <Link
                className="btn btn-primary"
                onClick={() => {
                  handleToggleSidebar1();
                }}
              >
                Search
                <span className="ms-2">
                  <SearchIcon />
                </span>
              </Link>
              {Object.keys(searchdata).length > 0 ? (
                <Link
                  className="btn btn-danger ms-2"
                  onClick={handleSearchReset}
                >
                  Reset <RestartAltIcon />
                </Link>
              ) : (
                ""
              )}

              {isAddPermissionAvailable ? (
                <Link to="/addsite" className="btn btn-primary ms-2">
                  Add Site <AddCircleOutlineIcon />
                </Link>
              ) : null}
            </div>
          </div>
          <SideSearchbar
            title="Search"
            visible={sidebarVisible1}
            onClose={handleToggleSidebar1}
            onSubmit={handleSubmit}
            searchListstatus={SearchList}
          />

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
                  <h3 className="card-title">Manage Site</h3>
                </Card.Header>
                <Card.Body>
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
                        // pagination
                        highlightOnHover
                        searchable={false}
                      />
                    </DataTableExtensions>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default withApi(ManageSite);
