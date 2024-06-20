import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Pagination,
  Row,
  Tooltip,
} from "react-bootstrap";

import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import EmailDetailModal from "./EmailDetailModal";

const ManageEmail = (props) => {
  const { isLoading, getData } = props;
  const [data, setData] = useState();

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [addshowModal, setaddshowModal] = useState(false);

  const AddCloseModal = () => setaddshowModal(false);
  const handleaddshowModal = (rowId) => {
    console.log(rowId, "rowId");
    setSelectedRowId(rowId);
    setaddshowModal(true);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    FetchTableData(currentPage);
    console.clear();
  }, [currentPage]);

  const FetchTableData = async (pageNumber) => {
    try {
      const response = await getData(`/email/logs?page=${pageNumber}`);
      setData(response?.data?.data?.logs);

      setCurrentPage(response?.data?.data?.currentPage);

      setLastPage(response?.data?.data?.lastPage);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "6%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Subject",
      selector: (row) => [row?.subject],
      sortable: false,
      width: "25%",
      cell: (row, index) => (
        <div>
          {row?.raw_data !== null ? (
            <div className="d-flex" onClick={() => handleaddshowModal(row)} style={{ cursor: "pointer" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <h6 className="mb-0 fs-14 " style={{ fontWeight: "bold" }}>{row?.subject}</h6>
              </div>
            </div>
          ) : (
            <div className="d-flex">
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                <h6 className="mb-0 fs-14 fw-semibold">{row?.subject}</h6>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Message",
      selector: (row) => [row?.message],
      sortable: false,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.message}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => [row?.email],
      sortable: false,
      width: "20%",
      cell: (row, index) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.email && row?.email ? (
                  <h6 className="mb-0 fs-14 fw-semibold">{row?.email}</h6>
                ) : (
                  <h6 className="mb-0 fs-14 fw-semibold">No email</h6>
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
      selector: (row) => [row?.created_date],
      sortable: false,
      width: "12%",
      cell: (row, index) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
        // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row?.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row?.status],
      sortable: false,
      width: "12%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row?.status === 1 ? (
              <button className="btn btn-success btn-sm">Sent</button>
            ) : row?.status === 0 ? (
              <button className="btn btn-danger btn-sm">Failed</button>
            ) : (
              <button className="badge">Unknown</button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },
  ];

  const tableDatas = {
    columns,
    data,
  };
  const maxPagesToShow = 5; // Adjust the number of pages to show in the center
  const pages = [];

  // Calculate the range of pages to display
  let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
  let endPage = Math.min(startPage + maxPagesToShow - 1, lastPage);

  // Handle cases where the range is near the beginning or end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  // Render the pagination items
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Add ellipsis if there are more pages before or after the displayed range
  if (startPage > 1) {
    pages.unshift(<Pagination.Ellipsis key="ellipsis-start" disabled />);
  }

  if (endPage < lastPage) {
    pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
  }

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Email Logs</h1>

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
                Email Logs
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Email Logs</h3>
              </Card.Header>
              <EmailDetailModal
                addshowModal={addshowModal}
                getData={getData}
                AddCloseModal={AddCloseModal}
                selectedRowId={selectedRowId}
              />
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
                          // pagination
                          // paginationPerPage={20}
                          highlightOnHover
                          searchable={true}
                          onChangePage={(newPage) => setCurrentPage(newPage)}
                        />
                      </DataTableExtensions>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={require("../../../assets/images/noDataFoundImage/noDataFound.png")}
                      alt="MyChartImage"
                      className="all-center-flex nodata-image"
                    />
                  </>
                )}
              </Card.Body>
              {data?.length > 0 ? (
                <>
                  <Card.Footer>
                    <div style={{ float: "right" }}>
                      <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                        {pages}
                        <Pagination.Next
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === lastPage}
                        />
                        <Pagination.Last
                          onClick={() => handlePageChange(lastPage)}
                        />
                      </Pagination>
                    </div>
                  </Card.Footer>
                </>
              ) : (
                <></>
              )}
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageEmail);
