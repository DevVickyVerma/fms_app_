import { IonButton, IonIcon } from "@ionic/react";
import Button from "react-bootstrap/Button"; // Adjust if you use a different UI library
import { useSelector } from "react-redux";
import { filter, funnelOutline, refresh } from "ionicons/icons";

const CommonMobileFilters = ({
  filters,
  handleToggleSidebar1,
  handleResetFilters,
  showResetBtn = false,
  showStartDate = false,
  ComponentTitan = false,
}) => {
  const ReduxFullData = useSelector((state) => state?.data?.data);

  return (
    <div className="d-flex gap-2 flex-wrap mb-4">
      {filters?.client_id ||
      filters?.company_id ||
      filters?.site_id ||
      filters?.start_date ? (
        <div
          className="badges-container d-flex align-items-center gap-2 px-4 py-sm-0 py-2 text-white w-100 overflow-auto"
          style={{ background: "#ddd" }}
        >
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

          {filters?.site_id && filters?.site_name && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Site :</span> {filters?.site_name}
            </div>
          )}
          {filters?.site_id && filters?.tank_name && ComponentTitan && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Tank :</span> {filters?.tank_name}
            </div>
          )}
          {filters?.site_id && filters?.grade_name && ComponentTitan && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Grade :</span>{" "}
              {filters?.grade_name}
            </div>
          )}

          {filters?.start_date && showStartDate && (
            <div className="badge bg-red-600 d-flex align-items-center gap-2 p-3">
              <span className="font-semibold">Start Date :</span>{" "}
              {filters?.start_date}
            </div>
          )}
        </div>
      ) : (
        // <div className="d-flex m-auto w-100" onClick={handleToggleSidebar1}>
        //   <span className=" badge bg-red-600 p-1 d-flex align-items-center w-100 justify-content-center">

        //   </span>
        // </div>

        <IonButton
          onClick={handleToggleSidebar1}
          //   type="danger"
          expand="full"
          size="small"
          className="mobile-no-bg"
          //   className="mob-custom-primary-btn"
          style={{ marginRight: "8px" }}
        >
          *Please apply filter to see the stats <IonIcon icon={funnelOutline} />
        </IonButton>
      )}

      {(filters?.client_id ||
        filters?.company_id ||
        filters?.site_id ||
        filters?.start_date) && (
        <Button
          onClick={handleToggleSidebar1}
          type="button"
          className="btn btn-primary btn-sm"
        >
          {/* Filter */}
          <span>
            <i className="ph ph-funnel ms-1" />
          </span>
        </Button>
      )}

      {(filters?.client_id ||
        filters?.company_id ||
        filters?.site_id ||
        filters?.start_date) &&
        showResetBtn && (
          <span onClick={handleResetFilters} className="btn btn-danger btn-sm">
            <i className="ph ph-arrow-clockwise" />
          </span>
        )}
    </div>
  );
};

export default CommonMobileFilters;
