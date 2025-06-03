import React from 'react';
import { Filter } from 'lucide-react';

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
        <div className="w-full border-r pr-4">
            <h2 className="text-xl font-bold mb-4 font-extrabold">DANH MỤC LIÊN QUAN</h2>
            <ul className="space-y-2">
                {categories.map((category) => (
                    <li
                        key={category._id}
                        className={`
                            text-base cursor-pointer py-2 px-4
                            transition-all duration-300 ease-in-out
                            transform hover:scale-105 hover:translate-x-2
                            ${selectedCategory === category._id
                                ? 'text-green-700 font-bold bg-purple-100 border-l-4 border-green-700'
                                : 'text-gray-700 hover:text-green-700'}
                        `}
                        onClick={() => handleCategorySelect(category._id)}
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
            <div className='w-full h-[1px] bg-gray-300 mt-8'></div>
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">BỘ LỌC</h3>
                <div
                    className="flex items-center text-gray-500 cursor-pointer hover:text-green-700
                    transition-colors duration-300 ease-in-out"
                    onClick={clearFilters}
                >
                    <Filter size={16} className="mr-2" />
                    <span>Xóa bộ lọc</span>
                </div>
            </div>
            <div className='w-full h-[1px] bg-gray-300 mt-8'></div>
            <div className="mt-4">
                <h3 className="text-lg font-bold mb-4">GIÁ</h3>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full border rounded px-2 py-1
                        transition-all duration-300 ease-in-out
                        focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        value={priceRange.min}
                        onChange={(e) => handlePriceInputChange('min', e.target.value)}
                        min="0"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full border rounded px-2 py-1
                        transition-all duration-300 ease-in-out
                        focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        value={priceRange.max}
                        onChange={(e) => handlePriceInputChange('max', e.target.value)}
                        min="0"
                    />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    Giá không được âm
                </div>
                <button
                    className="w-full mt-2 bg-[#2E7D32] text-white py-2 rounded
                    hover:bg-[#2E7D32]/90 transition-colors duration-300 ease-in-out
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={applyPriceFilter}
                    disabled={
                        (priceRange.min && parseFloat(priceRange.min) < 0) ||
                        (priceRange.max && parseFloat(priceRange.max) < 0) ||
                        (priceRange.min && priceRange.max && parseFloat(priceRange.min) > parseFloat(priceRange.max))
                    }
                >
                    Áp dụng
                </button>
                {priceRange.min && priceRange.max && parseFloat(priceRange.min) > parseFloat(priceRange.max) && (
                    <div className="mt-2 text-xs text-red-500">
                        Giá tối thiểu không thể lớn hơn giá tối đa
                    </div>
                )}
            </div>
            <div className='w-full h-[1px] bg-gray-300 mt-8'></div>
        </div>
    );
};

export default CategorySidebar;