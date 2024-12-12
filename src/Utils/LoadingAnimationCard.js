import { Col } from "react-bootstrap";

const LoadingAnimationCard = ({ lg = 2 }) => {
  return (
    <>
      <Col lg={lg}>
        <div class="loading-anim-cards">
          <div class="loading-anim-card loading-anim-is-loading">
            <div class="loading-anim-image"></div>
            <div class="loading-anim-content">
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
