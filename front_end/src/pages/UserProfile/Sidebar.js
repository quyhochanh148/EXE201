import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingBag, LogOut, Lock, MapPin, MessageSquare, Store, Package } from 'lucide-react'
import avatar from '../../assets/avatar.png'
import { MessageEventBus } from '../UserProfile/components/Message';
import { useEffect, useState } from 'react';

// Sidebar Component
const Sidebar = ({ profile }) => {
  const location = useLocation();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Lắng nghe sự kiện thay đổi số lượng tin nhắn chưa đọc
  useEffect(() => {
    const unsubscribe = MessageEventBus.subscribe('unreadCountChanged', (count) => {
      setUnreadMessageCount(count);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sidebarItems = [
    { icon: User, label: 'Tài khoản của tôi', key: 'profile', path: '/user-profile' },
    {
      icon: MessageSquare,
      label: 'Tin nhắn',
      key: 'messages',
      path: '/user-profile/messages',
      badge: unreadMessageCount > 0 ? unreadMessageCount : null
    },
    { icon: ShoppingBag, label: 'Đơn hàng của tôi', key: 'orders', path: '/user-profile/orders' },
    { icon: MapPin, label: 'Địa chỉ nhận hàng', key: 'addresses', path: '/user-profile/addresses' },
    { icon: Store, label: 'Cửa hàng đã theo dõi', key: 'followed-shops', path: '/user-profile/followed-shops' },
    { icon: Lock, label: 'Đổi mật khẩu', key: 'password', path: '/user-profile/password' },
  ];

  return (
    <div className="w-full lg:w-64 bg-white border p-3 sm:p-4">
      <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={avatar} className='w-full h-full' alt="Profile" />
        </div>
        <div>
          <p className="font-semibold text-sm sm:text-base">
            {profile && (profile.lastName || profile.firstName) ?
              `${profile.lastName || ''} ${profile.firstName || ''}`.trim() :
              'Người dùng'}
          </p>
        </div>
      </div>

      <div className="space-y-1 sm:space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`
              flex items-center w-full p-2 sm:p-2 rounded relative text-sm sm:text-base
              ${location.pathname === item.path
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-gray-100'}
            `}
          >
            <item.icon className="mr-2 sm:mr-3" size={18} />
            <span>{item.label}</span>

            {/* Badge hiển thị số lượng chưa đọc */}
            {item.badge && (
              <div className="ml-auto bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                {item.badge > 9 ? '9+' : item.badge}
              </div>
            )}
          </Link>
        ))}

        <Link
          to="/"
          className="flex items-center w-full p-2 sm:p-2 rounded hover:bg-gray-100 text-red-500 text-sm sm:text-base"
        >
          <LogOut className="mr-2 sm:mr-3" size={18} />
          <span>Thoát</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;