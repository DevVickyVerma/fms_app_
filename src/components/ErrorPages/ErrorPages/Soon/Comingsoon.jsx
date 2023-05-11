import React from "react";
import { Link } from "react-router-dom";
import * as custompagesswitcherdata from "../../../../data/Switcher/Custompagesswitcherdata";

export default function Comingsoon() {
  return (
    <div className="jsx">
      <div className="page1 ">
        <div className="page-content error-page error2">
          <div className="container text-center">
            <div className="card">
              <div className="card-body ">
                {/* <h1 className="display-1 text-dark mb-2 error-bg">
                  Coming <br></br> soon
                </h1> */}
                {/* <img
                          src={require("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fcoming-soon&psig=AOvVaw20boiyt4D2lYui7SkDH46w&ust=1683870274052000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNDVn97H7P4CFQAAAAAdAAAAABAJ")}
                          alt=""
                          id="bgimage2"
                        /> */}
                <img
                  src="https://img.freepik.com/free-vector/abstract-coming-soon-halftone-style-background-design_1017-27282.jpg"
                  alt="Example Image"
                />
                {/* <div className="text-center">
                  <Link
                    to={`/dashboard/`}
                    className="btn btn-primary mt-5 mb-5"
                  >
                    <i className="fa fa-long-arrow-left"></i> Back to Home
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
