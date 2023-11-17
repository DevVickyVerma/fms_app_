import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import {
  Breadcrumb,
  Card,
  Col,
  Dropdown,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Button } from "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { FormModal } from "../../../data/Modal/Modal";
import { toast } from "react-toastify";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import UploadSageSales from "./UploadSageSales";

const ManageCompany = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [showUploadSageSalesModal, setShowUploadSageSalesModal] = useState(false);
  const [companyId, setCompanyId] = useState("")
  const [data, setData] = useState();
  const navigate = useNavigate();
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
              "/company/delete",
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
          // setIsLoading(false);
        };
        DeleteRole();
      }
    });
  };
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
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id);

    const newStatus = row.status === 1 ? 0 : 1;
    formData.append("status", newStatus);

    ToggleStatus(formData);
  };

  const ToggleStatus = async (formData) => {
    try {
      const response = await postData("/company/update-status", formData);
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
    console.clear();
  }, []);

  const FetchTableData = async () => {
    try {
      const response = await getData("/company/list");

      if (response && response.data && response.data.data.companies) {
        setData(response.data.data.companies);
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

  const permissionsToCheck = [
    "company-list",
    "company-create",
    "company-edit",
    "company-details",
  ];
  let isPermissionAvailable = false;
  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);

  const isStatusPermissionAvailable = permissionsArray?.includes(
    "company-status-update"
  );
  const isEditPermissionAvailable = permissionsArray?.includes("company-edit");
  const isAddPermissionAvailable = permissionsArray?.includes("company-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("company-delete");
  const isSagePermissionAvailable =
    permissionsArray?.includes("company-sage-config");

  const isUploadSagePermissionAvailable =
    permissionsArray?.includes("upload-sale");
  const anyPermissionAvailable =
    isEditPermissionAvailable ||

    isDeletePermissionAvailable ||
    isSagePermissionAvailable;

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "7%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Company",
      selector: (row) => [row.company_name],
      sortable: false,
      width: "25%",
      cell: (row, index) => (
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
      width: "20%",
      cell: (row, index) => {
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
      width: "16%",
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
        sortable: true,
        width: "20%",
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
                      <Link
                        to="/editcompany"
                        onClick={() => handleEdit(row)}
                      >
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <ModeEditIcon />
                          </i>
                          Edit
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isDeletePermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link to="#" onClick={() => handleDelete(row.id)}>
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            <DeleteIcon />
                          </i>
                          Delete
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isSagePermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link
                        className="settingicon"
                        // onClick={() => handleSage(row.id)}
                        to={`/company/sage-fuels/${row.id}`}
                      >
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            {""} <AssignmentIndIcon />
                          </i>
                          <span>Manage Sage Fuel</span>
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isSagePermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link
                        className="settingicon"
                        // onClick={() => handleSage(row.id)}
                        to={`/company/sage-items/${row.id}`}
                      >
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            {""} <AssignmentIndIcon />
                          </i>
                          <span>Manage Sage Items</span>
                        </div>
                      </Link>
                    </Dropdown.Item>
                  ) : null}
                  {isSagePermissionAvailable ? (
                    <Dropdown.Item className="dropdown-item">
                      <Link
                        className="settingicon"
                        // onClick={() => handleSage(row.id)}
                        to={`/company/sage-other-codes/${row.id}`}
                      >
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            {""} <AssignmentIndIcon />
                          </i>
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
                      // to={`/company/sage-other-codes/${row.id}`}
                      >
                        <div style={{ width: "100%" }}>
                          <i className="setting-icon">
                            {""} <AssignmentIndIcon />
                          </i>
                          <span>Upload Sage Sales</span>
                        </div>
                      </Link>
                      <UploadSageSales />
                    </Dropdown.Item>
                  ) : null}
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </span >
        ),
      }
      : "",
  ];

  const handleUploadSageSale = (rowId) => {
    setShowUploadSageSalesModal(true);
    setCompanyId(rowId)
  };


  const tableDatas = {
    columns,
    data,
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <UploadSageSales
          showUploadSageSalesModal={showUploadSageSalesModal}
          setShowUploadSageSalesModal={setShowUploadSageSalesModal}
          companyId={companyId}
        />

        <div className="page-header d-flex">
          <div>
            <h1 className="page-title ">Manage Companies</h1>

            <Breadcrumb className="breadcrumb breadcrumb-subheader">
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
          <div className="ms-auto ">
            {isAddPermissionAvailable ? (
              <Link to="/addcompany" className="btn btn-primary ms-2">
                <Box component="span" display={["none", "unset"]} m="{1}">
                  Add
                </Box> Company <AddCircleOutlineIcon />
              </Link>
            ) : null}
          </div>
        </div>
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Manage Companies</h3>
              </Card.Header>

              <Card.Body>
                {data?.length > 0 ? (
                  <>
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
                          paginationPerPage={20}
                          highlightOnHover
                          searchable={true}
                        />
                      </DataTableExtensions>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageCompany);
