import React from 'react';
import clothesBanner from '../../../assets/Banner/318555050_133775472841455_1358442034130724765_n.jpg';
import phoneBanner from '../../../assets/Banner/318840065_133775412841461_1550456133701032360_n.jpg';
import clockBanner from '../../../assets/Banner/321928000_535011058576102_2859376662600392960_n.jpg';

const PromotionalBanners = () => {
    return (
        <div className="grid grid-cols-3 gap-4 mt-8 px-4 animate-fadeIn">
            <div className="bg-green-600 p-6 rounded-lg text-white relative overflow-hidden h-48 animate-wave border-2  hover:shadow-green-400/50">
                <div className="z-10 relative animate-fadeIn">
                    <h3 className="text-xl font-bold mb-1">Cây Chậu</h3>
                    <p className="text-yellow-300 font-bold text-lg">Giảm 20%</p>
                    <p className="text-sm mt-1">Miễn phí vận chuyển</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-green-700/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <img
                    src={clothesBanner}
                    alt="Cây chậu"
                    className="absolute right-0 bottom-0 w-2/3 h-full object-cover opacity-80 transition-transform duration-500 ease-out hover:scale-110 hover:rotate-2"
                />
            </div>
            <div className="bg-teal-500 p-6 rounded-lg text-white relative overflow-hidden h-48 animate-wave animation-delay-200 border-2  hover:shadow-green-400/50">
                <div className="z-10 relative animate-fadeIn">
                    <h3 className="text-xl font-bold mb-1">Công Cụ Làm Vườn</h3>
                    <p className="text-yellow-300 font-bold text-lg">Bảo hành 6 tháng</p>
                    <p className="text-sm mt-1">Miễn phí giao hàng</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-green-700/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <img
                    src={phoneBanner}
                    alt="Công cụ làm vườn"
                    className="absolute right-0 bottom-0 w-2/3 h-full object-cover opacity-80 transition-transform duration-500 ease-out hover:scale-110 hover:rotate-2"
                />
            </div>
            <div className="bg-orange-500 p-6 rounded-lg text-white relative overflow-hidden h-48 animate-wave animation-delay-400 border-2  hover:shadow-green-400/50">
                <div className="z-10 relative animate-fadeIn">
                    <h3 className="text-xl font-bold mb-1">Đất Trồng</h3>
                    <p className="text-yellow-300 font-bold text-lg">Chất lượng cao</p>
                    <p className="text-sm mt-1">Giao hàng tận nơi</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-green-700/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <img
                    src={clockBanner}
                    alt="Đất trồng"
                    className="absolute right-0 bottom-0 w-2/3 h-full object-cover opacity-80 transition-transform duration-500 ease-out hover:scale-110 hover:rotate-2"
                />
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes wave {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-wave {
                    animation: wave 3s ease-in-out infinite;
                }
                .animation-delay-200 { animation-delay: 200ms; }
                .animation-delay-400 { animation-delay: 400ms; }
            `}</style>
        </div>
    );
};

export default PromotionalBanners;