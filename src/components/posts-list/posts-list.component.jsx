import React, { useState, useContext } from 'react';

import { PostsContext } from '../../contexts/posts.context';

import Post from '../post/post.component';
import Spinner from '../spinner/spinner.component'

import './posts-list.styles.css'


const PostsList = () => {

  const { posts, setPosts, loading } = useContext(PostsContext);  
  const postsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  
   // Check if posts are loading
  if (loading) {
    return <Spinner />; // Display spinner while loading
  }

  // Check if posts is empty or not provided
  if (!posts || posts.length === 0) {
    return <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
      No posts available.
    </div>;
  }

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  const handlePageChange = (newPage) => {
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    setCurrentPage(newPage);                    
  };    
 
  const handlePostDelete = async (postId) => {
   // Filter out the post with the given postId from the state
    const updatedPosts = posts.filter(post => post.id !== postId);
    
    // Update the state with the updated posts
    setPosts(updatedPosts);
  };

  return (
    <div className="posts-list-column">      
      {currentPosts.map((post, i) => (
        <Post key={i} post={post} onPostDelete={handlePostDelete} />
      ))}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostsList;
