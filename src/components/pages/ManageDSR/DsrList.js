import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import WorkflowExceptionFilter from "../../../data/Modal/DsrFilterModal";
import CustomPagination from "../../../Utils/CustomPagination";
import FiltersComponent from "../../Dashboard/DashboardHeader";
import NewDashboardFilterModal from "../Filtermodal/NewDashboardFilterModal";
import { useSelector } from "react-redux";
import { handleError } from "../../../Utils/ToastUtils";
import * as Yup from "yup";


const ManageEmail = (props) => {
  const { isLoading, getData, } = props;
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
        const response = await getData(`drs/exception?${queryString}`);
        if (response && response.data && response.data.data) {
          setFilters(updatedFilters);
          setCenterFilterModalOpen(false);
          setData(response?.data?.data?.exceptions);
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
        const response = await getData(`drs/exception?${queryString}`);
        if (response && response.data && response.data.data) {
          setFilters();
          setCenterFilterModalOpen(false);
          setData(response?.data?.data?.exceptions);
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
            <h1 className="page-title">Workflow Exception</h1>
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

WorkflowExceptionFilter.defaultProps = {
  onSubmit: () => { }, // Provide a default no-op function if `onSubmit` is not always required
};
