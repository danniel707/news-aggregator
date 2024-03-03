import SignUpForm from '../../components/sign-up-form/sign-up-form.component';
import SignInForm from '../../components/sign-in-form/sign-in-form.component';
import Footer from '../../components/footer/footer.component';

import './authentication.styles.css'

const Authentication = () => {
	
	return (
		<div>
			<div className='authentication-container'>			
				<SignInForm />
				<SignUpForm />				
			</div>
			<Footer /> 
		</div>
	)
}

export default Authentication;