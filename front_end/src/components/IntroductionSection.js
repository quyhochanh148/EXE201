import React from 'react';
import { Link } from 'react-router-dom';
import image1 from '../assets/ImageSliderDetail/1684222267_Bia-WEB-1.jpg';
const IntroductionSection = () => {
    return (
        <div className="bg-white py-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-center mb-4">
                    <h2 className="text-lg font-bold text-red-500">Giới thiệu</h2>
                </div>
                <div className="bg-red-500 h-[4px] my-2"></div>
                <div className="text-gray-800">
                    <p className="mb-4 font-bold">Giới thiệu về GreenGarden</p>
                    <p className="mb-4">
                        Được thành lập vào ngày , <strong>GreenGarden</strong> là nền tảng thương mại điện tử chuyên biệt về cây cảnh, mang đến giải pháp mua sắm trực tuyến tiện lợi và đa dạng cho những người yêu thiên nhiên
                    </p>
                    <p className="mb-4">
                        Với trụ sở chính tại , <strong>GreenGarden</strong> cung cấp hàng nghìn sản phẩm cây cảnh, chậu cây và phụ kiện chăm sóc cây từ các nhà cung cấp uy tín trong và ngoài nước. Nền tảng của chúng tôi kết nối khách hàng với các nhà vườn chuyên nghiệp, đảm bảo chất lượng sản phẩm và dịch vụ tốt nhất. Đội ngũ hỗ trợ khách hàng được đào tạo bài bản, luôn sẵn sàng tư vấn và giải đáp mọi thắc mắc, giúp bạn dễ dàng chọn được cây cảnh phù hợp với không gian sống.
                    </p>
                    <div className="my-4">
                        <img
                            src={image1}
                            alt="GreenGarden - Cây cảnh"
                            className="w-full max-w-3xl mx-auto h-auto rounded-lg"
                        />
                    </div>
                    <p className="mb-4 font-bold">Sản phẩm và dịch vụ</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>Cây cảnh nội thất, cây cảnh văn phòng, cây cảnh phong thủy.</li>
                        <li>Chậu cây cao cấp, chậu sứ, chậu composite và chậu tự tưới.</li>
                        <li>Phụ kiện chăm sóc cây: phân bón, đất trồng, dụng cụ làm vườn.</li>
                        <li>Dịch vụ tư vấn thiết kế không gian xanh và chăm sóc cây cảnh.</li>
                        <li>Gói quà tặng cây cảnh cho các dịp đặc biệt.</li>
                    </ul>
                    <p className="mb-4 font-bold">Tầm nhìn:</p>
                    <p className="mb-4">
                        Trở thành nền tảng TMĐT đầu tiên về cây cảnh tại Việt Nam, mang thiên nhiên đến mọi ngôi nhà.<br />
                        Xây dựng cộng đồng yêu cây cảnh, chia sẻ kiến thức và kinh nghiệm chăm sóc cây.<br />
                        Mở rộng mạng lưới nhà cung cấp và dịch vụ giao hàng nhanh chóng trên toàn quốc.
                    </p>
                    <p className="mb-4 font-bold">Liên hệ</p>
                    <p className="mb-4">
                        <strong>Trụ sở chính:</strong><br />
                        <br />
                        Điện thoại:<br />
                        Email: 
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntroductionSection;