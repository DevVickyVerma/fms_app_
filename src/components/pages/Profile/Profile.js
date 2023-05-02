import React from "react";
import * as profiledata from "../../../data/Pages/profiledata/profiledata";
import user8 from "../../../assets/images/users/8.jpg";
import user15 from "../../../assets/images/users/15.jpg";
import user18 from "../../../assets/images/users/18.jpg";
import user2 from "../../../assets/images/users/2.jpg";
import user20 from "../../../assets/images/users/20.jpg";
import user12 from "../../../assets/images/users/12.jpg";
import user4 from "../../../assets/images/users/4.jpg";
import user9 from "../../../assets/images/users/9.jpg";
import user6 from "../../../assets/images/users/6.jpg";
import user3 from "../../../assets/images/users/3.jpg";
import { Tabs, Tab, Breadcrumb, Card,Row,Col,Table } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function Profile() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Pages
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Profile
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
       
      </div>

      <Row id="user-profile">
        <Col lg={12}>
          <Card className=" bg-transparent shadow-none border-0">
            <Card.Body className=" bg-white">
              <div className="wideget-user">
                <Row>
                  <Col lg={12} md={12} xl={6}>
                    <div className="wideget-user-desc d-sm-flex">
                      <div className="wideget-user-img">
                        <img className="" src={user8} alt="img" />
                      </div>
                      <div className="user-wrap">
                      
                        <h4>{localStorage.getItem('UserName') ?  localStorage.getItem('UserName') : "Elizabeth Dyer"} </h4>
                        <h6 className="text-muted mb-3">
                        {localStorage.getItem('Role') ?  localStorage.getItem('Role') : "Administrator"}
                        </h6>
                       
                      </div>
                    </div>
                  </Col>
                  <Col lg={12} md={12} xl={6}>
                    <div className="text-xl-right mt-4 mt-xl-0">
                      
                      <Link
                        to={`/editprofile`}
                        className="btn btn-primary me-1"
                      >
                        Edit Profile
                      </Link>
                    </div>
                   
                  </Col>
                </Row>
              </div>
            </Card.Body>
            <div className="border-top ">
              <div className="wideget-user-tab">
                <div className="tab-menu-heading">
                  <div className="tabs-menu1 profiletabs">
                    <Tabs
                      variant="Tabs"
                      defaultActiveKey="Profile"
                      id=" tab-51"
                      className="tab-content tabesbody "
                    >
                      <Tab eventKey="Profile" title="Profile">
                        <div className="tab-pane profiletab show">
                          <div id="profile-log-switch">
                            <Card>
                              <Card.Body className="bg-white">
                                <div className="media-heading">
                                  <h5>
                                    <strong>Personal Information</strong>
                                  </h5>
                                </div>
                                <div className="table-responsive p-1">
                                  <Table className="table row table-borderless">
                                    <tbody className="col-lg-12 col-xl-6 p-0">
                                      <tr>
                                        <td>
                                          <strong>Full Name :</strong> Elizabeth
                                          Dyer
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <strong>Location :</strong> USA
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <strong>Languages :</strong> English,
                                          German, Spanish.
                                        </td>
                                      </tr>
                                    </tbody>
                                    <tbody className="col-lg-12 col-xl-6 p-0">
                                      <tr>
                                        <td>
                                          <strong>Website :</strong> abcdz.com
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <strong>Email :</strong>
                                          georgemestayer@abcdz.com
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <strong>Phone :</strong> +125 254 3562
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </div>
                                <Row className="row profie-img">
                                  <Col md={12}>
                                    <div className="media-heading">
                                      <h5>
                                        <strong>Biography</strong>
                                      </h5>
                                    </div>
                                    <p>
                                      Nam libero tempore, cum soluta nobis est
                                      eligendi optio cumque nihil impedit quo
                                      minus id quod maxime placeat facere
                                      possimus, omnis voluptas assumenda est,
                                      omnis dolor repellendus
                                    </p>
                                    <p className="mb-0">
                                      because it is pleasure, but because those
                                      who do not know how to pursue pleasure
                                      rationally encounter but because those who
                                      do not know how to pursue consequences
                                      that are extremely painful. Nor again is
                                      there anyone who loves or pursues or
                                      desires to obtain pain of itself, because
                                      it is pain, but because occasionally
                                      circumstances occur in which toil and pain
                                      can procure him some great pleasure.
                                    </p>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      </Tab>
                     
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
