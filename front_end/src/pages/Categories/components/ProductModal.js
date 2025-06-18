import React from 'react';
import { X as XIcon } from 'lucide-react';
import dongho from '../../../assets/dongho.png';
import ProductVariantSelector from '../../../components/ProductVariantSelector';

const ProductModal = ({
    selectedProduct,
    selectedVariant,
    quantity,
    formatPrice,
    handleVariantSelect,
    handleQuantityChange,
    addToCart,
    closeModal
}) => {
    // Xác định xem sản phẩm còn hàng hay không
    const isOutOfStock = selectedVariant && selectedVariant.stock !== undefined && selectedVariant.stock <= 0;

    // Xác định hình ảnh hiển thị - ưu tiên hình ảnh biến thể nếu có
    const displayImage = selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 
        ? selectedVariant.images[0] 
        : (selectedProduct.thumbnail || dongho);

    // Xác định giá hiển thị - ưu tiên giá biến thể nếu có
    const displayPrice = selectedVariant 
        ? formatPrice(selectedVariant.price) 
        : formatPrice(selectedProduct.price);

    // Hiển thị thông tin thuộc tính biến thể
    const renderVariantAttributes = () => {
        if (!selectedVariant || !selectedVariant.attributes) return null;
        
        const attributes = selectedVariant.attributes instanceof Map 
            ? Object.fromEntries(selectedVariant.attributes) 
            : selectedVariant.attributes;
            
        if (Object.keys(attributes).length === 0) return null;
        
        return Object.entries(attributes).map(([key, value]) => (
            <span key={key} className="mr-3">
                <span className="capitalize">{key}</span>: <strong>{value}</strong>
            </span>
        ));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-0">
            <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-2xl md:max-w-4xl overflow-y-auto max-h-[95vh] relative p-3 sm:p-6 shadow-lg">
                <button
                    className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-800 hover:bg-gray-100 p-2 md:p-1 rounded-full focus:outline-none"
                    onClick={closeModal}
                    aria-label="Đóng"
                >
                    <XIcon size={28} />
                </button>
                <div className="p-3 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">CHỌN BIẾN THỂ SẢN PHẨM</h2>
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
                        {/* Product Image */}
                        <div className="w-full md:w-1/3">
                            <img
                                src={displayImage}
                                alt={selectedProduct.name}
                                className="w-full h-auto rounded object-cover"
                            />
                        </div>
                        {/* Product Details with Variant Selector */}
                        <div className="w-full md:w-2/3">
                            <h3 className="text-base sm:text-lg font-bold mb-1">{selectedProduct.name}</h3>
                            <p className="text-red-500 font-bold text-lg sm:text-xl mb-3">
                                {displayPrice}
                            </p>
                            {/* Thông tin biến thể đã chọn */}
                            {selectedVariant && (
                                <div className="mb-3 sm:mb-4 p-3 bg-[#2E7D32] rounded-lg border border-purple-100">
                                    {renderVariantAttributes() && (
                                        <div className="mt-2 text-xs sm:text-sm text-gray-600">
                                            {renderVariantAttributes()}
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Product Variant Selector Component */}
                            <ProductVariantSelector
                                productId={selectedProduct._id}
                                onVariantSelect={handleVariantSelect}
                                initialQuantity={quantity}
                                onQuantityChange={handleQuantityChange}
                            />
                        </div>
                    </div>
                    {/* Add to Cart Button */}
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6'>
                        <button
                            className={`w-full ${isOutOfStock 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#2E7D32] hover:bg-[#2E7D32]'} text-white py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base`}
                            onClick={() => addToCart(selectedProduct, quantity, true)}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock 
                                ? "HẾT HÀNG" 
                                : "THÊM VÀO GIỎ HÀNG"}
                        </button>
                        <button
                            onClick={() => window.location.href = `/product-detail?id=${selectedProduct._id || selectedProduct.id}`}
                            className='w-full bg-[#2E7D32] hover:bg-[#2E7D32] text-white py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base'
                        >
                            Xem thông tin chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;