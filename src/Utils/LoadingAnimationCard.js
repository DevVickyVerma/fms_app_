import { Col } from "react-bootstrap";

const LoadingAnimationCard = ({ lg = 2 }) => {
  return (
    <>
      <Col lg={lg}>
        <div className="loading-anim-cards">
          <div className="loading-anim-card loading-anim-is-loading">
            <div className="loading-anim-image"></div>
            <div className="loading-anim-content">
              <h2></h2>
              <p></p>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default LoadingAnimationCard;
