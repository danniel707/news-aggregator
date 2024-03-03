import React, { useState, useContext } from 'react';

import { UserContext } from '../../contexts/user.context';
import { PostsContext } from '../../contexts/posts.context';

import PostComments from '../post-comments/post-comments.component'
import EditPostModal from '../edit-post-modal.component';
import Button from '../button/button.component'
import LikeButton from '../like-button/like-button.component';

import { deletePost } from '../../utils/firebase/firebase.utils'

import Modal from 'react-modal';

import './post.styles.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, onPostDelete }) => {
  
	const { currentUser, userData } = useContext(UserContext);	
	const { updatePost } = useContext(PostsContext);
	
	const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);

	const openEditPostModal = () => {
    	setIsEditPostModalOpen(true);
  	};

  	const closeEditPostModal = () => {
    	setIsEditPostModalOpen(false);
  	};

  	const handlePostEdit = (updatedPost) => {
  		updatePost(post.id, updatedPost);
  		setIsEditPostModalOpen(false);  	
  	}

	const handleDelete = async () => {
		const confirmDelete = window.confirm('Are you sure you want to delete this post?');

	    if (confirmDelete) {
	        try {
	            await deletePost(post.id);
	            onPostDelete(post.id);
	        } catch (error) {
	            console.error('Error deleting post:', error);
	        }
	    }
	}

	const webSite = post.url ? post.url.split('https://').pop().split('/')[0] : '';
	const webSource = webSite ? webSite.replace('www.', '') : '';
	const date = post.createdAt		
	const hoursAgo = (formatDistanceToNow(date.toDate())).replace('about', '') + ' ago'

	return (
		<div className="post-container">			
			<div className="post-content">
				<a href={`${post.url}`} target="_blank" rel="noopener noreferrer">			
					<div  className="post-title">
						<span>{post.title}</span>
					</div>
				</a>
				<div className="post-source">
					<img src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${webSite}&size=16`} alt={webSite} />
						<span>{webSource}</span>	
					</div>
				<div className="post-description">
					<p>{post.description}</p>
				</div>
				<div className="post-bottom-container">	
					<div className="hours-ago">
						<span>{hoursAgo} </span>
					</div>		
					<div className="post-bottom-right-side">									
						<LikeButton post={post}/>
						<PostComments post={post}/>						
					</div>					
				</div>		
			</div>
			{currentUser && userData && userData.role === 'admin' && (
				<div className="post-tools">												
					<button className="edit-post-button"						
						onClick={openEditPostModal}
					>         		
		        	<FontAwesomeIcon icon={faEdit} />
		      		</button>
		      		<Modal
				        isOpen={isEditPostModalOpen}
				        onRequestClose={closeEditPostModal}
				        contentLabel="Edit Post Modal"
		      		>
		      		<EditPostModal post={post} onPostSave={handlePostEdit} />		      		     		
		      		</Modal>
		      		<div className="delete-post-button-container">
						<Button buttonType='deletePost' onClick={handleDelete}>X</Button>
					</div>	
			      </div>		      	
			)}
		</div>
	)
}

export default Post;