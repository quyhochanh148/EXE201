import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ApiService from '../services/ApiService';

const ProductCategoriesSidebar = ({ isOpen, onClose, buttonRef }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get('/categories', false);
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories?category=${categoryId}`);
    onClose();
  };

  return (
    <div
      className={`
        fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r-2 border-green-500 animate-glowGreen perspective-1000
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-green-200 bg-gradient-to-r from-green-600 to-green-700">
          <h3 className="text-lg font-semibold text-white animate-fadeIn">Danh Mục</h3>
          <button onClick={onClose} className="text-white hover:text-green-300 transition-all duration-200 hover:scale-110">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-56px)] p-2">
          <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-2 md:p-4">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-t-2 border-green-500 rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600 animate-fadeIn">Đang tải...</p>
              </div>
            ) : (
              <ul className="py-2">
                <li
                  onClick={() => {
                    navigate('/categories');
                    onClose();
                  }}
                  className="px-4 py-3 mb-2 bg-green-50 rounded-lg hover:bg-green-100 text-green-700 cursor-pointer transition-all duration-200 font-semibold shadow-sm border border-green-100"
                >
                  Tất cả danh mục
                </li>
                {categories.map((category, index) => (
                  <li
                    key={category._id}
                    onClick={() => handleCategoryClick(category._id)}
                    className="px-4 py-3 mb-2 bg-white rounded-lg hover:bg-green-100 text-gray-800 cursor-pointer transition-all duration-200 shadow-sm border border-green-100"
                  >
                    {category.name}
                  </li>
                ))}
                {!categories.length && (
                  <li className="px-4 py-3 text-gray-500 text-center animate-fadeIn">
                    Không có danh mục
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowGreen {
          0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
        }
        .animate-glowGreen {
          animation: glowGreen 2s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>
    </div>
  );
};

export default ProductCategoriesSidebar;