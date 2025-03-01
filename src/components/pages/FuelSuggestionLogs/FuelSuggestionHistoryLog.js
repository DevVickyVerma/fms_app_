import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Loaderimg from "../../../Utils/Loader";
import withApi from "../../../Utils/ApiHelper";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import moment from "moment";
import DataTable from "react-data-table-component";
import CustomPagination from "../../../Utils/CustomPagination";
import FuelSuggestionHistoryLogModal from "./FuelSuggestionHistoryLogModal";

const FuelSuggestionHistoryLog = (props) => {
  const { getData, isLoading, postData } = props;

  const [SuggestedModalId, setSuggestedModalId] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDrsDate, setSelectedDrsDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [logsModal, setLogsModal] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    setLogsModal(false);
  };

  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSubmit1 = async (values) => {
    setSelectedDrsDate(values.start_date);

    try {
      let { client_id, site_id, start_month } = values;

      const firstDayOfMonth = moment(start_month, "YYYY-MM")
        .startOf("month")
        .format("YYYY-MM-DD");

      const queryParams = new URLSearchParams();
      if (site_id) queryParams.append("site_id", site_id);
      if (start_month) queryParams.append("drs_date", firstDayOfMonth);
      if (currentPage) queryParams.append("page", currentPage);

      const queryString = queryParams.toString();

      if (start_month) {
        const response = await getData(
          `site/fuel-price/suggestion/history?${queryString}`
        );

        if (response && response.data && response.data.data) {
          setData(response.data.data?.logs || []);

          setCurrentPage(response.data.data?.currentPage || 1);
          setLastPage(response.data.data?.lastPage || 1);
        }
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
    start_month: Yup.string().required("Month is required"),
  });

  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);

  useEffect(() => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);

      // Check if start_date exists in storedData
      if (!parsedData.start_date) {
        // If start_date does not exist, set it to the current date
        const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        parsedData.start_date = currentDate;

        // Update the stored data with the new start_date
        localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
        handleApplyFilters(parsedData);
      } else {
        handleApplyFilters(parsedData);
      }

      // Call the API with the updated or original data
    } else if (localStorage.getItem("superiorRole") === "Client") {
      const storedClientIdData = localStorage.getItem("superiorId");

      if (storedClientIdData) {
        const futurepriceLog = {
          client_id: storedClientIdData,
          start_date: new Date().toISOString().split("T")[0], // Set current date as start_date
        };

        // Optionally store this data back to localStorage
        localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

        handleApplyFilters(futurepriceLog);
      }
    }
  }, [storedKeyName, currentPage]); // Add any other dependencies needed here

  const handleApplyFilters = (values) => {
    if (values?.company_id && values?.start_month) {
      handleSubmit1(values);
    }
  };
  const handleModalLogs = (site) => {
    setLogsModal(true);
    setSelectedItem(site);
    setSuggestedModalId(site?.id);
  };

  const handleClearForm = async (resetForm) => {
    setData(null);
  };

  const columns = [
    {
      name: "Creator",
      selector: (row) => [row.creator],
      sortable: false,
      //  width: "20%",
      cell: (row) => (
        <div
          className="d-flex pointer hyper-link"
          onClick={() => handleModalLogs(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-flex">
            <h6 className="mb-0 fs-14 fw-semibold wrap-text hyper-link">
              {row.creator}
              {/* <span className="ms-1">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{"Updated From FMS Or Email"} </Tooltip>}
                >
                  <span>
                    <i
                      className="ph ph-envelope-simple-open"
                      aria-hidden="true"
                    ></i>

                    <i className="ph ph-desktop"></i>
                  </span>
                </OverlayTrigger>
              </span> */}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Level",
      selector: (row) => [row.level],
      sortable: false,
      //  width: "10%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.level}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Suggested Date",
      selector: (row) => [row.date],
      sortable: false,
      //  width: "14%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Suggested Time",
      selector: (row) => [row.time],
      sortable: false,
      //  width: "14%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.time}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row) => [row.created_at],
      sortable: false,
      //  width: "13%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_at}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Status",
      selector: (row) => [row.time],
      sortable: false,
      //  width: "15%",
      cell: (row) => (
        <div className="d-flex pointer" onClick={() => handleModalLogs(row)}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              <span>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      <span>
                        {row.status === 1 ? (
                          <span>Pending</span>
                        ) : row.status === 2 ? (
                          <span>Rejected</span>
                        ) : row.status === 3 ? (
                          <span>Approved</span>
                        ) : row.status === 4 ? (
                          <span>Modified</span>
                        ) : (
                          "-"
                        )}{" "}
                      </span>
                      {/* <span>by - Name Will Come</span> */}
                    </Tooltip>
                  }
                >
                  <span style={{ cursor: "pointer" }}>
                    {row.status === 1 ? (
                      <span className="btn btn-warning btn-sm">
                        <i className="ph ph-hourglass-low  c-fs-12 mx-1"></i>
                        <span>Pending</span>
                      </span>
                    ) : row.status === 2 ? (
                      <span className="btn btn-danger btn-sm">
                        <i className="ph ph-x  c-fs-12 mx-1"></i>
                        <span>Rejected</span>
                      </span>
                    ) : row.status === 3 ? (
                      <span className="btn btn-success btn-sm">
                        <i className="ph ph-check  c-fs-12 mx-1"></i>
                        <span>Approved</span>
                      </span>
                    ) : row.status === 4 ? (
                      <span className="btn btn-info btn-sm">
                        <i className="ph ph-checks  c-fs-12 mx-1"></i>
                        <span>Modified</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </span>
                </OverlayTrigger>
              </span>
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.time],
      sortable: false,
      //  width: "14%",
      cell: (row) => (
        <div
          className="d-flex pointer hyper-link"
          onClick={() => handleModalLogs(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">
              <div className=" btn btn-primary btn-sm">
                View Logs
                <i className="ph ph-file-text mx-1 pointer fs-13" />
              </div>
            </h6>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Fuel Suggestion History Logs</h1>
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
                Fuel Suggestion History Logs
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Filter Data</h3>
              </Card.Header>

              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                lg="3"
                showStationValidation={true}
                showMonthInput={true}
                showDateRangeInput={false}
                showDateInput={false}
                showDateValidation={true}
                showStationInput={true}
                ClearForm={handleClearForm}
              />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel Suggestion History Logs</h3>
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
      {logsModal && (
        <>
          <FuelSuggestionHistoryLogModal
            open={logsModal}
            onClose={handleModalClose}
            selectedItem={selectedItem}
            accordionSiteID={SuggestedModalId}
            postData={postData}
          />
        </>
      )}
    </>
  );
};

export default withApi(FuelSuggestionHistoryLog);
