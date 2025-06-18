import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ApiService from '../services/ApiService';
import BlogDetailModal from './BlogDetailModal'; // Import modal mới

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [selectedBlogId, setSelectedBlogId] = useState(null); // State cho modal

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await ApiService.get('/blog', false);
        setBlogs(response);
        setLoading(false);
      } catch (error) {
        setError('Lỗi khi tải dữ liệu blog: ' + error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Mở modal
  const openBlogModal = (blogId) => {
    setSelectedBlogId(blogId);
  };

  // Đóng modal
  const closeBlogModal = () => {
    setSelectedBlogId(null);
  };

  // Lọc blog
  const filteredBlogs = blogs.filter((blog) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      blog.title.toLowerCase().includes(searchLower) ||
      blog.content.toLowerCase().includes(searchLower)
    );
  });

  // Phân trang
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Rút gọn nội dung
  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Blog của chúng tôi</h1>
        <p className="text-gray-600 mt-2">
          Khám phá những bài viết thú vị về mọi chủ đề
        </p>
      </div>

      {/* Tìm kiếm */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm blog..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 pl-10"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Danh sách blog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => openBlogModal(blog._id)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
                  {blog.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {truncateContent(blog.content)}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {blog.author}</span>
                  <span>{formatDate(blog.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            Không tìm thấy blog nào phù hợp
          </div>
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded-full ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            }
            if (
              (page === currentPage - 2 && currentPage > 3) ||
              (page === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Modal chi tiết blog */}
      {selectedBlogId && (
        <BlogDetailModal blogId={selectedBlogId} onClose={closeBlogModal} />
      )}
    </div>
  );
};

export default BlogList;