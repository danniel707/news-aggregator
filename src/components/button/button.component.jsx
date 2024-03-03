import './button.styles.css';

const BUTTON_TYPE_CLASSES = {
	google: 'google-sign-in',
	openModal: 'create-post-open-modal',
	createPost: 'create-post',
	sendComment: 'send-comment',
	deletePost: 'delete-post',
	deleteComment: 'delete-comment',
	inverted: 'inverted'
}

const Button = ({ children, buttonType, ...otherProps }) => {
	return (
		<button 
			className={`button-container ${BUTTON_TYPE_CLASSES[buttonType]}`}
			{...otherProps}			
		>
			{children}
		</button>
	);
};

export default Button;