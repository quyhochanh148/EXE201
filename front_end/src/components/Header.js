import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import CartModal from '../pages/cart/CartModal';
import logo from '../assets/LogoNew1.jpg';
import AuthService from '../services/AuthService';
import ApiService from '../services/ApiService';
import { MessageEventBus } from '../pages/UserProfile/components/Message';
import { CartEventBus } from '../pages/cart/CartEventBus';
import CategoryDropdown from './CategoryDropdown';
import ProductCategoriesSidebar from './ProductCategoriesSidebar';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesSidebarOpen, setIsCategoriesSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(AuthService.isLoggedIn());
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const categoriesButtonRef = useRef(null);
  const userDropdownRef = useRef(null);
  const userButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = MessageEventBus.subscribe('unreadCountChanged', (count) => {
      setUnreadMessageCount(count);
    });
    return () => unsubscribe();
  }, []);

  const userId = currentUser?.id || currentUser?._id || "";

  useEffect(() => {
    if (isLoggedIn) fetchCartTotal();
    else setCartTotal(0);
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (isLoggedIn && isCartOpen) fetchCartTotal();
  }, [isCartOpen]);

  useEffect(() => {
    const unsubscribe = CartEventBus.subscribe('cartUpdated', fetchCartTotal);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(AuthService.isLoggedIn());
      setCurrentUser(AuthService.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[data-mobile-menu-trigger]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  const isSeller = () => {
    return isLoggedIn && currentUser?.roles?.some(role =>
      (typeof role === 'object' && (role.name === 'SELLER' || role.name === 'ROLE_SELLER')) ||
      (typeof role === 'string' && (role === 'SELLER' || role === 'ROLE_SELLER'))
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', 'đ');
  };

  const fetchCartTotal = async () => {
    if (!userId) {
      setCartTotal(0);
      return;
    }
    try {
      const response = await ApiService.get(`/cart/user/${userId}`);
      if (response?.items?.length > 0) {
        const items = await ensureCompleteVariantInfo(response.items);
        const total = items.reduce((sum, item) => {
          const price = item.variant_id?.price ||
            (item.product_id?.discounted_price || item.product_id?.price || 0);
          return sum + price * item.quantity;
        }, 0);
        setCartTotal(total);
      } else {
        setCartTotal(0);
      }
    } catch (error) {
      console.error('Error fetching cart total:', error);
      setCartTotal(0);
    }
  };

  const ensureCompleteVariantInfo = async (items) => {
    const updatedItems = [...items];
    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      if (item.variant_id && (typeof item.variant_id === 'string' || !item.variant_id.attributes)) {
        const productId = typeof item.product_id === 'object' ? item.product_id._id : item.product_id;
        const variantId = typeof item.variant_id === 'string' ? item.variant_id : item.variant_id._id;
        if (productId && variantId) {
          try {
            const variants = await ApiService.get(`/product-variant/product/${productId}`, false);
            const fullVariant = variants.find(v => v._id === variantId);
            if (fullVariant) updatedItems[i] = { ...item, variant_id: fullVariant };
          } catch (error) {
            console.error(`Failed to fetch variant for product ${productId}:`, error);
          }
        }
      }
    }
    return updatedItems;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavLink = ({ href, children, className = "" }) => {
    const isActive = location.pathname === href || location.pathname === href + '/';
    return (
      <a
        href={href}
        className={`transition-all duration-200 rounded-md px-3 py-2 text-sm md:text-base ${isActive
          ? 'font-bold text-green-800 bg-green-100 border-b-2 border-green-800 shadow-md'
          : 'font-medium text-green-600 hover:text-green-800 hover:scale-105 hover:shadow-green-400/50'
        } ${className}`}
      >
        {children}
      </a>
    );
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 animate-fadeIn">
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              ref={categoriesButtonRef}
              onClick={() => setIsCategoriesSidebarOpen(true)}
              className="md:hidden text-green-600 hover:text-green-800 transition-all duration-200 hover:scale-110"
              aria-label="Mở danh mục"
            >
              <Menu size={20} />
            </button>
            <a href="/" className="flex-shrink-0">
              <img 
                src={logo} 
                alt="GreenGarden" 
                className="h-8 md:h-10 w-auto transition-transform duration-300 hover:scale-110" 
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavLink href="/introduction">Giới Thiệu</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <CategoryDropdown />
            <NavLink href="/categories">Sản Phẩm</NavLink>
            {!isSeller() && (
              <NavLink href="/shop-registration" className="text-red-600 hover:text-red-800">
                Đăng Ký Bán Hàng
              </NavLink>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="px-4 py-2 rounded-full w-64 lg:w-72 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 border border-green-500 text-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 transition-all duration-200"
                aria-label="Tìm kiếm"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden text-green-600 hover:text-green-800 transition-all duration-200"
              aria-label="Tìm kiếm"
            >
              <Search size={20} />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                ref={userButtonRef}
                onClick={() => isLoggedIn ? setIsUserDropdownOpen(!isUserDropdownOpen) : navigate('/login')}
                className="text-green-600 hover:text-green-800 transition-all duration-200 hover:animate-pulse"
                aria-label={isLoggedIn ? "Menu tài khoản" : "Đăng nhập"}
              >
                <User size={20} className="md:w-6 md:h-6" />
                {unreadMessageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                    {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                  </span>
                )}
              </button>
              {isLoggedIn && isUserDropdownOpen && (
                <div
                  ref={userDropdownRef}
                  className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border-2 w-48 md:w-56 py-2 z-50 animate-slideDown"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-green-200 bg-green-50">
                    {currentUser?.email}
                  </div>
                  <a href="/user-profile" className="block px-4 py-2 text-sm hover:bg-green-100 transition-all duration-200">
                    Tài khoản
                  </a>
                  <a href="/user-profile/orders" className="block px-4 py-2 text-sm hover:bg-green-100 transition-all duration-200">
                    Đơn mua
                  </a>
                  <a href="/user-profile/messages" className="block px-4 py-2 text-sm hover:bg-green-100 transition-all duration-200">
                    Tin nhắn {unreadMessageCount > 0 && `(${unreadMessageCount})`}
                  </a>
                  <a href="/user-profile/addresses" className="block px-4 py-2 text-sm hover:bg-green-100 transition-all duration-200">
                    Địa Chỉ
                  </a>
                  <a href="/user-profile/password" className="block px-4 py-2 text-sm hover:bg-green-100 transition-all duration-200">
                    Đổi mật khẩu
                  </a>
                  {isSeller() && (
                    <a href="/seller-dashboard" className="block px-4 py-2 text-sm hover:bg-green-100 transition-all duration-200">
                      Quản lý cửa hàng
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-green-100 transition-all duration-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-green-600 hover:text-green-800 transition-all duration-200 hover:animate-pulse"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                {cartTotal > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                    {cartTotal ? '1+' : '0'}
                  </span>
                )}
              </button>
              <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                style={{ zIndex: 1500 }}
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              data-mobile-menu-trigger
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-green-600 hover:text-green-800 transition-all duration-200"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden mt-3 animate-slideDown">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300 border border-green-500 text-sm"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 transition-all duration-200"
                aria-label="Tìm kiếm"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden mt-3 pb-3 border-t border-gray-200 animate-slideDown"
          >
            <nav className="flex flex-col space-y-2 pt-3">
              <NavLink href="/introduction">Giới Thiệu</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/categories">Sản Phẩm</NavLink>
              {!isSeller() && (
                <NavLink href="/shop-registration" className="text-red-600 hover:text-red-800">
                  Đăng Ký Bán Hàng
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </div>

      <ProductCategoriesSidebar
        isOpen={isCategoriesSidebarOpen}
        onClose={() => setIsCategoriesSidebarOpen(false)}
        buttonRef={categoriesButtonRef}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;