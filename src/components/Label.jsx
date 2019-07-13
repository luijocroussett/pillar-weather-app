import React from 'react';

// Label components that takes in custome properties for styling and formatting

function Label({ text, size, color }) {
  const labelStyle = {
    color: color ? color : 'black',
    fontSize: size,
  };

  return (
    <div className="Label">
      <p style={labelStyle}> {text} </p>
    </div>
  );
}

export default Label;
