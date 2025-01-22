import { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import useToggleStatus from "../../../Utils/useToggleStatus";
import useCustomDelete from "../../../Utils/useCustomDelete";

const FuelAutomation = ({ isLoading, getData, postData }) => {
  const [data, setData] = useState();
  const [permissionsArray, setPermissionsArray] = useState([]);
  const UserPermissions = useSelector((state) => state?.data?.data);
  const [siteName, setSiteName] = useState("");
  const { handleError } = useErrorHandler();

  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);
  useEffect(() => {
    fetchBankManagerList();
  }, []);
  const isAddPermissionAvailable = permissionsArray?.includes(
    "fuel-automation-create"
  );
  const isDeletePermissionAvailable = permissionsArray?.includes(
    "fuel-automation-delete"
  );
  const isEditPermissionAvailable = permissionsArray?.includes(
    "fuel-automation-edit"
  );
  const isstatusPermissionAvailable = permissionsArray?.includes(
    "fuel-automation-edit"
  );
  const { id } = useParams();

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id.toString());
    formData.append("status", (row.status === 1 ? 0 : 1).toString());
    toggleStatus(
      postData,
      "/site/fuel-automation-setting/update-status",
      formData,
      handleSuccess
    );
  };

  const handleSuccess = () => {
    fetchBankManagerList();
  };

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(
      postData,
      "site/fuel-automation-setting/delete",
      formData,
      handleSuccess
    );
  };

  const fetchBankManagerList = async () => {
    try {
      const response = await getData(
        `/site/fuel-automation-setting/list?site_id=${id}`
      );
      if (response && response.data) {
        setData(response?.data?.data?.settings);
        setSiteName(response?.data?.data?.site_name);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  // Tooltip for better UI
  const renderTooltip = (message) => (
    <Tooltip id="button-tooltip">{message}</Tooltip>
  );

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "10%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Time",
      selector: (row) => [row.time],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.time}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => [row.value],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              className={`mb-0 fs-14 fw-semibold ${
                row?.action === 1
                  ? "work-flow-sucess-status"
                  : row?.action === 2
                  ? "work-flow-danger-status"
                  : ""
              }`}
            >
              {row.value}

              {row?.action === 1 ? (
                <>
                  <i className={`ph ph-arrow-up`}></i>
                </>
              ) : row?.action === 2 ? (
                <>
                  <i className={`ph ph-arrow-down`}></i>
                </>
              ) : (
                <></>
              )}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Frequency",
      selector: (row) => [row.frequency],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              {row.frequency === 1 ? "Daily" : row.frequency}
            </h6>
          </div>
        </div>
      ),
    },

    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "15%",
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
      width: "15%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold ">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isstatusPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.status === 0 ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={
                  isstatusPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Inactive
              </button>
            ) : (
              <button
                className="badge"
                onClick={
                  isstatusPermissionAvailable ? () => toggleActive(row) : null
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
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/edit-fuel-automation/${row.id}`}
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <div className="page-header d-flex">
          <div>
            <h1 className="page-title">Fuel Automation ({siteName})</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/sites" }}
              >
                Sites
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Fuel Automation
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to={`/add-fuel-automation/${siteName}/${id}`}
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Fuel Automation
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel Automation </h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                        fixedHeader={true}
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
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default withApi(FuelAutomation);
