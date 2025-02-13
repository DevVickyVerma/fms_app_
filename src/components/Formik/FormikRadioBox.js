import React from "react";

const FormikRadioBox = ({
  label,
  name,
  formik,
  value, // Value of the radio button
  disabled = false,
}) => {
  return (
    <div className="h-100 d-flex align-items-center ">
      <div className="position-relative pointer d-flex align-items-center">
        <input
          type="radio"
          id={name + value} // Unique ID based on the name and value
          name={name}
          value={value}
          checked={formik?.values?.[name] === value}
          onChange={() => formik.setFieldValue(name, value)}
          disabled={disabled}
          className="custom-checkbox custom-radiobox"
          //   className="mx-1 form-check-input form-check-input-updated pointer"
        />
        <label
          htmlFor={name + value}
          className={`p-0 m-0 ${disabled ? "text-muted" : "pointer"}`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default FormikRadioBox;
