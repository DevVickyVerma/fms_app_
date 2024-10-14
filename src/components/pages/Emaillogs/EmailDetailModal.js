import { useEffect } from "react";
import withApi from "../../../Utils/ApiHelper";

import { Offcanvas } from "react-bootstrap";
const EmailDetailModal = (props) => {
  const { addshowModal, AddCloseModal, selectedRowId } = props;

  useEffect(() => {
    if (selectedRowId) {
    }
  }, [selectedRowId]);
  const containerStyle = {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  };

  const spanStyle = {
    display: "block",
    marginBottom: "10px",
    fontSize: "16px",
    color: "#333",
  };

  const boldSpanStyle = {
    ...spanStyle,
    fontWeight: "bold",
  };

  const boldTitleStyle = {
    fontWeight: "bold",
    marginRight: "5px", // Add some spacing between the title and the value
  };

  return (
    <>
      <Offcanvas
        show={addshowModal}
        onHide={AddCloseModal}
        placement="end"
        className="offcanvas-end-dep customeoff "
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal1">
            Email Details
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            onClick={() => AddCloseModal()}
          >
            <i className="fa fa-times-circle" />
          </button>
        </div>
        <hr />
        <div className="offcanvas-body">
          <div style={containerStyle}>
            <div style={{ marginBottom: "10px" }}>
              <span style={boldTitleStyle}>Subject:</span> <br />
              <span>{selectedRowId?.raw_data?.subject}</span>
              <br />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={boldTitleStyle}>Text:</span> <br />
              <span style={{ marginBottom: "10px" }}>
                {selectedRowId?.raw_data?.text}
              </span>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <span style={boldTitleStyle}>To Email:</span> <br />
              <span style={{ marginBottom: "10px" }}>
                {selectedRowId?.raw_data?.to_email}
              </span>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <span style={boldTitleStyle}>Type:</span> <br />
              <span>{selectedRowId?.raw_data?.type}</span>
            </div>
            {selectedRowId?.raw_data?.cc_emails && (
              <div>
                <span style={boldSpanStyle}>CC Emails:</span>
                {selectedRowId.raw_data.cc_emails.map((email, index) => (
                  <span key={index} style={spanStyle}>
                    {email}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Offcanvas>
    </>
  );
};
export default withApi(EmailDetailModal);
