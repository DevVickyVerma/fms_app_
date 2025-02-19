import { useEffect, useState } from "react";
import Loaderimg from "../../../Utils/Loader";
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
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import CardGroupCenterModal from "./CardGroupCenterModal";
import NewFilterTab from "../Filtermodal/NewFilterTab";
import useCustomDelete from "../../CommonComponent/useCustomDelete";

const CardGroup = ({ isLoading, getData, postData }) => {
  const [data, setData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [detailApiData, setDetailApiData] = useState();

  const { customDelete } = useCustomDelete();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "sage/card-group/delete", formData, handleSuccess);
  };

  const handleSubmit1 = async (values) => {
    try {
      const response = await getData(
        `/sage/card-group/list?company_id=${values?.company_id}&site_id=${values?.site_id}`
      );
      setData(response?.data?.data?.cardGroups);
      setShowAddButton(true);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const fetchUpdateCardDetail = async (rowId) => {
    try {
      const response = await getData(`/sage/card-group/detail/${rowId}`);

      const { data } = response;
      if (data) {
        setDetailApiData(data?.data ? data.data : []);
        setShowModal(true);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  const UserPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );

  const isEditPermissionAvailable =
    UserPermissions?.includes("cardgroup-update");
  const isAddPermissionAvailable =
    UserPermissions?.includes("cardgroup-update");
  const isDeletePermissionAvailable =
    UserPermissions?.includes("cardgroup-delete");

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      //  width: "10%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Card Group",
      selector: (row) => [row.name],
      sortable: false,
      //  width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block ">
            <h6 className="mb-0 fs-14 fw-semibold">{row.name}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Cards",
      selector: (row) => [row.name],
      sortable: false,
      //  width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6
              className="mb-0 fs-14 fw-semibold "
              style={{ cursor: "pointer" }}
              onClick={() => fetchUpdateCardDetail(row.id)}
            >
              <AiOutlineEye size={24} />
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      center: true,
      //  width: "30%",
      cell: (row) => (
        <span className="text-center d-flex justify-content-center gap-1 flex-wrap">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/card-group/${row.id}`}
                className="btn btn-primary btn-sm rounded-11 mobile-btn p-2 me-2 responsive-btn"
              >
                <i className="ph ph-pencil" />
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11 mobile-btn p-2 responsive-btn"
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
    if (values?.company_id) {
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
      <div className="page-header ">
        <div>
          <h1 className="page-title">Card Group</h1>
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
              Card Group
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <CardGroupCenterModal
        showModal={showModal}
        setShowModal={setShowModal}
        detailApiData={detailApiData}
      />

      <>
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
      </>

      <Row className=" row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3 className="card-title">Card Group</h3>

              <div className="ms-auto pageheader-btn  d-flex align-items-center">
                <div className="input-group">
                  {isAddPermissionAvailable && showAddButton ? (
                    <Link
                      to={`/add-group`}
                      className="btn btn-primary ms-2"
                      style={{ borderRadius: "4px" }}
                    >
                      Add Card
                      <i className="ph ph-plus ms-1 ph-plus-icon ph-sm-icon ph-sm-icon" />
                    </Link>
                  ) : null}
                </div>
              </div>
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
  );
};

export default withApi(CardGroup);
