import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Breadcrumb, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SideSearchbar from "../../../data/Modal/SideSearchbar";

export default function ManageClient() {
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
        Swal.fire({
          title: "Deleted!",
          text: "Your item has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };
  const handleSearchReset = () => {
    fetchData();
    setSearchdata({});
    setSearchList(true)
  };
  const SuccessAlert = (message) => toast.success(message);
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
      const SearchList = async () => {
        try {
          const response = await axiosInstance.post("/client-list", formData);

          setData(response.data.data);
        } catch (error) {
          console.error(error);
          const message = error.response
            ? error.response.data.message
            : "Unknown error occurred";
          Errornotify(message);
        }
      };
      SearchList();
    }

    // Clear the form input values
    // Resetting the formData to an empty object

    handleToggleSidebar1();
  };

  useEffect(() => {
    fetchData();
  }, []);
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.post("/client-list");
      console.log(response.data.data.clients.length,"lldld")
      if (response.data.data.clients.length > 0) {
        // alert("done")
        setData(response.data.data.clients);
        const filteredStatuses = [];
        for (const client of response.data.data.clients) {
          if (client.status === 1) {
            filteredStatuses.push(client.id);
          }
        }

        if (filteredStatuses.length > 0) {
          setActiveArray(filteredStatuses);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };
  const formData = new FormData();
  const toggleActive = (row) => {
    formData.append("user_id", row.id);

    if (row.status === 1) {
      formData.append("status", 0);
    } else if (row.status === 0) {
      formData.append("status", 1);
    }

    ToggleStatus();
  };
  const ToggleStatus = async () => {
    try {
      const response = await axiosInstance.post("/update-status", formData);
      if (response) {
        SuccessAlert(response.data.message);
        fetchData();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        Errornotify("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else {
        const errorMessage =
          error.response && error.response.message
            ? error.response.message
            : "An error occurred";
        Errornotify(errorMessage);
      }
    }
  };

  const columns = [
    {
      name: "S.NO",
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
      sortable: false,
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
            {row.status === 1 ? (
              <button
                className="badge bg-success"
                onClick={() => toggleActive(row)}
              >
                Active
              </button>
            ) : row.status === 0 ? (
              <button
                className="badge bg-danger"
                onClick={() => toggleActive(row)}
              >
                Inactive
              </button>
            ) : (
              <button className="badge" onClick={() => toggleActive(row)}>
                Unknown
              </button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },
    {
      name: "ACTION",
      selector: (row) => [row.action],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link
              to="/comingsoon"
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
        </span>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);

  const handleAddRole = (newRole) => {
    setRoles([...roles, newRole]);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
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
          <Link to="/addclient" className="btn btn-primary ms-2">
            Add Client
            <AddCircleOutlineIcon />
          </Link>
        </div>
      </div>
      <SideSearchbar
        title="Search"
        visible={sidebarVisible1}
        onClose={handleToggleSidebar1}
        onSubmit={handleSubmit}
        searchListstatus={SearchList}
        
      />

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
          searchable={true}
        />
      </DataTableExtensions>
    </>
  );
}
