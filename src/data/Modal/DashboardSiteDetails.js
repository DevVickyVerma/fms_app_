import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Slide,
} from "@mui/material";
import { Row, Col, Form, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import moment from "moment/moment";

const CustomModal = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  function handleError(error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
      ErrorAlert("Invalid access token");
      localStorage.clear();
    } else if (error.response && error.response.data.status_code === "403") {
      navigate("/errorpage403");
    } else {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(" ")
        : error.response.data.message;
      ErrorAlert(errorMessage);
    }
  }
  const ErrorAlert = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };
  // const SuccessAlert = (message) => toast.success(message);
  const SuccessAlert = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };
  const { id } = useParams();
  const [previousId, setPreviousId] = useState(null);

  useEffect(() => {
    if (id && id !== previousId) {
      setPreviousId(id); // Update the previousId to prevent multiple calls with the same id
      handleFuelChange(id);
    }
  }, [id]);

  const handleFuelChange = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axiosInstance.get(
        `/dashboard/get-site-info?site_id=${id}`
      );

      if (response) {
        console.log(
          response?.data?.data?.listing?.created_date,
          "axiosInstance"
        );
        setData(response?.data?.data?.listing);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const renderStatusButton = (status) => {
    if (status === 1) {
      return <button className="btn btn-success btn-sm">Active</button>;
    } else if (status === 0) {
      return <button className="btn btn-danger btn-sm">Inactive</button>;
    } else {
      return <button className="badge">Unknown</button>;
    }
  };
  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="100px"
      >
        {" "}
        <span
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
          className="ModalTitle"
        >
          <div className="ModalTitle-date">Site Details</div>
          <span onClick={onClose}>
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>
        {isLoading ? <Loaderimg /> : null}
        <DialogContent>
          <TableContainer>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th className="text-center">S.No</th>
                    <th>Business Day</th>
                    <th>Created Date</th>
                    <th>First Transactions</th>
                    <th>Opening</th>
                    <th>Closing</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((row, index) => (
                    <tr key={index}>
                      {/* <td className="text-center">{index + 1}</td> */}
                      <td>{row?.business_day}</td>
                      {/* <td>{row?.created_date}</td> */}
                      <td>{moment(row?.first_trans).format("HH:mm:ss")}</td>
                      <td>{moment(row?.opening).format("HH:mm:ss")}</td>
                      <td>{moment(row?.closing).format("HH:mm:ss")}</td>
                      {/* <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Status</Tooltip>}
                        >
                          {renderStatusButton(row?.status)}
                        </OverlayTrigger>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableContainer>
        </DialogContent>
        <Card.Footer></Card.Footer>
      </Dialog>
    </>
  );
};

export default CustomModal;
