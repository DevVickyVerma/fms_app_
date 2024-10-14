import { useEffect, useState } from 'react';
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import moment from "moment";
import Swal from "sweetalert2";
import { handleError } from "../../../Utils/ToastUtils";
import FuturePriceErrorModal from "./FuturePriceErrorModal";
import { useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CustomPagination from "../../../Utils/CustomPagination";
import NewFilterTab from "../Filtermodal/NewFilterTab";

const FuturePriceLogs = (props) => {
    const { isLoading, getData, postData, apidata } = props;
    const [data, setData] = useState();
    const ReduxFullData = useSelector((state) => state?.data?.data);
    const [showModal, setShowModal] = useState(false);
    const [SelectedRow, setSelectedRow] = useState(false);
    const UserPermissions = useSelector((state) => state?.data?.data?.permissions || [],);
    const isFuelPriceCancelPermissionAvailable = UserPermissions?.includes('fuel-price-cancel');
    const isFuelPricePermissionAvailable = UserPermissions?.includes('fuel-price-update');

    let storedKeyName = "localFilterModalData";
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);



    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "The request will be cancelled and the last updated price will be updated",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Cancel it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {

                const formData = new FormData();

                formData.append("id", id);


                const DeleteClient = async (formData) => {
                    try {
                        // eslint-disable-next-line no-unused-vars
                        const response = await postData("fuel-price/history/cancel", formData);

                        if (apidata.api_response === "success") {

                            const storedData = localStorage.getItem(storedKeyName);

                            if (storedData) {
                                let parsedData = JSON.parse(storedData);
                                handleSubmit1(parsedData)
                            } else {
                                handleSubmit1()
                            }
                        }
                    } catch (error) {
                        handleError(error);
                    }
                };
                DeleteClient(formData);
            }
        });
    };




    const handleErrorModal = (row) => {
        setShowModal(true)
        setSelectedRow(row)
    }







    const columns = [
        {
            name: "Site",
            selector: (row) => [row.site_name],
            sortable: false,
            width: "22%",
            cell: (row, index) => (
                <div className="d-flex future-back-color align-items-center" onClick={() => handleErrorModal(row)} style={{ backgroundColor: row?.expired }}>
                    <div className="ms-2 mt-0 mt-sm-2 d-block ">
                        <h6 className="mb-0 fs-14 fw-bold pointer">
                            <span className=" me-2">{row?.site_name}</span>
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip>
                                        {" "}
                                        Updated By :{" "}
                                        {
                                            row?.created_by
                                        }
                                        {" "}
                                        <br />
                                        Created Date :{" "}
                                        {
                                            row?.created_date
                                        }
                                        {" "}
                                        <br />
                                    </Tooltip>
                                }
                            >
                                <i
                                    className="fa fa-info-circle"
                                    aria-hidden="true"
                                />
                            </OverlayTrigger>
                        </h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Fuel",
            selector: (row) => [row?.category_name],
            sortable: false,
            width: "22%",
            cell: (row, index) => (
                <div className="d-flex future-back-color  align-items-center" style={{ background: row?.expired }}>
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row?.category_name}</h6>
                    </div>
                </div>
            ),
        },


        {
            name: "Price Requested Date/Time",
            selector: (row) => [row.price_date],
            sortable: false,
            width: "20%",
            cell: (row, index) => (
                <div className="d-flex future-back-color  align-items-center" style={{ cursor: "default", background: row?.expired }} >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">{row.price_date}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Updated Price",
            selector: (row) => [row.old_price],
            sortable: false,
            width: "14%",
            cell: (row, index) => (
                <div className="d-flex w-100 h-100 future-back-color" style={{ background: row?.expired }} >
                    <div className="ms-2 mt-0 d-flex align-items-center  w-100 h-100">
                        <h6 className="mb-0 fs-14 fw-semibold" style={{ color: row?.price_color }}>
                            <span className=" text-decoration-line-through">{row.old_price}</span>
                            <span>{row?.price_status === "UP" && <>
                                <ArrowUpwardIcon />
                            </>}</span>
                            <span>{row?.price_status === "DOWN" && <>
                                <ArrowDownwardIcon />
                            </>}</span>
                            {/* <span>{row?.price_status === "SAME" && <>
                                <ArrowRightAltIcon />
                            </>}</span> */}
                            <span className=" ms-2">{row.new_price}</span>
                        </h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Status",
            selector: (row) => [row.status],
            sortable: false,
            width: "12%",
            cell: (row, index) => (
                <span className="text-muted fs-15 fw-semibold text-center future-back-color py-2" style={{ background: row?.expired }}>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
                        {row.status === 1 ? (
                            <button
                                className="btn btn-success btn-sm"

                            >
                                Sucess
                            </button>
                        ) : row.status === 0 ? (
                            <button
                                className="btn btn-danger btn-sm"
                            >
                                Error
                            </button>
                        ) : (
                            <button
                                className="badge"

                            >
                                Unknown
                            </button>
                        )}
                    </OverlayTrigger>
                </span>
            ),
        },
        isFuelPriceCancelPermissionAvailable
            ?
            {
                name: "Action",
                selector: (row) => [row.deleted_at],
                sortable: false,
                width: "10%",
                cell: (row, index) => (
                    <div className="d-flex future-back-color" style={{ background: row?.expired }}>
                        <div className="ms-2 mt-0 mt-sm-2 d-block">
                            <h6 className="mb-0 fs-14 fw-semibold">
                                {row?.deleted_at == true ? (
                                    <></>
                                ) :
                                    <span>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Cancel</Tooltip>}>
                                            <Link
                                                to="#"
                                                className="btn btn-danger btn-sm rounded-11 responsive-btn"
                                                onClick={() => handleDelete(row.id)}
                                            >
                                                <CloseIcon />
                                            </Link>
                                        </OverlayTrigger>
                                    </span>
                                }
                            </h6>
                        </div >
                    </div >
                ),
            }

            : "",



    ];





    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const handleClearForm = async (resetForm) => {
        localStorage.removeItem(storedKeyName);
        setData(null)
        handleSubmit1()
    };

    const handleLinkClick = () => {
        navigate('/fuelprice');
    };



    useEffect(() => {
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            let parsedData = JSON.parse(storedData);
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
            const formattedStartDate = moment(filters?.range_start_date).format('DD-MM-YYYY');
            const formattedEndDate = moment(filters?.range_end_date).format('DD-MM-YYYY');
            // Construct custom date range string

            let customDateRange = '';
            if (filters?.range_start_date && filters?.range_end_date) {
                customDateRange += `${formattedStartDate}/${formattedEndDate}`;
            }

            try {
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append("client_id", client_id);
                if (company_id) queryParams.append("company_id", company_id);
                if (site_id) queryParams.append("site_id", site_id);
                if (customDateRange) queryParams.append("daterange", customDateRange);
                queryParams.append("page", currentPage);

                const queryString = queryParams.toString();
                const response = await getData(`fuel-price/history?${queryString}`);
                if (response && response.data && response.data.data) {
                    setData(response?.data?.data?.history);
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
                const response = await getData(`fuel-price/history?${queryString}`);
                if (response && response.data && response.data.data) {
                    setData(response?.data?.data?.history);
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
            <FuturePriceErrorModal
                showModal={showModal}
                setShowModal={setShowModal}
                SelectedRow={SelectedRow}
            // detailApiData={detailApiData}
            />

            {isLoading ? <Loaderimg /> : null}
            <>
                <div className="page-header ">
                    <div>
                        <h1 className="page-title"> Future Price Logs</h1>
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
                                Future Price Logs
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>


                <Row>
                    <Col md={12} xl={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title"> Future price logs </h3>
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
                                showDateInput={false}
                                showStationInput={true}
                                ClearForm={handleClearForm}
                                showDateRangeInput={true}
                            />

                        </Card>
                    </Col>
                </Row>

                <Row className=" row-sm">
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                <div className=" d-flex w-100 justify-content-between align-items-center  card-title w-100 ">
                                    <span>
                                        Future Price Logs
                                    </span>

                                    {isFuelPricePermissionAvailable && (<>
                                        <Button className="btn btn-primary btn-icon text-white me-3" onClick={handleLinkClick}>
                                            <span />
                                            Go To Fuel Price <ExitToAppIcon />
                                        </Button>
                                    </>)}
                                </div>
                            </Card.Header>

                            <Card.Body>
                                {data?.length > 0 ? (
                                    <>
                                        <div className="table-responsive deleted-table future-price-log-table">
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                noHeader={true}
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                striped={true}
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

export default withApi(FuturePriceLogs);