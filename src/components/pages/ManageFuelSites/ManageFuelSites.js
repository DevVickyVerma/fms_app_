import { useEffect, useState } from 'react';

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import { handleError } from "../../../Utils/ToastUtils";
import LoaderImg from "../../../Utils/Loader";

const ManageDeductions = (props) => {
  const { apidata, isLoading, getData, postData } = props;
  const [data, setData] = useState();

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
            const response = await axiosInstance.post(
              "/deduction/delete",
              formData
            );
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

        };
        DeleteRole();
      }
    });
  };

  useEffect(() => {
    FetchTableData();
    console.clear();
  }, []);

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id);

    const newStatus = row.deduction_status === 1 ? 0 : 1;
    formData.append("deduction_status", newStatus);

    ToggleStatus(formData);
  };

  const ToggleStatus = async (formData) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await postData("/deduction/update-status", formData);
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
      const response = await getData("/deduction/list");

      if (response && response.data && response.data.data) {
        setData(response.data.data.deductions);
        setSearchvalue(response.data.data.deductions);
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
  }, [UserPermissions]);

  const isEditPermissionAvailable =
    permissionsArray?.includes("deduction-edit");
  const isAddPermissionAvailable =
    permissionsArray?.includes("deduction-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("deduction-delete");

  const columns = [
    {
      name: "Sr. No.",
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
      name: "Deductions Name",
      selector: (row) => [row.deduction_name],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Deductions Code",
      selector: (row) => [row.deduction_code],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.deduction_code}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "20%",
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
      selector: (row) => [row.deduction_status],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.deduction_status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.deduction_status === 0 ? (
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

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editdeductions/${row.id}`} // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 me-2"
              >
                <i className="ph ph-pencil" />
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
                <i className="ph ph-trash" />
              </Link>
            </OverlayTrigger>
          ) : null}
        </span>
      ),
    },
  ];

  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filteredData = searchvalue.filter((item) =>
      item.deduction_name.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  return (
    <>
      {isLoading ? <LoaderImg /> : null}
      <div className="page-header ">
        <div>
          <h1 className="page-title">Manage Deductions</h1>
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
              Manage Deductions
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="ms-auto pageheader-btn">
          <div className="input-group">
            <input
              type="text"
              autoComplete="off"
              className="form-control"
              value={searchText}
              onChange={handleSearch}
              placeholder="Search..."
              style={{ borderRadius: 0 }}
            />
            {isAddPermissionAvailable ? (
              <Link
                to="/addDeductions"
                className="btn btn-primary ms-2"
                style={{ borderRadius: "4px" }}
              >
                Add Deductions
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        noHeader
        defaultSortField="id"
        defaultSortAsc={false}
        striped={true}
        persistTableHead
        highlightOnHover
      />
    </>
  );
};
export default withApi(ManageDeductions);
