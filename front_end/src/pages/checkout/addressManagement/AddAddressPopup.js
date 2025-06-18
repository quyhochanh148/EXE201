import React from 'react';
import AddressForm from './AddressForm';

/**
 * AddAddressPopup Component
 * 
 * Modal popup for adding a new delivery address.
 * 
 * @param {Function} onClose - Function to call when closing the popup
 * @param {Function} onSave - Function to call with form data when saving
 */
const AddAddressPopup = ({ onClose, onSave }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2 sm:px-0">
            <div className="bg-white p-3 sm:p-6 rounded-2xl w-full max-w-xs sm:max-w-lg max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg font-semibold">Add Delivery Address</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-2 -mr-2 sm:mr-0"
                        aria-label="Đóng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <AddressForm 
                    onSubmit={onSave}
                    submitLabel="Add"
                />
                
                <div className="mt-3 sm:mt-4 text-right">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAddressPopup;