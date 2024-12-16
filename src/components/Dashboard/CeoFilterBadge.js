const CeoFilterBadge = ({
  filters,
  handleResetFilters,
  showResetBtn = false,
  showCompResetBtn = false,
  showStartDate = false,
  onRemoveFilter, // Add this prop
}) => {
  const handleRemoveFilter = (filterName) => {
    if (onRemoveFilter) {
      onRemoveFilter(filterName); // Call the parent's handler
    }
  };
  return (
    <div className="d-flex gap-2 flex-wrap btn">
      {filters?.client_name ||
      filters?.company_name ||
      filters?.site_name ||
      filters?.start_date ? (
        <div
          className="badges-container d-flex flex-wrap align-items-center gap-2 px-4 py-sm-2 py-2 text-white"
          style={{ background: "#ddd" }}
        >
          {filters?.client_name && (
            <div className="badge bg-blue-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Client :</span>{" "}
              {filters?.client_name}
            </div>
          )}
          {filters?.company_name && (
            <div className="badge bg-green-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Company :</span>{" "}
              {filters?.company_name}
              {showCompResetBtn && (
                <button
                  className="btn btn-danger btn-sm position-absolute ceo-cross-icon"
                  // style={{ top: "-20px", right: "-20px", borderRadius: "50%" }}
                  onClick={() => handleRemoveFilter("company_name")}
                >
                  <span>&times;</span>
                </button>
              )}
            </div>
          )}
          {filters?.site_name && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Site :</span> {filters?.site_name}
              {showResetBtn && (
                <button
                  className="btn btn-danger btn-sm position-absolute ceo-cross-icon"
                  onClick={() => handleRemoveFilter("site_name")}
                >
                  <span>&times;</span>
                </button>
              )}
            </div>
          )}
          {filters?.start_date && showStartDate && (
            <div className="badge bg-yellow-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Start Date :</span>{" "}
              {filters?.start_date}
              <button
                className="btn btn-danger btn-sm position-absolute ceo-cross-icon"
                onClick={() => handleRemoveFilter("start_date")}
              >
                <span>&times;</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex m-auto">
          <span className="p-2 badge bg-red-600 p-3">
            *Please apply filter to see the stats
          </span>
        </div>
      )}
      {/* {(filters?.client_name ||
        filters?.company_name ||
        filters?.site_name ||
        filters?.start_date) &&
        showResetBtn && (
          <span onClick={handleResetFilters} className="btn btn-danger">
            <i className="ph ph-arrow-clockwise" />
          </span>
        )} */}
    </div>
  );
};

export default CeoFilterBadge;
