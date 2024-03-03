import React, { createContext, useState, useEffect } from 'react';
import { fetchPosts } from '../utils/firebase/firebase.utils';

export const PostsContext = createContext({
  posts: [],
  loading: true,
  setPosts: () => {},
  addPost: () => {},
  updatePost: () => {},
});

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state as true

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

   // Function to update post information
  const updatePost = (postId, updatedFields) => {    
    setPosts(posts.map(post => {      
      if (post.id === postId) {        
        return { ...post, ...updatedFields };
      }
      return post;
    }));
  };

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false); // Set loading to false once posts are fetched (or if there's an error)
      }
    };
    fetchPostsData();
  }, []);

  const value = {
    posts,
    loading,
    setPosts,
    addPost,
    updatePost,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};
