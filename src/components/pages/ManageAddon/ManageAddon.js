import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FormModal } from "../../../data/Modal/Modal";
import { toast } from "react-toastify";

export default function ManageAddon() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      console.error(error.message,"error");
      ErrorAlert(error.message)
    }
  }
const handleEdit = (row)=>{
  console.log(row,"handleEdit")
 
 
  localStorage.setItem("EditAddon", row.id);
  localStorage.setItem("EditAddon_name", row.name);

}


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
      console.log(id, "isConfirmed");
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("addon_id", id);

      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const DeleteRole = async () => {
        try {
          const response = await axiosInstance.post("/addon/delete", formData);
          setData(response.data.data);
          Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchData()
        }  catch (error) {
          handleError(error)
        }
        // setLoading(false);
      };
      DeleteRole();
      
    }
  });
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
        const response = await axiosInstance.post("/addon/list");
    
        if (response.data.data.addons.length > 0) {
          setData(response.data.data.addons);
        }
      } catch (error) {
        handleError(error)
        // console.error(error);
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
      name: "Addon",
      selector: (row) => [row.name],
      sortable: false,
      width: "70%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
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
              to="/editaddon"
              className="btn btn-primary btn-sm rounded-11 me-2"
              onClick={() => handleEdit(row)}
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

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Manage Addon</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" linkAs={Link} linkProps={{ to: '/dashboard' }}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Manage Addon
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <Link to="/addaddon" className="btn btn-primary">
            Add Addon
          </Link>
        </div>
      </div>

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
