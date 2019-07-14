import React from 'react';

// Input component that takes in custome properties for styling and formatting

function Input({ text, type, size, handleChange }) {
  const inputStyle = {
    borderRadius: '5px',
    height: '30px',
    width: '180px',
    fontSize: size,
    border: '1px solid gray',
    paddingLeft: '10px',
  };

  return (
    <div className="Input">
      <input
        style={inputStyle}
        type={type}
        value={text}
        onChange={handleChange}
        onFocus={event =>
          (event.target.value =
            event.target.value === 'Enter city or Zip'
              ? ''
              : event.target.value)
        }
        onBlur={event => {
          event.target.value =
            event.target.value === ''
              ? 'Enter city or Zip'
              : event.target.value;
        }}
      />
    </div>
  );
}

export default Input;
