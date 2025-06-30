import React from 'react';
import { X } from 'lucide-react';

const SimpleModal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-emerald-700">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Đóng">
            <X size={24} />
          </button>
        </div>
        <div className="prose max-w-none text-gray-700 whitespace-pre-line">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal; 