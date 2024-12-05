import React from "react";
import { formatLabel } from "../../Utils/commonFunctions/commonFunction";

const FormikSelect = ({
  formik,
  name,
  label,
  options,
  className = "form-select",
  onChange,
  isRequired = true,
  isHideDefaultSelectOption = false,
}) => {
  const handleChange = (e) => {
    formik.handleChange(e);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div
      className={`form-group ${
        formik.touched[name] && formik.errors[name] ? "has-error" : ""
      } ${formik.submitCount > 0 && !formik.errors[name] ? "has-success" : ""}`}
    >
      {label ? (
        <label htmlFor={name} className="mb-2">
          {formatLabel(label)}{" "}
          {isRequired && <span className="text-danger">*</span>}
        </label>
      ) : (
        ""
      )}

      <select
        id={name}
        name={name}
        onChange={handleChange}
        onBlur={formik.handleBlur}
        value={formik.values?.[name]}
        className={`input101 ${className}`}
      >
        {!isHideDefaultSelectOption && (
          <>
            <option value="">Select {formatLabel(label)} </option>
          </>
        )}
        {options?.map((option) => (
          <option key={option?.id} value={option?.id}>
            {option?.name}
          </option>
        ))}
      </select>
      {/* {formik.touched[name] && formik.errors[name] && (
                <div className="text-danger mt-1">{formik.errors[name]}</div>
            )} */}
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger mt-1">
          {" "}
          {formatLabel(formik.errors[name])}{" "}
        </div>
      )}
    </div>
  );
};

export default FormikSelect;
