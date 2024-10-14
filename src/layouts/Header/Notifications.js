/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, Row, Modal, Button } from "react-bootstrap";
import Loaderimg from "../../Utils/Loader";
import withApi from "../../Utils/ApiHelper";
import CustomPagination from "../../Utils/CustomPagination";

const Notification = (props) => {
  const { isLoading, getData } = props;
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [Modalmessage, setModalmessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchData(currentPage);
    console.clear();
  }, [currentPage]);

  const fetchData = async (pageNumber) => {
    try {
      const response = await getData(`/notifications?page=${pageNumber}`);

      if (response.data.api_response === "success") {
        setData(response?.data?.data?.notifications);
        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleRowExpandToggle = (row) => {
    const isRowExpanded = expandedRows.includes(row.id);

    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((id) => id !== row.id));
    } else {
      setModalContent(row.response);
      setModalmessage(row.message);
      setIsModalOpen(true);
      setExpandedRows([...expandedRows, row.id]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExpandedRows([]); // Reset the button text to "Show Response" when the modal is closed
  };

  const columns = [
    {
      name: "Sr. No.",
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
      name: "Notification",
      selector: (row) => [row.message],
      sortable: false,
      width: "25%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => handleRowExpandToggle(row)}
              className="mb-0 fs-14 fw-semibold"
            >
              {row.message}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Date",
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
      name: "Time",
      selector: (row) => [row.ago],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.ago}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.response],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div className="d-flex messagebox">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">
              {expandedRows.includes(row.id) ? (
                <>
                  <button
                    className="btn  btn-danger "
                    type="button"
                    onClick={() => handleRowExpandToggle(row)}
                  >
                    {expandedRows.includes(row.id)
                      ? "Hide Response"
                      : "Show Response"}
                  </button>
                </>
              ) : (
                <button
                  className="btn  btn-primary "
                  type="button"
                  onClick={() => handleRowExpandToggle(row)}
                >
                  Show Response
                </button>
              )}
            </h6>
          </div>
        </div>
      ),
    },
  ];


  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
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
              Notification
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Notifications</h3>
            </Card.Header>
            <Card.Body>
              {data?.length > 0 ? (
                <>
                  <div className="table-responsive deleted-table">
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={data}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        searchable={false}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={require("../../assets/images/commonimages/no_data.png")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </>
              )}

              {data?.length > 0 && lastPage > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  handlePageChange={handlePageChange}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton={true}>{Modalmessage}</Modal.Header>
        <Modal.Body dangerouslySetInnerHTML={{ __html: modalContent }} />
        <Modal.Footer>
          <Button
            className="btn  btn-danger"
            variant="secondary"
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default withApi(Notification);
