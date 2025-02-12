import React, { useEffect, useState } from 'react'
import { Breadcrumb, Card, Col, OverlayTrigger, Row, Toast, Tooltip } from 'react-bootstrap'
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
import { Bounce, toast } from 'react-toastify'

const CardReconciliation = (props) => {
    const { isLoading, getData, postData } = props;
    const [clientIDLocalStorage, setclientIDLocalStorage] = useState(localStorage.getItem("superiorId"));

    let storedKeyName = "localFilterModalData";
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
            uploadedFiles: [],
            range_start_date: null, // Renamed start date field
            range_end_date: null, // Renamed end date field
        },
        validationSchemaForCustomInput,
        onSubmit: (values) => {

            console.log(values, "validationSchemaForCustomInput");


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
                        <h6 className="mb-0 fs-14 fw-semibold">{parseFloat(row.total_price_till).toFixed(3)}</h6>
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
            name: "Credit Card Details",
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
            name: "Action",
            selector: (row) => [row.price_difference],
            sortable: false,
            width: "15%",
            cell: (row) => (
                <span className="text-muted fs-15 fw-semibold">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Difference</Tooltip>}>
                        <span>
                            {row.price_difference !== 0 ? (
                                <button onClick={() => handleCardClick(row)} className="btn btn-danger btn-sm">
                                    Check Difference
                                </button>
                            ) : (
                                <button className="btn btn-success btn-sm" disabled>
                                    Check Difference
                                </button> // Disabled button when price_difference is 0
                            )}



                        </span>
                    </OverlayTrigger>
                </span>

            ),
        },

    ];

    const SuccessToast = (message) => {
        toast.error(message, {
            // // position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            transition: Bounce,
            autoClose: 2000,
            theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
        });
    };
    const handleSubmit = async (files) => {

        if (files && files.length > 0) {

            const validTypes = ["application/pdf", "text/csv"];
            const invalidFiles = files.filter(file => !validTypes.includes(file.type));

            if (invalidFiles?.length > 0) {

                // Show alert if invalid file types are found
                SuccessToast("Only CSV and PDF files are allowed.");
                return; // Prevent form submission if invalid files are present
            }


            try {
                const formData = new FormData();

                // Append site_id to the FormData
                formData.append("site_id", filters?.site_id);

                // Append each file to formData
                files.forEach((file) => {
                    formData.append("file[]", file); // Append each file as 'csv_file'
                });

                // Define the endpoint for uploading
                const postDataUrl = "/credit-card/upload-bank-transcation";

                // Call the API with the FormData containing the files
                const response = await postData(postDataUrl, formData); // Make the API request

                console.log(response, "response"); // Log the response if needed
            } catch (error) {
                console.error("Error uploading files:", error); // Log the error if an issue occurs
            }
        } else {
            console.log("No files selected to upload."); // If no files are provided
        }
    };

    return (
        <>
            {isLoading ? <LoaderImg /> : null}

            {showCeoDetailModal && (
                <>
                    <TitanDetailModal
                        title="Card Reconciliation Details"
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
                        <h1 className="page-title">Credit Card</h1>
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
                                Credit Card
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
                                showFileUpload={true}
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
                                    <h3 className="card-title">     Credit Card </h3>
                                    <div className="m-0 mt-sm-0 hcenter">
                                        <SearchBar
                                            onSearch={handleSearch}
                                            onReset={handleReset}
                                            hideReset={searchTerm}
                                        />
                                        {data?.length > 0 ? <form onSubmit={formik.handleSubmit}>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Upload Files
                                                    {formik.values.uploadedFiles.length > 0 && (
                                                        <div className="mt-2">

                                                            <ul>
                                                                {formik.values.uploadedFiles.map((file, index) => (
                                                                    <li key={index}>{file.name}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                </Tooltip>} // Tooltip Text
                                            >
                                                <div className="file-upload-icon m-0">
                                                    <label
                                                        htmlFor="file-upload"
                                                        style={{ margin: "0px" }}
                                                        className="btn btn-outline-primary"
                                                    >
                                                        <i className="fa fa-upload"></i> {/* FontAwesome Upload Icon */}
                                                        {formik.values.uploadedFiles.length > 0 && (
                                                            <span className="badge bg-danger">
                                                                {formik.values.uploadedFiles?.length}
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        multiple
                                                        className="d-none"
                                                        onChange={async (event) => {
                                                            const files = Array.from(event.target.files);
                                                            formik.setFieldValue("uploadedFiles", files);
                                                            handleSubmit(files);

                                                        }}
                                                    />
                                                </div>
                                            </OverlayTrigger>

                                            {/* Show uploaded file names */}

                                        </form> : ""}


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
