import React from 'react';
import './numberInput.css';

const NumberInput = ({ title, value, onChange }) => {
  return (
    <div className="number-input-container">
      {title && <h4 className="number-input-title">{title}</h4>}
      <input
        type="number"
        className="number-input"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default NumberInput;
