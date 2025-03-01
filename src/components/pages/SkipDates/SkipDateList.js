import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DatePicker from "react-multi-date-picker";
import { AiOutlineClose } from "react-icons/ai";
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { ErrorAlert } from "../../../Utils/ToastUtils";
import CustomPagination from "../../../Utils/CustomPagination";
import useErrorHandler from "../../CommonComponent/useErrorHandler";

const ManageRoles = (props) => {
  const { apidata, isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [siteName, setSiteName] = useState("");
  const { handleError } = useErrorHandler();
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("id", id);

        const axiosInstance = axios.create({
          baseURL: process.env.REACT_APP_BASE_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const DeleteRole = async () => {
          try {
            const response = await axiosInstance.post(
              "/site/skip-date/delete",
              formData
            );
            setData(response.data.data);
            Swal.fire({
              title: "Deleted!",
              text: "Your item has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
            });
            FetchmannegerList();
          } catch (error) {
            handleError(error);
          } finally {
          }
        };
        DeleteRole();
      }
    });
  };
  const { id } = useParams();

  const FetchmannegerList = async () => {
    try {
      const response = await getData(
        `/site/skip-date/list?site_id=${id}&page=${currentPage}` // Use '&' instead of '?'
      );

      if (response && response.data) {
        setData(response.data.data.skipDates);
        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
        setSiteName(response?.data?.data?.site_name);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    FetchmannegerList();
  }, [currentPage]);

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions.permissions);
    }
  }, [UserPermissions]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const isAddPermissionAvailable =
    permissionsArray?.includes("skipdate-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("skipdate-delete");

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
      name: "Skip Date",
      selector: (row) => [row.skip_date],
      sortable: false,
      //  width: "30%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.skip_date}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      //  width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row.created_date}</h6>
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
        <span className="text-center">
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

  const [showModal, setShowModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  const openModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDateSelection = (dates) => {
    setSelectedDates(dates);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert timestamps to "YYYY-MM-DD" format
    const formatted = selectedDates.map((timestamp) => {
      const date = new Date(timestamp);
      return formatDate(date);
    });

    if (formatted.length > 0) {
      try {
        // Create a new FormData object
        const formData = new FormData();

        // Append the formattedDates array to the formData
        formatted.forEach((date, index) => {
          formData.append(`skip_date[${index}]`, date);
        });
        formData.append("site_id", id);

        const response = await postData(`site/skip-date/add`, formData);

        if (response) {
        }

        // Console log the response
        if (apidata.api_response === "success") {
          handleCloseModal();
          FetchmannegerList();
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      ErrorAlert("Please select atleast one date");
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header ">
          <div>
            <h1 className="page-title">Skip Dates ({siteName})</h1>
            <Breadcrumb className="breadcrumb">
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/dashboard" }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item"
                linkAs={Link}
                linkProps={{ to: "/sites" }}
              >
                Sites
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="breadcrumb-item active breadcrumds"
                aria-current="page"
              >
                Skip Dates
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ms-auto pageheader-btn">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  //   to={`/addmanager/${id}`}
                  className="btn btn-primary ms-2"
                  style={{ borderRadius: "4px" }}
                  onClick={openModal}
                >
                  Add Skip Dates
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Skip Dates </h3>
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
        <Dialog
          open={showModal}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth={true}
          md={{ minHeight: "700px" }}
          style={{ minHeight: "700px" }}
        >
          {/* <DialogTitle
            style={{ background: "#2D8BA8", color: "#fff", padding: "8px" }}
          >
            Set Skiped Dates
          </DialogTitle> */}
          <Modal.Header
            style={{
              color: "#fff",
              background: "#2D8BA8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Modal.Title style={{ margin: "0px" }}>
                {" "}
                Set Skiped Dates ({siteName})
              </Modal.Title>
            </div>
            <div>
              <span
                className="modal-icon"
                onClick={handleCloseModal}
                style={{ cursor: "pointer" }}
              >
                <AiOutlineClose />
              </span>
            </div>
          </Modal.Header>
          <DialogContent
            style={{ marginBottom: "200px", width: "100%" }}
            md={{ minHeight: "700px" }}
          >
            <form onSubmit={handleSubmit} style={{ width: "100% !important" }}>
              <Form.Label className="form-label mt-4">
                Select Skip Dates
              </Form.Label>
              <DatePicker
                className="form-control"
                placeholder="Select Skip Dates"
                value={selectedDates}
                onChange={handleDateSelection}
                multiple={true}
                numberOfMonths={1}
                style={{ width: "100%" }}
              />
            </form>
          </DialogContent>
          <hr />
          <DialogActions>
            <button
              className="btn btn-primary me-2"
              type="submit"
              onClick={handleSubmit}
              color="primary"
            >
              {" "}
              Submit
            </button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};
export default withApi(ManageRoles);
