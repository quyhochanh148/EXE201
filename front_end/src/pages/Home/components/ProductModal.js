import React, { useState, useEffect } from 'react';
import { X as XIcon, AlertCircle } from 'lucide-react';
import dongho from '../../../assets/dongho.png';
import ProductVariantSelector from '../../../components/ProductVariantSelector';
import ApiService from '../../../services/ApiService';

const ProductModal = ({
    product,
    selectedVariant,
    quantity,
    onVariantSelect,
    onQuantityChange,
    onAddToCart,
    onClose,
    formatPrice
}) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVariants = async () => {
            if (!product || !product._id) return;
            
            try {
                setLoading(true);
                const response = await ApiService.get(`/product-variant/product/${product._id}`, false);
                
                if (response && response.length > 0) {
                    setVariants(response);
                    setError(null);
                } else {
                    setVariants([]);
                    setError("Sản phẩm này không có biến thể nào");
                }
            } catch (err) {
                console.error("Error fetching product variants:", err);
                setError("Không thể tải thông tin biến thể sản phẩm");
                setVariants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVariants();
    }, [product]);

    const hasVariants = variants.length > 0;
    const variantSelected = selectedVariant !== null;
    const isOutOfStock = selectedVariant && selectedVariant.stock !== undefined && selectedVariant.stock <= 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" style={{zIndex:1500}}>
            <div className="bg-white rounded-lg w-11/12 max-w-4xl overflow-hidden relative animate-slideUp border-2  shadow-lg hover:shadow-green-400/50">
                <button
                    className="absolute top-4 right-4 text-gray-800 hover:scale-110 transition-transform duration-200"
                    onClick={onClose}
                >
                    <XIcon size={24} />
                </button>

                <div className="p-6 mt-10 mb-10">
                    <h2 className="text-xl font-bold mb-6 animate-fadeIn text-green-700">CHỌN BIẾN THỂ SẢN PHẨM</h2>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3 relative">
                            <div className="relative overflow-hidden rounded-lg border-2  animate-glowGreen">
                                <img
                                    src={selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 
                                        ? selectedVariant.images[0] 
                                        : (product.thumbnail || dongho)}
                                    alt={product.name}
                                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-110 hover:rotate-2"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-600/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                {selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 ? (
                                    selectedVariant.images.slice(0, 2).map((imgSrc, idx) => (
                                        <div key={idx} className="border-2  p-1 w-16 h-16 animate-fadeIn hover:shadow-green-400/50" style={{ animationDelay: `${idx * 200}ms` }}>
                                            <img
                                                src={imgSrc}
                                                alt={`Biến thể ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="border-2  p-1 w-16 h-16 animate-fadeIn hover:shadow-green-400/50">
                                            <img
                                                src={product.thumbnail || dongho}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                            />
                                        </div>
                                        <div className="border-2  p-1 w-16 h-16 animate-fadeIn hover:shadow-green-400/50" style={{ animationDelay: '200ms' }}>
                                            <img
                                                src={product.thumbnail || dongho}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-2/3">
                            <h3 className="text-lg font-bold mb-1 animate-fadeIn text-green-700">{product.name}</h3>
                            <p className="text-red-500 font-bold text-lg mb-2 animate-fadeIn">
                                {selectedVariant 
                                    ? formatPrice(selectedVariant.price) 
                                    : formatPrice(product.price)}
                            </p>
                            
                            {hasVariants && !variantSelected && (
                                <div className="bg-green-50 border-l-4  p-3 mb-4 animate-fadeIn">
                                    <div className="flex items-center">
                                        <AlertCircle size={16} className="text-green-600 mr-2" />
                                        <p className="text-green-700">Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng</p>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="inline-block animate-spin h-6 w-6 border-2 border-green-50 border-t-green-700 rounded-full"></div>
                                    <p className="mt-2 text-sm text-gray-500 animate-fadeIn">Đang tải biến thể sản phẩm...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-4">
                                    <p className="text-sm text-red-500 animate-fadeIn">{error}</p>
                                </div>
                            ) : (
                                <ProductVariantSelector
                                    productId={product._id}
                                    onVariantSelect={onVariantSelect}
                                    initialQuantity={quantity}
                                    onQuantityChange={onQuantityChange}
                                />
                            )}
                        </div>
                    </div>

                    <div className='flex gap-4 mt-6'>
                        <button
                            className={`w-full text-white py-3 rounded-md font-medium transition-all duration-200 ${
                                (hasVariants && !variantSelected) || isOutOfStock
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 animate-pulse'
                            }`}
                            onClick={() => onAddToCart(product, quantity, true)}
                            disabled={(hasVariants && !variantSelected) || isOutOfStock}
                        >
                            {isOutOfStock 
                                ? "HẾT HÀNG" 
                                : hasVariants && !variantSelected
                                    ? "VUI LÒNG CHỌN BIẾN THỂ"
                                    : "THÊM VÀO GIỎ HÀNG"}
                        </button>
                        <button
                            onClick={() => {
                                window.location.href = `/product-detail?id=${product._id}`;
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition-all duration-200 hover:scale-105"
                        >
                            Xem thông tin chi tiết
                        </button>
                    </div>
                </div>
                <style>{`
                    @keyframes glowGreen {
                        0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
                        50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
                    }
                    .animate-glowGreen {
                        animation: glowGreen 2s ease-in-out infinite;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.5s ease-out forwards;
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(50px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slideUp {
                        animation: slideUp 0.5s ease-out forwards;
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .animate-pulse {
                        animation: pulse 1.5s infinite;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ProductModal;