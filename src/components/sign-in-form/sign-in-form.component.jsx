import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormInput from '../form-input/form-input.component'
import Button from '../button/button.component';

import './sign-in-form.styles.css'

import { 
	signInWithGooglePopup, 	
	signInAuthUserWithEmailAndPassword
} from '../../utils/firebase/firebase.utils'

const defaultFormFields = {	
	email: '',
	password: '',
}

const SignInForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { email, password } = formFields;

	const navigate = useNavigate(); // Initialize useHistory hook

	const resetFormFields = () => {
		setFormFields(defaultFormFields);
	}

	const signInWithGoogle = async () => {
		try {
			await signInWithGooglePopup();		
			// Redirect to the desired page after successful sign-in
			navigate('/');	
			
		} catch (error) {
			switch (error.code) {
				case 'auth/popup-closed-by-user':
					
					break;
				default:
					console.log(error);
			}
		}		
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const {user} = await signInAuthUserWithEmailAndPassword(
				email, 
				password
			);
			
			resetFormFields();
			// Redirect to the desired page after successful sign-in
			navigate('/');

		} catch (error){
			switch (error.code) {
				case 'auth/invalid-credential':
					alert("Incorrect password or email")
					break;				
				default:
					console.log(error);
			}			
		}
	}

	const handleChange = (event) => {
		const {name, value} = event.target;

		setFormFields({...formFields, [name]: value})
	};

	return (
		<div className='sign-up-container'>
			<h2>Already have an account?</h2>
			<span>Sign in with email and password or Google account</span>
			<form onSubmit={handleSubmit}>							
				<FormInput 
					label='Email'
					type='email' 
					required 
					onChange={handleChange} 
					name="email" 
					value={email}
				/>
			
				<FormInput 
					label='Password'
					type='password'
					required 
					onChange={handleChange} 
					name="password" 
					value={password}
				/>
				<div className="buttons-container">
					<Button type="submit">Sign In</Button>
					<Button type='button' buttonType="google" onClick={signInWithGoogle}>Google Sign In</Button>				
				</div>
			</form>
		</div>
	)
}

export default SignInForm;