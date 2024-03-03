import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/user.context';

import { Timestamp } from 'firebase/firestore';

import { fetchUser, deletePostComment } from '../../utils/firebase/firebase.utils'

import Button from '../button/button.component'

import './comments-list.styles.css'

import { formatDistanceToNow } from 'date-fns';

const CommentsList = ({ post, currentUser, comments, onCommentQuantity }) => {

  const [commentsList, setCommentsList] = useState([]);
  const { userData } = useContext(UserContext);  
 
  useEffect(() => {
    const fetchUsersnames = async () => {
      try {//throws the error until finishing the loop
        const updatedComments = comments ? await Promise.all(comments.map(async (comment) => {
          let hoursAgo = ''

          if (comment.createdAt instanceof Timestamp) {//created date comes empty when comment just created
            const date = comment.createdAt.toDate()           
            hoursAgo = (formatDistanceToNow(date)).replace('about', '') + ' ago'; 
          }      
          
          const user = await fetchUser(comment.userId);
          return { ...comment, displayName: user.displayName, hoursAgo: hoursAgo };
        })) : [];
        
        // Update the comments list after processing all comments
        setCommentsList(updatedComments);
      } catch (error) {
        console.log('Error fetching user names or formatting hours ago: ', error);
      }
    };
    
    fetchUsersnames();
  }, [comments, setCommentsList]); // Include setCommentsList in the dependency array


  // Check if comments is empty or not provided
  if (!comments || comments.length === 0) {
    return <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
      No comments yet.
    </div>;
  }

   const handleCommentDelete = async (commentId) => {
   // Filter out the comment with the given commenttId from the state
    deletePostComment(commentId)
    const updatedComments = commentsList.filter(comment => comment.id !== commentId);
    
    // Update the state with the updated posts
    setCommentsList(updatedComments);   
    onCommentQuantity(updatedComments)
  };
 
  return (
    <div className="comments-list-container">  
      <span id="title">Comments</span>    
      {commentsList.map((comment, i) => (
        <div className="comment" key={comment.id} >
          <div>
            <span>{comment.displayName}</span>
            <span className="comment-hours-ago">{comment.hoursAgo}</span>
            <p>{comment.comment}</p>
          </div>
          {currentUser && userData && userData.role === 'admin' && (
            <Button buttonType="deleteComment" onClick={() => handleCommentDelete(comment.id)}>x</Button>
          )}
        </div>
      ))}  
    </div>
  );
}

export default CommentsList;
