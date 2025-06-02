import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';

const CategorySidebar = ({ categories }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId) => {
        navigate(`/categories?category=${categoryId}`);
    };

    const displayCategories = categories.slice(0, 6);
    const hasMoreCategories = categories.length > 6;

    return (
        <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden sticky top-4 animate-slideInLeft hover:scale-102 transition-all duration-300">
            <div className="p-4 bg-gradient-to-r from-green-600 to-green-700">
                <h3 className="font-bold text-lg text-white">Danh Mục Sản Phẩm</h3>
            </div>
            <div className="flex flex-col bg-green-50">
                {displayCategories.map((category, index) => (
                    <div
                        key={category._id}
                        className={`flex items-center p-3 border-b border-green-100 hover:bg-green-100 transition-all duration-200 cursor-pointer animate-fadeIn animation-delay-${index * 100} hover:shadow-lg hover:shadow-green-200`}
                        onClick={() => handleCategoryClick(category._id)}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <span className="text-green-700 mr-2">🌱</span>
                        <h3 className="font-medium text-gray-800 hover:text-green-800 hover:scale-105 transition-transform duration-200">{category.name}</h3>
                        <ChevronRight size={16} className="ml-auto text-gray-500 hover:rotate-90 transition-transform duration-300" />
                    </div>
                ))}
                {hasMoreCategories && (
                    <div
                        className="p-3 text-center text-green-700 font-medium hover:bg-green-100 transition-all duration-200 cursor-pointer animate-bounce hover:shadow-lg hover:shadow-green-200"
                        onClick={() => navigate('/categories')}
                    >
                        <div className="flex items-center justify-center gap-1">
                            <span>Xem tất cả danh mục</span>
                            <ChevronDown size={16} className="hover:rotate-180 transition-transform duration-300" />
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideInLeft {
                    animation: slideInLeft 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animation-delay-100 { animation-delay: 100ms; }
                .animation-delay-200 { animation-delay: 200ms; }
                .animation-delay-300 { animation-delay: 300ms; }
                .animation-delay-400 { animation-delay: 400ms; }
                .animation-delay-500 { animation-delay: 500ms; }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-5px); }
                    60% { transform: translateY(-3px); }
                }
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default CategorySidebar;