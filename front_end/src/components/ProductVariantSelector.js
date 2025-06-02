import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import ApiService from '../services/ApiService';

const ProductVariantSelector = ({
  productId,
  onVariantSelect,
  initialQuantity = 1,
  onQuantityChange,
  containerClassName = ""
}) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    const fetchVariants = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const response = await ApiService.get(`/product-variant/${productId}`, false);
        if (response?.length > 0) {
          setVariants(response);
          const defaultVariant = variants.find(variant => variant.is_default === true) || variants[0];
          setSelectedVariant(defaultVariant);
          onVariantSelect?.(defaultVariant);
        } else {
          setVariants([]);
          setSelectedVariant(null);
        }
      } catch (err) {
        console.error("Error fetching variants:", err);
        setError("Failed to load product options");
        setSelectedVariant(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVariants();
  }, [productId, onVariantSelect]);

  const handleIncrement = () => {
    if (quantity < getAvailableStock()) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    onVariantSelect(variant);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', 'đ');
  };

  const getAvailableStock = () => selectedVariant?.stock || 0;

  const formatAttributes = (variant) => {
    if (!variant?.attributes) return "";
    const attributes = variant.attributes instanceof Map ?
      Object.fromEntries(variant.attributes) :
      variant.attributes;
    return Object.values(attributes).join(', ');
  };

  if (!loading && variants.length === 0) return null;

  return (
    <div className={containerClassName}>
      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-sm text-gray-600 animate-slideUp">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-600 text-sm text-center animate-slideUp">{error}</p>
      ) : (
        <>
          <div className="mb-6 perspective-1000">
            <label className="block text-sm font-medium text-green-700 mb-2 animate-slideUp">Select Variant:</label>
            <div className="flex flex-wrap gap-3">
              {variants.map((variant, index) => {
                const isAvailable = (variant.stock || 0) > 0;
                const isSelected = selectedVariant?._id === variant._id;
                return (
                  <button
                    key={variant._id}
                    onClick={() => isAvailable && handleVariantSelect(variant)}
                    className={`
                      px-4 py-2 border-2 rounded-md text-sm font-medium perspective-1000
                      ${isSelected ? 'border-green-600 bg-green-100 text-green-700 animate-pulse' : 'border-green-400 text-gray-700'}
                      ${isAvailable ? 'hover:border-green-600 hover:bg-green-100 hover:shadow-green-200/50' : 'opacity-50 cursor-not-allowed'}
                      transition-all duration-200 transform hover:scale-105 hover:rotateY(8deg) hover:translateZ(5px)
                      animate-slide-in animation-delay-${index}
                    `}
                    disabled={!isAvailable}
                  >
                    {formatAttributes(variant.attributes)} (${formatPrice(variant.price)})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4 animate-slideUp animation-delay-200 perspective-1000">
            <label className="text-sm font-medium text-green-700">Quantity:</label>
            <div className="flex items-center border-2 border-green-600 rounded-md bg-gray-50 shadow-md transform hover:scale-105 hover:shadow-green-300/50 transition-all duration-300">
              <button
                onClick={handleDecrement}
                className="px-3 py-2 text-green-600 hover:text-green-400 disabled:opacity-50 transition-all duration-200 hover:scale-110 transform hover:rotateY(-5deg)"
                disabled={quantity <= 1}
              >
                <Minus size={25} />
              </button>
              <input
                type="text"
                value={quantity}
                className="w-12 text-center border-0 py-2 text-sm font-semibold bg-gray-50"
                readOnly
              />
              <button
                onClick={handleIncrement}
                className="px-3 py-2 text-green-600 hover:text-green-400 disabled:opacity-50 transition-all duration-200 hover:scale-110 transform hover:rotateY(5deg)"
                disabled={quantity >= getAvailableStock()}
              >
                <Plus size={25} />
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {getAvailableStock()} available
            </span>
          </div>
        </>
      )}
      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glowGreen {
          from { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
          to { box-shadow: 0 0 10px rgba(34, 197, 94, 0.8); }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .animate-slide-up {
          animation: slideUp 0.4s ease-out;
        }

        .animation-delay-0 { animation-delay: 0ms; }
        .animation-delay-1 { animation-delay: 100ms; }
        .animation-delay-2 { animation-delay: 200ms; }
        .animation-delay-200 { animation-delay: 200ms; }

        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductVariantSelector;