import { useEffect, useState } from 'react';
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashCommonCard from "../DashCommonCard";

const CeoDashboardStatsBox = (props) => {
  const {
    GrossVolume,
    shopmargin,
    shop_fees,
    GrossProfitValue,
    GrossMarginValue,
    FuelValue,
    shopsale,
    dashboardData,
    callStatsBoxParentFunc,
    parentComponent = true,
  } = props;

  const [permissionsArray, setPermissionsArray] = useState([]);

  const UserPermissions = useSelector((state) => state?.data?.data);

  useEffect(() => {
    if (UserPermissions) {
      setPermissionsArray(UserPermissions?.permissions);
    }
  }, [UserPermissions]);


  // dashboard-details for card navigate
  const isDetailPermissionAvailable =
    permissionsArray?.includes("dashboard-details");
  const navigate = useNavigate();

  const handleNavigateClick = () => {
    let ApplyFilterrequired = UserPermissions?.applyFilter;

    if (dashboardData && Object?.keys(dashboardData)?.length > 0) {
      // Set ApplyFilterrequired to false if searchdata has keys
      ApplyFilterrequired = false;
    }

    if (ApplyFilterrequired && isDetailPermissionAvailable) {
    } else if (!ApplyFilterrequired && isDetailPermissionAvailable) {

      let storedKeyName = "localFilterModalData";
      const storedData = localStorage.getItem(storedKeyName);
      if (storedData) {
        let parsedData = JSON.parse(storedData);


        if (parsedData?.company_id && parsedData?.client_id) {
          navigate(`/dashboard-details`);
        } else {
          callStatsBoxParentFunc()
        }

      }
    } else if (!ApplyFilterrequired && !isDetailPermissionAvailable) {
    }
  };


const CeohandleNavigateClick =()=>{
    console.log( "CeohandleNavigateClick");
}


  return (
    <div>
      {GrossVolume ? (
        <Row className=''>


        

          <DashCommonCard
            isParentComponent={parentComponent}
            showRightSide={false}
            leftSideData={GrossVolume?.gross_volume}
            leftSideTitle={'Cash Fuel Sales'}
            RightSideData={GrossVolume?.bunkered_volume}
            RightSideTitle={'Bunkered Volume'}
            statusValue={GrossVolume?.status}
            percentageValue={GrossVolume?.percentage}
            handleNavigateClick={CeohandleNavigateClick}
            icon={"ℓ"}
            containerStyle={'dash-plates-1'}
          // tooltipContent={'dash-plates-1'}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />

          <DashCommonCard
            isParentComponent={parentComponent}
            showRightSide={false}
            leftSideData={FuelValue?.gross_value}
            leftSideTitle={'cash shop sales'}
            RightSideData={FuelValue?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={FuelValue?.status}
            percentageValue={FuelValue?.percentage}
            handleNavigateClick={CeohandleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-3 '}
          // tooltipContent={'dash-plates-1'}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />

          <DashCommonCard
            isParentComponent={parentComponent}
            showRightSide={false}
            leftSideData={GrossProfitValue?.gross_profit}
            leftSideTitle={'card fuel sales'}
            RightSideData={GrossProfitValue?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={GrossProfitValue?.status}
            percentageValue={GrossProfitValue?.percentage}
            handleNavigateClick={CeohandleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-5 '}
            tooltipContent={'Gross Profit = Total Sales - Opening Stock- Purchases(Deliveries) + Closing Stock'}
          // ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
          />


          <DashCommonCard
            isParentComponent={parentComponent}
            showRightSide={false}
            leftSideData={GrossMarginValue?.gross_margin}
            leftSideTitle={'card Shop sales'}
            RightSideData={GrossMarginValue?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={GrossMarginValue?.status}
            percentageValue={GrossMarginValue?.percentage}
            handleNavigateClick={CeohandleNavigateClick}
            // icon={"£"}
            containerStyle={'dash-plates-2'}
            tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
            ppl_msg={GrossMarginValue?.is_ppl == 1 ? GrossMarginValue?.ppl_msg : ""}
            showPPL={true}
          />


          <DashCommonCard
            isParentComponent={parentComponent}
            showRightSide={false}
            leftSideData={shopsale?.shop_sales}
            leftSideTitle={'Keyfuel card fuel sales'}
            RightSideData={shopsale?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={shopsale?.status}
            percentageValue={shopsale?.percentage}
            handleNavigateClick={CeohandleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-4'}
          // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
          // ppl_msg={shopsale?.is_ppl == 1 ? shopsale?.ppl_msg : ""}
          // showPPL={true}
          />


          <DashCommonCard
            isParentComponent={parentComponent}
            showRightSide={false}
            leftSideData={shop_fees?.shop_fee}
            leftSideTitle={'Keyfuel card shop sales'}
            RightSideData={shop_fees?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={shop_fees?.status}
            percentageValue={shop_fees?.percentage}
            handleNavigateClick={CeohandleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-6'}
          // tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
          // ppl_msg={shopsale?.is_ppl == 1 ? shopsale?.ppl_msg : ""}
          // showPPL={true}
          />


          {/* <DashCommonCard
            isParentComponent={parentComponent}
            showRightSide={false}
            leftSideData={shopmargin?.shop_profit}
            leftSideTitle={'Shop Profit'}
            RightSideData={shopmargin?.bunkered_value}
            RightSideTitle={'Bunkered Sales'}
            statusValue={shopmargin?.status}
            percentageValue={shopmargin?.percentage}
            handleNavigateClick={CeohandleNavigateClick}
            icon={"£"}
            containerStyle={'dash-plates-5'}
            tooltipContent={`The data is accurately sourced from back-office system`}
          // ppl_msg={shopsale?.is_ppl == 1 ? shopsale?.ppl_msg : ""}
          // showPPL={true}
          /> */}

        </Row>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CeoDashboardStatsBox;
