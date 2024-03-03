import React, { useState, useEffect, useContext} from 'react';

import { PostsContext } from '../../contexts/posts.context';

import CreatePostModal from '../create-post-modal/create-post-modal.component';

import Button from '../button/button.component'
import Modal from 'react-modal';

import './create-post-button.styles.css'


const CreatePostButton = () => {
  
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState(null); // State to track the newly created post
  const { addPost } = useContext(PostsContext);

  const handlePostCreate = async (newPost) => {   
    try {
      
      // Update the posts state with the new post data
      setNewPost(newPost);//From here is the HTML variable        
      addPost(newPost);//Add the new post to Post context

      } catch (error) {
        console.error('Error fetching post document:', error);
      }
     
    // Close the modal after creating the post
    setIsCreatePostModalOpen(false);     
  };

  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };  

  useEffect(() => {
    // Clear newPost after 5 seconds
    const timer = setTimeout(() => {
      setNewPost(null);
    }, 5000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [newPost]);

  return (
    <div className="create-post-button">
      {
        newPost && (
          <div className="post-created-msg">
            <span>Post <span className="new-post-title">{newPost.title}</span> created</span>      
          </div>
      )}            
      <Button buttonType='openModal' onClick={openCreatePostModal}>Create Post</Button>                
      <Modal
        isOpen={isCreatePostModalOpen}
        onRequestClose={closeCreatePostModal}
        contentLabel="Create Post Modal"
      >
      <CreatePostModal onPostCreate={handlePostCreate} />
      </Modal>
    </div>
  )
}

export default CreatePostButton