import { useState } from "react";
import { Link } from "react-router-dom";

const SearchBar = ({ onSearch, onReset, placeholder, hideReset }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    onReset();
  };

  return (
    <div className="search-component d-flex gap-2  ">
      <input
        type="text"
        className="search-input form-control"
        placeholder={placeholder || "Search..."}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <span className="">
        <Link
          className="btn btn-primary  addclientbtn all-center-flex"
          onClick={handleSearch}
        >
          <i className="ph ph-magnifying-glass d-flex ph-search-icons"></i>
        </Link>
      </span>

      {hideReset && (
        <span>
          <Link
            className="btn btn-danger  addclientbtn all-center-flex"
            onClick={handleReset}
          >
            <i className="ph ph-arrow-clockwise ph-search-icons"></i>
          </Link>
        </span>
      )}
    </div>
  );
};

export default SearchBar;
