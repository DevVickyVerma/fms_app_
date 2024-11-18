import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MultiDateRangePicker = ({ 
    startDate, 
    endDate, 
    onChange, 
    minDate = null, 
    maxDate = null 
}) => {
    const handleDateChange = (dates) => {
        // Extract start and end dates from the range
        const [start, end] = dates;
        onChange(start, end); // Pass start and end to the parent via callback
    };

    return (
        <DatePicker
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            monthsShown={2}
            selectsRange
            dateFormat="yyyy-MM-dd"
            isClearable
            placeholderText="Select Date Range"
            autoComplete="off"
            className="form-control"
            minDate={minDate} // Minimum selectable date
            maxDate={maxDate} // Maximum selectable date
        />
    );
};

export default MultiDateRangePicker;
