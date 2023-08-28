// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Slide,
// } from "@mui/material";
// import { Row, Col, Form, Card } from "react-bootstrap";
// import { Modal } from "react-bootstrap";
// import { useFormik } from "formik";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import Loaderimg from "../../Utils/Loader";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const CustomModal = ({
//   open,
//   onClose,
//   selectedItem,
//   selectedDrsDate,
//   onDataFromChild,
// }) => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [data, setData] = useState();
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   function handleError(error) {
//     if (error.response && error.response.status === 401) {
//       navigate("/login");
//       ErrorAlert("Invalid access token");
//       localStorage.clear();
//     } else if (error.response && error.response.data.status_code === "403") {
//       navigate("/errorpage403");
//     } else {
//       const errorMessage = Array.isArray(error.response.data.message)
//         ? error.response.data.message.join(" ")
//         : error.response.data.message;
//       ErrorAlert(errorMessage);
//     }
//   }
//   const ErrorAlert = (message) => {
//     toast.error(message, {
//       position: toast.POSITION.TOP_RIGHT,
//       hideProgressBar: true,
//       transition: Slide,
//       autoClose: 1000,
//       theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
//     });
//   };
//   // const SuccessAlert = (message) => toast.success(message);
//   const SuccessAlert = (message) => {
//     toast.success(message, {
//       autoClose: 1000,
//       position: toast.POSITION.TOP_RIGHT,
//       hideProgressBar: true,
//       transition: Slide,
//       autoClose: 1000,
//       theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
//     });
//   };

//   return (
//     <>
//       {isLoading ? <Loaderimg /> : null}
//       <Dialog
//         open={open}
//         onClose={onClose}
//         aria-labelledby="responsive-dialog-title"
//         maxWidth="100px"
//       >
//         {" "}
//         <span
//           style={{
//             width: "100%",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//           className="ModalTitle"
//         >
//           <div className="ModalTitle-date">Site Details</div>
//           <span onClick={onClose}>
//             <button className="close-button">
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//           </span>
//         </span>
//         {isLoading ? <Loaderimg /> : null}
//         <DialogContent>
//           <TableContainer></TableContainer>
//         </DialogContent>
//         <Card.Footer></Card.Footer>
//       </Dialog>
//     </>
//   );
// };

// export default CustomModal;
// const [modalOpen, setModalOpen] = useState(false);
// const [selectedItem, setSelectedItem] = useState(null);
// const [selectedItemDate, setSelectedItemDate] = useState();
// const handleModalOpen = (item) => {
//   setSelectedItem(item); // Set the selected item
//   setModalOpen(true);
// };

// const handleModalClose = () => {
//   setModalOpen(false);
// };
// <CustomModal open={modalOpen} onClose={handleModalClose} />;
// onClick = { handleModalOpen };
