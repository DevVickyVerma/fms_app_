import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SideSearchbar = (props) => {
  const { title, sidebarContent, visible, onClose, onSubmit ,onCancel} = props;

  const [keyword, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (startDate && !endDate) {
      setErrorMessage("Please select an end date");
      return;
    }

    // Check if the end date is selected but the start date is not
    if (!startDate && endDate) {
      setErrorMessage("Please select a start date");
      return;
    }
    setErrorMessage("");
    const formData = {
      keyword,
      startDate,
      endDate,
    };
    console.log("Search Query:", keyword);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    onSubmit(formData);
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className={`common-sidebar ${visible ? "visible" : ""}`}>
      <div className="card">
        <div className="card-header text-center SidebarSearchheader">
          <h3 className="SidebarSearch-title m-0">{title}</h3>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="card-body">
          <form >
            <div className="form-group">
              <label className="form-label" htmlFor="Search">
                Search:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your search item"
                value={keyword}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="d-flex ">
              <div className="form-group" style={{ width: "50%" }}>
                <label className="form-label" htmlFor="start-date">
                  Start Date:
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group ms-2" style={{ width: "50%" }}>
                <label className="form-label" htmlFor="end-date">
                  End Date:
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          
          </form>
          <div className="text-end">
              <button type="Search" className="btn btn-primary" onClick={handleSubmit}>
                Search
              </button>
               <button className="btn btn-danger ms-2" onClick={onClose}>
                Cancel
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

SideSearchbar.propTypes = {
  title: PropTypes.string.isRequired,
  sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SideSearchbar;
