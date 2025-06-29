import React from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProductManagement from './product/ProductManagement';
import CategoryManagement from './category/CategoryManagement';
import Dashboard from './dashboard/Dashboard';
import BrandList from './brand/BrandList';
import AddBrand from './brand/AddBrand';
import StoreList from './store/StoreList';
import StoreDetail from './store/StoreDetail';
import CustomerManagement from './customer/CustomerManagement';
import OrderManagement from './order/OrderManagement';
import PaymentManagement from './payment/PaymentManagement';
import AddPayment from './payment/AddPayment';
import ShippingManagement from './shipping/ShippingManagement';
import AddShipping from './shipping/AddShipping';
import CouponManagement from './coupon/CouponManagement';
import AddCouponForm from './coupon/AddCoupon';
import EditCouponForm from './coupon/EditCoupon';
import logo from '../assets/logo.png'
import StoreRequestsPage from './store/StoreRequestsPage';
import RevenueDashboard from './revenue/RevenueDashboard';
import ShopPaymentList from './revenue/ShopPaymentList';
import PaymentBatchList from './revenue/PaymentBatchList';
import ShopPaymentDetail from './revenue/ShopPaymentDetail';
import PaymentBatchDetail from './revenue/PaymentBatchDetail';
import AdminProfile from './profile/ProfileContent';
import AdminPasswordChange from './profile/AdminPasswordChange';
import BlogManagement from './blog/BlogManagement';

// Main Content Component
const MainContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1 h-screen overflow-y-auto">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="p-4 flex gap-2 items-center">
          <img src={logo} alt="VVDShop Logo" className="h-10" />
          <p>GreenGarden</p>
        </div>
        {/* <div className="relative w-3/5">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div> */}

        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <span className="mr-2">Việt Nam</span>
            <ChevronDown size={16} />
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {/* User profile picture or initials */}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/products" element={<ProductManagement />} />

          <Route path="/categories" element={<CategoryManagement />} />
          {/* Đã xóa route add-category */}
          <Route path="/blog" element={<BlogManagement />} />

          <Route path="/brands" element={<BrandList />} />
          {/* Đã xóa route add-brand */}

          <Route path="/stores" element={<StoreList />} />
          <Route path="/store/:id" element={<StoreDetail onBack={() => navigate('/admin/stores')} />} />
          <Route path="/store-requests" element={<StoreRequestsPage />} />

          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/orders" element={<OrderManagement />} />

          <Route path="/coupons" element={<CouponManagement />} />
          <Route path="/edit-coupon/:id" element={<EditCouponForm />} />

          <Route path="/shippings" element={<ShippingManagement />} />

          <Route path="/payments" element={<PaymentManagement />} />

          <Route path="/revenue/dashboard" element={<RevenueDashboard />} />
          <Route path="/revenue/shop-payments" element={<ShopPaymentList />} />
          <Route path="/revenue/shop-payment/:id" element={<ShopPaymentDetail />} />
          <Route path="/revenue/payment-batches" element={<PaymentBatchList />} />
          <Route path="/revenue/payment-batch/:id" element={<PaymentBatchDetail />} />

          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/password" element={<AdminPasswordChange />} />

          <Route path="/support" element={<div className="p-6">Nội dung Hỗ trợ</div>} />
          <Route path="/settings" element={<div className="p-6">Nội dung Cài đặt</div>} />

          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainContent;