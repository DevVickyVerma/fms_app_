import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import withApi from "../../../Utils/ApiHelper";
import React from "react";
import { useEffect, useState } from 'react';
import LoaderImg from "../../../Utils/Loader";
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FuturePriceErrorModal = (props) => {
    const { showModal, setShowModal, SelectedRow, getData, isLoading } = props;
    const [data, setData] = useState();

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (SelectedRow) {
            FetchmannegerList()
        }
    }, [SelectedRow])

    const FetchmannegerList = async () => {
        try {
            const response = await getData(`/fuel-price/history-detail/${SelectedRow?.id}`);

            if (response && response.data) {
                setData(response.data.data);
            } else {
                throw new Error("No data available in the response");
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    return (
        <>

            {isLoading ? <LoaderImg /> : null}

            <div>
                <Dialog
                    open={showModal}
                    onClose={handleCloseModal}
                    className="ModalTitle custom-matiral-modal"
                >
                    <Modal.Header
                        style={{
                            color: "#fff",
                            background: "#2D8BA8",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div >
                            <Modal.Title style={{
                                margin: "auto "
                            }}>
                                {data?.site_name}</Modal.Title>
                        </div>
                        <div>

                            <span onClick={handleCloseModal} >
                                <button className="close-button">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </span>
                        </div>
                    </Modal.Header>

                    <DialogContent>
                        <DialogContentText>
                            <>
                                {isLoading ? (
                                    <LoaderImg />
                                ) : (
                                    <>
                                        {data ? <>
                                            <>

                                                <div>
                                                    <div className=" m-0 p-0">
                                                        <h5 className='fw-bold c-f-log-title'>Basic Info  </h5>
                                                    </div>

                                                    <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }} className=" my-2">
                                                        <li style={{ flex: 1 }}>
                                                            <span className=' text-capitalize'>{data && <><span className='fw-bold me-1'>Fuel:</span>
                                                                {data?.category_name ? data?.category_name : "--"}

                                                            </>}</span>
                                                        </li>
                                                        <li style={{ flex: 1 }}>
                                                            <span className=' text-capitalize '>{data && <>
                                                                <span>
                                                                    <span className='fw-bold me-1'>Status:{" "}</span>
                                                                </span>
                                                                <span className="text-muted fs-15 fw-semibold text-center">
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Status</Tooltip>}>
                                                                        {data?.status === 1 ? (
                                                                            <button
                                                                                className="btn btn-success btn-sm"

                                                                            >
                                                                                Sucess
                                                                            </button>
                                                                        ) : data?.status === 0 ? (
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                            >
                                                                                Error
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="badge"

                                                                            >
                                                                                Unknown
                                                                            </button>
                                                                        )}
                                                                    </OverlayTrigger>
                                                                </span>
                                                            </>}
                                                            </span>

                                                        </li>
                                                    </ul>

                                                    <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }} className=" my-2">
                                                        <li style={{ flex: 1 }}>


                                                            <span className=' text-capitalize '>{data && <><span>
                                                                <span className='fw-bold me-1'>Price Requested Date/Time:{" "}</span>
                                                            </span> {data?.price_date ? data?.price_date : "--"}</>}</span>
                                                        </li>
                                                        <li style={{ flex: 1 }}>
                                                            <span className=' text-capitalize'>{data && <><span className='fw-bold me-1'>Updated Date:</span>
                                                                {data?.created_date ? data?.created_date : "--"}
                                                            </>}</span>
                                                        </li>
                                                    </ul>

                                                    <div className=" c-dashed-line" />
                                                </div>


                                                <div className=" mt-4">
                                                    <div className=" m-0 p-0">
                                                        <h5 className='fw-bold c-f-log-title'>Extra Info  </h5>
                                                    </div>

                                                    <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }} className=" my-2">
                                                        <li style={{ flex: 1 }}>
                                                            <span className=' text-capitalize'>{data && <><span className='fw-bold me-1'>IP:</span>
                                                                {data?.rawData ? data?.rawData?.ip : "--"}
                                                            </>}</span>
                                                        </li>
                                                        <li style={{ flex: 1 }}>
                                                            <span className=' text-capitalize '>{data && <><span>
                                                                <span className='fw-bold me-1'>Browser:{" "}</span>
                                                            </span>  {data?.rawData?.browser ? data?.rawData?.browser : "--"}</>}</span>
                                                        </li>
                                                    </ul>

                                                    <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }} className=" my-2">
                                                        <li style={{ flex: 1 }}>
                                                            <span className=' text-capitalize'>{data && <><span className='fw-bold me-1'>OS:</span>
                                                                {data?.rawData?.os ? data?.rawData?.os : "--"}
                                                            </>}</span>
                                                        </li>
                                                    </ul>

                                                </div>

                                                {data?.message && (<>
                                                    <div className=" c-dashed-line" />

                                                    <div className=" mt-4 c-msg-h">
                                                        <div className=" m-0 p-0">
                                                            <h5 className='fw-bold c-f-log-title'>Logs  </h5>
                                                        </div>

                                                        <div>
                                                            {data?.message}
                                                        </div>
                                                    </div>
                                                </>
                                                )}



                                            </>
                                        </> : <>
                                            <img
                                                src={require("../../../assets/images/commonimages/no_data.png")}
                                                alt="MyChartImage"
                                                className="all-center-flex nodata-image"
                                            />
                                        </>}
                                    </>
                                )}
                            </>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

FuturePriceErrorModal.propTypes = {
    // title: PropTypes.string.isRequired,
    // visible: PropTypes.bool.isRequired,
};

export default withApi(FuturePriceErrorModal);
