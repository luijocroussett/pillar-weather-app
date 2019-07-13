import React from 'react';

function Select({ text, size, width, options, handleChange, defaultText }) {
  const selectStyle = {
    borderRadius: '5px',
    height: '30px',
    width,
    paddingLeft: '10px',
    backgroundColor: 'white',
    fontSize: size,
  };

  return (
    <div className="select">
      <select onChange={handleChange} value={text} style={selectStyle}>
        {options.map((option, index) => (
          <option key={'option' + index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
