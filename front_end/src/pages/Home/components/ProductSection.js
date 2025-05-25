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
        <div className="bg-white py-8">
            
            <div className="mx-auto max-w-7xl px-8 ">
                <div className="flex items-center justify-center mb-4 bg-white p-4">
                    <ClockIcon size={24} className="text-red-500 mr-2" />
                    <h2 className="text-lg font-bold text-red-500">{title}</h2>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-4 gap-4">
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
                        
                    />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductSection;