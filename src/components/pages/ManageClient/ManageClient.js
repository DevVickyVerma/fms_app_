import React, { useEffect, useState } from "react";
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
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SideSearchbar from "../../../data/Modal/SideSearchbar";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
// import KeyIcon from '@mui/icons-material/Key';
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const ManageClient = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [searchdata, setSearchdata] = useState({});
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [activeArray, setActiveArray] = useState([]);
  const [SearchList, setSearchList] = useState(false);

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
        const formData = new FormData();
        formData.append("id", id);
        DeleteClient(formData);
      }
    });
  };
  const DeleteClient = async (formData) => {
    try {
      const response = await postData("client/delete", formData);
      console.log(response, "response"); // Console log the response
      if (apidata.api_response === "success") {
        handleFetchData();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearchReset = () => {
    handleFetchData();
    setSearchdata({});
    setSearchList(true);
  };
  const SuccessAlert = (message) => toast.success(message);

  const Errornotify = (message) => toast.error(message);
  const token = localStorage.getItem("token");
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
  const handleToggleSidebar1 = () => {
    setSidebarVisible1(!sidebarVisible1);
  };
  const handleSubmit = (formData) => {
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );

    if (Object.values(filteredFormData).length > 0) {
      setSearchdata(filteredFormData);
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const SearchList = async (row) => {
        try {
          const params = new URLSearchParams(formData).toString();
          const response = await getData(`/client/list?${params}`);
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

    handleToggleSidebar1();
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    try {
      const response = await getData("/client/list");

      if (response && response.data && response.data.data) {
        setData(response.data.data.clients);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
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
      const response = await postData("/client/update-status", formData);
      console.log(response, "response"); // Console log the response
      if (apidata.api_response === "success") {
        handleFetchData();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleEdit = (row) => {
    localStorage.setItem("Client_id", row.id);
  };

  const permissionsToCheck = [
    "client-list",
    "client-create",
    "client-status-update",
    "client-edit",
    "client-delete",
  ];

  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "client-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("client-edit");
  const isLoginPermissionAvailable = permissionsArray?.includes("client-account-access");
  const isAddPermissionAvailable = permissionsArray?.includes("client-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("client-delete");
  const isDetailsPermissionAvailable =
    permissionsArray?.includes("client-details");
  const isAssignPermissionAvailable =
    permissionsArray?.includes("client-assign");

  // const handleClientLogin=(row)=>{
  //   console.log(row.id,"client id")
  // }

  const handleClientLogin = async (row) => {
    try {
      const response = await getData(`/account-login/${row.id}`);

      if (response) {
        localStorage.setItem("token", response.data.data.access_token);
        navigate("/dashboard");
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
        localStorage.setItem("tokenupdate", true);
        console.log(response.data.data.access_token,"response");
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
      width: "10%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Client",
      selector: (row) => [row.full_name],
      sortable: true,
      width: "45%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.full_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: true,
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
      sortable: true,
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === 1 ? (
              <button
                className="badge bg-success"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.status === 0 ? (
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
      sortable: true,
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editclient/${row.id}`}
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
          {isLoginPermissionAvailable ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Client Login</Tooltip>}
            >
              <Link
                to="#"
                className="btn btn-yellow btn-sm rounded-11 ms-2"
                onClick={() => handleClientLogin(row)}
              >
                <VpnKeyIcon />
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

  // const Loaderimg = () => {
  //   return (
  //     <div id="global-loader">
  //       <loderdata.Loadersbigsizes1 />
  //     </div>
  //   );
  // };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Client</h1>
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
                Manage Client
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
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
              <Link className="btn btn-danger ms-2" onClick={handleSearchReset}>
                Reset <RestartAltIcon />
              </Link>
            ) : (
              ""
            )}
            {isAddPermissionAvailable ? (
              <Link to="/addclient" className="btn btn-primary ms-2">
                Add Client
                <AddCircleOutlineIcon />
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

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Manage Client</h3>
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
                      pagination
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
    </>
  );
};

export default withApi(ManageClient);
