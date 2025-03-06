import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const BottomPageSlider = ({ cards, isMobile }) => {
    return isMobile ? (
        <Swiper
            spaceBetween={10}
            slidesPerView={1.5} // Adjust if needed
            pagination={{ clickable: true }}
            navigation
            modules={[Pagination, Navigation]}
        >
            {cards?.map(({ title, icon: Icon, bgColor, permission, onClick }, index) =>
                permission ? (
                    <SwiperSlide key={index}>
                        <Card
                            className="pointer ceocard-hover"
                            onClick={onClick}
                            style={{
                                backgroundColor: bgColor,
                                color: "#fff",
                                minHeight: "120px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <Icon size={40} />
                            <h5 className="m-0 mt-2">{title}</h5>
                        </Card>
                    </SwiperSlide>
                ) : null
            )}
        </Swiper>
    ) : (
        <Col lg={6}>
            <Row>
                {cards.map(({ title, icon: Icon, bgColor, permission, onClick }, index) =>
                    permission ? (
                        <Col md={6} key={index} onClick={onClick}>
                            <Card
                                className="pointer ceocard-hover"
                                style={{
                                    backgroundColor: bgColor,
                                    color: "#fff",
                                    minHeight: "120px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <Icon size={40} />
                                <h5 className="m-0 mt-2">{title}</h5>
                            </Card>
                        </Col>
                    ) : null
                )}
            </Row>
        </Col>
    );
};

export default BottomPageSlider;
