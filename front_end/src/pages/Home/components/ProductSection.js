import React from 'react';
import { ClockIcon } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductSection = ({ 
    title, 
    products, 
    hoveredProduct, 
    setHoveredProduct,
    handleProductClick,
    addToCart,
    formatPrice
}) => {
    return (
        <div className="bg-white py-4 sm:py-6 md:py-8 lg:py-10 animate-fadeIn">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
                <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6 bg-white p-2 sm:p-3 md:p-4 animate-slideDown">
                    <ClockIcon size={16} className="text-green-600 mr-2 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-green-600">{title}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            index={`${title.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                            isHoveredProduct={hoveredProduct === `${title.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                            onHover={setHoveredProduct}
                            onClick={handleProductClick}
                            onAddToCart={addToCart}
                            formatPrice={formatPrice}
                            animationDelay={index * 100}
                        />
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProductSection;