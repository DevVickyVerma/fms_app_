import Button from "react-bootstrap/Button"; // Adjust if you use a different UI library
import { useSelector } from "react-redux";
import { useMyContext } from "../../Utils/MyContext";

const SecondFiltersComponent = ({
  filters,
  handleToggleSidebar1,
  handleResetFilters,
  showResetBtn = false,
  showStartDate = false,
  ComponentTitan = false,
}) => {
  const ReduxFullData = useSelector((state) => state?.data?.data);
  const { isMobile } = useMyContext();
  return (
    <div
      className="d-flex gap-2 mt-3 align-items-center"
      style={
        filters?.client_id
          ? { background: "#ddd", overflowX: "auto", whiteSpace: "nowrap" }
          : {}
      }
    >
      {filters?.client_id ||
      filters?.company_id ||
      filters?.site_id ||
      filters?.start_date ? (
        <div className="filters-container d-flex align-items-center gap-2 px-4 py-sm-0 py-2 text-white">
          {filters?.client_id && (
            <div className="badge bg-blue-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Client :</span>{" "}
              {filters?.client_name || ReduxFullData?.full_name || ""}
            </div>
          )}

          {filters?.company_id && filters?.company_name && (
            <div className="badge bg-green-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Company :</span>{" "}
              {filters?.company_name}
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex m-auto">
          <span className="p-2 badge bg-red-600 p-3">
            {!isMobile ? " *Please apply filter to see the stats" : ""}
          </span>
        </div>
      )}
      {!isMobile ? (
        <Button
          onClick={handleToggleSidebar1}
          type="button"
          className="btn btn-primary"
        >
          Filter
          <span>
            <i className="ph ph-funnel ms-1" />
          </span>
        </Button>
      ) : (
        ""
      )}
      {(filters?.client_id ||
        filters?.company_id ||
        filters?.site_id ||
        filters?.start_date) &&
        showResetBtn &&
        !isMobile && (
          <span onClick={handleResetFilters} className="btn btn-danger">
            <i className="ph ph-arrow-clockwise" />
          </span>
        )}
    </div>
  );
};

export default SecondFiltersComponent;
