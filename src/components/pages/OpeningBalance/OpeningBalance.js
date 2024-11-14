import { useEffect, useState } from 'react';
import withApi from '../../../Utils/ApiHelper'
import Loaderimg from '../../../Utils/Loader';
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import CustomPagination from '../../../Utils/CustomPagination';
import useCustomDelete from '../../../Utils/useCustomDelete';
import useErrorHandler from '../../CommonComponent/useErrorHandler';

const OpeningBalance = ({ isLoading, getData, postData }) => {
    const [data, setData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [siteName, setSiteName] = useState("");
    const { id } = useParams();
    const userPermissions = useSelector((state) => state?.data?.data?.permissions || []);
    const isAddPermissionAvailable = userPermissions?.includes("opening-create");
    const isDeletePermissionAvailable = userPermissions?.includes("opening-delete");
    const isEditPermissionAvailable = userPermissions?.includes("opening-edit");
    const { handleError } = useErrorHandler();
    const { customDelete } = useCustomDelete();

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchOpeningBalanceList()
    }, [currentPage]);

    const handleDelete = (id) => {
        const formData = new FormData();
        formData.append("id", id);
        customDelete(postData, 'site/opening-balance/delete', formData, handleSuccess);
    };


    const handleSuccess = () => {
        fetchOpeningBalanceList()
    }



    const fetchOpeningBalanceList = async () => {
        try {
            const response = await getData(`/site/opening-balance/list?site_id=${id}&page=${currentPage}`);
            if (response && response.data) {
                setData(response?.data?.data?.balances);
                setCurrentPage(response.data.data?.currentPage || 1);
                setLastPage(response.data.data?.lastPage || 1);
                setSiteName(response?.data?.data?.site_name)
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
            sortable: false,
            width: "12.5%",
            cell: (row) => (
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
            sortable: false,
            width: "12.5%",
            cell: (row) => (
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
            sortable: false,
            width: "12.5%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}

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
            sortable: false,
            width: "12.5%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}

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





    return (
        <>
            {isLoading ? <Loaderimg /> : null}
            <div>
                <div className="page-header d-flex">
                    <div>
                        <h1 className="page-title">Opening Balance ({siteName})</h1>
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
                                Opening Balance
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="ms-auto pageheader-btn">
                        <div className="input-group">
                            {isAddPermissionAvailable ? (
                                <Link
                                    to={`/add-opening-balance/${siteName}/${id}`}
                                    className="btn btn-primary ms-2"
                                    style={{ borderRadius: "4px" }}
                                >
                                    Add Opening Balance  <i className="ph ph-plus ms-1 ph-plus-icon" />
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
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                noHeader={true}
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                striped={true}
                                                center={true}
                                                persistTableHead={true}
                                                highlightOnHover={true}
                                                className=' overflow-hidden'
                                                style={{ overflow: "hidden" }}
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


            </div>


        </>
    )
}

export default withApi(OpeningBalance);