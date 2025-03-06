const CeoFilterBadge = ({
  filters,
  handleResetFilters,
  showResetBtn = false,
  showCompResetBtn = false,
  showStartDate = false,
  onRemoveFilter, // Add this prop
  selected,
}) => {
  const handleRemoveFilter = (filterName) => {
    if (onRemoveFilter) {
      onRemoveFilter(filterName); // Call the parent's handler
    }
  };

  return (
    <div className="d-flex gap-2 btn w-100">
      {filters?.client_name ||
        filters?.company_name ||
        filters?.site_name ||
        filters?.tank ||
        filters?.grade ||
        filters?.start_date ? (
        <div
          className="badges-container d-flex flex-nowrap align-items-center gap-2 px-4 py-sm-2 py-2 text-white w-100 overflow-x-auto"
          style={{ background: "#ddd", whiteSpace: "nowrap" }} // Ensures all badges stay in one line
        >
          {filters?.client_name && (
            <div className="badge bg-blue-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Client :</span> {filters?.client_name}
            </div>
          )}
          {filters?.company_name && (
            <div className="badge bg-green-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Company :</span> {filters?.company_name}
              {showCompResetBtn && (
                <button
                  className="btn btn-danger btn-sm position-absolute ceo-cross-icon"
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
          {filters?.grade && (
            <div className="badge bg-green-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Grade :</span> {filters?.grade}
            </div>
          )}
          {filters?.tank && (
            <div className="badge bg-green-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Tank :</span> {filters?.tank}
            </div>
          )}
          {selected?.length > 0 && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 position-relative">
              <span className="font-semibold">Sites :</span>
              <span>
                {selected.map((site, index) => (
                  <span key={index} className="me-1">
                    {site.label}
                    {index < selected.length - 1 && ", "}
                  </span>
                ))}
              </span>
            </div>
          )}
          {filters?.start_date && showStartDate && (
            <div className="badge bg-yellow-600 d-flex align-items-center gap-2 p-3 position-relative">
              <span className="font-semibold">Start Date :</span> {filters?.start_date}
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
    </div>

  );
};

export default CeoFilterBadge;
