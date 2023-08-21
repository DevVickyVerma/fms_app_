import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import React from "react";

function TimefuelpIcker() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label="Set Time"
        placeholder="Set time"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className="form-control"
            id="tp1"
            placeholder="Set time"
            type="text"
          />
        )}
        format="HH:mm" // This sets the format to 24-hour format
      />
    </LocalizationProvider>
  );
}

export default TimefuelpIcker;

{
  /* <TextField
name={`listing[0].fuels[${rowIndex}][${rowIndex}].time`}
type="time"
value={formatTo24Hour(
  formik.values.listing[0].fuels[rowIndex][0].time
)}
onChange={formik.handleChange}
InputLabelProps={{
  shrink: true,
}}
inputProps={{
  step: 300, // 5 minutes interval
}}
className="needed" // Apply styling if needed
/> */
}
