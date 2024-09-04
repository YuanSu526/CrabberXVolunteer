import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import MenuBar from '../menuBar/menuBar'
import { useUser } from '../../user-context/user-context';


const localizer = momentLocalizer(moment);

// example shift
const sampleEvents = [
  {
    title: 'Shift at Kitslano',
    start: new Date(2024, 7, 12, 10, 0),
    end: new Date(2024, 7, 12, 12, 0),
  },
  {
    title: 'Shift at Wharf',
    start: new Date(2024, 7, 13, 8, 0),
    end: new Date(2024, 7, 13, 16, 0),
  },
  {
    title: 'Shift at Wharf',
    start: new Date(2024, 7, 14, 8, 0),
    end: new Date(2024, 7, 14, 16, 0),
  },
  {
    title: 'Shift at Wharf',
    start: new Date(2024, 6, 13, 8, 0),
    end: new Date(2024, 6, 13, 16, 0),
  },
  {
    title: 'Shift at Wharf',
    start: new Date(2024, 1, 13, 8, 0),
    end: new Date(2024, 1, 13, 16, 0),
  },
];

const VolunteerCalendar = () => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [selectedDate, setSelectedDate] = useState(null);
  const [dropdown1Value, setDropdown1Value] = useState('choice1');
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [events, setEvents] = useState([]);
  const [shifts, setShifts] = useState();
  const { userId } = useUser();

  useEffect(() => {

    const fetchShifts = async () => {

      try {

        const response = await fetch(`${apiUrl}/shifts`);
        const data = await response.json();

        if (data.success) {

          console.log(data.shifts);

          const fetchPositions = async (shift) => {

            try{

              const shiftDate = new Date(shift.SHIFT_DATE).toISOString().split('T')[0];
              console.log('Query shift date:', shiftDate);

              const positionsResponse = await fetch(
                `${apiUrl}/shifts/positions?shiftDate=${encodeURIComponent(shiftDate)}`
              );

              const positionsData = await positionsResponse.json();
  
              let positionsTitle = '';

              if (positionsData.success) {

                const positions = positionsData.positions.map(pos => pos.pos_location).join(', ');
                positionsTitle = `${positions}`;

              }

              return positionsTitle;

            } catch (err) {
              console.error('Error fetching positions:', err);
            }
          }

          const formattedShifts = await Promise.all(data.shifts.map(async (shift) => {
            
            const positionsTitle = await fetchPositions(shift);
            
            return {
              title: `Shift at ${positionsTitle || 'Unknown'}`, 
              start: new Date(`${shift.SHIFT_DATE}`), 
              end: new Date(`${shift.SHIFT_DATE}`),
              allDay: true,
            };
          }));
  
          console.log(formattedShifts);
  
          setEvents(formattedShifts);

        } else {
          console.error('Failed to fetch shifts:', data.message);
        }
      } catch (err) {
        console.error('Error fetching shifts:', err);
      }
    };

    fetchShifts();
  }, [apiUrl]);

  const handleRolesChange = async (e) => {

    const role = e.target.value;

    setSelectedRole(role);

  };

  const handleSelectSlot = async (slotInfo) => {

    const clickedDate = slotInfo.start;

    if (selectedDate && moment(selectedDate).isSame(clickedDate, 'day')) {
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }

    try{

      console.log('Query shift date 2:', moment(clickedDate).format('YYYY-MM-DD'));

      const positionsResponse = await fetch(
        `${apiUrl}/shifts/positions?shiftDate=${moment(clickedDate).format('YYYY-MM-DD')}`
      );

      const positionsData = await positionsResponse.json();

      if (positionsData.success) {

        const roles = positionsData.positions.map(pos => pos.position_name);
        setRoles(roles);

      } else {

        setRoles([]);

      }

    } catch (err) {
      console.error('Error fetching positions:', err);
      setRoles([]);
    }
  };

  const dayPropGetter = (date) => {

    const formattedDate = moment(date).format('YYYY-MM-DD');
    const isSelected = selectedDate && moment(selectedDate).format('YYYY-MM-DD') === formattedDate;

    return {

      style: {

        backgroundColor: isSelected ? '#d3e4f1' : undefined,

      },
    };
  };

  const handleSubmit = () => {
    console.log(`Dropdown 1: ${dropdown1Value}, Date: ${selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}`);
  };

  return (
    <div className="calendar-container">
      <MenuBar />
      <div className="calendar-content">
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            dayPropGetter={dayPropGetter}
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          />
        </div>
        <div className="side-container">
          <p>
          <span className="attribute-name">Role:</span>
          <select id="roles" onChange={handleRolesChange} value={selectedRole}>
              <option value="" disabled>Select a role</option>
              {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
              ))}
          </select>
          </p>
          <p>
          <span className="attribute-name">Date:</span>
          <span className="value">{selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : ''}</span>
          </p>
          <button className="action-button">Register</button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerCalendar;