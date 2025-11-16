// Post Controller
const Post = require('../models/Post');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all posts with pagination and filtering
 * GET /api/posts
 */
const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, status, author } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (author) filter.author = author;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Query posts
    const posts = await Post.find(filter)
      .populate('author', 'username email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Post.countDocuments(filter);

    res.status(200).json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single post by ID or slug
 * GET /api/posts/:id
 */
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let post = await Post.findById(id)
      .populate('author', 'username email')
      .populate('category', 'name slug');

    if (!post) {
      post = await Post.findOne({ slug: id })
        .populate('author', 'username email')
        .populate('category', 'name slug');
    }

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new post
 * POST /api/posts
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, status } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      tags,
      status,
      author: req.user._id,
    });

    await post.populate('author', 'username email');
    await post.populate('category', 'name slug');

    logger.info(`New post created: ${post.title} by ${req.user.username}`);

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Update post
 * PUT /api/posts/:id
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, status } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to update this post', 403));
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (status) post.status = status;

    await post.save();
    await post.populate('author', 'username email');
    await post.populate('category', 'name slug');

    logger.info(`Post updated: ${post.title} by ${req.user.username}`);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete post
 * DELETE /api/posts/:id
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('You are not authorized to delete this post', 403));
    }

    await post.deleteOne();

    logger.info(`Post deleted: ${post.title} by ${req.user.username}`);

    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Like/unlike a post
 * POST /api/posts/:id/like
 */
const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if user already liked the post
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      likes: post.likes.length,
      liked: likeIndex === -1,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
