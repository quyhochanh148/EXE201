const Blog = require('../models/blog');
const { uploadProductImage, removeFile } = require('../services/upload.service');

// Middleware to handle file upload for blog
const handleBlogImageUpload = (req, res, next) => {
    uploadProductImage(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                message: "Tải lên hình ảnh thất bại",
                error: err.message
            });
        }
        // File đã được tải lên thành công, tiếp tục
        next();
    });
};

// Lấy tất cả blog
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy blog theo ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm blog mới
const createBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Sử dụng URL Cloudinary từ request.file.path
        const image = req.file ? req.file.path : null;

        // Kiểm tra các trường bắt buộc
        if (!title || !content || !author) {
            if (image) removeFile(image);
            return res.status(400).json({ message: "Title, content, and author are required" });
        }

        // Tạo blog mới
        const newBlog = new Blog({
            title,
            content,
            author,
            image, // Lưu URL Cloudinary
            created_at: Date.now(),
            updated_at: Date.now(),
            created_by: req.userId || null,
            updated_by: req.userId || null
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        // Nếu có lỗi, xóa file đã upload
        if (req.file) {
            removeFile(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật blog
const updateBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        // Lấy image từ file upload nếu tồn tại (URL Cloudinary)
        const newImage = req.file ? req.file.path : null;

        // Lấy thông tin blog hiện tại
        const currentBlog = await Blog.findById(req.params.id);
        if (!currentBlog) {
            if (newImage) removeFile(newImage);
            return res.status(404).json({ message: "Blog not found" });
        }

        // Nếu có image mới, xóa image cũ trên Cloudinary
        if (newImage && currentBlog.image) {
            await removeFile(currentBlog.image);
        }

        // Cập nhật blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(author && { author }),
                ...(newImage && { image: newImage }), // Cập nhật URL image từ Cloudinary
                updated_at: Date.now(),
                ...(req.userId && { updated_by: req.userId })
            },
            { new: true }
        );

        if (!updatedBlog) {
            if (newImage) removeFile(newImage);
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        // Nếu có lỗi, xóa bất kỳ file đã upload
        if (req.file) {
            removeFile(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// Xóa blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Xóa file image từ Cloudinary nếu tồn tại
        if (blog.image) {
            await removeFile(blog.image);
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle blog status (active/inactive)
const toggleBlogStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        if (is_active === undefined) {
            return res.status(400).json({ message: "is_active status is required" });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Cập nhật trạng thái is_active
        blog.is_active = is_active;
        blog.updated_at = Date.now();
        if (req.userId) {
            blog.updated_by = req.userId;
        }

        await blog.save();

        res.status(200).json({
            message: `Blog status updated to ${is_active ? 'active' : 'inactive'}`,
            blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const blogController = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleBlogStatus,
    handleBlogImageUpload // Export middleware cho routes
};

module.exports = blogController;