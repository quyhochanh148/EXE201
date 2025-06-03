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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-lg w-11/12 max-w-4xl overflow-y-auto max-h-[90vh] relative animate-scaleIn">
                <button
                    className="
                        absolute top-4 right-4 text-gray-800 p-2 rounded-full
                        transition-all duration-300 ease-in-out
                        hover:bg-gray-100 hover:rotate-90 hover:scale-125
                    "
                    onClick={closeModal}
                >
                    <XIcon size={32} /> {/* Tăng kích thước icon từ 24 lên 32 */}
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 animate-slideDown">CHỌN BIẾN THỂ SẢN PHẨM</h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Product Image */}
                        <div className="w-full md:w-1/3">
                            <div className="relative overflow-hidden rounded-lg">
                                <img
                                    src={displayImage}
                                    alt={selectedProduct.name}
                                    className="
                                        w-full h-auto rounded object-cover
                                        transition-all duration-400 ease-in-out
                                        hover:scale-110 hover:shadow-[0_0_10px_rgba(142,68,173,0.5)]
                                    "
                                />
                            </div>
                        </div>

                        {/* Product Details with Variant Selector */}
                        <div className="w-full md:w-2/3">
                            <h3 className="text-lg font-bold mb-1 animate-slideDown">{selectedProduct.name}</h3>
                            <p className="text-red-500 font-bold text-xl mb-3 animate-slideDown">
                                {displayPrice}
                            </p>
                            
                            {/* Thông tin biến thể đã chọn */}
                            {selectedVariant && (
                                <div
                                    className="
                                        mb-4 p-3 bg-[#2E7D32] rounded-lg border border-purple-100
                                        animate-slideUp
                                    "
                                >
                                    {renderVariantAttributes() && (
                                        <div className="mt-2 text-sm text-gray-600">
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
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                            className={`
                                w-full py-3 rounded-md font-medium
                                transition-all duration-300 ease-in-out
                                ${isOutOfStock 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#2E7D32] hover:bg-[#2E7D32]/90 hover:scale-105'}
                                text-white
                            `}
                            onClick={() => addToCart(selectedProduct, quantity, true)}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock 
                                ? "HẾT HÀNG" 
                                : "THÊM VÀO GIỎ HÀNG"}
                        </button>
                        <button
                            onClick={() => window.location.href = `/product-detail?id=${selectedProduct._id || selectedProduct.id}`}
                            className="
                                w-full bg-[#2E7D32] text-white py-3 rounded-md font-medium
                                transition-all duration-300 ease-in-out
                                hover:bg-[#2E7D32]/90 hover:scale-105
                            "
                        >
                            Xem thông tin chi tiết
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.4s ease-out forwards;
                }
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProductModal;