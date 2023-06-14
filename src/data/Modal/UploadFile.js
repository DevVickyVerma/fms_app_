import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export function FormModal(props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setError(event.target.value.trim() === "");
  };

  //   const handleSave = (values) => {
  //     if (values.image) {
  //       handleClose();
  //       setInputValue("");
  //       // Perform your desired logic with the uploaded image
  //       console.log(values.image);
  //     } else {
  //       setError(true);
  //     }
  //   };

  const handleSubmit1 = async (values) => {
    console.log(values.image);

    // try {
    //   const formData = new FormData();

    //   formData.append("logo", values.image);

    //   const postDataUrl = "/supplier/add";

    //   const navigatePath = "/ManageSuppliers";
    //   await postData(postDataUrl, formData, navigatePath); // Set the submission state to false after the API call is completed
    // } catch (error) {
    //   console.log(error); // Set the submission state to false if an error occurs
    // }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event, setFieldValue) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    setFieldValue("image", file);

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Button
        className="modal-effect d-grid mb-3"
        // href={`#${props.modalId}`}
        variant="danger"
        onClick={handleClickOpen}
      >
        {props.modalTitle}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {props.modalTitle}
          <Button onClick={handleClose} className="btn-close" variant="">
            x
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{props.modalContentText}</DialogContentText>

          <Formik
            initialValues={{
              image: null,
            }}
            onSubmit={(values) => {
              handleSubmit1(values);
            }}
          >
            {({ handleSubmit, errors, touched, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="image">Image</label>
                  <div
                    className={`dropzone ${
                      errors.image && touched.image ? "is-invalid" : ""
                    }`}
                    onDrop={(event) => handleDrop(event, setFieldValue)}
                    onDragOver={(event) => event.preventDefault()}
                  >
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                      className="form-control"
                    />
                    <p>Upload image here, or click to browse</p>
                  </div>
                  <ErrorMessage
                    component="div"
                    className="invalid-feedback"
                    name="image"
                  />
                </div>

                <div className="text-end">
                  <button className="btn btn-primary me-2 " type="submit">
                    Upload
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
