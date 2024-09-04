import React, { useState } from 'react';
import './menuBar.css';
import { Link } from 'react-router-dom';

const MenuBar = () => {
  return (
      <div className="menu-bar">
        <Link to="/supervisor/dashboard" className="menu-link">Dash Board</Link>
        <Link to="/supervisor/calendar" className="menu-link">Calendar</Link>
      </div>
  );
};

export default MenuBar