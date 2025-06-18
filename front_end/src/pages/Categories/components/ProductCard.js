import React from 'react';
import dongho from '../../../assets/dongho.png';
import { BE_API_URL } from '../../../config/config';
import { Leaf, Heart, Eye, ShoppingCart } from 'lucide-react';

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
        bg-white border border-green-100 rounded-2xl p-4 relative cursor-pointer 
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-2 hover:scale-105
        hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-white
        ${viewMode === 'grid' ? 'w-full' : 'flex items-center'}
        animate-fadeInUp
        group
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
      onMouseEnter={() => setHoveredProduct(productId)}
      onMouseLeave={() => setHoveredProduct(null)}
      onClick={() => handleProductClick(product)}
    >
      {/* Badge cho sản phẩm đặc biệt */}
      {product.is_hot && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full z-10 animate-bounce shadow-lg">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
            HOT
          </span>
        </div>
      )}
      {product.is_feature && !product.is_hot && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-3 py-1.5 rounded-full z-10 animate-pulse shadow-lg">
          <span className="flex items-center">
            <Leaf size={12} className="mr-1" />
            Đặc sắc
          </span>
        </div>
      )}
      {hasVariants && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full z-10 animate-pulse shadow-lg">
          <span className="flex items-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1"></span>
            Nhiều lựa chọn
          </span>
        </div>
      )}

      <div className={`${viewMode === 'grid' ? 'flex flex-col' : 'flex items-center'} relative`}>
        {/* Container ảnh với hiệu ứng */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-white p-2">
          <img
            src={getImagePath(product.thumbnail) || dongho}
            alt={product.name}
            className={`
              object-cover rounded-lg
              ${viewMode === 'grid' ? 'w-full h-56' : 'w-56 h-56 mr-6'}
              transition-all duration-700 ease-out
              group-hover:scale-110 group-hover:rotate-1
              group-hover:shadow-xl
              animate-scaleIn
            `}
          />
          
          {/* Overlay với các action buttons */}
          {hoveredProduct === productId && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-all duration-300 ease-out rounded-lg">
              <div className="flex space-x-2 animate-fadeIn">
                <button
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist functionality
                  }}
                >
                  <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors" />
                </button>
                <button
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  <Eye size={18} className="text-gray-600 hover:text-green-600 transition-colors" />
                </button>
                <button
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                >
                  <ShoppingCart size={18} className="text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-grow mt-4">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors duration-300">
            {product.name}
          </h3>
          
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Đã bán {product.sold || 0}
            </span>
          </div>
          
          <div className="mt-2">
            <p className="text-lg font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">
              {hasVariants ? `Từ ${formatPrice(product.price)}` : formatPrice(product.price)}
            </p>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            <span className="inline-block bg-gray-100 px-2 py-1 rounded-full mr-1">
              {product.condition || 'Mới'}
            </span>
            {product.location && (
              <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {product.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hiệu ứng glow khi hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;