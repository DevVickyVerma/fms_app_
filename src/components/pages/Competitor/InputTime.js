// import React, { useEffect, useState } from 'react';
// import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import TextField from '@mui/material/TextField';
// import dayjs from 'dayjs';

// const InputTime = ({ label, value, onChange }) => {
//   const [timeValue, setTimeValue] = useState(null);

//   useEffect(() => {
//     // Convert value to Dayjs object and set it in state
//     if (value) {
//       const parsedValue = dayjs(value, 'HH:mm', true);
//       if (parsedValue.isValid()) {
//         setTimeValue(parsedValue);
//       }
//     }
//   }, [value]);

//   return (
//     <div className="wd-150 mg-b-30">
//       <div className="input-group"
//         onKeyDown={(e) => e.preventDefault()}
//         onKeyUp={(e) => e.preventDefault()}>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <TimePicker
//             value={timeValue}
//             onChange={(newValue) => {
//               // Convert Dayjs object back to 'HH:mm' string format
//               const formattedTime = newValue ? newValue.format('HH:mm') : '';
//               onChange(formattedTime);
//             }}
//             onKeyDown={(e) => e.preventDefault()}
//             onKeyUp={(e) => e.preventDefault()}
//             minutesStep={1}
//             renderInput={(params) => (
//               <TextField {...params} fullWidth label={label} />
//             )}
//           />
//         </LocalizationProvider>
//       </div>
//     </div>
//   );
// };

// export default InputTime;


import { useEffect, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const InputTime = ({ label, value, onChange, className, disabled }) => {
  const [timeValue, setTimeValue] = useState(null);

  useEffect(() => {
    // Ensure value is in 'HH:mm' format and update timeValue accordingly
    if (value) {
      const parsedValue = dayjs(value, 'HH:mm');
      if (parsedValue.isValid()) {
        setTimeValue(parsedValue); // Set dayjs object
      }
    }
  }, [value]); // Run when value changes

  return (

    <span
      className='input-time-small-screen'
      //  className={` ${className}`}
      onKeyDown={(e) => e.preventDefault()}
      onKeyUp={(e) => e.preventDefault()}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} className="input-time-picker">
        <TimePicker
          value={timeValue}
          onChange={(newValue) => {
            if (!disabled) { // Only update if not disabled
              const formattedTime = newValue ? newValue.format('HH:mm') : '';
              setTimeValue(newValue); // Update timeValue state
              onChange(formattedTime); // Call parent onChange with formatted time
            }
          }}
          className={` ${className}`}
          onKeyDown={(e) => e.preventDefault()}
          onKeyUp={(e) => e.preventDefault()}
          minutesStep={1}
          disabled={disabled} // Disable the TimePicker when not editable
          renderInput={(params) => (
            <TextField {...params} fullWidth label={label} disabled={disabled} />
          )}
        />
      </LocalizationProvider>
    </span>
  );
};

export default InputTime;
