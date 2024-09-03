import React from 'react';
import Button from 'react-bootstrap/Button'; // Adjust if you use a different UI library
import SortIcon from '@mui/icons-material/Sort';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const FiltersComponent = ({ filters, handleToggleSidebar1, handleResetFilters }) => {
  return (
    <div className="d-flex gap-2 flex-wrap">
      {filters?.client_id || filters?.company_id || filters?.site_id ? (
        <div
          className="badges-container d-flex flex-wrap align-items-center gap-2 px-4 py-sm-0 py-2 text-white"
          style={{ background: "#ddd" }}
        >
          {filters?.client_id && (
            <div className="badge bg-blue-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Client :</span> {filters?.client_name || ''}
            </div>
          )}

          {filters?.company_id && filters?.company_name && (
            <div className="badge bg-green-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Company :</span> {filters?.company_name}
            </div>
          )}

          {filters?.site_id && filters?.site_name && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Site :</span> {filters?.site_name}
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

      <Button onClick={handleToggleSidebar1} type="button" className="btn btn-primary">
        Filter
        <span>
          <SortIcon />
        </span>
      </Button>

      {(filters?.client_id || filters?.company_id || filters?.site_id) && (
        <span onClick={handleResetFilters} className="btn btn-danger">
          <RestartAltIcon />
        </span>
      )}
    </div>
  );
};

export default FiltersComponent;
