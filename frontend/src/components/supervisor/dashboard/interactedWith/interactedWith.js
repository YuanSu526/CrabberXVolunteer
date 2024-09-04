import React, { useState } from 'react';
import './interactedWith.css';

const InteractedWith = ({ volunteerID }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sampleParkVisitors = [
    { phone: '555-1234', firstName: 'Alice', ageGroup: 'Adult' },
    { phone: '555-5678', firstName: 'Bob', ageGroup: 'Senior' },
    { phone: '555-9101', firstName: 'Charlie', ageGroup: 'Teen' },
    { phone: '555-1122', firstName: 'Diana', ageGroup: 'Child' },
    { phone: '555-3344', firstName: 'Eve', ageGroup: 'Adult' },
  ];

  const sampleCrabbers = [
    { phone: '555-1234', licenseNum: 1001 }, 
    { phone: '555-5678', licenseNum: 1002 }, 
    { phone: '555-9101', licenseNum: 1003 }, 
    { phone: '555-3344', licenseNum: 1004 },
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="interacted-with-container">
      <div className="toggle-text" onClick={toggleExpand}>
        Interacted with:
      </div>
      {isExpanded && (
        <div className="details">
          <h4>Park Visitors</h4>
          {sampleParkVisitors.map(visitor => (
            <p key={visitor.phone}>
              - {visitor.firstName} ({visitor.ageGroup}) - {visitor.phone}
            </p>
          ))}
          <h4>Crabbers</h4>
          {sampleCrabbers.map(crabber => (
            <p key={crabber.phone}>
              - License Number: {crabber.licenseNum} - {crabber.phone}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractedWith;
