import React from 'react';
import { ShoppingCart, MessageSquareText, AlertCircle } from 'lucide-react';

const ActionButtons = ({ 
    isAddingToCart, 
    addToCart, 
    buyNow, 
    handleStartChat, 
    hasVariants,
    selectedVariant,
    isOutOfStock
}) => {
    // Kiểm tra các điều kiện để vô hiệu hóa nút
    const isDisabled = isAddingToCart || (hasVariants && !selectedVariant) || isOutOfStock;
    
    // Xác định nội dung nút dựa trên trạng thái
    const getButtonText = () => {
        if (isAddingToCart) return 'Đang xử lý...';
        if (isOutOfStock) return 'Hết hàng';
        if (hasVariants && !selectedVariant) return 'Vui lòng chọn biến thể';
        return 'Mua ngay';
    };

    return (
        <div className="space-y-3">
            {/* Thông báo khi cần chọn biến thể */}
            {hasVariants && !selectedVariant && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-2">
                    <div className="flex items-center">
                        <AlertCircle size={16} className="text-yellow-600 mr-2" />
                        <p className="text-yellow-700 text-sm">Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng</p>
                    </div>
                </div>
            )}
            
            {/* Thông báo khi hết hàng */}
            {isOutOfStock && (
                <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-2">
                    <div className="flex items-center">
                        <AlertCircle size={16} className="text-red-600 mr-2" />
                        <p className="text-red-700 text-sm">Biến thể này đã hết hàng. Vui lòng chọn biến thể khác.</p>
                    </div>
                </div>
            )}
            
            <div className="flex space-x-2">
                <button
                    className={`bg-green-600 hover:bg-green-700 text-white flex-1 py-2 rounded-full flex items-center justify-center font-bold shadow-md transition-colors 
                        ${isDisabled ? 'opacity-50 cursor-not-allowed bg-green-300 hover:bg-green-300' : ''}`}
                    onClick={buyNow}
                    disabled={isDisabled}
                >
                    {getButtonText()}
                </button>
                <button
                    className={`border border-green-600 hover:bg-green-50 px-4 py-2 rounded-full transition-colors text-green-700 font-bold shadow-md 
                        ${isDisabled ? 'opacity-50 cursor-not-allowed border-green-300 hover:bg-green-100' : ''}`}
                    onClick={addToCart}
                    disabled={isDisabled}
                >
                    <ShoppingCart size={18} className="text-green-600" />
                </button>
                <button
                    onClick={handleStartChat}
                    className="border border-green-600 hover:bg-green-50 flex-1 py-2 rounded-full text-green-700 font-bold shadow-md transition-colors"
                >
                    <p className='flex items-center justify-center gap-2 text-green-700'>
                        <MessageSquareText size={18} />Chat
                    </p>
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;