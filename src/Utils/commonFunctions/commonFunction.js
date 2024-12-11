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

export const confirmPasswordTooltip = (
  <Tooltip id="confirm-password-tooltip">
    password must exactly match the password you entered above.
  </Tooltip>
);

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num;
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
  { value: "1", label: "Weekly" },
  { value: "2", label: "Current month" },
  { value: "3", label: "Year-to-Date (YTD)" },
  { value: "4", label: "Comparison with budget" },
  { value: "5", label: "Custom" },
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