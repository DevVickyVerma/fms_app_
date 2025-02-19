import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useSelector } from "react-redux";
import useCustomDelete from "../../CommonComponent/useCustomDelete";
import useToggleStatus from "../../CommonComponent/useToggleStatus";
import * as Yup from "yup";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const ManageSiteTank = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();
  const { handleError } = useErrorHandler();
  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "site-tank/delete", formData, handleSuccess);
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id.toString());
    formData.append("status", (row.status === 1 ? 0 : 1).toString());
    toggleStatus(postData, "/site-tank/update-status", formData, handleSuccess);
  };

  const handleSubmit1 = async (values) => {
    let { site_id } = values;
    try {
      const queryParams = new URLSearchParams();
      if (site_id) queryParams.append("site_id", site_id);

      const queryString = queryParams.toString();
      const response = await getData(`site-tank/list?${queryString}`);

      const { data } = response;
      if (data) {
        setData(response?.data?.data);
      }
    } catch (error) {
      handleError(error);
      console.error("API error:", error);
    } // Set the submission state to false after the API call is completed
  };

  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const isEditPermissionAvailable = UserPermissions?.includes("tank-edit");
  const isAddPermissionAvailable = UserPermissions?.includes("tank-create");
  const isDeletePermissionAvailable = UserPermissions?.includes("tank-delete");

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      //  width: "8%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Site Name",
      selector: (row) => [row.site],
      sortable: false,
      //  width: "14%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.site}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Fuel Name",
      selector: (row) => [row.fuel_name],
      sortable: false,
      //  width: "15%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.fuel_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Site Tank Name",
      selector: (row) => [row.tank_name],
      sortable: false,
      //  width: "15%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.tank_name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Site Tank Code",
      selector: (row) => [row.tank_code],
      sortable: false,
      //  width: "13%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.tank_code}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      //  width: "10%",
      cell: (row) => (
        <div className="d-flex" style={{ cursor: "default" }}>
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => [row.status],
      sortable: false,
      center: true,
      //  width: "10%",
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
      center: true,
      //  width: "15%",
      cell: (row) => (
        <span className="d-flex gap-2">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/editsitetank/${row.id}`} // Assuming `row.id` contains the ID
                className="btn btn-primary btn-sm rounded-11 mobile-btn p-2 me-2"
              >
                <i className="ph ph-pencil" />
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11 mobile-btn p-2"
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

  const [isNotClient] = useState(
    localStorage.getItem("superiorRole") !== "Client"
  );
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
  }, [storedKeyName]); // Add any other dependencies needed here

  const handleApplyFilters = (values) => {
    if (values?.company_id && values?.site_id) {
      handleSubmit1(values);
    }
  };

  const handleClearForm = async () => {
    setData(null);
  };

  const handleSuccess = () => {
    if (storedData) {
      let parsedData = JSON.parse(storedData);
      handleApplyFilters(parsedData);
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Manage Site Tanks</h1>
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
                Manage Site Tanks
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/addsitetank"
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                >
                  Add Site Tank
                  <i className="ph ph-plus ms-1 ph-plus-icon ph-sm-icon ph-sm-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title"> Filter </h3>
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

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">
                  Manage Site Tanks
                  {/* {localStorageSiteName ? `(${localStorageSiteName})` : ""}{" "} */}
                </h3>
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
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};
export default withApi(ManageSiteTank);
