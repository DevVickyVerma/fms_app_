import React from "react";

const FormikCheckOneBox = ({ label, name, formik, disabled = false }) => {
  return (
    <div className="h-100 d-flex align-items-center form-group">
      <div className="position-relative pointer d-flex align-items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={formik?.values?.[name] === 1}
          onChange={(e) => {
            formik.setFieldValue(name, e.target.checked ? 1 : 0);
          }}
          disabled={disabled} // Added disabled prop
          className="custom-checkbox"
        />
        <label
          htmlFor={name}
          className={`m-0 mx-2 ${disabled ? "text-muted" : "pointer"}`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default FormikCheckOneBox;
