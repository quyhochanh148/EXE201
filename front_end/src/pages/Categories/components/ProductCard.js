import React from 'react';
import dongho from '../../../assets/dongho.png';
import { BE_API_URL } from '../../../config/config';

const ProductCard = ({
  product,
  viewMode,
  hoveredProduct,
  setHoveredProduct,
  handleProductClick,
  addToCart,
  formatPrice,
  animationDelay = 0,
}) => {
  const productId = product._id || product.id;
  const hasVariants = product.has_variants || product.variants_count > 0 || false;

  const getImagePath = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/uploads')) return `${BE_API_URL}${imgPath}`;
    if (imgPath.includes('shops')) {
      const fileName = imgPath.split('\\').pop();
      return `${BE_API_URL}/uploads/shops/${fileName}`;
    }
    const fileName = imgPath.split('\\').pop();
    return `${BE_API_URL}/uploads/products/${fileName}`;
  };

  return (
    <div
      key={productId}
      className={`
        border rounded-lg p-4 relative cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:-translate-y-1 hover:scale-102
        ${viewMode === 'grid' ? 'w-full' : 'flex items-center'}
        animate-fadeIn
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      onMouseEnter={() => setHoveredProduct(productId)}
      onMouseLeave={() => setHoveredProduct(null)}
      onClick={() => handleProductClick(product)}
    >
      {product.is_hot && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10 animate-slideDown">
          HOT
        </div>
      )}
      {product.is_feature && !product.is_hot && (
        <div className="absolute top-2 left-2 bg-[#2E7D32] text-white text-xs px-2 py-1 rounded z-10 animate-slideDown">
          Đặc sắc
        </div>
      )}
      {hasVariants && (
        <div className="absolute top-2 right-2 bg-[#2E7D32] text-white text-xs px-2 py-1 rounded z-10 animate-slideDown">
          Nhiều lựa chọn
        </div>
      )}
      <div className={`${viewMode === 'grid' ? 'flex flex-col' : 'flex items-center'} relative`}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={getImagePath(product.thumbnail) || dongho}
            alt={product.name}
            className={`
              object-cover
              ${viewMode === 'grid' ? 'w-full h-48' : 'w-48 h-48 mr-4'}
              transition-all duration-400 ease-in-out
              hover:scale-110 hover:filter-blur-sm hover:shadow-[0_0_10px_rgba(142,68,173,0.5)]
              hover:rotate-2
              animate-scaleIn
            `}
          />
          {hoveredProduct === productId && (
            <div
              className="absolute bottom-0 left-0 right-0 py-2 bg-white bg-opacity-95 flex items-center justify-center transition-opacity duration-300 ease-in-out shadow-md z-10 animate-slideUp"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product);
              }}
            >
              <button
                className="
                  bg-[#2E7D32] text-white py-1.5 px-4 rounded-md font-medium text-sm
                  transition-all duration-300 ease-in-out
                  hover:bg-[#2E7D32]/90 hover:scale-105
                "
              >
                {hasVariants ? 'Chọn biến thể' : 'Xem chi tiết'}
              </button>
            </div>
          )}
        </div>
        <div className="flex-grow mt-2">
          <h3 className="text-sm font-medium truncate">{product.name}</h3>
          <span className="text-xs text-gray-500">Đã bán {product.sold || 0}</span>
          <p className="text-green-700 font-bold mt-1">
            {hasVariants ? `Từ ${formatPrice(product.price)}` : formatPrice(product.price)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {product.condition || ''} {product.location ? `| ${product.location}` : ''}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .filter-blur-sm {
          filter: blur(1px);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;