import { Card, Col, Modal, Row } from "react-bootstrap";

const CardGroupCenterModal = (props) => {
    const { showModal, setShowModal, detailApiData } = props;

    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <Modal
            show={showModal}
            onHide={handleCloseModal}
            centered={true}
            className="custom-modal-width custom-modal-height big-modal"
        >
            <div className="modal-header">
                <span className="ModalTitle d-flex justify-content-between w-100 p-0 fw-normal"  >
                    <span>
                        Cards
                    </span>
                    <span onClick={handleCloseModal} >
                        <button className="close-button">
                            <i className="ph ph-x" />
                        </button>
                    </span>
                </span>
            </div>

            <Modal.Body className="Disable2FA-modal">
                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    {detailApiData?.names.length > 0 ? <>
                                        {detailApiData?.names?.map((singleName) => (
                                            <Col lg={3} md={3} borderRadius={"5px"} className=" my-1">
                                                <span className="mx-1 py-3 CardGroupModalItems" style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                    alignItems: "center",
                                                    marginBottom: "5px",
                                                    justifyContent: "center"
                                                }}>
                                                    <strong style={{ fontWeight: 700 }}>
                                                        <div className=" my-2 d-flex justify-content-center align-items-center gap-1 all-center-flex">
                                                            <span className='all-center-flex' style={{
                                                                width: "40px", height: "25px", display: "flex", justifyContent: "center"
                                                            }}>
                                                                <img
                                                                    src={singleName?.logo}
                                                                    alt=''
                                                                    style={{
                                                                        background: "rgb(225 214 214)",
                                                                        padding: "5px",
                                                                        borderRadius: "8px",
                                                                    }}
                                                                />
                                                            </span>
                                                            <h6 className="mb-0 fs-14 fw-semibold all-center-flex">{singleName?.name}</h6>
                                                        </div>
                                                    </strong>
                                                </span>
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

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Modal.Body >
        </Modal >
    );
};

CardGroupCenterModal.propTypes = {
    // title: PropTypes.string.isRequired,
    // visible: PropTypes.bool.isRequired,
};

export default CardGroupCenterModal;