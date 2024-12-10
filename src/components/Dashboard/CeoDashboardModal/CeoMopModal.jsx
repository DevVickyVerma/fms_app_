import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CeoMopModal = (props) => {
  const { title, sidebarContent, visible, onClose } = props;

  return (
    <div
      className={`common-sidebar   ${
        visible ? "visible slide-in-right " : "slide-out-right"
      }`}
    >
      <div className="card">
        <div className="card-header text-center SidebarSearchheader">
          <h3 className="SidebarSearch-title m-0">{title}</h3>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="card-body scrollview">
          sdkahsdjhkasjdhjkasdjkaskjd yhsadgkasghdikasud iuusadghashd
        </div>
      </div>
    </div>
  );
};

CeoMopModal.propTypes = {
  title: PropTypes.string.isRequired,
  sidebarContent: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CeoMopModal;
