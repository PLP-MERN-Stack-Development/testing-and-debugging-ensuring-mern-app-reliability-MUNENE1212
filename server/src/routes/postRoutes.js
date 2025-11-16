// Post Routes
const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} = require('../controllers/postController');
const { protect, isOwner } = require('../middleware/auth');
const {
  validatePost,
  validateObjectId,
  validatePagination,
} = require('../middleware/validation');

// Public routes
router.get('/', validatePagination, getAllPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', protect, isOwner('author'), validatePost, createPost);
router.put('/:id', protect, validateObjectId, validatePost, updatePost);
router.delete('/:id', protect, validateObjectId, deletePost);
router.post('/:id/like', protect, validateObjectId, likePost);

module.exports = router;
