import React from 'react';
import { X as XIcon, Filter, Sparkles } from 'lucide-react';

const FilterDisplay = ({
    selectedCategory,
    categories,
    priceRange,
    selectedLocations,
    setPriceRange,
    setSelectedLocations,
    setSelectedCategory,
    clearFilters,
    formatPrice
}) => {
    // If no filters are active, don't display anything
    if (!(selectedCategory || priceRange.min || priceRange.max > 0 || selectedLocations.length > 0)) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100 mb-6">
            <div className="flex items-center mb-3">
                <Filter className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-green-800">Bộ lọc đang áp dụng:</span>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
                {selectedCategory && (
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 rounded-full text-sm flex items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                        {categories.find(c => c._id === selectedCategory)?.name}
                        <XIcon
                            size={14}
                            className="ml-2 cursor-pointer hover:text-green-200 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(null);
                            }}
                        />
                    </div>
                )}

                {(priceRange.min || priceRange.max) && (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-full text-sm flex items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                        Giá: {priceRange.min ? formatPrice(priceRange.min) : '0đ'} - {priceRange.max ? formatPrice(priceRange.max) : '∞'}
                        <XIcon
                            size={14}
                            className="ml-2 cursor-pointer hover:text-blue-200 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPriceRange({ min: '', max: '' });
                            }}
                        />
                    </div>
                )}

                {selectedLocations.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-full text-sm flex items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                        Địa điểm: {selectedLocations.length > 2
                            ? `${selectedLocations.slice(0, 2).join(', ')} +${selectedLocations.length - 2}`
                            : selectedLocations.join(', ')}
                        <XIcon
                            size={14}
                            className="ml-2 cursor-pointer hover:text-purple-200 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLocations([]);
                            }}
                        />
                    </div>
                )}

                <button
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm flex items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ml-auto"
                    onClick={clearFilters}
                >
                    <Sparkles className="w-3 h-3 mr-2" />
                    Xóa tất cả
                </button>
            </div>
        </div>
    );
};

export default FilterDisplay;