import './form-input.styles.css'

const FormInput = ({ label, type, ...otherProps }) => {
  if (type === 'textarea') {
    return (
      <div className="form">
        <label className="form-labels">{label}</label>
        <textarea className="form-fields textarea" {...otherProps} />
      </div>
    );
  }

  return (
    <div className="form">
      <label className="form-labels">{label}</label>
      <input className="form-fields" type={type} {...otherProps} />
    </div>
  );
};

export default FormInput;

//...otherProps
// <input 
// 	type='text' 
// 	required 
// 	onChange={changeHandler} 
// 	name="displayName" 
// 	value={displayName}
// />
