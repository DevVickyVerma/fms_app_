const CommonFilterBadge = ({ title, value, variant, className }) => {
    if (!value) return null; // If value is empty, do not render the component

    // Define the background color based on the variant
    const getBgColor = () => {
        switch (variant) {
            case "success":
                return "bg-success"; // Green
            case "danger":
                return "bg-danger"; // Red
            case "warning":
                return "bg-warning"; // Yellow
            case "info":
                return "bg-info"; // Light Blue
            case "primary":
                return "bg-primary"; // Dark Blue
            case "secondary":
                return "bg-secondary"; // Grey
            case "worst":
                return "bg-dark"; // Custom color for "worst"
            case "All":
                return "bg-light text-dark"; // Light background for "All"
            default:
                return "bg-blue-600"; // Default background
        }
    };

    return (
        <div
            style={{ padding: "14px", fontSize: "14px", cursor: "pointer" }}
            className={`badge filterbadge d-flex align-items-center gap-2 ${getBgColor()} ${className}`}
        >
            <span className="font-semibold">{title} :</span> {value}
        </div>
    );
};

export default CommonFilterBadge;
