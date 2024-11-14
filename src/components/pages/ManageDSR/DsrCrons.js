import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import CustomPagination from "../../../Utils/CustomPagination";
import NewDashboardFilterModal from "../Filtermodal/NewDashboardFilterModal";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import FiltersComponent from "../../Dashboard/DashboardHeader";
import useErrorHandler from "../../CommonComponent/useErrorHandler";



const ManageEmail = (props) => {
  const { isLoading, getData, } = props;
  const { handleError } = useErrorHandler();
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
  const ReduxFullData = useSelector((state) => state?.data?.data);
  const [filters, setFilters] = useState({
    client_id: "",
    company_id: "",
    site_id: "",
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
      name: "Site",
      selector: (row) => [row?.site],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.site}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Api Type",
      selector: (row) => [row?.api_type],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.api_type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Data Import Type",
      selector: (row) => [row?.data_import_type],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.data_import_type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Hit Type",
      selector: (row) => [row?.hit_type],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.hit_type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Log Date",
      selector: (row) => [row?.log_date],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.log_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row?.status],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === "Success" ? (
              <button className="btn btn-success btn-sm">Success</button>
            ) : row.status === "Error" ? (
              <button className="btn btn-danger btn-sm">Error</button>
            ) : (
              <button className="badge">Unknown</button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },
  ];

  const validationSchemaForCustomInput = Yup.object({});

  let storedKeyName = "localFilterModalData";

  const handleApplyFilters = ((values) => {
    if (!values?.start_date) {
      // If start_date does not exist, set it to the current date
      const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      values.start_date = currentDate;
      // Update the stored data with the new start_date
      localStorage.setItem(storedKeyName, JSON.stringify(values));
    }

    FetchFilterData(values);
  });

  const FetchFilterData = async (filters) => {
    if (filters) {
      let { client_id, company_id, client_name, company_name, start_date, site_id } = filters;

      if (localStorage.getItem("superiorRole") === "Client") {
        client_id = ReduxFullData?.superiorId;
        client_name = ReduxFullData?.full_name;
      }

      if (ReduxFullData?.company_id && !company_id) {
        company_id = ReduxFullData?.company_id;
        company_name = ReduxFullData?.company_name;
      }

      const updatedFilters = {
        ...filters,
        client_id,
        client_name,
        company_id,
        site_id,
        start_date,
        company_name
      };
      try {
        const queryParams = new URLSearchParams();
        if (site_id) queryParams.append("site_id", site_id);
        if (start_date) queryParams.append("drs_date", start_date);
        queryParams.append("page", currentPage);

        const queryString = queryParams.toString();
        const response = await getData(`drs/api-logs?${queryString}`);
        if (response && response.data && response.data.data) {
          setFilters(updatedFilters);
          setCenterFilterModalOpen(false);
          setData(response?.data?.data?.logs);
          setCurrentPage(response?.data?.data?.currentPage || 1);
          setLastPage(response?.data?.data?.lastPage || 1);
        }
        localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
      } catch (error) {
        handleError(error);
      }
    } else {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage);

        const queryString = queryParams.toString();
        const response = await getData(`drs/api-logs?${queryString}`);
        if (response && response.data && response.data.data) {
          setFilters();
          setCenterFilterModalOpen(false);
          setData(response?.data?.data?.logs);
          setCurrentPage(response?.data?.data?.currentPage || 1);
          setLastPage(response?.data?.data?.lastPage || 1);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleToggleSidebar1 = () => {
    setCenterFilterModalOpen(!centerFilterModalOpen);
  };


  const handleResetFilters = async () => {
    localStorage.removeItem(storedKeyName);
    setFilters(null);
    setData(null);
    FetchFilterData()
  };


  useEffect(() => {
    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
      let parsedData = JSON.parse(storedData);
      if (parsedData.start_date || parsedData.site_id) { }
      FetchFilterData(parsedData)
    } else {
      FetchFilterData()
    }
  }, [currentPage])





  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      {centerFilterModalOpen && (
        <div className="">
          <NewDashboardFilterModal
            isOpen={centerFilterModalOpen}
            onClose={() => setCenterFilterModalOpen(false)}
            getData={getData}
            isLoading={isLoading}
            isStatic={true}
            onApplyFilters={handleApplyFilters}
            validationSchema={validationSchemaForCustomInput}
            storedKeyName={storedKeyName}
            layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
            showStationValidation={false}
            showMonthInput={false}
            showDateInput={true}
            showClientValidation={false}
            showEntityValidation={false}
            showDateValidation={false}
          />
        </div>
      )}



      <>

        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">DRS Api Logs </h1>
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
                DRS Api Logs
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="">
            <div className="input-group">
              <FiltersComponent
                filters={filters}
                handleToggleSidebar1={handleToggleSidebar1}
                handleResetFilters={handleResetFilters}
                showResetBtn={true}
                showStartDate={true}
              />
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> DRS Api Logs</h3>
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
    </>
  );
};
export default withApi(ManageEmail);
