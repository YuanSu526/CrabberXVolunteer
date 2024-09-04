import React, { useState } from 'react';
import './dashboard.css';

import MenuBar from '../menuBar/menuBar'
import { useUser } from '../../user-context/user-context';

const VolunteerDashboard = () => {
  const [instructor, setInstructor] = useState('Jane');
  const [phone, setPhone] = useState('123 456 7890');
  const [nextShiftTime, setNextShiftTime] = useState('2024-08-12');
  const [role, setRole] = useState('Measurer');
  const [location, setLocation] = useState('Wharf');
  const [difficulty, setDifficulty] = useState('Hard (3)');
  const [lowTide, setLowTide] = useState('10:34:23');
  const [highTide, setHighTide] = useState('21:59:00');

  return (
    <div className="dashboard">
      <MenuBar></MenuBar>
      <div className="dashboard-content">
        <div className="information-section">
          <div className="info-card">
            <h3>Instructor</h3>
            <p><span className="attribute-name">Name:</span> <span className="value">{instructor}</span></p>
            <p><span className="attribute-name">Phone:</span> <span className="value">{phone}</span></p>
          </div>
          <div className="empty-space"></div>
          <div className="info-card">
            <h3>Next Shift</h3>
            <p><span className="attribute-name">Time:</span> <span className="value">{nextShiftTime}</span></p>
            <p><span className="attribute-name">Role:</span> <span className="value">{role}</span></p>
            <p><span className="attribute-name">Location:</span> <span className="value">{location}</span></p>
            <p><span className="attribute-name">Difficulty:</span> <span className="value">{difficulty}</span></p>
            <p><span className="attribute-name">Low Tide:</span> <span className="value">{lowTide}</span></p>
            <p><span className="attribute-name">High Tide:</span> <span className="value">{highTide}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;