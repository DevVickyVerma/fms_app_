import React from "react";
import { useEffect, useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import { Breadcrumb, Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from "formik";
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

const FuturePriceLogs = (props) => {
    const { isLoading, getData, postData, apidata } = props;
    const [data, setData] = useState();
    const [selectedCompanyList, setSelectedCompanyList] = useState([]);
    const [selectedSiteList, setSelectedSiteList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [SelectedRow, setSelectedRow] = useState(false);
    const [myFormData, setMyFormData] = useState({
        client_id: "",
        company_id: "",
        site_id: "",
        start_date: "",
    });
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [ClientList, setClientList] = useState([]);
    const [CompanyList, setCompanyList] = useState([]);
    const [SiteList, setSiteList] = useState([]);
    const [handleListingCondition, setHandleListingCondition] = useState(false);
    const UserPermissions = useSelector(
        (state) => state?.data?.data?.permissions || [],
    );
    const isFuelPriceCancelPermissionAvailable = UserPermissions?.includes('fuel-price-cancel');
    const isFuelPricePermissionAvailable = UserPermissions?.includes('fuel-price-update');

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
                        const response = await postData("fuel-price/history/cancel", formData);


                        console.log(response, "response");

                        if (apidata.api_response === "success") {
                            handleFetchListing();
                        }
                    } catch (error) {
                        handleError(error);
                    }
                };
                DeleteClient(formData);
            }
        });
    };


    const handleFetchListing = async () => {


        const formattedStartDate = moment(formik?.values?.startDate).format('DD-MM-YYYY');
        const formattedEndDate = moment(formik?.values?.endDate).format('DD-MM-YYYY');

        let customDateRange = '';
        if (formik?.values?.startDate && formik?.values?.endDate) {
            customDateRange += `${formattedStartDate}/${formattedEndDate}`;
        }


        // Function to build query parameters
        const buildQueryParams = (params) => {
            return Object.entries(params)
                .filter(([key, value]) => value !== undefined && value !== null && value !== '') // filter out undefined, null, and empty values
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
        };

        const params = {
            client_id: formik.values?.client_id,
            company_id: formik.values?.company_id,
            site_id: formik.values?.site_id,
            daterange: customDateRange,
            page: currentPage,
        };

        const queryString = buildQueryParams(params);


        try {
            const response = await getData(
                `/fuel-price/history?${queryString}`
            );

            if (response && response.data && response.data.data) {
                const responseData = response.data.data;
                setData(responseData.history);
                setCurrentPage(response?.data?.data?.currentPage || 1);
                setLastPage(response?.data?.data?.lastPage || 1);
                setHandleListingCondition(false)
            } else {
                setHandleListingCondition(false)
                throw new Error("No data available in the response");
            }
        } catch (error) {
            console.error("API error:", error);
        }

        setHandleListingCondition(false)
    };
    const handleSubmit1 = async (values) => {
        setMyFormData({
            client_id: values.client_id,
            company_id: values.company_id,
            site_id: values.site_id,
            start_date: values.start_date,
        });


        const formattedStartDate = moment(values?.startDate).format('DD-MM-YYYY');
        const formattedEndDate = moment(values?.endDate).format('DD-MM-YYYY');

        // Construct custom date range string

        let customDateRange = '';
        if (values?.startDate && values?.endDate) {
            customDateRange += `${formattedStartDate}/${formattedEndDate}`;
        }



        // Function to build query parameters
        const buildQueryParams = (params) => {
            return Object.entries(params)
                .filter(([key, value]) => value !== undefined && value !== null && value !== '') // filter out undefined, null, and empty values
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
        };

        const params = {
            client_id: values?.client_id,
            company_id: values?.company_id,
            site_id: values?.site_id,
            daterange: customDateRange,
            page: currentPage,
        };

        const queryString = buildQueryParams(params);

        try {
            const response = await getData(
                `/fuel-price/history?${queryString}`
            );

            if (response && response.data && response.data.data) {
                setData(response?.data?.data?.history);
                setCurrentPage(response?.data?.data?.currentPage || 1);
                setLastPage(response?.data?.data?.lastPage || 1);
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };


    const handleErrorModal = (row) => {
        console.log(row, "row");
        setShowModal(true)
        setSelectedRow(row)
    }


    useEffect(() => {
        handleFetchListing();
        console.clear();
    }, [currentPage]);


    useEffect(() => {
        const futurepriceLog = JSON.parse(localStorage.getItem('futurepriceLog'));
        if (futurepriceLog) {
            formik.setFieldValue('client_id', futurepriceLog.client_id);
            formik.setFieldValue('company_id', futurepriceLog.company_id);
            formik.setFieldValue('site_id', futurepriceLog.site_id);

            if (futurepriceLog?.startDate && futurepriceLog?.endDate) {
                formik.setFieldValue('startDate', new Date(futurepriceLog?.startDate));
                formik.setFieldValue('endDate', new Date(futurepriceLog?.endDate));
            }
            GetCompanyList(futurepriceLog.client_id);
            GetSiteList(futurepriceLog.company_id)
            handleSubmit1(futurepriceLog);
        }
    }, []);


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
                                ></i>
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


    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
            site_id: "",
            startDate: null,
            endDate: null,
        },
        onSubmit: (values) => {
            localStorage.setItem('futurepriceLog', JSON.stringify(values));
            handleSubmit1(values);
        },
    });

    const fetchCommonListData = async () => {
        try {
            const response = await getData("/common/client-list");

            const { data } = response;
            if (data) {
                setClientList(response.data);

                const clientId = localStorage.getItem("superiorId");
                if (clientId) {
                    setSelectedClientId(clientId);
                    setSelectedCompanyList([]);

                    if (response?.data) {
                        const selectedClient = response?.data?.data?.find(
                            (client) => client.id === clientId
                        );
                        if (selectedClient) {
                            setSelectedCompanyList(selectedClient?.companies);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const GetCompanyList = async (values) => {
        try {
            if (values) {
                const response = await getData(
                    `common/company-list?client_id=${values}`
                );

                if (response) {

                    setCompanyList(response?.data?.data);
                } else {
                    throw new Error("No data available in the response");
                }
            } else {
                console.error("No site_id found ");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const GetSiteList = async (values) => {
        try {
            if (values) {
                const response = await getData(`common/site-list?company_id=${values}`);

                if (response) {

                    setSiteList(response?.data?.data);
                } else {
                    throw new Error("No data available in the response");
                }
            } else {
                console.error("No site_id found ");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    useEffect(() => {
        const clientId = localStorage.getItem("superiorId");

        if (localStorage.getItem("superiorRole") !== "Client") {
            fetchCommonListData()
        } else {
            setSelectedClientId(clientId);
            GetCompanyList(clientId)
        }
    }, []);
    const hadndleShowDate = () => {
        const inputDateElement = document.querySelector('input[type="date"]');
        inputDateElement.showPicker();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const initialValues = {
        client_id: "",
        company_id: "",
        site_id: "",
        start_date: "",
    };




    const handleClearForm = async (resetForm) => {
        setMyFormData(initialValues);
        formik.setFieldValue("site_id", "")
        formik.setFieldValue("start_date", "")
        formik.setFieldValue("client_id", "")
        formik.setFieldValue("company_id", "")
        formik.setFieldValue("endDate", "")
        formik.setFieldValue("startDate", "")
        formik.resetForm()
        setSelectedSiteList([]);
        setSelectedCompanyList([]);
        setSelectedClientId("");
        setHandleListingCondition(true)

        localStorage.removeItem("futurepriceLog")

        let empty = {
            "client_id": "",
            "company_id": "",
            "site_id": "",
            "startDate": "",
            "endDate": ""
        }

        handleSubmit1(empty)
        const clientId = localStorage.getItem("superiorId");

        if (localStorage.getItem("superiorRole") !== "Client") {
            fetchCommonListData();
        } else {
            formik.setFieldValue("client_id", clientId);
            setSelectedClientId(clientId);
            GetCompanyList(clientId);
        }

    };




    const handleDateChange = (dates) => {
        formik.setFieldValue('startDate', dates[0]);
        formik.setFieldValue('endDate', dates[1]);
    };

    const handleLinkClick = () => {
        navigate('/fuelprice');
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
                            <Card.Body>
                                <form onSubmit={formik.handleSubmit}>
                                    <Card.Body>
                                        <Row>
                                            {localStorage.getItem("superiorRole") !== "Client" && (
                                                <Col lg={3} md={3}>
                                                    <div className="form-group">
                                                        <label
                                                            htmlFor="client_id"
                                                            className="form-label mt-4"
                                                        >
                                                            Client
                                                        </label>
                                                        <select
                                                            className={`input101 ${formik.errors.client_id &&
                                                                formik.touched.client_id
                                                                ? "is-invalid"
                                                                : ""
                                                                }`}
                                                            id="client_id"
                                                            name="client_id"
                                                            value={formik.values.client_id}
                                                            onChange={(e) => {
                                                                const selectedType = e.target.value;


                                                                if (selectedType) {
                                                                    GetCompanyList(selectedType);
                                                                    formik.setFieldValue("client_id", selectedType);
                                                                    setSelectedClientId(selectedType);
                                                                    setSiteList([]);
                                                                    formik.setFieldValue("company_id", "");
                                                                    formik.setFieldValue("site_id", "");
                                                                } else {
                                                                    formik.setFieldValue("client_id", "");
                                                                    formik.setFieldValue("company_id", "");
                                                                    formik.setFieldValue("site_id", "");

                                                                    setSiteList([]);
                                                                    setCompanyList([]);
                                                                }
                                                            }}
                                                        >
                                                            <option value="">Select a Client</option>
                                                            {ClientList.data && ClientList.data.length > 0 ? (
                                                                ClientList.data.map((item) => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.client_name}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option disabled>No Client</option>
                                                            )}
                                                        </select>

                                                        {formik.errors.client_id &&
                                                            formik.touched.client_id && (
                                                                <div className="invalid-feedback">
                                                                    {formik.errors.client_id}
                                                                </div>
                                                            )}
                                                    </div>
                                                </Col>
                                            )}

                                            <Col lg={3} md={3}>
                                                <div className="form-group">
                                                    <label htmlFor="company_id" className="form-label mt-4">
                                                        Company

                                                    </label>
                                                    <select
                                                        className={`input101 ${formik.errors.company_id &&
                                                            formik.touched.company_id
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="company_id"
                                                        name="company_id"
                                                        value={formik.values.company_id}
                                                        onChange={(e) => {
                                                            const selectcompany = e.target.value;

                                                            if (selectcompany) {
                                                                GetSiteList(selectcompany);
                                                                formik.setFieldValue("company_id", selectcompany);
                                                                formik.setFieldValue("site_id", "");
                                                                setSelectedCompanyId(selectcompany);
                                                            } else {
                                                                formik.setFieldValue("company_id", "");
                                                                formik.setFieldValue("site_id", "");

                                                                setSiteList([]);
                                                            }
                                                        }}
                                                    >
                                                        <option value="">Select a Company</option>
                                                        {selectedClientId && CompanyList.length > 0 ? (
                                                            <>
                                                                setSelectedCompanyId([])
                                                                {CompanyList.map((company) => (
                                                                    <option key={company.id} value={company.id}>
                                                                        {company.company_name}
                                                                    </option>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <option disabled>No Company</option>
                                                        )}
                                                    </select>
                                                    {formik.errors.company_id &&
                                                        formik.touched.company_id && (
                                                            <div className="invalid-feedback">
                                                                {formik.errors.company_id}
                                                            </div>
                                                        )}
                                                </div>
                                            </Col>

                                            <Col lg={3} md={3}>
                                                <div className="form-group">
                                                    <label htmlFor="site_id" className="form-label mt-4">
                                                        Site Name

                                                    </label>
                                                    <select
                                                        className={`input101 ${formik.errors.site_id && formik.touched.site_id
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="site_id"
                                                        name="site_id"
                                                        value={formik.values.site_id}
                                                        onChange={(e) => {
                                                            const selectedsite_id = e.target.value;

                                                            formik.setFieldValue("site_id", selectedsite_id);
                                                            setSelectedSiteId(selectedsite_id);
                                                        }}
                                                    >
                                                        <option value="">Select a Site</option>
                                                        {CompanyList && SiteList.length > 0 ? (
                                                            SiteList.map((site) => (
                                                                <option key={site.id} value={site.id}>
                                                                    {site.site_name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option disabled>No Site</option>
                                                        )}
                                                    </select>
                                                    {formik.errors.site_id && formik.touched.site_id && (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.site_id}
                                                        </div>
                                                    )}
                                                </div>
                                            </Col>

                                            <Col lg={3} md={6}>
                                                <div className="form-group">
                                                    <label
                                                        htmlFor="start_date"
                                                        className="form-label mt-4"
                                                    >
                                                        Select Date Range
                                                    </label>
                                                    <DatePicker
                                                        selected={formik.values.startDate}
                                                        startDate={formik.values.startDate}
                                                        endDate={formik.values.endDate}
                                                        onChange={handleDateChange}
                                                        selectsRange
                                                        dateFormat="yyyy-MM-dd"
                                                        isClearable
                                                        placeholderText="Select Date Range"
                                                        autoComplete="off"
                                                        className='input101 '
                                                    />
                                                    {formik.errors.start_date &&
                                                        formik.touched.start_date && (
                                                            <div className="invalid-feedback">
                                                                {formik.errors.start_date}
                                                            </div>
                                                        )}
                                                </div>
                                            </Col>

                                        </Row>
                                    </Card.Body>
                                    <Card.Footer className="text-end">
                                        <button
                                            className="btn btn-danger me-2"
                                            type="button" // Set the type to "button" to prevent form submission
                                            onClick={() => handleClearForm()} // Call a function to clear the form
                                        >
                                            Clear
                                        </button>
                                        <button className="btn btn-primary me-2" type="submit">
                                            Submit
                                        </button>

                                    </Card.Footer>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className=" row-sm">
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                {/* <h3 className="card-title"> </h3> */}
                                <div className=" d-flex w-100 justify-content-between align-items-center  card-title w-100 ">
                                    <span>
                                        Future Price Logs
                                    </span>

                                    {isFuelPricePermissionAvailable && (<>
                                        <Button className="btn btn-primary btn-icon text-white me-3" onClick={handleLinkClick}>
                                            <span>
                                            </span>
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
                                                noHeader
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