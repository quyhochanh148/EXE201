import React, { useState, useEffect } from 'react';
import { Filter, X as XIcon, AlertCircle, Leaf, Search, Sparkles } from 'lucide-react';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';
import CartModal from '../cart/CartModal';
import { useLocation } from 'react-router-dom';
import { CartEventBus } from '../cart/CartEventBus';
import { BE_API_URL } from '../../config/config';

// Import Components
import ProductCard from './components/ProductCard';
import ViewModeSelector from './components/ViewModeSelector';
import CategorySidebar from './components/CategorySidebar';
import FilterDisplay from './components/FilterDisplay';
import ProductModal from './components/ProductModal';
import ProductVariantSelector from '../../components/ProductVariantSelector';
import Pagination from './components/Pagination'; // Import the new Pagination component


const Categories = () => {
    // State cho dữ liệu từ API
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho bộ lọc
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedLocations, setSelectedLocations] = useState([]);

    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // State cho chế độ xem và sắp xếp
    const [viewMode, setViewMode] = useState('grid');
    const [sortOption, setSortOption] = useState('Đặc sắc');

    // State cho tương tác sản phẩm
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [productVariants, setProductVariants] = useState([]);
    const [loadingVariants, setLoadingVariants] = useState(false);

    // State cho giỏ hàng
    const [showCartModal, setShowCartModal] = useState(false);
    const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);
    const [addCartMessage, setAddCartMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8); // Số sản phẩm mỗi trang

    // Get current user information
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?._id || currentUser?.id || "";
    const isLoggedIn = !!userId;

    // Get location for URL parameters
    const location = useLocation();

    // Lấy dữ liệu danh mục và sản phẩm từ backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Lấy danh mục
                const categoriesData = await ApiService.get('/categories', false);
                setCategories(categoriesData);

                // Lấy sản phẩm
                const productsData = await ApiService.get('/product', false);
                
                // Lọc sản phẩm theo trạng thái is_active = true
                const activeProducts = productsData.filter(product => 
                     product.is_delete === false || product.is_delete === 'false' || product.is_delete === 0 
                );

                // Kiểm tra hàng tồn kho của tất cả biến thể
                let productsInStock = [];
                
                // Dùng Promise.all để kiểm tra song song tất cả sản phẩm
                const productStockChecks = await Promise.all(
                    activeProducts.map(async (product) => {
                        try {
                            const variants = await ApiService.get(`/product-variant/product/${product._id}`, false);
                            
                            // Lọc ra các biến thể đang active
                            const activeVariants = variants.filter(variant => 
                                variant.is_active === true || variant.is_active === 'true' || variant.is_active === 1
                            );
                            
                            // Kiểm tra xem có ít nhất một biến thể còn hàng không
                            const hasStock = activeVariants.length === 0 || 
                                             activeVariants.some(variant => 
                                                variant.stock === undefined || variant.stock > 0
                                             );
                                             
                            return {
                                product,
                                hasStock
                            };
                        } catch (error) {
                            console.error(`Error checking variants for product ${product._id}:`, error);
                            // Nếu có lỗi khi kiểm tra, coi như sản phẩm còn hàng
                            return {
                                product,
                                hasStock: true
                            };
                        }
                    })
                );
                
                // Lọc ra các sản phẩm còn hàng
                productsInStock = productStockChecks
                    .filter(item => item.hasStock)
                    .map(item => item.product);

                // Parse URL parameters
                const urlParams = new URLSearchParams(location.search);
                const search = urlParams.get('search');
                const categoryId = urlParams.get('category');
                const page = urlParams.get('page');

                // Xử lý tìm kiếm và lọc từ sản phẩm còn hàng
                if (search) {
                    setSearchQuery(search);

                    // Filter products based on search query
                    const searchLower = search.toLowerCase();
                    const filteredProducts = productsInStock.filter(product =>
                        product.name.toLowerCase().includes(searchLower) ||
                        (product.description && product.description.toLowerCase().includes(searchLower))
                    );
                    setProducts(filteredProducts);
                } else {
                    setProducts(productsInStock);
                    // Clear search query when no search is present
                    setSearchQuery('');
                }

                // Set selected category if present in URL
                if (categoryId) {
                    setSelectedCategory(categoryId);
                }

                // Set current page if present in URL
                if (page) {
                    setCurrentPage(parseInt(page, 10));
                } else {
                    setCurrentPage(1); // Reset to page 1 when filters change
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    // Reset về trang 1 khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceRange.min, priceRange.max, selectedLocations.length, searchQuery, sortOption]);

    // Fetch product variants khi có product được chọn
    useEffect(() => {
        const fetchVariants = async () => {
            if (!selectedProduct || !selectedProduct._id) return;
            
            try {
                setLoadingVariants(true);
                const response = await ApiService.get(`/product-variant/product/${selectedProduct._id}`, false);
                
                // Lọc chỉ lấy các biến thể có is_active = true
                const activeVariants = response.filter(variant => 
                    variant.is_active === true || variant.is_active === 'true' || variant.is_active === 1
                );
                
                if (activeVariants && activeVariants.length > 0) {
                    setProductVariants(activeVariants);
                    // Không tự động chọn biến thể, để người dùng chọn
                    setSelectedVariant(null);
                } else {
                    setProductVariants([]);
                }
            } catch (err) {
                console.error("Error fetching product variants:", err);
                setProductVariants([]);
            } finally {
                setLoadingVariants(false);
            }
        };

        if (selectedProduct) {
            fetchVariants();
        }
    }, [selectedProduct]);

    // Handle variant selection
    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        if (variant) {
            setQuantity(1);
        }
    };

    // Handle quantity change
    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (product, quantity = 1, fromModal = false) => {
        if (!isLoggedIn) {
            // Redirect to login if user is not logged in
            window.location.href = "/login";
            return;
        }

        // Kiểm tra trạng thái active của sản phẩm
        try {
            const updatedProduct = await ApiService.get(`/product/${product._id}`, false);
            if (!(updatedProduct.is_active === true || updatedProduct.is_active === 'true' || updatedProduct.is_active === 1)) {
                setAddCartMessage("Sản phẩm này hiện không có sẵn.");
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000);
                return;
            }
            
            // Kiểm tra xem sản phẩm còn hàng không
            const variants = await ApiService.get(`/product-variant/product/${updatedProduct._id}`, false);
            
            // Lọc ra các biến thể đang active
            const activeVariants = variants.filter(variant => 
                variant.is_active === true || variant.is_active === 'true' || variant.is_active === 1
            );
            
            // Kiểm tra xem có ít nhất một biến thể còn hàng không
            const hasStock = activeVariants.length === 0 || 
                             activeVariants.some(variant => 
                                variant.stock === undefined || variant.stock > 0
                             );
            
            if (!hasStock) {
                setAddCartMessage("Sản phẩm này hiện đã hết hàng.");
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000);
                return;
            }
        } catch (error) {
            console.error("Error checking product status:", error);
        }

        // Kiểm tra xem đang thêm từ modal và sản phẩm có biến thể không
        if (fromModal && productVariants.length > 0 && !selectedVariant) {
            setAddCartMessage("Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng");
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
            return;
        }

        try {
            // First find if the user already has a cart
            let cartId;
            try {
                const cartResponse = await ApiService.get(`/cart/user/${userId}`, false);
                cartId = cartResponse._id;
            } catch (error) {
                // If cart doesn't exist, create a new one
                const newCart = await ApiService.post('/cart/create', { user_id: userId });
                cartId = newCart._id;
            }

            // Now add the item to the cart
            const payload = {
                cart_id: cartId,
                product_id: product._id,
                quantity: fromModal ? quantity : 1
            };

            // If a variant is selected and adding from modal, include it
            if (fromModal && selectedVariant) {
                // Kiểm tra trạng thái active của biến thể
                if (!(selectedVariant.is_active === true || selectedVariant.is_active === 'true' || selectedVariant.is_active === 1)) {
                    setAddCartMessage("Biến thể sản phẩm này hiện không có sẵn.");
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false);
                    }, 3000);
                    return;
                }
                
                // Kiểm tra stock của biến thể đã chọn
                if (selectedVariant.stock !== undefined && selectedVariant.stock <= 0) {
                    setAddCartMessage("Biến thể sản phẩm này hiện đã hết hàng.");
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false);
                    }, 3000);
                    return;
                }
                
                payload.variant_id = selectedVariant._id;
            }

            // Use the correct path - matches with your router
            await ApiService.post('/cart/add-item', payload);

            // Thông báo rằng giỏ hàng đã thay đổi
            CartEventBus.publish('cartUpdated');

            // Đóng cart modal nếu đang mở
            if (showCartModal) {
                setShowCartModal(false);
            }

            // Show success message
            setAddCartMessage(`${product.name} đã được thêm vào giỏ hàng!`);
            setShowMessage(true);

            // Hide message after 3 seconds
            setTimeout(() => {
                setShowMessage(false);
            }, 3000);

            // Always trigger a refresh of the cart when adding items,
            // regardless of whether the cart modal is open or not
            setCartRefreshTrigger(prev => prev + 1);

            // If adding from modal, close it
            if (fromModal) {
                setShowProductModal(false);
                setQuantity(1); // Reset quantity
                setSelectedVariant(null); // Reset selected variant
                setProductVariants([]); // Reset variants
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            setAddCartMessage("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
            setShowMessage(true);

            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }
    };
    
    const getImagePath = (imgPath) => {
        if (!imgPath) return "";
        // Kiểm tra nếu imgPath đã là URL đầy đủ
        if (imgPath.startsWith('http')) return imgPath;
        // Kiểm tra nếu imgPath là đường dẫn tương đối
        if (imgPath.startsWith('/uploads')) return `${BE_API_URL}${imgPath}`;
        
        // Kiểm tra nếu đường dẫn có chứa "shops" để xử lý ảnh shop
        if (imgPath.includes('shops')) {
            const fileName = imgPath.split("\\").pop();
            return `${BE_API_URL}/uploads/shops/${fileName}`;
        }
        
        // Trường hợp imgPath là đường dẫn từ backend cho sản phẩm
        const fileName = imgPath.split("\\").pop();
        return `${BE_API_URL}/uploads/products/${fileName}`;
    };
    
    // Lọc sản phẩm dựa trên bộ lọc đã chọn
    const filteredProducts = products.filter(product => {
        // Lọc theo danh mục
        if (selectedCategory && product.category_id) {
            // Kiểm tra nếu category_id là mảng hoặc đối tượng
            if (Array.isArray(product.category_id)) {
                const categoryMatch = product.category_id.some(catId =>
                    catId === selectedCategory || (catId._id && catId._id === selectedCategory)
                );
                if (!categoryMatch) return false;
            } else if (product.category_id._id) {
                if (product.category_id._id !== selectedCategory) return false;
            } else if (product.category_id !== selectedCategory) {
                return false;
            }
        }

        // Lọc theo khoảng giá
        if (priceRange.min && product.price < parseFloat(priceRange.min)) return false;
        if (priceRange.max && product.price > parseFloat(priceRange.max)) return false;

        // Lọc theo địa điểm
        if (selectedLocations.length > 0) {
            // Giả định mỗi sản phẩm có trường location
            // Nếu không có, bạn cần điều chỉnh logic này
            const productLocation = product.location || 'Hà Nội';
            if (!selectedLocations.includes(productLocation)) return false;
        }

        return true;
    });

    // Sắp xếp sản phẩm dựa trên tùy chọn đã chọn
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'Giá thấp') {
            return a.price - b.price;
        } else if (sortOption === 'Giá cao') {
            return b.price - a.price;
        } else {
            // Đặc sắc (Featured) - sắp xếp theo is_hot, is_feature, hoặc rating
            // Đầu tiên theo is_hot
            if ((a.is_hot && !b.is_hot) || (a.is_hot === true && b.is_hot !== true)) return -1;
            if ((!a.is_hot && b.is_hot) || (a.is_hot !== true && b.is_hot === true)) return 1;

            // Sau đó theo is_feature
            if ((a.is_feature && !b.is_feature) || (a.is_feature === true && b.is_feature !== true)) return -1;
            if ((!a.is_feature && b.is_feature) || (a.is_feature !== true && b.is_feature === true)) return 1;

            // Sau đó theo rating
            return (b.rating || 0) - (a.rating || 0);
        }
    });

    // Tính toán các giá trị cho phân trang
    const totalItems = sortedProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const showingTo = Math.min(currentPage * itemsPerPage, totalItems);

    // Lấy mảng sản phẩm cho trang hiện tại
    const currentItems = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    // Xử lý khi thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        
        // Cập nhật URL để lưu trạng thái trang
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', pageNumber);
        
        // Thực hiện thay đổi URL mà không làm mới trang
        const newUrl = `${location.pathname}?${searchParams.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        // Cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Xử lý khi chọn danh mục
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    };

    // Xử lý khi thay đổi khoảng giá
    const handlePriceChange = (type, value) => {
        setPriceRange(prev => ({ ...prev, [type]: value }));
    };

    // Xử lý khi áp dụng bộ lọc giá
    const applyPriceFilter = () => {
        // Đã được xử lý trong filteredProducts
        console.log("Applied price filter:", priceRange);
    };

    // Xử lý khi chọn địa điểm
    const handleLocationSelect = (location) => {
        setSelectedLocations(prev => {
            if (prev.includes(location)) {
                return prev.filter(loc => loc !== location);
            } else {
                return [...prev, location];
            }
        });
    };

    // Xóa tất cả bộ lọc
    const clearFilters = () => {
        setSelectedCategory(null);
        setPriceRange({ min: '', max: '' });
        setSelectedLocations([]);
    };

    // Định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(price)
            .replace('₫', 'đ');
    };

    // Handling product card click
    const handleProductClick = async (product) => {
        try {
            // Kiểm tra lại trạng thái active của sản phẩm trước khi mở modal
            const updatedProduct = await ApiService.get(`/product/${product._id}`, false);
            if (updatedProduct.is_active === true || updatedProduct.is_active === 'true' || updatedProduct.is_active === 1) {
                // Kiểm tra xem sản phẩm còn hàng không
                const variants = await ApiService.get(`/product-variant/product/${updatedProduct._id}`, false);
                
                // Lọc ra các biến thể đang active
                const activeVariants = variants.filter(variant => 
                    variant.is_active === true || variant.is_active === 'true' || variant.is_active === 1
                );
                
                // Kiểm tra xem có ít nhất một biến thể còn hàng không
                const hasStock = activeVariants.length === 0 || 
                                activeVariants.some(variant => 
                                    variant.stock === undefined || variant.stock > 0
                                );
                
                if (hasStock) {
                    setSelectedProduct(updatedProduct);
                    setShowProductModal(true);
                    setQuantity(1);
                    setSelectedVariant(null);
                } else {
                    setAddCartMessage("Sản phẩm này hiện đã hết hàng.");
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false);
                    }, 3000);
                }
            } else {
                setAddCartMessage("Sản phẩm này hiện không có sẵn.");
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            // Fallback nếu không thể kiểm tra trạng thái
            setSelectedProduct(product);
            setShowProductModal(true);
            setQuantity(1);
            setSelectedVariant(null);
        }
    };

    // Hiển thị trạng thái đang tải
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <div className="mt-6">
                        <div className="flex items-center justify-center space-x-2">
                            <Leaf className="w-5 h-5 text-green-600 animate-pulse" />
                            <p className="text-green-700 font-medium">Đang tải dữ liệu...</p>
                            <Leaf className="w-5 h-5 text-green-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                        <div className="mt-2 text-sm text-green-600">Khám phá thế giới cây cảnh xanh mát</div>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị trạng thái lỗi
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex justify-center items-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Đã xảy ra lỗi</h3>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <span className="flex items-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Tải lại trang
                        </span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 relative">
                {/* Cart Modal Component */}
                <CartModal
                    isOpen={showCartModal}
                    onClose={() => setShowCartModal(false)}
                    refreshTrigger={cartRefreshTrigger}
                />

                {/* Success/Error Message */}
                {showMessage && (
                    <div className="fixed top-5 right-5 bg-white p-4 rounded-2xl shadow-2xl z-50 border-l-4 border-green-500 max-w-xs md:max-w-md animate-slideInRight">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <Leaf className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm md:text-base text-gray-800">{addCartMessage}</p>
                        </div>
                    </div>
                )}

                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
                        <span className="flex items-center justify-center">
                            <Leaf className="w-8 h-8 mr-3 text-green-600" />
                            Khám phá cây cảnh
                            <Leaf className="w-8 h-8 ml-3 text-green-600" />
                        </span>
                    </h1>
                    <p className="text-green-600 text-lg">Tìm kiếm cây cảnh phù hợp với không gian của bạn</p>
                </div>

                {/* Mobile Layout */}
                <div className="block lg:hidden">
                    {/* Mobile Header */}
                    <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-green-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-green-700 text-sm md:text-base font-medium">
                                <span className="flex items-center">
                                    <Search className="w-4 h-4 mr-2" />
                                    {totalItems} Sản phẩm
                                </span>
                            </div>
                            <ViewModeSelector 
                                viewMode={viewMode}
                                setViewMode={setViewMode}
                                sortOption={sortOption}
                                setSortOption={setSortOption}
                            />
                        </div>

                        {/* Mobile Search Results */}
                        {searchQuery && (
                            <div className="mb-4 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                                <div className="flex items-center">
                                    <Search className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">
                                        Kết quả tìm kiếm cho: "{searchQuery}"
                                    </span>
                                    <button
                                        className="ml-auto text-sm hover:text-green-200 transition-colors"
                                        onClick={() => {
                                            window.location.href = '/categories';
                                        }}
                                    >
                                        Xóa tìm kiếm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Filter Display */}
                    <div className="mb-6">
                        <FilterDisplay 
                            selectedCategory={selectedCategory}
                            categories={categories}
                            priceRange={priceRange}
                            selectedLocations={selectedLocations}
                            setPriceRange={setPriceRange}
                            setSelectedLocations={setSelectedLocations}
                            setSelectedCategory={setSelectedCategory}
                            clearFilters={clearFilters}
                            formatPrice={formatPrice}
                        />
                    </div>

                    {/* Mobile Products Grid */}
                    {currentItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            {currentItems.map((product, index) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    viewMode={viewMode}
                                    hoveredProduct={hoveredProduct}
                                    setHoveredProduct={setHoveredProduct}
                                    handleProductClick={handleProductClick}
                                    addToCart={addToCart}
                                    formatPrice={formatPrice}
                                    animationDelay={index * 100}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-green-100">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Leaf className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-gray-600 text-lg mb-4">Không tìm thấy sản phẩm phù hợp</p>
                            <button
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full hover:from-green-700 hover:to-green-800 transition-all duration-300"
                                onClick={clearFilters}
                            >
                                Xóa bộ lọc và thử lại
                            </button>
                        </div>
                    )}

                    {/* Mobile Pagination */}
                    {totalItems > 0 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                showingFrom={showingFrom}
                                showingTo={showingTo}
                                totalItems={totalItems}
                            />
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                    <div className="flex gap-8">
                        {/* Sidebar Categories */}
                        <div className="w-80 flex-shrink-0">
                            <div className="sticky top-8">
                                <CategorySidebar 
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    handleCategorySelect={handleCategorySelect}
                                    priceRange={priceRange}
                                    handlePriceChange={handlePriceChange}
                                    applyPriceFilter={applyPriceFilter}
                                    clearFilters={clearFilters}
                                />
                            </div>
                        </div>

                        {/* Product Listing */}
                        <div className="flex-grow">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 mb-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-green-700 font-medium">
                                        <span className="flex items-center">
                                            <Search className="w-5 h-5 mr-2" />
                                            {totalItems} Sản phẩm
                                        </span>
                                    </div>
                                    
                                    <ViewModeSelector 
                                        viewMode={viewMode}
                                        setViewMode={setViewMode}
                                        sortOption={sortOption}
                                        setSortOption={setSortOption}
                                    />
                                </div>

                                {searchQuery && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                                        <div className="flex items-center">
                                            <Search className="w-5 h-5 mr-2" />
                                            <span className="font-medium">
                                                Kết quả tìm kiếm cho: "{searchQuery}"
                                            </span>
                                            <button
                                                className="ml-auto hover:text-green-200 transition-colors"
                                                onClick={() => {
                                                    window.location.href = '/categories';
                                                }}
                                            >
                                                Xóa tìm kiếm
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Filter Display */}
                            <div className="mb-6">
                                <FilterDisplay 
                                    selectedCategory={selectedCategory}
                                    categories={categories}
                                    priceRange={priceRange}
                                    selectedLocations={selectedLocations}
                                    setPriceRange={setPriceRange}
                                    setSelectedLocations={setSelectedLocations}
                                    setSelectedCategory={setSelectedCategory}
                                    clearFilters={clearFilters}
                                    formatPrice={formatPrice}
                                />
                            </div>

                            {currentItems.length > 0 ? (
                                <div
                                    className={`
                                        grid gap-6 
                                        ${viewMode === 'grid'
                                            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                                            : 'grid-cols-1'
                                        }
                                    `}
                                >
                                    {currentItems.map((product, index) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            viewMode={viewMode}
                                            hoveredProduct={hoveredProduct}
                                            setHoveredProduct={setHoveredProduct}
                                            handleProductClick={handleProductClick}
                                            addToCart={addToCart}
                                            formatPrice={formatPrice}
                                            animationDelay={index * 100}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-green-100">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Leaf className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                                    <p className="text-gray-600 mb-6">Không có sản phẩm nào phù hợp với bộ lọc hiện tại</p>
                                    <button
                                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        onClick={clearFilters}
                                    >
                                        <span className="flex items-center">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Xóa bộ lọc và thử lại
                                        </span>
                                    </button>
                                </div>
                            )}

                            {/* Pagination Component */}
                            {totalItems > 0 && (
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        showingFrom={showingFrom}
                                        showingTo={showingTo}
                                        totalItems={totalItems}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Modal with ProductVariantSelector */}
                {showProductModal && selectedProduct && (
                    <ProductModal
                        selectedProduct={selectedProduct}
                        selectedVariant={selectedVariant}
                        quantity={quantity}
                        formatPrice={formatPrice}
                        handleVariantSelect={handleVariantSelect}
                        handleQuantityChange={handleQuantityChange}
                        addToCart={addToCart}
                        closeModal={() => setShowProductModal(false)}
                    />
                )}
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Categories;