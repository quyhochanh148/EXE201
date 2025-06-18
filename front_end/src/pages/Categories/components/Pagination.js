import React from 'react';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    showingFrom,
    showingTo,
    totalItems
}) => {
    // Create an array of page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        
        // Always show first page
        pageNumbers.push(1);
        
        // Calculate range around current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pageNumbers.push('...');
        }
        
        // Add page numbers around current page
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }
        
        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm">
                <div className="text-green-700 mb-4 md:mb-0 flex items-center">
                    <Leaf className="w-4 h-4 mr-2 text-green-600" />
                    Hiển thị <span className="font-semibold mx-1">{showingFrom}-{showingTo}</span> 
                    trên <span className="font-semibold mx-1">{totalItems}</span> sản phẩm
                </div>
                
                <div className="flex items-center space-x-2">
                    <button 
                        className={`p-3 rounded-xl transition-all duration-300 ${
                            currentPage === 1 
                                ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                : 'text-green-700 hover:bg-green-50 hover:shadow-md transform hover:scale-105'
                        }`}
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    {getPageNumbers().map((pageNumber, index) => (
                        <button
                            key={index}
                            className={`
                                w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                                ${pageNumber === currentPage 
                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-110' 
                                    : pageNumber === '...' 
                                        ? 'cursor-default text-gray-400' 
                                        : 'text-green-700 hover:bg-green-50 hover:shadow-md transform hover:scale-105'}
                            `}
                            onClick={() => pageNumber !== '...' && onPageChange(pageNumber)}
                            disabled={pageNumber === '...'}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    
                    <button 
                        className={`p-3 rounded-xl transition-all duration-300 ${
                            currentPage === totalPages || totalPages === 0 
                                ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                : 'text-green-700 hover:bg-green-50 hover:shadow-md transform hover:scale-105'
                        }`}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Trang {currentPage}</span>
                    <span>Trang {totalPages}</span>
                </div>
            </div>
        </div>
    );
};

export default Pagination;