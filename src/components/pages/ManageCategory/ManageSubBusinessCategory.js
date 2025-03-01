import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import useCustomDelete from "../../../Utils/useCustomDelete";
import useToggleStatus from "../../../Utils/useToggleStatus";
import SearchBar from "../../../Utils/SearchBar";

const ManageSubBusinessCategory = (props) => {
  const { isLoading, getData, postData } = props;
  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(
      postData,
      "business/subcategory/delete",
      formData,
      handleSuccess
    );
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id);

    formData.append("status", (row.status == 1 ? 0 : 1).toString());
    toggleStatus(
      postData,
      "/business/subcategory/update-status",
      formData,
      handleSuccess
    );
  };

  const handleSuccess = () => {
    FetchTableData();
  };
  const FetchTableData = async () => {
    try {
      let apiUrl = `/business/subcategory`;
      if (searchTerm) {
        apiUrl += `?keyword=${searchTerm}`;
      }
      const response = await getData(apiUrl);

      if (response && response.data && response.data.data) {
        setData(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchTableData();
  }, [searchTerm]);

  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const isEditPermissionAvailable = UserPermissions?.includes(
    "business-sub-category-edit"
  );
  const isAddPermissionAvailable = UserPermissions?.includes(
    "business-sub-category-create"
  );
  const isDeletePermissionAvailable = UserPermissions?.includes(
    "business-sub-category-delete"
  );

  const columns = [
    {
      name: "S.NO",
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
      name: "SubBusiness  Category",
      selector: (row) => [row.sub_category_name],
      sortable: false,
      //  width: "25%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.sub_category_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Business Category",
      selector: (row) => [row.business_category],
      sortable: false,
      //  width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.business_category}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      //  width: "15%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row.status],
      sortable: false,
      center: true,
      //  width: "10%",
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
                to={`/editsubbusinesscategory/${row.id}`} // Assuming `row.id` contains the ID
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
            <h1 className="page-title">Manage SubBusiness Category</h1>

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
                Manage SubBusiness Category
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addsubbusinesscategory"
                  className="btn btn-primary"
                  style={{ borderRadius: "4px" }}
                >
                  Add SubBusiness Category
                  <i className="ph ph-plus ms-1 ph-plus-icon ph-sm-icon ph-sm-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Manage SubBusiness Category</h3>
                  <div className="mobile-head-container mt-2 mt-sm-0">
                    <SearchBar
                      onSearch={handleSearch}
                      onReset={handleReset}
                      hideReset={searchTerm}
                    />
                  </div>
                </div>
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
export default withApi(ManageSubBusinessCategory);
