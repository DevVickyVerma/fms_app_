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
