import { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { handleError } from "../../../Utils/ToastUtils";
import useCustomDelete from "../../../Utils/useCustomDelete";
import CustomPagination from "../../../Utils/CustomPagination";

const OpeningBalance = ({ isLoading, getData, postData, }) => {
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [siteName, setSiteName] = useState("");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchOpeningBalanceList();
  }, [currentPage]);

  const [permissionsArray, setPermissionsArray] = useState([]);
  const UserPermissions = useSelector((state) => state?.data?.data);
  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);
  const isAddPermissionAvailable = permissionsArray?.includes("assign-business-sub-category-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("assign-business-sub-category-delete");
  const isEditPermissionAvailable = permissionsArray?.includes("assign-business-sub-category-edit");
  const { id } = useParams();

  const { customDelete } = useCustomDelete();
  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append('id', id);
    customDelete(postData, 'assignsubcategory/delete', formData, handleSuccess);
  };

  const handleSuccess = () => {
    fetchOpeningBalanceList()
  }



  const fetchOpeningBalanceList = async () => {
    try {
      const response = await getData(
        `/assignsubcategory/list?site_id=${id}&page=${currentPage ? currentPage : 1
        }`
      );
      if (response && response.data) {
        setData(response?.data?.data?.categoires);
        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
        setSiteName(response?.data?.data?.site_name);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      handleError(error); // Set the submission state to false if an error occurs
    }
  };

  const columns = [
    {
      name: "S.NO",
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
      name: "Main Category Name",
      selector: (row) => [row?.main_category_name],
      sortable: false,
      width: "35%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {row?.main_category_name}
            </h6>
          </div>
        </div>
      ),
    },

    {
      name: "Sub Category Name",
      selector: (row) => [row?.sub_category_name],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
        // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              {row?.sub_category_name}
            </h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row?.action],
      sortable: false,
      width: "25%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editassign-business-sub-categories/${row?.id}`}
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
                onClick={() => handleDelete(row?.id)}
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
      <div>
        <div className="page-header d-flex">
          <div>
            <h1 className="page-title">
              Manage Assigned Business Sub Categories ({siteName})
            </h1>
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
                Manage Assigned Business Sub Categories
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to={`/addassign-business-sub-categories/${siteName}/${id}`}
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Assign Business Sub Categories <i className="ph ph-plus ms-1 ph-plus-icon" />
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12} md={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Manage Assigned Business Sub Categories </h3>
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
                        className=" overflow-hidden"
                        style={{ overflow: "hidden" }}
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
      </div>
    </>
  );
};

export default withApi(OpeningBalance);
