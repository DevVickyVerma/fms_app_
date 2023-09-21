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
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import { toast } from "react-toastify";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import * as loderdata from "../../../data/Component/loderdata/loderdata";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";

const ManageUser = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const navigate = useNavigate();

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

  useEffect(() => {
    handleFetchData();
    console.clear();
  }, []);
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your 2FA will get disable",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Disable it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Disable2FA(id);
      }
    });
  };

  //   const Disable2FA = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axiosInstance.get(`disable/two-factor`);
  //       if (response) {
  //         GetDetails();
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       handleError(error);
  //       setLoading(false);
  //     }
  //   };
  const Disable2FA = async (id) => {
    try {
      const response = await getData(`/user/disable/two-factor?user_id=${id}`);

      if (response && response.data && response.data.data) {
        handleFetchData();
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleFetchData = async () => {
    try {
      const response = await getData("/user/2fa-list");

      if (response && response.data && response.data.data) {
        setData(response?.data?.data);
        console.log(response?.data?.data, "Authentication");
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
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

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
      name: "Full Name",
      selector: (row) => [row.full_name],
      sortable: true,
      width: "30%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.full_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) => [row.role],
      sortable: true,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.role}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Email",
      selector: (row) => [row.email],
      sortable: true,
      width: "20%",
      cell: (row, index) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.email}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: true,
      width: "15%",
      cell: (row) => (
        <span className="text-center">
          <button
            type="btn"
            className="btn btn-danger mx-4"
            onClick={() => handleDelete(row.id)}
          >
            Disable
          </button>
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
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage 2FA Authentication</h1>
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
                Manage Authentication
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Manage Authentication</h3>
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
                          persistTableHead
                          pagination
                          paginationPerPage={20}
                          highlightOnHover
                          searchable={true}
                          responsive={true}
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

export default withApi(ManageUser);
