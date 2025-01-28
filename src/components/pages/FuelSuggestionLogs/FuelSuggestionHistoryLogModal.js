import React, { useEffect, useState } from "react";
import { Card, Col, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Loaderimg from "../../../Utils/Loader";
import useErrorHandler from "../../../components/CommonComponent/useErrorHandler";
import { useSelector } from "react-redux";
import withApi from "../../../Utils/ApiHelper";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FuelPriceTimeLineLogs from "../ManageVersionTwoCompetitorFuelPrice/FuelPriceTimeLineLogs";

const FuelSuggestionHistoryLogModal = ({
  open,
  onClose,
  selectedItem,
  selectedDrsDate,
  onDataFromChild,
  accordionSiteID,
  getData,
  postData,
}) => {
  const { handleError } = useErrorHandler();

  const userPermissions = useSelector(
    (state) => state?.data?.data?.permissions || []
  );
  const [data, setData] = useState(); // Initialize data as null
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [accordionSiteID]);

  const fetchData = async () => {
    if (accordionSiteID) {
      try {
        setIsLoading(true);

        const response = await getData(
          `/site/fuel-price/suggestion/detail/${accordionSiteID}`
        );

        if (response && response.data && response.data.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading ? <Loaderimg /> : null}
      <Modal
        show={open}
        onHide={onClose}
        centered
        // size={"sm"}
        className="dashboard-center-modal"
        aria-labelledby="rejectReasonModalLabel"
        aria-hidden="false"
        tabIndex="-1"
      >
        <div>
          <Modal.Header
            style={{
              color: "#fff",
            }}
            className="p-0 m-0 d-flex justify-content-between align-items-center"
          >
            <span className="ModalTitle d-flex justify-content-between w-100  fw-normal">
              <span>
                {" "}
                Fuel Selling Price Suggestion For {data?.site_name} ({" "}
                {data?.date} ){" "}
                <span className="d-flex pt-1 align-items-center c-fs-12">
                  <span className="greenboxx me-2"></span>
                  <span className="text-muted">Current Price</span>
                </span>
              </span>
              <span onClick={onClose}>
                <button className="close-button">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            </span>
          </Modal.Header>

          <form>
            <Card.Body>
              <Row className="row-sm">
                <Col lg={12}>
                  <>
                    <FuelPriceTimeLineLogs data={data} />
                  </>
                </Col>
              </Row>
            </Card.Body>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default withApi(FuelSuggestionHistoryLogModal);
