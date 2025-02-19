import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import useCustomDelete from "../../../Utils/useCustomDelete";

const ManageRoles = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const [siteName, setSiteName] = useState("");
  const { customDelete } = useCustomDelete();
  const { id } = useParams();
  const handleSuccess = () => {
    FetchmannegerList();
  };

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "site/manager/delete", formData, handleSuccess);
  };

  const FetchmannegerList = async () => {
    try {
      const response = await getData(`/site/manager/${id}`);

      if (response && response.data) {
        setData(response?.data?.data?.managers);
        setSiteName(response?.data?.data?.site_name);
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
    FetchmannegerList();
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);
  const isEditPermissionAvailable = permissionsArray?.includes(
    "site-assign-manager"
  );
  const isAddPermissionAvailable = permissionsArray?.includes(
    "site-assign-manager"
  );
  const isDeletePermissionAvailable = permissionsArray?.includes(
    "site-assign-manager"
  );

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      //  width: "10%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Manager Name",
      selector: (row) => [row.manager_name],
      sortable: false,
      //  width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.manager_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Reports",
      selector: (row) => [row.reports],
      sortable: false,
      //  width: "25%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.reports}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      selector: (row) => [row.role],
      sortable: false,
      //  width: "25%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.role}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      center: true,
      //  width: "20%",
      cell: (row) => (
        <span className="d-flex gap-2">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editmanager/${row.id}`}
                className="btn btn-primary btn-sm rounded-11 mobile-btn p-2 me-2"
              >
                <i className="ph ph-pencil" />
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11 mobile-btn p-2"
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Assign Manager ({siteName})</h1>
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
                Assign Manager
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to={`/addmanager/${siteName}/${id}`}
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Assign Manager
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
                <h3 className="card-title">Assign Manager </h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table mobile-first-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader={true}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
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
      </>
    </>
  );
};
export default withApi(ManageRoles);
