import { useEffect, useState } from 'react';
import { Breadcrumb, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import DashboardChildTable from "./DashboardChildTable";
import Loaderimg from "../../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import DashboardStatsBox from "../DashboardStatsBox/DashboardStatsBox";
import NewDashboardFilterModal from "../../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from 'yup';
import FiltersComponent from "../DashboardHeader";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import UpercardsCeoDashboardStatsBox from '../DashboardStatsBox/UpercardsCeoDashboardStatsBox';



const CeoDashBoardChild = (props) => {
    const { isLoading, getData } = props;
    const [sidebarVisible1, setSidebarVisible1] = useState(true);
    const [tableData, setTableData] = useState();
    const [centerFilterModalOpen, setCenterFilterModalOpen] = useState(false);
    const userPermissions = useSelector((state) => state?.data?.data?.permissions || []);
    const [dashboardData, setDashboardData] = useState();
    const [filters, setFilters] = useState({
        client_id: '',
        company_id: '',
        site_id: '',
    });
    const { handleError } = useErrorHandler();
    const ReduxFullData = useSelector((state) => state?.data?.data);

    const handleToggleSidebar1 = () => {
        setSidebarVisible1(!sidebarVisible1);
        setCenterFilterModalOpen(!centerFilterModalOpen);
    };

    const dispatch = useDispatch();

    let storedKeyName = "localFilterModalData";
    const [isNotClient] = useState(localStorage.getItem("superiorRole") !== "Client");
    const validationSchemaForCustomInput = Yup.object({
        client_id: isNotClient
            ? Yup.string().required("Client is required")
            : Yup.mixed().notRequired(),
        company_id: Yup.string().required("Company is required"),
    });

    const handleApplyFilters = (values) => {

        if (userPermissions?.includes("dashboard-view")) {
            callFetchFilterData(values)
        }

        userPermissions?.includes("dashboard-site-stats") && (
            callTableData(values)
        )
    }

    const callFetchFilterData = async (filters) => {
        let { client_id, company_id, site_id, client_name, } = filters;

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
            client_name
        };

        if (client_id) {
            try {
                const queryParams = new URLSearchParams();
                if (client_id) queryParams.append('client_id', client_id);
                if (company_id) queryParams.append('company_id', company_id);
                if (site_id) queryParams.append('site_id', site_id);

                const queryString = queryParams.toString();
                const response = await getData(`dashboard/stats?${queryString}`);
                if (response && response.data && response.data.data) {
                    setFilters(updatedFilters)
                    setCenterFilterModalOpen(false)
                    setDashboardData(response?.data?.data)
                }
            } catch (error) {
                handleError(error)
            } finally {
            }
        }
    };


    const callTableData = async (filters) => {
        let { client_id, company_id, site_id, } = filters;

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
                if (client_id) queryParams.append('client_id', client_id);
                if (company_id) queryParams.append('company_id', company_id);
                if (site_id) queryParams.append('site_id', site_id);

                const queryString = queryParams.toString();
                const response = await getData(`dashboard/get-details?${queryString}`);
                if (response && response.data && response.data.data) {
                    setTableData(response?.data?.data?.sites);
                }
            } catch (error) {
                console.error(error)
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

    }, [dispatch, storedKeyName,]); // Add any other dependencies needed here

    const location = useLocation();
    const { isCeoDashboard } = location.state || {}; // Destructure state and default to an empty object
    console.log(isCeoDashboard, "isCeoDashboard");
    return (
        <>
            {isLoading ? <Loaderimg /> : null}

            {dashboardData?.gross_margin?.is_ppl == 1 && (<>
                <div className="balance-alert head-alert-show">
                    <div>
                        {dashboardData?.gross_margin?.ppl_msg}
                    </div>
                </div>
            </>)}


            {centerFilterModalOpen && (
                <div className=''>
                    <NewDashboardFilterModal
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


            <div className='d-flex justify-content-between align-items-center flex-wrap mb-5'>
                <div className="">
                    <h2 className='page-title dashboard-page-title'>
                        Dashboard Details ({dashboardData?.dateString ? dashboardData?.dateString : ReduxFullData?.dates})
                    </h2>
                    <Breadcrumb className="breadcrumb">
                        <Breadcrumb.Item
                            className="breadcrumb-item"
                            linkAs={Link}
                            linkProps={{ to: "/ceodashboard" }}
                        >
                            Dashboard
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            className="breadcrumb-item active breadcrumds"
                            aria-current="page"
                        >
                            Dashboard Details
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <FiltersComponent
                    filters={filters}
                    handleToggleSidebar1={handleToggleSidebar1}
                />
            </div>


            <Row>
                <UpercardsCeoDashboardStatsBox
                    GrossVolume={dashboardData?.gross_volume}
                    shopmargin={dashboardData?.shop_profit}
                    GrossProfitValue={dashboardData?.gross_profit}
                    GrossMarginValue={dashboardData?.gross_margin}
                    FuelValue={dashboardData?.fuel_sales}
                    shopsale={dashboardData?.shop_sales}
                    shop_fees={dashboardData?.shop_fees}
                    parentComponent={false}
                />
            </Row>

            <DashboardChildTable data={tableData} />
        </>
    );
};

export default CeoDashBoardChild;
