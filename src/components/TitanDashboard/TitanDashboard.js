import { useEffect, useState } from "react";
import withApi from "../../Utils/ApiHelper";
import { useSelector } from "react-redux";
import DashboardStatCard from "../../components/Dashboard/DashboardStatCard";
import FiltersComponent from "../../components/Dashboard/DashboardHeader";
import { BestvsWorst, GraphfilterOptions, handleFilterData } from "../../Utils/commonFunctions/commonFunction";
import { Card, Col, Row } from "react-bootstrap";
import TitanFilterModal from "./TitanFilterModal";
import { useFormik } from "formik";
import useErrorHandler from "../CommonComponent/useErrorHandler";
import TitanUppercards from "./TitanUppercards";
import TitanCardLoading from "./TitanCardLoading";
import TitanPieChart from "./TitanPieChart";
import NoDataComponent from "../../Utils/commonFunctions/NoDataComponent";
import SmallLoader from "../../Utils/SmallLoader";
import TitanColumnChart from "./TitanColumnChart";
import TitanDetailModal from "./TitanDetailModal";
import TitanStatsTable from "./TitanStatsTable";
import TitanTankFilter from "./TitanTankFilter";

const TitanDashboard = (props) => {

    const { isLoading, getData } = props;
    const [sidebarVisible1, setSidebarVisible1] = useState(true);
    const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState();
    const [filters, setFilters] = useState({
        client_id: "",
        company_id: "",
        site_id: "",
        grade_id: "",
        tank_id: "",
    });
    const [permissionsArray, setPermissionsArray] = useState([]);
    const ReduxFullData = useSelector((state) => state?.data?.data);
    let storedKeyName = "localFilterModalData";
    const [ShowLiveData, setShowLiveData] = useState(false);
    const [PriceGraphloading, setPriceGraphloading] = useState(false);

    const [PriceGraphData, setPriceGraphData] = useState();
    const [bestvsWorst, setbestvsWorst] = useState("0");
    const [graphfilterOption, setgraphfilterOption] = useState("monthly");

    const userPermissions = useSelector(
        (state) => state?.data?.data?.permissions || []
    );

    const priceLogsPermission = userPermissions?.includes(
        "titandashboard-details"
    );
    const priceGraphPermission = userPermissions?.includes(
        "titandashboard-view"
    );

    const { handleError } = useErrorHandler();

    const formik = useFormik({
        initialValues: {
            client_id: "",
            company_id: "",
            site_id: "",
            selectedSite: "",
            selectedSiteDetails: "",
            selectedGradeDetails: "",
            selectedMonth: "",
            selectedMonthDetails: "",
        },
        onSubmit: (values) => {
            FetchPriceGraph(values)
            console.log(values, "onSubmit");

            // console.log(values);
        },
    });

    const handleToggleSidebar1 = () => {
        setSidebarVisible1(!sidebarVisible1);
        setCenterFilterModalOpen(!centerFilterModalOpen);
    };

    useEffect(() => {
        localStorage.setItem(
            "Dashboardsitestats",
            permissionsArray?.includes("titandashboard-view")
        );
        if (ReduxFullData?.company_id) {
            localStorage.setItem("PresetCompanyID", ReduxFullData?.company_id);
            localStorage.setItem("PresetCompanyName", ReduxFullData?.company_name);
        } else {
            localStorage.removeItem("PresetCompanyID");
        }
        if (ReduxFullData) {
            setPermissionsArray(ReduxFullData?.permissions);
        }
        // navigate(ReduxFullData?.route);
        // ;
    }, [ReduxFullData, permissionsArray]);

    var [isClientRole] = useState(
        localStorage.getItem("superiorRole") == "Client"
    );



    const handleApplyFilters = async (values) => {


        console.log(values, "handleApplyFilters");
        formik.setFieldValue("client_id", values.client_id);
        formik.setFieldValue("company_id", values.company_id);
        try {
            // Check if 'Sites' is missing and user has client role
            if (!values?.sites && isClientRole) {
                const response = await getData(
                    `common/site-list?company_id=${values?.company_id}`
                );
                values.sites = response?.data?.data || [];
            }
            if (!values?.start_date) {
                const currentDate = new Date().toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
                values.start_date = currentDate;
            }

            // Store the updated values in localStorage
            localStorage.setItem(storedKeyName, JSON.stringify(values));

            // Fetch dashboard stats if the user has the required permission
            if (permissionsArray?.includes("titandashboard-view")) {
                // FetchPriceLogs(values)
                // console.log(storedKeyName, "storedKeyName");
                FetchDashboardStats(values);
            }
        } catch (error) {
            handleError(error); // Handle errors from API or other logic
        }
    };

    const FetchDashboardStats = async (filters) => {
        const endpoints = [
            {
                name: "dashboard",
                url: "titan-dashboard/stats",
                // url: "ceo-dashboard/stats",
                setData: setDashboardData,
                setLoading: setStatsLoading,
                callback: (response, updatedFilters) => {
                    setFilters(updatedFilters);
                    setCenterFilterModalOpen(false);
                },
            },
        ];

        // Split the endpoints into two halves
        const firstHalf = endpoints.slice(0, Math.ceil(endpoints.length / 3));
        const secondHalf = endpoints.slice(Math.ceil(endpoints.length / 3));

        const fetchEndpointData = ({ url, setData, setLoading, callback }) => {
            return fetchData(filters, url, setData, setLoading, callback);
        };

        try {
            // Execute all requests for the first half concurrently
            await Promise.all(firstHalf.map(fetchEndpointData));

            // Once the first half is completed, execute all requests for the second half
            await Promise.all(secondHalf.map(fetchEndpointData));
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    const updateFilters = (filters) => {
        let { client_id, company_id, site_id, client_name, company_name, sites } =
            filters;

        if (localStorage.getItem("superiorRole") === "Client") {
            client_id = ReduxFullData?.superiorId;
            client_name = ReduxFullData?.full_name;
        }

        if (ReduxFullData?.company_id && !company_id) {
            company_id = ReduxFullData?.company_id;
            company_name = ReduxFullData?.company_name;
        }

        return { ...filters, client_id, client_name, company_id, company_name };
    };

    const fetchData = async (
        filters,
        endpoint,
        setData,
        setLoading,
        callback
    ) => {
        const updatedFilters = updateFilters(filters);
        console.log(updatedFilters?.site_id, "updatedFilters");
        formik.setFieldValue("site_id", updatedFilters?.site_id || "");

        const { client_id, company_id, site_id, grade_id, tank_id, start_month } = updatedFilters;
        if (site_id) formik.setFieldValue("site_id", site_id);
        if (
            !formik?.values?.selectedMonth &&
            !formik?.values?.selectedMonthDetails &&
            updatedFilters?.reportmonths
        ) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            const currentMonthFormatted = `${currentYear}${currentMonth
                .toString()
                .padStart(2, "0")}`;
            const currentMonthObject = updatedFilters?.reportmonths.find(
                (item) => item.values === currentMonthFormatted
            );
            if (currentMonthObject) {
                formik.setFieldValue("selectedMonth", currentMonthObject.display);
                formik.setFieldValue("selectedMonthDetails", currentMonthObject);
            }
        }

        if (
            updatedFilters?.company_id &&
            updatedFilters?.sites &&
            !updatedFilters?.site_id
        ) {
            const firstSiteDetails = updatedFilters?.sites?.[0];
            if (firstSiteDetails) {
                formik.setFieldValue("selectedSite", firstSiteDetails?.id);
                formik.setFieldValue("selectedSiteDetails", firstSiteDetails);
            }
        } else if (updatedFilters?.sites && updatedFilters?.site_id) {
            const selectedItem = filters?.sites.find(
                (item) => item.id == updatedFilters?.site_id
            );
            formik.setFieldValue("selectedSite", updatedFilters?.site_id);
            formik.setFieldValue("selectedSiteDetails", selectedItem);
        }
        if (client_id) {
            try {
                if (setLoading) setLoading(true);
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append("client_id", client_id);
                if (company_id) queryParams.append("company_id", company_id);
                if (site_id) queryParams.append("site_id", site_id);
                if (tank_id) queryParams.append("tank_id", tank_id);
                if (grade_id) queryParams.append("grade_id", grade_id);
                if (start_month) queryParams.append("month", start_month);
                if (client_id && company_id) {
                    setApplyNavigate(true);
                } else {
                    setApplyNavigate(false);
                }

                const queryString = queryParams.toString();
                const response = await getData(`${endpoint}?${queryString}`);
                setFilters(updatedFilters);
                setCenterFilterModalOpen(false);
                if (response && response.data && response.data.data) {
                    setData(response.data.data);
                    if (callback) callback(response, updatedFilters);
                    localStorage.setItem(storedKeyName, JSON.stringify(updatedFilters));
                }
            } catch (error) {
                // handleError(error);
            } finally {
                if (setLoading) setLoading(false);
            }
        }
    };




    const handleResetFilters = async () => {
        localStorage.removeItem(storedKeyName);

        setFilters(null);
        setDashboardData(null);
        formik.resetForm();
    };

    useEffect(() => {
        handleFilterData(handleApplyFilters, ReduxFullData, "localFilterModalData");
    }, [permissionsArray?.includes("titandashboard-view")]);

    const handlelivemaringclosemodal = () => {
        setShowLiveData(false); // Toggle the state
    };

    useEffect(() => {
        if (priceLogsPermission && formik.values?.company_id) {

            FetchPriceGraph(formik.values);
        }
    }, [graphfilterOption, priceLogsPermission, bestvsWorst, formik?.values?.selectedSite, permissionsArray?.includes("titandashboard-view")]);

    const FetchPriceGraph = async (site_id) => {
        try {
            console.log(formik.values, "setPriceGraphData");
            setShowModal(false)
            setPriceGraphloading(true);
            const queryParams = new URLSearchParams();
            console.log(site_id, " getData");
            queryParams.append("client_id", formik.values?.client_id);
            queryParams.append("company_id", formik.values?.company_id);
            if (formik.values?.tableselectedSite) queryParams.append("site_id", formik.values?.tableselectedSite);
            if (formik.values?.tableselectedTank) queryParams.append("tank_id", formik.values?.tableselectedTank);
            if (formik.values?.tableselectedGrade) queryParams.append("grade_id", formik.values?.tableselectedGrade);
            queryParams.append("case", bestvsWorst);
            queryParams.append("filter_type", graphfilterOption);

            const queryString = queryParams.toString();
            const response = await getData(
                `titan-dashboard/performance-stats?${queryString}`
            );
            if (response && response.data && response.data.data) {
                setShowModal(false)
                setPriceGraphData(response.data.data)
                console.log(response?.data?.data, "columnIndex");

            }
        } catch (error) {
            // handleError(error);
        } finally {
            setPriceGraphloading(false);
        }
    };

    const openCenterFilterModal = () => {
        if (!filters?.company_id) {
            setCenterFilterModalOpen(true);
        }
    };


    const [applyNavigate, setApplyNavigate] = useState(false);
    const [showCeoDetailModal, setShowCeoDetailModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const handleCloseSidebar = () => {
        setShowCeoDetailModal(false);
    };
    const handleCardClick = (cardName) => {
        console.log(filters?.company_id, "filters?.company_id");
        if (applyNavigate && formik?.values?.company_id) {
            console.log(cardName, "cardName");
            setModalTitle(cardName);
            setShowCeoDetailModal(true);
        }
    };
    const siteList = PriceGraphData?.fuel_mapping?.map(site => ({
        id: site.site_id,
        name: site.name,
        fuel: site?.fuel // Extract fuel types
    }));

    const onSiteSelect = async (selectedId) => {
        const tableselectedSite = siteList?.find(site => site.id === selectedId);
        try {

            if (tableselectedSite) {
                await formik.setFieldValue("tableselectedSite", tableselectedSite?.id);
                await formik.setFieldValue("selectedSiteDetails", tableselectedSite);
            } else {
                await formik.setFieldValue("tableselectedSite", "");
                await formik.setFieldValue("selectedSiteDetails", "");
            }

            // Update Formik state with selected site and its details

        } catch (error) {
            console.error("Error in handleSiteChange:", error);
        }
    }

    const handleGradeChange = async (selectedId) => {
        const tableselectedSite = formik.values?.selectedSiteDetails?.fuel?.find(site => site.id == selectedId);
        if (tableselectedSite) {
            await formik.setFieldValue("tableselectedGrade", selectedId)
            await formik.setFieldValue("selectedGradeDetails", tableselectedSite)
        } else {
            await formik.setFieldValue("tableselectedGrade", "");
            await formik.setFieldValue("selectedGradeDetails", "");
        }
    };
    const handleTankChange = async (selectedId) => {
        const tableselectedSite = formik.values?.selectedGradeDetails?.tanks?.find(site => site.id == selectedId);
        if (tableselectedSite) {
            await formik.setFieldValue("tableselectedTank", selectedId)
            await formik.setFieldValue("selectedTankDetails", tableselectedSite)
        } else {
            await formik.setFieldValue("tableselectedTank", "");
            await formik.setFieldValue("selectedTankDetails", "");
        }
    };
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            {/* {isLoading ? <LoaderImg /> : ""} */}
            {showCeoDetailModal && (
                <>
                    <TitanDetailModal
                        title={modalTitle}
                        filterDataAll={filters}
                        filterData={filters}
                        sidebarContent={"sidebardataobject"}
                        visible={showCeoDetailModal}
                        dashboardData={dashboardData}
                        onClose={handleCloseSidebar}
                        PriceGraphData={PriceGraphData}
                        filters={filters}
                    />
                </>
            )}

            {centerFilterModalOpen && (
                <div className="">
                    <TitanFilterModal
                        isOpen={centerFilterModalOpen}
                        onClose={() => setCenterFilterModalOpen(false)}
                        getData={getData}
                        isLoading={isLoading}
                        isStatic={true}
                        onApplyFilters={handleApplyFilters}
                        storedKeyName={storedKeyName}
                        layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                        showStationValidation={false}
                        showMonthInput={true}
                        showDateInput={false}
                    />
                </div>
            )}

            {!ReduxFullData?.role == "Client" && !ReduxFullData?.sms_balance < 3 ? (
                <div
                    className="balance-alert"
                    style={{
                        textAlign: "left",
                        margin: " 10px 0",
                        fontSize: "16px",
                        color: "white",
                        background: "#b52d2d",
                        padding: "8px",
                        borderRadius: "7px",
                    }}
                >
                    <div>
                        Your SMS balance seems low, please buy more SMS to send
                        notifications
                    </div>
                    <div className="balance-badge">
                        <span>Sms Balance : </span>
                        <span style={{ marginLeft: "6px" }}>
                            {" "}
                            {ReduxFullData?.sms_balance}{" "}
                        </span>
                    </div>
                </div>
            ) : (
                ""
            )}

            {/* Showing error message for gross margin */}
            {dashboardData?.gross_margin?.is_ppl == 1 && (
                <>
                    <div className="balance-alert head-alert-show">
                        <div>{dashboardData?.gross_margin?.ppl_msg}</div>
                    </div>
                </>
            )}

            <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
                {!ShowLiveData && (
                    <div className="">
                        <h2 className="page-title dashboard-page-title mb-2 mb-sm-0">
                            Titan Dashboard (
                            {dashboardData?.display_date
                                ? dashboardData?.display_date
                                : ReduxFullData?.dates}
                            )
                        </h2>
                    </div>
                )}
                <div></div>

                <FiltersComponent
                    filters={filters}
                    handleToggleSidebar1={handleToggleSidebar1}
                    handleResetFilters={handleResetFilters}
                    showResetBtn={true}
                    ComponentTitan={true}
                />
            </div>

            {!ReduxFullData?.role == "Client" && !ReduxFullData?.sms_balance < 3 ? (
                <div
                    className="balance-alert"
                    style={{
                        textAlign: "left",
                        margin: " 10px 0",
                        fontSize: "16px",
                        color: "white",
                        background: "#b52d2d",
                        padding: "8px",
                        borderRadius: "7px",
                    }}
                >
                    <div>
                        Your SMS balance seems low, please buy more SMS to send
                        notifications
                    </div>
                    <div className="balance-badge">
                        <span>Sms Balance : </span>
                        <span style={{ marginLeft: "6px" }}>
                            {" "}
                            {ReduxFullData?.sms_balance}{" "}
                        </span>
                    </div>
                </div>
            ) : (
                ""
            )}

            <div className="mb-2 " onClick={() => openCenterFilterModal()}>
                {filters?.client_id && filters.company_id && (
                    <>
                        {ShowLiveData && (
                            <DashboardStatCard
                                isLoading={isLoading}
                                getData={getData}
                                parentFilters={filters}
                                isOpen={ShowLiveData}
                                // onClose={() => setShowLiveData(false)}
                                onClose={() => handlelivemaringclosemodal()}
                                title="Total Sales"
                                value="2323"
                                percentageChange="3%"
                                iconClass="icon icon-rocket text-white mb-5"
                                iconBgColor="bg-danger-gradient"
                                trendColor="text-primary"
                            />
                        )}
                    </>
                )}

                {ShowLiveData && (
                    <h2 className=" d-flex justify-content-start mb-4  page-title dashboard-page-title">
                        CEO Dashboard (
                        {dashboardData?.dateString
                            ? dashboardData?.dateString
                            : ReduxFullData?.dates}
                        )
                    </h2>
                )}

                {statsLoading ? (
                    <>
                        <Row>
                            <TitanCardLoading lg={3} />
                            <TitanCardLoading lg={3} />
                            <TitanCardLoading lg={3} />
                            <TitanCardLoading lg={3} />
                            <TitanCardLoading lg={3} />
                            <TitanCardLoading lg={3} />
                            <TitanCardLoading lg={3} />
                            <TitanCardLoading lg={3} />

                        </Row>
                    </>
                ) : (
                    <TitanUppercards
                        wet_stock_value={dashboardData?.wet_stock_value}
                        delivery_loss_value={dashboardData?.delivery_loss_value}
                        unkonwn_loss_value={dashboardData?.unkonwn_loss_value}
                        wet_stock_volume={dashboardData?.wet_stock_volume}
                        delivery_loss_volume={dashboardData?.delivery_loss_volume}
                        unkonwn_loss_volume={dashboardData?.unkonwn_loss_volume}
                        dip_stock_value={dashboardData?.dip_stock_value}
                        dip_stock_volume={dashboardData?.dip_stock_volume}
                        dashboardData={dashboardData}
                        callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
                    />
                )}
            </div>


            <Row className="mb-5">

                <TitanTankFilter
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    formik={formik}
                    siteList={siteList}
                    BestvsWorst={BestvsWorst}
                    PriceGraphData={PriceGraphData}
                    GraphfilterOptions={GraphfilterOptions}
                    onSiteSelect={onSiteSelect}
                    handleGradeChange={handleGradeChange}
                    handleTankChange={handleTankChange}
                />
                {priceGraphPermission && (
                    <>
                        <Col className="" sm={12} md={9} lg={9}>
                            <Card
                                className="h-100"
                                style={{ transition: "opacity 0.3s ease" }}
                            >
                                <Card.Header className="p-4">
                                    <div className="spacebetween" style={{ width: "100%" }}>
                                        <h4 className="card-title">
                                            {" "}
                                            Site Performance {" "}
                                            {PriceGraphData?.name &&
                                                ` (${PriceGraphData?.name})`}
                                            <br></br>
                                            {userPermissions?.includes("titandashboard-view") && filters?.company_id ? (
                                                <span onClick={() => handleCardClick("Performance")} style={{ color: "var(--primary-bg-color)" }} className="pointer">
                                                    <div >
                                                        Table View
                                                    </div>
                                                </span>
                                            ) : (
                                                ""
                                            )}

                                        </h4>

                                        <button className="btn btn-primary" variant="primary" onClick={() => setShowModal(true)}>Open Filters</button>
                                    </div>

                                </Card.Header>

                                <Card.Body>
                                    {PriceGraphloading ? (
                                        <SmallLoader />
                                    ) : PriceGraphData?.stats ? (
                                        <TitanStatsTable
                                            data={PriceGraphData?.stats}
                                        />
                                    ) : (
                                        <NoDataComponent showCard={true} />
                                    )}

                                </Card.Body>

                            </Card>
                        </Col>
                    </>
                )}


                <Col sm={12} md={3} lg={3}>
                    {statsLoading ? (
                        <SmallLoader title="Pie Chart" />
                    ) : dashboardData?.pie_graph_stats ? (
                        <TitanPieChart statsLoading={statsLoading} data={dashboardData?.pie_graph_stats} title=" Pie Chart" />
                    ) : (
                        <NoDataComponent title="Pie Chart" showCard={true} />
                    )}


                </Col>
            </Row>


        </>
    );
};

export default withApi(TitanDashboard);
