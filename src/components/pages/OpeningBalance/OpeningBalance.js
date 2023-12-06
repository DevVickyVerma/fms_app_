import React, { useEffect, useState } from 'react'
import withApi from '../../../Utils/ApiHelper'
import Loaderimg from '../../../Utils/Loader';
import { Breadcrumb, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ErrorAlert } from '../../../Utils/ToastUtils';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const OpeningBalance = ({ isLoading, getData }) => {
    const [data, setData] = useState(); const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePage, setHasMorePages] = useState("");
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [total, setTotal] = useState(0);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchOpeningBalanceList()
    }, [currentPage]);


    const [permissionsArray, setPermissionsArray] = useState([]);
    const UserPermissions = useSelector((state) => state?.data?.data);
    useEffect(() => {
        if (UserPermissions) {
            setPermissionsArray(UserPermissions.permissions);
        }
    }, [UserPermissions]);
    const isAddPermissionAvailable = permissionsArray?.includes("opening-create");
    const isDeletePermissionAvailable = permissionsArray?.includes(
        "opening-delete"
    );
    const isEditPermissionAvailable = permissionsArray?.includes(
        "opening-edit"
    );
    const { id } = useParams();

    const navigate = useNavigate();
    // const ErrorAlert = (message) => toast.error(message);


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
                            "site/opening-balance/delete",
                            formData
                        );
                        setData(response.data.data);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your item has been deleted.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        fetchOpeningBalanceList();
                    } catch (error) {
                        handleError(error);
                    } finally {
                    }
                    // setIsLoading(false);
                };
                DeleteRole();
            }
        });
    };

    function handleError(error) {
        if (error.response && error.response.status === 401) {
            navigate("/login");
            ErrorAlert("Invalid access token");
            localStorage.clear();
        } else if (error.response && error.response.data.status_code === "403") {
            navigate("/errorpage403");
        } else {
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message.join(" ")
                : error.response.data.message;
            ErrorAlert(errorMessage);
        }
    }

    const fetchOpeningBalanceList = async () => {
        try {
            const response = await getData(`/site/opening-balance/list?site_id=${id}&page=${currentPage}`);
            if (response && response.data) {
                setData(response?.data?.data?.balances);
                setCount(response.data.data.count);
                setCurrentPage(response?.data?.data?.currentPage);
                setHasMorePages(response?.data?.data?.hasMorePages);
                setLastPage(response?.data?.data?.lastPage);
                setPerPage(response?.data?.data?.perPage);
                setTotal(response?.data?.data?.total);
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            handleError(error); // Set the submission state to false if an error occurs
        }
    }

    const columns = [
        {
            name: "Balance Type",
            selector: (row) => [row?.opening_balance_type],
            sortable: true,
            width: "12.5%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row?.opening_balance_type}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Opening Balance",
            selector: (row) => [row?.opening_balance],
            sortable: true,
            width: "12.5%",
            cell: (row, index) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row?.opening_balance}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "LOOMIS OPENING BALANCE",
            selector: (row) => [row?.opening_balance_loomis],
            sortable: true,
            width: "12.5%",
            cell: (row, index) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row?.opening_balance_loomis}</h6>
                    </div>
                </div>
            ),
        },


        {
            name: "LOOMIS UNDER/OVER BALANCE",
            selector: (row) => [row?.opening_balance_ou_loomis],
            sortable: true,
            width: "12.5%",
            cell: (row, index) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row?.opening_balance_ou_loomis}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "BANK UNDER/OVER BALANCE",
            selector: (row) => [row?.opening_balance_ou_bank],
            sortable: false,
            width: "12.5%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row?.opening_balance_ou_bank}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "CLOSING BALANCE ADJUSTMENT",
            selector: (row) => [row?.closing_balance_adjustment],
            sortable: false,
            width: "12.5%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row?.closing_balance_adjustment}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: " OPENING BALANCE DATE",
            selector: (row) => [row?.opening_balance_date],
            sortable: false,
            width: "12.5%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row?.opening_balance_date}</h6>
                    </div>
                </div>
            ),
        },

        {
            name: "Action",
            selector: (row) => [row?.action],
            sortable: false,
            width: "12.5%",
            cell: (row) => (
                <span className="text-center">
                    {isEditPermissionAvailable ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Link
                                to={`/edit-opening-balance/${row?.id}`}
                                className="btn btn-primary btn-sm rounded-11 me-2"
                            >
                                <i>
                                    <svg
                                        className="table-edit"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        width="16"
                                    >
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                                    </svg>
                                </i>
                            </Link>
                        </OverlayTrigger>
                    ) : null}
                    {isDeletePermissionAvailable ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Link
                                to="#"
                                className="btn btn-danger btn-sm rounded-11"
                                onClick={() => handleDelete(row?.id)}
                            >
                                <i>
                                    <svg
                                        className="table-delete"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        width="16"
                                    >
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                                    </svg>
                                </i>
                            </Link>
                        </OverlayTrigger>
                    ) : null}
                </span>
            ),
        },
    ];


    const tableDatas = {
        columns,
        data,
    };


    const maxPagesToShow = 5; // Adjust the number of pages to show in the center
    const pages = [];

    // Calculate the range of pages to display
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, lastPage);

    // Handle cases where the range is near the beginning or end
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    // Render the pagination items
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => handlePageChange(i)}
            >
                {i}
            </Pagination.Item>
        );
    }

    // Add ellipsis if there are more pages before or after the displayed range
    if (startPage > 1) {
        pages.unshift(<Pagination.Ellipsis key="ellipsis-start" disabled />);
    }

    if (endPage < lastPage) {
        pages.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
    }


    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div>
                <div className="page-header d-flex">
                    <div>
                        <h1 className="page-title">Opening Balance </h1>
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
                                sites
                            </Breadcrumb.Item>
                            <Breadcrumb.Item
                                className="breadcrumb-item active breadcrumds"
                                aria-current="page"
                            >
                                Opening Balance
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="ms-auto pageheader-btn">
                        <div className="input-group">
                            {isAddPermissionAvailable ? (
                                <Link
                                    to={`/add-opening-balance/${id}`}
                                    className="btn btn-primary ms-2"
                                    style={{ borderRadius: "4px" }}
                                >
                                    Add Opening Balance  <AddCircleOutlineIcon />
                                </Link>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>


                <Row className=" row-sm">
                    <Col lg={12} md={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">Opening Balance </h3>
                            </Card.Header>
                            <Card.Body>
                                {data?.length > 0 ? (
                                    <>
                                        <div className="table-responsive deleted-table">
                                            <DataTableExtensions {...tableDatas}>
                                                <DataTable
                                                    columns={columns}
                                                    data={data}
                                                    noHeader
                                                    defaultSortField="id"
                                                    defaultSortAsc={false}
                                                    striped={true}
                                                    center={true}
                                                    persistTableHead
                                                    highlightOnHover
                                                    className=' overflow-hidden'
                                                    style={{ overflow: "hidden" }}


                                                />
                                            </DataTableExtensions>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={require("../../../assets/images/noDataFoundImage/noDataFound.jpg")}
                                            alt="MyChartImage"
                                            className="all-center-flex nodata-image"
                                        />
                                    </>
                                )}
                            </Card.Body>
                            <Card.Footer>
                                {data?.length > 0 ? (
                                    <>
                                        <div style={{ float: "right" }}>
                                            <Pagination>
                                                <Pagination.First onClick={() => handlePageChange(1)} />
                                                <Pagination.Prev
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                />
                                                {pages}
                                                <Pagination.Next
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === lastPage}
                                                />
                                                <Pagination.Last
                                                    onClick={() => handlePageChange(lastPage)}
                                                />
                                            </Pagination>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>


            </div>


        </>
    )
}

export default withApi(OpeningBalance);