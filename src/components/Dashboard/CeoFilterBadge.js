import React from "react";

const CeoFilterBadge = ({
  filters,
  handleResetFilters,
  showResetBtn = false,
  showStartDate = false,
}) => {
  return (
    <div className="d-flex gap-2 flex-wrap">
      {/* Check if there are any filters to show */}
      {filters?.client_name || filters?.company_name || filters?.site_name || filters?.start_date ? (
        <div
          className="badges-container d-flex flex-wrap align-items-center gap-2 px-4 py-sm-0 py-2 text-white"
          style={{ background: "#ddd" }}
        >
          {/* Display Client Name */}
          {filters?.client_name && (
            <div className="badge bg-blue-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Client :</span> {filters?.client_name}
            </div>
          )}

          {/* Display Company Name */}
          {filters?.company_name && (
            <div className="badge bg-green-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Company :</span> {filters?.company_name}
            </div>
          )}

          {/* Display Site Name */}
          {filters?.site_name && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Site :</span> {filters?.site_name}
            </div>
          )}

          {/* Display Start Date if showStartDate is true */}
          {filters?.start_date && showStartDate && (
            <div className="badge bg-yellow-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Start Date :</span> {filters?.start_date}
            </div>
          )}
        </div>
      ) : (
        // Show fallback message if no filters are applied
        <div className="d-flex m-auto">
          <span className="p-2 badge bg-red-600 p-3">
            *Please apply filter to see the stats
          </span>
        </div>
      )}

      {/* Show Reset Button if filters exist and showResetBtn is true */}
      {(filters?.client_name || filters?.company_name || filters?.site_name || filters?.start_date) &&
        showResetBtn && (
          <span onClick={handleResetFilters} className="btn btn-danger">
            <i className="ph ph-arrow-clockwise" />
          </span>
        )}
    </div>
  );
};

export default CeoFilterBadge;
