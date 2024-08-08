import { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import LoaderImg from "../../../Utils/Loader";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { handleError } from "../../../Utils/ToastUtils";
import { FileUploader } from "react-drag-drop-files";
import { FaFileUpload } from "react-icons/fa";
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


const CoffeeAndValetUploadInvoice = (props) => {
    const { showModal, setShowModal, invoiceCallData, getData, detailApiData, isLoading, postData, apidata } = props;

    const [customLoading, setCustomLoading] = useState(false);
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const fileTypes = ["JPEG", "PNG", "JPG",];

    useEffect(() => {
        if (showModal) {
            FetchmannegerList()
        }
    }, [showModal])


    const formik = useFormik({
        initialValues: {},
        // validationSchema: validationSchema,
        onSubmit: (values) => {
            // handleSubmit1(values);
        },
    });



    const FetchmannegerList = async () => {
        try {
            const response = await getData(`valet-coffee/file-list?site_id=${invoiceCallData?.site_id}&drs_date=${invoiceCallData?.start_date}&department_item_id=${invoiceCallData?.selectedRow?.department_item_id}`);

            if (response && response.data && response?.data?.data) {
                formik.setValues(response?.data?.data)
                formik.setFieldValue("uploadedFiles", [])
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this item!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append("id", id);

                Deletehidecategory(formData);
            }
        });
    };
    const Deletehidecategory = async (formData) => {
        try {
            const response = await postData("/valet-coffee/delete-file", formData);
            // Console log the response
            if (apidata.api_response === "success") {
                FetchmannegerList()
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleChangeDocumentUpload = (newFiles) => {

        formik.setFieldValue("uploadedFiles", [...formik?.values?.uploadedFiles, ...newFiles]);

    };

    const handleRemove = (indexToRemove) => {
        formik.setFieldValue(
            "uploadedFiles",
            formik?.values?.uploadedFiles?.filter((_, index) => index !== indexToRemove)
        );
    };

    const uploadDocument = async (id) => {

        setCustomLoading(true)
        const formData = new FormData();

        formik?.values?.uploadedFiles?.forEach((file, index) => {
            const convertedValue = file === null ? "" : file;
            formData.append(`file[${index}]`, convertedValue);
        });

        formData.append("site_id", invoiceCallData?.site_id);
        formData.append("drs_date", invoiceCallData?.start_date);
        formData.append("department_item_id", invoiceCallData?.selectedRow?.department_item_id);

        try {
            const postDataUrl = "/valet-coffee/upload-file";
            const navigatePath = `/ clients`;

            await postData(postDataUrl, formData,); // Set the submission state to false after the API call is completed

            FetchmannegerList()
            formik.setFieldValue('uploadedFiles', []);

        } catch (error) {
            setCustomLoading(false)
            handleError(error);
        }
        setCustomLoading(false)
    };




    return (
        <>
            {isLoading ? <LoaderImg /> : null}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                className="custom-modal-width custom-modal-height"
            >
                <div
                    className="modal-header"
                    style={{ color: "#fff", background: "#2D8BA8" }}
                >


                    <span
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    // className="ModalTitle"
                    >
                        <span>
                            {formik?.values?.site_name} ({formik?.values?.item})
                        </span>
                        <span onClick={handleCloseModal} >
                            <button className="close-button">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </span>
                    </span>
                </div>

                <Modal.Body className="Disable2FA-modal ">
                    <Row className="p-4">

                        <Col lg={12} md={12}>
                            <div className=" flex-column d-flex align-items-center w-100 my-3">
                                <div>
                                    {formik?.values?.is_upload_file ?
                                        <>
                                            <FileUploader
                                                multiple={true}
                                                handleChange={handleChangeDocumentUpload}
                                                name="file"
                                                types={fileTypes}
                                                className="w-100"
                                            />
                                            {formik?.values?.uploadedFiles?.length > 0 ? (
                                                <>
                                                    <div className=" d-flex flex-column">
                                                        <p className=" mt-2 text-center">Files To be upload </p>
                                                        <ul>
                                                            {formik?.values?.uploadedFiles?.map((file, index) => (
                                                                <li key={index} className=" d-flex justify-content-between align-items-center my-2">
                                                                    <span className="public-form-document-name">{file?.name}</span>
                                                                    <button type="button" className=" btn btn-danger delete-buttonn" onClick={() => handleRemove(index)}>
                                                                        <CloseIcon className="delete-button" />
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="text-end  mt-7" >
                                                        <button type="button" className="btn btn-primary  text-end" onClick={uploadDocument}>
                                                            Upload Document <FaFileUpload size={15} />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className=" text-center public-form-document-name mt-2">No files uploaded yet.....</p>
                                            )}
                                        </>
                                        :
                                        <>
                                        </>}

                                </div>

                            </div>
                        </Col>

                        {formik?.values?.files?.length > 0 ? <>

                            {formik?.values?.files?.map((file, index) => (
                                <Col lg={3} md={4} sm={6} key={index}>

                                    <div>
                                        <div className=" d-flex my-2">
                                            <div style={{
                                                border: "1px solid #00000014"
                                            }}>
                                                <img src={file?.file} alt="" className="coffeeandValetInvoiceImage" />
                                            </div>
                                            <div className=" d-flex flex-column">
                                                {formik?.values?.is_upload_file && (<>
                                                    <button type="button"
                                                        // className=" d-flex"
                                                        onClick={() => handleDelete(file?.id)}
                                                    >
                                                        <span className="d-flex btn-danger-color invoice-image-btn">
                                                            <CloseIcon className="delete-button" style={{ fontSize: "20px" }} />
                                                        </span>
                                                    </button>
                                                </>)}

                                                <button type="button"
                                                    // className=" d-flex"
                                                    onClick={() => window.open(file?.file, '_blank')} >
                                                    <span className=" d-flex invoice-image-btn">
                                                        <CloudDownloadIcon className="btn-primary-color" style={{ fontSize: "20px" }} />
                                                    </span>
                                                </button>

                                            </div>
                                        </div>
                                    </div>





                                </Col>
                            ))}



                        </> : <>
                            <img
                                src={require("../../../assets/images/commonimages/no_data.png")}
                                alt="MyChartImage"
                                className="all-center-flex nodata-image"
                            />
                        </>}



                    </Row>
                </Modal.Body >
            </Modal >
        </>
    );
};

CoffeeAndValetUploadInvoice.propTypes = {
    // title: PropTypes.string.isRequired,
    // visible: PropTypes.bool.isRequired,
};

export default withApi(CoffeeAndValetUploadInvoice);