import React from 'react';
import { ClockIcon } from 'lucide-react';
import dongho from '../../../assets/dongho.png';

const ProductCard = ({ 
    product, 
    index, 
    isHoveredProduct, 
    onHover, 
    onClick, 
    onAddToCart,
    formatPrice,
    animationDelay
}) => {
    const formatTime = (dateString) => {
        if (!dateString) return "Vừa đăng";
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} ngày trước`;
        }
    };

    return (
        <div
            className={`border-2 rounded-lg bg-white overflow-hidden relative cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 animate-glowGreen hover:scale-105 hover:shadow-green-400/50`}
            style={{ animationDelay: `${animationDelay}ms` }}
            onMouseEnter={() => onHover(index)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(product)}
        >
            <div className="relative overflow-hidden">
                <img
                    src={product.thumbnail || dongho}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-500 ease-out hover:scale-110 hover:rotate-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {isHoveredProduct && (
                <div
                    className="absolute bottom-0 left-0 right-0 py-2 md:py-3 bg-white bg-opacity-95 flex items-center justify-center transition-transform duration-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                >
                    <button className="bg-green-600 hover:bg-green-700 text-white py-1 md:py-2 px-3 md:px-6 rounded-md font-medium text-xs md:text-sm transition-transform duration-200 hover:scale-105">
                        Thêm vào giỏ
                    </button>
                </div>
            )}
            <div className="p-2 md:p-4">
                <h3 className="text-sm md:text-base font-medium truncate">{product.name}</h3>
                <div className="text-xs text-gray-500 mt-1">{product.condition || "Mới 100%"}</div>
                <div className="text-red-600 font-bold mt-2 text-base md:text-lg">{formatPrice(product.price)}</div>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                    <ClockIcon size={10} className="mr-1 md:w-3 md:h-3" />
                    <span className="text-xs">{formatTime(product.created_at)}</span>
                    <span className="mx-1">•</span>
                    <span className="text-xs truncate">{product.shop_id?.name || "Hà Nội"}</span>
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
            `}</style>
        </div>
    );
};

export default ProductCard;