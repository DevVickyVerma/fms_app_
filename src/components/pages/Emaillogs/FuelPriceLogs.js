import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Card, Col, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import CustomPagination from "../../../Utils/CustomPagination";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { handleError } from "../../../Utils/ToastUtils";


const ManageSiteTank = (props) => {
  const { isLoading, getData } = props;
  const [data, setData] = useState();
  const ReduxFullData = useSelector((state) => state?.data?.data);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    start_date: Yup.date()
      .required("Date is required")
      .min(
        new Date("2023-01-01"),
        "Date cannot be before January 1, 2023"
      ),
  });


  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "5%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site",
      selector: (row) => [row.site],
      sortable: false,
      width: "12%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.site}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "User  Name",
      selector: (row) => [row.user],
      sortable: false,
      width: "12%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.user}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Name",
      selector: (row) => [row.name],
      sortable: false,
      width: "11%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },

    {
      name: " Action type",
      selector: (row) => [row.type],
      sortable: false,
      width: "12%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.type}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Prev Price",
      selector: (row) => [row.prev_price],
      sortable: false,
      width: "8%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.prev_price}</h6>
          </div>
        </div>
      ),
    },
    {
      name: " Price",
      selector: (row) => [row.price],
      sortable: false,
      width: "8%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.price}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Price Date",
      selector: (row) => [row.date],
      sortable: false,
      width: "16%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Log Date",
      selector: (row) => [row.created],
      sortable: false,
      width: "16%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created}</h6>
          </div>
        </div>
      ),
    },
  ];



  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const handleClearForm = async () => {
    localStorage.removeItem(storedKeyName);
    setData(null);
    handleSubmit1()
  };

  let storedKeyName = "localFilterModalData";

  useEffect(() => {
    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
      let parsedData = JSON.parse(storedData);
      if (parsedData.start_date || parsedData.site_id) { }
      handleSubmit1(parsedData)
    } else {
      handleSubmit1()
    }
  }, [currentPage])

  const handleApplyFilters = (values) => {
    if (values?.start_date && values?.company_id) {
      handleSubmit1(values)
    }
  }


  const handleSubmit1 = async (filters) => {
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
        const response = await getData(`site/fuel-price/logs?${queryString}`);
        if (response && response.data && response.data.data) {
          setData(response?.data?.data?.priceLogs);
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
        const response = await getData(`site/fuel-price/logs?${queryString}`);
        if (response && response.data && response.data.data) {
          setData(response?.data?.data?.priceLogs);
          setCurrentPage(response?.data?.data?.currentPage || 1);
          setLastPage(response?.data?.data?.lastPage || 1);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };


  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title"> Fuel price logs</h1>
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
                Fuel price logs
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>


        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Fuel price logs </h3>
              </Card.Header>

              <NewFilterTab
                getData={getData}
                isLoading={isLoading}
                isStatic={true}
                onApplyFilters={handleApplyFilters}
                validationSchema={validationSchemaForCustomInput}
                storedKeyName={storedKeyName}
                lg="3"
                showStationValidation={false}
                showMonthInput={false}
                showDateInput={true}
                showStationInput={true}
                ClearForm={handleClearForm}
                showDateRangeInput={false}
              />

            </Card>
          </Col>
        </Row>



        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Fuel price logs </h3>
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
export default withApi(ManageSiteTank);
