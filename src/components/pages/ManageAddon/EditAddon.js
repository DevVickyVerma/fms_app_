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
import axios from "axios";
import { useLocation } from 'react-router-dom';

export default function EditAddon() {
  const [roles, setRoles] = useState([]);
  const [addonDetails, setAddonDetails] = useState();


  useEffect(() => {
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    axiosInstance.post("/permission-list")
      .then((response) => {
       
        const rolesList = response.data.data.map((item) => ({
          id: item.id,
          name: item.display_name,
        }));
        setRoles(rolesList);
      })
      .catch((error) => console.log(error));
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const addon_id = localStorage.getItem("EditAddon");

    const formData = new FormData();
    formData.append("addon_id", addon_id);

    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    axiosInstance.post("/addon-detail", formData)
      .then((response) => {

        if(response.data){
          console.log(response.data.data,"response");
          setAddonDetails(response.data.data)
          console.log(addonDetails.name,"addonDetails")
        }
      
       
      })
      .catch((error) => {
        console.log(error);
    
      });
  }, []);








  const handleSave = () => {
    const checkedRoles = roles.filter((role) => {
      const checkbox = document.getElementById(`checkbox-${role.id}`);
      return checkbox.checked;
    });
    console.log(checkedRoles);
  };
  

  return (
    <>
      <div className="page-header ">
        <div>
          <h1 className="page-title">Edit Addon</h1>
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item className="breadcrumb-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="breadcrumb-item active breadcrumds"
              aria-current="page"
            >
              Edit Addon
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
              <h4 className="card-title">Edit Addon</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <div className="col-lg- col-md-12">
                  <form>
                  <FormGroup>
                      <Form.Label htmlFor="  Role" className="form-label">
                      Edit Addon
                      </Form.Label>
                      <input
                        type="text"
                        id="  Addon"
                        className="form-control"
                        name="  Addon"
                        placeholder=" Addon"
                        //  
                      />
                    </FormGroup>
                    <div className="col-lg-12 col-md-12 p-0">
                      <div className="table-heading">
                        <h2>Roles</h2>
                      </div>
                    </div>
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="form-check form-check-inline"
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={role.id}
                          id={`checkbox-${role.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`checkbox-${role.id}`}
                        >
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </Row>

             
            </Card.Body>
            <Card.Footer className="text-end">
            <button className="btn btn-primary me-2" type="button" onClick={handleSave}>
          Save
        </button>
            </Card.Footer>
          </Card>
        </div>
      </Row>
    </>
  );
}
