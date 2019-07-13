import React from 'react';

function Button({ text, enabled, handleClick }) {
  const buttonStyle = {
    backgroundColor: 'black',
    opacity: enabled ? '1' : '0.3',
    color: 'white',
    borderRadius: '5px',
    height: '30px',
    width: '190px',
    fontWeight: 'bold',
  };
  return (
    <p className="Button">
      <button style={buttonStyle} onClick={handleClick}>
        {text}
      </button>
    </p>
  );
}

export default Button;
