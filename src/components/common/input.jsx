import React from "react";

const Input = ({ name, label, error, bsClass, value, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input {...rest} id={name} name={name} className={bsClass} value={value} />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
