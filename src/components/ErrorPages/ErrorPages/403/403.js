import React from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Errorpage403() {

  const navigate = useNavigate()
  const handleNavigate = () => {
    localStorage.clear()
    navigate('/login')
  }


  return (
    <div className="error-bg">
      <div className="page">
        <div className="page-content error-page error2" >
          <div className="container text-center">
            <div className="error-template">
              <h1 className="display-1 text-dark mb-2">
                403<span className="fs-20">error</span>
              </h1>
              <h5 className="error-details text-dark">
                Sorry, an error has occured, You do not have the required permissions!
              </h5>
              <div className="text-center">
                <Link
                  to={`/dashboard/`}
                  className="btn btn-primary mt-5 mb-5"
                >

                  <i className="fa fa-long-arrow-left"></i> Back to Home
                </Link>
                <div
                  // to={`/dashboard/`}
                  onClick={handleNavigate}
                  className="btn btn-primary mt-5 ms-2 mb-5"
                >
                  {/* <i className="fa fa-long-arrow-left"></i> */}
                  Back to Login Page
                  <i className="ph ph-sign-in ms-1 login-403"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
