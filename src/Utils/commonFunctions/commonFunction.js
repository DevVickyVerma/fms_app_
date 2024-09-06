import { useSelector } from 'react-redux';

// Define the custom hook
export const useHandleStorageAndFilters = (storedKeyName = 'localFilterModalData') => {
    const ReduxFullData = useSelector((state) => state?.data?.data || null);

    const handleFilterssss = (storedData, handleApplyFilters) => {
        if (storedData) {
            try {
                let parsedData = JSON.parse(storedData);

                // Check if start_date exists in storedData
                if (!parsedData.start_date) {
                    // If start_date does not exist, set it to the current date
                    const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                    parsedData.start_date = currentDate;

                    // Update the stored data with the new start_date
                    localStorage.setItem(storedKeyName, JSON.stringify(parsedData));
                }

                // Apply filters with the parsed data
                handleApplyFilters(parsedData);
            } catch (error) {
                console.error("Error parsing storedData:", error);
            }
        } else if (localStorage.getItem('superiorRole') === 'Client') {
            const storedClientIdData = localStorage.getItem('superiorId');
            if (ReduxFullData) {
                const futurepriceLog = {
                    client_id: storedClientIdData,
                    client_name: ReduxFullData?.full_name,
                    company_id: ReduxFullData?.company_id,
                    company_name: ReduxFullData?.company_name,
                    start_date: new Date().toISOString().split('T')[0], // Set current date as start_date
                };

                // Optionally store this data back to localStorage
                localStorage.setItem(storedKeyName, JSON.stringify(futurepriceLog));

                // Apply filters with futurepriceLog
                handleApplyFilters(futurepriceLog);
            }
        }
    };

    return handleFilterssss;
};
