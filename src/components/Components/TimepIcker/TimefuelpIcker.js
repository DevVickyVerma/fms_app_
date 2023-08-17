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
      />
    </LocalizationProvider>
  );
}

export default TimefuelpIcker;
