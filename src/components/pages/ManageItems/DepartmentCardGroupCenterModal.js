import { Card, Col, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";

const DepartmentCardGroupCenterModal = (props) => {
    const { showModal, setShowModal, detailApiData } = props;

    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <Modal
            show={showModal}
            onHide={handleCloseModal}
            centered
            className="custom-modal-width custom-modal-height"
        >
            <div className="modal-header">
                <span className="ModalTitle d-flex justify-content-between w-100 p-0 fw-normal"  >
                    <span>
                        Items
                    </span>
                    <span onClick={handleCloseModal} >
                        <button className="close-button">
                            <i className="ph ph-x"></i>
                        </button>
                    </span>
                </span>
            </div>

            <Modal.Body className="Disable2FA-modal">
                <Row>
                    <Col lg={12} xl={12} md={12} sm={12}>
                        <>
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
                                                        {singleName}
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
                        </>
                    </Col>
                </Row>
            </Modal.Body >
        </Modal >
    );
};

DepartmentCardGroupCenterModal.propTypes = {
    // title: PropTypes.string.isRequired,
    // visible: PropTypes.bool.isRequired,
};

export default DepartmentCardGroupCenterModal;