import { useEffect, useState } from "react";
import withApi from "../../../Utils/ApiHelper";
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
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import CustomPagination from "../../../Utils/CustomPagination";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import useCustomDelete from "../../CommonComponent/useCustomDelete";
import useToggleStatus from "../../CommonComponent/useToggleStatus";
import { handleFilterData } from "../../../Utils/commonFunctions/commonFunction";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const Competitor = (props) => {
  const { isLoading, getData, postData } = props;
  const [CompetitorList, setCompetitorList] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const { handleError } = useErrorHandler();
  const ReduxFullData = useSelector((state) => state?.data?.data);

  useEffect(() => {
    handleSuccess()
  }, [currentPage])



  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append('id', id);
    customDelete(postData, 'site/competitor/delete', formData, handleSuccess);
  };


  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append('id', row.id.toString());
    formData.append('status', (row.status === 1 ? 0 : 1).toString());
    toggleStatus(postData, '/site/competitor/update-status', formData, handleSuccess);
  };



  const UserPermissions = useSelector((state) => state?.data?.data?.permissions || []);

  const isAddPermissionAvailable = UserPermissions?.includes("competitor-create");
  const isDeletePermissionAvailable = UserPermissions?.includes("competitor-delete");
  const isEditPermissionAvailable = UserPermissions?.includes("competitor-edit");





  const handleSubmit1 = async (values) => {
    let { site_id } = values;
    try {
      const queryParams = new URLSearchParams();
      if (site_id) queryParams.append("site_id", site_id);
      queryParams.append("page", currentPage);

      const queryString = queryParams.toString();
      const response = await getData(`site/competitor/list?${queryString}`);

      const { data } = response;
      if (data) {
        setCompetitorList(response.data.data.competitors);
        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
      }
    } catch (error) {
      handleError(error)
      console.error("API error:", error);
    } // Set the submission state to false after the API call is completed
  };

  const columns = [

    {
      name: "Name",
      selector: (row) => [row.name],
      sortable: false,
      width: "20%",
      center: false,
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Suppliers",
      selector: (row) => [row.supplier],
      sortable: false,
      width: "18%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.supplier}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      // selector: "created_date",
      sortable: false,
      width: "17%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Address",
      selector: (row) => [row.address],
      // selector: "created_date",
      sortable: false,
      width: "20%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.address}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Status",
      selector: (row) => [row.status],
      sortable: false,
      width: "10%",
      cell: (row) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
            {row.status === 1 ? (
              <button
                className="btn btn-success btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Active
              </button>
            ) : row.status === 0 ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Inactive
              </button>
            ) : (
              <button
                className="badge"
                onClick={
                  isEditPermissionAvailable ? () => toggleActive(row) : null
                }
              >
                Unknown
              </button>
            )}
          </OverlayTrigger>
        </span>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "15%",
      cell: (row) => (
        <span className="text-center">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/edit-competitor/${row.id}`}
                className="btn btn-primary btn-sm rounded-11 me-2"
              >
                <i className="ph ph-pencil" />
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11"
                onClick={() => handleDelete(row.id)}
              >
                <i className="ph ph-trash" />
              </Link>
            </OverlayTrigger>
          ) : null}
        </span>
      ),
    },
  ];



  const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
  const validationSchemaForCustomInput = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    site_id: Yup.string().required("Site is required"),
  });


  let storedKeyName = "localFilterModalData";
  const storedData = localStorage.getItem(storedKeyName);


  useEffect(() => {
    handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
  }, [storedKeyName]);

  const handleApplyFilters = (values) => {
    if (values?.company_id && values?.site_id) {
      handleSubmit1(values)
    }
  }

  const handleClearForm = async () => {
    setCompetitorList(null)
  };

  const handleSuccess = () => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);
      handleApplyFilters(parsedData);
    }
  }





  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <>

        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">Manage Competitors</h1>
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
                Manage Competitors
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addCompetitor"
                  className="btn btn-primary "
                  style={{ borderRadius: "4px" }}
                >
                  Add Competitor
                  <i className="ph ph-plus ms-1 ph-plus-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>




        {/* here I will start Body of competitor */}
        <Row>
          <Col lg={12} xl={12} md={12} sm={12}>
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
                lg="4"
                showStationValidation={true}
                showMonthInput={false}
                showDateInput={false}
                showStationInput={true}
                ClearForm={handleClearForm}
              />

            </Card>
          </Col>
        </Row>

        {/* here is my listing data table */}
        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Competitor Listing Data</h3>
              </Card.Header>
              <Card.Body>
                {CompetitorList?.length > 0 ? (
                  <>
                    <div className="table-responsive deleted-table">
                      <DataTable
                        columns={columns}
                        data={CompetitorList}
                        defaultSortField="id"
                        defaultSortAsc={false}
                        striped={true}
                        persistTableHead={true}
                        highlightOnHover={true}
                        searchable={false}
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
              {CompetitorList?.length > 0 && lastPage > 1 && (
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

export default withApi(Competitor);
