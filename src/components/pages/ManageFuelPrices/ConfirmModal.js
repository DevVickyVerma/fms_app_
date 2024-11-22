const ConfirmModal = ({ isOpen, LatsRowvalues, onConfirm, onCancel, formValues, SiteName, update_tlm_price }) => {
    // Early return if modal is not open
    if (!isOpen) return null;

    const { pricedata } = formValues || {};
    const { current } = pricedata || {};
    const lastArray = LatsRowvalues?.listing[LatsRowvalues?.listing?.length - 1];

    const styles = {
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modalContent: {
            background: 'white',
            borderRadius: '0',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            width: '50%',
            padding:"10px"
        },
        modalHeader: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            padding: '1px',
        },
        rowBorder: {
            border: '1px solid #ddd',
            backgroundColor: '#fff',
        },
        badgeText: {
            display: 'block',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            maxWidth: '100%',
            lineHeight: '1.4',
            textAlign: 'left',
            fontSize: '12px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        tableHead: {
            background: '#fff',
        },
        modalFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
        },
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                    <h4 className="m-0 p-2">
                        {SiteName} - Update Fuel Selling Price
                        <br />
                        <small>({lastArray[0]?.date}, {lastArray[0]?.time})</small>
                    </h4>
                </div>
                <div className="table-container table-responsive">
                    <table style={styles.table} className="table">
                        <thead style={styles.tableHead}>
                            <tr style={styles.rowBorder}>
                                <th style={styles.rowBorder}>Grade</th>
                                <th style={styles.rowBorder}>Current Price</th>
                                <th style={styles.rowBorder}>New Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formValues?.head_array
                                ?.filter((item) => item.id !== 0 && item.id !== 1) // Filter out unwanted IDs
                                .map((item) => {
                                    const currentItem = current[0].find((currentItem) => currentItem.id === item.id);
                                    const updatedItem = lastArray.find((updatedItem) => updatedItem.id === item.id);

                                    let displayPrice = updatedItem?.price; // Default to updated price
                                    let className = '';

                                    if (currentItem && updatedItem) {
                                        const currentPrice = parseFloat(currentItem.price);
                                        const updatedPrice = parseFloat(updatedItem.price);

                                        if (updatedPrice > currentPrice) {
                                            className = 'text-success'; // Higher price
                                        } else if (updatedPrice < currentPrice) {
                                            className = 'text-danger'; // Lower price
                                        } else {
                                            displayPrice = '---'; // Same price
                                            className = ''; // Optional class for "Same" state
                                        }
                                    }

                                    return (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{currentItem?.price}</td>
                                            <td className={className}>{displayPrice}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                {update_tlm_price === 1 && (
                    <span style={styles.badgeText} className="badge btn-danger p-4 mt-3">
                        Upon clicking the Submit button, the prices will be updated on both the TLM back office and the
                        pole sign. Please ensure to check the pole sign display, as occasionally, connectivity issues
                        between the pole sign and POS system may prevent the update from reflecting immediately.
                    </span>
                )}
                <div className="text-end mt-4">
                    <button className="btn btn-danger" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary ms-2" onClick={onConfirm}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
