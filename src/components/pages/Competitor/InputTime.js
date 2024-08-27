// import React from 'react';
// import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import TextField from '@mui/material/TextField';
// import dayjs from 'dayjs';

// const InputTime = ({ label, value, onChange }) => {
//   // Convert time string to Dayjs object
//   const timeValue = value ? dayjs(value, 'HH:mm') : null;

//   return (
//     <div className="wd-150 mg-b-30">
//       <div className="input-group">
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <TimePicker
//             label={label}
//             value={timeValue}
//             // minutesStep={2}
//             onChange={(newValue) => {
//               // Convert Dayjs object back to HH:mm string format
//               const formattedTime = newValue ? newValue.format('HH:mm') : '';
//               onChange(formattedTime);
//             }}
//             renderInput={(params) => <TextField {...params} />}
//           />
//         </LocalizationProvider>
//       </div>
//     </div>
//   );
// };

// export default InputTime;

import React from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const InputTime = ({ label, value, onChange }) => {
  // Convert time string to Dayjs object
  const timeValue = value ? dayjs(value, 'HH:mm') : null;

  return (
    <div className="wd-150 mg-b-30">
      <div className="input-group">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
        
            value={timeValue}
            // minutesStep={2} // Set minute step here
            onChange={(newValue) => {
              // Convert Dayjs object back to HH:mm string format
              const formattedTime = newValue ? newValue.format('HH:mm') : '';
              onChange(formattedTime);
            }}
            minutesStep={1} 
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default InputTime;

