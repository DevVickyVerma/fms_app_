import { Tooltip } from "react-bootstrap";

// filterDataUtils.js
export function handleFilterData(handleApplyFilters, ReduxFullData, storedKeyName = 'localFilterModalData',) {

    const storedData = localStorage.getItem(storedKeyName);

    if (storedData) {
        let parsedData = JSON.parse(storedData);

        if (!parsedData.start_date) {
            const currentDate = new Date().toISOString().split('T')[0];
            parsedData.start_date = currentDate;

            localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
            // handleApplyFilters(parsedData);
        }
        handleApplyFilters(parsedData);
    } else if (localStorage.getItem('superiorRole') === 'Client') {
        const storedClientIdData = localStorage.getItem('superiorId');
        if (ReduxFullData) {
            const futurepriceLog = {
                client_id: storedClientIdData,
                client_name: ReduxFullData?.full_name,
                company_id: ReduxFullData?.company_id,
                company_name: ReduxFullData?.company_name,
                start_date: new Date().toISOString().split('T')[0],
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
        return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return num;
    }
};


export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
};


export const yesNoOptions = [
    { value: '1', label: 'Yes' },
    { value: '0', label: 'No' },
];

export const activeInactiveOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
];

export const AutomaticManualOptions = [
    { value: '1', label: 'Automatic' },
    { value: '2', label: 'manual' },
];
export const StartEndDate = [
    { value: '1', name: 'Start Date' },
    { value: '2', name: 'End Date' },

];
export const SalesSummary = [
    { value: '1', label: 'Sales Summary' },
    { value: '0', label: 'Grades Dispensed Summary' },

];
export function formatLabel(str) {
    // Check if the input is indeed a string
    if (typeof str !== 'string') {
      console.error("Expected a string but got:", typeof str);
      return ''; // Return empty string if the input is not a string
    }
  
    return str
      .replace(/_/g, ' ')               // Replace underscores with spaces
      .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word
  }