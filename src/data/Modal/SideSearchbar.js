import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SideSearchbar = (props) => {
  const { title, sidebarContent, visible, onClose, onSubmit } = props;

  const [keyword, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      keyword,
      startDate,
      endDate,
    };
    console.log("Search Query:", keyword);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    onSubmit(formData);
  };

  return (
    <div className={`common-sidebar ${visible ? "visible" : ""}`}>
      <div className="card">
        <div className="card-header text-center Sidebarheader">
          <h3 className="Sidebar-title m-0">{title}</h3>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="Search">Search:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your search query"
                value={keyword}
                onChange={(e) => setSearchQuery(e.target.value)}
                
              />
            </div>

            <div className="form-group">
              <label htmlFor="start-date">Start Date:</label>
              <input
                type="date"
                id="start-date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                
              />
            </div>

            <div className="form-group">
              <label htmlFor="end-date">End Date:</label>
              <input
                type="date"
                id="end-date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                
              />
            </div>

            <button type="Search" className="btn btn-primary">
              Search
            </button>
          </form>
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
  onSubmit: PropTypes.func.isRequired,
};

export default SideSearchbar;
