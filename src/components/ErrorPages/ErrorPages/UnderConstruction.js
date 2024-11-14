import { useEffect, useState } from 'react';
import withApi from "../../../Utils/ApiHelper";
import Loaderimg from "../../../Utils/Loader";
import { useNavigate } from "react-router-dom";
import useErrorHandler from '../../CommonComponent/useErrorHandler';
const UnderConstruction = (props) => {
  const { handleError } = useErrorHandler();
  const { getData } = props;

  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();


  const GetDetails = async () => {
    setLoading(true);
    try {
      const response = await getData(`/detail`);
      if (response) {
        navigate(response?.data?.data?.route);
        setLoading(false);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetDetails();
  }, []);


  return (
    <>
      {isLoading ? <Loaderimg /> : null}

      <div className="error-bg w-100 h-100">
        <div className="page">
          <div className="page-content error-page error2">
            <div className="container text-center">
              <div className="error-template">
                <div>
                  <h4>
                    This site is temporarily unavailable due to maintenance.
                    Please try again later...
                  </h4>
                  <img
                    src={require("../../../assets/images/under-construction/under-constuction.jpg")}
                    alt="MyChartImage"
                    className="all-center-flex nodata-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default withApi(UnderConstruction);
