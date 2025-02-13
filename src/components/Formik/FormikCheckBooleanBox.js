import React from "react";

const FormikCheckBooleanBox = ({ label, name, formik, disabled = false }) => {
  return (
    <div className="h-100 d-flex align-items-center ">
      <div className="position-relative pointer d-flex align-items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={formik?.values?.[name] === true}
          onChange={(e) => {
            formik.setFieldValue(name, e.target.checked);
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

export default FormikCheckBooleanBox;
