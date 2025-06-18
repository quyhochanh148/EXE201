import React from 'react';
import { Filter, Leaf, Sparkles, DollarSign } from 'lucide-react';

const CategorySidebar = ({ 
    categories, 
    selectedCategory, 
    handleCategorySelect,
    priceRange,
    handlePriceChange, 
    applyPriceFilter,
    clearFilters
}) => {
    // Xử lý nhập giá, đảm bảo giá không âm
    const handlePriceInputChange = (type, value) => {
        // Kiểm tra nếu giá trị nhập vào là số dương hoặc chuỗi rỗng
        if (value === '' || parseFloat(value) >= 0) {
            handlePriceChange(type, value);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            {/* Categories Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-6 text-green-800 flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    DANH MỤC CÂY CẢNH
                </h2>
                <ul className="space-y-3">
                    {categories.map((category) => (
                        <li
                            key={category._id}
                            className={`
                                cursor-pointer py-3 px-4 rounded-xl
                                transition-all duration-300 ease-in-out
                                transform hover:scale-105 hover:translate-x-2
                                ${selectedCategory === category._id
                                    ? 'text-white font-semibold bg-gradient-to-r from-green-600 to-green-700 shadow-lg border-l-4 border-green-300'
                                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50 border-l-4 border-transparent hover:border-green-200'}
                            `}
                            onClick={() => handleCategorySelect(category._id)}
                        >
                            <span className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-3 ${
                                    selectedCategory === category._id ? 'bg-white' : 'bg-green-400'
                                }`}></span>
                                {category.name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8"></div>

            {/* Clear Filters Section */}
            <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-green-800 flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-green-600" />
                    BỘ LỌC
                </h3>
                <button
                    className="w-full flex items-center justify-center py-3 px-4 rounded-xl
                    bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 
                    hover:from-green-100 hover:to-green-200 hover:text-green-700
                    transition-all duration-300 ease-in-out transform hover:scale-105
                    border border-gray-200 hover:border-green-300"
                    onClick={clearFilters}
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Xóa bộ lọc</span>
                </button>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8"></div>

            {/* Price Filter Section */}
            <div>
                <h3 className="text-lg font-bold mb-4 text-green-800 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    KHOẢNG GIÁ
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Từ</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2
                                transition-all duration-300 ease-in-out
                                focus:ring-2 focus:ring-green-500 focus:border-transparent
                                focus:shadow-lg hover:border-green-300"
                                value={priceRange.min}
                                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                min="0"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Đến</label>
                            <input
                                type="number"
                                placeholder="∞"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2
                                transition-all duration-300 ease-in-out
                                focus:ring-2 focus:ring-green-500 focus:border-transparent
                                focus:shadow-lg hover:border-green-300"
                                value={priceRange.max}
                                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                            Giá không được âm
                        </span>
                    </div>
                    
                    <button
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl
                        hover:from-green-700 hover:to-green-800 transition-all duration-300 ease-in-out
                        disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105
                        shadow-lg hover:shadow-xl"
                        onClick={applyPriceFilter}
                        disabled={
                            (priceRange.min && parseFloat(priceRange.min) < 0) ||
                            (priceRange.max && parseFloat(priceRange.max) < 0) ||
                            (priceRange.min && priceRange.max && parseFloat(priceRange.min) > parseFloat(priceRange.max))
                        }
                    >
                        <span className="flex items-center justify-center">
                            <Filter className="w-4 h-4 mr-2" />
                            Áp dụng bộ lọc
                        </span>
                    </button>
                    
                    {priceRange.min && priceRange.max && parseFloat(priceRange.min) > parseFloat(priceRange.max) && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center text-red-600 text-xs">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                                Giá tối thiểu không thể lớn hơn giá tối đa
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-8 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    );
};

export default CategorySidebar;