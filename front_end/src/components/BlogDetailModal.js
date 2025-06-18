import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ApiService from '../services/ApiService';

const BlogDetailModal = ({ blogId, onClose }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch blog chi tiết
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get(`/blog/${blogId}`, false);
        setBlog(response);
        setLoading(false);
      } catch (error) {
        setError('Lỗi khi tải blog: ' + error);
        setLoading(false);
      }
    };
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  // Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-800">Chi tiết blog</h3>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Nội dung */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : !blog ? (
          <div className="p-4 text-center text-gray-500">
            Blog không tồn tại
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hình ảnh */}
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}

            {/* Tiêu đề */}
            <h1 className="text-2xl font-bold text-gray-800">{blog.title}</h1>

            {/* Tác giả và ngày tạo */}
            {/* <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {blog.author}</span>
              <span>{formatDate(blog.created_at)}</span>
            </div> */}

            {/* Nội dung */}
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailModal;