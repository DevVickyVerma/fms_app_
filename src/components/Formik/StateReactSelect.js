import React, { useState, useEffect } from "react";
import Select from "react-select";

const StateReactSelect = ({
  name,
  label,
  options,
  className,
  onChange,
  isRequired,
  showLabel = true,
  isDisabled = false,
  defaultValue = null, // Initialize with null if no default value is passed
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  // Update selected option when defaultValue changes (for dynamic pre-filled option)
  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={`form-group react-select-input ${className}`}>
      {showLabel && (
        <>
          <label htmlFor={name} className="mb-2">
            {label} {isRequired && <span className="text-danger">*</span>}
          </label>
        </>
      )}
      <Select
        id={name}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        classNamePrefix="react-select react-select-default-input"
        placeholder={`Select ${label}`}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default StateReactSelect;
