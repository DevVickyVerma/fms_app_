import axios from "axios";
import { ErrorMessage, Field } from "formik";
import React, { useEffect, useState } from "react";
import { Modal, Button, Dropdown, FormGroup, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Details(props) {
  const [showModal, setShowModal] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [propsSiteId, setpropsSiteId] = useState(props.SiteId);
  const [SelectdropdownValue, setSelectDropdownValue] = useState("");
  const navigate = useNavigate();
  const SuccessAlert = (message) => toast.success(message);
  const ErrorAlert = (message) => toast.error(message);

  const handleDropdownChange = (event) => {
    console.log(event.target.value, "site_name");
    setSelectDropdownValue(event.target.value)
  };
  

  const Submitform = async () => {
    setShowModal(false);
    const token = localStorage.getItem("token");
  
    const formData = new FormData();
    formData.append("id", props.SiteId);
    formData.append("client_id", SelectdropdownValue);
  
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    try {
      const response = await axiosInstance.post("/site/assign", formData);
  
      if (response.data && response.data.data) {
        console.log(response.data.data);
        // setSideDataobject(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
        toast.error("Invalid access token");
        localStorage.clear();
      } else if (error.response && error.response.status === 422) {
        console.log("error");
        ErrorAlert("This site is already assigned. Please assign it to another client.");
      } else if (error.response && error.response.status === 403) {
        navigate("/errorpage403");
      } else if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        console.error(error);
        toast.error("An error occurred");
      }
    }
  };
  
  // Submitform();
  

  useEffect(() => {
    if (props.sites) {
      setDropdownValue(props.sites);
    }
  }, [props.sites]);

  return (
    <>
      <Button
        className="btn btn-primary btn-sm rounded-11 me-2"
        onClick={() => setShowModal(true)}
      >
        <i>
          <svg
            className="table-Details"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            height="20"
            width="16"
          >
            <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
          </svg>
        </i>
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalHeading || "Modal Heading"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {Array.isArray(dropdownValue) ? (
            <select
              id="assignClient"
              className="form-select"
              onChange={handleDropdownChange}
              required
            >
              <option value="">Select a Client</option>
              {dropdownValue.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.client_name}
                </option>
              ))}
            </select>
          ) : (
            <p>Error loading dropdown values</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowModal(false)}>
            {props.cancelButtonText || "Close"}
          </Button>
          <Button variant="primary" onClick={() => Submitform()}>
            {props.saveButtonText || "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Details;
