import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MultiDateRangePicker = ({
  startDate,
  endDate,
  onChange,
  minDate = null,
  maxDate = null,
}) => {
  const handleDateChange = (dates) => {
    onChange(dates, undefined); // Pass undefined as the second argument if event is not needed
  };

  return (
    <DatePicker
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      onChange={handleDateChange}
      selectsRange
      //   monthsShown={2}
      dateFormat="yyyy-MM-dd"
      isClearable
      placeholderText="Select Date Range"
      autoComplete="off"
      className="input101 "
      minDate={minDate} // Pass min date as prop
      maxDate={maxDate} // Pass max date as prop
    />
  );
};

export default MultiDateRangePicker;
