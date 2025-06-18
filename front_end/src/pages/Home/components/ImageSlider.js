import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [currentIndex]);

    const startTimer = () => {
        stopTimer();
        timerRef.current = setTimeout(() => {
            nextSlide();
        }, 4000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToSlide = (index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    return (
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px] overflow-hidden group border-2 border-green-500 rounded-lg shadow-md hover:shadow-green-400/50 animate-glowGreen">
            <div
                className="flex w-full h-full transition-all duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="w-full min-w-full h-full flex-shrink-0 relative animate-fadeZoomIn"
                        style={{ animationDelay: `${index * 500}ms` }}
                    >
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110 hover:rotate-2"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-green-600/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-10 left-2 sm:left-4 md:left-6 lg:left-8 xl:left-10 bg-green-700 bg-opacity-70 text-white p-2 sm:p-3 md:p-4 rounded-lg max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg animate-fadeIn border border-green-500">
                            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-1 sm:mb-2 leading-tight">{product.title}</h3>
                            <ul className="list-disc list-inside text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                                {product.descriptions.map((desc, descIndex) => (
                                    <li key={descIndex} className="leading-tight">{desc}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-1.5 sm:p-2 md:p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                onClick={prevSlide}
                aria-label="Chuyển đến slide trước"
            >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-1.5 sm:p-2 md:p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                onClick={nextSlide}
                aria-label="Chuyển đến slide tiếp theo"
            >
                <ChevronRight size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-1.5 md:space-x-2">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                            currentIndex === index ? 'bg-green-600 scale-125 animate-pulse' : 'bg-green-300 hover:scale-110'
                        }`}
                        aria-label={`Chuyển đến slide ${index + 1}`}
                    />
                ))}
            </div>
            <style>{`
                @keyframes glowGreen {
                    0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
                    50% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); }
                }
                .animate-glowGreen {
                    animation: glowGreen 2s ease-in-out infinite;
                }
                @keyframes fadeZoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeZoomIn {
                    animation: fadeZoomIn 0.7s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .animate-pulse {
                    animation: pulse 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default ImageSlider;