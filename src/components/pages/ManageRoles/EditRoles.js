import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import {
  Breadcrumb,
  Card,
  Col,
  Dropdown,
  Form,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";


export default function EditRoles() {
  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Edit Roles</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Roles
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        {/* <div className="ms-auto pageheader-btn">
          <Link to="#" className="btn btn-primary btn-icon text-white me-3">
            <span>
              <i className="fe fe-plus"></i>&nbsp;
            </span>
            Add Role
          </Link>
         
        </div> */}
      </div>
      <Row>
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Edit Role Permissions</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className="col-lg-6 col-md-12">
                  <Form>
                    <FormGroup>
                      <Form.Label htmlFor="  Role" className="form-label">
                      Role
                      </Form.Label>
                      <input
                        type="text"
                        id="  Role"
                        className="form-control"
                        name="  Role"
                        placeholder="  Role"
                      />
                    </FormGroup>
                  </Form>
                </div>
              </Row>

              <Row>
                <form>
                  <div className="col-lg-12 col-md-12 p-0">
                    <div className="table-heading">
                      <h2>Roles</h2>
                    </div>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox1"
                    />
                    <label class="form-check-label" for="checkbox1">
                      Checkbox 1
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox2"
                    />
                    <label class="form-check-label" for="checkbox2">
                      Checkbox 2
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox3"
                    />
                    <label class="form-check-label" for="checkbox3">
                      Checkbox 3
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox4"
                    />
                    <label class="form-check-label" for="checkbox4">
                      Checkbox 4
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div className="col-lg-12 col-md-12 p-0">
                    <div className="table-heading">
                      <h2>User</h2>
                    </div>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox1"
                    />
                    <label class="form-check-label" for="checkbox1">
                      Checkbox 1
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox2"
                    />
                    <label class="form-check-label" for="checkbox2">
                      Checkbox 2
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox3"
                    />
                    <label class="form-check-label" for="checkbox3">
                      Checkbox 3
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox4"
                    />
                    <label class="form-check-label" for="checkbox4">
                      Checkbox 4
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div className="col-lg-12 col-md-12 p-0">
                    <div className="table-heading">
                      <h2>Team</h2>
                    </div>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox1"
                    />
                    <label class="form-check-label" for="checkbox1">
                      Checkbox 1
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox2"
                    />
                    <label class="form-check-label" for="checkbox2">
                      Checkbox 2
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox3"
                    />
                    <label class="form-check-label" for="checkbox3">
                      Checkbox 3
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox4"
                    />
                    <label class="form-check-label" for="checkbox4">
                      Checkbox 4
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div className="col-lg-12 col-md-12 p-0">
                    <div className="table-heading">
                      <h2>Integrate</h2>
                    </div>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox1"
                    />
                    <label class="form-check-label" for="checkbox1">
                      Checkbox 1
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox2"
                    />
                    <label class="form-check-label" for="checkbox2">
                      Checkbox 2
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox3"
                    />
                    <label class="form-check-label" for="checkbox3">
                      Checkbox 3
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox4"
                    />
                    <label class="form-check-label" for="checkbox4">
                      Checkbox 4
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div className="col-lg-12 col-md-12 p-0">
                    <div className="table-heading">
                      <h2>Rule</h2>
                    </div>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox1"
                    />
                    <label class="form-check-label" for="checkbox1">
                      Checkbox 1
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox2"
                    />
                    <label class="form-check-label" for="checkbox2">
                      Checkbox 2
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox3"
                    />
                    <label class="form-check-label" for="checkbox3">
                      Checkbox 3
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox4"
                    />
                    <label class="form-check-label" for="checkbox4">
                      Checkbox 4
                    </label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkbox5"
                    />
                    <label class="form-check-label" for="checkbox5">
                      Checkbox 5
                    </label>
                  </div>
                </form>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <button className="btn btn-primary me-2" type="submit">
                Save
              </button>
            </Card.Footer>
          </Card>
        </div>
      </Row>
    </>
  );
}
