import React, { useState } from 'react';
import './menuBar.css';
import { Link } from 'react-router-dom';

const MenuBar = () => {
  return (
      <div className="menu-bar">
        <Link to="/public/general-insight" className="menu-link">General</Link>
        <Link to="/public/crab-insight" className="menu-link">Crabs!!!</Link>
      </div>
  );
};

export default MenuBar