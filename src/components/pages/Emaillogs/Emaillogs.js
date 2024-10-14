import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import EmailDetailModal from "./EmailDetailModal";
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";

const ManageEmail = (props) => {
  const { isLoading, getData } = props;
  const [data, setData] = useState();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [addshowModal, setaddshowModal] = useState(false);
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


  const AddCloseModal = () => setaddshowModal(false);


  const handleaddshowModal = (rowId) => {
    setSelectedRowId(rowId);
    setaddshowModal(true);
  };

  useEffect(() => {
    FetchTableData(currentPage);
    console.clear();
  }, [currentPage, searchTerm]);

  const FetchTableData = async () => {
    try {

      let apiUrl = `/email/logs?page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }
      const response = await getData(apiUrl);
      setData(response?.data?.data?.logs);
      setCurrentPage(response?.data?.data?.currentPage || 1);
      setLastPage(response?.data?.data?.lastPage || 1);
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
      cell: (row) => (
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
      cell: (row) => (
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
      cell: (row) => {
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
      cell: (row) => (
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
                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Email Logs</h3>
                  <div className="mt-2 mt-sm-0">
                    <SearchBar onSearch={handleSearch} onReset={handleReset} hideReset={searchTerm} />
                  </div>
                </div>
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
export default withApi(ManageEmail);
