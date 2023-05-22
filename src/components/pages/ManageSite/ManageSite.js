import React, { Suspense, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Breadcrumb, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import axios from "axios";
import Swal from "sweetalert2";

import { toast } from "react-toastify";
import { Switch } from "@material-ui/core";
import Details from "../../../data/Modal/Details";
import CommonSidebar from "../../../data/Modal/CommonSidebar";

export default function ManageSite() {
  const [data, setData] = useState();
  const [isChecked, setIsChecked] = useState(true);
  const [activeArray, setActiveArray] = useState([]);

  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [dropdownValue, setDropdownValue] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebardata, setSideData] = useState();
  const [SiteId, setSiteId] = useState();
  const [loading, setLoading] = useState(false);

  const [sidebardataobject, setSideDataobject] = useState();

  const Loaderimg = () => {
    return (
      <div id="global-loader">
        <loderdata.Loadersbigsizes1 />
      </div>
    );
  };

  const handleToggleSidebar = async (row) => {
    setSideData(row.site_name);
    setLoading(true); // Set loading state to true

    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const getSiteDetails = async () => {
      try {
        const response = await axiosInstance.get("/site/detail/?id=" + row.id);

        if (response.data && response.data.data) {
        
          setSideDataobject(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
          ErrorAlert("Invalid access token");
          localStorage.clear();
        } else if (
          error.response &&
          error.response.data.status_code === "403"
        ) {
          navigate("/errorpage403");
        } else {
          console.error(error);
        }
      }
    };

    await getSiteDetails();

    setLoading(false); // Set loading state to false
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);

  };
  const handleCloseSidebar = () => {
    setSidebarVisible(true);
  };

  const handleDetailsClick = (row) => {
  
    setSiteId(row.id)
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
            fetchData();
          } catch (error) {
            if (error.response && error.response.status === 401) {
              navigate("/login");
              ErrorAlert("Invalid access token");
              localStorage.clear();
            } else if (
              error.response &&
              error.response.data.status_code === "403"
            ) {
              navigate("/errorpage403");
            } else {
              console.error(error);
              ErrorAlert(error.message);
            }
          }
          // setLoading(false);
        };
        DeleteRole();
      }
    });
  };
  const handleEdit = (id) => {
   
    localStorage.setItem("Edit_Site", id);
  };

  const toggleActive = (id) => {
    const newData = [...data];
    const index = newData.findIndex((d) => d.id === id);
    newData[index].active = !newData[index].active;
    setData(newData);

    if (newData[index].active) {
      setActiveArray((prevActiveArray) => {
        // Check if id is already in array
        if (prevActiveArray.includes(id)) {
          // Remove item from array
          return prevActiveArray.filter((activeId) => activeId !== id);
        } else {
          return [...prevActiveArray, id]; // Push item into array
        }
      });
      formData.append("id", id);
      formData.append("site_status", 1);

      ToggleStatus();
    } else {
      setActiveArray((prevActiveArray) =>
        prevActiveArray.filter((activeId) => activeId !== id)
      );
      formData.append("id", id);
      formData.append("site_status", 0);
      ToggleStatus();
    }
  };

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const fetchData = async () => {
    try {
      const response = await axiosInstance.post("/site/list");

      if (response.data.data.sites.length > 0) {
        setData(response.data.data.sites);
      
        // setDropdownValue(response.data.data);

        const filteredStatuses = [];
        for (const site of response.data.data.sites) {
          if (site.site_status === 1) {
            filteredStatuses.push(site.id);
          }
        }

        if (filteredStatuses.length > 0) {
          setActiveArray(filteredStatuses);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
    }
  };
  const fetchClientList = async () => {
    try {
      const response = await axiosInstance.post("/client-list");

      if (response.data.data.length > 0) {
        // setData(response.data.data.sites);
      

        setDropdownValue(response.data.data);

      
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      }
    }
  };
  const formData = new FormData();

  const ToggleStatus = async () => {
    try {
      const response = await axiosInstance.post(
        "/site/update-status",
        formData
      );
      if (response) {
        SuccessAlert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        ErrorAlert("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.data.status_code === "403") {
        navigate("/errorpage403");
      } else {
        const errorMessage =
          error.response && error.response.message
            ? error.response.message
            : "An error occurred";
        ErrorAlert(errorMessage);
      }
    }
  };
  // const handleDetailsClick = () => {
  // <details/>
  // };
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
      name: "Site",
      selector: (row) => [row.site_name],
      sortable: false,
      width: "60%",
      cell: (row, index) => (
        <div
          className="d-flex"
          style={{ cursor: "pointer" }}
          onClick={() => handleToggleSidebar(row)}
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
      name: "Status",
      selector: (row) => [row.status],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            <button className="btn  btn-sm rounded-11 toggl-btn">
              <Form.Check
                type="switch"
                id={`active-switch-${row.id}`}
                className="toggl-btn"
                checked={activeArray.find((item) => item === row.id)}
                onChange={() => toggleActive(row.id)}
              />
            </button>
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
          <OverlayTrigger placement="top" overlay={<Tooltip>Details</Tooltip>}>
            <span  onClick={() => handleDetailsClick(row)}>
              <Details
                showModal={showModal}
                setShowModal={setShowModal}
                dropdownValue={dropdownValue}
                handleDropdownChange={handleDropdownChange}
                modalHeading="Assign Client"
                sites={dropdownValue}
                SiteId={SiteId}
              />
            </span>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link
              to="/editsite"
              onClick={() => handleEdit(row.id)}
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
  useEffect(() => {
    fetchData();
    fetchClientList()
    console.clear();
  }, []);

  return (
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
        <div className="ms-auto pageheader-btn">
          <Link to="/addsite" className="btn btn-primary">
            Add Site
          </Link>
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
          searchable={true}
        />
      </DataTableExtensions>
    </>
  );
}
