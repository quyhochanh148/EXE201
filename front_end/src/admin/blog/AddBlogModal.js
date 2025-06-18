import React, { useState } from 'react';
import { X } from 'lucide-react';
import ApiService from '../../services/ApiService';

const AddBlogModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        image: null
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle text input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file
        });
        
        if (formErrors.image) {
            setFormErrors({
                ...formErrors,
                image: ''
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        const errors = {};
        if (!formData.title) errors.title = 'Tiêu đề là bắt buộc';
        if (!formData.content) errors.content = 'Nội dung là bắt buộc';
        if (!formData.author) errors.author = 'Tác giả là bắt buộc';
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        try {
            setLoading(true);
            
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('author', formData.author);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            // Send POST request with FormData
            const newBlog = await ApiService.postFormData('/api/blog', formDataToSend);
            
            // Call onAdd callback with new blog
            if (onAdd) {
                onAdd(newBlog);
            }
            
            // Close modal
            onClose();
        } catch (error) {
            setFormErrors({
                submit: 'Lỗi khi tạo blog: ' + error
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-medium">Thêm blog mới</h3>
                    <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {formErrors.submit && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {formErrors.submit}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {/* Tiêu đề */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            />
                            {formErrors.title && (
                                <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                            )}
                        </div>
                        
                        {/* Tác giả */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tác giả <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author || ''}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${formErrors.author ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            />
                            {formErrors.author && (
                                <p className="mt-1 text-sm text-red-500">{formErrors.author}</p>
                            )}
                        </div>
                        
                        {/* Nội dung */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content || ''}
                                onChange={handleInputChange}
                                rows={6}
                                className={`w-full px-3 py-2 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            />
                            {formErrors.content && (
                                <p className="mt-1 text-sm text-red-500">{formErrors.content}</p>
                            )}
                        </div>
                        
                        {/* Hình ảnh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {formErrors.image && (
                                <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-5 border-t">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Tạo blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlogModal;