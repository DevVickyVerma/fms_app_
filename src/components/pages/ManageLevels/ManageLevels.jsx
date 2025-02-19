import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import {
  Breadcrumb,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import Loaderimg from "../../../Utils/Loader";
import CustomPagination from "../../../Utils/CustomPagination";
import SearchBar from "../../../Utils/SearchBar";
import useCustomDelete from "../../../Utils/useCustomDelete";
import useToggleStatus from "../../../Utils/useToggleStatus";
import { ReactSortable } from "react-sortablejs";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

const ManageLevels = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };
  const { customDelete } = useCustomDelete();
  const { toggleStatus } = useToggleStatus();

  const handleDelete = (id) => {
    const formData = new FormData();
    formData.append("id", id);
    customDelete(postData, "level/delete", formData, handleSuccess);
  };

  const toggleActive = (row) => {
    const formData = new FormData();
    formData.append("id", row.id.toString());
    formData.append("status", (row.status === 1 ? 0 : 1).toString());
    toggleStatus(postData, "/level/update-status", formData, handleSuccess);
  };

  const handleSuccess = () => {
    handleFetchData();
  };

  useEffect(() => {
    handleFetchData();
  }, [searchTerm, currentPage]);

  const handleFetchData = async () => {
    try {
      let apiUrl = `/level/list?page=${currentPage}`;
      if (searchTerm) {
        apiUrl += `&keyword=${searchTerm}`;
      }
      const response = await getData(apiUrl);

      if (response && response.data && response.data.data) {
        setData(response.data.data?.levels);

        setCurrentPage(response.data.data?.currentPage || 1);
        setLastPage(response.data.data?.lastPage || 1);
      } else {
        throw new Error("No data available in the response");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);

  const isEditPermissionAvailable = permissionsArray?.includes("level-edit");
  const isAddonPermissionAvailable =
    permissionsArray?.includes("addons-assign");
  const isAddPermissionAvailable = permissionsArray?.includes("level-create");
  const isDeletePermissionAvailable =
    permissionsArray?.includes("level-delete");
  const isstatusPermissionAvailable = permissionsArray?.includes(
    "level-change-status"
  );

  const columns = [
    {
      name: "Sr. No.",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "8%",
      center: false,
      cell: (row, index) => (
        <span className="text-muted fs-15 fw-semibold text-center">
          {index + 1}
        </span>
      ),
    },
    {
      name: "Level Name",
      selector: (row) => [row?.name],
      sortable: false,
      width: "30%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-flex">
            <h6 className="mb-0 fs-14 fw-semibold wrap-text">
              {row?.name}

              {row?.is_final === 1 ? (
                <>
                  <i className="ph ph-check-circle c-fs-18 ms-2 c-top-3"></i>
                </>
              ) : (
                ""
              )}
            </h6>
          </div>
        </div>
      ),
    },
    {
      name: "Sort Order",
      selector: (row) => [row?.sort_order],
      sortable: false,
      width: "24%",
      cell: (row) => (
        <div className="d-flex">
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold">{row?.sort_order}</h6>
          </div>
        </div>
      ),
    },
    {
      name: "Created Date",
      selector: (row) => [row.created_date],
      sortable: false,
      width: "14%",
      cell: (row) => (
        <div
          className="d-flex"
          style={{ cursor: "default" }}
          // onClick={() => handleToggleSidebar(row)}
        >
          <div className="ms-2 mt-0 mt-sm-2 d-block">
            <h6 className="mb-0 fs-14 fw-semibold ">{row.created_date}</h6>
          </div>
        </div>
      ),
    },

    {
      name: "Action",
      selector: (row) => [row.action],
      sortable: false,
      width: "20%",
      cell: (row) => (
        <span className="text-center d-flex justify-content-center gap-1 flex-wrap">
          {isEditPermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <Link
                to={`/manage-levels/edit-level/${row.id}`}
                className="btn btn-primary btn-sm rounded-11 me-2 responsive-btn"
              >
                <i className="ph ph-pencil" />
              </Link>
            </OverlayTrigger>
          ) : null}
          {isDeletePermissionAvailable ? (
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Link
                to="#"
                className="btn btn-danger btn-sm rounded-11 responsive-btn"
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

  const handleSortEnd = (evt) => {
    const { oldIndex, newIndex } = evt;

    // Check if oldIndex and newIndex are within bounds
    if (
      oldIndex >= 0 &&
      newIndex >= 0 &&
      oldIndex < data.length &&
      newIndex < data.length
    ) {
      // Clone the data array to avoid mutating the state directly
      const updatedData = [...data];

      // Perform the swap in the local array
      // [updatedData[oldIndex], updatedData[newIndex]] = [updatedData[newIndex], updatedData[oldIndex]];

      // Immediately update the state with the swapped data
      // setData(updatedData);

      // Now you have the latest updated data instantly

      // Prepare the payload with the moved item's id and the new index (destination)
      const payload = {
        id: updatedData[newIndex]?.id, // Use the new index to reflect the moved item
        destination: newIndex,
      };

      Swal.fire({
        title: "Are you sure?",
        html: `You are about to move <strong>"${updatedData?.[oldIndex]?.name}"</strong> from position ${oldIndex + 1} to position ${newIndex + 1}. Do you want to proceed?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Swap it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let postDataUrl = "/level/sort";
            const formData = new FormData();
            [updatedData[oldIndex], updatedData[newIndex]] = [
              updatedData[newIndex],
              updatedData[oldIndex],
            ];

            // Append all the IDs in the updated order to formData
            updatedData.forEach((item, index) => {
              formData.append(`level_id[${index}]`, item.id); // Store all the ids in formData
            });

            // console.log(updatedData, "updatedData");

            const response = await postData(postDataUrl, formData); // Make your API call here
            if (response.api_response === "success") {
              handleSuccess(); // Handle success after API approval
              setData(updatedData); // Only update the state if the swap is successful
            }
          } catch (error) {
            console.error(error);
            // handleError(error); // Handle errors if the API fails
          }
        } else {
          handleFetchData();
        }
      });
    } else {
      console.error("Invalid indices for sorting:", { oldIndex, newIndex });
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <>
        <div className="page-header d-flex flex-wrap">
          <div className="mb-2 mb-sm-0">
            <h1 className="page-title">Manage Levels</h1>
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
                Manage Levels
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="">
            <div className="input-group">
              {isAddPermissionAvailable ? (
                <Link
                  to="/manage-levels/add-level"
                  className="btn btn-primary "
                  style={{ borderRadius: "4px" }}
                >
                  Add Level
                  <i className="ph ph-plus ms-1 ph-plus-icon ph-sm-icon" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <Row className=" row-sm">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                  <h3 className="card-title">Manage Levels </h3>
                  <div className="mobile-head-container mt-2 mt-sm-0">
                    <SearchBar
                      onSearch={handleSearch}
                      onReset={handleReset}
                      hideReset={searchTerm}
                    />
                  </div>
                </div>
              </Card.Header>
              <Card.Body
                className="overflow-auto"
                style={{ minHeight: "550px" }}
              >
                {data?.length > 0 ? (
                  <>
                    <table className="table table-modern tracking-in-expand">
                      <thead>
                        <tr className="drag-tr">
                          <th scope="col">Level Name</th>
                          <th scope="col">Sort Order</th>
                          <th scope="col">Created Date</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <ReactSortable
                        list={data || []}
                        swap
                        tag="tbody"
                        animation={200}
                        delayOnTouchStart={true}
                        delay={2}
                        setList={setData}
                        onEnd={handleSortEnd}
                      >
                        {data?.map((item) => (
                          <tr key={item?.id} className="cursor-grab drag-tr">
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                  {item.name}

                                  {item?.is_final === 1 ? (
                                    <>
                                      <i className="ph ph-check-circle c-fs-18 ms-2 c-top-3"></i>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{item?.sort_order}</td>
                            <td>{item?.created_date}</td>
                            <td>
                              <span
                              // className="text-center d-flex justify-content-center gap-1 flex-wrap"
                              >
                                {isEditPermissionAvailable ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Edit</Tooltip>}
                                  >
                                    <Link
                                      to={`/manage-levels/edit-level/${item?.id}`}
                                      className="btn btn-primary btn-sm rounded-11 me-2 responsive-btn"
                                    >
                                      <i className="ph ph-pencil" />
                                    </Link>
                                  </OverlayTrigger>
                                ) : null}
                                {isDeletePermissionAvailable ? (
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Delete</Tooltip>}
                                  >
                                    <Link
                                      to="#"
                                      className="btn btn-danger btn-sm rounded-11 responsive-btn"
                                      onClick={() => handleDelete(item?.id)}
                                    >
                                      <i className="ph ph-trash" />
                                    </Link>
                                  </OverlayTrigger>
                                ) : null}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </ReactSortable>
                    </table>
                    {/* <div className="table-responsive deleted-table">
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
                                        </div> */}
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

export default withApi(ManageLevels);
