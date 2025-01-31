import React from "react";
import Select from "react-select";

const FormikReactSelect = ({
  formik,
  name,
  label,
  options,
  className,
  onChange,
  isRequired,
  isDisabled = false,
}) => {
  const handleChange = (selectedOption) => {
    formik.setFieldValue(name, selectedOption ? selectedOption.value : "");
    if (onChange) {
      onChange(selectedOption);
    }
  };

  const selectedOption = options?.find(
    (option) => option.value === formik.values[name]
  );

  return (
    <div
      className={`form-group react-select-input ${formik.touched[name] && formik.errors[name] ? "has-error" : ""} ${formik.submitCount > 0 && !formik.errors[name] ? "has-success" : ""}`}
    >
      <label htmlFor={name} className="mb-2">
        {label} {isRequired && <span className="text-danger">*</span>}
      </label>
      <Select
        id={name}
        name={name}
        value={selectedOption || null}
        onChange={handleChange}
        onBlur={formik.handleBlur}
        options={options}
        classNamePrefix="react-select react-select-default-input react-select-inputttt"
        placeholder={`Select ${label}`}
        isDisabled={isDisabled}
        // isClearable
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );
};

FormikReactSelect.defaultProps = {
  className: "",
  onChange: undefined,
  isRequired: true,
};

export default FormikReactSelect;
