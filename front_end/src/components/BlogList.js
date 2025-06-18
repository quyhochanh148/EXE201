import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Leaf, TreePine, Flower2 } from 'lucide-react';
import ApiService from '../services/ApiService';
import BlogDetailModal from './BlogDetailModal';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
          <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600 animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8 shadow-lg">
          <div className="text-red-600 text-center font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <TreePine className="absolute top-20 right-20 text-green-300/30 animate-bounce" size={64} />
        <Flower2 className="absolute bottom-20 left-20 text-pink-300/40 animate-pulse" size={48} />
        <Leaf className="absolute top-1/2 left-1/4 text-green-400/20 transform rotate-45 animate-spin" size={32} style={{animationDuration: '20s'}} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header với hiệu ứng gradient */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Leaf className="text-green-600 animate-pulse" size={32} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Khu Vườn Blog
            </h1>
            <TreePine className="text-emerald-600 animate-pulse delay-500" size={32} />
          </div>
          <p className="text-lg text-green-700/80 max-w-2xl mx-auto leading-relaxed">
            Khám phá những câu chuyện thú vị như những chiếc lá xanh tươi mới
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Tìm kiếm với hiệu ứng */}
        {/* <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md group">
            <input
              type="text"
              placeholder="Tìm kiếm trong khu vườn..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-green-200 rounded-full 
                       focus:outline-none focus:ring-4 focus:ring-green-300/50 focus:border-green-400 
                       pl-14 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/80
                       placeholder:text-green-600/60"
            />
            <Search
              size={20}
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-green-500 
                       group-hover:text-green-600 transition-colors duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div> */}

        {/* Danh sách blog với hiệu ứng card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog, index) => (
              <div
                key={blog._id}
                onClick={() => openBlogModal(blog._id)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden 
                         hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer
                         border border-green-100 hover:border-green-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {blog.image && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Leaf className="absolute top-4 right-4 text-white/70 opacity-0 group-hover:opacity-100 
                                   transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" size={20} />
                  </div>
                )}
                <div className="p-6 relative">
                  <h2 className="text-xl font-bold text-green-800 mb-3 group-hover:text-green-600 
                               transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-green-700/70 text-sm mb-4 leading-relaxed">
                    {truncateContent(blog.content)}
                  </p>
                  
                  {/* Decorative element */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 
                                transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full 
                                  flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <TreePine className="mx-auto text-green-300 mb-4" size={64} />
              <p className="text-green-600 text-lg font-medium">
                Không tìm thấy bài viết nào trong khu vườn này
              </p>
            </div>
          )}
        </div>

        {/* Phân trang với hiệu ứng */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-3">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                currentPage === 1
                  ? 'text-green-300 cursor-not-allowed bg-white/30'
                  : 'text-green-600 hover:bg-green-100/70 hover:scale-110 bg-white/50 shadow-md hover:shadow-lg'
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
                    className={`px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-110'
                        : 'text-green-600 hover:bg-green-100/70 bg-white/50 hover:scale-105 shadow-md'
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
                return (
                  <span key={page} className="px-3 text-green-400 font-bold">
                    ⋯
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                currentPage === totalPages
                  ? 'text-green-300 cursor-not-allowed bg-white/30'
                  : 'text-green-600 hover:bg-green-100/70 hover:scale-110 bg-white/50 shadow-md hover:shadow-lg'
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

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlogList;