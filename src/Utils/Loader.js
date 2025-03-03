import { IonSpinner } from '@ionic/react';
import './Loader.css'; // Ensure the path is correct

const LoaderImg = () => (
  // <div id="global-loader" className="main-content">
  //   <div className="fullscreen">
  //     <div>
  //       <span className="custom-spinner" />
  //     </div>
  //   </div>
  // </div>
  <div id="global-mobile-loader" className="main-content">
    <div className="mobile-loader ">
      <IonSpinner name="lines"></IonSpinner>
    </div>
  </div>
);

export default LoaderImg;
