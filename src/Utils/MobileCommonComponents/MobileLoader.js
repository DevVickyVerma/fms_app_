import { IonSpinner } from '@ionic/react';
import '../../Utils/Loader.css'; // Ensure the path is correct

const MobileLoader = () => (
    <div id="global-mobile-loader" className="main-content">
        <div className="mobile-loader">
            <IonSpinner name="lines"></IonSpinner>
        </div>
    </div>
);

export default MobileLoader;
