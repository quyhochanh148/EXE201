import React, { useState } from 'react';
import { 
  Truck, 
  Shield, 
  Tag, 
  MessageCircle, 
  Star 
} from 'lucide-react';
import footerBg from '../assets/Footer.jpg';
import logo from '../assets/LogoNew1.jpg';
const Footer = () => {
  const [email, setEmail] = useState('');

  const paymentMethods = [
    'visa', 'mastercard', 'discover', 'western-union', 'amex', 'cirus', 'paypal'
  ];

  const featuresData = [
    { 
      icon: Shield, 
      title: 'THANH TOÁN AN TOÀN', 
      description: '100% Bảo mật thanh toán' 
    },
    { 
      icon: Tag, 
      title: 'GÃM GIÁ TRỰC TUYẾN', 
      description: 'Có nhiều mã giảm giá khi mua hàng' 
    },
    { 
      icon: MessageCircle, 
      title: 'TRUNG TÂM TRỢ GIÚP', 
      description: 'Hỗ trợ 24/7' 
    },
    { 
      icon: Star, 
      title: 'SẢN PHẨM TUYỆT VỜI', 
      description: 'Từ nhiều nhãn hàng nổi tiếng' 
    }
  ];

  return (
    <footer 
      className="bg-[#2E7D32] text-white"
    >
      {/* Features Section */}
      <div className=" border-t border-white">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {featuresData.map((feature, index) => (
      <div
        key={index}
        className="flex flex-col text-center p-6 border border-white hover:bg-[#4CAF50] items-center"
      >
        <feature.icon size={40} className="text-white" />
        <h4 className="font-semibold text-sm text-white mt-2">{feature.title}</h4>
        <p className="text-xs text-white">{feature.description}</p>
      </div>
    ))}
  </div>
      </div>

      {/* Main Footer Content */}
     <div className="mx-auto max-w-7xl py-12">
        {/* Logo Section */}
        <div className="mb-6">
          <img 
            src={logo} 
            alt="GreenGarden" 
            className="w-26 h-16 object-contain scale-125 mx-auto md:mx-0" 
          />
        </div>
        {/* Grid Content */}
        <div className="grid grid-cols-4 gap-8">
          {/* Address Section */}
          <div>
            <h3 className="font-bold mb-4 text-white">ĐỊA CHỈ</h3>
            <div className="space-y-2 text-white">
              <p>Bạn có câu hỏi? Hãy gọi cho chúng tôi để được hỗ trợ 24/7</p>
              <p className="font-semibold text-white">Hotline: +84 396 872 025</p>
              <p>66-69 Mục Uyên, Tân Xã, Thạch Hòa, Thạch Thất, Hà Nội</p>
              <p>2003tranquy123@gmail.com</p>
              <p>bloomgardenexe2@gmail.com</p>
            </div>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="font-bold mb-4 text-white">THÔNG TIN</h3>
            <ul className="space-y-2 text-white">
              <li><a href="#" className="hover:text-white">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white">Thông tin vận chuyển</a></li>
              <li><a href="#" className="hover:text-white">Phương thức thanh toán</a></li>
              <li><a href="#" className="hover:text-white">Gửi hỗ trợ</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-bold mb-4 text-white">LIÊN HỆ</h3>
            <ul className="space-y-2 text-white">
              <li><a href="#" className="hover:text-white">Địa chỉ</a></li>
              <li><a href="#" className="hover:text-white">Đơn hàng</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-bold mb-4 text-white">ĐĂNG KÝ NHẬN THÔNG BÁO</h3>
            <p className="text-white mb-4">
              Với 20.000 khách hàng đã đăng ký với BloomGarden hãy đăng ký 
              nhanh để được những giảm giá tuyệt vời từ chúng tôi
            </p>
            <div className="flex">
              <input 
                type="email"
                placeholder="Địa chỉ email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-2 border border-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-white"
              />
              <button className="bg-white text-[#2E7D32] px-4 py-2 rounded-r-md hover:bg-gray-200">
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;