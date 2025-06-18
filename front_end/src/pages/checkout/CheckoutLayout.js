import React from 'react';

/**
 * CheckoutLayout Component
 * 
 * A layout component that arranges the different sections of the checkout page.
 * It organizes content into a two-column layout on medium and larger screens,
 * with a single column on mobile devices.
 * 
 * @param {React.ReactNode} addressSection - The address selection section
 * @param {React.ReactNode} paymentMethodSection - The payment method selection section
 * @param {React.ReactNode} deliveryMethodSection - The delivery method selection section
 * @param {React.ReactNode} orderSummary - The order summary section
 */
const CheckoutLayout = ({ 
    addressSection, 
    paymentMethodSection, 
    deliveryMethodSection, 
    orderSummary 
}) => {
    return (
        <div className="container mx-auto p-4 max-w-7xl">
            {/* Mobile Layout */}
            <div className="block lg:hidden">
                {/* Mobile Order Summary - Fixed at top */}
                <div className="mb-6 sticky top-0 z-10 bg-white shadow-md rounded-lg">
                    {orderSummary}
                </div>

                {/* Mobile Delivery & Payment Sections */}
                <div className="space-y-4">
                    {/* Delivery Address Section */}
                    <div>
                        {addressSection}
                    </div>

                    {/* Payment Method Section */}
                    <div>
                        {paymentMethodSection}
                    </div>

                    {/* Delivery Method Section */}
                    <div>
                        {deliveryMethodSection}
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Left Column - Delivery & Payment */}
                    <div>
                        {/* Delivery Address Section */}
                        <div className="mb-6">
                            {addressSection}
                        </div>

                        {/* Payment Method Section */}
                        <div className="mb-6">
                            {paymentMethodSection}
                        </div>

                        {/* Delivery Method Section */}
                        <div>
                            {deliveryMethodSection}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        {orderSummary}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutLayout;