import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import * as loderdata from "../../../data/Component/loderdata/loderdata";
import { useSelector } from "react-redux";
import useCustomDelete from "../../../Utils/useCustomDelete";
import useToggleStatus from "../../../Utils/useToggleStatus";

const ManageSubBusinessTypes = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();

  useEffect(() => {
    handleFetchData();
  }, []);

  const [searchText, setSearchText] = useState("");
  const [searchvalue, setSearchvalue] = useState();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filteredData = searchvalue.filter((item) =>
      item.business_sub_name.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  const handleFetchData = async () => {
    try {
      const response = await getData("/business/sub-types");

      if (response && response.data && response.data.data) {
        setData(response.data.data);
        setSearchvalue(response.data.data);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(
      postData,
      "business/sub-types/delete",
      formData,
      handleSuccess
    );
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id.toString());
    formData.append("status", (row.status === 1 ? 0 : 1).toString());
    toggleStatus(
      postData,
      "/business/update-sub-type-status",
      formData,
      handleSuccess
    );
  };

  const handleSuccess = () => {
    handleFetchData();
  };

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const isEditPermissionAvailable = userPermissions?.includes(
    "business-sub-type-edit"
  );
  const isAddPermissionAvailable = userPermissions?.includes(
    "business-sub-type-create"
  );
  const isDeletePermissionAvailable = userPermissions?.includes(
    "business-sub-type-delete"
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
      name: "Business Sub Type",
      selector: (row) => [row.business_sub_name],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.business_sub_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Business  Type",
      selector: (row) => [row.business_type],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.business_type}</h6>
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
      width: "15%",
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
      width: "20%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editsub-business/${row.id}`}
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

  const Loaderimg = () => (
    <div id="global-loader">
      <loderdata.Loadersbigsizes1 />
    </div>
  );

  return (
    <>
      {isLoading ? (
        Loaderimg()
      ) : (
        <>
          <div className="page-header ">
            <div>
              <h1 className="page-title">Manage SubBusiness Type</h1>

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
                  Manage SubBusiness Type
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
                  <Link to="/addsub-business" className="btn btn-primary ms-2">
                    Add SubBusiness Type{" "}
                    <i className="ph ph-plus ms-1 ph-plus-icon ph-sm-icon" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

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
        </>
      )}
    </>
  );
};
export default withApi(ManageSubBusinessTypes);
