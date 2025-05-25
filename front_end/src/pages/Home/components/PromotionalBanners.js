import React from 'react';
import clothesBanner from '../../../assets/Banner/318555050_133775472841455_1358442034130724765_n.jpg';
import phoneBanner from '../../../assets/Banner/318840065_133775412841461_1550456133701032360_n.jpg';
import clockBanner from '../../../assets/Banner/321928000_535011058576102_2859376662600392960_n.jpg';

const PromotionalBanners = () => {
    return (
        <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Clothes Banner */}
            <div className="bg-indigo-700 p-6 rounded-lg text-white relative overflow-hidden">
                <div className="z-10 relative">
                    <h3 className="text-2xl font-bold mb-1">Cây chậu</h3>
                    <p className="text-yellow-300 font-bold text-xl">Giảm 20% Sản phẩm</p>
                    <p className="text-sm mt-1">Miễn phí ships</p>
                </div>
                <img
                    src={clothesBanner}
                    alt="Game controller"
                    className="absolute right-0 bottom-0 w-full h-full z-0"
                />
            </div>

            {/* Phone Banner */}
            <div className="bg-teal-500 p-6 rounded-lg text-white relative overflow-hidden">
                <div className="z-10 relative">
                    <h3 className="text-2xl font-bold mb-1">Công cụ nhà vườn</h3>
                    <p className="text-yellow-300 font-bold text-xl">Bảo hành 3 tháng</p>
                    <p className="text-sm mt-1">Miễn phí ship toàn quốc</p>
                </div>
                <img
                    src={phoneBanner}
                    alt="Polaroid camera"
                    className="absolute right-0 bottom-0 w-full h-full z-0"
                />
            </div>

            {/* Clock Banner */}
            <div className="bg-red-500 p-6 rounded-lg text-white relative overflow-hidden">
                <div className="z-10 relative">
                    <h3 className="text-2xl font-bold mb-1">Đất trồng</h3>
                    <p className="text-yellow-300 font-bold text-xl">Chất lượng tốt cho cây trồng</p>
                    <p className="text-sm mt-1">Free shipping 20km Radius</p>
                </div>
                <img
                    src={clockBanner}
                    alt="Tablet computer"
                    className="absolute right-0 bottom-0 w-full h-full z-0"
                />
            </div>
        </div>
    );
};

export default PromotionalBanners;