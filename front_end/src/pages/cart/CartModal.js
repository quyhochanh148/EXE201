import React, { useState, useEffect } from 'react';
import { CircleX, ShoppingCart, Info } from 'lucide-react';
import ApiService from '../../services/ApiService';
import AuthService from '../../services/AuthService';
import CartItem from './CartItems';
import { CartEventBus } from './CartEventBus';

const CartModal = ({ isOpen, onClose, refreshTrigger = 0 }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);

    // Lấy user_id từ thông tin người dùng đã đăng nhập
    const currentUser = AuthService.getCurrentUser();
    const userId = currentUser?._id || currentUser?.id || "";

    // Subscribe vào CartEventBus để cập nhật khi có thay đổi
    useEffect(() => {
        const unsubscribe = CartEventBus.subscribe('cartUpdated', () => {
            if (isOpen && userId) {
                fetchCartData();
            }
        });

        return () => unsubscribe();
    }, [isOpen, userId]);

    // Làm mới dữ liệu giỏ hàng khi modal mở hoặc refreshTrigger thay đổi
    useEffect(() => {
        if (isOpen && userId) {
            fetchCartData();
        } else if (isOpen) {
            setLoading(false);
            setError('Vui lòng đăng nhập để xem giỏ hàng');
        }
    }, [isOpen, userId, refreshTrigger]);

    const fetchCartData = async () => {
        try {
            setLoading(true);
            // Thêm timestamp để tránh cache
            const response = await ApiService.get(`/cart/user/${userId}?_t=${Date.now()}`);
            if (response && response.items) {
                setCartItems(response.items);
                calculateTotal(response.items);
            } else {
                setCartItems([]);
                setCartTotal(0);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart data:', error);
            setError('Không thể tải dữ liệu giỏ hàng');
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            // Kiểm tra tồn kho của biến thể trước khi cập nhật
            const currentItem = cartItems.find(item => item._id === cartItemId);
            
            if (currentItem && currentItem.variant_id) {
                // Nếu variant_id là object và có thông tin stock
                if (typeof currentItem.variant_id === 'object' && currentItem.variant_id.stock !== undefined) {
                    if (newQuantity > currentItem.variant_id.stock) {
                        alert(`Chỉ còn ${currentItem.variant_id.stock} sản phẩm trong kho`);
                        return;
                    }
                } else {
                    // Nếu chỉ có variant_id string, cần fetch thông tin
                    const productId = typeof currentItem.product_id === 'object' 
                        ? currentItem.product_id._id 
                        : currentItem.product_id;
                    
                    const variantId = typeof currentItem.variant_id === 'object'
                        ? currentItem.variant_id._id
                        : currentItem.variant_id;
                    
                    if (productId && variantId) {
                        const variants = await ApiService.get(`/product-variant/product/${productId}`, false);
                        const variant = variants.find(v => v._id === variantId);
                        
                        if (variant && variant.stock !== undefined && newQuantity > variant.stock) {
                            alert(`Chỉ còn ${variant.stock} sản phẩm trong kho`);
                            return;
                        }
                    }
                }
            }

            // Gọi API cập nhật số lượng
            await ApiService.put('/cart/update-item', {
                cart_item_id: cartItemId,
                quantity: newQuantity
            });

            // Thông báo rằng giỏ hàng đã thay đổi
            CartEventBus.publish('cartUpdated');

            // Cập nhật state local
            const updatedItems = cartItems.map(item =>
                item._id === cartItemId ? { ...item, quantity: newQuantity } : item
            );
            
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
        } catch (error) {
            console.error('Error updating item quantity:', error);
            alert('Không thể cập nhật số lượng sản phẩm');
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            // Gọi API xóa sản phẩm
            await ApiService.delete(`/cart/remove-item/${cartItemId}`);

            // Thông báo rằng giỏ hàng đã thay đổi
            CartEventBus.publish('cartUpdated');

            // Cập nhật state local
            const remainingItems = cartItems.filter(item => item._id !== cartItemId);
            setCartItems(remainingItems);
            calculateTotal(remainingItems);
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Không thể xóa sản phẩm');
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => {
            let price = 0;
            
            // Xác định giá từ biến thể hoặc sản phẩm
            if (item.variant_id) {
                if (typeof item.variant_id === 'object' && item.variant_id.price) {
                    price = item.variant_id.price;
                }
            } else if (item.product_id && typeof item.product_id === 'object') {
                price = item.product_id.discounted_price || item.product_id.price || 0;
            }
            
            return sum + (price * item.quantity);
        }, 0);
        
        setCartTotal(total);
    };

    if (!isOpen) return null;

    return (
<div
    className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 
    transition-transform duration-300 ease-in-out transform translate-x-0 border-l-4 border-purple-200"
>
    <div className="p-4 border-b-2 border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex items-center">
            <ShoppingCart size={24} className="mr-3 text-purple-700" />
            <h2 className="text-2xl font-bold text-purple-900">Giỏ Hàng</h2>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500 transition-colors">
            <CircleX size={24} />
        </button>
    </div>

    <div className="p-4 overflow-y-auto max-h-[calc(100vh-220px)] bg-gray-100">
        {loading ? (
            <div className="text-center py-6">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-400 border-t-purple-700 rounded-full"></div>
                <p className="mt-3 text-lg text-gray-700">Đang tải...</p>
            </div>
        ) : error ? (
            <div className="text-center py-6 text-xl text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
        ) : !userId ? (
            <div className="text-center py-6">
                <p className="mb-5 text-lg text-gray-700">Vui lòng đăng nhập để xem giỏ hàng</p>
                <button
                    onClick={() => window.location.href = "/login"}
                    className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 text-lg"
                >
                    Đăng nhập
                </button>
            </div>
        ) : cartItems.length === 0 ? (
            <div className="text-center py-10">
                <ShoppingCart size={48} className="mx-auto text-gray-500 mb-6" />
                <p className="text-xl text-gray-600">Giỏ hàng của bạn đang trống</p>
                <button
                    onClick={() => window.location.href = "/"}
                    className="mt-6 text-purple-700 hover:text-purple-900 text-lg font-semibold"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        ) : (
            <>
                <div className="bg-blue-100 p-4 rounded-lg mb-5 text-base flex items-start shadow-md">
                    <Info size={18} className="text-blue-700 mr-3 mt-0.5" />
                    <p className="text-blue-900">
                        Sản phẩm trong giỏ hàng hiển thị theo biến thể bạn đã chọn. Giá và số lượng tồn kho có thể khác nhau giữa các biến thể.
                    </p>
                </div>
                
                {cartItems.map((item) => (
                    <CartItem
                        key={item._id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                    />
                ))}
            </>
        )}
    </div>

    {userId && cartItems.length > 0 && (
        <div className="p-4 border-t-2 border-gray-200 bg-white shadow-inner">
            <div className="flex justify-between mb-4 text-lg">
                <span className="text-gray-800 font-medium">Tạm tính</span>
                <span className="font-bold text-purple-800">{cartTotal.toLocaleString()} đ</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => window.location.href = "/cart"}
                    className="w-full bg-white border-2 border-purple-700 text-purple-700 py-3 rounded-lg hover:bg-purple-100 text-base font-semibold transition-colors"
                >
                    Xem Giỏ Hàng
                </button>
                <button
                    onClick={() => window.location.href = "/checkout"}
                    className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 text-base font-semibold transition-colors"
                >
                    Thanh Toán
                </button>
            </div>
        </div>
    )}
</div>
    );
};

export default CartModal;