import React, { useState, useEffect } from 'react';
import './BlogPosts.css';

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
        setLoadingPosts(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch posts. Please try again.');
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch comments when a post is selected
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedPost) return;
      
      try {
        setLoadingComments(true);
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${selectedPost.id}/comments`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        
        const data = await response.json();
        setComments(data);
        setLoadingComments(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch comments. Please try again.');
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [selectedPost]);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
    // Scroll to comments section
    setTimeout(() => {
      const commentsSection = document.querySelector('.comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBackToPosts = () => {
    setSelectedPost(null);
    setComments([]);
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <header className="blog-header">
        <h1>Blog Posts</h1>
        <p>Discover interesting articles and join the conversation</p>
      </header>

      {selectedPost ? (
        <div className="post-detail">
          <button onClick={handleBackToPosts} className="back-btn">
            ← Back to All Posts
          </button>
          
          <article className="post-full">
            <h2 className="post-title">{selectedPost.title}</h2>
            <p className="post-body">{selectedPost.body}</p>
            <div className="post-meta">
              <span className="post-id">Post #{selectedPost.id}</span>
              <span className="post-user">By User #{selectedPost.userId}</span>
            </div>
          </article>

          <section className="comments-section">
            <h3>
              Comments 
              <span className="comments-count">({comments.length})</span>
            </h3>
            
            {loadingComments ? (
              <div className="comments-loading">
                <div className="spinner small"></div>
                <p>Loading comments...</p>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div className="comment-avatar">
                        {comment.name.charAt(0)}
                      </div>
                      <div className="comment-author">
                        <h4>{comment.name}</h4>
                        <p className="comment-email">{comment.email}</p>
                      </div>
                    </div>
                    <p className="comment-body">{comment.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="posts-container">
          {loadingPosts ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading posts...</p>
            </div>
          ) : (
            <>
              <div className="posts-stats">
                <p>Showing {posts.length} posts</p>
              </div>
              
              <div className="posts-grid">
                {posts.map(post => (
                  <article key={post.id} className="post-card">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">
                      {post.body.length > 100 
                        ? `${post.body.substring(0, 100)}...` 
                        : post.body
                      }
                    </p>
                    <div className="post-footer">
                      <span className="post-user">User #{post.userId}</span>
                      <button 
                        onClick={() => handlePostSelect(post)}
                        className="read-more-btn"
                      >
                        Read More →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogPosts;