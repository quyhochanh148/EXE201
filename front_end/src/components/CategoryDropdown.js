import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ApiService from '../services/ApiService';

const styles = `
.category-dropdown-container {
  position: relative;
  perspective: 1000px;
}

.category-button {
  background: transparent;
  border: 2px solid #22c55e;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 500;
  color: #15803d;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.2);
  transform: rotateY(0deg);
}

.category-button:hover {
  color: #14532d;
  transform: scale(1.05) rotateY(10deg) translateZ(10px);
  box-shadow: 0 8px 16px rgba(34, 197, 94, 0.4);
  background: #e6f4e6;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 2000;
  background: white;
  border: 2px solid #22c55e;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
  min-width: 220px;
  max-height: 320px;
  overflow-y: auto;
  padding: 8px 0;
  animation: glowGreen 2s ease-in-out infinite;
  transform-origin: top;
  transform: rotateX(-90deg);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.category-dropdown.open {
  transform: rotateX(0deg);
  opacity: 1;
}

.category-dropdown a {
  display: block;
  padding: 10px 16px;
  color: #1f2937;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.2s ease;
  perspective: 1000px;
  transform: rotateY(0deg);
}

.category-dropdown a:hover {
  background: #d1fae5;
  color: #15803d;
  transform: rotateY(5deg) translateZ(5px);
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.2);
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #22c55e;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px) rotateX(-90deg); }
  to { opacity: 1; transform: translateY(0) rotateX(0deg); }
}

@keyframes glowGreen {
  0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
  50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}
`;

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get('/categories', false);
        setCategories(response || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategorySelect = (categoryId) => {
    setIsOpen(false);
    navigate(categoryId ? `/categories?category=${categoryId}` : '/categories');
  };

  return (
    <div className="category-dropdown-container">
      <style>{styles}</style>
      <button
        ref={buttonRef}
        className="category-button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        aria-label="Danh mục sản phẩm"
        aria-expanded={isOpen}
      >
        Danh Mục
        {loading ? (
          <span className="spinner"></span>
        ) : (
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
      {isOpen && (
        <div ref={dropdownRef} className={`category-dropdown ${isOpen ? 'open' : ''}`} role="menu">
          <a
            href="/categories"
            className="block"
            role="menuitem"
            onClick={() => handleCategorySelect('')}
          >
            Tất cả danh mục
          </a>
          {categories.map((category) => (
            <a
              key={category._id}
              href={`/categories?category=${category._id}`}
              className="block"
              role="menuitem"
              onClick={() => handleCategorySelect(category._id)}
            >
              {category.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;