import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../../services/ApiService';
import CartModal from '../cart/CartModal';
import { useAuth } from '../Login/context/AuthContext';
import { CartEventBus } from '../cart/CartEventBus';
import CategorySidebar from './components/CategorySidebar';
import PromotionalBanners from './components/PromotionalBanners';
import ProductModal from './components/ProductModal';
import ProductSection from './components/ProductSection';
import ImageSlider from './components/ImageSlider';
import ProductCard from './components/ProductCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import products1 from './components/ImageSliderDetail';
import { BE_API_URL } from '../../config/config';

const TroocEcommerce = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addCartMessage, setAddCartMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [randomBlog, setRandomBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const newProductsRef = useRef(null);
  const recommendedProductsRef = useRef(null);
  const blogRef = useRef(null);

  const { currentUser, isLoggedIn } = useAuth();
  const userId = currentUser?.id || currentUser?._id || "";

  // Thông báo đăng nhập
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Bạn';
      setAddCartMessage(`Chào mừng ${fullName} đã đăng nhập thành công!`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 8000);
    }
  }, [isLoggedIn, currentUser]);

  // Animation Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (newProductsRef.current) observer.observe(newProductsRef.current);
    if (recommendedProductsRef.current) observer.observe(recommendedProductsRef.current);
    if (blogRef.current) observer.observe(blogRef.current);

    return () => {
      if (newProductsRef.current) observer.unobserve(newProductsRef.current);
      if (recommendedProductsRef.current) observer.unobserve(recommendedProductsRef.current);
      if (blogRef.current) observer.unobserve(blogRef.current);
    };
  }, [loading]);

  // Lấy đường dẫn ảnh
  const getImagePath = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/Uploads')) return `${BE_API_URL}${imgPath}`;
    const fileName = imgPath.split("\\").pop();
    return `${BE_API_URL}/Uploads/blogs/${fileName}`; // Sửa để dùng thư mục blogs
  };

  // Fetch dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch sản phẩm
        const productsData = await ApiService.get('/product', true);
        const activeProducts = productsData.filter(product =>
          product.is_active === true || product.is_active === 'true' || product.is_active === 1
        );
        const productsWithImages = activeProducts.map(product => ({
          ...product,
          thumbnail: getImagePath(product.thumbnail),
        }));
        let productsInStock = [];
        const productStockChecks = await Promise.all(
          productsWithImages.map(async (product) => {
            try {
              const variants = await ApiService.get(`/product-variant/product/${product._id}`, false);
              const activeVariants = variants.filter(variant =>
                variant.is_active === true || variant.is_active === 'true' || variant.is_active === 1
              );
              const hasStock = activeVariants.length === 0 ||
                activeVariants.some(variant =>
                  variant.stock === undefined || variant.stock > 0
                );
              return { product, hasStock };
            } catch (error) {
              console.error(`Error checking variants for product ${product._id}:`, error);
              return { product, hasStock: true };
            }
          })
        );
        productsInStock = productStockChecks
          .filter(item => item.hasStock)
          .map(item => item.product);
        setProducts(productsInStock);

        // Fetch danh mục
        const categoriesData = await ApiService.get('/categories', false);
        setCategories(categoriesData);

        // Sản phẩm mới
        const sortedByDate = [...productsInStock].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setNewProducts(sortedByDate.slice(0, 8));

        // Sản phẩm gợi ý
        const featuredProducts = productsInStock.filter(product => product.is_feature);
        const hotProducts = productsInStock.filter(product => product.is_hot);
        const sortedBySold = [...productsInStock].sort((a, b) => b.sold - a.sold);
        const combined = [...featuredProducts, ...hotProducts, ...sortedBySold];
        const uniqueIds = new Set();
        const uniqueProducts = [];
        for (const product of combined) {
          if (!uniqueIds.has(product._id)) {
            uniqueIds.add(product._id);
            uniqueProducts.push(product);
            if (uniqueProducts.length >= 8) break;
          }
        }
        setRecommendedProducts(uniqueProducts);

        // Fetch blog ngẫu nhiên
        console.log('Fetching blogs from /api/blog...');
        const blogsData = await ApiService.get('/blog', false);
        console.log('Blogs data:', blogsData);
        if (blogsData.length > 0) {
          const randomIndex = Math.floor(Math.random() * blogsData.length);
          const selectedBlog = {
            ...blogsData[randomIndex],
            image: getImagePath(blogsData[randomIndex].image)
          };
          console.log('Selected blog:', selectedBlog);
          setRandomBlog(selectedBlog);
        } else {
          console.log('No blogs found');
          setRandomBlog(null);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debug randomBlog state
  useEffect(() => {
    console.log('randomBlog state:', randomBlog);
  }, [randomBlog]);

  // Format giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price)
      .replace('₫', 'đ');
  };

  // Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Thêm vào giỏ hàng
  const addToCart = async (product, quantity = 1, fromModal = false) => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    try {
      if (fromModal) {
        const variants = await ApiService.get(`/product-variant/product/${product._id}`, false);
        const activeVariants = variants.filter(variant =>
          variant.is_active === true || variant.is_active === 'true' || variant.is_active === 1
        );
        const hasVariants = activeVariants && activeVariants.length > 0;
        if (hasVariants && !selectedVariant) {
          setAddCartMessage("Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng");
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 3000);
          return;
        }
      }
      let cartId;
      try {
        const cartResponse = await ApiService.get(`/cart/user/${userId}`, false);
        cartId = cartResponse._id;
      } catch (error) {
        const newCart = await ApiService.post('/cart/create', { user_id: userId });
        cartId = newCart._id;
      }
      const payload = {
        cart_id: cartId,
        product_id: product._id,
        quantity: fromModal ? productQuantity : quantity
      };
      if (fromModal && selectedVariant) {
        payload.variant_id = selectedVariant._id;
      }
      await ApiService.post('/cart/add-item', payload);
      CartEventBus.publish('cartUpdated');
      if (showCartModal) {
        setShowCartModal(false);
      }
      setAddCartMessage(`${product.name} đã được thêm vào giỏ hàng!`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setCartRefreshTrigger(prev => prev + 1);
      if (fromModal) {
        setShowProductModal(false);
        setProductQuantity(1);
        setSelectedVariant(null);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setAddCartMessage("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant) setProductQuantity(1);
  };

  const handleQuantityChange = (newQuantity) => {
    setProductQuantity(newQuantity);
  };

  const handleProductClick = async (product) => {
    try {
      const updatedProduct = await ApiService.get(`/product/${product._id}`, false);
      if (updatedProduct.is_active === true || updatedProduct.is_active === 'true' || updatedProduct.is_active === 1) {
        const variants = await ApiService.get(`/product-variant/product/${updatedProduct._id}`, false);
        const activeVariants = variants.filter(variant =>
          variant.is_active === true || variant.is_active === 'true' || variant.is_active === 1
        );
        const hasStock = activeVariants.length === 0 ||
          activeVariants.some(variant => variant.stock === undefined || variant.stock > 0);
        if (hasStock) {
          setSelectedProduct(updatedProduct);
          setShowProductModal(true);
          setProductQuantity(1);
          setSelectedVariant(null);
        } else {
          setAddCartMessage("Sản phẩm này hiện đã hết hàng.");
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 3000);
        }
      } else {
        setAddCartMessage("Sản phẩm này hiện không có sẵn.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setSelectedProduct(product);
      setShowProductModal(true);
      setProductQuantity(1);
      setSelectedVariant(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-green-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md animate-fadeIn">
          <h2 className="text-xl font-semibold mb-2 text-green-700">Đang tải dữ liệu...</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-green-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md animate-fadeIn">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Đã xảy ra lỗi</h2>
          <p className="text-gray-600">{error}</p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all duration-200 hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen">
      <Header />
      {/* Bọc phần nội dung trong div padding, Header nằm ngoài */}
      <main className="pt-16 pb-8">
        {showMessage && (
          <div className="fixed top-16 right-2 sm:right-4 bg-green-100 p-3 sm:p-4 rounded-lg shadow-lg z-50 border-l-4 border-green-500 animate-slideInRight max-w-xs sm:max-w-sm md:max-w-md">
            <p className="text-green-700 text-xs sm:text-sm md:text-base">{addCartMessage}</p>
          </div>
        )}
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          refreshTrigger={cartRefreshTrigger}
          style={{ zIndex: 1500 }}
        />
        {/* Bọc toàn bộ nội dung trong một div có padding ngang responsive */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16">
          {/* Hàng trên cùng: Sidebar bên trái, Banner bên phải - responsive */}
          <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
            {/* Sidebar - ẩn trên mobile và tablet */}
            <div className="w-full lg:w-64 lg:min-w-[220px] lg:block hidden">
              <CategorySidebar categories={categories} />
            </div>
            {/* Banner - chiếm toàn bộ trên mobile và tablet */}
            <div className="flex-1 w-full lg:ml-4">
              <ImageSlider products={products1} />
            </div>
          </div>
          {/* Dưới: Nội dung chính */}
          <div className="w-full mt-4 sm:mt-6 flex flex-col gap-4 sm:gap-6">
            {/* Sản phẩm mới */}
            <div ref={newProductsRef}>
              <ProductSection
                title="Sản Phẩm Mới"
                products={newProducts}
                hoveredProduct={hoveredProduct}
                setHoveredProduct={setHoveredProduct}
                handleProductClick={handleProductClick}
                addToCart={addToCart}
                formatPrice={formatPrice}
              />
            </div>
            {/* Blog nổi bật */}
            {randomBlog ? (
              <div ref={blogRef} className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold text-green-700 mb-3 sm:mb-4">Blog Nổi Bật</h2>
                <div className="bg-green-500 h-1 w-16 sm:w-20 md:w-24 mx-auto mb-3 sm:mb-4 md:mb-6"></div>
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {randomBlog.image && (
                    <img
                      src={randomBlog.image}
                      alt={randomBlog.title}
                      className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-md"
                    />
                  )}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">{randomBlog.title}</h3>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-xs sm:text-sm md:text-base leading-relaxed">
                    {randomBlog.content}
                  </div>
                </div>
              </div>
            ) : (
              <div ref={blogRef} className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 text-center text-gray-500 text-xs sm:text-sm md:text-base">
                Không có blog nào để hiển thị
              </div>
            )}
            {/* Gợi ý hôm nay */}
            <div ref={recommendedProductsRef} className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold text-green-700 mb-3 sm:mb-4">Gợi Ý Hôm Nay</h2>
              <div className="bg-green-500 h-1 w-16 sm:w-20 md:w-24 mx-auto mb-3 sm:mb-4 md:mb-6"></div>
              <div className="grid grid-cols-4 gap-4">
                {recommendedProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={`rec-${index}`}
                    isHoveredProduct={hoveredProduct === `rec-${index}`}
                    onHover={setHoveredProduct}
                    onClick={handleProductClick}
                    onAddToCart={addToCart}
                    formatPrice={formatPrice}
                    animationDelay={index * 100}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {showProductModal && selectedProduct && (
          <ProductModal
            product={selectedProduct}
            selectedVariant={selectedVariant}
            quantity={productQuantity}
            onVariantSelect={handleVariantSelect}
            onQuantityChange={handleQuantityChange}
            onAddToCart={addToCart}
            onClose={() => setShowProductModal(false)}
            formatPrice={formatPrice}
          />
        )}
      </main>
      {/* <Footer /> */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TroocEcommerce;