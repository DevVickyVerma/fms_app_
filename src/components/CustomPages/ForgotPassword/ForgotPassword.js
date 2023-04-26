import React from "react";
import { Link } from "react-router-dom";
import {Row,Col, Card, Form} from "react-bootstrap"
export default function ForgotPassword() {
  return (
    <div className="login-img">
      <div className="page">


        {/* <div className="dropdown float-end custom-layout">
          <div
            className="demo-icon nav-link icon mt-4 bg-primary"
            onClick={() => custompagesswitcherdata.Swichermainright()}
          >
            <i className="fe fe-settings fa-spin text_primary"></i>
          </div>
        </div> */}
        <div className="">
          <div
            className="col col-login mx-auto"
           
          >
            <div className="text-center">
              <img
                src={require("../../../assets/images/brand/logo.png")}
                className="header-brand-img"
                alt=""
              />
            </div>
          </div>
          <div className="container-login100">
            <Row>
              <Col className=" col-login mx-auto">
                <Form className="card shadow-none" method="post">
                  <Card.Body>
                    <div className="text-center">
                      <span className="login100-form-title">
                        Forgot Password
                      </span>
                      <p className="text-muted">
                        Enter the email address registered on your account
                      </p>
                    </div>
                    <div className="pt-3" id="forgot">
                      <div className="form-group">
                        <label className="form-label">E-Mail</label>
                        <input
                          className="form-control"
                          placeholder="Enter Your Email"
                          type="email"
                        />
                      </div>
                      <div className="submit">
                        <Link
                          to={`${process.env.PUBLIC_URL}/dashboard/`}
                          className="btn btn-primary d-grid"
                        >
                          Submit
                        </Link>
                      </div>
                     
                    </div>
                  </Card.Body>
                 
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
