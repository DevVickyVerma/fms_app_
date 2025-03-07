import moment from "moment";
import { Tooltip } from "react-bootstrap";

// filterDataUtils.js
export function handleFilterData(
  handleApplyFilters,
  ReduxFullData,
  storedKeyName = "localFilterModalData"
) {
  const storedData = localStorage.getItem(storedKeyName);

  if (storedData) {
    let parsedData = JSON.parse(storedData);

    if (!parsedData.start_date) {
      const currentDate = new Date().toISOString().split("T")[0];
      parsedData.start_date = currentDate;
      localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
      // handleApplyFilters(parsedData);
    }
    handleApplyFilters(parsedData);
  } else if (localStorage.getItem("superiorRole") === "Client") {
    const storedClientIdData = localStorage.getItem("superiorId");
    if (ReduxFullData) {
      const futurepriceLog = {
        client_id: storedClientIdData,
        client_name: ReduxFullData?.full_name,
        company_id: ReduxFullData?.company_id,
        company_name: ReduxFullData?.company_name,
        start_date: new Date().toISOString().split("T")[0],
      };

      localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));
      handleApplyFilters(futurepriceLog);
    }
  }
}

export const hadndleShowDate = () => {
  const inputDateElement = document.querySelector('input[type="date"]');
  inputDateElement.showPicker();
};

export const getCurrentAndPreviousMonth = () => {
  // Get the current month and year
  const currentMonth = moment().format("MMM YYYY");

  // Get the previous month and year
  const previousMonth = moment().subtract(1, "month").format("MMM YYYY");

  // Return the result in the format "Previous Month vs Current Month"
  return `${previousMonth} vs ${currentMonth}`;
};

export const passwordTooltip = (
  <Tooltip id="password-tooltip">
    Your password must be at least 8 characters long and include:
    <ul>
      <li>At least one uppercase letter (A-Z)</li>
      <li>At least one number (0-9)</li>
      <li>At least one special character (e.g., !@#$%^&*)</li>
    </ul>
  </Tooltip>
);

export const handleShowDate = (e) => {
  const inputDateElement = e?.target; // Get the clicked input element
  if (
    inputDateElement &&
    inputDateElement?.showPicker &&
    !inputDateElement?.readOnly &&
    !inputDateElement?.disabled
  ) {
    inputDateElement.showPicker(); // Programmatically trigger the date picker
  }
};

export let storedKeyName = "localFilterModalData";

export const confirmPasswordTooltip = (
  <Tooltip id="confirm-password-tooltip">
    password must exactly match the password you entered above.
  </Tooltip>
);

export const renderTooltip = (message) => (
  <Tooltip
    id="button-tooltip"
    className="c-zindex-100000"
    style={{ zIndex: "1111111111111" }}
  >
    <span>{message}</span>
  </Tooltip>
);

export const formatNumber = (num) => {
  if (num === 0) {
    return "0"; // Explicitly handle zero case
  }

  if (num >= 1000000 || num <= -1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000 || num <= -1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString(); // Ensure it returns a string
  }
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero
  const day = String(today.getDate()).padStart(2, "0"); // Add leading zero
  return `${year}-${month}-${day}`;
};
export const currentMonth = new Date().toISOString().slice(0, 7);

export const yesNoOptions = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];

export const activeInactiveOptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

// ▪ Weekly
//             ▪ Current month
//             ▪ Year-to-Date (YTD)
//             ▪ Comparison with budget

export const Comparisongraphfilter = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Current month" },
  { value: "yearly", label: "Year-to-Date (YTD)" },
  { value: "yearly", label: "Actual Vs Previous Year Month" },
  { value: "custom", label: "Custom" },
];

export const AutomaticManualOptions = [
  { value: "1", label: "Automatic" },
  { value: "2", label: "manual" },
];

export const EVOBOSOptions = [
  { value: "0", label: "EVOBOS API" },
  { value: "1", label: "EVOBOS Manual" },
];
export const StartEndDate = [
  { value: "1", label: "Start Date" },
  { value: "2", label: "End Date" },
];
export const SalesSummary = [
  { value: "1", label: "Sales Summary" },
  { value: "0", label: "Grades Dispensed Summary" },
];
export const GraphfilterOptions = [
  {
    value: "weekly",
    label: `Weekly  `,
  },
  {
    value: "monthly",
    label: `Monthly  `,
  },
  {
    value: "yearly",
    label: `Year To Date   `,
  },
  // { value: "month_year", label: "Actual Vs Previous Year Month" },
  // { value: "budget", label: "Actual Vs Budget" },
  // { value: "custom", label: "Custom" },
];

export const BestvsWorst = [
  { value: "", label: "All" },
  { value: "1", label: "Best" },
  { value: "0", label: "Worst" },
];

export const PriceLogsFilterValue = [
  { value: "competitor", label: "Competitor vs Our" },
  { value: "fms", label: "TLM exception" },
  { value: "ov", label: "Not Observed" },
];

// export const PriceLogsFilterValue = [
//   { value: "1", label: "Competitor" },
//   { value: "0", label: "FMS" },
//   { value: "2", label: "OV" },
// ];
export function formatLabel(str) {
  // Check if the input is indeed a string
  if (typeof str !== "string") {
    console.error("Expected a string but got:", typeof str);
    return ""; // Return empty string if the input is not a string
  }

  return str
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word
}
export const getCurrentMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit format
  return `${year}-${month}`;
};
export const staticCompiCEOValues = {
  dates: [
    "2024-11-30",
    "2024-12-01",
    "2024-12-02",
    "2024-12-03",
    "2024-12-04",
    "2024-12-05",
    "2024-12-06",
  ],
  dataArray: {
    "2024-11-30": {
      Unleaded: [
        {
          name: "Volume",
          graph: "bar",
          price: 21.399,
        },
        {
          name: "Amersham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.419,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.389,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.399,
        },
      ],
      "Super Unleaded": [
        {
          name: "Volume",
          graph: "bar",
          price: 43.399,
        },
        {
          name: "Amersham ",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.489,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.599,
        },
      ],
      Diesel: [
        {
          name: "Volume",
          graph: "bar",
          price: 81.399,
        },
        {
          name: "Amersham ",
          graph: "line",
          price: 1.459,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.479,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.449,
        },
      ],
      "Super Diesel": [
        {
          name: "Volume",
          graph: "bar",
          price: 76.399,
        },
        {
          name: "Amersham ",
          graph: "line",
          price: 1.659,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.639,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.699,
        },
      ],
      Adblue: [
        {
          name: "Volume",
          graph: "bar",
          price: 77.399,
        },
        {
          name: "Amersham ",
          graph: "line",
          price: 1.799,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 0,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 0,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 0,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 0,
        },
      ],
    },
    "2024-12-01": {
      Unleaded: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.399,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.419,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.389,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.399,
        },
      ],
      "Super Unleaded": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.599,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.489,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.599,
        },
      ],
      Diesel: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.469,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.479,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.449,
        },
      ],
      "Super Diesel": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.669,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.639,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.699,
        },
      ],
      Adblue: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.799,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 0,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 0,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 0,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 0,
        },
      ],
    },
    "2024-12-02": {
      Unleaded: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.399,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.419,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.389,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.399,
        },
      ],
      "Super Unleaded": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.599,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.489,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.599,
        },
      ],
      Diesel: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.469,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.479,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.449,
        },
      ],
      "Super Diesel": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.669,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.639,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.699,
        },
      ],
      Adblue: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.799,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 0,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 0,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 0,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 0,
        },
      ],
    },
    "2024-12-03": {
      Unleaded: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.399,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.419,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.389,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.399,
        },
      ],
      "Super Unleaded": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.599,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.489,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.599,
        },
      ],
      Diesel: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.469,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.479,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.449,
        },
      ],
      "Super Diesel": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.669,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.639,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.699,
        },
      ],
      Adblue: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.799,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 0,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 0,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 0,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 0,
        },
      ],
    },
    "2024-12-04": {
      Unleaded: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.399,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.419,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.389,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.399,
        },
      ],
      "Super Unleaded": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.599,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.489,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.599,
        },
      ],
      Diesel: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.469,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.479,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.449,
        },
      ],
      "Super Diesel": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.669,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.639,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.699,
        },
      ],
      Adblue: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.799,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 0,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 0,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 0,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 0,
        },
      ],
    },
    "2024-12-05": {
      Unleaded: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.399,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.419,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.389,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.399,
        },
      ],
      "Super Unleaded": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.599,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.489,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.599,
        },
      ],
      Diesel: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.469,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.479,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.449,
        },
      ],
      "Super Diesel": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.669,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.639,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.699,
        },
      ],
      Adblue: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.799,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 0,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 0,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 0,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 0,
        },
      ],
    },
    "2024-12-06": {
      Unleaded: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.399,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.419,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.389,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.399,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.399,
        },
      ],
      "Super Unleaded": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.599,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.489,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.559,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.599,
        },
      ],
      Diesel: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.469,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.479,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.459,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.449,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.449,
        },
      ],
      "Super Diesel": [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.669,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 1.639,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 1.599,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 1.699,
        },
      ],
      Adblue: [
        {
          name: "Amersham ",
          graph: "bar",
          price: 1.799,
        },
        {
          name: "Chalfonts Way Sf Connect",
          graph: "line",
          price: 0,
        },
        {
          name: "Tesco Amersham",
          graph: "line",
          price: 0,
        },
        {
          name: "Mfg Chesham",
          graph: "line",
          price: 0,
        },
        {
          name: "Fitchs Service Station",
          graph: "line",
          price: 0,
        },
        {
          name: "Shell Chesham",
          graph: "line",
          price: 0,
        },
      ],
    },
  },
  fuelTypes: ["Adblue", "Diesel", "Super Diesel", "Super Unleaded", "Unleaded"],
  competitors: [
    {
      name: "Amersham ",
      supplierImage: "https://apis-l.credentiauk.com/splr/shell-logo.png",
      dist_miles: 0,
      station: true,
    },
    {
      name: "Chalfonts Way Sf Connect",
      supplierImage: "https://apis-l.credentiauk.com/splr/bp-logo.png",
      dist_miles: "1.5",
      station: false,
      logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
      logo_tip: "PetrolPrices",
    },
    {
      name: "Tesco Amersham",
      supplierImage: "https://apis-l.credentiauk.com/splr/tesco-logo.png",
      dist_miles: "1.5",
      station: false,
      logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
      logo_tip: "PetrolPrices",
    },
    {
      name: "Mfg Chesham",
      supplierImage: "https://apis-l.credentiauk.com/splr/esso-logo.png",
      dist_miles: "2.6",
      station: false,
      logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
      logo_tip: "PetrolPrices",
    },
    {
      name: "Fitchs Service Station",
      supplierImage: "https://apis-l.credentiauk.com/splr/bp-logo.png",
      dist_miles: "2.6",
      station: false,
      logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
      logo_tip: "PetrolPrices",
    },
    {
      name: "Shell Chesham",
      supplierImage: "https://apis-l.credentiauk.com/splr/shell-logo.png",
      dist_miles: "4.3",
      station: false,
      logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
      logo_tip: "PetrolPrices",
    },
  ],
  competitorListing: {
    Unleaded: [
      {
        name: "Amersham ",
        price: "£1.399",
        last_updated: "3d ago",
        last_date: "Price updated on (2024-12-03)",
        station: true,
      },
      {
        name: "Chalfonts Way Sf Connect",
        price: "£1.419",
        last_updated: "1d ago",
        last_date: "Price updated on (2024-12-05)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
      {
        name: "Tesco Amersham",
        price: "£1.389",
        last_updated: "1d ago",
        last_date: "Price updated on (2024-12-05)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
      {
        name: "Mfg Chesham",
        price: "£1.399",
        last_updated: "Today",
        last_date: "Price updated on (2024-12-06)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
      {
        name: "Fitchs Service Station",
        price: "£1.399",
        last_updated: "4d ago",
        last_date: "Price updated on (2024-12-02)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Shell Chesham",
        price: "£1.399",
        last_updated: "1d ago",
        last_date: "Price updated on (2024-12-05)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
    ],
    "Super Unleaded": [
      {
        name: "Amersham ",
        price: "£1.599",
        last_updated: "3d ago",
        last_date: "Price updated on (2024-12-03)",
        station: true,
      },
      {
        name: "Chalfonts Way Sf Connect",
        price: "£1.599",
        last_updated: "4d ago",
        last_date: "Price updated on (2024-12-02)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Tesco Amersham",
        price: "£1.489",
        last_updated: "6d ago",
        last_date: "Price updated on (2024-11-30)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Mfg Chesham",
        price: "£1.559",
        last_updated: "16d ago",
        last_date: "Price updated on (2024-11-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Fitchs Service Station",
        price: "£1.559",
        last_updated: "8d ago",
        last_date: "Price updated on (2024-11-28)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Shell Chesham",
        price: "£1.599",
        last_updated: "16d ago",
        last_date: "Price updated on (2024-11-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
    ],
    Diesel: [
      {
        name: "Amersham ",
        price: "£1.469",
        last_updated: "3d ago",
        last_date: "Price updated on (2024-12-03)",
        station: true,
      },
      {
        name: "Chalfonts Way Sf Connect",
        price: "£1.479",
        last_updated: "1d ago",
        last_date: "Price updated on (2024-12-05)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
      {
        name: "Tesco Amersham",
        price: "£1.449",
        last_updated: "1d ago",
        last_date: "Price updated on (2024-12-05)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
      {
        name: "Mfg Chesham",
        price: "£1.459",
        last_updated: "Today",
        last_date: "Price updated on (2024-12-06)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
      {
        name: "Fitchs Service Station",
        price: "£1.449",
        last_updated: "4d ago",
        last_date: "Price updated on (2024-12-02)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Shell Chesham",
        price: "£1.449",
        last_updated: "1d ago",
        last_date: "Price updated on (2024-12-05)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/gov-logo.png",
        logo_tip: "GOV.UK",
      },
    ],
    "Super Diesel": [
      {
        name: "Amersham ",
        price: "£1.669",
        last_updated: "3d ago",
        last_date: "Price updated on (2024-12-03)",
        station: true,
      },
      {
        name: "Chalfonts Way Sf Connect",
        price: "£1.639",
        last_updated: "6d ago",
        last_date: "Price updated on (2024-11-30)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Tesco Amersham",
        price: "£0",
        last_updated: "290d ago",
        last_date: "Price updated on (2024-02-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Mfg Chesham",
        price: "£1.599",
        last_updated: "8d ago",
        last_date: "Price updated on (2024-11-28)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Fitchs Service Station",
        price: "£1.599",
        last_updated: "8d ago",
        last_date: "Price updated on (2024-11-28)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Shell Chesham",
        price: "£1.699",
        last_updated: "11d ago",
        last_date: "Price updated on (2024-11-25)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
    ],
    Adblue: [
      {
        name: "Amersham ",
        price: "£1.799",
        last_updated: "3d ago",
        last_date: "Price updated on (2024-12-03)",
        station: true,
      },
      {
        name: "Chalfonts Way Sf Connect",
        price: "£0",
        last_updated: "290d ago",
        last_date: "Price updated on (2024-02-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Tesco Amersham",
        price: "£0",
        last_updated: "290d ago",
        last_date: "Price updated on (2024-02-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Mfg Chesham",
        price: "£0",
        last_updated: "290d ago",
        last_date: "Price updated on (2024-02-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Fitchs Service Station",
        price: "£0",
        last_updated: "290d ago",
        last_date: "Price updated on (2024-02-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
      {
        name: "Shell Chesham",
        price: "£0",
        last_updated: "290d ago",
        last_date: "Price updated on (2024-02-20)",
        station: false,
        logo: "https://apis-l.credentiauk.com/img/pp-logo.png",
        logo_tip: "PetrolPrices",
      },
    ],
  },
  siteName: "Amersham ",
  site_image: "https://apis-l.credentiauk.com/splr/shell-logo.png",
  opening: "2024-12-06 00:00:00",
  closing: "2024-12-06 23:59:59",
  last_dayend: "2024-12-02",
  firstTrans: "2024-12-06 00:00:00",
};

export const request = [
  {
    id: 1,
    data: "ℓ 23,536",
    data1: "Gross Volume",
    color: "primary",
    icon: "fa-bar-chart",
  },
  {
    id: 2,
    data: "£ 45,789",
    data1: "Fuel Sales",
    color: "secondary",
    icon: "fa-bar-chart",
  },
  {
    id: 3,
    data: "£ 89,786",
    data1: "Gross profit",
    color: "success",
    icon: "fa-bar-chart",
  },
  {
    id: 4,
    data: "PPl 43,336",
    data1: "Gross Margin",
    color: "info",
    icon: "fa-bar-chart",
  },
  {
    id: 5,
    data: "£ 23,536",
    data1: "Shop Sales",
    color: "primary",
    icon: "fa-bar-chart",
  },
  {
    id: 6, // Fixed duplicate id for the last item
    data: " £ 23,536",
    data1: " Shop Profit",
    color: "primary",
    icon: "fa-bar-chart",
  },
];

export const getSiteStats = [
  {
    fuel: "Unleaded",
    fuel_volume: "ℓ39031.0",
    fuel_value: "£52183.29",
    gross_profit: "£56874.71",
    gross_margin: "145.72ppl",
    total_transaction: 2235,
    cards: [
      {
        card_name: "GBP",
        image: "https://apis-l.credentia.uk/cards/gbp-logo.png",
        total_transactions: 837,
        total_fuel_sale_value: "£16373.32",
        total_fuel_sale_volume: "ℓ12246.69",
      },
      {
        card_name: "Mastercard",
        image: "https://apis-l.credentia.uk/cards/mastercard-logo.png",
        total_transactions: 594,
        total_fuel_sale_value: "£15657.53",
        total_fuel_sale_volume: "ℓ11711.21",
      },
      {
        card_name: "Visa Delta",
        image: "https://apis-l.credentia.uk/cards/visa-delta-logo.png",
        total_transactions: 780,
        total_fuel_sale_value: "£18957.83",
        total_fuel_sale_volume: "ℓ14179.57",
      },
      {
        card_name: "Unknown",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 13,
        total_fuel_sale_value: "£168.0",
        total_fuel_sale_volume: "ℓ125.67",
      },
      {
        card_name: "Amex",
        image: "https://apis-l.credentia.uk/cards/amex-logo.png",
        total_transactions: 6,
        total_fuel_sale_value: "£316.48",
        total_fuel_sale_volume: "ℓ236.72",
      },
      {
        card_name: "Keyfuels Bunkering",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 2,
        total_fuel_sale_value: "£70.67",
        total_fuel_sale_volume: "ℓ52.85",
      },
      {
        card_name: "Arval",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 2,
        total_fuel_sale_value: "£110.7",
        total_fuel_sale_volume: "ℓ82.8",
      },
      {
        card_name: "UK Fuels Bunkering",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 1,
        total_fuel_sale_value: "£12.18",
        total_fuel_sale_volume: "ℓ9.11",
      },
    ],
  },
  {
    fuel: "Diesel",
    fuel_volume: "ℓ42737.17",
    fuel_value: "£59034.06",
    gross_profit: "£70759.35",
    gross_margin: "165.57ppl",
    total_transaction: 2154,
    cards: [
      {
        card_name: "GBP",
        image: "https://apis-l.credentia.uk/cards/gbp-logo.png",
        total_transactions: 1078,
        total_fuel_sale_value: "£24939.28",
        total_fuel_sale_volume: "ℓ18051.2",
      },
      {
        card_name: "Visa Delta",
        image: "https://apis-l.credentia.uk/cards/visa-delta-logo.png",
        total_transactions: 568,
        total_fuel_sale_value: "£16765.42",
        total_fuel_sale_volume: "ℓ12136.88",
      },
      {
        card_name: "Mastercard",
        image: "https://apis-l.credentia.uk/cards/mastercard-logo.png",
        total_transactions: 455,
        total_fuel_sale_value: "£14510.58",
        total_fuel_sale_volume: "ℓ10504.54",
      },
      {
        card_name: "Unknown",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 15,
        total_fuel_sale_value: "£253.0",
        total_fuel_sale_volume: "ℓ183.61",
      },
      {
        card_name: "UK Fuels Bunkering",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 19,
        total_fuel_sale_value: "£1187.73",
        total_fuel_sale_volume: "ℓ860.18",
      },
      {
        card_name: "Keyfuels Bunkering",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 8,
        total_fuel_sale_value: "£576.78",
        total_fuel_sale_volume: "ℓ418.15",
      },
      {
        card_name: "Arval",
        image: "https://apis-l.credentia.uk/cards/card-image.png",
        total_transactions: 9,
        total_fuel_sale_value: "£487.31",
        total_fuel_sale_volume: "ℓ353.71",
      },
      {
        card_name: "Amex",
        image: "https://apis-l.credentia.uk/cards/amex-logo.png",
        total_transactions: 2,
        total_fuel_sale_value: "£72.4",
        total_fuel_sale_volume: "ℓ52.2",
      },
    ],
  },
];

export const staticCompiPriceCommon = {
  competitorname: "Chalfonts Way Sf Connect",
  head_array: [
    "Unleaded",
    "Super Unleaded",
    "Diesel",
    "Super Diesel",
    "Adblue",
  ],
  listing: {
    id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
    site_name: "Amersham ",
    competitors: [
      {
        id: "VUtocDJvK3BOSzU1MUtJNC8wOTZ0UT09",
        competitor_name: "Chalfonts Way Sf Connect",
        supplier: "http://192.168.1.112:4001/splr/bp-logo.png",
        show_sign: false,
        fuels: {
          gov: [
            {
              id: "RFF3aUNiZ25JMVZpYldmbDdSVU5KQT09",
              time: "10:30",
              category_name: "Unleaded",
              price: 1.419,
              date: "2024-12-11",
              last_updated: "7d ago",
            },
            {
              id: "ZXk2KzQxVm9aTFNNNVQ5YXUyVnpXUT09",
              time: "-",
              category_name: "Super Unleaded",
              price: "-",
              date: "-",
              last_updated: "-",
            },
            {
              id: "dHRBc0lrbFliNlgvNDcwd2xRNG93dz09",
              time: "10:30",
              category_name: "Diesel",
              price: 1.479,
              date: "2024-12-11",
              last_updated: "7d ago",
            },
            {
              id: "ck9DVnIzTTg1a1FFOU9sMnc4Y1Y3QT09",
              time: "-",
              category_name: "Super Diesel",
              price: "-",
              date: "-",
              last_updated: "-",
            },
            {
              id: "SkcxelYrMXBwbFR4SlV1ZWpURXlvZz09",
              time: "-",
              category_name: "Adblue",
              price: "-",
              date: "-",
              last_updated: "-",
            },
          ],
          pp: [
            {
              id: "MWlJaHJVd0dhdlZWcEU5TjFUZXV0QT09",
              time: "17:00",
              category_name: "Unleaded",
              price: 1.419,
              date: "2024-12-10",
              last_updated: "8d ago",
            },
            {
              id: "NmNJRTJYZFhjK282TlBrUlNpdFhPQT09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.599,
              date: "2024-12-10",
              last_updated: "8d ago",
            },
            {
              id: "SVR2aHN5YXBlcTY0ZWRMTU84ZmRlZz09",
              time: "17:00",
              category_name: "Diesel",
              price: 1.479,
              date: "2024-12-10",
              last_updated: "8d ago",
            },
            {
              id: "UHdDYldxVzVhRFRNUDFBdHhjTjJtdz09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.639,
              date: "2024-12-06",
              last_updated: "12d ago",
            },
            {
              id: "czUvZ3lGRWtJS2l5YjhzUGdFOWFUdz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "302d ago",
            },
          ],
          ov: [
            {
              id: "RFF3aUNiZ25JMVZpYldmbDdSVU5KQT09",
              time: "10:30",
              category_name: "Unleaded",
              price: 1.419,
              date: "2024-12-11",
              last_updated: "7d ago",
            },
            {
              id: "NmNJRTJYZFhjK282TlBrUlNpdFhPQT09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.599,
              date: "2024-12-10",
              last_updated: "8d ago",
            },
            {
              id: "dHRBc0lrbFliNlgvNDcwd2xRNG93dz09",
              time: "10:30",
              category_name: "Diesel",
              price: 1.479,
              date: "2024-12-11",
              last_updated: "7d ago",
            },
            {
              id: "UHdDYldxVzVhRFRNUDFBdHhjTjJtdz09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.639,
              date: "2024-12-06",
              last_updated: "12d ago",
            },
            {
              id: "czUvZ3lGRWtJS2l5YjhzUGdFOWFUdz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "302d ago",
            },
          ],
        },
      },
    ],
  },
  fuels: [
    [
      {
        id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
        name: "Unleaded",
        time: "00:00",
        price: "1.399",
        date: "2024-12-12",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
        name: "Super Unleaded",
        time: "00:00",
        price: "1.599",
        date: "2024-12-12",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
        name: "Diesel",
        time: "00:00",
        price: "1.459",
        date: "2024-12-12",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
        name: "Super Diesel",
        time: "00:00",
        price: "1.659",
        date: "2024-12-12",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "U2dXNXN4OG5rSkdsOGZ0TXhTR0ZQZz09",
        name: "Adblue",
        time: "00:00",
        price: "1.799",
        date: "2024-12-12",
        is_editable: true,
        status: "SAME",
      },
    ],
  ],
  btn_clickable: true,
  notify_operator: true,
  update_tlm_price: 0,
};

export const staticCompiPriceCommon2 = {
  fuel_head_array: [
    "Date",
    "Time",
    "Unleaded",
    "Super Unleaded",
    "Diesel",
    "Super Diesel",
    "Adblue",
  ],
  head_array: [
    "Unleaded",
    "Super Unleaded",
    "Diesel",
    "Super Diesel",
    "Adblue",
  ],
  current: [
    [
      {
        id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
        name: "Unleaded",
        time: "00:00",
        price: "1.399",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
        name: "Super Unleaded",
        time: "00:00",
        price: "1.599",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
        name: "Diesel",
        time: "00:00",
        price: "1.459",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
        name: "Super Diesel",
        time: "00:00",
        price: "1.659",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "U2dXNXN4OG5rSkdsOGZ0TXhTR0ZQZz09",
        name: "Adblue",
        time: "00:00",
        price: "1.799",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
    ],
  ],
  head_arrayMain: [
    {
      id: 0,
      name: "Date",
    },
    {
      id: 1,
      name: "Time",
    },
    {
      id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
      name: "Unleaded",
    },
    {
      id: "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
      name: "Super Unleaded",
    },
    {
      id: "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
      name: "Diesel",
    },
    {
      id: "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
      name: "Super Diesel",
    },
    {
      id: "U2dXNXN4OG5rSkdsOGZ0TXhTR0ZQZz09",
      name: "Adblue",
    },
  ],
  currentDate: "2025-01-17",
  currentTime: "07:29",
  listing: {
    id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
    site_name: "Amersham ",
    supplier: "http://192.168.1.112:4001/splr/shell-logo.png",
    competitors: [
      {
        id: "VUtocDJvK3BOSzU1MUtJNC8wOTZ0UT09",
        competitor_name: "Chalfonts Way Sf Connect",
        supplier: "http://192.168.1.112:4001/splr/bp-logo.png",
        canUpdate: true,
        acceptedBy: "",
        isMain: 1,
        fuels: {
          gov: [
            {
              id: "VG1zL1ZlRllDeG1JVHZyeERXWHlaUT09",
              time: "19:00",
              category_name: "Unleaded",
              price: 1.429,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "ZXk2KzQxVm9aTFNNNVQ5YXUyVnpXUT09",
              time: "-",
              category_name: "Super Unleaded",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "WVBrTENNTSs5ZGJnSUsweHJLeE50Zz09",
              time: "19:00",
              category_name: "Diesel",
              price: 1.479,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "ck9DVnIzTTg1a1FFOU9sMnc4Y1Y3QT09",
              time: "-",
              category_name: "Super Diesel",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "SkcxelYrMXBwbFR4SlV1ZWpURXlvZz09",
              time: "-",
              category_name: "Adblue",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
          ],
          pp: [
            {
              id: "bWd2T2JTREdMdm8xWFI4VlFwZUFyZz09",
              time: "17:00",
              category_name: "Unleaded",
              price: 1.419,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "VFZrU0RjR3VxTkNzdzN6enloOVVnQT09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.599,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "U1FIRno1aE5wWUR0anJBMzkrS3p1UT09",
              time: "17:00",
              category_name: "Diesel",
              price: 1.479,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "b1g2Wkdpams2K240dHkzdlNKL2hFQT09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.639,
              date: "2024-12-16",
              last_updated: "32d ago",
              canUpdate: false,
            },
            {
              id: "czUvZ3lGRWtJS2l5YjhzUGdFOWFUdz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: false,
            },
          ],
          ov: [
            {
              id: "VG1zL1ZlRllDeG1JVHZyeERXWHlaUT09",
              time: "19:00",
              category_name: "Unleaded",
              price: 1.429,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "VFZrU0RjR3VxTkNzdzN6enloOVVnQT09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.599,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: true,
            },
            {
              id: "WVBrTENNTSs5ZGJnSUsweHJLeE50Zz09",
              time: "19:00",
              category_name: "Diesel",
              price: 1.479,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "b1g2Wkdpams2K240dHkzdlNKL2hFQT09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.639,
              date: "2024-12-16",
              last_updated: "32d ago",
              canUpdate: true,
            },
            {
              id: "czUvZ3lGRWtJS2l5YjhzUGdFOWFUdz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: true,
            },
          ],
        },
      },
      {
        id: "a0dqUlBGbjR5TDIxak9QOHhrQlpuQT09",
        competitor_name: "Tesco Amersham",
        supplier: "http://192.168.1.112:4001/splr/tesco-logo.png",
        canUpdate: true,
        acceptedBy: "",
        isMain: 0,
        fuels: {
          gov: [
            {
              id: "ZjdNMk0yZDNrVUUwT3gyQzJtTGRtUT09",
              time: "07:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "Rk00bHgxUmJwSXJ6K0xWblcxS2ttdz09",
              time: "-",
              category_name: "Super Unleaded",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "ZVEvR1RiYWZFYzg1QlpkL01LOHFZdz09",
              time: "07:00",
              category_name: "Diesel",
              price: 1.459,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "dG5Na0p6U2FZUWEwSkdFRW5seU5lQT09",
              time: "-",
              category_name: "Super Diesel",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "aCtmcGt4dytDTXNDd0xPY1Rka2xSUT09",
              time: "-",
              category_name: "Adblue",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
          ],
          pp: [
            {
              id: "RG5nY0pNbENYY1hIYnR0c1c5R2h1Zz09",
              time: "17:00",
              category_name: "Unleaded",
              price: 1.389,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "UFFkZm5GbjJueUFtNkY5eEpqRitiZz09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.489,
              date: "2024-12-16",
              last_updated: "32d ago",
              canUpdate: false,
            },
            {
              id: "ZjkwM29JODNQUHF0TGJJZ2pqRHAyZz09",
              time: "17:00",
              category_name: "Diesel",
              price: 1.449,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "RndsZk9PQjhIRldnMDFrM1JVYzI5Zz09",
              time: "16:58",
              category_name: "Super Diesel",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: false,
            },
            {
              id: "ZkFseHlONE5wTmFOQTV4cC9jVkpOZz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: false,
            },
          ],
          ov: [
            {
              id: "ZjdNMk0yZDNrVUUwT3gyQzJtTGRtUT09",
              time: "07:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "UFFkZm5GbjJueUFtNkY5eEpqRitiZz09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.489,
              date: "2024-12-16",
              last_updated: "32d ago",
              canUpdate: true,
            },
            {
              id: "ZVEvR1RiYWZFYzg1QlpkL01LOHFZdz09",
              time: "07:00",
              category_name: "Diesel",
              price: 1.459,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "RndsZk9PQjhIRldnMDFrM1JVYzI5Zz09",
              time: "16:58",
              category_name: "Super Diesel",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: true,
            },
            {
              id: "ZkFseHlONE5wTmFOQTV4cC9jVkpOZz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: true,
            },
          ],
        },
      },
      {
        id: "REhPMlhrOUhCVm9tbXowUk5XMXJSUT09",
        competitor_name: "Mfg Chesham",
        supplier: "http://192.168.1.112:4001/splr/esso-logo.png",
        canUpdate: true,
        acceptedBy: "",
        isMain: 0,
        fuels: {
          gov: [
            {
              id: "WEV2OStpUnJHRDJUMkdWUXNsWHdUQT09",
              time: "19:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "NlhJejBYQVBKdFJ1S3BFaVF5SEN2UT09",
              time: "-",
              category_name: "Super Unleaded",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "VzFxaU5HSGJWemhLa1YraFhNNEI1dz09",
              time: "19:00",
              category_name: "Diesel",
              price: 1.459,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "Q0xvYWJOcDZLQ29jZlVRVVE0YnR4dz09",
              time: "-",
              category_name: "Super Diesel",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "MW45aDFxb2htcnlrRmhkL1BYQlZ1UT09",
              time: "-",
              category_name: "Adblue",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
          ],
          pp: [
            {
              id: "aCt0RHZhMEJYd1lQVGl3cHk2eXFYUT09",
              time: "17:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "QkUvVkhCUVRKaGRQNUFjU0ExUDhMUT09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.559,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "RmM5Y0Q1Z2kvTmMrdW1HMzRGc1ROUT09",
              time: "17:00",
              category_name: "Diesel",
              price: 1.459,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "SXlQc1MwZm1WVFZpQktqNS9Qb2o2UT09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.599,
              date: "2024-12-16",
              last_updated: "32d ago",
              canUpdate: false,
            },
            {
              id: "ZUc3RHBQVmFsZGl4TFd3a1pVMjVpZz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: false,
            },
          ],
          ov: [
            {
              id: "WEV2OStpUnJHRDJUMkdWUXNsWHdUQT09",
              time: "19:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "QkUvVkhCUVRKaGRQNUFjU0ExUDhMUT09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.559,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: true,
            },
            {
              id: "VzFxaU5HSGJWemhLa1YraFhNNEI1dz09",
              time: "19:00",
              category_name: "Diesel",
              price: 1.459,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "SXlQc1MwZm1WVFZpQktqNS9Qb2o2UT09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.599,
              date: "2024-12-16",
              last_updated: "32d ago",
              canUpdate: true,
            },
            {
              id: "ZUc3RHBQVmFsZGl4TFd3a1pVMjVpZz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: true,
            },
          ],
        },
      },
      {
        id: "RGJveWp2RzNHOCtsMTNsVXdzNmY1Zz09",
        competitor_name: "Fitchs Service Station",
        supplier: "http://192.168.1.112:4001/splr/bp-logo.png",
        canUpdate: true,
        acceptedBy: "",
        isMain: 0,
        fuels: {
          gov: [
            {
              id: "R0hROXZidHQ0SEprRXArbFZzL3RlUT09",
              time: "-",
              category_name: "Unleaded",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "MXBjVlc0dFlmK0ZtajYwUU1kZm9mdz09",
              time: "-",
              category_name: "Super Unleaded",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "QjMwTnpGZkxKbFJBWTgyRFdwSkN0UT09",
              time: "-",
              category_name: "Diesel",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "WEY4UXl3cUxpY2liQWd6WFhuaUFHQT09",
              time: "-",
              category_name: "Super Diesel",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "Nm1vSWg2emx5WG1JdldqTzF5czRrdz09",
              time: "-",
              category_name: "Adblue",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
          ],
          pp: [
            {
              id: "dVQ1RG5KNkNpWERTZnNCVXRhdys2QT09",
              time: "17:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "eDZvMmFaUnJDZXNKalVZcXU1eFljdz09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.559,
              date: "2024-12-11",
              last_updated: "37d ago",
              canUpdate: false,
            },
            {
              id: "MjE0VEZGZmxVM0lWY3Rud24yYTFRdz09",
              time: "17:00",
              category_name: "Diesel",
              price: 1.459,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "UjE0ZysvWDdzc2NWOTVwS1l4dUoxZz09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.599,
              date: "2024-11-28",
              last_updated: "50d ago",
              canUpdate: false,
            },
            {
              id: "ZW1ybVh6eUZDQU1LQks1YW1ESUkvUT09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: false,
            },
          ],
          ov: [
            {
              id: "dVQ1RG5KNkNpWERTZnNCVXRhdys2QT09",
              time: "17:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: true,
            },
            {
              id: "eDZvMmFaUnJDZXNKalVZcXU1eFljdz09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.559,
              date: "2024-12-11",
              last_updated: "37d ago",
              canUpdate: true,
            },
            {
              id: "MjE0VEZGZmxVM0lWY3Rud24yYTFRdz09",
              time: "17:00",
              category_name: "Diesel",
              price: 1.459,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: true,
            },
            {
              id: "UjE0ZysvWDdzc2NWOTVwS1l4dUoxZz09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.599,
              date: "2024-11-28",
              last_updated: "50d ago",
              canUpdate: true,
            },
            {
              id: "ZW1ybVh6eUZDQU1LQks1YW1ESUkvUT09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: true,
            },
          ],
        },
      },
      {
        id: "d051Z3VnMmNTR2ZldVo5clNQRXgrUT09",
        competitor_name: "Shell Chesham",
        supplier: "http://192.168.1.112:4001/splr/shell-logo.png",
        canUpdate: true,
        acceptedBy: "",
        isMain: 0,
        fuels: {
          gov: [
            {
              id: "RjdON0FHem9xL0dYV2JmclUxV2lPUT09",
              time: "19:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "OW9JbnZrUjB4bWIvNVFCMEFkaGVzUT09",
              time: "-",
              category_name: "Super Unleaded",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "aStTN09XZWEveXVQbGtZaDBKaGJhdz09",
              time: "19:00",
              category_name: "Diesel",
              price: 1.449,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: false,
            },
            {
              id: "b0ZGdEt3eGpiSHA1RzlwaEZncjZSdz09",
              time: "-",
              category_name: "Super Diesel",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
            {
              id: "UDlZVnc3b1I1bTdEV1NZa21UYzcvZz09",
              time: "-",
              category_name: "Adblue",
              price: 0,
              date: "-",
              last_updated: "-",
              canUpdate: false,
            },
          ],
          pp: [
            {
              id: "YmNud2JDZkxwT1VqVWpGR0tMSzF2dz09",
              time: "17:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "R1RaNy9oZHVXZ1YzeGtuSDRmanlXZz09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.599,
              date: "2024-12-14",
              last_updated: "34d ago",
              canUpdate: false,
            },
            {
              id: "MFdwc1dWQ0FOdW9QZE5MUFpDbXMzdz09",
              time: "17:00",
              category_name: "Diesel",
              price: 1.449,
              date: "2024-12-17",
              last_updated: "31d ago",
              canUpdate: false,
            },
            {
              id: "STVTNCtxZ1pQVkpVQzVMZTd2T3h3UT09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.699,
              date: "2024-11-25",
              last_updated: "53d ago",
              canUpdate: false,
            },
            {
              id: "YVF1WVdDZ09Ma1l2eTJzWndvQjlSdz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: false,
            },
          ],
          ov: [
            {
              id: "RjdON0FHem9xL0dYV2JmclUxV2lPUT09",
              time: "19:00",
              category_name: "Unleaded",
              price: 1.399,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "R1RaNy9oZHVXZ1YzeGtuSDRmanlXZz09",
              time: "17:00",
              category_name: "Super Unleaded",
              price: 1.599,
              date: "2024-12-14",
              last_updated: "34d ago",
              canUpdate: true,
            },
            {
              id: "aStTN09XZWEveXVQbGtZaDBKaGJhdz09",
              time: "19:00",
              category_name: "Diesel",
              price: 1.449,
              date: "2024-12-18",
              last_updated: "30d ago",
              canUpdate: true,
            },
            {
              id: "STVTNCtxZ1pQVkpVQzVMZTd2T3h3UT09",
              time: "17:00",
              category_name: "Super Diesel",
              price: 1.699,
              date: "2024-11-25",
              last_updated: "53d ago",
              canUpdate: true,
            },
            {
              id: "YVF1WVdDZ09Ma1l2eTJzWndvQjlSdz09",
              time: "16:58",
              category_name: "Adblue",
              price: 0,
              date: "2024-02-20",
              last_updated: "332d ago",
              canUpdate: true,
            },
          ],
        },
      },
    ],
  },
  site_name: "Amersham ",
  supplier: "http://192.168.1.112:4001/splr/shell-logo.png",
  fuels: [
    [
      {
        id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
        name: "Unleaded",
        time: "00:00",
        price: "1.399",
        date: "2024-12-18",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
        name: "Super Unleaded",
        time: "00:00",
        price: "1.599",
        date: "2024-12-18",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
        name: "Diesel",
        time: "00:00",
        price: "1.459",
        date: "2024-12-18",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
        name: "Super Diesel",
        time: "00:00",
        price: "1.659",
        date: "2024-12-18",
        is_editable: true,
        status: "SAME",
      },
      {
        id: "U2dXNXN4OG5rSkdsOGZ0TXhTR0ZQZz09",
        name: "Adblue",
        time: "00:00",
        price: "1.799",
        date: "2024-12-18",
        is_editable: true,
        status: "SAME",
      },
    ],
  ],
  current: [
    [
      {
        id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
        name: "Unleaded",
        time: "00:00",
        price: "1.399",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
        name: "Super Unleaded",
        time: "00:00",
        price: "1.599",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
        name: "Diesel",
        time: "00:00",
        price: "1.459",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
        name: "Super Diesel",
        time: "00:00",
        price: "1.659",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
      {
        id: "U2dXNXN4OG5rSkdsOGZ0TXhTR0ZQZz09",
        name: "Adblue",
        time: "00:00",
        price: "1.799",
        date: "2024-12-18",
        is_editable: false,
        status: "SAME",
      },
    ],
  ],
  btn_clickable: true,
  notify_operator: true,
  update_tlm_price: 0,
};
