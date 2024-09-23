import { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { handleError } from "../../../Utils/ToastUtils";
import CustomPagination from "../../../Utils/CustomPagination";
import useCustomDelete from "../../../Utils/useCustomDelete";

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
  const isAddPermissionAvailable = permissionsArray?.includes("hide-category-add");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("hide-category-delete");

  const { id } = useParams();
  const { customDelete } = useCustomDelete();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append('id', id);
    customDelete(postData, 'hidecategory/delete', formData, handleSuccess);
  };

  const handleSuccess = () => {
    fetchOpeningBalanceList()
  }



  const fetchOpeningBalanceList = async () => {
    try {
      const response = await getData(
        `/hidecategory/list?site_id=${id}&page=${currentPage ? currentPage : 1
        }`
      );
      if (response && response.data) {
        setData(response?.data?.data?.categoires);
        setSiteName(response?.data?.data?.site_name);
        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
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
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },

    {
      name: "Main Category Name",
      selector: (row) => [row?.name],
      sortable: false,
      width: "35%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {row?.name}
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

          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11"
                onClick={() => handleDelete(row?.id)}
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
            <h1 className="page-title">
              Manage  Hide Business Categories ({siteName})
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
                Manage Hide Business Categories
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to={`/addhide-business-categories/${siteName}/${id}`}
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Hide Business Categories <i className="ph ph-plus ms-1 ph-plus-icon"></i>
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
                <h3 className="card-title">Manage Hide Business Categories </h3>
              </Card.Header>
              <Card.Body>
                {data?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        noHeader
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        center={true}
                        persistTableHead
                        highlightOnHover
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
