import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  // Tự động chuyển slide
  useEffect(() => {
    startTimer();
    
    return () => {
      stopTimer();
    };
  }, [currentIndex]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);
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
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="relative w-screen h-full overflow-hidden group" style={{ zIndex: -1000 }}>
      {/* Slider images */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {products.map((product, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0 relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-screen h-full object-cover"
            />
            <div className="absolute bottom-8 left-24 bg-black bg-opacity-50 text-white p-3 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-1">{product.title}</h3>
              <ul className="list-disc list-inside text-base space-y-1">
                {product.descriptions.map((desc, descIndex) => (
                  <li key={descIndex}>{desc}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={prevSlide}
        aria-label="Chuyển đến slide trước"
      >
        <ChevronLeft size={24} className="text-gray-800" />
      </button>
      
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={nextSlide}
        aria-label="Chuyển đến slide tiếp theo"
      >
        <ChevronRight size={24} className="text-gray-800" />
      </button>

      {/* Chấm tròn điều hướng */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
            } transition-all duration-300`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;