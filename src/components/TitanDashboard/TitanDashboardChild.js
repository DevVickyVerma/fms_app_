import { useEffect, useState } from "react";
import { Breadcrumb, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import TitanUppercards from "./TitanUppercards";
import SecondFiltersComponent from "../Dashboard/SecondFiltersComponent";
import useErrorHandler from "../CommonComponent/useErrorHandler";
import TitanFilterModal from "./TitanFilterModal";
import withApi from "../../Utils/ApiHelper";
import LoaderImg from "../../Utils/Loader";
import TitanDashboardChildTable from "./TitanDashboardChildTable";
import TitanCardLoading from "./TitanCardLoading";
import TitanStatsTable from "./TitanStatsTable";


const TitanDashboardChild = (props) => {
    const { isLoading, getData } = props;
    const [sidebarVisible1, setSidebarVisible1] = useState(true);
    const [tableData, setTableData] = useState();
    const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
    const userPermissions = useSelector(
        (state) => state?.data?.data?.permissions || []
    );
    const [dashboardData, setDashboardData] = useState();
    const [filters, setFilters] = useState({
        client_id: "",
        company_id: "",
        site_id: "",
    });
    const { handleError } = useErrorHandler();
    const ReduxFullData = useSelector((state) => state?.data?.data);

    const handleToggleSidebar1 = () => {
        setSidebarVisible1(!sidebarVisible1);
        setCenterFilterModalOpen(!centerFilterModalOpen);
    };

    const dispatch = useDispatch();

    let storedKeyName = "localFilterModalData";
    const [isNotClient] = useState(
        localStorage.getItem("superiorRole") !== "Client"
    );
    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),
    });

    const handleApplyFilters = (values) => {
        console.log(values, "values");
        if (userPermissions?.includes("ceodashboard-view")) {
            callFetchFilterData(values);
        }

        userPermissions?.includes("ceodashboard-site-stats") &&
            callTableData(values);
    };

    const callFetchFilterData = async (filters) => {
        let { client_id, company_id, site_id, client_name } = filters;

        // Check if the role is Client, then set the client_id and client_name from local storage
        if (localStorage.getItem("superiorRole") === "Client") {
            client_id = localStorage.getItem("superiorId");
            client_name = ReduxFullData?.full_name;
        }

        if (ReduxFullData?.company_id && !company_id) {
            company_id = ReduxFullData?.company_id;
        }

        // Update the filters object with new values
        const updatedFilters = {
            ...filters,
            client_id,
            client_name,
        };

        if (client_id) {
            try {
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append("client_id", client_id);
                if (company_id) queryParams.append("company_id", company_id);
                const queryString = queryParams.toString();
                const response = await getData(`titan-dashboard/stats?${queryString}`);
                if (response && response.data && response.data.data) {
                    setFilters(updatedFilters);
                    setCenterFilterModalOpen(false);
                    setDashboardData(response?.data?.data);
                }
            } catch (error) {
                handleError(error);
            } finally {
            }
        }
    };

    const callTableData = async (filters) => {
        let { client_id, company_id, site_id } = filters;

        // Check if the role is Client, then set the client_id and client_name from local storage
        if (localStorage.getItem("superiorRole") === "Client") {
            client_id = localStorage.getItem("superiorId");
        }

        if (ReduxFullData?.company_id && !company_id) {
            company_id = ReduxFullData?.company_id;
        }

        if (client_id) {
            try {
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append("client_id", client_id);
                if (company_id) queryParams.append("company_id", company_id);
                // if (site_id) queryParams.append('site_id', site_id);

                const queryString = queryParams.toString();
                const response = await getData(
                    `titan-dashboard/get-details?${queryString}`
                );
                if (response && response.data && response.data.data) {
                    setTableData(response?.data?.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const storedData = localStorage.getItem(storedKeyName);

    useEffect(() => {
        if (storedData) {
            handleApplyFilters(JSON.parse(storedData));
        } else if (localStorage.getItem("superiorRole") === "Client") {
            const storedClientIdData = localStorage.getItem("superiorId");

            if (storedClientIdData) {
                const futurepriceLog = {
                    client_id: storedClientIdData,
                };
                // localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));
                handleApplyFilters(futurepriceLog);
            }
        }
    }, [dispatch, storedKeyName]); // Add any other dependencies needed here
    console.log(tableData, "tableData");
    return (
        <>
            {isLoading ? <LoaderImg /> : null}

            {dashboardData?.gross_margin?.is_ppl == 1 && (
                <>
                    <div className="balance-alert head-alert-show">
                        <div>{dashboardData?.gross_margin?.ppl_msg}</div>
                    </div>
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
                        validationSchema={validationSchemaForCustomInput}
                        storedKeyName={storedKeyName}
                        layoutClasses="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5"
                        showStationValidation={false}
                        showMonthInput={false}
                        showDateInput={false}
                    />
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
                <div className="">
                    <h2 className="page-title dashboard-page-title">
                        Titan Dashboard Details (
                        {dashboardData?.dateString
                            ? dashboardData?.dateString
                            : ReduxFullData?.dates}
                        )
                    </h2>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item
                            className="breadcrumb-item"
                            linkAs={Link}
                            linkProps={{ to: "/titandashboard" }}
                        >
                            Titan Dashboard
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            Titan Dashboard Details
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <SecondFiltersComponent
                    filters={filters}
                    handleToggleSidebar1={handleToggleSidebar1}
                />
            </div>

            <Row>
                {/* <TitanUppercards
                    gross_volume={dashboardData?.gross_volume || 0}
                    shopmargin={dashboardData?.shop_profit || 0}
                    valet_sales={dashboardData?.valet_sales || 0}
                    gross_profit={dashboardData?.gross_profit || 0}
                    gross_margin={dashboardData?.gross_margin || 0}
                    fuel_sales={dashboardData?.fuel_sales || 0}
                    fuel_commission={dashboardData?.fuel_commission || 0}
                    gross_margin_bunkered={dashboardData?.gross_margin_bunkered || 0}
                    shop_sales={dashboardData?.shop_sales || 0}
                    shop_fees={dashboardData?.shop_fees || 0}
                    shop_profit={dashboardData?.shop_profit || 0}
                    dashboardData={dashboardData}
                    callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
                    parentComponent={false}
                /> */}
                {isLoading ? (
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
                        dashboardData={dashboardData}
                        callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
                        parentComponent={false}
                    />
                )}
            </Row>
            <TitanStatsTable
                data={tableData}
                tootiptitle={"Profit"}
                title={"Sites "}
            />
            {/* <TitanDashboardChildTable data={tableData} /> */}
        </>
    );
};

export default withApi(TitanDashboardChild);
