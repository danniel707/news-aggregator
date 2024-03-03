import React, { useState  } from 'react';

import Button from './button/button.component'

import FormInput from './form-input/form-input.component'

import { editPostDocument
} from '../utils/firebase/firebase.utils'


const EditPostModal = ({ post, onPostSave }) => {
  
  const [formFields, setFormFields] = useState(post);  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {               
       const updatedPost = await editPostDocument(formFields);      
       onPostSave(updatedPost); // Pass the new post to the parent component
      
    } catch (error){
      console.error('Error saving  post:', error);    
    }
  }

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormFields({...formFields, [name]: value})
  };

  return (
    <div className='create-post-container'>
      <h2>Edit Post</h2>      
      <form onSubmit={handleSubmit}>        
        <FormInput 
          label='Title'
          type='text' 
          required 
          onChange={handleChange} 
          name="title" 
          value={formFields.title}
        />     
        <FormInput 
          label='URL'
          type='text' 
          required 
          onChange={handleChange} 
          name="url" 
          value={formFields.url}
        />    
        <FormInput 
          label='Description'
          type='textarea' 
          required 
          onChange={handleChange} 
          name="description" 
          value={formFields.description}
        />      
        <Button buttonType="createPost" type="submit">Save</Button>
      </form>
    </div>
  )
}

export default EditPostModal;
