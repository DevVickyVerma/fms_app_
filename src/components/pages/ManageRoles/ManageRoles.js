import { useEffect, useState } from 'react';
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
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";
import useCustomDelete from '../../../Utils/useCustomDelete';

const ManageRoles = (props) => {
  const { getData, isLoading, postData } = props;
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const userPermissions = useSelector((state) => state?.data?.data?.permissions || []);
  const isEditPermissionAvailable = userPermissions?.includes("role-edit");
  const isAddPermissionAvailable = userPermissions?.includes("role-create");
  const isDeletePermissionAvailable = userPermissions?.includes("role-delete");




  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
  };


  const { customDelete } = useCustomDelete();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append('role_id', id);
    customDelete(postData, 'role/delete', formData, handleSuccess);
  };




  const handleSuccess = () => {
    FetchTableData()
  }




  useEffect(() => {
    FetchTableData();
    
  }, [searchTerm, currentPage]);


  const handleEdit = (row) => {
    localStorage.setItem("EditRole_name", row.name);
  };
  const FetchTableData = async () => {
    try {
      let apiUrl = `/role/list?page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }

      const response = await getData(apiUrl);

      if (response && response.data && response.data.data.roles) {
        setData(response.data.data.roles);
        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };


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
      name: "Role",
      selector: (row) => [row.name],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editrole/${row.id}`}
                className="btn btn-primary btn-sm rounded-11 me-2"
                onClick={() => handleEdit(row)}
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



  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Roles</h1>
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
                Manage Roles
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addroles"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Role
                  <i className="ph ph-plus ms-1 ph-plus-icon" />
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
                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Manage Roles</h3>
                  <div className="mt-2 mt-sm-0">
                    <SearchBar onSearch={handleSearch} onReset={handleReset} hideReset={searchTerm} />
                  </div>
                </div>
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

                        responsive={true}
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
              {data?.length > 0 && lastPage > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  handlePageChange={handlePageChange}
                />
              )}
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageRoles);
