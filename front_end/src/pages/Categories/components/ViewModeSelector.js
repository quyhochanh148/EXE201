import React from 'react';
import { Grid, List, ArrowUpDown } from 'lucide-react';

const ViewModeSelector = ({ viewMode, setViewMode, sortOption, setSortOption }) => {
    return (
        <div className="flex items-center space-x-4">
            {/* View Mode Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`
                        p-2 rounded-lg transition-all duration-300 ease-in-out
                        ${viewMode === 'grid' 
                            ? 'bg-white text-green-600 shadow-md transform scale-105' 
                            : 'text-gray-500 hover:text-green-600 hover:bg-white/50'
                        }
                    `}
                >
                    <Grid size={18} />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`
                        p-2 rounded-lg transition-all duration-300 ease-in-out
                        ${viewMode === 'list' 
                            ? 'bg-white text-green-600 shadow-md transform scale-105' 
                            : 'text-gray-500 hover:text-green-600 hover:bg-white/50'
                        }
                    `}
                >
                    <List size={18} />
                </button>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 transition-all duration-300 cursor-pointer"
                >
                    <option value="Đặc sắc">Đặc sắc</option>
                    <option value="Giá thấp">Giá thấp</option>
                    <option value="Giá cao">Giá cao</option>
                    <option value="Mới nhất">Mới nhất</option>
                    <option value="Bán chạy">Bán chạy</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>
        </div>
    );
};

export default ViewModeSelector;