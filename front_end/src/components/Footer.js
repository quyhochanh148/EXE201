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
    <footer className="bg-gradient-to-b from-green-600 to-green-700 text-white border-t-2 border-green-500 perspective-1000">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-slideUp">
            <img
              src={logo}
              alt="GreenGarden"
              className="w-32 h-auto mb-4 transition-transform duration-300 hover:scale-110 hover:shadow-green-400/50 hover:rotateY(20deg) hover:translateZ(20px) animate-glowGreen"
            />
            <p className="text-sm leading-relaxed transform hover:translateZ(10px) transition-all duration-300">
              GreenGarden - Đem thiên nhiên đến cửa nhà bạn với các sản phẩm cây cảnh và dụng cụ làm vườn chất lượng cao.
            </p>
          </div>

          <div className="animate-slideUp animation-delay-100">
            <h3 className="font-semibold text-lg mb-4 text-green-100 transform hover:translateZ(10px) transition-all duration-300">Liên Hệ</h3>
            <ul className="space-y-4 text-sm leading-relaxed">
              <li className="flex items-center transform hover:translateZ(5px) transition-all duration-200">
                <MapPin size={16} className="mr-2 text-green-300" />
                FPT Hòa Lạc, Thạch Thất, Hà Nội
              </li>
              <li className="flex items-center transform hover:translateZ(5px) transition-all duration-200">
                <Phone size={16} className="mr-2 text-green-300" />
                0396872025
              </li>
              <li className="flex items-center transform hover:translateZ(5px) transition-all duration-200">
                <Mail size={16} className="mr-2 text-green-300" />
                bloomgardenexe2@gmail.com
              </li>
            </ul>
          </div>

          <div className="animate-slideUp animation-delay-200">
            <h3 className="font-semibold text-lg mb-4 text-green-100 transform hover:translateZ(10px) transition-all duration-300">Thông Tin</h3>
            <ul className="space-y-4 text-sm leading-relaxed">
              <li>
                <a href="/introduction" className="hover:text-green-300 transition-all duration-200 hover:scale-105 hover:rotateY(10deg) inline-block transform">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-300 transition-all duration-200 hover:scale-105 hover:rotateY(10deg) inline-block transform">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-300 transition-all duration-200 hover:scale-105 hover:rotateY(10deg) inline-block transform">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-300 transition-all duration-200 hover:scale-105 hover:rotateY(10deg) inline-block transform">
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-slideUp animation-delay-300">
            <h3 className="font-semibold text-lg mb-4 text-green-100 transform hover:translateZ(10px) transition-all duration-300">Đăng Ký Nhận Tin</h3>
            <p className="text-sm mb-4 leading-relaxed transform hover:translateZ(10px) transition-all duration-300">
              Nhận thông tin mới nhất về sản phẩm và ưu đãi từ GreenGarden.
            </p>
            <form onSubmit={handleSubmit} className="flex perspective-1000">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-2 rounded-l-md bg-white text-gray-800 focus:outline-none border-2 border-green-500 transition-all duration-300 hover:shadow-green-400/50 animate-glowGreen hover:translateZ(15px)"
              />
              <button
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-md text-white transition-all duration-200 hover:scale-105 hover:rotateY(10deg) animate-pulse"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center animate-slideUp animation-delay-400">
          <div className="flex space-x-4 mb-4 md:mb-0 perspective-1000">
            <a href="https://www.facebook.com/profile.php?id=61576812787820" className="hover:text-green-300 transition-all duration-200 hover:scale-110 hover:rotateY(15deg) animate-pulse">
              <Facebook size={24} />
            </a>
            {/* <a href="#" className="hover:text-green-300 transition-all duration-200 hover:scale-110 hover:rotateY(15deg) animate-pulse">
              <Instagram size={24} />
            </a> */}
          </div>
          <div className="text-sm transform hover:translateZ(5px) transition-all duration-200">
            © 2023 GreenLiving.vn. All rights reserved.
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowGreen {
          from { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
          to { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8); }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-in-out;
        }

        .animate-glowGreen {
          animation: glowGreen 1.5s ease-in-out infinite;
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }

        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;