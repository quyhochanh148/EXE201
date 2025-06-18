import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import logo from '../assets/LogoNew.png';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-green-600 to-green-700 text-white border-t-2 border-green-500">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="animate-slideUp">
            <img
              src={logo}
              alt="GreenGarden"
              className="w-24 md:w-32 h-auto mb-4 transition-transform duration-300 hover:scale-110"
            />
            <p className="text-xs md:text-sm leading-relaxed">
              GreenGarden - Đem thiên nhiên đến cửa nhà bạn với các sản phẩm cây cảnh và dụng cụ làm vườn chất lượng cao.
            </p>
          </div>

          {/* Contact Info */}
          <div className="animate-slideUp animation-delay-100">
            <h3 className="font-semibold text-base md:text-lg mb-4 text-green-100">Liên Hệ</h3>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm leading-relaxed">
              <li className="flex items-start">
                <MapPin size={14} className="mr-2 mt-0.5 text-green-300 flex-shrink-0" />
                <span>FPT Hòa Lạc, Thạch Thất, Hà Nội</span>
              </li>
              <li className="flex items-center">
                <Phone size={14} className="mr-2 text-green-300 flex-shrink-0" />
                <span>0396872025</span>
              </li>
              <li className="flex items-start">
                <Mail size={14} className="mr-2 mt-0.5 text-green-300 flex-shrink-0" />
                <span className="break-all">bloomgardenexe2@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Information Links */}
          <div className="animate-slideUp animation-delay-200">
            <h3 className="font-semibold text-base md:text-lg mb-4 text-green-100">Thông Tin</h3>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm leading-relaxed">
              <li>
                <a href="/introduction" className="hover:text-green-300 transition-all duration-200 hover:scale-105 inline-block">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-300 transition-all duration-200 hover:scale-105 inline-block">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-300 transition-all duration-200 hover:scale-105 inline-block">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-300 transition-all duration-200 hover:scale-105 inline-block">
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-slideUp animation-delay-300">
            <h3 className="font-semibold text-base md:text-lg mb-4 text-green-100">Đăng Ký Nhận Tin</h3>
            <p className="text-xs md:text-sm mb-4 leading-relaxed">
              Nhận thông tin mới nhất về sản phẩm và ưu đãi từ GreenGarden.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Nhập email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-3 md:px-4 py-2 rounded-l-md sm:rounded-r-none rounded-r-md sm:rounded-l-md bg-white text-gray-800 focus:outline-none border-2 border-green-500 transition-all duration-300 text-xs md:text-sm"
              />
              <button
                className="bg-green-600 hover:bg-green-700 px-3 md:px-4 py-2 rounded-l-none sm:rounded-l-none rounded-l-md sm:rounded-r-md text-white transition-all duration-200 hover:scale-105 text-xs md:text-sm mt-2 sm:mt-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-600 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center animate-slideUp animation-delay-400">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <a href="https://www.facebook.com/profile.php?id=61576812787820" className="hover:text-green-300 transition-all duration-200 hover:scale-110">
              <Facebook size={20} className="md:w-6 md:h-6" />
            </a>
          </div>
          <div className="text-xs md:text-sm text-center sm:text-left">
            © 2023 GreenLiving.vn. All rights reserved.
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-in-out;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>
    </footer>
  );
};

export default Footer;