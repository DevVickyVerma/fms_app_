import React from "react";
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  TableContainer,
} from "@mui/material";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loaderimg from "../../Utils/Loader";
import { useParams } from "react-router-dom";
import moment from "moment/moment";

import { useSelector } from "react-redux";
import useErrorHandler from "../../components/CommonComponent/useErrorHandler";

const CustomModal = ({
  open,
  onClose,
}) => {
  const [data, setData] = useState();
  const [month, setmonth] = useState();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const [previousId, setPreviousId] = useState(null);
  const userPermissions = useSelector((state) => state?.data?.data?.permissions || []);

  const { handleError } = useErrorHandler();
  useEffect(() => {
    if (id && id !== previousId) {
      setPreviousId(id); // Update the previousId to prevent multiple calls with the same id
      if (userPermissions?.includes("dashboard-site-stats")) {
        handleFuelChange(id);
      }
    }
    
  }, [id, userPermissions?.includes("dashboard-site-stats")]);

  const handleFuelChange = async () => {
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

  let stateData = JSON.parse(localStorage.getItem("localFilterModalData"));




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
            {stateData ? stateData?.site_name : "Site Name"}
            ( {month ? month : ""} Monthly
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
        <Card.Footer />
      </Dialog>
    </>
  );
};

export default CustomModal;
