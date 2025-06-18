import React, { useState, useEffect } from 'react';
import { Trash2, Edit, ChevronLeft, ChevronRight, RefreshCw, Plus } from 'lucide-react';
import ApiService from '../../services/ApiService';
import { Link, useNavigate } from 'react-router-dom';
// import EditBlogModal from './modal/EditBlogModal';
// import AddBlogModal from './AddBlogModal';

const BlogManagement = () => {
    // State cho dữ liệu blog
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage, setBlogsPerPage] = useState(5);
    const [totalBlogs, setTotalBlogs] = useState(0);
    
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    
    // Sorting state
    const [sortOption, setSortOption] = useState('');
    
    // Selected blogs for bulk actions
    const [selectedBlogs, setSelectedBlogs] = useState([]);

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    // Add modal state
    const [showAddModal, setShowAddModal] = useState(false);

    const navigate = useNavigate();

    // Fetch blogs from API
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await ApiService.get('/blog');
            setBlogs(response);
            setTotalBlogs(response.length);
            setLoading(false);
        } catch (error) {
            setError('Lỗi khi tải dữ liệu blog: ' + error.message);
            setLoading(false);
        }
    };

    // Handle checkbox selection
    const handleSelectBlog = (blogId) => {
        if (selectedBlogs.includes(blogId)) {
            setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
        } else {
            setSelectedBlogs([...selectedBlogs, blogId]);
        }
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedBlogs.length === currentBlogs.length) {
            setSelectedBlogs([]);
        } else {
            setSelectedBlogs(currentBlogs.map(blog => blog._id));
        }
    };

    // Handle pagination
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Handle sorting
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchBlogs();
        setSearchTerm('');
        setSortOption('');
        setCurrentPage(1);
    };

    // Handle add new blog
    const handleAddNew = () => {
        setShowAddModal(true);
    };

    // Handle add blog callback
    const handleAddBlog = (newBlog) => {
        setBlogs([...blogs, newBlog]);
    };

    // Handle edit blog
    const handleEditBlog = (blog) => {
        setEditingBlog(blog);
        setShowEditModal(true);
    };

    // Handle update blog
    const handleUpdateBlog = (updatedBlog) => {
        setBlogs(blogs.map(blog => 
            blog._id === updatedBlog._id ? updatedBlog : blog
        ));
    };

    // Handle delete blog
    const handleDeleteBlog = async (blogId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa blog này?')) {
            try {
                await ApiService.delete(`/blog/${blogId}`);
                setBlogs(blogs.filter(blog => blog._id !== blogId));
                setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
            } catch (error) {
                setError('Lỗi khi xóa blog: ' + error.message);
            }
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        if (selectedBlogs.length === 0) return;
        
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedBlogs.length} blog đã chọn?`)) {
            try {
                await Promise.all(selectedBlogs.map(blogId => 
                    ApiService.delete(`/blog/${blogId}`)
                ));
                setBlogs(blogs.filter(blog => !selectedBlogs.includes(blog._id)));
                setSelectedBlogs([]);
            } catch (error) {
                setError('Lỗi khi xóa blog: ' + error.message);
            }
        }
    };

    // Get filtered and sorted blogs
    const getFilteredAndSortedBlogs = () => {
        let result = [...blogs];
        
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(blog => {
                return (
                    blog.title.toLowerCase().includes(searchLower) ||
                    blog.content.toLowerCase().includes(searchLower) ||
                    blog.author.toLowerCase().includes(searchLower)
                );
            });
        }
        
        if (sortOption) {
            switch (sortOption) {
                case 'newest':
                    result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                    break;
                case 'oldest':
                    result.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
                    break;
                case 'title-asc':
                    result.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'title-desc':
                    result.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                default:
                    break;
            }
        }
        
        return result;
    };

    // Get filtered and sorted blogs
    const filteredAndSortedBlogs = getFilteredAndSortedBlogs();
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredAndSortedBlogs.length / blogsPerPage);

    // Paginate blogs
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredAndSortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="flex-1 bg-gray-50">
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center mt-4">
                    <div className="flex items-center mr-4 cursor-pointer" onClick={handleRefresh}>
                        <span className="text-gray-500 mr-2">Dữ liệu mới nhất</span>
                        <RefreshCw size={18} className="text-gray-500" />
                    </div>
                    <div className="text-gray-500">
                        {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')}
                    </div>
                </div>
            </div>

            {/* Function bar */}
            <div className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center">
                    <div className="text-gray-700 mr-2">Chức năng:</div>
                    <button 
                        className={`text-pink-500 ${selectedBlogs.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={handleBulkDelete}
                        disabled={selectedBlogs.length === 0}
                    >
                        Xóa ( {selectedBlogs.length} )
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="mr-4">
                        <select 
                            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value="">Sắp xếp theo</option>
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="title-asc">Tiêu đề A-Z</option>
                            <option value="title-desc">Tiêu đề Z-A</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="border border-gray-300 rounded-md px-3 py-2"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Blogs table */}
            <div className="px-6 pb-6">
                <div className="bg-white rounded-md shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-3 px-4 text-left">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={selectedBlogs.length === currentBlogs.length && currentBlogs.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Tiêu đề
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Tác giả
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Nội dung
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Cập nhật gần nhất
                                </th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentBlogs.length > 0 ? (
                                currentBlogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4"
                                                checked={selectedBlogs.includes(blog._id)}
                                                onChange={() => handleSelectBlog(blog._id)}
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{blog.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{blog.author}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">
                                            <div className="max-w-xs overflow-hidden text-ellipsis">
                                                {blog.content}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {blog.image ? (
                                                <img src={blog.image} alt={blog.title} className="h-12 w-12 object-cover" />
                                            ) : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{formatDate(blog.updated_at)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <button 
                                                    className="text-gray-500 hover:text-blue-600"
                                                    onClick={() => handleEditBlog(blog)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button 
                                                    className="text-gray-500 hover:text-red-600"
                                                    onClick={() => handleDeleteBlog(blog._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-4 px-6 text-center text-gray-500">
                                        Không có blog nào phù hợp với tìm kiếm
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center">
                                <button 
                                    className={`p-2 border border-gray-300 rounded-md mr-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                
                                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                    const pageNumber = currentPage <= 3 
                                        ? index + 1 
                                        : currentPage - 3 + index + 1;
                                    
                                    if (pageNumber <= totalPages) {
                                        return (
                                            <button 
                                                key={pageNumber}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                                    currentPage === pageNumber
                                                        ? 'bg-pink-500 text-white'
                                                        : 'text-gray-700'
                                                }`}
                                                onClick={() => goToPage(pageNumber)}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}
                                
                                <button 
                                    className={`p-2 border border-gray-300 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-700">
                                <span>Trang {currentPage} của {totalPages}</span>
                                <span className="mx-4">-</span>
                                <span>Hiển thị</span>
                                <select 
                                    className="mx-2 border border-gray-300 rounded p-1"
                                    value={blogsPerPage}
                                    onChange={(e) => {
                                        setBlogsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                                <span>/</span>
                                <span className="ml-2">{filteredAndSortedBlogs.length}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add New Blog Button */}
            <div className="fixed bottom-8 right-8">
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
                    onClick={handleAddNew}
                >
                    <Plus size={20} />
                    <span className="ml-2">Thêm mới</span>
                </button>
            </div>

            {/* Edit Blog Modal */}
            {/* {showEditModal && (
                <EditBlogModal 
                    blog={editingBlog}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingBlog(null);
                    }}
                    onUpdate={handleUpdateBlog}
                />
            )} */}

            {/* Add Blog Modal */}
            {/* {showAddModal && (
                <AddBlogModal 
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddBlog}
                />
            )} */}
        </div>
    );
};

export default BlogManagement;