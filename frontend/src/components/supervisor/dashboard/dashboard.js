import React, { useState } from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';

import MenuBar from '../menuBar/menuBar';
import InteractedWith from './interactedWith/interactedWith';

const SupervisorDashboard = () => {

  const sampleVolunteers = [
    { volunteerID: 1, firstName: 'Leyang', lastName: 'Pan', experience: 2},
    { volunteerID: 2, firstName: 'Binjie', lastName: 'Ye', experience: 1},
    { volunteerID: 3, firstName: 'Cheryl', lastName: 'Chen', experience: 100, },
    { volunteerID: 4, firstName: 'Jane', lastName: 'Doe', experience: 100, },
    { volunteerID: 5, firstName: 'Jane', lastName: 'Doe', experience: 100, },
    { volunteerID: 6, firstName: 'Jane', lastName: 'Doe', experience: 100, },
  ];

  const [volunteers, setVolunteers] = useState(sampleVolunteers);

  return (
    <div className="dashboard">
      <MenuBar></MenuBar>
      <div className="content">
        <div className="information-section">
          {/* display stats (e.g, volunteers working under them, # crabs studied, 
          total park visitors interacted with, # of crabbers worked with) */}
          <div className="info-card">
            <div className="scroll-container">
              <h3 className="sticky-title">Volunteer Info</h3>
              {volunteers.map(volunteer => (
                <div className="volunteer-box" key={volunteer.volunteerID}>
                  <p>{volunteer.firstName} {volunteer.lastName} | Experience: {volunteer.experience} years</p>
                  <p>Shifts registered: </p>
                  <p>Crabs logged: //Need to use SELECT count(CrabID) FROM Crabs, Volunteers</p>
                  <InteractedWith volunteerID={volunteer.volunteerID}/>
                </div>
              ))}
            </div>
          </div>
          <div className="info-card">
            <h3>General Info</h3>
            <p>Volunteers: </p>
            <p>Total shifts: </p>
            <p>Total crabs: </p>
            <p>Park visitors: </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;