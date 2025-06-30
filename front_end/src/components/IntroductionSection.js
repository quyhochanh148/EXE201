import React from 'react';
import cayConImg from '../assets/ImageSliderDetail/anh2.jpg';
import cayConImg1 from '../assets/ImageSliderDetail/anh4.jpg';

const IntroductionSection = () => {
  // Placeholder image URL since we can't import the original
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23d1d5db'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle' dy='.3em'%3EGreenGarden%3C/text%3E%3C/svg%3E";

  return (
    <div className="bg-gradient-to-br from-white via-green-50 to-white min-h-screen p-8 animate-fadeIn font-sans relative" style={{ fontFamily: 'Inter, Roboto, Arial, Helvetica, sans-serif' }}>
      {/* Icon động ngoài khung */}
      <div className="hidden md:block absolute -top-8 -right-8 z-30 animate-bounce">
        <span className="text-6xl">🌱</span>
      </div>
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border-2 border-green-400 hover:border-green-500 transition-all duration-500 hover:shadow-2xl hover:shadow-green-100 overflow-hidden group relative">
        <div className="p-16">
          {/* Hero Section */}
          <div className="mb-12 animate-slideDown">
            <div className="flex items-center gap-8 flex-col md:flex-row">
              {/* Left Text */}
              <div className="flex-1 group">
                <h1 className="text-5xl font-bold text-gray-800 leading-tight mb-8 group-hover:text-green-600 transition-colors duration-300 font-sans">
                  GreenGarden — Sàn thương mại điện tử dành cho người yêu cây<br />
                  <span className="block text-gray-600 text-lg font-normal leading-relaxed mt-6 font-sans">
                    Nơi bạn có thể dễ dàng tìm, mua và bán cây cảnh, hoa, phụ kiện… từ những nhà vườn uy tín, kết nối cùng hàng ngàn người đam mê cây xanh tại Hà Nội!<br/>
                    Chúng tôi hiểu rằng, giữa nhịp sống ồn ào và vội vã, nhiều khi ta vô tình bỏ lỡ những điều nhỏ bé nhưng đầy ý nghĩa trong cuộc sống — đó có thể là ánh mắt trìu mến của chú mèo nhỏ bên bạn, hay một mầm cây non đang âm thầm vươn lên từng ngày. Để rồi, khi ngoảnh lại, ta chợt nhận ra mình đã lãng quên đi mầm xanh ấy.<br/>
                    Với mong muốn nuôi dưỡng những mầm xanh quanh ta, GreenGarden ra đời.<br/>
                    Được thành lập vào tháng 4 năm 2025, GreenGarden là nền tảng thương mại điện tử chuyên về cây cảnh, hoa và dụng cụ làm vườn, mang đến giải pháp mua sắm trực tuyến tiện lợi, an toàn và giàu cảm xúc cho những ai yêu thiên nhiên.<br/>
                    Chúng tôi hợp tác cùng các nhà vườn uy tín, giàu kinh nghiệm để không chỉ mang đến những sản phẩm chất lượng mà còn giúp bạn nhận được những lời tư vấn chăm cây chuẩn xác, nhanh chóng và tận tâm nhất.
                  </span>
                </h1>
              </div>

              {/* Right Card */}
              <div className="w-[420px] h-full flex flex-col justify-center">
                <img
                  src={cayConImg}
                  alt="GreenGarden"
                  className="w-full object-cover rounded-lg shadow-lg transition-transform transition-shadow duration-500 hover:scale-105 hover:shadow-2xl animate-fadeInImg"
                  style={{ minHeight: 400, maxHeight: 600 }}
                />
              </div>
            </div>
          </div>

          {/* Pick of the Week Section */}
          <div className="mb-16 animate-slideUp">
            <div className="flex items-start gap-8 flex-col md:flex-row">
              {/* Left Video Card */}
              <div className="w-[420px] h-full flex flex-col justify-center">
                <img
                  src={cayConImg1}
                  alt="GreenGarden"
                  className="w-full object-cover rounded-lg shadow-lg transition-transform transition-shadow duration-500 hover:scale-105 hover:shadow-2xl animate-fadeInImg"
                  style={{ minHeight: 400, maxHeight: 600 }}
                />
              </div>

              {/* Right Content */}
              <div className="flex-1">

                <h2 className="text-3xl font-bold text-gray-900 mb-6 hover:text-green-600 transition-colors duration-300 font-sans">
                  GreenGarden — Đưa mầm xanh vào từng góc nhỏ của cuộc sống<br />
                </h2>
                <p className="text-gray-700 text-lg font-normal leading-relaxed mb-8 font-sans">
                  <span className="font-medium text-green-700">Sứ mệnh</span> <br />
                  GreenGarden mong muốn trở thành chiếc cầu nối giữa người yêu cây và nhà vườn uy tín, giúp không gian sống của mọi người thêm xanh mát, tràn đầy sức sống.<br />
                  <span className="font-medium text-green-700">Tầm nhìn</span><br />
                  Đến 2030, GreenGarden hướng tới trở thành sàn thương mại điện tử cây cảnh - hoa lớn nhất Việt Nam, lan tỏa tình yêu thiên nhiên đến mọi ngóc ngách.
                </p>
              </div>
            </div>
          </div>

          {/* Recipe Key */}
          
          {/* Recent Reader Favorites */}
          <section className="animate-slideUp relative overflow-x-visible">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center hover:text-green-600 transition-colors duration-300 font-sans">
              Giá trị cốt lõi
            </h2>
            {/* Gradient hai bên */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-32 z-10 pointer-events-none" style={{background: 'linear-gradient(to right, rgba(34,197,94,0.10), transparent)'}}></div>
            <div className="hidden md:block absolute right-0 top-0 h-full w-32 z-10 pointer-events-none" style={{background: 'linear-gradient(to left, rgba(34,197,94,0.10), transparent)'}}></div>
            <div className="space-y-8 relative z-20">
              {/* Hàng trên: 3 card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border border-green-200 rounded-lg p-8 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group font-sans animate-slideInLeft">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-white rounded-full mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 text-2xl">
                    <span className="text-gray-500">🌱</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg group-hover:text-green-600 transition-colors duration-300 font-sans">Đa dạng & Phong phú</h4>
                  <p className="text-base text-gray-500 group-hover:text-green-600 font-sans">cây trồng, hoa, chậu, phụ kiện từ những nhà vườn chất lượng.</p>
                </div>
                <div className="border border-green-200 rounded-lg p-8 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group font-sans animate-fadeIn">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-white rounded-full mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 text-2xl">
                    <span className="text-gray-500">🤝</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg group-hover:text-green-600 transition-colors duration-300 font-sans">Kết nối trực tiếp với người bán uy tín</h4>
                  <p className="text-base text-gray-500 group-hover:text-green-600 font-sans">Bạn được giao dịch trực tiếp, không qua trung gian, giá tốt – chất lượng đảm bảo.</p>
                </div>
                <div className="border border-green-200 rounded-lg p-8 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group font-sans animate-slideInRight">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-white rounded-full mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 text-2xl">
                    <span className="text-gray-500">🤖</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg group-hover:text-green-600 transition-colors duration-300 font-sans">AI hỗ trợ tư vấn & tìm kiếm</h4>
                  <p className="text-base text-gray-500 group-hover:text-green-600 font-sans">Chọn cây dễ dàng nhờ công cụ tìm cây theo ánh sáng, không gian, nhu cầu.</p>
                </div>
              </div>
              {/* Hàng dưới: 2 card căn giữa */}
              <div className="flex justify-center gap-8 flex-col md:flex-row">
                <div className="border border-green-200 rounded-lg p-8 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group font-sans animate-slideInLeft">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-white rounded-full mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 text-2xl">
                    <span className="text-gray-500">🚚</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg group-hover:text-green-600 transition-colors duration-300 font-sans">Giao hàng an toàn, bảo hành cây khỏe</h4>
                  <p className="text-base text-gray-500 group-hover:text-green-600 font-sans">Cây giao tận nơi, hỗ trợ đổi trả nếu cây hư hỏng do vận chuyển.</p>
                </div>
                <div className="border border-green-200 rounded-lg p-8 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group font-sans animate-slideInRight">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-white rounded-full mx-auto mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 text-2xl">
                    <span className="text-gray-500">🌿</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg group-hover:text-green-600 transition-colors duration-300 font-sans">Cộng đồng yêu cây</h4>
                  <p className="text-base text-gray-500 group-hover:text-green-600 font-sans">Chia sẻ, học hỏi bí quyết chăm cây từ hàng nghìn người dùng GreenGarden.</p>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-40px); }
                to { opacity: 1; transform: translateX(0); }
              }
              @keyframes slideInRight {
                from { opacity: 0; transform: translateX(40px); }
                to { opacity: 1; transform: translateX(0); }
              }
              .animate-slideInLeft {
                animation: slideInLeft 0.8s cubic-bezier(0.4,0,0.2,1) both;
              }
              .animate-slideInRight {
                animation: slideInRight 0.8s cubic-bezier(0.4,0,0.2,1) both;
              }
              @keyframes fadeInImg {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-fadeInImg {
                animation: fadeInImg 0.8s cubic-bezier(0.4,0,0.2,1) both;
              }
            `}</style>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.8s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default IntroductionSection;