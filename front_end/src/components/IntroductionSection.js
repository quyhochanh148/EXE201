import React from 'react';
import image1 from '../assets/ImageSliderDetail/1684222267_Bia-WEB-1.jpg';

const IntroductionSection = () => {
  return (
    <div className="bg-green-50 py-12 border-t-2 border-green-500">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-8 animate-fadeIn">Giới Thiệu Về GreenGarden</h2>
        <div className="prose max-w-none text-gray-700 leading-relaxed">
          <p className="mb-6 animate-fadeIn animation-delay-100">
            Được thành lập vào năm 2023, <strong>GreenGarden</strong> là nền tảng thương mại điện tử chuyên cung cấp cây cảnh, chậu cây, và dụng cụ làm vườn, mang đến giải pháp mua sắm trực tuyến tiện lợi cho những người yêu thiên nhiên.
          </p>
          <p className="mb-6 animate-fadeIn animation-delay-200">
            Với trụ sở tại Hà Nội, chúng tôi cung cấp đa dạng sản phẩm từ các nhà vườn uy tín trong và ngoài nước. Đội ngũ hỗ trợ khách hàng luôn sẵn sàng tư vấn, giúp bạn chọn được sản phẩm phù hợp nhất cho không gian sống.
          </p>
          <div className="relative overflow-hidden rounded-lg border-2 border-green-500 animate-glowGreen">
            <img
              src={image1}
              alt="GreenGarden - Cây cảnh"
              className="w-full max-w-2xl mx-auto h-auto rounded-lg transition-transform duration-500 hover:scale-110 hover:rotate-2"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h3 className="text-xl font-semibold text-green-700 mb-4 animate-fadeIn animation-delay-300">Sản Phẩm & Dịch Vụ</h3>
          <ul className="list-disc list-inside mb-8 animate-fadeIn animation-delay-400">
            <li>Cây cảnh nội thất, văn phòng, phong thủy.</li>
            <li>Chậu cây sứ, composite, chậu tự tưới.</li>
            <li>Phân bón, đất trồng, dụng cụ làm vườn.</li>
            <li>Tư vấn thiết kế không gian xanh.</li>
            <li>Quà tặng cây cảnh cho các dịp đặc biệt.</li>
          </ul>
          <h3 className="text-xl font-semibold text-green-700 mb-4 animate-fadeIn animation-delay-500">Tầm Nhìn</h3>
          <p className="mb-8 animate-fadeIn animation-delay-600">
            Trở thành nền tảng thương mại điện tử cây cảnh hàng đầu Việt Nam, mang thiên nhiên đến mọi ngôi nhà và xây dựng cộng đồng yêu cây cảnh.
          </p>
          <h3 className="text-xl font-semibold text-green-700 mb-4 animate-fadeIn animation-delay-700">Liên Hệ</h3>
          <p className="animate-fadeIn animation-delay-800">
            <strong>Trụ sở:</strong> 66-69 Mục Uyên, Tân Xã, Thạch Thất, Hà Nội<br />
            <strong>Điện thoại:</strong> +84 396 872 025<br />
            <strong>Email:</strong> bloomgardenexe2@gmail.com
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowGreen {
          0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
        }
        .animate-glowGreen {
          animation: glowGreen 2s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
      `}</style>
    </div>
  );
};

export default IntroductionSection;