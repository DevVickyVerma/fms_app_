import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TitanCommonCards from "./TitanCommonCards";

const TitanUppercards = (props) => {
    const {
        gross_volume,
        shopmargin,
        valet_sales,
        shop_profit,
        shop_fees,
        gross_profit,
        gross_margin,
        fuel_sales,
        fuel_commission,
        gross_margin_bunkered,
        shop_sales,
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

    // ceodashboard-details for card navigate
    const isDetailPermissionAvailable = permissionsArray?.includes(
        "ceodashboard-details"
    );
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
                    // navigate(`/ceodashboard-details`);

                    navigate(`/titandashboard-details`, {
                        state: { isCeoDashboard: true }, // Pass the key-value pair in the state
                    });
                } else {
                    callStatsBoxParentFunc();
                }
            }
        } else if (!ApplyFilterrequired && !isDetailPermissionAvailable) {
        }
    };
    const handleNavigateClicks = () => {
        console.log("columnIndex");
    }
    return (
        <div>
            {/* {gross_volume ? ( */}

            <div className={` ${dashboardData ? "" : "relative pb-4"}`}>
                {!dashboardData && (
                    <>
                        <h4 className="no-blue-text">
                            <span className="p-2 badge bg-danger p-3">
                                Please apply filters to see data
                            </span>
                        </h4>
                    </>
                )}

                <Row
                    className={`scale-in-center ${dashboardData ? "" : "ceo-stats-blur "
                        }`}
                >
                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={gross_volume?.gross_volume}
                            leftSideTitle={"WetStock Loss"}
                            RightSideData={gross_volume?.bunkered_volume}
                            RightSideTitle={"YTD Volume"}
                            statusValue={gross_volume?.status}
                            percentageValue={gross_volume?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ℓ"}
                            containerStyle={"dash-plates-1"}
                            xl={12}
                            tooltipContent={`WetStock Loss`}
                        />
                    </Col>
                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={fuel_sales?.gross_value}
                            leftSideTitle={"Delivery Loss "}
                            RightSideData={fuel_sales?.bunkered_value}
                            RightSideTitle={"YTD Volume"}
                            statusValue={fuel_sales?.status}
                            percentageValue={fuel_sales?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"£"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                            tooltipContent={`Delivery Loss`}
                        />
                    </Col>

                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={gross_margin?.gross_margin}
                            leftSideTitle={"Unknown Loss"}
                            RightSideData={gross_margin_bunkered?.gross_margin_bunkered}
                            RightSideTitle={"YTD Volume"}
                            statusValue={gross_margin?.status}
                            percentageValue={gross_margin?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ppl"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                            ppl_msg={gross_margin?.is_ppl == 1 ? gross_margin?.ppl_msg : ""}
                            tooltipContent={`Unknown Loss`}
                        />
                    </Col>
                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={gross_volume?.gross_volume}
                            leftSideTitle={"Gross Volume"}
                            RightSideData={gross_volume?.bunkered_volume}
                            RightSideTitle={"Bunkered Volume"}
                            statusValue={gross_volume?.status}
                            percentageValue={gross_volume?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ℓ"}
                            containerStyle={"dash-plates-1"}
                            xl={12}
                        />
                    </Col>
                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={fuel_sales?.gross_value}
                            leftSideTitle={"Fuel Sales (Ex. Vat)"}
                            RightSideData={fuel_sales?.bunkered_value}
                            RightSideTitle={"Bunkered Sales"}
                            statusValue={fuel_sales?.status}
                            percentageValue={fuel_sales?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"£"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                        />
                    </Col>

                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={gross_margin?.gross_margin}
                            leftSideTitle={"Gross Margin (Fuel)"}
                            RightSideData={gross_margin_bunkered?.gross_margin_bunkered}
                            RightSideTitle={"Gross (Bunkered)"}
                            statusValue={gross_margin?.status}
                            percentageValue={gross_margin?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ppl"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                            ppl_msg={gross_margin?.is_ppl == 1 ? gross_margin?.ppl_msg : ""}
                            tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
                        />
                    </Col>
                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={fuel_sales?.gross_value}
                            leftSideTitle={"Fuel Sales (Ex. Vat)"}
                            RightSideData={fuel_sales?.bunkered_value}
                            RightSideTitle={"Bunkered Sales"}
                            statusValue={fuel_sales?.status}
                            percentageValue={fuel_sales?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"£"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                        />
                    </Col>

                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={gross_margin?.gross_margin}
                            leftSideTitle={"Gross Margin (Fuel)"}
                            RightSideData={gross_margin_bunkered?.gross_margin_bunkered}
                            RightSideTitle={"Gross (Bunkered)"}
                            statusValue={gross_margin?.status}
                            percentageValue={gross_margin?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ppl"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                            ppl_msg={gross_margin?.is_ppl == 1 ? gross_margin?.ppl_msg : ""}
                            tooltipContent={`Gross Margin = (Gross Profit/Sales) * 100`}
                        />
                    </Col>


                </Row>

            </div >
            {/* ) : (
        <></>
      )} */}
        </div >
    );
};

export default TitanUppercards;
