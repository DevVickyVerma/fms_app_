import React from "react";
import * as formelement from "../../../data/Form/formelement/formelement";
import * as editprofile from "../../../data/Pages/editprofile/editprofile";
import { Link } from "react-router-dom";
import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  FormControl,
  ListGroup,
  Breadcrumb,
} from "react-bootstrap";

import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function EditProfile() {

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Required"),
    newPassword: Yup.string()
      .required("Required")
      .min(8, "Must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: Yup.string()
      .required("Required")
      .test(
        "password-match",
        "Passwords do not match",
        function (value) {
          return value === this.parent.newPassword;
        }
      ),
  });
  
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  
  function validate(values) {
    const errors = {};
  
    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    return errors;
  }




  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Profile</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Pages
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Profile
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Row>
        <Col lg={12} xl={4} md={12} sm={12}>
        <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={validate}
      onSubmit={(values) => {
        console.log(values, "values");
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Card className="profile-edit">
            <Card.Header>
              <Card.Title>Edit Password</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <img
                  alt="User Avatar"
                  className="rounded-circle avatar-lg me-2"
                  src={require("../../../assets/images/users/8.jpg")}
                />
              </div>
              <FormGroup>
                <Form.Label className="form-label">
                  Current Password
                </Form.Label>
                <Field
                  type="password"
                  className="form-control"
                  name="currentPassword"
                />
                <ErrorMessage name="currentPassword" component="div" className="error" />
              </FormGroup>
              <FormGroup>
                <Form.Label className="form-label">New Password</Form.Label>
                <Field
                  type="password"
                  className="form-control"
                  name="newPassword"
                />
                <ErrorMessage name="newPassword" component="div" className="error" />
              </FormGroup>
              <FormGroup>
                <Form.Label className="form-label">
                  Confirm Password
                </Form.Label>
                <Field
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </FormGroup>
            </Card.Body>
            <Card.Footer className="text-end">
              <button type="submit" className="btn btn-primary me-2">
                Update
              </button>
            </Card.Footer>
          </Card>
        </Form>
      )}
    </Formik>

          <Card className="panel-theme">
            <Card.Header>
              <div className="float-start">
                <Card.Title as="h3">Contact</Card.Title>
              </div>
              <div className="clearfix"></div>
            </Card.Header>
            <Card.Body className="no-padding">
              <ListGroup className="no-margin">
                <ListGroup.Item className="list-group-item">
                  <i className="fa fa-envelope list-contact-icons border text-center br-100"></i>
                  <span className="contact-icons">support@demo.com</span>
                </ListGroup.Item>
                <ListGroup.Item className="list-group-item">
                  <i className="fa fa-globe list-contact-icons border text-center br-100"></i>
                  <span className="contact-icons"> www.abcd.com</span>
                </ListGroup.Item>
                <ListGroup.Item className="list-group-item">
                  <i className="fa fa-phone list-contact-icons border text-center br-100"></i>
                  <span className="contact-icons">+125 5826 3658 </span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} xl={8} md={12} sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3">Edit Profile</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6} md={12}>
                  <FormGroup>
                    <label htmlFor="exampleInputname">First Name</label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputname"
                      placeholder="First Name"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6} md={12}>
                  <FormGroup>
                    <label htmlFor="exampleInputname1">Last Name</label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputname1"
                      placeholder="Enter Last Name"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup className="mt-2">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <Form.Control
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="email address"
                />
              </FormGroup>
              <FormGroup className="mt-2">
                <label htmlFor="exampleInputnumber">Conatct Number</label>
                <Form.Control
                  type="number"
                  className="form-control"
                  id="exampleInputnumber"
                  placeholder="ph number"
                />
              </FormGroup>
              <FormGroup>
                <Form.Label className="form-label">About Me</Form.Label>
                <textarea
                  className="form-control"
                  rows="6"
                  defaultValue="My bio........."
                ></textarea>
              </FormGroup>
              <FormGroup>
                <Form.Label className="form-label">Website</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="http://splink.com"
                />
              </FormGroup>
              <FormGroup>
                <Form.Label className="form-label">Date Of Birth</Form.Label>
                <Row>
                  <Col md={4}>
                    <formelement.Selectdate />
                  </Col>
                  <Col md={4}>
                    <formelement.Dateofbirth />
                  </Col>
                  <Col md={4}>
                    <formelement.Selectyear />
                  </Col>
                </Row>
              </FormGroup>
            </Card.Body>
            <Card.Footer className="text-end">
              <Link to="#" className="btn btn-success mt-1 me-2">
                Save
              </Link>
              <Link to="#" className="btn btn-danger mt-1 me-2">
                Cancel
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
