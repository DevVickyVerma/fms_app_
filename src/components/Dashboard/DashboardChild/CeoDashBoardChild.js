import { useEffect, useState } from "react";
import { Breadcrumb, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loaderimg from "../../../Utils/Loader";
import { useDispatch, useSelector } from "react-redux";
import NewDashboardFilterModal from "../../pages/Filtermodal/NewDashboardFilterModal";
import * as Yup from "yup";
import useErrorHandler from "../../CommonComponent/useErrorHandler";
import UpercardsCeoDashboardStatsBox from "../DashboardStatsBox/UpercardsCeoDashboardStatsBox";
import SecondFiltersComponent from "../SecondFiltersComponent";
import CeoDashboardChildTable from "./CeoDashboardChildTable";
import CardSwiper from "../../../Utils/MobileCommonComponents/CardSwiper";
import { useMyContext } from "../../../Utils/MyContext";
import { IonButton, IonIcon } from "@ionic/react";
import { funnelOutline } from "ionicons/icons";

const CeoDashBoardChild = (props) => {
  const { isLoading, getData } = props;
  const [sidebarVisible1, setSidebarVisible1] = useState(true);
  const [tableData, setTableData] = useState();
  const { deviceType, deviceInfo, isMobile } = useMyContext();
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
        // if (site_id) queryParams.append('site_id', site_id);

        const queryString = queryParams.toString();
        const response = await getData(`ceo-dashboard/stats?${queryString}`);
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
          `ceo-dashboard/get-details?${queryString}`
        );
        if (response && response.data && response.data.data) {
          setTableData(response?.data?.data?.sites);
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
  const DashboardcardsData = (dashboardData) => [
    {
      id: 1,
      title: "Gross Volume",
      value: dashboardData?.gross_volume?.gross_volume || "0.0",
      subValue: dashboardData?.gross_volume?.bunkered_volume || "0.0",
      subTitle: "Bunkered Volume",
      percentage: `${dashboardData?.gross_volume?.percentage || "0%"}`,
      status: dashboardData?.gross_volume?.status || "down",
      icon: "ℓ",
    },
    {
      id: 2,
      title: "Fuel Sales (Ex. Vat)",
      value: dashboardData?.fuel_sales?.gross_value || "0.0",
      subValue: dashboardData?.fuel_sales?.bunkered_value || "0.0",
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.fuel_sales?.percentage || "0%"}`,
      status: dashboardData?.fuel_sales?.status || "down",
      icon: "£",
    },
    {
      id: 3,
      title: "Gross Margin (Fuel)",
      value: dashboardData?.gross_margin?.gross_margin || "0.0",
      subValue: dashboardData?.gross_profit?.gross_profit || "0.0",
      subTitle: "Gross Profit",
      percentage: `${dashboardData?.gross_profit?.percentage || "0%"}`,
      status: dashboardData?.gross_margin?.status || "down",
      icon: "£",
      subicon: "ppl",
    },
    {
      id: 4,
      title: "Gross (Bunkered)",
      value: `${dashboardData?.gross_margin_bunkered?.gross_margin_bunkered || "0"} ppl`,
      subValue: "",
      subTitle: "",
      percentage: `${dashboardData?.gross_margin_bunkered?.percentage || "0%"}`,
      status: dashboardData?.gross_margin_bunkered?.status || "down",
      icon: "£",
    },
    {
      id: 5,
      title: "Shop Sales (Ex. Vat)",
      value: dashboardData?.shop_sales?.shop_sales || "0%",
      subValue: dashboardData?.shop_sales?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.shop_sales?.percentage || "0%"}`,
      status: dashboardData?.shop_sales?.status || "down",
      icon: "£",
    },
    {
      id: 6,
      title: "Shop Profit",
      value: dashboardData?.shop_profit?.shop_profit || "0%",
      subValue: dashboardData?.shop_profit?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.shop_profit?.percentage || "0%"}`,
      status: dashboardData?.shop_profit?.status || "down",
      icon: "£",
    },
    {
      id: 7,
      title: "Shop  Margin",
      value: dashboardData?.valet_sales?.valet_sales || "0%",
      subValue: dashboardData?.valet_sales?.bunkered_value,
      subTitle: "Bunkered Sales",
      percentage: `${dashboardData?.valet_sales?.percentage || "0%"}`,
      status: dashboardData?.valet_sales?.status || "down",
      icon: "%",
    },
  ];
  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      {dashboardData?.gross_margin?.is_ppl == 1 && (
        <>
          <div className="balance-alert head-alert-show">
            <div>{dashboardData?.gross_margin?.ppl_msg}</div>
          </div>
        </>
      )}

      {centerFilterModalOpen && (
        <div className="">
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

      <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
        <div className="">
          <h2 className="page-title dashboard-page-title">
            CEO Dashboard Details (
            {dashboardData?.dateString
              ? dashboardData?.dateString
              : ReduxFullData?.dates}
            )
          </h2>
          <Breadcrumb className="breadcrumb mb-2 mb-sm-0">
            <Breadcrumb.Item
              className="breadcrumb-item"
              linkAs={Link}
              linkProps={{ to: "/ceodashboard" }}
            >
              CEO Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              CEO Dashboard Details
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <SecondFiltersComponent
          filters={filters}
          handleToggleSidebar1={handleToggleSidebar1}
          // filters={filters}
          // handleToggleSidebar1={handleToggleSidebar1}
          // handleResetFilters={handleResetFilters}
          showResetBtn={false}
        />
        {isMobile && (
          <>
            {/* Filter Button */}
            <div
              className={`d-flex justify-content-end ${
                (filters?.client_id ||
                  filters?.company_id ||
                  filters?.site_id ||
                  filters?.start_date) &&
                isMobile &&
                "w-100"
              } `}
            >
              <IonButton
                onClick={handleToggleSidebar1}
                type="danger"
                size="small"
                className="mob-custom-primary-btn"
                style={{ marginRight: "8px" }}
              >
                <IonIcon icon={funnelOutline} />
              </IonButton>
            </div>
          </>
        )}
      </div>
      {/* <CardSwiper
        dashboardData={dashboardData}
        callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}

        cardsData={DashboardcardsData(dashboardData)} // ✅ Call the function
      /> */}
      <Row>
        {isMobile ? (
          <CardSwiper
            dashboardData={dashboardData}
            callStatsBoxParentFunc={() => setCenterFilterModalOpen(true)}
            cardsData={DashboardcardsData(dashboardData)} // ✅ Call the function
          />
        ) : (
          <UpercardsCeoDashboardStatsBox
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
          />
        )}
      </Row>

      <CeoDashboardChildTable data={tableData} ceo={"true"} />
    </>
  );
};

export default CeoDashBoardChild;
