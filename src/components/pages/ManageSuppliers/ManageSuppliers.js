import { useEffect, useState } from 'react';

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import SearchBar from "../../../Utils/SearchBar";
import CustomPagination from "../../../Utils/CustomPagination";
import useCustomDelete from "../../../Utils/useCustomDelete";
import useToggleStatus from '../../../Utils/useToggleStatus';

const ManageSuppliers = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  const UserPermissions = useSelector((state) => state?.data?.data?.permissions);

  const isEditPermissionAvailable = UserPermissions?.includes("supplier-edit");
  const isAddPermissionAvailable = UserPermissions?.includes("supplier-create");
  const isDeletePermissionAvailable = UserPermissions?.includes("supplier-delete");


  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append('id', id);
    customDelete(postData, 'supplier/delete', formData, handleSuccess);
  };


  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append('id', row.id.toString());

    formData.append('status', (row?.supplier_status == 1 ? 0 : 1).toString());
    toggleStatus(postData, '/supplier/update-status', formData, handleSuccess);
  };

  const handleSuccess = () => {
    FetchTableData()
  }



  useEffect(() => {
    FetchTableData(currentPage);
    
  }, [currentPage, searchTerm]);


  const FetchTableData = async () => {
    try {
      let apiUrl = `/supplier/list?page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }
      const response = await getData(apiUrl);

      if (response && response.data && response.data.data) {
        setData(response.data.data.suppliers);
        setCurrentPage(response?.data?.data?.currentPage || 1);
        setLastPage(response?.data?.data?.lastPage || 1);
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
      name: "Supplier Name",
      selector: (row) => [row.supplier_name],
      sortable: false,
      width: "25%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.supplier_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Supplier Logo",
      selector: (row) => [row.supplier_logo],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <div className="d-flex align-items-center card-img">
          <img
            src={row.supplier_logo}
            alt={row.supplier_logo}
            className="mr-2"
            style={{ width: "50px", height: "50px" }}
          />
          <div />
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row.supplier_status],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.supplier_status == 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.supplier_status == 0 ? (
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
                to={`/editsuppliers/${row.id}`} // Assuming `row.id` contains the ID
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

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Suppliers</h1>
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
                Manage Suppliers
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn  d-flex align-items-center">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addSuppliers"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Supplier
                  <i className="ph ph-plus ms-1 ph-plus-icon" />
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
                  <h3 className="card-title">Manage Suppliers</h3>
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
                        center={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                        searchable={false}
                        subHeader={false}
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
export default withApi(ManageSuppliers);
