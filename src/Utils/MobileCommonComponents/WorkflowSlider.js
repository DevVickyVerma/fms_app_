import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { Card } from "react-bootstrap";

const WorkflowSlider = ({ DataEnteryList, selectedItem, handleEnteryClick }) => {
    return (
        <Swiper
            slidesPerView={1} // Adjust based on screen size
            spaceBetween={10}
            navigation={true}
            pagination={{ clickable: true }}
            breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
        >
            {DataEnteryList && DataEnteryList.length > 0 ? (
                DataEnteryList.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Card
                            className={`text-white ${item.bgColor === "amber"
                                ? "bg-card-amber"
                                : item.bgColor === "green"
                                    ? "bg-card-green"
                                    : item.bgColor === "red"
                                        ? "bg-card-red"
                                        : "bg-primary"
                                }`}
                        >
                            <Card.Body
                                className={`card-Div ${selectedItem === item ? "dsr-selected" : ""
                                    }`}
                                onClick={() => handleEnteryClick(item)}
                            >
                                <h4 className="card-title">{item.name}</h4>
                            </Card.Body>
                        </Card>
                    </SwiperSlide>
                ))
            ) : (
                <SwiperSlide>
                    <img
                        src={require("../../assets/images/commonimages/no_data.png")}
                        alt="No Data"
                        className="all-center-flex nodata-image"
                    />
                </SwiperSlide>
            )}
        </Swiper>
    );
};

export default WorkflowSlider;
