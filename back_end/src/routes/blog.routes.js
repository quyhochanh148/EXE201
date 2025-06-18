const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  handleBlogImageUpload
} = require('../controller/blogcontroller');

router.post('/', handleBlogImageUpload, createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id', handleBlogImageUpload, updateBlog);
router.delete('/:id', deleteBlog);
router.put('/:id/status', toggleBlogStatus);

module.exports = router;