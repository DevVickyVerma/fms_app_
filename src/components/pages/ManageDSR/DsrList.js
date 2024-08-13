import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import SortIcon from "@mui/icons-material/Sort";
import { Breadcrumb, Button, Card, Col, Row } from "react-bootstrap";

import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import WorkflowExceptionFilter from "../../../data/Modal/DsrFilterModal";
import { Box } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CustomPagination from "../../../Utils/CustomPagination";


const ManageEmail = (props) => {
  const { apidata, isLoading, error, getData, postData } = props;
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [formValues, setFormValues] = useState(null);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  useEffect(() => {
    if (formValues === null) {
      FetchTableData(currentPage);
    }
    // console.clear();
  }, [currentPage, formValues]);

  const FetchTableData = async (pageNumber) => {
    try {
      const response = await getData(`/drs/exception?page=${currentPage}`);
      setData(response?.data?.data?.exceptions);
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
      width: "10%",
      center: true,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row?.site],
      sortable: false,
      width: "25%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.site}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Message",
      selector: (row) => [row?.message],
      sortable: false,
      width: "40%",
      cell: (row, index) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.message}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Drs Date ",
      selector: (row) => [row?.drs_date],
      sortable: false,
      width: "25%",
      cell: (row, index) => {
        try {
          return (
            <div className="d-flex" style={{ cursor: "default" }}>
              <div className="ms-2 mt-0 mt-sm-2 d-block">
                {row.drs_date && row?.drs_date ? (
                  <h6 className="mb-0 fs-14 fw-semibold">{row?.drs_date}</h6>
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
  ];

  const tableDatas = {
    columns,
    data,
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleFetchSiteData = async (values) => {
    try {
      const response = await getData(
        `/drs/exception?site_id=${values?.site_id}&drs_date=${values?.start_date}&page=${currentPage}`
      );
      setData(response?.data?.data?.exceptions);
      setCurrentPage(response?.data?.data?.currentPage || 1);
      setLastPage(response?.data?.data?.lastPage || 1);

    } catch (error) {
      console.error("API error:", error);
    }
  };
  const handleFormSubmit = (values) => {
    closeModal();
    handleFetchSiteData(values);
    setFormValues(values);
  };
  const superiorRole = localStorage.getItem("superiorRole");
  const role = localStorage.getItem("role");
  const ResetForm = () => {
    FetchTableData(currentPage);
    setFormValues();
  };
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Workflow Exception</h1>

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
                Workflow Exception
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            minHeight={"90px"}
            className="center-filter-modal-responsive"
          >
            {localStorage.getItem("superiorRole") === "Client" &&
              localStorage.getItem("role") === "Operator" ? (
              ""
            ) : (
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"baseline"}
                my={"20px"}
                gap={"5px"}
                mx={"10px"}
                flexDirection={"inherit"}
                className="filter-responsive"
              >
                <span
                  className="Search-data"
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    display: "flex",
                    gap: "5px",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {Object.entries(formValues || {}).some(
                    ([key, value]) =>
                      [
                        "client_name",
                        "Drs Date",
                        "company_name",
                        "site_name",
                        "start_date",
                      ].includes(key) &&
                      value != null &&
                      value !== ""
                  ) ? (
                    Object.entries(formValues || {}).map(([key, value]) => {
                      if (
                        [
                          "client_name",
                          "start_date",
                          "company_name",
                          "site_name",
                          "fromdate",
                        ].includes(key) &&
                        value != null &&
                        value !== ""
                      ) {
                        const formattedKey = key
                          .toLowerCase()
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        return (
                          <div key={key} className="badge">
                            <span className="badge-key">{formattedKey}:</span>
                            <span className="badge-value">{value}</span>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : superiorRole === "Client" && role !== "Client" ? (
                    <div className="badge">
                      <span className="badge-key">Company Name:</span>
                      <span className="badge-value">
                        {localStorage.getItem("PresetCompanyName")}
                      </span>
                    </div>
                  ) : null}
                </span>
                <Box display={"flex"} ml={"4px"} alignSelf={"center"}>
                  <button className="btn btn-primary ml-2" onClick={openModal}>
                    Filter
                    <span className="ms-2">
                      <SortIcon />
                    </span>
                  </button>

                  <WorkflowExceptionFilter
                    title="Filter Workflow Exception"
                    visible={isModalVisible}
                    onClose={closeModal}
                    onformSubmit={handleFormSubmit}
                    searchListstatus={false}
                  />

                  {Object.keys(formValues || {}).length > 0 ? (
                    <Button
                      onClick={() => {
                        ResetForm();
                      }}
                      className="btn btn-danger ms-2"
                      variant="danger"
                    >
                      Reset <RestartAltIcon />
                    </Button>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Workflow Exception</h3>
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
                        pagination={false}
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead
                        highlightOnHover

                      // onChangePage={(newPage) => setCurrentPage(newPage)}
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
