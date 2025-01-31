import React, { useEffect, useState } from 'react'
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import NewFilterTab from '../pages/Filtermodal/NewFilterTab'
import withApi from '../../Utils/ApiHelper'
import { useSelector } from 'react-redux'
import { handleFilterData } from '../../Utils/commonFunctions/commonFunction'
import { useFormik } from 'formik'
import * as Yup from "yup";
import LoaderImg from '../../Utils/Loader'
import { Link } from "react-router-dom";
import CustomPagination from '../../Utils/CustomPagination'
import DataTable from 'react-data-table-component'
import SearchBar from '../../Utils/SearchBar'
import NoDataComponent from '../../Utils/commonFunctions/NoDataComponent'
import moment from 'moment'
import TitanDetailModal from '../TitanDashboard/TitanDetailModal'

const CardReconciliation = (props) => {
    const { isLoading, getData, postData } = props;
    const [clientIDLocalStorage, setclientIDLocalStorage] = useState(localStorage.getItem("superiorId"));

    let storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");

    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),
        site_id: Yup.string().required("Site is required"),
        range_start_date: Yup.date()
            .nullable()
            .required("Start Date is required"),
        range_end_date: Yup.date()
            .nullable()
            .required("End Date is required")
            .min(Yup.ref("range_start_date"), "End Date cannot be before Start Date"),
    });
    const [filters, setFilters] = useState({
        client_id: "",
        company_id: "",
        site_id: "",
        start_date: "",
        range_start_date: null, // Renamed start date field
        range_end_date: null, // Renamed end date field
    });

    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
            site_id: "",
            start_date: "",
            range_start_date: null, // Renamed start date field
            range_end_date: null, // Renamed end date field
        },
        validationSchemaForCustomInput,
        onSubmit: (values) => {
            console.log(values, "values");

            GetDataWithClient(values);
        },
    });
    console.log(filters, "filters");

    const GetDataWithClient = async (values) => {

        if (!values?.site_id) return;
        if (values?.client_id && values?.company_id) {
            setFilters(values);
            console.log(values, "columnInsetApplyNavigatedex");
            setApplyNavigate(true);
        } else {
            setApplyNavigate(false);
        }
        try {
            const formData = new FormData();

            formData.append("start_date", values.start_date);


            if (localStorage.getItem("superiorRole") !== "Client") {
                formData.append("client_id", values.client_id);

            } else {
                formData.append("client_id", clientIDLocalStorage);

            }
            formData.append("company_id", values?.company_id);
            formData.append("site_id", values?.site_id);

            try {
                const formattedStartDate = moment(values?.range_start_date).format('YYYY-MM-DD');
                const formattedEndDate = moment(values?.range_end_date).format('YYYY-MM-DD');
                //

                const response = await getData(
                    `/credit-card/reconcile-data?site_id=${values?.site_id}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`
                );

                if (response && response.data && response.data.data) {
                    setData(response.data.data);

                    setCurrentPage(response.data.data?.currentPage || 1);
                    setLastPage(response.data.data?.lastPage || 1);
                } else {
                    throw new Error("No data available in the response");
                }
            } catch (error) {
                console.error("API error:", error);

            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const ReduxFullData = useSelector((state) => state?.data?.data);
    useEffect(() => {
        handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
    }, []);

    const handleApplyFilters = (values) => {
        if (values?.start_date) {
            GetDataWithClient(values)
        }

    }
    const handleClearForm = async () => {
        console.log("columnIndex");
    };
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const handleReset = () => {
        setSearchTerm("");
    };

    const [applyNavigate, setApplyNavigate] = useState(false);
    const [showCeoDetailModal, setShowCeoDetailModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const handleCloseSidebar = () => {
        setShowCeoDetailModal(false);
    };
    const handleCardClick = (cardName) => {

        if (applyNavigate && filters?.company_id) {
            console.log(cardName?.card_id, "cardName");
            formik.setFieldValue("cardID", cardName?.card_id)
            // setModalTitle(cardName);
            setShowCeoDetailModal(true);
        }
    };
    console.log(formik.values?.cardID, "cardID");
    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "10%",
            center: false,
            cell: (row, index) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {index + 1}
                </span>
            ),
        },
        {
            name: "Card Name",
            selector: (row) => [row.card_name],
            sortable: false,
            width: "20%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-flex">
                        <h6 className="mb-0 fs-14 fw-semibold wrap-text">
                            {row.card_name}
                        </h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Till Amount",
            selector: (row) => [row.total_price_till],
            sortable: false,
            width: "20%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">{row.total_price_till}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Card Amount",
            selector: (row) => [row.total_price_bank],
            sortable: false,
            width: "20%",
            cell: (row) => (
                <div className="d-flex">
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold">  {parseFloat(row.total_price_bank).toFixed(3)}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Card Reconciliation Detail",
            selector: (row) => [row.price_difference],
            sortable: false,
            width: "15%",
            cell: (row) => (
                <div
                    className="d-flex"
                    style={{ cursor: "default" }}
                // onClick={() => handleToggleSidebar(row)}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-block">
                        <h6 className="mb-0 fs-14 fw-semibold ">   {parseFloat(row.price_difference).toFixed(3)}</h6>
                    </div>
                </div>
            ),
        },
        {
            name: "Difference",
            selector: (row) => [row.price_difference],
            sortable: false,
            width: "15%",
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Difference</Tooltip>}>
                        <span>
                            {row.price_difference < 0 ? (
                                <button onClick={() => handleCardClick(row)} className="btn btn-danger btn-sm">Check Difference</button>
                            ) : row.price_difference === 0 ? (
                                <button className="btn btn-success btn-sm" disabled>Check Difference</button> // Disabled button when price_difference is 0
                            ) : row.status === 0 ? (
                                <button className="btn btn-danger btn-sm">--</button>
                            ) : (
                                <button className="badge">Unknown</button>
                            )}

                        </span>
                    </OverlayTrigger>
                </span>

            ),
        },

    ];

    return (
        <>
            {isLoading ? <LoaderImg /> : null}

            {showCeoDetailModal && (
                <>
                    <TitanDetailModal
                        title="Card Reconciliation Detail"
                        filterData={filters}
                        sidebarContent={"sidebardataobject"}
                        visible={showCeoDetailModal}
                        onClose={handleCloseSidebar}
                        cardID={formik.values?.cardID}
                    />
                </>
            )}

            <>
                <div className="page-header ">
                    <div>
                        <h1 className="page-title">Card Reconciliation</h1>
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
                                Card Reconciliation
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
                <Row>
                    <Col md={12} xl={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">Filter</h3>
                            </Card.Header>
                            <NewFilterTab
                                getData={getData}
                                isLoading={isLoading}
                                isStatic={true}
                                onApplyFilters={handleApplyFilters}
                                validationSchema={validationSchemaForCustomInput}
                                storedKeyName={storedKeyName}
                                layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                                lg="3"
                                showStationValidation={true}
                                showMonthInput={false}
                                showDateInput={false}
                                showStationInput={true}
                                showDateRangeInput={true}
                                ClearForm={handleClearForm}
                                Submittile={"Reconcil"}

                            />
                        </Card>
                    </Col>
                </Row>
                <Row className=" row-sm">
                    <Col lg={12}>
                        <Card>
                            <Card.Header>
                                <div className=" d-flex justify-content-between w-100 align-items-center flex-wrap">
                                    <h3 className="card-title">     Card Reconciliation </h3>
                                    <div className="mt-2 mt-sm-0">
                                        <SearchBar
                                            onSearch={handleSearch}
                                            onReset={handleReset}
                                            hideReset={searchTerm}
                                        />
                                    </div>
                                </div>
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
                                                responsive={true}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <NoDataComponent />
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
export default withApi(CardReconciliation);
