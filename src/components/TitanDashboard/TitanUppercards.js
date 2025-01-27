import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TitanCommonCards from "./TitanCommonCards";

const TitanUppercards = (props) => {
    const {
        wet_stock_value,
        delivery_loss_value,
        unkonwn_loss_value,
        wet_stock_volume,
        delivery_loss_volume,
        unkonwn_loss_volume,
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
    console.log(wet_stock_value, "wet_stock_value");
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
                            leftSideData={wet_stock_volume?.value}
                            leftSideTitle={"WetStock Loss"}
                            RightSideData={wet_stock_volume?.ytd_value}
                            RightSideTitle={"YTD Volume"}
                            statusValue={wet_stock_volume?.status}
                            percentageValue={wet_stock_volume?.percentage}
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
                            leftSideData={delivery_loss_volume?.value}
                            leftSideTitle={"Delivery Loss "}
                            RightSideData={delivery_loss_volume?.ytd_value}
                            RightSideTitle={"YTD Volume"}
                            statusValue={delivery_loss_volume?.status}
                            percentageValue={delivery_loss_volume?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ℓ"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                            tooltipContent={`Delivery Loss`}
                        />
                    </Col>

                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={unkonwn_loss_volume?.value}
                            leftSideTitle={"Unknown Loss"}
                            RightSideData={unkonwn_loss_volume?.ytd_value}
                            RightSideTitle={"YTD Volume"}
                            statusValue={unkonwn_loss_volume?.status}
                            percentageValue={unkonwn_loss_volume?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ℓ"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}

                            tooltipContent={`Unknown Loss`}
                        />
                    </Col>
                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={"0.00"}
                            leftSideTitle={"Dips Stock"}
                            RightSideData={"0.00"}
                            RightSideTitle={"YTD Volume"}
                            statusValue={unkonwn_loss_volume?.status}
                            percentageValue={unkonwn_loss_volume?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"ℓ"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}

                            tooltipContent={`Dips Stock`}
                        />
                    </Col>

                    {/* //pounds */}

                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={wet_stock_value?.value}
                            leftSideTitle={"WetStock Loss"}
                            RightSideData={wet_stock_value?.ytd_value}
                            RightSideTitle={"YTD Value"}
                            statusValue={wet_stock_value?.status}
                            percentageValue={wet_stock_value?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"£"}
                            containerStyle={"dash-plates-1"}
                            xl={12}
                            tooltipContent={`WetStock Loss`}
                        />
                    </Col>
                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={delivery_loss_value?.value}
                            leftSideTitle={"Delivery Loss "}
                            RightSideData={delivery_loss_value?.ytd_value}
                            RightSideTitle={"YTD Value"}
                            statusValue={delivery_loss_value?.status}
                            percentageValue={delivery_loss_value?.percentage}
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
                            leftSideData={unkonwn_loss_value?.value}
                            leftSideTitle={"Unknown Loss"}
                            RightSideData={unkonwn_loss_value?.ytd_value}
                            RightSideTitle={"YTD Value"}
                            statusValue={unkonwn_loss_value?.status}
                            percentageValue={unkonwn_loss_value?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"£"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}
                            tooltipContent={`Unknown Loss`}
                        />
                    </Col>

                    <Col lg={3}>
                        <TitanCommonCards
                            isParentComponent={parentComponent}
                            showRightSide={true}
                            leftSideData={"0.00"}
                            leftSideTitle={"Dips Stock"}
                            RightSideData={"0.00"}
                            RightSideTitle={"YTD Volume"}
                            statusValue={unkonwn_loss_volume?.status}
                            percentageValue={unkonwn_loss_volume?.percentage}
                            handleNavigateClick={handleNavigateClick}
                            icon={"£"}
                            containerStyle={"dash-plates-3 "}
                            xl={12}

                            tooltipContent={`Dips Stock`}
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
