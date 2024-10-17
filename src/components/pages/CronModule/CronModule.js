import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import { ErrorAlert, handleError, SuccessAlert } from "../../../Utils/ToastUtils";
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";
import Swal from "sweetalert2";

const CronModule = ({ getData, isLoading, postData }) => {
  const [data, setData] = useState();
  const [cronList, setCronList] = useState();
  const [selectedCronList, setSelectedCronList] = useState();

  const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);
  const isLogsPermissionAvailable = UserPermissions?.includes("cronjob-logs");
  const isHitPermissionAvailable = UserPermissions?.includes("cronjob-hit");

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



  useEffect(() => {
    FetchCronListApi();
  }, []);

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
      name: "User",
      selector: (row) => [row?.user],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.user}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Hit Type",
      selector: (row) => [row?.type],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => [row?.date],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.date}</h6>
          </div>
        </div>
      ),
    },
  ];

  const FetchCronListApi = async () => {
    try {
      const response = await getData(`/cron-job/list`);
      setCronList(response?.data?.data?.cronJobs);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const animatedComponents = makeAnimated();
  const Optionssingle = cronList?.map((item) => ({
    value: item?.id,
    label: item?.title,
    url: item?.url,
    status: item?.status,
  }));

  useEffect(() => {
    if (selectedCronList?.value) {
      fetchCronJobApi()
    }
  }, [currentPage, searchTerm, selectedCronList?.value])



  const callfetchCronJobApi = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: " Want To Start Cron!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Start it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        FetchHiddenCronList();
      }
    });
  }


  const fetchCronJobApi = async () => {
    try {
      let apiUrl = `cron-job/logs?cron_job_id=${selectedCronList?.value}&page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }
      const response = await getData(apiUrl);
      setData(response?.data?.data?.cronLogs);
      setCurrentPage(response?.data?.data?.currentPage || 1);
      setLastPage(response?.data?.data?.lastPage || 1);

    } catch (error) {
      console.error("API error:", error);
    }
  };

  const FetchHiddenCronList = async () => {
    try {
      const response = await getData(`${selectedCronList.url}`);
      if (response) {
        SuccessAlert(response?.data?.message);

      }
    } catch (error) {
      ErrorAlert(error);
    }

    const postDataUrl = `/cron-job/create?cron_job_id=${selectedCronList?.value}`;
    await postData(postDataUrl); // Set the submission state to false after the API call is completed

    await fetchCronJobApi()
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div className="page-header d-flex flex-wrap">
        <div>
          <h1 className="page-title ">Cron Module </h1>
          <Breadcrumb className="breadcrumb breadcrumb-subheader">
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
              Cron Module
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="ms-auto " />
      </div>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Manage Cron</h3>
            </Card.Header>
            <Card.Body>
              <div className="ms-auto">
                <label>Filter Cron Site:</label>
                <div style={{ minWidth: "200px" }}>
                  <Select
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={Optionssingle}
                    onChange={(value) => setSelectedCronList(value)}
                    className="test"
                  />
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="text-end">
                {isLogsPermissionAvailable ? (
                  <>
                    <button
                      className="btn btn-primary me-2"
                      type="submit"
                      disabled={!selectedCronList}
                      onClick={fetchCronJobApi}
                    >
                      Show Logs
                    </button>
                  </>
                ) : (
                  ""
                )}

                {isHitPermissionAvailable ? (
                  <>
                    {selectedCronList ? (
                      <button
                        type="submit"
                        className="btn btn-danger me-2"
                        // to={selectedCronList.url}
                        onClick={callfetchCronJobApi}
                        // onClick={FetchHiddenCronList}
                        style={{ color: "white" }}
                      >
                        Submit
                      </button>
                    ) : (
                      <button className="btn btn-danger me-2" disabled={true}>
                        Submit
                      </button>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                <h3 className="card-title">Cron Module Logs</h3>
                {
                  selectedCronList?.value && (<>
                    <div className="mt-2 mt-sm-0">
                      <SearchBar onSearch={handleSearch} onReset={handleReset} hideReset={searchTerm} />
                    </div>
                  </>)
                }

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
  );
};

export default CronModule;
