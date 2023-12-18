import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Button } from "react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import Loaderimg from "../../Utils/Loader";

import { Slide, toast } from "react-toastify";

export function FormModal(props) {
  const { showModal, setShowModal } = props;

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };

  const ErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };

  const handleSubmit1 = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("site_id", props.PropsSiteId);
    formData.append("company_id", props.PropsCompanyId);
    formData.append("client_id", props.selectedClientId);
    formData.append("type", props.PropsFile);
    formData.append("file", values.image);
    formData.append("end_point", props.PropsFile);
    formData.append("drs_date", props.DRSDate);

    setIsLoading(true);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      let uploadEndpoint;
      console.log(props.PropsType, "props.PropsFile");
      if (props.PropsType === "HTECH") {
        uploadEndpoint = "/drs/htech-upload";
      } else if (props.PropsType === "PRISM") {
        uploadEndpoint = "/drs/prism-upload";
      } else {
      }

      const response = await fetch(`${baseUrl}${uploadEndpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log(response?.status, "columnIndex");

      if (response?.status == 200) {
        props.onSuccess(" Child message");
      }

      if (response.ok) {
        const data = await response.json();

        SuccessToast(data.message);

        handleClose();
      } else {
        const errorData = await response.json();
        ErrorToast(errorData.message);
        handleClose();
      }
    } catch (error) {
      console.log("Request Error:", error);
      // Handle request error
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);

    const reader = new FileReader();

    reader.readAsDataURL(file);
  };

  const handleDrop = (event, setFieldValue) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFieldValue("image", file);

    const reader = new FileReader();

    reader.readAsDataURL(file);
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <div>
        <Dialog open={showModal} onClose={handleClose}>
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
              validationSchema={Yup.object().shape({
                image: Yup.mixed()
                  .required("File is required")
                  .test("fileType", "Invalid file type", (value) => {
                    if (value) {
                      const allowedFileTypes = [
                        "text/csv",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      ];
                      return allowedFileTypes.includes(value.type);
                    }
                    return true;
                  }),
              })}
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
    </>
  );
}
