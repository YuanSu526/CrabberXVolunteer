import React, { useState } from 'react';
import './menuBar.css';
import { Link } from 'react-router-dom';

const MenuBar = () => {
  return (
      <div className="menu-bar">
        <Link to="/volunteer/dashboard" className="menu-link">Dash Board</Link>
        <Link to="/volunteer/calendar" className="menu-link">Calendar</Link>
        <Link to="/volunteer/dataUpload" className="menu-link">Upload</Link>
      </div>
  );
};

export default MenuBar