import React, { useState, useContext, useEffect  } from 'react';

import {UserContext} from '../../contexts/user.context';

import { saveComment, fetchComments } from '../../utils/firebase/firebase.utils'

import Button from '../button/button.component'
import CommentsList from '../comments-list/comments-list.component'

import FormInput from '../form-input/form-input.component'

import './comments-modal.styles.css'

const defaultFormFields = {
	newComment: '',
	createdAt: new Date(),   
}

const CommentsModal = ({ post, onCommentsQuantity }) => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { newComment, createdAt } = formFields;
  const {currentUser} = useContext(UserContext)  
  const [ comments, setComments ] = useState([]);

  useEffect(() => {
    const fetchCommentsData = async () => {
      const commentsData = post.id ? await fetchComments(post.id) : [];      
      setComments(commentsData);
    };
    fetchCommentsData();
  }, [post.id]);
  
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleClick = async () => {
    if (!currentUser) {
      alert('Please log in to leave a comment.'); // Display a message if user is not logged in
      return;
    }   
  }
 
  const handleSubmit = async (event) => {
    event.preventDefault();
   
    try {
       const fields = { userId: currentUser.uid, postId: post.id, comment: newComment, createdAt };           
       const newPostCommentRef = await saveComment(fields);       
  	   // Update comments state with the newly added comment
       setComments([ { id: newPostCommentRef.id, ...fields }, ...comments ]);
  	   onCommentsQuantity(comments)
       resetFormFields();
    } catch (error){
      console.error('Error adding post:', error);    
    }
  }

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value})
  };

  const handleCommentsQuantity = (updatedComments) => {
    onCommentsQuantity(updatedComments)
    setComments(updatedComments)
  }

  return (
    <div className='comments-modal'>
      <h2>{post.title}</h2>      
      <form onSubmit={handleSubmit}>        
        <FormInput 
          label=''
          type='textarea' 
          required 
          onClick={handleClick} 
          placeholder='Write a comment...'
          onChange={handleChange} 
          name="newComment" 
          value={newComment}
        />     
        <div className="comment-button-container"> 
        	{currentUser ? (
            <Button buttonType="sendComment" type="submit">Comment</Button>
          ) : (
            <Button buttonType="sendComment" type="submit" disabled>Comment</Button>
          )}      	</div>
      </form>
      	<CommentsList 
          post={post} 
          currentUser={currentUser} 
          comments={comments}
          onCommentQuantity={handleCommentsQuantity}         
          />
      
    </div>
  )
}

export default CommentsModal;
