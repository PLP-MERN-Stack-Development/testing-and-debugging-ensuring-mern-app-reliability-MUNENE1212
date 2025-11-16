// Custom hook for managing posts
import { useState, useEffect } from 'react';

const usePosts = (initialPage = 1, initialLimit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    pages: 0,
  });

  const fetchPosts = async (page = pagination.page, limit = pagination.limit, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await fetch(`/api/posts?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch posts');
      }

      setPosts(data.posts);
      setPagination(data.pagination);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData, token) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      // Add new post to the list
      setPosts((prevPosts) => [data, ...prevPosts]);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, updates, token) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }

      // Update post in the list
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? data : post))
      );

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId, token) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }

      // Remove post from the list
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};

export default usePosts;
