


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { formatNumber } from '../../Utils/commonFunctions/commonFunction';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const CardSwiper = ({
    dashboardData,
    navigattionPath,
    callStatsBoxParentFunc,
    parentComponent = true,
    cardsData = [],

}) => {

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

                if (parsedData?.company_id && parsedData?.client_id && navigattionPath) {
                    navigate(navigattionPath);
                } else {
                    callStatsBoxParentFunc();
                }
            }
        } else if (!ApplyFilterrequired && !isDetailPermissionAvailable) {
        }
    };


    return (
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={15}
            slidesPerView={1}

            pagination={{ clickable: true }}
            style={{ padding: "20px", paddingLeft: "2px" }}

        >
            {cardsData?.map((card) => (
                <SwiperSlide key={card.id}>
                    <div className="rounded-lg shadow-lg border-0"
                        onClick={parentComponent ? handleNavigateClick : undefined}
                        // background: linear-gradient(to right, #08469F, #08469f8a);
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #08469F, #08469f8a)',
                            color: "white",
                            borderRadius: "6px",
                            padding: "30px 20px",
                            showIcon: false,
                        }}>
                        <div className="d-flex justify-content-between align-items-center">

                            {/* Left Side Data */}
                            <div>
                                <h4 className="mb-1 fw-bold"><span className="l-sign">{card?.icon}</span>

                                    {card?.value
                                        ? formatNumber(card?.value)
                                        : "0.0"}

                                </h4>
                                <p className="mb-1">{card.title}</p>

                            </div>

                            {/* Right Side Data (if available) */}
                            {card.subValue && (

                                <div>
                                    <h4 className="mb-1 fw-bold"> <span className="l-sign">{card?.icon}</span>{""}

                                        {card?.subValue
                                            ? formatNumber(card?.subValue)
                                            : "0.0"}



                                    </h4>
                                    <p className="mb-1">{card.subTitle}</p>

                                </div>
                            )}

                            {/* Optional Icon */}
                            {/* {showIcon && (
                                <div className="bg-white p-3 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "50px", height: "50px", position: "absolute", top: "10px", right: "10px" }}>
                                    {icon}
                                </div>
                            )} */}
                        </div>
                        <p className="mt-2 d-flex align-items-center">
                            {card.status === "up" ?
                                <span className="text-success me-2">▲</span> :
                                <span className="text-danger me-2">▼</span>
                            }
                            {card.percentage}  Last Month
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CardSwiper;

