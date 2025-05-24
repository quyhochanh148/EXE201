import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ProductImages = ({ images, selectedImage, setSelectedImage, product }) => {
    return (
        <div className="md:w-full flex items-center justify-center bg-[#F6FFF6] rounded-xl shadow-lg p-6 border border-green-200">
            <img
                src={images[0]}
                alt={product.name || 'Product image'}
                className="w-full h-auto object-contain rounded-xl border-4 border-green-100 shadow-md bg-white"
            />
            {/* <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <Heart size={18} className="text-gray-600" />
            </button>
            <button className="absolute top-14 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <Share2 size={18} className="text-gray-600" />
            </button> */}
        </div>
    );
};

export default ProductImages;