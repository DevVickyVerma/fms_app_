import React from "react";
import { Col } from "react-bootstrap";

const TitanCardLoading = ({ lg = 3 }) => {
    return (
        <Col lg={lg}>
            <div className="animated-card-wrapper">
                <div className="loading-anim-cards">
                    <div className="loading-anim-card loading-anim-is-loading">
                        {/* <div className="loading-anim-image"></div> */}
                        <div className="loading-anim-content">
                            <p></p>
                            <h2></h2>

                        </div>
                    </div>
                </div>
                <style jsx>{`
                .animated-card-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 20px;
                }

                .loading-card {
                    width: 300px;
                    height: 200px;
            
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    position: relative;
                }

                .loading-card-header {
                         height: 150px;
                    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                    animation: loadingShine 1.5s linear infinite;
                }

                .loading-card-body .loading-title {
                    height: 20px;
                    width: 60%;
                    margin: 10px auto;
                    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                    animation: loadingShine 1.5s linear infinite;
                    border-radius: 5px;
                }

                .loading-card-body .loading-line {
                    height: 15px;
                    width: 80%;
                    margin: 5px auto;
                    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
                    animation: loadingShine 1.5s linear infinite;
                    border-radius: 5px;
                }

                .loading-card-body .loading-line.short {
                    width: 40%;
                }

                @keyframes loadingShine {
                    to {
                        background-position-x: -200%;
                    }
                }
            `}</style>
            </div>
        </Col>
    );
};

export default TitanCardLoading;
