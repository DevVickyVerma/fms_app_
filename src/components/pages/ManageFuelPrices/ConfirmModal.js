import './ConfirmModal.css'; // Import CSS for styling

const ConfirmModal = ({ isOpen, LatsRowvalues, onConfirm, onCancel, formValues, SiteName, update_tlm_price }) => {
    // Early return if modal is not open
    if (!isOpen) return null;
    const { pricedata } = formValues || {};
    const { current } = pricedata || {};
    const lastArray = LatsRowvalues?.listing[LatsRowvalues?.listing?.length - 1];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='modal-header'>
                    <h4 className='m-0 p-2'>{SiteName}- Update Fuel Selling Price  <br></br><small clas
                        mt-4>  ({lastArray[0]?.date} {", "} {lastArray[0]?.time})</small>  </h4>
                </div>
                <div className="table-container table-responsive">

                    <table className="table">
                        <thead style={{ background: "#fff " }}>
                            <tr className='rowborder'>
                                <th className='rowborder'>Grade</th>
                                <th className='rowborder'>Current Price  </th>
                                <th className='rowborder'>New Price   </th>
                            </tr>
                        </thead>
                        <tbody>
                            {formValues?.head_array
                                ?.filter(item => item.id !== 0 && item.id !== 1) // Filter out unwanted IDs
                                .map(item => {
                                    // Find current price data for the current fuel grade
                                    const currentItem = current[0].find(currentItem => currentItem.id === item.id);
                                    // Find updated price data for the current fuel grade
                                    const updatedItem = lastArray.find(updatedItem => updatedItem.id === item.id);

                                    // Determine the text or class based on price comparison
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

                                            {/* Current Price Column */}
                                            <td>{currentItem?.price}</td>

                                            {/* Updated Price Column with dynamic display */}
                                            <td className={className}>{displayPrice}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>




                    </table>
                </div>
                {update_tlm_price === 1 && (
                    <span
                        className="badge btn-danger p-4 badge-text mt-3"
                    >
                        Upon clicking the Submit button, the prices will be updated on both the TLM back office and the pole sign.
                        Please ensure to check the pole sign display, as occasionally, connectivity issues between the pole sign and POS system may prevent the update from reflecting immediately.
                    </span>
                )}
                {/* {notify_operator === true && (
                    <span
                        className="badge btn-danger p-4 badge-text mt-3"
                    >
                        Upon clicking the Submit button, the prices will be updated on both the TLM back office and the pole sign.
                        Please ensure to check the pole sign display, as occasionally, connectivity issues between the pole sign and POS system may prevent the update from reflecting immediately.
                    </span>
                )} */}




                <div className="modal-footer">
                    <button className='btn btn-danger' onClick={onCancel}>Cancel</button>
                    <button className='btn btn-primary ms-2' onClick={onConfirm}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
