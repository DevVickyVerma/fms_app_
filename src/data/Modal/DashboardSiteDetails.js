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
  siteName,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState();
  const [month, setmonth] = useState();
  const [loading, setLoading] = useState(false);

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
      setLoading(true); // Set loading to true before making the request
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
        setData(response?.data?.data);
        setmonth(response?.data?.data?.month);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Set loading to false whether the request succeeds or fails
    }
  };

  return (
    <>
      {loading ? <Loaderimg /> : null}
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
          <div className="ModalTitle-date">
            {siteName ? siteName : "Site Name"}( {month ? month : ""} Monthly
            Details)
          </div>
          <span onClick={onClose}>
            <button className="close-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </span>
        </span>
        <DialogContent>
          <TableContainer>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Business Day</th>

                    <th>Opening</th>
                    <th>Closing</th>
                    <th>First Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.listing && data.listing.length > 0 ? (
                    data?.listing.map((row, index) => (
                      <tr key={index}>
                        <td>{row.business_day}</td>
                        <td>
                          {moment(row?.opening).format("HH:mm:ss")} (
                          {moment(row?.opening).format("YYYY-MM-DD")})
                        </td>
                        <td>
                          {moment(row?.closing).format("HH:mm:ss")} (
                          {moment(row?.closing).format("YYYY-MM-DD")})
                        </td>
                        <td>
                          {moment(row?.first_trans).format("HH:mm:ss")} (
                          {moment(row?.first_trans).format("YYYY-MM-DD")})
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No data available..............</td>
                    </tr>
                  )}
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
