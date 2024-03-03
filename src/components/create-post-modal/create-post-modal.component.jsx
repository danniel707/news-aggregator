import React, { useState  } from 'react';

import Button from '../button/button.component'

import FormInput from '../form-input/form-input.component'

import { createPostDocument
} from '../../utils/firebase/firebase.utils'

import './create-post-modal.styles.css'

const defaultFormFields = {
  title: '',
  url: '',
  description: '',
  createdAt: new Date(), 
  likes: 0, 
}

const CreatePostModal = ({ onPostCreate }) => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { title, url, likes, description, createdAt } = formFields;
  
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
       const newPostData = { title, url, description, createdAt, likes };        
       const newPost = await createPostDocument(newPostData);       
       
       onPostCreate(newPost); // Pass the new post to the parent component
       resetFormFields();   
    } catch (error){
      console.error('Error adding post:', error);    
    }
  }

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value})
  };

  return (
    <div className='create-post-container'>
      <h2>Create New Post</h2>      
      <form onSubmit={handleSubmit}>        
        <FormInput 
          label='Title'
          type='text' 
          required 
          onChange={handleChange} 
          name="title" 
          value={title}
        />     
        <FormInput 
          label='URL'
          type='text' 
          required 
          onChange={handleChange} 
          name="url" 
          value={url}
        />    
        <FormInput 
          label='Description'
          type='textarea' 
          required 
          onChange={handleChange} 
          name="description" 
          value={description}
        />      
        <Button buttonType="createPost" type="submit">Create</Button>
      </form>
    </div>
  )
}

export default CreatePostModal;
