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


