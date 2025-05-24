import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

// CSS for dropdown
const styles = `
.category-dropdown-container {
  position: relative;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.category-dropdown-container:hover .category-dropdown {
  opacity: 1;
  visibility: visible;
}

.category-dropdown a {
  display: block;
  padding: 8px 16px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
}

.category-dropdown a:hover {
  background: #f3f4f6;
}

.category-button {
  background: transparent;   /* Không màu nền */
  border: none;              /* Không viền */
  padding: 8px 16px;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 0;          /* Không bo góc */
  cursor: pointer;
}

.category-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #6b7280;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

const CategoryDropdown = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    // Lấy danh mục từ API
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

    // Xử lý click ngoài để đóng dropdown
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
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Xử lý chọn danh mục
    const handleCategorySelect = (categoryId) => {
        setIsOpen(false);
        if (categoryId) {
            navigate(`/categories?category=${categoryId}`);
        } else {
            navigate('/categories');
        }
    };

    return (
        <div className="category-dropdown-container">
            <style>{styles}</style>
            <button
                ref={buttonRef}
                className="category-button"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                disabled={loading}
                aria-label="Danh mục sản phẩm"
                aria-expanded={isOpen}
              
            >
                Tất cả danh mục
                {loading ? (
                    <span className="spinner"></span>
                ) : (
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                )}
            </button>
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="category-dropdown"
                    role="menu"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
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