import { useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loaderimg from "../../Utils/Loader";
import { Slide, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export function FormModal(props) {
  const { showModal, setShowModal, modalTitle } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const SuccessToast = (message) => {
    toast.success(message, {
      autoClose: 1000,
      // position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      theme: "colored", // Set the duration in milliseconds (e.g., 3000ms = 3 seconds)
    });
  };

  const ErrorToast = (message) => {
    toast.error(message, {
      // position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true,
      transition: Slide,
      autoClose: 1000,
      theme: "colored", // Set the duration in milliseconds (e.g., 5000ms = 5 seconds)
    });
  };

  const handleSubmit1 = async (values) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    setIsLoading(true);

    const storedKeyName = "localFilterModalData";
    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      formData.append("site_id", parsedData?.site_id);
      formData.append("client_id", parsedData?.client_id);
      formData.append("company_id", parsedData?.company_id);
      formData.append("drs_date", parsedData?.start_date);
      formData.append("type", props.PropsFile);
      formData.append("file", values.image);
      formData.append("end_point", props.PropsFile);

    }

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      let uploadEndpoint;
      if (props.PropsType === "HTECH") {
        uploadEndpoint = "/drs/htech-upload";
      } else if (props.PropsType === "PRISM") {
        uploadEndpoint = "/drs/prism-upload";
      } else if (props.PropsType === "EDGEPoS") {
        uploadEndpoint = "/drs/edgepos-upload";
      } else {
      }

      const response = await fetch(`${baseUrl}${uploadEndpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });


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
      console.error("Request Error:", error);
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

        <Modal show={showModal} onHide={handleClose} centered className='dashboard-center-modal' >

          <div >
            <Modal.Header
              style={{
                color: "#fff",
              }}
              className='p-0 m-0 d-flex justify-content-between align-items-center'
            >

              <span className="ModalTitle d-flex justify-content-between w-100  fw-normal"  >
                <span>
                  {props.modalContentText}
                  {modalTitle}
                </span>
                <span onClick={handleClose} >
                  <button className="close-button">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              </span>
            </Modal.Header>
            <Card.Body>
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
                      <label htmlFor="image">File</label>
                      <div
                        className={`dropzone ${errors.image && touched.image ? "is-invalid" : ""
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
                        <p className="small mt-1">Upload File here, or click to browse</p>
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
            </Card.Body>

          </div>
        </Modal>


      </div>
    </>
  );
}
