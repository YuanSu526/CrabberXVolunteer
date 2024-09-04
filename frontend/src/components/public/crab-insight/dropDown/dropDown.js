import React from 'react';
import './dropDown.css';

const Dropdown = ({ options, title, onChange }) => {
  return (
    <div className="dropdown-container">
      {title && <h4 className="dropdown-title">{title}</h4>}
      <select className="dropdown" onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
