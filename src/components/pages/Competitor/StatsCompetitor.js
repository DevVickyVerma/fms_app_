import Loaderimg from '../../../Utils/Loader'
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import withApi from '../../../Utils/ApiHelper'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import { handleFilterData } from '../../../Utils/commonFunctions/commonFunction';
import NewFilterTab from '../Filtermodal/NewFilterTab';

const StatsCompetitor = ({ isLoading, getData }) => {
    const [data, setData] = useState();
    const [commonListLoading, setCommonListLoading] = useState(false);
    const navigate = useNavigate();
    const ReduxFullData = useSelector((state) => state?.data?.data);
    let storedKeyName = "localFilterModalData";


    useEffect(() => {
        handleClientStats();
    }, []);




    const handleClientStats = async () => {
        setCommonListLoading(true);
        try {
            const response = await getData(
                `/client/sites`
            );
            const { data } = response;
            if (data) {
                setData(data?.data);
                setCommonListLoading(false);
            }
            setCommonListLoading(false);
        } catch (error) {
            console.error("API error:", error);
        } // Set the submission state to false after the API call is completed
        setCommonListLoading(false);
    };


    const handleCompiNavigateClick = (item) => {
        let storedKeyName = "localFilterModalData";
        const storedData = localStorage.getItem(storedKeyName);

        if (storedData) {
            let updatedStoredData = JSON.parse(storedData);

            updatedStoredData.site_id = item?.id; // Update the site_id here
            updatedStoredData.site_name = item?.site_name; // Update the site_id here

            localStorage.setItem(storedKeyName, JSON.stringify(updatedStoredData));
        }
        navigate(`/sitecompetitor/${item?.id}`);
    };

    const columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => index + 1,
            sortable: false,
            width: "15%",
            center: true,
            cell: (row, index) => (
                <span className="text-muted fs-15 fw-semibold text-center">
                    {index + 1}
                </span>
            ),
        },
        {
            name: "Site Name",
            selector: (row) => [row?.site_name],
            sortable: false,
            width: "85%",
            cell: (row, index) => (
                <div

                    onClick={() => handleCompiNavigateClick(row)}
                    // to={`/sitecompetitor/${row.id}`}
                    className="d-flex"
                    style={{ cursor: "pointer" }}
                >
                    <div className="ms-2 mt-0 mt-sm-2 d-flex align-items-center">
                        <span>
                            <img
                                src={row?.supplierImage}
                                alt="supplierImage"
                                className="w-5 h-5 "
                            />
                        </span>
                        <h6 className="mb-0 fs-14 fw-semibold ms-2"> {row?.site_name}</h6>
                    </div>
                </div>

            ),
        },
    ];
    const role = localStorage.getItem("role");



    const GetSiteList = async (values) => {
        try {
            if (values) {
                const response = await getData(`common/site-list?company_id=${values}`);

                if (response) {
                    setData(response?.data?.data);
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




    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),
    });



    const handleApplyFilters = ((values) => {
        if (!values?.start_date) {
            // If start_date does not exist, set it to the current date
            const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
            values.start_date = currentDate;
            // Update the stored data with the new start_date
            localStorage.setItem(storedKeyName, JSON.stringify(values));
        }

        if (values?.company_id) {
            GetSiteList(values?.company_id)
        }

    });



    useEffect(() => {
        handleFilterData(handleApplyFilters, ReduxFullData, 'localFilterModalData',);
    }, []);


    const handleClearForm = async (resetForm) => {
        setData(null)
        handleClientStats()
    };


    return (
        <>
            {isLoading || commonListLoading ? <Loaderimg /> : null}
            <div className="page-header d-flex">
                <div>
                    <h1 className="page-title ">Competitor Stats</h1>
                    <Breadcrumb className="breadcrumb breadcrumb-subheader">
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
                            Competitor Stats
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="ms-auto ">
                    <div className="input-group" />
                </div>
            </div>

            {role === "Administrator" ? <>
                <>
                    <Row>
                        <Col md={12} xl={12}>
                            <Card>
                                <Card.Header>
                                    <h3 className="card-title"> Filter Data </h3>
                                </Card.Header>

                                <NewFilterTab
                                    getData={getData}
                                    isLoading={isLoading}
                                    isStatic={true}
                                    onApplyFilters={handleApplyFilters}
                                    validationSchema={validationSchemaForCustomInput}
                                    storedKeyName={storedKeyName}
                                    layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                                    lg="4"
                                    showStationValidation={false}
                                    showMonthInput={false}
                                    showDateInput={false}
                                    showStationInput={false}
                                    ClearForm={handleClearForm}
                                />

                            </Card>
                        </Col>
                    </Row>

                </></> : ""}


            <Card>
                <Card.Body>
                    {data?.length > 0 ? (
                        <>
                            <div
                                className="table-responsive deleted-table"
                            >
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
        </>
    )
}

export default withApi(StatsCompetitor);